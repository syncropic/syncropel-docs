import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RunTabs } from './RunTabs';
import { SurfaceTabs } from './SurfaceTabs';

// Sections organized by visitor intent, not docs taxonomy.
// Every entry in the KEEP set (per syncropel-research/docs/web-summit-trim
// v2 plan §T) lives in exactly one bucket below.

const startHere = [
  { title: 'Quickstart', href: '/docs/start', desc: 'Five minutes from zero to a working loop' },
  { title: 'Hosted signup', href: '/docs/get-started/hosted', desc: '60-second flow at syncropel.com/signup' },
  { title: 'Install spl', href: '/docs/get-started/install', desc: 'Linux, macOS, Windows — single binary' },
  { title: 'First run', href: '/docs/get-started/first-run', desc: 'spl init, identity, ~/.syncro/ layout' },
  { title: 'Pair a device', href: '/docs/get-started/pairing', desc: 'Browser, phone, or second CLI on the same instance' },
  { title: 'Pricing', href: '/docs/get-started/pricing', desc: 'Free tier + paid tiers — full cost surface' },
];

const tutorials = [
  { title: 'Your first task', href: '/docs/tutorials/first-task', desc: 'Create, complete, and see trust grow' },
  { title: 'Working with threads', href: '/docs/tutorials/first-thread', desc: 'Open, fork, and close workflows' },
  { title: 'Build a workspace', href: '/docs/tutorials/first-workspace', desc: 'Scaffold, edit, test, publish, share' },
];

const mentalModel = [
  { title: 'Records', href: '/docs/concepts/records', desc: 'The 8-field immutable, content-addressed unit' },
  { title: 'Threads', href: '/docs/concepts/threads', desc: 'Coordinated workflows that fold to state' },
  { title: 'Actors', href: '/docs/concepts/actors', desc: 'Identity, trust profiles, persistent memory' },
  { title: 'Trust', href: '/docs/concepts/trust', desc: 'Wilson-LB evidence with the dial' },
];

const build = [
  { title: 'Task management', href: '/docs/guides/task-management', desc: 'Full lifecycle from creation to approval' },
  { title: 'Search', href: '/docs/guides/search', desc: 'Semantic + full-text across threads' },
  { title: 'Namespaces', href: '/docs/guides/namespaces', desc: 'Multi-tenant scoping with the 5-level hierarchy' },
  { title: 'Debugging', href: '/docs/guides/debugging', desc: 'doctor → status → debug replay → audit export' },
  { title: 'TypeScript SDK', href: '/docs/guides/typescript-sdk', desc: 'Universal JS/TS — Node, Deno, Bun, Workers' },
  { title: 'Python SDK', href: '/docs/guides/python-sdk', desc: 'httpx-based, fail-open record client' },
  { title: 'body.kind manifest', href: '/docs/guides/body-kind-manifest', desc: 'Record kind grammar and reserved scopes' },
  { title: 'AI clients (MCP)', href: '/docs/integrate/ai-clients', desc: 'Claude Desktop, Cursor, Cline, Zed, OpenCode' },
  { title: 'api.syncropic.com', href: '/docs/integrate/api-syncropic', desc: 'Single AI-gateway endpoint, many providers' },
];

const operate = [
  { title: 'Operator runbook', href: '/docs/operate/runbook', desc: 'Lifecycle, recovery, backup discipline, upgrades' },
  { title: 'spl doctor', href: '/docs/operate/doctor', desc: 'Top-down diagnostic — start here when stuck' },
  { title: 'Security model', href: '/docs/operate/security-model', desc: 'Auth, service accounts, on-disk, threat surface' },
  { title: 'Backup & recovery', href: '/docs/guides/backup-restore', desc: 'Protect data, restore safely' },
  { title: 'Troubleshooting', href: '/docs/get-started/troubleshooting', desc: 'Diagnostic tree for the common failure modes' },
  { title: 'Reset & uninstall', href: '/docs/get-started/reset-uninstall', desc: 'Clean reset and full uninstall per platform' },
];

const reference = [
  { title: 'CLI', href: '/docs/reference/cli', desc: 'Every spl command with flags + examples' },
  { title: 'HTTP API', href: '/docs/reference/api', desc: 'All endpoints with request examples' },
  { title: 'Configuration', href: '/docs/reference/configuration', desc: 'config.toml settings, rules, data locations' },
  { title: 'Glossary', href: '/docs/reference/glossary', desc: 'Key terms A to Z' },
  { title: 'FAQ', href: '/docs/reference/faq', desc: 'Vocabulary, hosted vs self-hosted, federation' },
];

interface NavSection {
  readonly title: string;
  readonly tagline: string;
  readonly items: ReadonlyArray<{ title: string; href: string; desc: string }>;
}

const NAV_SECTIONS: ReadonlyArray<NavSection> = [
  { title: 'Start here', tagline: 'Get an instance running on your terms', items: startHere },
  { title: 'Tutorials', tagline: 'Learn by doing — 15-30 minutes each', items: tutorials },
  { title: 'Mental model', tagline: 'What Syncropel actually is, under the hood', items: mentalModel },
  { title: 'Build with Syncropel', tagline: 'SDKs, AI clients, gateways, dev tools', items: build },
  { title: 'Operate in production', tagline: 'Day-2 ops, security, recovery', items: operate },
  { title: 'Reference', tagline: 'Look things up', items: reference },
];

function CardGrid({ items }: { items: ReadonlyArray<{ title: string; href: string; desc: string }> }) {
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

      {/* Intent-organized navigation — replaces the prior 4-section taxonomy.
          Same 33 KEEP-set destinations, organized by visitor intent: Start here →
          Tutorials → Mental model → Build → Operate → Reference. */}
      {NAV_SECTIONS.map((section, idx) => (
        <div key={section.title} className="w-full">
          {/* Divider */}
          <div className="w-full max-w-[800px] mx-auto px-6">
            <div className="h-px bg-fd-border" />
          </div>
          <section className="w-full max-w-[800px] mx-auto px-6 py-8">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-[13px] font-semibold text-fd-foreground">{section.title}</h2>
              <span className="text-[11px] text-fd-muted-foreground">{section.tagline}</span>
            </div>
            <CardGrid items={section.items} />
          </section>
        </div>
      ))}

      {/* Divider */}
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Browse everything tail */}
      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          Browse the full docs hub
          <ArrowRight size={12} aria-hidden />
        </Link>
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
