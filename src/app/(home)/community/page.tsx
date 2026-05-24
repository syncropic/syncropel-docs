import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community',
  description: 'How to participate in the Syncropel open-source community — questions, ideas, bug reports, contributions.',
};

interface LinkCard {
  readonly title: string;
  readonly href: string;
  readonly desc: string;
  readonly external?: boolean;
}

const participate: ReadonlyArray<LinkCard> = [
  {
    title: 'GitHub',
    href: 'https://github.com/syncropic/syncropel',
    desc: 'The project home — overview, releases, the front door for the protocol',
    external: true,
  },
  {
    title: 'Discussions',
    href: 'https://github.com/syncropic/syncropel/discussions',
    desc: 'Questions, ideas, design proposals, show-and-tell',
    external: true,
  },
  {
    title: 'Issues',
    href: 'https://github.com/syncropic/syncropel/issues',
    desc: 'Bug reports and well-scoped feature requests',
    external: true,
  },
];

const contribute: ReadonlyArray<LinkCard> = [
  {
    title: 'Contributing guide',
    href: 'https://github.com/syncropic/syncropel/blob/main/CONTRIBUTING.md',
    desc: 'What’s open today, how to file issues, how to engage',
    external: true,
  },
  {
    title: 'Documentation source',
    href: 'https://github.com/syncropic/syncropel-docs',
    desc: 'Edit any page directly with a pull request',
    external: true,
  },
  {
    title: 'Code of Conduct',
    href: 'https://github.com/syncropic/syncropel/blob/main/CODE_OF_CONDUCT.md',
    desc: 'The behavior we expect across all community spaces',
    external: true,
  },
];

const policy: ReadonlyArray<LinkCard> = [
  {
    title: 'Security policy',
    href: 'https://github.com/syncropic/syncropel/blob/main/SECURITY.md',
    desc: 'How to report a vulnerability — do not file public issues',
    external: true,
  },
  {
    title: 'License',
    href: 'https://github.com/syncropic/syncropel/blob/main/LICENSE',
    desc: 'Apache-2.0 — the terms that govern the reference implementation',
    external: true,
  },
];

interface Section {
  readonly title: string;
  readonly tagline: string;
  readonly items: ReadonlyArray<LinkCard>;
}

const SECTIONS: ReadonlyArray<Section> = [
  { title: 'Participate', tagline: 'Where the conversation happens', items: participate },
  { title: 'Contribute', tagline: 'Help improve the project', items: contribute },
  { title: 'Project policies', tagline: 'Security, license, governance', items: policy },
];

function CardGrid({ items }: { items: ReadonlyArray<LinkCard> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {items.map((item) => {
        const external = item.external;
        const Anchor = external ? 'a' : Link;
        const extra = external
          ? { target: '_blank' as const, rel: 'noreferrer noopener' as const }
          : {};
        return (
          <Anchor
            key={item.href}
            href={item.href}
            {...extra}
            className="group block p-3 rounded border border-fd-border hover:border-fd-foreground/20 transition-colors"
          >
            <span className="text-[13px] font-medium text-fd-foreground group-hover:text-[#c2410c] dark:group-hover:text-[#d97706] transition-colors">
              {item.title}
            </span>
            <span className="block text-[11px] text-fd-muted-foreground mt-0.5 leading-relaxed">
              {item.desc}
            </span>
          </Anchor>
        );
      })}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center flex-1">
      <section className="w-full max-w-[800px] mx-auto px-6 pt-14 pb-6 text-center">
        <h1
          className="font-bold tracking-[-0.02em] leading-[1.1] mb-3"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
        >
          Community
        </h1>
        <p className="text-sm text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
          Syncropel is an open protocol. Here is where to ask questions,
          share what you are building, file bugs, and find the project policies.
        </p>
      </section>

      {SECTIONS.map((section) => (
        <div key={section.title} className="w-full">
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

      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="h-px bg-fd-border" />
      </div>

      <section className="w-full max-w-[800px] mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          Back to the docs hub
          <ArrowRight size={12} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
