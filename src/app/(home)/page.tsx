import Link from 'next/link';

const guideLinks = [
  { title: 'API Proxy', href: '/docs/guides/proxy' },
  { title: 'Console Dashboard', href: '/docs/guides/console' },
  { title: 'Local Registry', href: '/docs/guides/local-registry' },
  { title: 'Agent Integration', href: '/docs/guides/agent-integration' },
];

const referenceLinks = [
  { title: 'CLI Reference', href: '/docs/reference/cli' },
  { title: 'Integration Status', href: '/docs/reference/integrations' },
  { title: 'Glossary', href: '/docs/reference/glossary' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
          Observe every{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">LLM call</span>.
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-xl mx-auto leading-relaxed mb-2">
          Model. Tokens. Cost. Latency.
        </p>
        <p className="text-base text-fd-muted-foreground max-w-xl mx-auto leading-relaxed">
          Change one line &mdash; your <code className="text-fd-foreground">base_url</code> &mdash;
          and get full observability on every API call.
          Automatic. Local-first. Privacy-preserving.
        </p>

        {/* Install */}
        <div className="mt-8 mb-6">
          <code className="inline-block px-5 py-2.5 rounded-lg bg-fd-muted text-sm font-mono text-fd-foreground border border-fd-border">
            $ curl -sSf https://get.syncropic.com/spl | sh
          </code>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs/tutorials/quickstart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b45309] dark:bg-[#d97706] text-white font-medium text-sm transition-all hover:brightness-110 hover:shadow-lg"
          >
            Quick Start
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-fd-border text-fd-foreground font-medium text-sm transition-all hover:bg-fd-accent/50"
          >
            Read the Docs
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Navigation */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Guides */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-4">
              Guides
            </h2>
            <ul className="space-y-2">
              {guideLinks.map((link) => (
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
          </div>

          {/* Reference */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-4">
              Reference
            </h2>
            <ul className="space-y-2">
              {referenceLinks.map((link) => (
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
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* What Ships Today */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-5">
          What Ships Today
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <code className="font-mono text-[#b45309] dark:text-[#d97706] shrink-0">spl</code>
            <span className="text-fd-muted-foreground">
              CLI + local registry. API proxy, console dashboard, trust computation,
              governance. Offline-first, privacy-preserving.
            </span>
          </div>
          <div className="flex gap-3">
            <code className="font-mono text-[#b45309] dark:text-[#d97706] shrink-0">proxy</code>
            <span className="text-fd-muted-foreground">
              Transparent Anthropic + OpenAI API proxy. Records model, tokens, cost,
              and latency on every call. Streaming supported.
            </span>
          </div>
          <div className="flex gap-3">
            <code className="font-mono text-[#b45309] dark:text-[#d97706] shrink-0">console</code>
            <span className="text-fd-muted-foreground">
              Real-time dashboard at{' '}
              <code className="text-fd-foreground">localhost:9100/console</code>.
              Live feed, filters, saved views, cost tracking.
            </span>
          </div>
        </div>
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
