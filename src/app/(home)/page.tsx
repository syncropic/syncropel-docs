import Link from 'next/link';

const navCards = [
  {
    label: 'Tutorial',
    title: 'Quick Start',
    desc: 'Install spl, start a local registry, create your first namespace.',
    href: '/docs/tutorials/quickstart',
    icon: '▶',
  },
  {
    label: 'Core Concept',
    title: 'The Effect Algebra',
    desc: '4 primitives. 5 shapes. The foundation of all computation.',
    href: '/docs/concepts/effects',
    icon: '⟲',
  },
  {
    label: 'Core Concept',
    title: 'The Dial',
    desc: 'One parameter. REPLAY to CREATE. Trust unlocks autonomy.',
    href: '/docs/concepts/the-dial',
    icon: '◉',
  },
  {
    label: 'Philosophy',
    title: 'Physics, Not Policy',
    desc: 'Why constraints are structural, not contractual.',
    href: '/docs/concepts/physics-not-policy',
    icon: '⚛',
  },
];

const deepDiveCards = [
  {
    title: 'Hash Levels',
    desc: 'L0-L3 content-addressed identity. One hash, four resolutions.',
    href: '/docs/concepts/hash-levels',
  },
  {
    title: 'Namespaces',
    desc: '5-level hierarchy with monotonic narrowing.',
    href: '/docs/concepts/namespaces',
  },
  {
    title: 'Governance',
    desc: 'SCT computation, 10-check validator, forbid-wins policies.',
    href: '/docs/concepts/governance',
  },
  {
    title: 'Trust',
    desc: 'Wilson score with cold-start prior and 30-day decay.',
    href: '/docs/concepts/trust',
  },
];

const foundations = [
  { id: 'F1', name: '4 Effect Primitives', value: 'GET, PUT, CALL, MAP' },
  { id: 'F2', name: '5 Data Shapes', value: 'VOID, ONE, OPTIONAL, MANY, KEYED' },
  { id: 'F3', name: 'Dial Range', value: 'Continuous scalar d in [0, 1]' },
  { id: 'F4', name: 'Zone Thresholds', value: 'T1=1/3, T2=1/2, T3=2/3' },
  { id: 'F6', name: '4 Hash Levels', value: 'L0 Exact, L1 Structural, L2 Flow, L3 Intent' },
  { id: 'F8', name: 'L0 Sharing Rule', value: 'L0 hashes NEVER leave the local namespace' },
  { id: 'F10', name: 'Hash Algorithm', value: 'SHA-256, lowercase hex, 64 characters' },
];

