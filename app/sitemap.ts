import type { MetadataRoute } from 'next';
import { getAllServiceSlugs } from '@/lib/data/services';
import { getAllProjectSlugs } from '@/lib/data/projects';
import { getAllServiceAreaSlugs } from '@/lib/data/serviceAreas';
import { GUIDES } from '@/lib/data/guides';
import { BASE_URL } from '@/lib/utils';

// Stable content release timestamps (Prevents Google from invalidating lastmod due to fake dynamic updates)
const RECENT_UPDATE = new Date('2026-10-11T00:00:00Z');
const PROJECT_UPDATE = new Date('2026-09-20T00:00:00Z');
const STATIC_UPDATE = new Date('2026-10-02T00:00:00Z');

const PRIMARY_CITY_SLUGS = new Set([
  'san-diego',
  'oceanside',
  'carlsbad',
  'encinitas',
  'vista',
  'san-marcos',
  'escondido',
  'poway',
  'temecula',
  'murrieta',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: RECENT_UPDATE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: RECENT_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/roof-financing-san-diego`, lastModified: STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/service-area`, lastModified: RECENT_UPDATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/contact`, lastModified: STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/guides`, lastModified: RECENT_UPDATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: PROJECT_UPDATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/reviews`, lastModified: RECENT_UPDATE, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/about/roof-tear-off-process`, lastModified: STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/about`, lastModified: STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/careers`, lastModified: STATIC_UPDATE, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: STATIC_UPDATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: STATIC_UPDATE, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: RECENT_UPDATE,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const cityPages: MetadataRoute.Sitemap = getAllServiceAreaSlugs().map((slug) => ({
    url: `${BASE_URL}/service-area/${slug}`,
    lastModified: RECENT_UPDATE,
    changeFrequency: 'monthly',
    priority: PRIMARY_CITY_SLUGS.has(slug) ? 0.8 : 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt || guide.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const projectPages: MetadataRoute.Sitemap = getAllProjectSlugs().map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: PROJECT_UPDATE,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  // Note: Individual /careers/[slug] subpages carry noIndex: true and are excluded from sitemap
  // to concentrate crawl budget on the 81 canonical commercial, editorial, and regional landing pages.
  return [...staticPages, ...servicePages, ...cityPages, ...guidePages, ...projectPages];
}
