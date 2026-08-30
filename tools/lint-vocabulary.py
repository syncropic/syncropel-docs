#!/usr/bin/env python3
"""
Vocabulary linter.

Locks the canonical product vocabulary across docs by flagging retired
terms and internal references in prose. Skips code and provenance paths.

Usage:
    tools/lint-vocabulary.py [--mode warn|error] [--fix] [PATH ...]

Exit codes:
    0 — clean
    1 — internal error
    2 — hits found (error mode, the default; --mode warn exits 0)

Outputs:
    - Inline GitHub annotations (`::warning::` / `::error::`) on stdout
    - PR-comment summary on stderr (single block, suitable for `gh pr comment`)
    - Optional unified diff on stdout when `--fix` is set (apply via `git apply`)
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

# ----- Configuration --------------------------------------------------------

# Retired terms. Match standalone word; case-sensitive.
RETIRED_TERMS = {
    "Lens": "Studio",
    "Console": "Studio",
}

# Internal-reference patterns. These should never appear in customer-facing docs.
# Pattern → suggestion. Uses regex; matched against link-stripped, code-stripped lines.
INTERNAL_PATTERNS = {
    r"\bSKL-\d+\b": "(internal task reference — describe behaviour instead)",
    r"\bADR-\d+\b": "(internal ADR reference — describe behaviour instead)",
    r"\bFU-\d+\b": "(internal follow-up reference — describe behaviour instead)",
    r"\bTier [αβγ]\b": "(internal phase reference — describe behaviour instead)",
    r"\bWave [0-9]+\b": "(internal phase reference — describe behaviour instead)",
    r"\bsteward equivalence doctrine\b": "(internal vocabulary — say 'hosted and self-hosted are equivalent' or similar)",
    r"\bcargo\b": "(build tooling — a reader holds a binary, not a build)",
    r"sqlite3": "(store internals — describe behaviour instead)",
    r"hub\.db": "(store internals — say 'the record store')",
    r"spl_(dev|prod)_": "(token-shaped literal — use '<your token>')",
    r"SPL_BOOTSTRAP_TOKEN": "(provisioning internals — not user-facing)",
    r"syncropel-research": "(private repository name)",
    r"syncropel-core": "(private repository name)",
    r"\bFly\b": "(infrastructure name — say 'the hosted platform')",
    r"flycast": "(infrastructure name)",
    r"wrangler": "(infrastructure tooling)",
    r"roadmap": "(no dated or future promises in public docs)",
    r"open[- ]source (kernel|runtime|binar)": "(the runtime is not open source; the spec and SDKs are)",
}

# Path globs that are EXEMPT (provenance, history, changelog, research).
# Patterns are checked against the path RELATIVE to the repo root.
PATH_WHITELIST = [
    # Changelogs and release notes are auditable history.
    "CHANGELOG.md",
    "CHANGELOG.mdx",
    "**/CHANGELOG.md",
    "**/CHANGELOG.mdx",
    "**/release-notes-*.md",
    "**/release-notes-*.mdx",
    "**/release-notes/**",
    # Research provenance: docs/ui (audit + synthesis) and adjacent corners.
    "docs/ui/**",
    "docs/research/**",
    "docs/research-papers/**",
    "docs/sessions/**",
    "docs/dispatch-hardening/**",
    "docs/v0.20-plan/**",
    "docs/v0.19-plan/**",
    "docs/marketing/**",
    "docs/frontend/**",
    "docs/architecture/**",
    "docs/design/**",
    "docs/deployment/**",
    "docs/infrastructure/**",
    # UI-UX-spec provenance corner.
    "16-experience-vision/**",
    # Glossaries may cite a retired name in a deprecation entry.
    "**/07-glossary.md",
    "**/01-glossary.md",
    "14-reference/01-glossary.md",
    "09-content/07-glossary.md",
    # Pages removed from the site, kept for the record and never served.
    "internal-removed/**",
    # Docs site: built artefacts.
    "out/**",
    "**/out/**",
    "node_modules/**",
    "**/node_modules/**",
    ".next/**",
    "**/.next/**",
    # The linter itself must mention the term.
    "tools/lint-vocabulary.py",
    "tools/lint_vocabulary_test.sh",
    "**/lint-vocabulary.yml",
    # Decisions / ADRs referencing prior names as provenance.
    "**/15-decisions/**",
    # Linter contract doc.
    "docs/ui/32-skl-production-grade-addendum-2026-04-24.md",
]

# File extensions in scope.
SCAN_EXTS = {".md", ".mdx", ".ts", ".tsx", ".js", ".jsx"}

# Inline-disable markers. Recognised in HTML/Markdown comments AND
# JSX/MDX comments (`{/* ... */}`) AND JS/TS line comments (`//` and `/* */`).
DISABLE_FILE_RE = re.compile(
    r"(?:<!--|/\*|\{/\*|//)\s*vocab-lint-disable-file\s*(?:-->|\*/|\*/\})?"
)
DISABLE_LINE_RE = re.compile(
    r"(?:<!--|/\*|\{/\*|//)\s*vocab-lint-disable-next-line"
)

# Match the retired term as a standalone word.
TERM_RE = re.compile(r"\b(" + "|".join(re.escape(t) for t in RETIRED_TERMS) + r")\b")

# Compile internal-reference patterns. Iterated separately from RETIRED_TERMS
# because the keys are already regex (not literal strings).
INTERNAL_PATTERN_RES = [(re.compile(p), s) for p, s in INTERNAL_PATTERNS.items()]

# YAML frontmatter keys that legitimately quote prior names.
FRONTMATTER_PROVENANCE_KEYS = (
    "previously_named",
    "provenance",
    "former_name",
    "deprecated_name",
)


# ----- Data classes ---------------------------------------------------------


@dataclass
class Hit:
    path: Path
    line_no: int
    col: int
    term: str
    suggestion: str
    line_text: str


@dataclass
class Report:
    hits: list[Hit] = field(default_factory=list)
    files_scanned: int = 0
    files_skipped: int = 0


# ----- Path matching --------------------------------------------------------


def _matches_glob(path: str, pattern: str) -> bool:
    """Match a posix path against a `**/...` glob."""
    import fnmatch

    if pattern.startswith("**/"):
        return fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(
            path, pattern[3:]
        ) or any(
            fnmatch.fnmatch(path, "*/" + pattern[3:].replace("/**", "/*"))
            for _ in [0]
        )
    return fnmatch.fnmatch(path, pattern)


def is_path_whitelisted(rel_path: str, extra: list[str] | None = None) -> bool:
    """Check rel_path against PATH_WHITELIST + repo-supplied extras."""
    import fnmatch

    candidates = list(PATH_WHITELIST) + (extra or [])
    for pat in candidates:
        if fnmatch.fnmatch(rel_path, pat):
            return True
        # Walk: also match if any ancestor segment matches `**/<seg>`.
        if pat.startswith("**/"):
            tail = pat[3:]
            parts = rel_path.split("/")
            for i in range(len(parts)):
                if fnmatch.fnmatch("/".join(parts[i:]), tail):
                    return True
    return False


def load_repo_ignore_file(cwd: Path) -> list[str]:
    """Read .vocab-lint-ignore (one path-glob per line; '#' = comment)."""
    candidate = cwd / ".vocab-lint-ignore"
    if not candidate.is_file():
        return []
    try:
        text = candidate.read_text(encoding="utf-8")
    except OSError:
        return []
    out: list[str] = []
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        out.append(s)
    return out


# ----- Line-level filtering -------------------------------------------------


def _strip_inline_code(line: str) -> str:
    """Replace inline-code spans `...` with placeholders so they don't match."""
    return re.sub(r"`[^`\n]*`", lambda m: " " * len(m.group(0)), line)


