# Changelog

All notable additions and revisions to docs.syncropel.com are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
