import { cache } from 'react';
import { reviews, type EnrichedReview } from '@/lib/data/reviews';
import { GOOGLE_REVIEWS_URL, YELP_REVIEWS_URL } from '@/lib/utils';

export type { EnrichedReview };

export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  googleCount: number;
  yelpCount: number;
  yelpTotalCount: number;
  yelpRating: number;
  googleRating: number;
  yelpUrl: string;
  googleUrl: string;
}

function getBackendUrl(): string | null {
  return (
    process.env.FASTAPI_BACKEND_URL ||
    (process.env.USE_FASTAPI === 'true' ? 'http://127.0.0.1:8000' : null)
  );
}

function getApiKey(): string {
  // No hard-coded fallback: the key must be supplied via the environment.
  return process.env.RISEUP_API_KEY || '';
}

function reviewKey(r: EnrichedReview): string {
  return `${(r.author || '').trim().toLowerCase()}|${(r.text || '').trim().toLowerCase()}`;
}

function mergeWithVerifiedReviews(apiReviews: EnrichedReview[]): EnrichedReview[] {
  if (apiReviews.length >= reviews.length) {
    return apiReviews;
  }
  const seen = new Set(apiReviews.map(reviewKey));
  const merged = [...apiReviews];
  for (const fallback of reviews) {
    const key = reviewKey(fallback);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(fallback);
    }
  }
  return merged;
}

function computeStatsFromList(list: EnrichedReview[]): ReviewStats {
  const googleReviews = list.filter((r) => r.source === 'google');
  const yelpReviews = list.filter((r) => r.source === 'yelp');
  const staticGoogleCount = reviews.filter((r) => r.source === 'google').length;
  const googleRating = googleReviews.length
    ? Math.round((googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length) * 10) / 10
    : 5.0;
  const yelpRating = yelpReviews.length
    ? Math.round((yelpReviews.reduce((sum, r) => sum + r.rating, 0) / yelpReviews.length) * 10) / 10
    : 5.0;
  const avgRating = list.length
    ? Math.round((list.reduce((sum, r) => sum + r.rating, 0) / list.length) * 10) / 10
    : 5.0;

  return {
    totalCount: Math.max(list.length, reviews.length),
    averageRating: avgRating,
    googleCount: Math.max(googleReviews.length, staticGoogleCount),
    yelpCount: yelpReviews.length,
    yelpTotalCount: Math.max(yelpReviews.length, 1),
    yelpRating,
    googleRating,
    yelpUrl: YELP_REVIEWS_URL,
    googleUrl: GOOGLE_REVIEWS_URL,
  };
}

const fetchPublicReviewsPayload = cache(
  async (): Promise<{ reviews?: EnrichedReview[]; stats?: Partial<ReviewStats> } | null> => {
    const backendUrl = getBackendUrl();
    if (!backendUrl) return null;
    try {
      const res = await fetch(`${backendUrl}/api/reviews/public`, {
        next: { revalidate: 60 },
        headers: { 'x-api-key': getApiKey() },
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('[reviews-server] Backend fetch failed, using static fallback:', err);
    }
    return null;
  },
);

/**
 * Fetch published reviews from FastAPI backend with graceful fallback to curated defaults
 */
export async function getPublicReviews(): Promise<EnrichedReview[]> {
  const data = await fetchPublicReviewsPayload();
  if (data && Array.isArray(data.reviews)) {
    return mergeWithVerifiedReviews(data.reviews);
  }
  return reviews;
}

/**
 * Fetch aggregated review counts and ratings from FastAPI backend or fallback to static defaults
 */
export async function getReviewStats(): Promise<ReviewStats> {
  const data = await fetchPublicReviewsPayload();
  if (data) {
    const mergedList = Array.isArray(data.reviews) ? mergeWithVerifiedReviews(data.reviews) : reviews;
    const computed = computeStatsFromList(mergedList);

    if (data.stats && (data.stats.totalCount ?? 0) >= reviews.length) {
      return {
        ...computed,
        ...data.stats,
        totalCount: Math.max(Number(data.stats.totalCount) || 0, computed.totalCount),
        googleCount: Math.max(Number(data.stats.googleCount) || 0, computed.googleCount),
        yelpTotalCount: Math.max(Number(data.stats.yelpTotalCount) || 0, computed.yelpTotalCount),
        googleUrl: data.stats.googleUrl || GOOGLE_REVIEWS_URL,
        yelpUrl: data.stats.yelpUrl || YELP_REVIEWS_URL,
      };
    }

    return computed;
  }

  return computeStatsFromList(reviews);
}
