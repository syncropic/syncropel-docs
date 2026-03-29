import Link from 'next/link';

const docLinks = [
  { title: 'Quick Start', href: '/docs/tutorials/quickstart', desc: 'Install, configure, and see your first dashboard' },
  { title: 'API Proxy', href: '/docs/guides/proxy', desc: 'Endpoints, metadata, cost tracking, streaming' },
  { title: 'Console', href: '/docs/guides/console', desc: 'Real-time feed, filters, saved views' },
  { title: 'Local Registry', href: '/docs/guides/local-registry', desc: 'How spl serve works under the hood' },
  { title: 'Agent Integration', href: '/docs/guides/agent-integration', desc: 'Claude Code, VS Code, Zed, Cursor' },
  { title: 'CLI Reference', href: '/docs/reference/cli', desc: 'All spl commands' },
  { title: 'Integrations', href: '/docs/reference/integrations', desc: 'What works, what\'s preview, what\'s planned' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero — matches syncropel-web heading style */}
      <section className="w-full max-w-[1024px] mx-auto px-6 pt-16 pb-12 text-center">
        <h1
          className="font-bold tracking-[-0.03em] leading-[1.1] mb-5"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
        >
          Infrastructure that{' '}
          <span className="text-[#c2410c] dark:text-[#d97706]">learns</span>,{' '}
          <span className="text-[#c2410c] dark:text-[#d97706]">governs</span> &amp;{' '}
          <span className="text-[#c2410c] dark:text-[#d97706]">coordinates</span>.
        </h1>
        <p className="text-base text-fd-muted-foreground max-w-xl mx-auto leading-relaxed mb-4">
          Every intent. Every action. Every insight. One protocol.
        </p>
        <p className="text-sm text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
          The coordination layer for teams and AI agents.
          Prevents what shouldn&apos;t happen, records what did,
          extracts what works, shares what was learned.
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-[1024px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Today: Observe */}
      <section className="w-full max-w-[1024px] mx-auto px-6 py-16">
        <p className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-[0.15em] mb-5">
          Today: Observe
        </p>
        <p className="text-sm text-fd-foreground max-w-xl leading-relaxed mb-6">
          Point your LLM SDK to{' '}
          <code className="text-[#c2410c] dark:text-[#d97706] font-mono">localhost:9100</code>.
          Every call is recorded with model, tokens, cost, and latency &mdash; automatically.
        </p>

        {/* Terminal mockup — matches syncropel-web style */}
        <div className="border border-fd-border rounded-lg bg-fd-secondary overflow-hidden text-left mb-8 max-w-xl">
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
              <span className="text-fd-foreground">spl init &amp;&amp; spl serve</span>
            </p>
            <p className="text-[#059669] dark:text-[#34d399]">
              ✓ Registry ready at localhost:9100
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/tutorials/quickstart"
            className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[#c2410c] dark:bg-[#d97706] text-white font-medium text-sm transition-all hover:brightness-110"
          >
            Get Started
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/docs/guides/proxy"
            className="inline-flex items-center gap-2 px-5 py-2 rounded border border-fd-border text-fd-muted-foreground font-medium text-sm transition-all hover:border-fd-foreground hover:text-fd-foreground"
          >
            API Proxy Guide
          </Link>
          <Link
            href="/docs/guides/console"
            className="inline-flex items-center gap-2 px-5 py-2 rounded border border-fd-border text-fd-muted-foreground font-medium text-sm transition-all hover:border-fd-foreground hover:text-fd-foreground"
          >
            Console
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-[1024px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Tomorrow: Coordinate */}
      <section className="w-full max-w-[1024px] mx-auto px-6 py-16">
        <p className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-[0.15em] mb-5">
          Tomorrow: Coordinate
        </p>
        <p className="text-sm text-fd-muted-foreground max-w-xl leading-relaxed mb-4">
          Trust computed from evidence. Work routed to the most reliable
          actor &mdash; human, agent, or automation. Patterns crystallize from
          proven reliability. Value cascades to every contributor.
        </p>
        <p className="text-[12px] font-mono text-fd-muted-foreground">
          Smart routing &middot; Federation &middot; SDK integrations &middot;{' '}
          <span className="italic">Coming soon</span>
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-[1024px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Documentation */}
      <section className="w-full max-w-[1024px] mx-auto px-6 py-16">
        <p className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-[0.15em] mb-8">
          Documentation
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block p-4 rounded-lg border border-fd-border hover:border-fd-foreground/20 transition-colors"
            >
              <span className="text-sm font-medium text-fd-foreground group-hover:text-[#c2410c] dark:group-hover:text-[#d97706] transition-colors">
                {link.title}
              </span>
              <span className="block text-[12px] text-fd-muted-foreground mt-1 leading-relaxed">
                {link.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-fd-border mt-auto">
        <div className="max-w-[1024px] mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-[11px] text-fd-muted-foreground">
              &copy; 2026 Syncropic Inc. Delaware Public Benefit Corporation.
            </div>
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
