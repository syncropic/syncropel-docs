#!/usr/bin/env python3
"""Every internal docs link resolves: the page exists, and a #anchor names a real heading on it.

    python3 tools/check-anchors.py [content/docs]

Exits 1 and lists each broken link. Heading slugs follow the site's own rule (lowercase,
punctuation dropped, spaces to hyphens), so a renamed heading breaks the build, not the reader.
"""
import glob
import re
import sys

root = sys.argv[1] if len(sys.argv) > 1 else "content/docs"


def slug(h):
    h = re.sub(r"`", "", h.strip())
    h = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", h)
    s = re.sub(r"[^\w\s-]", "", h.lower())
    return re.sub(r"\s", "-", s)


pages = {}
for f in glob.glob(root + "/**/*.mdx", recursive=True):
    rel = f[len(root):-4]
    rel = rel[:-6] if rel.endswith("/index") else rel
    text = open(f).read()
    pages["/docs" + rel] = (f, {slug(m) for m in re.findall(r"^#{1,6} +(.+?)\s*$", text, re.M)})

bad = []
for f, _ in pages.values():
    for m in re.finditer(r"\]\((/docs/[^)#\s]*)(#[^)\s]*)?\)", open(f).read()):
        page, anchor = m.group(1).rstrip("/"), m.group(2)
        if page not in pages:
            bad.append(f"{f}: no page {page}")
        elif anchor and anchor[1:] not in pages[page][1]:
            bad.append(f"{f}: no heading {page}{anchor}")

for b in bad:
    print(b)
print(f"check-anchors: {len(pages)} pages, {len(bad)} broken link(s)")
sys.exit(1 if bad else 0)
