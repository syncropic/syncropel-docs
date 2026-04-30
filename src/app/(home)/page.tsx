import Link from 'next/link';

const tutorials = [
  { title: 'Quickstart', href: '/docs/start', desc: 'Install spl and create your first task in 10 minutes' },
  { title: 'Your First Task', href: '/docs/tutorials/first-task', desc: 'Create, complete, and see trust grow' },
  { title: 'Working with Threads', href: '/docs/tutorials/first-thread', desc: 'Open, fork, and close workflows' },
  { title: 'Build a Workspace', href: '/docs/tutorials/first-workspace', desc: 'Scaffold, edit, test, publish, share' },
  { title: 'First SDK Integration', href: '/docs/tutorials/first-sdk-integration', desc: 'Emit records from a Node.js script' },
  { title: 'Multi-namespace setup', href: '/docs/tutorials/multi-namespace', desc: 'Two isolated environments under one ORG' },
];

const concepts = [
  { title: 'Records', href: '/docs/concepts/records', desc: 'The 8-field immutable unit' },
  { title: 'Threads', href: '/docs/concepts/threads', desc: 'Coordinated workflows' },
  { title: 'Actors', href: '/docs/concepts/actors', desc: 'Identity and trust profiles' },
  { title: 'Workspaces', href: '/docs/concepts/workspaces', desc: 'Manifest-driven applications' },
  { title: 'Catalog', href: '/docs/concepts/catalog', desc: 'Curated discovery surface' },
  { title: 'Trust', href: '/docs/concepts/trust', desc: 'Evidence-based reputation' },
  { title: 'Federation', href: '/docs/concepts/federation', desc: 'Two instances sync via consent' },
  { title: 'Secrets', href: '/docs/concepts/secrets', desc: 'Four-layer credential handling' },
  { title: 'The Engine', href: '/docs/concepts/engine', desc: 'Four loops, ingest to learning' },
];

const guides = [
  { title: 'Task Management', href: '/docs/guides/task-management', desc: 'Full lifecycle, creation to approval' },
  { title: 'Routing Rules', href: '/docs/guides/routing-rules', desc: 'Control how work flows to actors' },
  { title: 'CEL Expressions', href: '/docs/guides/cel-expressions', desc: 'Author rules across decision points' },
  { title: 'Federation pair', href: '/docs/guides/federation-pair', desc: 'One-command stewards-as-peers' },
  { title: 'Inference Overview', href: '/docs/guides/inference/overview', desc: 'infer.query.v1 — what + when + why' },
  { title: 'Agent Integration', href: '/docs/guides/agent-integration', desc: 'Connect AI agents to Syncropel' },
];

const reference = [
  { title: 'CLI', href: '/docs/reference/cli', desc: 'Every spl command' },
  { title: 'HTTP API', href: '/docs/reference/api', desc: 'All endpoints' },
  { title: 'Record Format', href: '/docs/reference/record-format', desc: 'The 8 fields and types' },
  { title: 'Configuration', href: '/docs/reference/configuration', desc: 'Settings, rules, locations' },
  { title: 'Glossary', href: '/docs/reference/glossary', desc: 'Key terms A to Z' },
];

function CardGrid({ items }: { items: { title: string; href: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group block p-3 rounded border border-fd-border hover:border-fd-foreground/20 transition-colors"
        >
          <span className="text-[13px] font-medium text-fd-foreground group-hover:text-[#c2410c] dark:group-hover:text-[#d97706] transition-colors">
            {item.title}
          </span>
          <span className="block text-[11px] text-fd-muted-foreground mt-0.5 leading-relaxed">
            {item.desc}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Header */}
      <section className="w-full max-w-[800px] mx-auto px-6 pt-14 pb-6 text-center">
        <h1
          className="font-bold tracking-[-0.02em] leading-[1.1] mb-3"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
        >
          Syncropel Documentation
        </h1>
        <p className="text-sm text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
          Learn how to coordinate work between humans and AI agents
          with immutable records, evidence-based trust, and self-improving workflows.
        </p>
      </section>

      {/* Get Started */}
      <section className="w-full max-w-[800px] mx-auto px-6 pb-8">
        <div className="border border-fd-border rounded-lg bg-fd-secondary overflow-hidden">
          <div className="px-3 py-2 border-b border-fd-border/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-fd-border" />
            <span className="w-2 h-2 rounded-full bg-fd-border" />
            <span className="w-2 h-2 rounded-full bg-fd-border" />
            <span className="ml-2 text-[11px] text-fd-muted-foreground font-mono">terminal</span>
          </div>
          <div className="p-4 font-mono text-[12px] leading-[1.8] space-y-0.5">
            <p>
              <span className="text-fd-muted-foreground">$ </span>
              <span className="text-fd-foreground">curl -sSf https://get.syncropic.com/spl | sh</span>
            </p>
            <p>
              <span className="text-fd-muted-foreground">$ </span>
              <span className="text-fd-foreground">spl init &amp;&amp; spl serve --daemon</span>
            </p>
            <p className="text-[#059669] dark:text-[#34d399]">
              ✓ Ready at localhost:9100
            </p>
          </div>
        </div>
        <p className="text-sm text-fd-muted-foreground mt-3 text-center">
          Then follow the{' '}
          <Link
            href="/docs/start"
            className="text-[#c2410c] dark:text-[#d97706] hover:underline font-medium"
          >
            Quick Start tutorial
          </Link>
          {' '}to create your first record.
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Tutorials */}
      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-[13px] font-semibold text-fd-foreground">Tutorials</h2>
          <span className="text-[11px] text-fd-muted-foreground">Step-by-step learning</span>
        </div>
        <CardGrid items={tutorials} />
      </section>

      {/* Divider */}
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Concepts */}
      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-[13px] font-semibold text-fd-foreground">Concepts</h2>
          <span className="text-[11px] text-fd-muted-foreground">Understand how it works</span>
        </div>
        <CardGrid items={concepts} />
      </section>

      {/* Divider */}
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Guides */}
      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-[13px] font-semibold text-fd-foreground">Guides</h2>
          <span className="text-[11px] text-fd-muted-foreground">Solve specific problems</span>
        </div>
        <CardGrid items={guides} />
      </section>

      {/* Divider */}
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Reference */}
      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-[13px] font-semibold text-fd-foreground">Reference</h2>
          <span className="text-[11px] text-fd-muted-foreground">Look things up</span>
        </div>
        <CardGrid items={reference} />
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-fd-border mt-auto">
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <a href="https://syncropic.com" className="text-[11px] text-fd-muted-foreground hover:text-fd-foreground transition-colors">
              &copy; 2026 Syncropic Inc. Public Benefit Corporation.
            </a>
            <div className="flex flex-wrap gap-4 text-[11px] text-fd-muted-foreground">
              <a href="https://syncropic.com" className="hover:text-fd-foreground transition-colors">
                syncropic.com
              </a>
              <a href="https://syncropel.com" className="hover:text-fd-foreground transition-colors">
                syncropel.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
