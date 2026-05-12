'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Apple, ArrowUpRight, Check, Copy, Globe, Monitor, Terminal } from 'lucide-react';

type TabId = 'hosted' | 'linux' | 'macos' | 'windows';

interface OSCommand {
  readonly promptPrefix: string;
  readonly install: string;
  readonly start: string;
  readonly ready: string;
}

const OS_COMMANDS: Record<Exclude<TabId, 'hosted'>, OSCommand> = {
  linux: {
    promptPrefix: '$',
    install: 'curl -sSf https://get.syncropic.com/spl | sh',
    start: 'spl init && spl serve --daemon',
    ready: '✓ Ready at http://127.0.0.1:9100',
  },
  macos: {
    promptPrefix: '$',
    install: 'curl -sSf https://get.syncropic.com/spl | sh',
    start: 'spl init && spl serve --daemon',
    ready: '✓ Ready at http://127.0.0.1:9100',
  },
  windows: {
    promptPrefix: 'PS>',
    install: 'irm https://get.syncropic.com/spl.ps1 | iex',
    start: 'spl init; spl serve --daemon',
    ready: '✓ Ready at http://127.0.0.1:9100',
  },
};

const TABS: ReadonlyArray<{
  readonly id: TabId;
  readonly label: string;
  readonly icon: typeof Globe;
  readonly badge?: string;
}> = [
  { id: 'hosted', label: 'Hosted', icon: Globe, badge: 'recommended' },
  { id: 'linux', label: 'Linux', icon: Terminal },
  { id: 'macos', label: 'macOS', icon: Apple },
  { id: 'windows', label: 'Windows', icon: Monitor },
];

export function RunTabs() {
  const [active, setActive] = useState<TabId>('hosted');

  return (
    <div className="w-full" role="region" aria-label="Run an instance">
      {/* Tab strip */}
      <div role="tablist" aria-label="Install path" className="flex items-center gap-0.5 border-b border-fd-border">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={[
                '-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-[12px] font-medium transition-colors',
                isActive
                  ? 'border-[#c2410c] text-fd-foreground dark:border-[#d97706]'
                  : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
              ].join(' ')}
            >
              <Icon size={13} aria-hidden />
              {tab.label}
              {tab.badge && (
                <span className="ml-0.5 rounded bg-fd-secondary px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-fd-muted-foreground">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div role="tabpanel" aria-label={`${TABS.find((t) => t.id === active)?.label} install`} className="pt-4">
        {active === 'hosted' ? <HostedPanel /> : <OSPanel cmd={OS_COMMANDS[active]} osLabel={TABS.find((t) => t.id === active)!.label} />}
      </div>
    </div>
  );
}

function HostedPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-fd-foreground">
        Sign up at{' '}
        <Link
          href="https://syncropel.com/signup"
          className="font-medium text-[#c2410c] hover:underline dark:text-[#d97706]"
        >
          syncropel.com/signup
        </Link>
        . About 60 seconds. Your instance comes up at{' '}
        <code className="rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-[12px]">&lt;label&gt;.syncropel.app</code>{' '}
        with a bootstrap token shown once.
      </p>
      <p className="text-sm leading-relaxed text-fd-muted-foreground">
        No install, no machine to maintain. Free tier; paid tiers for scale. Same binary, same APIs, same record store
        as self-hosted — move between hosted and self-hosted at any time.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href="https://syncropel.com/signup"
          className="inline-flex items-center gap-1.5 rounded bg-[#c2410c] px-3.5 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90 dark:bg-[#d97706]"
        >
          Sign up <ArrowUpRight size={13} aria-hidden />
        </Link>
        <Link
          href="/docs/get-started/hosted"
          className="inline-flex items-center gap-1.5 rounded border border-fd-border px-3.5 py-2 text-[12px] font-medium text-fd-foreground transition-colors hover:bg-fd-secondary"
        >
          Walkthrough →
        </Link>
        <Link
          href="/docs/get-started/pricing"
          className="inline-flex items-center text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground"
        >
          Pricing
        </Link>
      </div>
    </div>
  );
}

function OSPanel({ cmd, osLabel }: { cmd: OSCommand; osLabel: string }) {
  const fullCommand = useMemo(() => `${cmd.install}\n${cmd.start}`, [cmd]);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(fullCommand).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded border border-fd-border bg-fd-secondary">
        <div className="flex items-center justify-between gap-2 border-b border-fd-border/50 px-3 py-1.5">
          <span className="font-mono text-[11px] text-fd-muted-foreground">terminal · {osLabel}</span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy install commands'}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-fd-muted-foreground transition-colors hover:bg-fd-border/50 hover:text-fd-foreground"
          >
            {copied ? (
              <>
                <Check size={11} aria-hidden /> Copied
              </>
            ) : (
              <>
                <Copy size={11} aria-hidden /> Copy
              </>
            )}
          </button>
        </div>
        <div className="p-3 font-mono text-[12px] leading-[1.8]">
          <p>
            <span className="select-none text-fd-muted-foreground">{cmd.promptPrefix} </span>
            <span className="text-fd-foreground">{cmd.install}</span>
          </p>
          <p>
            <span className="select-none text-fd-muted-foreground">{cmd.promptPrefix} </span>
            <span className="text-fd-foreground">{cmd.start}</span>
          </p>
          <p className="text-[#059669] dark:text-[#34d399]">{cmd.ready}</p>
        </div>
      </div>
      <p className="text-[12px] leading-relaxed text-fd-muted-foreground">
        Single binary, ~10 MB. No Docker, no separate runtime. Data lives at{' '}
        <code className="rounded bg-fd-secondary px-1 py-0.5 font-mono text-[11px]">~/.syncro/hub.db</code>.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href="/docs/start"
          className="inline-flex items-center gap-1.5 rounded bg-[#c2410c] px-3.5 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90 dark:bg-[#d97706]"
        >
          Quickstart →
        </Link>
        <Link
          href="/docs/get-started/install"
          className="inline-flex items-center gap-1.5 rounded border border-fd-border px-3.5 py-2 text-[12px] font-medium text-fd-foreground transition-colors hover:bg-fd-secondary"
        >
          Install details
        </Link>
        <Link
          href="/docs/get-started/troubleshooting"
          className="inline-flex items-center text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground"
        >
          Troubleshooting
        </Link>
      </div>
    </div>
  );
}
