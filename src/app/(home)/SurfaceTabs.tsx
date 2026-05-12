'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Code2, Laptop, Terminal } from 'lucide-react';

type SurfaceId = 'cli' | 'studio' | 'sdk';

const SURFACES: ReadonlyArray<{
  readonly id: SurfaceId;
  readonly label: string;
  readonly icon: typeof Terminal;
}> = [
  { id: 'cli', label: 'CLI', icon: Terminal },
  { id: 'studio', label: 'Studio', icon: Laptop },
  { id: 'sdk', label: 'SDK', icon: Code2 },
];

export function SurfaceTabs() {
  const [active, setActive] = useState<SurfaceId>('cli');

  return (
    <div className="w-full" role="region" aria-label="How to interact">
      <div role="tablist" aria-label="Surface" className="flex items-center gap-0.5 border-b border-fd-border">
        {SURFACES.map((s) => {
          const isActive = s.id === active;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(s.id)}
              className={[
                '-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-[12px] font-medium transition-colors',
                isActive
                  ? 'border-[#c2410c] text-fd-foreground dark:border-[#d97706]'
                  : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
              ].join(' ')}
            >
              <Icon size={13} aria-hidden />
              {s.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        aria-label={`${SURFACES.find((s) => s.id === active)?.label} surface`}
        className="pt-4"
      >
        {active === 'cli' && <CliPanel />}
        {active === 'studio' && <StudioPanel />}
        {active === 'sdk' && <SdkPanel />}
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-fd-muted-foreground">
        Same records, same threads, three surfaces. Add an{' '}
        <Link
          href="/docs/integrate/ai-clients"
          className="font-medium text-fd-foreground hover:underline"
        >
          MCP-compatible AI client
        </Link>{' '}
        (Claude Desktop, Cursor, Cline, Zed, OpenCode) and your assistant sees the same threads.
      </p>
    </div>
  );
}

function CliPanel() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-fd-muted-foreground">
        A task becomes a thread of records — INTEND → DO → KNOW. Trust evidence accumulates as work is reviewed.
      </p>
      <div className="overflow-hidden rounded border border-fd-border bg-fd-secondary">
        <div className="border-b border-fd-border/50 px-3 py-1.5">
          <span className="font-mono text-[11px] text-fd-muted-foreground">terminal</span>
        </div>
        <div className="p-3 font-mono text-[12px] leading-[1.8]">
          <p>
            <span className="select-none text-fd-muted-foreground">$ </span>
            <span className="text-fd-foreground">spl task add &quot;Fix checkout timeout&quot; --domain code</span>
          </p>
          <p className="text-fd-muted-foreground">✓ TASK-0042 created · thread th_a4f1…</p>
          <p>
            <span className="select-none text-fd-muted-foreground">$ </span>
            <span className="text-fd-foreground">spl task done TASK-0042 --summary &quot;Pool 10 → 50&quot;</span>
          </p>
          <p>
            <span className="select-none text-fd-muted-foreground">$ </span>
            <span className="text-fd-foreground">SPL_ACTOR=did:sync:agent:director spl task approve TASK-0042</span>
          </p>
          <p className="text-[#059669] dark:text-[#34d399]">✓ approved · trust(code) 0.473 → 0.501</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href="/docs/reference/cli"
          className="inline-flex items-center text-[12px] font-medium text-fd-foreground hover:underline"
        >
          CLI reference →
        </Link>
        <Link
          href="/docs/guides/task-management"
          className="inline-flex items-center text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground"
        >
          Task management
        </Link>
      </div>
    </div>
  );
}

function StudioPanel() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-fd-muted-foreground">
        Open the browser workspace. The same thread shows every record, who emitted it, and the trust evidence the
        thread produced — no re-typing, no separate dashboard.
      </p>
      <div className="overflow-hidden rounded border border-fd-border bg-fd-secondary">
        <div className="flex items-center gap-1.5 border-b border-fd-border/50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-fd-border" />
          <span className="h-2 w-2 rounded-full bg-fd-border" />
          <span className="h-2 w-2 rounded-full bg-fd-border" />
          <span className="ml-2 font-mono text-[11px] text-fd-muted-foreground">
            &lt;label&gt;.syncropel.app / Studio
          </span>
        </div>
        <Image
          src="/screenshots/desktop-threads.png"
          alt="Syncropel Studio showing a thread view with records, actors, and trust evidence in the rail"
          width={1280}
          height={720}
          className="block w-full h-auto"
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href="/docs/get-started/hosted"
          className="inline-flex items-center text-[12px] font-medium text-fd-foreground hover:underline"
        >
          Hosted signup →
        </Link>
        <Link
          href="/docs/get-started/pairing"
          className="inline-flex items-center text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground"
        >
          Pair this browser
        </Link>
      </div>
    </div>
  );
}

function SdkPanel() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-fd-muted-foreground">
        Emit records from any runtime — Node, Deno, Bun, Cloudflare Workers, browsers, Python. The same protocol
        from your code.
      </p>
      <div className="overflow-hidden rounded border border-fd-border bg-fd-secondary">
        <div className="border-b border-fd-border/50 px-3 py-1.5">
          <span className="font-mono text-[11px] text-fd-muted-foreground">typescript · @syncropel/sdk</span>
        </div>
        <div className="p-3 font-mono text-[12px] leading-[1.8] whitespace-pre overflow-x-auto">
          <span className="text-fd-muted-foreground">import</span>{' '}
          <span className="text-fd-foreground">{`{ Client }`}</span>{' '}
          <span className="text-fd-muted-foreground">from</span>{' '}
          <span className="text-[#059669] dark:text-[#34d399]">{`'@syncropel/sdk'`}</span>;{'\n\n'}
          <span className="text-fd-muted-foreground">const</span>{' '}
          <span className="text-fd-foreground">client</span> ={' '}
          <span className="text-fd-muted-foreground">new</span> Client(<span className="text-[#059669] dark:text-[#34d399]">{`'https://<label>.syncropel.app'`}</span>);{'\n\n'}
          <span className="text-fd-muted-foreground">await</span> client.emit({'{\n  '}
          act:{' '}
          <span className="text-[#059669] dark:text-[#34d399]">{`'INTEND'`}</span>,{'\n  '}
          thread: <span className="text-fd-foreground">taskThreadId</span>,{'\n  '}
          body: {`{ goal: `}<span className="text-[#059669] dark:text-[#34d399]">{`'Fix checkout timeout'`}</span>, domain:{' '}
          <span className="text-[#059669] dark:text-[#34d399]">{`'code'`}</span> {`}`},{'\n'}
          {`});`}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href="/docs/guides/typescript-sdk"
          className="inline-flex items-center text-[12px] font-medium text-fd-foreground hover:underline"
        >
          TypeScript SDK →
        </Link>
        <Link
          href="/docs/guides/python-sdk"
          className="inline-flex items-center text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground"
        >
          Python SDK
        </Link>
        <Link
          href="/docs/integrate/api-syncropic"
          className="inline-flex items-center text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground"
        >
          api.syncropic.com
        </Link>
      </div>
    </div>
  );
}
