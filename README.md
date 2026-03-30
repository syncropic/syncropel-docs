# Syncropel Documentation

**[docs.syncropel.com](https://docs.syncropel.com)**

Infrastructure that learns and governs. A formal algebra for computation governance — closed primitives, deterministic validation. What isn't permitted can't execute. What is spent can't be spent again. Trust earned from evidence, not granted by policy or promises.

Like TLS for the web, Syncropel is invisible infrastructure: your agents run, Syncropel verifies.

## The Protocol

**Mathematics, not promises.**

Every computation decomposes into effect primitives (GET, PUT, CALL, MAP) and data shapes (VOID, ONE, OPTIONAL, MANY, KEYED). These are closed sets — immutable, hashable, verifiable. Any action, from a database query to a model inference, reduces to these atoms.

Governance is computed once into a Session Capability Token, then enforced at every action through a deterministic validation pipeline. Pure arithmetic and set membership. No runtime lookups, no ambiguity.

Hash levels strip detail progressively — Exact, Structural, Flow, Intent. Exact hashes never leave your namespace. The rest federate via consent edges. Share knowledge without revealing data.

The Dial governs a continuous spectrum from deterministic replay to creative generation, bounded by trust. Reliable behavior is rewarded with more autonomy. Unreliable behavior is constrained. Stale trust decays. All by mathematics.

## Concepts

| Topic | What You'll Learn |
|-------|------------------|
| [**The Effect Algebra**](https://docs.syncropel.com/docs/concepts/effects) | Primitives and shapes — the atomic vocabulary of all computation. Closed under composition. |
| [**The Dial**](https://docs.syncropel.com/docs/concepts/the-dial) | One parameter controlling the spectrum from deterministic replay to creative generation. |
| [**Governance**](https://docs.syncropel.com/docs/concepts/governance) | Session Capability Tokens and the deterministic governance validator. Computed once, enforced everywhere. |
| [**Trust**](https://docs.syncropel.com/docs/concepts/trust) | Mathematically computed confidence with cold-start prior and temporal decay. A statistic, not a feeling. |
| [**Hash Levels**](https://docs.syncropel.com/docs/concepts/hash-levels) | Privacy-preserving hashing from exact replay to intent matching. Share knowledge without revealing data. |
| [**Namespaces**](https://docs.syncropel.com/docs/concepts/namespaces) | Hierarchical governance that monotonically narrows. Children never have more permissions than parents. |
| [**Federation**](https://docs.syncropel.com/docs/concepts/federation) | Consent-gated evidence sharing across registries. CRDT counters, consent edges, hash-level access control. |
| [**Physics, Not Policy**](https://docs.syncropel.com/docs/concepts/physics-not-policy) | Why rules are enforced through mathematical structure, not human promises. |

## Guides

| Guide | Description |
|-------|------------|
| [**Quick Start**](https://docs.syncropel.com/docs/tutorials/quickstart) | Install spl, start your local registry, create your first governed namespace. |
| [**Core Workflow**](https://docs.syncropel.com/docs/tutorials/core-workflow) | End-to-end: namespaces, policies, observations, trust, audit trail. |
| [**Syncropel Studio**](https://docs.syncropel.com/docs/guides/studio) | The glass control room. Operate registries from the browser — traces, governance, patterns, federation. |
| [**Local Registry**](https://docs.syncropel.com/docs/guides/local-registry) | Deep dive into `spl serve` — storage, API, schema, persistence. Same API as production. |
| [**Agent Integration**](https://docs.syncropel.com/docs/guides/agent-integration) | Self-installing hooks for Claude Code, LangChain, CrewAI. Progressive discovery for AI agents. |
| [**Policy Management**](https://docs.syncropel.com/docs/guides/policy-management) | Capability envelopes, deny rules, budget constraints. Forbid-wins composition through the namespace hierarchy. |

## Reference

| Page | Contents |
|------|----------|
| [**CLI Reference**](https://docs.syncropel.com/docs/reference/cli) | Complete `spl` command reference — all command groups, environment variables, exit codes, output formats. |
| [**Governance Checks**](https://docs.syncropel.com/docs/reference/governance-checks) | The full validation pipeline — what each check validates, denial kinds, per-effect vs per-session scope. |
| [**Frozen Foundations**](https://docs.syncropel.com/docs/reference/frozen-foundations) | Immutable protocol constants. Closed sets. Any computation decomposes into these primitives. Any governance decision reduces to these foundations. |
| [**Glossary**](https://docs.syncropel.com/docs/reference/glossary) | Every term grounded in shipping code. |

## What Ships Today

| Product | Description |
|---------|------------|
| [**spl**](https://github.com/syncropic/syncropel-cli) | CLI + local registry. Full governance stack on your machine. Offline-first, persistent, production-compatible. |
| [**Studio**](https://syncropel.com) | Browser interface for operating registries. Traces, governance, namespaces, patterns, federation. |
| [**registry-core**](https://github.com/syncropic/syncropel-core) | Shared governance library. Zero dependencies. Same logic in CLI and production. |

Coming: federation sync, VFS gateway, global registry network.

## Related

- [syncropic.com](https://syncropic.com) — Syncropic, Inc. (Delaware Public Benefit Corporation)
- [syncropel.com](https://syncropel.com) — Syncropel Studio
- [registry.syncropel.com](https://registry.syncropel.com) — Production registry
- [GitHub](https://github.com/syncropic) — All repositories

---

*Content &copy; 2026 Syncropic, Inc. Built with [Fumadocs](https://fumadocs.dev).*
