#!/usr/bin/env python3
"""
Documented-command smoke.

Extracts every `spl ...` command from fenced code blocks under
content/docs/get-started/ and checks it against the `spl` on PATH:

    - every subcommand in the path exists (`spl <path> --help` succeeds);
    - every `--flag` (and `-x` short flag) used appears in that help text.

Nothing is executed except `--help`.

Usage:
    tools/check-doc-commands.py [ROOT ...]   (default: content/docs/get-started)

Exit codes:
    0  every command checks out, or no `spl` binary was found (SKIPPED)
    1  at least one unknown subcommand or flag
"""

from __future__ import annotations

import os
import re
import shlex
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

DEFAULT_ROOTS = ["content/docs/get-started"]

# Words that may precede `spl` on a command line and are not part of it.
PREFIX_WORDS = {"sudo", "exec", "time", "nohup", "env"}

# Tokens that end one shell command.
COMMAND_SEPARATORS = {"|", "||", "&&", ";", "&", ">", ">>", "<", "(", ")"}

ENV_ASSIGNMENT_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=")
PLACEHOLDER_RE = re.compile(r"<[^<>\n]*>")
SUBSHELL_RE = re.compile(r"\$\([^()]*\)")
SHORT_FLAG_RE = re.compile(r"^-[A-Za-z]$")
VERSION_OUTPUT_RE = re.compile(r"^[0-9]+\.[0-9A-Za-z]+")


@dataclass
class Command:
    path: Path
    line_no: int
    text: str
    tokens: list[str]


@dataclass
class Finding:
    command: Command
    problem: str


# ----- Extraction -----------------------------------------------------------


def fenced_lines(path: Path) -> list[tuple[int, str]]:
    """Return (line number, logical line) for lines inside fenced blocks.

    Lines ending in a backslash are joined with the next line; the line
    number is the first physical line of the joined command.
    """
    out: list[tuple[int, str]] = []
    in_fence = False
    pending: str | None = None
    pending_no = 0
    for no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        stripped = raw.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_fence = not in_fence
            pending = None
            continue
        if not in_fence:
            continue
        if pending is not None:
            line = pending + " " + stripped
        else:
            line = stripped
            pending_no = no
        if line.endswith("\\"):
            pending = line[:-1].rstrip()
            continue
        pending = None
        out.append((pending_no, line))
    return out


def split_commands(line: str) -> list[list[str]]:
    """Split a shell line into the token lists of its `spl` commands."""
    line = re.sub(r"^\s*(?:\$|PS>|>)\s+", "", line)
    line = SUBSHELL_RE.sub("SUBSHELL", line)
    line = PLACEHOLDER_RE.sub("PLACEHOLDER", line)
    lexer = shlex.shlex(line, posix=True, punctuation_chars=True)
    lexer.commenters = "#"
    lexer.whitespace_split = True
    try:
        tokens = list(lexer)
    except ValueError:
        return []

    segments: list[list[str]] = [[]]
    for tok in tokens:
        if tok in COMMAND_SEPARATORS or set(tok) <= set("|&;<>()"):
            segments.append([])
        else:
            segments[-1].append(tok)

    commands: list[list[str]] = []
    for seg in segments:
        i = 0
        while i < len(seg) and (
            ENV_ASSIGNMENT_RE.match(seg[i]) or seg[i] in PREFIX_WORDS
        ):
            i += 1
        if i < len(seg) and seg[i] == "spl":
            args = [t.strip("[]") for t in seg[i + 1:]]
            args = [t for t in args if t and t != "..."]
            # `spl 0.238.0` is version OUTPUT shown in a block, not a command.
            if args and VERSION_OUTPUT_RE.match(args[0]):
                continue
            commands.append(args)
    return commands


def extract(roots: list[Path]) -> list[Command]:
    commands: list[Command] = []
    for root in roots:
        files = [root] if root.is_file() else sorted(root.rglob("*.md*"))
        for path in files:
            for no, line in fenced_lines(path):
                for tokens in split_commands(line):
                    commands.append(Command(path, no, line, tokens))
    return commands


# ----- Checking against the binary ------------------------------------------


