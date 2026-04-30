# syncropel-docs

User-facing documentation site for **[docs.syncropel.com](https://docs.syncropel.com)**.

## What's in here

This repo holds the source for the Syncropel user documentation site — the docs that someone reads when they want to install, use, integrate with, or operate `spl`. The audience is end users, integrators, and operators.

Concretely:

- **Quickstart + Get Started** — install `spl`, initialize identity, start the daemon, pair a browser
- **Tutorials** — step-by-step walkthroughs (your first task, your first workspace, your first SDK integration, multi-namespace setup, etc.)
- **Concepts** — what records, threads, actors, trust, workspaces, catalog, federation, secrets, and the engine actually are
- **Guides** — task-oriented how-tos: task management, routing rules, CEL expressions, federation pair, inference queries, agent integration, and more
- **Cookbook** — short tested recipes for common operational shapes
- **Integrate** — connecting Syncropel to MCP-compatible AI clients and programmatic agent harnesses
- **Operate** — runbooks, doctor, backup, troubleshooting, fleet benchmarking
- **Reference** — CLI command reference, HTTP API reference, record format, glossary

The site lives at [docs.syncropel.com](https://docs.syncropel.com). Syncropel itself lives at [syncropel.com](https://syncropel.com).

Stack: Next.js + [Fumadocs](https://fumadocs.vercel.app) + MDX, deployed to Cloudflare Pages.

## Structure

```
content/docs/
  index.mdx       landing
  start/          quickstart
  get-started/    multi-page onboarding journey
  tutorials/      progressive teaching
  concepts/       subsystem explanations
  guides/         how-to references per subsystem
  cookbook/       short tested recipes with trade-off callouts
  templates/      workspace-template gallery
  integrate/      AI client + programmatic-agent integration
  operate/        runbook + day-2 operations
  reference/      canonical field-level pages (CLI, API, glossary)
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the voice + structure conventions, MDX quality bar, and the test/build flow.

## License

[Apache-2.0](./LICENSE)