def _strip_link_targets(line: str) -> str:
    """Replace Markdown link/image targets `(...)` with spaces.

    Keeps link TEXT visible (which legitimately may quote a prior name)
    AND skips the target URL where the term may appear in a slug.
    """
    return re.sub(
        r"(\]\()([^)\n]*)(\))",
        lambda m: m.group(1) + (" " * len(m.group(2))) + m.group(3),
        line,
    )


def _is_frontmatter_provenance_line(line: str) -> bool:
    stripped = line.lstrip()
    for key in FRONTMATTER_PROVENANCE_KEYS:
        if stripped.startswith(f"{key}:") or stripped.startswith(f"- {key}:"):
            return True
    return False


# ----- Scanner --------------------------------------------------------------


def scan_file(path: Path, rel_path: str) -> list[Hit]:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []

    if DISABLE_FILE_RE.search(text):
        return []

    hits: list[Hit] = []
    in_code_fence = False
    in_frontmatter = False
    prev_disable = False
    is_md = path.suffix in {".md", ".mdx"}

    lines = text.splitlines()
    for idx, raw_line in enumerate(lines, start=1):
        stripped = raw_line.lstrip()

        # Markdown code fences.
        if is_md and stripped.startswith("```"):
            in_code_fence = not in_code_fence
            prev_disable = False
            continue
        if in_code_fence:
            prev_disable = False
            continue

        # YAML frontmatter (between leading `---` lines on .md files).
        if is_md and stripped == "---":
            if idx == 1:
                in_frontmatter = True
            elif in_frontmatter:
                in_frontmatter = False
                prev_disable = False
                continue
        if in_frontmatter:
            if _is_frontmatter_provenance_line(raw_line):
                prev_disable = False
                continue
            # Other frontmatter lines: still scan (prose-y).
            # fall through

        # Per-line escape hatch: previous line had `<!-- vocab-lint-disable-next-line -->`.
        if DISABLE_LINE_RE.search(raw_line):
            prev_disable = True
            continue

        if prev_disable:
            prev_disable = False
            continue

        # Strip inline code + link targets before matching.
        line_for_match = _strip_inline_code(raw_line)
        if is_md:
            line_for_match = _strip_link_targets(line_for_match)

        for m in TERM_RE.finditer(line_for_match):
            term = m.group(1)
            hits.append(
                Hit(
                    path=path,
                    line_no=idx,
                    col=m.start() + 1,
                    term=term,
                    suggestion=RETIRED_TERMS[term],
                    line_text=raw_line.rstrip(),
                )
            )

        for pat_re, suggestion in INTERNAL_PATTERN_RES:
            for m in pat_re.finditer(line_for_match):
                hits.append(
                    Hit(
                        path=path,
                        line_no=idx,
                        col=m.start() + 1,
                        term=m.group(0),
                        suggestion=suggestion,
                        line_text=raw_line.rstrip(),
                    )
                )

    return hits


