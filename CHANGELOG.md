# Changelog

All notable additions and revisions to docs.syncropel.com are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-08-29: The sandboxed transport and the task graph

- **[The sandboxed transport](/docs/operate/sandboxed-transport)**: new
  operate page: what a sandboxed work loop is, how to turn it on and off with
  one config record, the per-call kernel verdict and its layers, the
  admission ceiling, what changes on the machine, hosted instances, and how
  to verify it on your instance.
- **[Security model](/docs/operate/security-model)**: protection domains,
  the credential ordering, the three things a run cannot say about itself,
  declared tools bounding a defined actor; three rows in the threat table.
- **[Operator runbook](/docs/operate/runbook)**: the service-manager
  upgrade sequence, why a live copy is refused, the protected daemon
  process and `sudo -n readlink`, the transport rollback.
- **[Your first task](/docs/tutorials/first-task)**: `--parent`, `--fixes`
  and `--depends-on` write real edges; `--in-release` on done and approve;
  an unresolvable reference refuses with exit 2 and writes nothing.
- **[API reference](/docs/reference/api)** and **[Query guide](/docs/guides/query)**
: `limit` is clamped to 1000, `capped` is the only truthful partial-page
  signal, and `matched_total` must not be compared with the rows received.

## 2026-05-21 — Files in your instance (the in-Studio editor)

- **[Working with files in your instance](/docs/guides/files-in-studio)** —
  new guide covering the Files tab in a browser: the tree + viewer layout,
  per-kind rendering (markdown, code, JSON, CSV, image, PDF, plain text),
  the inline editor with autosave + manual save + status indicator, right-
  click context actions (New file / New folder / Rename / Delete),
  drag-and-drop upload from your computer, drag-to-move inside the tree,
  recovering unsaved changes after a crash, the conflict banner when
  another writer touches the file under you, quick find with `⌘K`,
  attaching files to chat messages with `@files`, agent-recent decorations,
  and the mobile experience.
- **[Files concept](/docs/concepts/files)** updated. The "Using your
  files" section now describes the Files tab as a full editor (not just a
  browser), and the "What's next" list links to both the command-line
  and browser walkthroughs.
- **[Working with files (command line)](/docs/guides/filesystem)** —
  the "In the browser" section now pulls users into the new guide
  instead of mentioning the Files tab in a single line.

## 2026-05-18 — Filesystem documentation

- **[Files](/docs/concepts/files)** — new concept page. Every instance has a filesystem with four areas: `/files` (working files), `/artifacts` (published, immutable files), `/mnt` (connected drives), and `/threads` (files derived from threads). Covers the working-file → published-artifact lifecycle.
- **[Working with files](/docs/guides/filesystem)** — new guide. A hands-on `spl fs` walkthrough: browse, upload, inspect, organize, publish, and connected drives — with JSON output for scripting and the Files tab for the browser.
- **[CLI reference → Files](/docs/reference/cli#files)** — new `spl fs` section: `ls`, `stat`, `cat`, `cp`, `mkdir`, `mv`, `rm`, `publish`, `mounts`.
- Both new pages added to the published nav (Concepts, Guides). Closes the documentation gap for the instance filesystem shipped in `spl` v0.44.0.

## 2026-05-12 — Web Summit trim

- **Trimmed published surface from 118 pages to 35 pages.** Power-user content (advanced tutorials, federation deep-dives, cookbook, governance, ops sub-pages) stays in the repo as `.mdx` source but is nav-hidden via `meta.json` and URL-redirected to the canonical KEEP-set page via `public/_redirects` (Cloudflare Workers Static Assets).
- **Top-level nav reduced to 8 sections**: Quickstart, Get Started, Tutorials, Concepts, Guides, Integrate, Operate, Reference. Templates + Cookbook sections collapsed.
- **Sitemap filtered** to KEEP-only URLs (36 entries = 1 home + 35 KEEP) so search engines don't index pages that 301 to a different canonical target.
- **Customer-instance URL examples migrated** to `.syncropel.app` on the one residual page (`docs/index.mdx:8`); platform/graph/api/provision/etc. foundational URLs stay on `.com`.
- **Jargon sweep on visitor-path pages**: customer-facing prose now uses "instance" / "Syncropel" / "runtime" instead of "daemon" / "kernel" / "substrate" where the term was descriptive (CLI flag literals like `spl serve --daemon` and PID-file path references retained as real artifact names). Reference + operate pages keep technical vocabulary where appropriate for the audience.
- **Vocabulary linter extended** with internal-reference patterns (`SKL-`, `ADR-`, `FU-`, `Tier α/β/γ`, `Wave N`, "steward equivalence doctrine") so accidental re-introduction in future PRs is flagged.

## Recent additions

- **[Catalog](/docs/concepts/catalog)** — concept page explaining the catalog as a curated discovery surface above the registry, below federation.
- **[Pair two stewards in one command](/docs/guides/federation-pair)** — guide for `spl federation pair`: discovery, handshake, reciprocal token issuance, lifecycle commands, cross-namespace consent, sync-mode + thread filtering, auto-approval, troubleshooting.
- **[Templates Gallery](/docs/templates)** — seven worked workspace examples (`tracker`, `multi-page`, `newsletter`, `course`, `recipe-collection`, `solo-tracker`, `catalog`), each with what-when-why and a scaffold command.
- **Tutorial: [Build your first workspace in 10 minutes](/docs/tutorials/first-workspace)** — `spl workspace init` → edit → test → publish (draft + release) → share with a friend, using the `recipe-collection` template.
- **[Workspace lifecycle](/docs/operate/workspace/lifecycle)** — draft / published / archived, the transition matrix, and how versioning, re-publish, and migration interact.
- **[Sharing for bug repro](/docs/operate/workspace/sharing)** — `spl share` end-to-end: bundle, consent envelope, time-bounded access, recipient replay flow.
