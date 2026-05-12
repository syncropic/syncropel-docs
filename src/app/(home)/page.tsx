import Link from 'next/link';
import { RunTabs } from './RunTabs';
import { SurfaceTabs } from './SurfaceTabs';

const tutorials = [
  { title: 'Quickstart', href: '/docs/start', desc: 'Install spl and create your first task in 10 minutes' },
  { title: 'Your First Task', href: '/docs/tutorials/first-task', desc: 'Create, complete, and see trust grow' },
  { title: 'Working with Threads', href: '/docs/tutorials/first-thread', desc: 'Open, fork, and close workflows' },
  { title: 'Build a Workspace', href: '/docs/tutorials/first-workspace', desc: 'Scaffold, edit, test, publish, share' },
];

const concepts = [
  { title: 'Records', href: '/docs/concepts/records', desc: 'The 8-field immutable unit' },
  { title: 'Threads', href: '/docs/concepts/threads', desc: 'Coordinated workflows' },
  { title: 'Actors', href: '/docs/concepts/actors', desc: 'Identity and trust profiles' },
  { title: 'Trust', href: '/docs/concepts/trust', desc: 'Evidence-based reputation' },
];

const guides = [
  { title: 'Task Management', href: '/docs/guides/task-management', desc: 'Full lifecycle, creation to approval' },
  { title: 'Search', href: '/docs/guides/search', desc: 'Semantic + full-text across threads' },
  { title: 'Namespaces', href: '/docs/guides/namespaces', desc: 'Multi-tenant scoping' },
  { title: 'Debugging', href: '/docs/guides/debugging', desc: 'doctor → status → debug replay' },
  { title: 'TypeScript SDK', href: '/docs/guides/typescript-sdk', desc: 'Universal JS/TS client' },
  { title: 'Python SDK', href: '/docs/guides/python-sdk', desc: 'Emit records from Python' },
  { title: 'Backup & Recovery', href: '/docs/guides/backup-restore', desc: 'Protect your data and recover safely' },
  { title: 'body.kind manifest', href: '/docs/guides/body-kind-manifest', desc: 'Record kind grammar and reserved scopes' },
];

const reference = [
  { title: 'CLI', href: '/docs/reference/cli', desc: 'Every spl command' },
  { title: 'HTTP API', href: '/docs/reference/api', desc: 'All endpoints' },
  { title: 'Configuration', href: '/docs/reference/configuration', desc: 'Settings, rules, locations' },
  { title: 'Glossary', href: '/docs/reference/glossary', desc: 'Key terms A to Z' },
  { title: 'FAQ', href: '/docs/reference/faq', desc: 'Common questions' },
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

      {/* Run an instance — tabbed: Hosted (default) / Linux / macOS / Windows */}
      <section className="w-full max-w-[800px] mx-auto px-6 pb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-[13px] font-semibold text-fd-foreground">Run an instance</h2>
          <span className="text-[11px] text-fd-muted-foreground">Pick a path</span>
        </div>
        <RunTabs />
      </section>

      {/* Divider */}
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Use it from anywhere — tabbed surfaces: CLI / Studio / SDK */}
      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-[13px] font-semibold text-fd-foreground">Use it from anywhere</h2>
          <span className="text-[11px] text-fd-muted-foreground">One task across three surfaces</span>
        </div>
        <SurfaceTabs />
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
