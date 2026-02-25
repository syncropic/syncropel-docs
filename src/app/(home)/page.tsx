import Link from 'next/link';

const learnLinks = [
  { title: 'The Effect Algebra', href: '/docs/concepts/effects' },
  { title: 'The Dial', href: '/docs/concepts/the-dial' },
  { title: 'Governance', href: '/docs/concepts/governance' },
  { title: 'Trust', href: '/docs/concepts/trust' },
  { title: 'Hash Levels', href: '/docs/concepts/hash-levels' },
  { title: 'Namespaces', href: '/docs/concepts/namespaces' },
  { title: 'Federation', href: '/docs/concepts/federation' },
  { title: 'Physics, Not Policy', href: '/docs/concepts/physics-not-policy' },
];

const buildLinks = [
  { title: 'Quick Start', href: '/docs/tutorials/quickstart' },
  { title: 'Core Workflow', href: '/docs/tutorials/core-workflow' },
  { title: 'Agent Integration', href: '/docs/guides/agent-integration' },
  { title: 'Local Registry', href: '/docs/guides/local-registry' },
  { title: 'Policy Management', href: '/docs/guides/policy-management' },
];

const referenceLinks = [
  { title: 'CLI Reference', href: '/docs/reference/cli' },
  { title: 'Frozen Foundations', href: '/docs/reference/frozen-foundations' },
  { title: 'Governance Checks', href: '/docs/reference/governance-checks' },
  { title: 'Glossary', href: '/docs/reference/glossary' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
          Infrastructure that{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">learns</span> and{' '}
          <span className="text-[#b45309] dark:text-[#d97706]">governs</span>.
        </h1>
        <p className="text-base text-fd-muted-foreground max-w-xl mx-auto leading-relaxed">
          A formal algebra for computation governance. Closed primitives.
          Deterministic validation. What isn&apos;t permitted can&apos;t execute.
          What is spent can&apos;t be spent again. Trust earned from evidence,
          not granted by policy or promises.
        </p>

        {/* Install */}
        <div className="mt-8 mb-6">
          <code className="inline-block px-5 py-2.5 rounded-lg bg-fd-muted text-sm font-mono text-fd-foreground border border-fd-border">
            $ curl -fsSL https://get.syncropic.com/spl | sh
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

      {/* Three Paths */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Learn */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-4">
              Learn
            </h2>
            <ul className="space-y-2">
              {learnLinks.map((link) => (
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

          {/* Build */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-fd-muted-foreground mb-4">
              Build
            </h2>
            <ul className="space-y-2">
              {buildLinks.map((link) => (
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
              CLI + local registry. Governance, trust, audit, namespaces, policies. Offline-first.
            </span>
          </div>
          <div className="flex gap-3">
            <code className="font-mono text-[#b45309] dark:text-[#d97706] shrink-0">registry-core</code>
            <span className="text-fd-muted-foreground">
              Shared governance library. Zero dependencies. Same logic in CLI and production.
            </span>
          </div>
        </div>
        <p className="text-xs text-fd-muted-foreground mt-5">
          Coming: federation sync &middot; VFS gateway &middot; global registry network
        </p>
      </section>

      {/* Divider */}
      <div className="w-full max-w-3xl mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      {/* Foundations */}
      <section className="w-full max-w-3xl mx-auto px-6 py-14">
        <p className="text-sm text-fd-muted-foreground">
          <span className="font-medium text-fd-foreground">Primitives:</span> GET, PUT, CALL, MAP &middot;{' '}
          <span className="font-medium text-fd-foreground">Shapes:</span> VOID, ONE, OPTIONAL, MANY, KEYED &middot;{' '}
          <span className="font-medium text-fd-foreground">Hash levels:</span> Exact, Structural, Flow, Intent &middot;{' '}
          <span className="font-medium text-fd-foreground">Dial zones:</span> REPLAY, ADAPT, EXPLORE, CREATE
        </p>
        <Link
          href="/docs/reference/frozen-foundations"
          className="text-sm text-[#b45309] dark:text-[#d97706] hover:underline mt-1 inline-block"
        >
          Full reference &rarr;
        </Link>
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
              <a href="https://app.syncropel.com" className="hover:text-fd-foreground transition-colors">
                app.syncropel.com
              </a>
              <a href="https://syncropel.org" className="hover:text-fd-foreground transition-colors">
                Protocol Spec
              </a>
              <a href="https://github.com/syncropic/syncropel-docs" className="hover:text-fd-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
