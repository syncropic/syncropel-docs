import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded text-white text-xs font-bold"
            style={{ backgroundColor: '#b45309' }}
          >
            S
          </span>
          Syncropel Docs
        </span>
      ),
      url: '/',
      transparentMode: 'none',
    },
    links: [
      { text: 'syncropel.com', url: 'https://syncropel.com', external: true },
    ],
  };
}
