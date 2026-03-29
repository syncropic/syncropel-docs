import Link from 'next/link';

const docLinks = [
  { title: 'Quick Start', href: '/docs/tutorials/quickstart' },
  { title: 'API Proxy', href: '/docs/guides/proxy' },
  { title: 'Console', href: '/docs/guides/console' },
  { title: 'Local Registry', href: '/docs/guides/local-registry' },
  { title: 'Agent Integration', href: '/docs/guides/agent-integration' },
  { title: 'CLI Reference', href: '/docs/reference/cli' },
  { title: 'Integrations', href: '/docs/reference/integrations' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
          Infrastructure that{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">learns</span>,{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">governs</span> &amp;{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">coordinates</span>.
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-xl mx-auto leading-relaxed mb-4">
          Every intent. Every action. Every insight. One protocol.
        </p>
        <div className="text-base text-fd-muted-foreground max-w-lg mx-auto leading-relaxed space-y-1">
          <p>Prevents what shouldn&apos;t happen.</p>
          <p>Records what did.</p>
          <p>Extracts what works.</p>
          <p>Shares what was learned.</p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Today: Observe */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-5">
          Today: Observe
        </h2>
        <p className="text-base text-fd-foreground max-w-xl leading-relaxed mb-6">
          Point your LLM SDK to <code className="text-[#b45309] dark:text-[#d97706]">localhost:9100</code>.
          Every call is recorded with model, tokens, cost, and latency &mdash; automatically.
        </p>

        <div className="space-y-2 mb-8">
          <code className="block px-5 py-2.5 rounded-lg bg-fd-muted text-sm font-mono text-fd-foreground border border-fd-border">
            $ curl -sSf https://get.syncropic.com/spl | sh
          </code>
          <code className="block px-5 py-2.5 rounded-lg bg-fd-muted text-sm font-mono text-fd-foreground border border-fd-border">
            $ spl init &amp;&amp; spl serve
          </code>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/tutorials/quickstart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b45309] dark:bg-[#d97706] text-white font-medium text-sm transition-all hover:brightness-110 hover:shadow-lg"
          >
            Quick Start
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/docs/guides/proxy"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-fd-border text-fd-foreground font-medium text-sm transition-all hover:bg-fd-accent/50"
          >
            API Proxy Guide
          </Link>
          <Link
            href="/docs/guides/console"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-fd-border text-fd-foreground font-medium text-sm transition-all hover:bg-fd-accent/50"
          >
            Console
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Tomorrow: Coordinate */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-5">
          Tomorrow: Coordinate
        </h2>
        <p className="text-base text-fd-muted-foreground max-w-xl leading-relaxed mb-4">
          Trust computed from evidence. Work routed to the most reliable
          actor &mdash; human, agent, or automation. Patterns crystallize from
          proven reliability. Value cascades to every contributor.
        </p>
        <p className="text-sm text-fd-muted-foreground">
          Smart routing &middot; Federation &middot; SDK integrations &middot;{' '}
          <span className="italic">Coming soon</span>
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Docs */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-5">
          Documentation
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {docLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-fd-foreground hover:text-[#b45309] dark:hover:text-[#d97706] transition-colors"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-fd-border mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-fd-muted-foreground">
              &copy; 2026 Syncropic Inc. Delaware Public Benefit Corporation.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-fd-muted-foreground">
              <a href="https://syncropic.com" className="hover:text-fd-foreground transition-colors">
                syncropic.com
              </a>
              <a href="https://docs.syncropel.com" className="hover:text-fd-foreground transition-colors">
                docs.syncropel.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
