#!/usr/bin/env python3
"""Fail when an em dash (U+2014) appears in the prose of the docs site.

House rule for docs.syncropel.com: no em dashes. Fenced code blocks are
skipped, since they quote tool output verbatim; inline code is skipped too.

Usage: python3 tools/check-no-emdash.py [content/docs]
Exit 0 clean, 2 when any prose line carries an em dash.
"""
import re
import sys
from pathlib import Path

EM = "—"
INLINE_CODE = re.compile(r"`[^`]*`")


def hits(path: Path):
    fence = None
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        s = line.lstrip()
        m = re.match(r"(```+|~~~+)", s)
        if m:
            if fence is None:
                fence = m.group(1)[:3]
            elif s.startswith(fence):
                fence = None
            continue
        if fence is not None:
            continue
        if EM in INLINE_CODE.sub("", line):
            yield n, line.strip()


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "content/docs")
    found = 0
    for p in sorted(root.rglob("*.md*")):
        for n, text in hits(p):
            found += 1
            print(f"{p}:{n}: {text[:120]}")
    if found:
        print(f"check-no-emdash: {found} prose line(s) with an em dash")
        return 2
    print("check-no-emdash: clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())
