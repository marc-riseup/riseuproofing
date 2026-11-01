import { preload } from 'react-dom';
import { company, faqs, reviewsSummary } from '@/lib/content';
import { Sky } from '@/components/sky/Sky';
import { Director } from '@/components/motion/Director';
import { Header } from '@/components/chrome/Header';
import { MobileBar, RedArbiter } from '@/components/chrome/MobileBar';
import { Hero, HERO_AVIF_SRCSET, HERO_SIZES } from '@/components/hero/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { RoofScene } from '@/components/scenes/RoofScene';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Reviews } from '@/components/sections/Reviews';
import { Statement } from '@/components/sections/Statement';
import { AuditScene } from '@/components/scenes/AuditScene';
import { Standard } from '@/components/sections/Standard';
import { FinalCta } from '@/components/closing/FinalCta';
import { Footer } from '@/components/closing/Footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['RoofingContractor', 'LocalBusiness'],
      '@id': `${company.site}/#business`,
      name: company.name,
      legalName: company.legalName,
      url: company.site,
      telephone: '+1-760-622-1230',
      email: company.email,
      image: `${company.site}/og-image.jpg`,
      logo: `${company.site}/img/brand/logo-light-bg.svg`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.street,
        addressLocality: company.city,
        addressRegion: company.region,
        postalCode: company.zip,
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: company.lat, longitude: company.lng },
      areaServed: { '@type': 'AdministrativeArea', name: 'San Diego County, CA' },
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'license',
          name: 'California contractor license #1096492 (Class B General Building, C-39 Roofing)',
          recognizedBy: { '@type': 'GovernmentOrganization', name: 'Contractors State License Board', url: 'https://www.cslb.ca.gov' },
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'certification',
          name: 'Owens Corning Preferred Contractor (ID #247226)',
          recognizedBy: { '@type': 'Organization', name: 'Owens Corning' },
        },
      ],
      // Matches the visible reviews exactly: 10 reviews, all 5 stars, all rendered in #reviews.
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewsSummary.rating,
        reviewCount: reviewsSummary.total,
        bestRating: '5',
        worstRating: '1',
      },
      sameAs: [company.urls.google, company.urls.yelp, company.urls.oc, company.urls.chamber],
    },
    {
      '@type': 'FAQPage',
      '@id': `${company.site}/#faq`,
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
};

export default function Home() {
  // LCP: the skyline photo. Preload the AVIF set with high priority.
  preload('/img/hero/skyline-1280.avif', {
    as: 'image',
    type: 'image/avif',
    fetchPriority: 'high',
    imageSrcSet: HERO_AVIF_SRCSET,
    imageSizes: HERO_SIZES,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sky />
      <Director />
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <RoofScene />
        <Services />
        <Projects />
        <Reviews />
        <Statement />
        <AuditScene />
        <Standard />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
      <RedArbiter />
    </>
  );
}