const axioms = [
  { id: 'A1', name: 'Duality', formula: 'Every effect has an inverse' },
  { id: 'A2', name: 'Convergence', formula: 'Repeated observation converges to truth' },
  { id: 'A3', name: 'Identity', formula: 'identity(x) = hash(canonical(x))' },
  { id: 'A4', name: 'Composition', formula: 'Effects compose algebraically' },
  { id: 'A5', name: 'Determinism', formula: 'Same input, same trace, same result' },
  { id: 'A6', name: 'Boundedness', formula: 'All resources are finite and metered' },
  { id: 'A7', name: 'Consent', formula: 'No data crosses boundaries without consent' },
  { id: 'A8', name: 'Observability', formula: 'Every state change produces an event' },
  { id: 'A9', name: 'Grounding', formula: 'Every hash chain terminates in observation' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-fd-muted-foreground mb-6">
          Verification Infrastructure for AI Computation
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Syncropel{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">Documentation</span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Learn how to govern AI computation with immutable foundations.
          4 effect primitives, 5 data shapes, 4 hash levels, and a 10-check governance pipeline
          that makes trust mathematical and autonomy bounded.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b45309] dark:bg-[#d97706] text-white font-medium text-sm transition-all hover:brightness-110 hover:shadow-lg"
          >
            Read the Docs
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/docs/tutorials/quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-fd-border text-fd-foreground font-medium text-sm transition-all hover:bg-fd-accent/50"
          >
            Quick Start
          </Link>
        </div>

        {/* Install */}
        <div className="mt-8">
          <code className="px-4 py-2 rounded-lg bg-fd-muted text-sm font-mono text-fd-foreground">
            pip install syncropel-cli[serve]
          </code>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Start Here Cards */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-6">
          Start Here
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex gap-4 rounded-xl border border-fd-border bg-fd-card p-6 transition-all hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 hover:shadow-sm"
            >
              <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-fd-muted text-lg">
                {card.icon}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono uppercase tracking-wider text-fd-muted-foreground">
                  {card.label}
                </span>
                <span className="text-base font-semibold group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors">
                  {card.title}
                </span>
                <span className="text-sm text-fd-muted-foreground">
                  {card.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deep Dive */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-6">
          Deep Dive
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deepDiveCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 hover:shadow-sm"
            >
              <span className="text-base font-semibold group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors">
                {card.title}
              </span>
              <p className="text-sm text-fd-muted-foreground mt-1">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Frozen Foundations */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-fd-border bg-fd-card p-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-1">
            Protocol Constants
          </h2>
          <p className="text-xl font-semibold mb-2">
            Frozen Foundations
          </p>
          <p className="text-sm text-fd-muted-foreground mb-6">
            These never change. Any implementation that contradicts them is wrong.{' '}
            <Link href="/docs/reference/frozen-foundations" className="text-[#b45309] dark:text-[#d97706] hover:underline">
              Full reference &rarr;
            </Link>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fd-border">
                  <th className="text-left py-2 pr-4 font-mono text-fd-muted-foreground font-normal w-12">
                    #
                  </th>
                  <th className="text-left py-2 pr-4 font-medium">
                    Foundation
                  </th>
                  <th className="text-left py-2 font-mono text-fd-muted-foreground font-normal hidden md:table-cell">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {foundations.map((f) => (
                  <tr key={f.id} className="border-b border-fd-border/50 last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-[#b45309] dark:text-[#d97706] text-xs">
                      {f.id}
                    </td>
                    <td className="py-2.5 pr-4">{f.name}</td>
                    <td className="py-2.5 font-mono text-xs text-fd-muted-foreground hidden md:table-cell">
                      {f.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Axioms Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-fd-border bg-fd-card p-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-1">
            Foundation
          </h2>
          <p className="text-xl font-semibold mb-6">
            The 9 Axioms
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fd-border">
                  <th className="text-left py-2 pr-4 font-mono text-fd-muted-foreground font-normal w-12">
                    #
                  </th>
                  <th className="text-left py-2 pr-4 font-medium">
                    Axiom
                  </th>
                  <th className="text-left py-2 font-mono text-fd-muted-foreground font-normal hidden md:table-cell">
                    Principle
                  </th>
                </tr>
              </thead>
              <tbody>
                {axioms.map((a) => (
                  <tr key={a.id} className="border-b border-fd-border/50 last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-[#b45309] dark:text-[#d97706] text-xs">
                      {a.id}
                    </td>
                    <td className="py-2.5 pr-4">{a.name}</td>
                    <td className="py-2.5 font-mono text-xs text-fd-muted-foreground hidden md:table-cell">
                      {a.formula}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guides & Reference */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-6">
          Guides & Reference
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/docs/guides/local-registry"
            className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 hover:shadow-sm"
          >
            <span className="text-base font-semibold group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors">
              Local Registry
            </span>
            <p className="text-sm text-fd-muted-foreground mt-1">
              DuckDB storage, 68 API routes, full governance stack.
            </p>
          </Link>
          <Link
            href="/docs/guides/agent-integration"
            className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 hover:shadow-sm"
          >
            <span className="text-base font-semibold group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors">
              Agent Integration
            </span>
            <p className="text-sm text-fd-muted-foreground mt-1">
              Claude Code hooks, progressive discovery, actor identity.
            </p>
          </Link>
          <Link
            href="/docs/reference/cli"
            className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 hover:shadow-sm"
          >
            <span className="text-base font-semibold group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors">
              CLI Reference
            </span>
            <p className="text-sm text-fd-muted-foreground mt-1">
              All spl commands, flags, exit codes, and environment variables.
            </p>
          </Link>
        </div>
      </section>

      {/* Footer Links */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://syncropic.com"
            className="text-sm text-fd-muted-foreground hover:text-[#b45309] dark:hover:text-[#d97706] transition-colors"
          >
            syncropic.com &rarr;
          </a>
          <a
            href="https://app.syncropel.com"
            className="text-sm text-fd-muted-foreground hover:text-[#b45309] dark:hover:text-[#d97706] transition-colors"
          >
            Studio &rarr;
          </a>
          <a
            href="https://syncropel.org"
            className="text-sm text-fd-muted-foreground hover:text-[#b45309] dark:hover:text-[#d97706] transition-colors"
          >
            Protocol &rarr;
          </a>
          <a
            href="https://github.com/syncropic/syncropel-docs"
            className="text-sm text-fd-muted-foreground hover:text-[#b45309] dark:hover:text-[#d97706] transition-colors"
          >
            GitHub &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
