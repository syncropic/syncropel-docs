'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Renders a Mermaid diagram from inline source. Lazy-loads the mermaid
 * library on the client so we don't pay the cost on pages that don't use it.
 *
 * Usage in MDX:
 *   <Mermaid chart={`flowchart TD\n  A --> B`} />
 *
 * Falls back to a `<pre>` of the source (with a note) if rendering fails
 * or scripts are blocked.
 */
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '_');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('mermaid');
        const mermaid = mod.default;
        const isDark =
          typeof document !== 'undefined' &&
          (document.documentElement.classList.contains('dark') ||
            window.matchMedia?.('(prefers-color-scheme: dark)').matches);
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'strict',
          fontFamily: 'inherit',
        });
        const rendered = await mermaid.render(`mmd-${id}`, chart);
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = rendered.svg;
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <figure className="my-6">
        <pre className="overflow-x-auto rounded-md border border-fd-border bg-fd-muted p-4 text-xs">
          <code>{chart}</code>
        </pre>
        <figcaption className="mt-2 text-xs text-fd-muted-foreground">
          {caption ? `${caption} — ` : ''}Diagram render failed: {error}. Source above.
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="my-6 flex flex-col items-center">
      <div ref={ref} className="mermaid-render w-full overflow-x-auto" aria-label={caption} />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
