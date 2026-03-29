import Link from 'next/link';

const docLinks = [
  { title: 'Quick Start', href: '/docs/tutorials/quickstart', desc: 'Install, configure, and see your first dashboard' },
  { title: 'API Proxy', href: '/docs/guides/proxy', desc: 'Endpoints, metadata, cost tracking, streaming' },
  { title: 'Console', href: '/docs/guides/console', desc: 'Real-time feed, filters, saved views' },
  { title: 'Local Registry', href: '/docs/guides/local-registry', desc: 'How spl serve works under the hood' },
  { title: 'Agent Integration', href: '/docs/guides/agent-integration', desc: 'Claude Code, VS Code, Zed, Cursor' },
  { title: 'CLI Reference', href: '/docs/reference/cli', desc: 'All spl commands' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero — compact, centered, gets to the point fast */}
      <section className="w-full max-w-[720px] mx-auto px-6 pt-14 pb-10 text-center">
        <h1
          className="font-bold tracking-[-0.03em] leading-[1.1] mb-3"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
        >
          Infrastructure that{' '}
          <span className="text-[#c2410c] dark:text-[#d97706]">learns</span>,{' '}
          <span className="text-[#c2410c] dark:text-[#d97706]">governs</span> &amp;{' '}
          <span className="text-[#c2410c] dark:text-[#d97706]">coordinates</span>.
        </h1>
        <p className="text-sm text-fd-muted-foreground max-w-md mx-auto leading-relaxed">
          The coordination layer for teams and AI agents.
          Prevents what shouldn&apos;t happen, records what did,
          extracts what works, shares what was learned.
        </p>
      </section>

      {/* Today: Observe — centered like hero */}
      <section className="w-full max-w-[720px] mx-auto px-6 pb-10 text-center">
        <p className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-[0.15em] mb-4">
          Start in 60 seconds
        </p>

        {/* Terminal mockup — centered, full width of container */}
        <div className="border border-fd-border rounded-lg bg-fd-secondary overflow-hidden text-left mb-6">
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
            <p className="mt-2">
              <span className="text-fd-muted-foreground"># Point your SDK here:</span>
            </p>
            <p>
              <span className="text-fd-foreground">client = anthropic.Client(</span>
              <span className="text-[#c2410c] dark:text-[#d97706]">base_url</span>
              <span className="text-fd-foreground">=</span>
              <span className="text-[#059669] dark:text-[#34d399]">&quot;http://localhost:9100&quot;</span>
              <span className="text-fd-foreground">)</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-fd-muted-foreground mb-6">
          Every LLM call is recorded with model, tokens, cost, and latency.
          Open{' '}
          <code className="text-[#c2410c] dark:text-[#d97706] font-mono text-[12px]">localhost:9100/console</code>
          {' '}to see the dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs/tutorials/quickstart"
            className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[#c2410c] dark:bg-[#d97706] text-white font-medium text-sm transition-all hover:brightness-110"
          >
            Quick Start
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
      <div className="w-full max-w-[720px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Tomorrow: Coordinate — centered */}
      <section className="w-full max-w-[720px] mx-auto px-6 py-12 text-center">
        <p className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-[0.15em] mb-4">
          Coming Next
        </p>
        <p className="text-sm text-fd-muted-foreground max-w-lg mx-auto leading-relaxed mb-3">
          Trust computed from evidence. Work routed to the most reliable
          actor &mdash; human, agent, or automation. Patterns crystallize.
          Value cascades to every contributor.
        </p>
        <p className="text-[12px] font-mono text-fd-muted-foreground/60">
          Smart routing &middot; Federation &middot; SDK integrations
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-[720px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Documentation — 3x2 grid, no orphan */}
      <section className="w-full max-w-[720px] mx-auto px-6 py-12">
        <p className="text-[11px] font-semibold text-fd-muted-foreground uppercase tracking-[0.15em] mb-6 text-center">
          Documentation
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {docLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block p-3 rounded border border-fd-border hover:border-fd-foreground/20 transition-colors"
            >
              <span className="text-[13px] font-medium text-fd-foreground group-hover:text-[#c2410c] dark:group-hover:text-[#d97706] transition-colors">
                {link.title}
              </span>
              <span className="block text-[11px] text-fd-muted-foreground mt-0.5 leading-relaxed">
                {link.desc}
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link
            href="/docs/reference/integrations"
            className="text-[12px] text-[#c2410c] dark:text-[#d97706] hover:underline"
          >
            Integration status &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-fd-border mt-auto">
        <div className="max-w-[720px] mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
