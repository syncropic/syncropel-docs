# syncropel-docs

**[docs.syncropel.com](https://docs.syncropel.com)**

Documentation for the Syncropel protocol — infrastructure that learns, governs, and coordinates.

## Structure

```
content/docs/
  index.mdx                — What is Syncropel
  getting-started/         — Quickstart, first task, first agent
  guides/                  — Director loop, triggers, worktrees, evaluation gate
  operations/              — Deployment, team setup, monitoring, data safety
  reference/               — CLI, API, config, glossary
  runbooks/                — Executable recipes (Director setup, new actor, backup)
```

## Related Repos

| Repo | Role |
|---|---|
| [syncropel-spec](https://github.com/syncropic/syncropel-spec) | Protocol specification (WHAT) — 132 files, 18 sections |
| [syncropel-core](https://github.com/syncropic/syncropel-core) | Rust implementation (HOW) — 7 crates, 458 tests |
| [syncropel-docs](https://github.com/syncropic/syncropel-docs) | User documentation (HOW TO) — this repo |
| [syncropel-web](https://github.com/syncropic/syncropel-web) | Web UI at syncropel.com |

## Development

```bash
npm install
npm run dev    # http://localhost:3000
```

## Legacy

The Python-proxy-era docs are preserved on the `legacy/python-proxy-era` branch.
