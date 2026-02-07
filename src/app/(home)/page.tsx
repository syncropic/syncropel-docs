import Link from 'next/link';

const navCards = [
  {
    label: 'Tutorial',
    title: 'Quick Start',
    desc: 'Build your first trace in 5 minutes.',
    href: '/docs/tutorials/quickstart',
    icon: '▶',
  },
  {
    label: 'Core Concept',
    title: 'The Dial',
    desc: 'One parameter. Deterministic to generative.',
    href: '/docs/concepts/the-dial',
    icon: '◉',
  },
  {
    label: 'Architecture',
    title: 'The Six-Layer Stack',
    desc: 'L0 Truth through L5 Sovereignty.',
    href: '/docs/concepts/the-stack',
    icon: '▦',
  },
  {
    label: 'Reference',
    title: 'Effect Vocabulary',
    desc: '12 effect kinds. Turing-complete.',
    href: '/docs/reference/effects',
    icon: '⟲',
  },
];

const axioms = [
  { id: 'A1', name: 'Content-Addressed Identity', formula: 'identity(x) = hash(canonical(x))' },
  { id: 'A2', name: 'Sovereign Ownership', formula: 'access(x) ⟹ grant(owner(x))' },
  { id: 'A3', name: 'Cryptographic Lineage', formula: 'output.lineage ⊇ inputs.lineage' },
  { id: 'A4', name: 'Self-Enforcing Covenants', formula: 'covenant(asset) ≡ physics' },
  { id: 'A5', name: 'Deterministic Effects', formula: 'trace(graph, env) → deterministic' },
  { id: 'A6', name: 'Bounded Autonomy', formula: 'autonomy ∈ [0, 1] × constraints' },
  { id: 'A7', name: 'Atomic Settlement', formula: 'work ⊗ payment = single_tx' },
  { id: 'A8', name: 'Observable State', formula: '∀ state_change → event' },
  { id: 'A9', name: 'Value Conservation', formula: 'Σ value_in = Σ value_out' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-fd-muted-foreground mb-6">
          The Substrate for Digital Sovereignty
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Syncropel{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">Documentation</span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Learn how computation becomes physics. Comprehensive guides, tutorials,
          and references for the protocol where trust is mathematical,
          value flows through lineage, and every agent is sovereign.
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
      </section>

      {/* Divider */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Navigation Cards */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
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
                    Expression
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
