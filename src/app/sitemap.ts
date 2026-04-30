import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const BASE_URL = 'https://docs.syncropel.com';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Landing page (the (home)/page.tsx route at /)
  const home: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  // Every MDX page under content/docs/ — Fumadocs gives us the full list.
  const docPages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [home, ...docPages];
}
