import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const BASE_URL = 'https://docs.syncropel.com';

export const dynamic = 'force-static';

// KEEP-set URLs that should appear in the sitemap. Pages outside this list
// are nav-hidden (meta.json) and URL-redirected (public/_redirects); excluding
// them from the sitemap prevents indexing of pages that 301 to a different
// canonical target.
const KEEP_URLS = new Set<string>([
  '/docs',
  '/docs/start',
  '/docs/get-started',
  '/docs/get-started/install',
  '/docs/get-started/first-run',
  '/docs/get-started/pricing',
  '/docs/get-started/hosted',
  '/docs/get-started/pairing',
  '/docs/get-started/troubleshooting',
  '/docs/get-started/reset-uninstall',
  '/docs/tutorials/first-task',
  '/docs/tutorials/first-thread',
  '/docs/tutorials/first-workspace',
  '/docs/concepts/records',
  '/docs/concepts/threads',
  '/docs/concepts/actors',
  '/docs/concepts/trust',
  '/docs/guides/task-management',
  '/docs/guides/search',
  '/docs/guides/namespaces',
  '/docs/guides/debugging',
  '/docs/guides/typescript-sdk',
  '/docs/guides/python-sdk',
  '/docs/guides/backup-restore',
  '/docs/guides/body-kind-manifest',
  '/docs/integrate/api-syncropic',
  '/docs/integrate/ai-clients',
  '/docs/operate/runbook',
  '/docs/operate/doctor',
  '/docs/operate/security-model',
  '/docs/reference/cli',
  '/docs/reference/api',
  '/docs/reference/configuration',
  '/docs/reference/glossary',
  '/docs/reference/faq',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  const docPages: MetadataRoute.Sitemap = source
    .getPages()
    .filter((page) => KEEP_URLS.has(page.url))
    .map((page) => ({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [home, ...docPages];
}
