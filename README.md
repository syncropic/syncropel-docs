# Syncropel Documentation

**[docs.syncropel.com](https://docs.syncropel.com)**

Documentation for the Syncropel protocol — verification infrastructure for AI computation. A formal algebra and governance system that any AI agent can embed to become trustworthy.

## The Protocol in 30 Seconds

Syncropel reduces all computation to **4 primitives** (GET, PUT, CALL, MAP) and **5 data shapes** (VOID, ONE, OPTIONAL, MANY, KEYED). Every action an AI agent takes decomposes into these atoms. A **10-check governance validator** enforces constraints at execution time through pure arithmetic — no rule evaluation, no ambiguity.

Trust is a statistic, not a feeling. Governance is physics, not policy.

## Core Concepts

| Concept | What It Is |
|---------|-----------|
| [**Effect Algebra**](https://docs.syncropel.com/docs/concepts/effects) | 4 primitives + 5 shapes = closed algebra under composition. Every computation decomposes into these atoms. |
| [**The Dial**](https://docs.syncropel.com/docs/concepts/the-dial) | Single parameter [0,1] governing the spectrum from deterministic replay to creative generation, bounded by trust. |
| [**Hash Levels**](https://docs.syncropel.com/docs/concepts/hash-levels) | 4 levels of content-addressed hashing — Exact (L0, private), Structural (L1), Flow (L2), Intent (L3) — enabling privacy-preserving knowledge sharing. |
| [**Governance**](https://docs.syncropel.com/docs/concepts/governance) | Session Capability Tokens computed once at session creation, enforced at every effect execution. 10 deterministic checks. |
| [**Trust**](https://docs.syncropel.com/docs/concepts/trust) | Wilson-score lower bound with cold-start prior and temporal decay. Earned from evidence, not granted by promises. |
| [**Namespaces**](https://docs.syncropel.com/docs/concepts/namespaces) | 5-level hierarchy (DEFAULT → ORG → PROJECT → ENV → JOB) that monotonically narrows. Children never have more permissions than parents. |
| [**Federation**](https://docs.syncropel.com/docs/concepts/federation) | Consent-gated evidence sharing across registries using CRDT counters and hash levels. L0 exact hashes never leave local. |
| [**Physics, Not Policy**](https://docs.syncropel.com/docs/concepts/physics-not-policy) | Why rules are enforced through mathematical structure, not human promises. |

## 9 Axioms

| # | Name | Principle |
|---|------|-----------|
| A1 | Duality | Reality = Compression + Generation |
| A2 | Convergence | Trust increases, cost decreases with repeated use |
| A3 | Identity | Content-addressed — identity is hash, not location |
| A4 | Conservation | Total inputs = total outputs + total costs |
| A5 | Composability | Small components preserve properties when composed |
| A6 | Observability | Every state change produces observable events |
| A7 | Bounded Rationality | Finite context, finite resources |
| A8 | The Dial | Single [0,1] parameter: deterministic to generative |
| A9 | Grounding | Symbols connect to evidence via execution |

## 15 Frozen Foundations

Immutable protocol constants. Any implementation that contradicts these is wrong.

**Primitives**: GET, PUT, CALL, MAP (exactly 4, forever).
**Shapes**: VOID, ONE, OPTIONAL, MANY, KEYED (exactly 5, forever).
**Dial zones**: REPLAY [0,1/3), ADAPT [1/3,1/2), EXPLORE [1/2,2/3), CREATE [2/3,1].
**Hash levels**: L0 Exact, L1 Structural, L2 Flow, L3 Intent.
**Hash algorithm**: SHA-256, lowercase hex, 64 characters.
**L0 rule**: Exact hashes never leave the local namespace.

[Full reference →](https://docs.syncropel.com/docs/reference/frozen-foundations)

## Guides

| Guide | What You'll Learn |
|-------|------------------|
| [Quick Start](https://docs.syncropel.com/docs/tutorials/quickstart) | Install spl, start a local registry, create your first governed namespace (5 min) |
| [Core Workflow](https://docs.syncropel.com/docs/tutorials/core-workflow) | End-to-end: namespaces → policies → observations → trust → audit trail |
| [Syncropel Studio](https://docs.syncropel.com/docs/guides/studio) | Browser interface for operating registries (traces, governance, patterns, federation) |
| [Local Registry](https://docs.syncropel.com/docs/guides/local-registry) | Deep dive into `spl serve` — storage, API, schema, persistence |
| [Agent Integration](https://docs.syncropel.com/docs/guides/agent-integration) | Claude Code hooks, progressive discovery, actor identity |
| [Policy Management](https://docs.syncropel.com/docs/guides/policy-management) | Capability envelopes, deny rules, budget constraints, namespace composition |

## Reference

| Page | Contents |
|------|----------|
| [CLI Reference](https://docs.syncropel.com/docs/reference/cli) | 16 command groups, environment variables, exit codes, output formats |
| [Governance Checks](https://docs.syncropel.com/docs/reference/governance-checks) | 10-check validator — denial kinds, per-effect vs per-session scope, two-tier pipeline |
| [Frozen Foundations](https://docs.syncropel.com/docs/reference/frozen-foundations) | 15 immutable constants |
| [Glossary](https://docs.syncropel.com/docs/reference/glossary) | Every term grounded in shipping code |

## What Ships Today

| Product | What | Link |
|---------|------|------|
| **spl** | CLI + local registry — governance, trust, audit, namespaces, policies | [GitHub](https://github.com/syncropic/syncropel-cli) |
| **Studio** | Browser interface for operating registries | [app.syncropel.com](https://app.syncropel.com) |
| **registry-core** | Shared governance library, zero dependencies | [GitHub](https://github.com/syncropic/syncropel-core) |

## Related

- [syncropic.com](https://syncropic.com) — Syncropic Inc. (Delaware PBC)
- [app.syncropel.com](https://app.syncropel.com) — Syncropel Studio
- [registry.syncropel.com](https://registry.syncropel.com) — Production registry
- [syncropel-core](https://github.com/syncropic/syncropel-core) — Rust verification engine (Apache-2.0)
- [syncropel-cli](https://github.com/syncropic/syncropel-cli) — `spl` CLI (Apache-2.0)
- [syncropel-python](https://github.com/syncropic/syncropel-python) — Python SDK (Apache-2.0)
- [syncropel-js](https://github.com/syncropic/syncropel-js) — TypeScript SDK (Apache-2.0)

---

*Built with [Fumadocs](https://fumadocs.dev). Content &copy; 2026 Syncropic, Inc.*
