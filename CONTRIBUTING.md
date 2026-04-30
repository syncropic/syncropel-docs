# Contributing to syncropel-docs

Thanks for considering a contribution. This is the source for [docs.syncropel.com](https://docs.syncropel.com), a Next.js + [Fumadocs](https://fumadocs.vercel.app) site rendering MDX from `content/docs/`.

## Repo layout

```
content/docs/
├── index.mdx              landing
├── meta.json              top-level nav order
├── start/                 quickstart
├── tutorials/             progressive teaching
├── concepts/              subsystem explanations
├── guides/                how-to references
├── cookbook/              short tested recipes with trade-off callouts
├── integrate/             integration tutorials
├── operate/               deployment + runbook pages
└── reference/             canonical field-level pages (CLI, API, schemas, glossary)
```

Each directory has a `meta.json` describing page order and optional section dividers (`---Heading---`). Dividers are not pages; they group siblings visually in the sidebar. Subdirectories are referenced by name in the parent `meta.json`; the subdir's own `meta.json` defines internal order.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # produces .next / out
npm run lint
```

## MDX quality bar

A few conventions worth following:

- **No `{"..."}` JSX inline in prose.** MDX parses `{` as a JSX expression and chokes on nested quotes. Use plain text or `{/* comment */}` for TODOs.
- **Shiki code blocks only in bundled languages.** `bash`, `json`, `text`, `yaml`, `toml`, `ini`, `typescript`/`ts`, `python`/`py`. Other languages may build clean locally but fail on deploy.
- **Test the build before opening a PR.** `npm run build`. The deploy workflow runs only on tag push and pushes to main, so a bad MDX may surface only at deploy time.

## Voice + structure

- Second person, present tense, direct. No marketing superlatives.
- Open with a problem statement or overview, not a feature list.
- Prefer internal links with a reason phrase: `[Engine — routing cascade](/docs/concepts/engine#routing-cascade)` beats `here`.
- Every page ends with `## See also` — three to five links, each with a short "why you'd click this" note.

### Guide structure

```
---
title: <Name>
description: <one-sentence who-this-is-for + what-it-enables>
---

## Overview
<2-3 paragraphs framing>

## Quick Start
<smallest runnable example>

## <Feature 1>
## <Feature 2>
...

## Common gotchas
## When NOT to use this
## See also
```

### Cookbook structure

```
---
title: <Short imperative>
description: <The trade-off in one sentence>
---

## Problem
<one paragraph, named-user framing>

## Recipe
<terse prose + runnable bash / JSON block>

## The trade-off
<one frank paragraph — what this breaks or loses>

## See also
- Two or three links
```

Cookbook recipes stay short on purpose. If a recipe needs more than ~300 lines, it probably belongs in a guide.

### Reference structure

Tabular. Every field, every type, every default. One paragraph of context at the top, then dive into tables. No prose-heavy sections.

## Vocabulary linter

A small Python linter (`tools/lint-vocabulary.py`) flags retired terms in new prose. Run before submitting:

```bash
make lint-vocabulary       # warn-mode (same as CI)
make lint-vocabulary-fix   # auto-apply suggested replacements
```

The linter runs in CI in warn-mode on PRs and posts a summary comment when there are hits.

## Deploy

Cloudflare Pages. Push to `main` triggers an auto-deploy via GitHub Actions; tag push triggers production deploy to `docs.syncropel.com`.

## Reporting issues

Open an issue on this repo with reproduction steps + the page URL. For documentation gaps, a short description of what you tried to learn and where you got stuck is plenty.
