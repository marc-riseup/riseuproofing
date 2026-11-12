import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { TrustLedger } from '@/components/home/TrustLedger';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { DroneInspectionBand } from '@/components/home/DroneInspectionBand';
import { LocalProofSection } from '@/components/home/LocalProofSection';
import { ReviewsAndFinancing } from '@/components/home/ReviewsAndFinancing';
import { HomepageFaqAndGuides, HOMEPAGE_FAQS } from '@/components/home/HomepageFaqAndGuides';
import { ClosingLeadSection } from '@/components/home/ClosingLeadSection';
import { buildMetadata, buildHomepageGraphJsonLd, serializeJsonLd } from '@/lib/seo/metadata';
import { getPublicReviews, getReviewStats } from '@/lib/reviews-server';

export const metadata: Metadata = buildMetadata({
  title: 'San Diego Roofing Contractor | Rise Up Roofing & Construction',
  description:
    'Licensed San Diego roofing contractor (#1096492). Roof replacement, tile underlayment relay, 24/7 leak repair & solar roofing. Instant 10-second ballpark.',
  path: '/',
});

export const revalidate = 3600;

export default async function HomePage() {
  const [reviews, stats] = await Promise.all([getPublicReviews(), getReviewStats()]);
  const homepageGraphJsonLd = buildHomepageGraphJsonLd({
    stats,
    reviews,
    faqs: HOMEPAGE_FAQS,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homepageGraphJsonLd) }}
      />
      <Hero stats={stats} />
      <TrustLedger />
      <ServicesOverview />
      <DroneInspectionBand />
      <LocalProofSection />
      <ReviewsAndFinancing initialReviews={reviews} stats={stats} />
      <HomepageFaqAndGuides />
      <ClosingLeadSection />
    </>
  );
}
