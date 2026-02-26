# Syncropel Docs

Documentation site for the Syncropel protocol and tools.

**Live**: [docs.syncropel.com](https://docs.syncropel.com)

## Structure

```
content/docs/
├── index.mdx              # Introduction
├── concepts/              # Core theory: effects, dial, governance, trust, hashes, namespaces, federation
├── tutorials/             # Quick start, core workflow
├── guides/                # Studio, local registry, agent integration, policy management
└── reference/             # CLI reference, frozen foundations, governance checks, glossary
```

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
```

Built with [Fumadocs](https://fumadocs.dev) (Next.js 16 + MDX).

## Deployment

Cloudflare Pages via GitHub Actions. Pushes to `main` auto-deploy.

## Related

- [syncropic.com](https://syncropic.com) — Corporate site
- [app.syncropel.com](https://app.syncropel.com) — Syncropel Studio
- [syncropel-cli](https://github.com/syncropic/syncropel-cli) — `spl` CLI
- [syncropel-core](https://github.com/syncropic/syncropel-core) — Rust verification engine
- [syncropel-registry](https://github.com/syncropic/syncropel-registry) — Production registry
