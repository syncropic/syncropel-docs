import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Syncropel Docs',
    default: 'Syncropel Docs',
  },
  description:
    'Documentation for the Syncropel Protocol — the substrate for digital sovereignty and economic agency.',
  metadataBase: new URL('https://docs.syncropel.com'),
  openGraph: {
    title: 'Syncropel Docs',
    description:
      'Documentation for the Syncropel Protocol — the substrate for digital sovereignty and economic agency.',
    siteName: 'Syncropel Docs',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