def iter_target_files(roots: list[Path]) -> list[tuple[Path, str]]:
    out: list[tuple[Path, str]] = []
    cwd = Path.cwd().resolve()
    for root in roots:
        root = root.resolve()
        if root.is_file() and root.suffix in SCAN_EXTS:
            try:
                rel = root.relative_to(cwd).as_posix()
            except ValueError:
                rel = root.name
            out.append((root, rel))
            continue
        if not root.is_dir():
            continue
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix not in SCAN_EXTS:
                continue
            try:
                rel = path.relative_to(cwd).as_posix()
            except ValueError:
                rel = path.name
            out.append((path, rel))
    return out


# ----- Output ---------------------------------------------------------------


def print_gh_annotations(hits: list[Hit], mode: str) -> None:
    level = "error" if mode == "error" else "warning"
    for h in hits:
        msg = (
            f"Disallowed term {h.term!r} found; replace with "
            f"{h.suggestion!r}. Suppress with "
            "`<!-- vocab-lint-disable-next-line -->` if intentional."
        )
        print(
            f"::{level} file={h.path},line={h.line_no},col={h.col}::{msg}",
            flush=True,
        )


def print_summary(report: Report, mode: str, repo: str) -> None:
    if not report.hits:
        sys.stderr.write(
            f"vocab-lint: clean ({report.files_scanned} files scanned, "
            f"{report.files_skipped} whitelisted)\n"
        )
        return

    out: list[str] = []
    out.append(f"### Vocabulary lint ({mode}-mode) — {len(report.hits)} hit(s)")
    out.append("")
    out.append("Disallowed vocabulary detected. Replace as suggested below.")
    out.append("")
    out.append("| File | Line | Term | Suggested |")
    out.append("|------|-----:|------|-----------|")
    for h in report.hits[:50]:
        out.append(
            f"| `{h.path}` | {h.line_no} | `{h.term}` | `{h.suggestion}` |"
        )
    if len(report.hits) > 50:
        out.append(f"| … | … | … | (+{len(report.hits) - 50} more) |")
    out.append("")
    out.append("**Fix locally:**")
    out.append("```bash")
    out.append(f"# In {repo}:")
    out.append("make lint-vocabulary-fix    # auto-apply suggested replacements")
    out.append("# OR for fine-grained control:")
    out.append("python tools/lint-vocabulary.py --fix . | git apply")
    out.append("```")
    out.append("")
    out.append(
        "**Intentional citation?** Add "
        "`<!-- vocab-lint-disable-next-line -->` on the line before, or "
        "`<!-- vocab-lint-disable-file -->` at the top of the file."
    )
    sys.stderr.write("\n".join(out) + "\n")


