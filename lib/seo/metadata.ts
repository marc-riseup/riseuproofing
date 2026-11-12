import type { Metadata } from 'next';
import { serviceAreas as SERVICE_AREAS } from '@/lib/data/serviceAreas';
import { services as SERVICES } from '@/lib/data/services';
import { COMPANY_NAME, BASE_URL, CONTACT_EMAIL, LICENSE_NUMBER } from '@/lib/utils';

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;
export const ADDRESS_ID = `${BASE_URL}/#address`;

export const serializeJsonLd = (v: unknown): string =>
  JSON.stringify(v).replace(/</g, '\\u003c');

export function buildMetadata({ title, description, path, ogImage, noIndex }: MetadataOptions): Metadata {
  const trimmed = title.trim();
  const hasBrand = /rise\s*up|riseuprac/i.test(trimmed);
  const base = hasBrand ? trimmed : trimmed.replace(/\s*\|\s*(Free Estimates?|San Diego County)$/i, '').trim();
  const fullTitle = hasBrand
    ? trimmed.length > 65
      ? trimmed.replace(/\s*\|\s*San Diego County/i, '').trim()
      : trimmed
    : base.length <= 46
      ? `${base} | Rise Up Roofing`
      : base.length <= 55
        ? `${base} | Rise Up`
        : base;

  const url = `${BASE_URL}${path}`;
  const image = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${BASE_URL}${ogImage}`
    : `${BASE_URL}/og-image.jpg`;

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    alternates: { canonical: url },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: COMPANY_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export const BUSINESS_ADDRESS = {
  '@type': 'PostalAddress',
  '@id': ADDRESS_ID,
  streetAddress: '2182 S El Camino Real',
  addressLocality: 'Oceanside',
  addressRegion: 'CA',
  postalCode: '92054',
  addressCountry: 'US',
};

export interface LocalBusinessStatsInput {
  totalCount: number;
  averageRating: number;
}

export interface LocalBusinessReviewInput {
  author: string;
  rating: number;
  text: string;
}

export interface LocalBusinessJsonLdOptions {
  stats?: LocalBusinessStatsInput;
  reviews?: LocalBusinessReviewInput[];
}

function buildAggregateAndReviews(
  stats?: LocalBusinessStatsInput,
  reviews?: LocalBusinessReviewInput[]
) {
  const reviewCount = Math.max(stats?.totalCount ?? 0, reviews?.length ?? 0);
  const avgRating =
    stats && stats.totalCount > 0
      ? stats.averageRating
      : reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    ...(reviewCount > 0 && avgRating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating.toFixed(1),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviews && reviews.length > 0
      ? {
          review: reviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            reviewBody: r.text,
          })),
        }
      : {}),
  };
}

export function buildLocalBusinessJsonLd(
  input?: LocalBusinessStatsInput | LocalBusinessJsonLdOptions
) {
  const stats = input && 'totalCount' in input ? input : input?.stats;
  const reviews = input && !('totalCount' in input) ? input.reviews : undefined;

  return {
    '@context': 'https://schema.org',
    '@id': ORGANIZATION_ID,
    '@type': ['RoofingContractor', 'GeneralContractor'],
    name: COMPANY_NAME,
    legalName: 'Rise Up Roofing & Construction Inc.',
    url: BASE_URL,
    image: `${BASE_URL}/og-image.jpg`,
    logo: `${BASE_URL}/logo.svg`,
    slogan: `Dual-Licensed San Diego Roofing & General Building Contractor (CSLB #${LICENSE_NUMBER})`,
    description:
      'Dual-licensed San Diego County roofing and Class B general building contractor (CSLB #1096492, Owens Corning Preferred Contractor #247226) providing residential roof replacement, concrete and Spanish clay tile underlayment relays, 24/7 emergency leak repair, solar detach-and-reset, commercial flat roofing, and exterior construction across San Diego County, Temecula, and Murrieta.',
    telephone: '+17606221230',
    email: CONTACT_EMAIL,
    address: BUSINESS_ADDRESS,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.1812,
      longitude: -117.3395,
    },
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'California Contractors State License Board (CSLB)',
        value: `${LICENSE_NUMBER} (C-39 Roofing & Class B General Building)`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Owens Corning Preferred Contractor',
        value: '247226',
      },
    ],
    knowsAbout: [
      `CSLB License #${LICENSE_NUMBER} (C-39 Roofing & Class B General Building)`,
      'Owens Corning Preferred Contractor #247226',
      'Residential Roof Replacement & CRC R908 Bare-Deck Tear-Off',
      'Concrete & Spanish Clay Tile Underlayment Relay (Lift and Reset)',
      '24/7 Emergency Roof Leak Repair & FLIR Thermal Diagnostics',
      'Solar Panel Detach and Reset',
      'Commercial TPO, Modified Bitumen & Silicone Roof Coatings',
      'California Title 24 Part 6 Cool Roof Compliance',
    ],
    ...buildAggregateAndReviews(stats, reviews),
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'San Diego County' },
      ...SERVICE_AREAS.map((area) => ({
        '@type': 'City',
        name: area.name,
      })),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing & Exterior Construction Services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.shortDescription,
          url: `${BASE_URL}/services/${s.slug}`,
        },
      })),
    },
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-24:00',
    sameAs: [
      'https://www.google.com/maps/place/Rise+Up+Roofing+%26+Construction',
      'https://www.yelp.com/biz/rise-up-roofing-and-construction-oceanside-2',
      'https://www.instagram.com/riseuproofingandconstruction/',
      'https://www.facebook.com/profile.php?id=61551393216836',
      'https://business.escondidochamber.org/list/member/rise-up-roofing-and-construction-inc-9925',
      'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/247226',
    ],
  };
}

function buildWebsiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BASE_URL,
    name: COMPANY_NAME,
    inLanguage: 'en-US',
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  };
}

export function buildOrganizationRef(
  stats?: LocalBusinessStatsInput,
  reviews?: LocalBusinessReviewInput[]
) {
  return {
    '@id': ORGANIZATION_ID,
    '@type': ['RoofingContractor', 'GeneralContractor'],
    name: COMPANY_NAME,
    url: BASE_URL,
    image: `${BASE_URL}/og-image.jpg`,
    telephone: '+17606221230',
    priceRange: '$$',
    address: BUSINESS_ADDRESS,
    ...buildAggregateAndReviews(stats, reviews),
  };
}

export function buildRootGraphJsonLd() {
  const organizationNode: Record<string, unknown> = { ...buildLocalBusinessJsonLd() };
  delete organizationNode['@context'];
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode, buildWebsiteJsonLd()],
  };
}

export function buildHomepageGraphJsonLd({
  stats,
  reviews,
  faqs,
}: {
  stats?: LocalBusinessStatsInput;
  reviews?: LocalBusinessReviewInput[];
  faqs: { question: string; answer: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Merges aggregateRating + review onto #organization defined in RootLayout without duplicating 32-city/16-service blank nodes
      buildOrganizationRef(stats, reviews),
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#webpage`,
        url: `${BASE_URL}/`,
        name: 'San Diego Roofing Contractor | Rise Up Roofing & Construction',
        description:
          'Licensed San Diego roofing contractor (#1096492). Roof replacement, tile underlayment relay, 24/7 leak repair & solar roofing. Instant 10-second ballpark.',
        inLanguage: 'en-US',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORGANIZATION_ID },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/og-image.jpg`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/#faq`,
        isPartOf: { '@id': `${BASE_URL}/#webpage` },
        about: { '@id': ORGANIZATION_ID },
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export function buildServiceJsonLd(
  service: { name: string; shortDescription: string; slug: string },
  stats?: { totalCount: number; averageRating: number }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/services/${service.slug}#service`,
    name: service.name,
    description: service.shortDescription,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: buildOrganizationRef(stats),
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'San Diego County' },
      { '@type': 'City', name: 'Temecula' },
      { '@type': 'City', name: 'Murrieta' },
    ],
  };
}

export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildReviewJsonLd(reviews: { author: string; rating: number; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    ...buildOrganizationRef(undefined, reviews),
  };
}

export function buildJobPostingJsonLd(job: {
  title: string;
  description: string;
  employmentType: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    employmentType: job.employmentType.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@id': ORGANIZATION_ID,
      '@type': 'Organization',
      name: COMPANY_NAME,
      sameAs: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
    },
    jobLocation: {
      '@type': 'Place',
      address: BUSINESS_ADDRESS,
    },
    url: `${BASE_URL}/careers/${job.slug}`,
    datePosted: '2026-10-01',
  };
}

export function buildTechArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  keywords,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: datePublished || '2025-01-15T08:00:00-08:00',
    dateModified: dateModified || datePublished || '2026-10-02T08:00:00-07:00',
    author: {
      '@id': ORGANIZATION_ID,
      '@type': ['RoofingContractor', 'GeneralContractor'],
      name: COMPANY_NAME,
      url: BASE_URL,
      address: BUSINESS_ADDRESS,
      telephone: '+17606221230',
    },
    publisher: {
      '@id': ORGANIZATION_ID,
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
        width: 282,
        height: 74,
      },
    },
    keywords: keywords || ['Roof Tear Off Process', 'Roof Removal', 'San Diego Roofing'],
    inLanguage: 'en-US',
  };
}

export function buildProjectJsonLd(project: {
  title: string;
  scopeOfWork: string;
  city: string;
  slug: string;
  afterImage: string;
  materialsUsed: string[];
}) {
  const imageUrl = project.afterImage.startsWith('http')
    ? project.afterImage
    : `${BASE_URL}${project.afterImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.scopeOfWork,
    image: imageUrl,
    url: `${BASE_URL}/projects/${project.slug}`,
    locationCreated: {
      '@type': 'Place',
      name: `${project.city}, California`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.city,
        addressRegion: 'CA',
        addressCountry: 'US',
      },
    },
    author: {
      '@id': ORGANIZATION_ID,
      '@type': ['RoofingContractor', 'GeneralContractor'],
      name: COMPANY_NAME,
      url: BASE_URL,
    },
  };
}