class Binary:
    def __init__(self, exe: str) -> None:
        self.exe = exe
        self._help: dict[tuple[str, ...], str | None] = {}
        self.env = dict(os.environ, SPL_AUTO_START="0", NO_COLOR="1")

    def help(self, path: tuple[str, ...]) -> str | None:
        """Help text for a subcommand path, or None when it does not exist."""
        if path not in self._help:
            try:
                res = subprocess.run(
                    [self.exe, *path, "--help"],
                    capture_output=True,
                    text=True,
                    timeout=20,
                    env=self.env,
                )
                ok = res.returncode == 0
                self._help[path] = res.stdout if ok else None
            except (OSError, subprocess.TimeoutExpired):
                self._help[path] = None
        return self._help[path]


def listed_subcommands(help_text: str) -> set[str]:
    names: set[str] = set()
    in_commands = False
    for line in help_text.splitlines():
        if line.startswith("Commands:"):
            in_commands = True
            continue
        if in_commands:
            if not line.strip():
                break
            m = re.match(r"^\s{2}(\S+)", line)
            if m:
                names.add(m.group(1))
    return names


def requires_subcommand(help_text: str) -> bool:
    return bool(re.search(r"^Usage:.*<COMMAND>", help_text, re.MULTILINE))


def option_takes_value(help_text: str, flag: str) -> bool:
    pattern = r"(?<![\w-])" + re.escape(flag) + r"(?:[ =]<|,\s*--[\w-]+ <)"
    return bool(re.search(pattern, help_text))


def flag_documented(help_text: str, flag: str) -> bool:
    pattern = r"(?<![\w-])" + re.escape(flag) + r"(?![\w-])"
    return bool(re.search(pattern, help_text))


def check(binary: Binary, cmd: Command) -> list[str]:
    problems: list[str] = []
    path: tuple[str, ...] = ()
    node_help = binary.help(path)
    if node_help is None:
        return ["`spl --help` failed"]

    i = 0
    tokens = cmd.tokens
    descending = True
    while i < len(tokens):
        tok = tokens[i]
        if tok == "--":
            break
        if tok.startswith("-") and tok != "-":
            flag = tok.split("=", 1)[0]
            if flag.startswith("--") or SHORT_FLAG_RE.match(flag):
                if not flag_documented(node_help, flag):
                    shown = " ".join(("spl", *path))
                    problems.append(f"unknown flag {flag} for `{shown}`")
                elif "=" not in tok and option_takes_value(node_help, flag):
                    i += 1
            i += 1
            continue
        if descending and listed_subcommands(node_help):
            if tok in listed_subcommands(node_help):
                path = (*path, tok)
            elif requires_subcommand(node_help) and binary.help((*path, tok)):
                path = (*path, tok)  # a hidden alias clap accepts
            elif requires_subcommand(node_help):
                shown = " ".join(("spl", *path))
                problems.append(f"unknown subcommand `{tok}` under `{shown}`")
                return problems
            else:
                descending = False
                i += 1
                continue
            node_help = binary.help(path)
            if node_help is None:
                problems.append(f"`spl {' '.join(path)} --help` failed")
                return problems
        else:
            descending = False
        i += 1
    return problems


def main(argv: list[str]) -> int:
    roots = [Path(p) for p in (argv or DEFAULT_ROOTS)]
    exe = shutil.which("spl")
    if exe is None:
        print("check-doc-commands: SKIPPED (no `spl` binary on PATH)")
        return 0
    version = subprocess.run(
        [exe, "--version"], capture_output=True, text=True,
        env=dict(os.environ, SPL_AUTO_START="0"),
    ).stdout.strip()
    print(f"check-doc-commands: using {exe} ({version or 'version unknown'})")

    binary = Binary(exe)
    commands = extract(roots)
    findings: list[Finding] = []
    for cmd in commands:
        for problem in check(binary, cmd):
            findings.append(Finding(cmd, problem))

    for f in findings:
        print(f"{f.command.path}:{f.command.line_no}: {f.problem}")
        print(f"    spl {' '.join(f.command.tokens)}")
    print(
        f"check-doc-commands: {len(commands)} commands checked, "
        f"{len(findings)} finding(s)"
    )
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