def print_diff(hits: list[Hit]) -> None:
    """Print a unified diff: replace retired term in-place per hit line.

    Paths are emitted RELATIVE to cwd so `git apply -p1 -` works.
    """
    cwd = Path.cwd().resolve()
    by_file: dict[Path, list[Hit]] = {}
    for h in hits:
        by_file.setdefault(h.path, []).append(h)

    for path, file_hits in by_file.items():
        try:
            old_text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        new_lines = old_text.splitlines()
        seen_lines: dict[int, str] = {}
        for h in file_hits:
            if h.term not in RETIRED_TERMS:
                continue
            line = seen_lines.get(h.line_no, new_lines[h.line_no - 1])
            replaced = re.sub(
                r"\b" + re.escape(h.term) + r"\b", h.suggestion, line
            )
            seen_lines[h.line_no] = replaced
        for line_no, replaced in seen_lines.items():
            new_lines[line_no - 1] = replaced
        new_text = "\n".join(new_lines)
        if old_text.endswith("\n"):
            new_text += "\n"

        try:
            rel = path.resolve().relative_to(cwd).as_posix()
        except ValueError:
            rel = path.name

        import difflib

        diff = difflib.unified_diff(
            old_text.splitlines(keepends=True),
            new_text.splitlines(keepends=True),
            fromfile=f"a/{rel}",
            tofile=f"b/{rel}",
        )
        sys.stdout.writelines(diff)


# ----- CLI ------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Syncropel vocabulary linter"
    )
    parser.add_argument(
        "paths",
        nargs="*",
        default=["."],
        help="Files or directories to scan (default: '.')",
    )
    parser.add_argument(
        "--mode",
        choices=["warn", "error"],
        default=os.environ.get("VOCAB_LINT_MODE", "error"),
        help="error (default) = exit 2 on hits; warn = exit 0",
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Print a unified diff with suggested replacements",
    )
    parser.add_argument(
        "--repo",
        default=os.environ.get("VOCAB_LINT_REPO", "this repo"),
        help="Repo name (used in PR-summary fix command)",
    )
    parser.add_argument(
        "--extra-whitelist",
        action="append",
        default=[],
        help="Extra path-glob to whitelist (repeatable)",
    )

    ns = parser.parse_args(argv)

    roots = [Path(p) for p in ns.paths]
    targets = iter_target_files(roots)

    cwd = Path.cwd().resolve()
    extras = list(ns.extra_whitelist) + load_repo_ignore_file(cwd)

    report = Report()
    for path, rel in targets:
        if is_path_whitelisted(rel, extras):
            report.files_skipped += 1
            continue
        report.files_scanned += 1
        report.hits.extend(scan_file(path, rel))

    if ns.fix:
        print_diff(report.hits)
        return 0

    print_gh_annotations(report.hits, ns.mode)
    print_summary(report, ns.mode, ns.repo)

    if not report.hits:
        return 0
    if ns.mode == "warn":
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
