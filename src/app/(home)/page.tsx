import Link from 'next/link';

const capabilities = [
  {
    title: 'Observable',
    desc: 'Every action traced. Content-addressed and inspectable. Structured effects, not log lines.',
    ready: true,
  },
  {
    title: 'Validated',
    desc: 'Formal verification before or after execution. Programmable policies. Architectural guarantees, not bolted-on safety.',
    ready: true,
  },
  {
    title: 'Composable',
    desc: 'A small, fixed set of primitives and shapes. Closed under composition. Build anything and prove properties about the whole.',
    ready: true,
  },
  {
    title: 'Learning',
    desc: 'Patterns extracted from traces. Trust computed from observations. The system gets smarter from everything flowing through it.',
    ready: true,
  },
  {
    title: 'Federated',
    desc: 'Knowledge shared across organizations without sharing data. Privacy-preserving by construction. Patterns improve the network.',
    ready: false,
  },
  {
    title: 'Programmable',
    desc: 'Define your own validation rules, policies, and automation triggers. A substrate you control and configure to your domain.',
    ready: true,
  },
];

const startCards = [
  {
    label: 'Tutorial',
    title: 'Quick Start',
    desc: 'Install spl, start a local registry, set your first policy.',
    href: '/docs/tutorials/quickstart',
    icon: '▶',
  },
  {
    label: 'Tutorial',
    title: 'Core Workflow',
    desc: 'End-to-end: namespace, policy, observe, trust, audit.',
    href: '/docs/tutorials/core-workflow',
    icon: '↻',
  },
  {
    label: 'Concept',
    title: 'The Effect Algebra',
    desc: '4 primitives. 5 shapes. The atoms of all computation.',
    href: '/docs/concepts/effects',
    icon: '⟲',
  },
  {
    label: 'Philosophy',
    title: 'Physics, Not Policy',
    desc: 'Why constraints are structural, not contractual.',
    href: '/docs/concepts/physics-not-policy',
    icon: '⚛',
  },
];

const conceptCards = [
  {
    title: 'The Dial',
    desc: 'One parameter. REPLAY to CREATE. Trust unlocks autonomy.',
    href: '/docs/concepts/the-dial',
  },
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
    desc: 'Session Capability Tokens and the 10-check validator.',
    href: '/docs/concepts/governance',
  },
  {
    title: 'Trust',
    desc: 'Wilson score with cold-start prior and 30-day decay.',
    href: '/docs/concepts/trust',
  },
  {
    title: 'Federation',
    desc: 'Consent-gated evidence sharing across trust boundaries.',
    href: '/docs/concepts/federation',
  },
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
          Infrastructure That Learns
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Syncropel{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">Documentation</span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A programmable substrate for computation that gets smarter from everything
          flowing through it. Observe what happened. Validate what should happen.
          Learn what works.
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
            curl -fsSL https://get.syncropic.com/spl | sh
          </code>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* The Substrate */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-2">
          The Substrate
        </h2>
        <p className="text-xl font-semibold mb-2">
          Not another monitoring tool.
        </p>
        <p className="text-sm text-fd-muted-foreground mb-8 max-w-2xl">
          A substrate where computation flows through structured traces, gets validated against
          your rules, and continuously improves. Built on patent-pending protocol technology.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-xl border border-fd-border bg-fd-card p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-semibold">{cap.title}</span>
                {cap.ready ? (
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    ready
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-fd-muted text-fd-muted-foreground">
                    roadmap
                  </span>
                )}
              </div>
              <p className="text-sm text-fd-muted-foreground">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Flows Through */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-fd-border bg-fd-card p-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-1">
            Not Just AI
          </h2>
          <p className="text-xl font-semibold mb-6">
            Everything.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'AI Agent Sessions', examples: 'Claude Code, LangChain, GPT tool calls' },
              { label: 'Developer Activity', examples: 'Git workflows, CLI commands, build pipelines' },
              { label: 'API & Service Traffic', examples: 'Internal APIs, webhooks, scheduled jobs' },
              { label: 'Human Actions', examples: 'Admin operations, approval workflows, data queries' },
              { label: 'Historical Data', examples: 'Log archives, session replays, audit trails' },
              { label: 'Custom Integrations', examples: 'Any computation you want to observe and govern' },
            ].map((item) => (
              <div key={item.label}>
                <span className="font-medium">{item.label}</span>
                <p className="text-fd-muted-foreground text-xs mt-0.5">{item.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Start Here */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-6">
          Start Here
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {startCards.map((card) => (
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

      {/* Concepts */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-6">
          Concepts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conceptCards.map((card) => (
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

      {/* The Flywheel */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-fd-border bg-fd-card p-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-1">
            The Flywheel
          </h2>
          <p className="text-xl font-semibold mb-2">
            Monitoring tells you what broke. Syncropel learns what works.
          </p>
          <p className="text-sm text-fd-muted-foreground mb-6 max-w-2xl">
            Every action that flows through the substrate makes it smarter. Patterns learned
            by one team benefit everyone in the network. Privacy-preserving by construction.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm font-mono">
            {['Ingest', 'Validate', 'Observe', 'Learn', 'Share'].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-fd-muted">{step}</span>
                {i < 4 && <span className="text-fd-muted-foreground">&rarr;</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Axioms */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            href="/docs/guides/policy-management"
            className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 hover:shadow-sm"
          >
            <span className="text-base font-semibold group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors">
              Policy Management
            </span>
            <p className="text-sm text-fd-muted-foreground mt-1">
              Capability envelopes, deny rules, budget constraints.
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
              All spl commands, flags, exit codes, and env vars.
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
            Trace Inspector &rarr;
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
