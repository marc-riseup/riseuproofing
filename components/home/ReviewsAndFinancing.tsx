import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';
import type { EnrichedReview, ReviewStats } from '@/lib/reviews-server';

interface ReviewsAndFinancingProps {
  initialReviews: EnrichedReview[];
  stats: ReviewStats;
}

function stripEmoji(input: string): string {
  return input.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

function trimQuote(text: string, max = 192): string {
  if (text.length <= max) return text;
  const windowText = text.slice(0, max + 1);

  for (const sep of ['!! ', '. ', '! ', '? ']) {
    const idx = windowText.lastIndexOf(sep);
    if (idx >= Math.floor(max * 0.55)) {
      return windowText.slice(0, idx + sep.trimEnd().length).trim();
    }
  }

  for (const sep of ['; ', ', ', ' ']) {
    const idx = windowText.lastIndexOf(sep);
    if (idx >= Math.floor(max * 0.55)) {
      return `${windowText.slice(0, idx).replace(/[,;:\s]+$/, '')}…`;
    }
  }

  return `${text.slice(0, max).trim()}…`;
}

function selectEditorialReviews(list: EnrichedReview[]): EnrichedReview[] {
  const preferredAuthors = [
    'T Hobart',
    'Damian Enrique Diaz',
    'Steve Ponce',
    'Alexandria V',
  ];
  const picked: EnrichedReview[] = [];
  const used = new Set<string>();

  for (const name of preferredAuthors) {
    const match = list.find((r) => r.author.toLowerCase() === name.toLowerCase() && r.rating >= 5);
    if (match) {
      picked.push(match);
      used.add(match.author.toLowerCase());
    }
  }

  for (const r of list) {
    if (picked.length >= 4) break;
    if (!used.has(r.author.toLowerCase()) && r.rating >= 5 && r.text.length >= 60) {
      picked.push(r);
      used.add(r.author.toLowerCase());
    }
  }

  return picked.slice(0, 4);
}

function ReviewStars({ rating, iconClass }: { rating: number; iconClass: string }) {
  const count = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div
      className="flex items-center gap-0.5 text-[#A87200]"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: count }, (_, idx) => (
        <Icon key={idx} name="star" className={iconClass} />
      ))}
    </div>
  );
}

export function ReviewsAndFinancing({ initialReviews, stats }: ReviewsAndFinancingProps) {
  const featured = selectEditorialReviews(initialReviews);
  const leadReview = featured[0];
  const supportingReviews = featured.slice(1, 4);
  const ratingText = (stats.averageRating || 5.0).toFixed(1);

  return (
    <section
      id="reviews"
      className="bg-[#FCF8F0] text-[#0B1B2B] py-16 sm:py-20 lg:py-24 border-b border-[#4A3F31]/15"
    >
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-9 sm:pb-11 border-b border-[#4A3F31]/16">
          <div className="max-w-[70ch]">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] leading-[1.08] text-[#0B1B2B] tabular-nums">
              5-Star Rated by San Diego &amp; North County Property Owners
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-[#4A3F31] leading-relaxed max-w-[65ch] tabular-nums">
              Rated <strong className="font-bold text-[#0B1B2B]">{ratingText} out of 5.0</strong> across{' '}
              <strong className="font-bold text-[#0B1B2B]">{stats.totalCount}+ verified reviews</strong>—personally overseen by owners Edith &amp; Luis.
            </p>
          </div>

          <Link prefetch={false}
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1B2B] hover:text-[#4A3F31] underline underline-offset-4 shrink-0"
          >
            <span>All Verified Reviews</span>
            <Icon name="arrow-right" className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left 7 Cols: Editorial Pull-Quote Spotlight + Crisp Scannable Rows */}
          <div className="lg:col-span-7">
            {leadReview && (
              <article className="bg-[#FFFFFF] border border-[#4A3F31]/18 p-6 sm:p-7 shadow-[0_12px_28px_-12px_rgba(74,63,49,0.12)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <ReviewStars rating={leadReview.rating} iconClass="w-4 h-4 fill-current" />
                    <span className="text-sm font-extrabold text-[#0B1B2B]">
                      {leadReview.author}
                    </span>
                    <span className="text-xs font-semibold text-[#4A3F31]">
                      · {leadReview.neighborhood || leadReview.location || 'San Diego County, CA'}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#4A3F31] tabular-nums">
                    {leadReview.projectType || 'Verified Google Review'}
                    {leadReview.date ? ` · ${leadReview.date}` : ''}
                  </span>
                </div>

                <blockquote className="mt-3.5 text-base sm:text-lg font-medium text-[#0B1B2B] leading-relaxed tabular-nums">
                  &ldquo;{stripEmoji(leadReview.text)}&rdquo;
                </blockquote>

                <div className="mt-4 pt-3.5 border-t border-[#4A3F31]/14 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A3F31]">
                  <span className="font-bold text-[#0B1B2B]">
                    Personally overseen &amp; signed off by Edith &amp; Luis · Owners
                  </span>
                  <span className="font-semibold">Direct W-2 Crew Supervision</span>
                </div>
              </article>
            )}

            {supportingReviews.length > 0 && (
              <div className="mt-5 divide-y divide-[#4A3F31]/16 border-b border-[#4A3F31]/16">
                {supportingReviews.map((rev) => (
                  <article key={`${rev.author}-${rev.date || ''}`} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ReviewStars rating={rev.rating} iconClass="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-extrabold text-[#0B1B2B]">
                          {rev.author}
                        </span>
                        <span className="text-xs font-semibold text-[#4A3F31]">
                          · {rev.neighborhood || rev.location || 'San Diego County, CA'}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[#4A3F31] tabular-nums">
                        {rev.projectType || 'Verified Review'}
                        {rev.date ? ` · ${rev.date}` : ''}
                      </span>
                    </div>

                    <blockquote className="mt-2 text-sm text-[#0B1B2B] leading-relaxed">
                      &ldquo;{trimQuote(stripEmoji(rev.text), 192)}&rdquo;
                    </blockquote>
                  </article>
                ))}
              </div>
            )}

            {/* Verified External Profile Credentials */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-bold text-[#0B1B2B] tabular-nums">
              <span className="text-[#4A3F31] font-semibold">Verify independently:</span>
              <a
                href={stats.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0B1B2B] hover:text-[#4A3F31] underline underline-offset-4"
              >
                <span>Google ({ratingText})</span>
                <Icon name="external-link" className="w-3.5 h-3.5" />
              </a>
              <a
                href={stats.yelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0B1B2B] hover:text-[#4A3F31] underline underline-offset-4"
              >
                <span>Yelp Profile</span>
                <Icon name="external-link" className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/247226"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0B1B2B] hover:text-[#4A3F31] underline underline-offset-4"
              >
                <span>Owens Corning #247226</span>
                <Icon name="external-link" className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.cslb.ca.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0B1B2B] hover:text-[#4A3F31] underline underline-offset-4"
              >
                <span>CSLB #1096492</span>
                <Icon name="external-link" className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://business.escondidochamber.org/list/member/rise-up-roofing-and-construction-inc-9925"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0B1B2B] hover:text-[#4A3F31] underline underline-offset-4"
              >
                <span>Escondido Chamber #9925</span>
                <Icon name="external-link" className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right 5 Cols: Visual Coastal Estate 25-Year Warranty & $0 Down Financing Card */}
          <aside className="lg:col-span-5 bg-[#FFFFFF] border border-[#4A3F31]/20 overflow-hidden shadow-[0_18px_40px_-14px_rgba(74,63,49,0.14)]">
            <picture className="block w-full border-b border-[#0B1B2B]/12 bg-[#E5EFF7]">
              <source
                srcSet="/img/statement/statement-640.avif 640w, /img/statement/statement.avif 1600w"
                sizes="(max-width: 1023px) 360px, 500px"
                type="image/avif"
              />
              <source
                srcSet="/img/statement/statement-640.webp 640w, /img/statement/statement.webp 1600w"
                sizes="(max-width: 1023px) 360px, 500px"
                type="image/webp"
              />
              <img
                src="/img/statement/statement.webp"
                alt="Completed coastal San Diego Spanish clay tile roof overlooking the Pacific Ocean"
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className="w-full h-48 sm:h-52 object-cover"
              />
            </picture>

            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-4 pb-5 border-b border-[#0B1B2B]/12">
                <img
                  src="/img/brand/oc-preferred-seal-136.webp"
                  alt="Owens Corning Roofing Preferred Contractor Seal"
                  width={68}
                  height={68}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-[-0.02em] leading-tight text-[#0B1B2B] tabular-nums">
                    $0 Down Financing &amp; 25-Year Warranty
                  </h3>
                  <p className="mt-1 text-xs text-[#4A3F31] tabular-nums">
                    Owens Corning Preferred Contractor #247226
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 border-b border-[#0B1B2B]/12 tabular-nums">
                <div className="py-3.5 pr-4 border-b border-r border-[#0B1B2B]/12">
                  <dt className="text-xs font-semibold text-[#4A3F31]">Upfront</dt>
                  <dd className="mt-0.5 text-sm sm:text-base font-extrabold text-[#0B1B2B]">
                    $0 Down
                  </dd>
                </div>
                <div className="py-3.5 pl-4 border-b border-[#0B1B2B]/12">
                  <dt className="text-xs font-semibold text-[#4A3F31]">Promo Interest</dt>
                  <dd className="mt-0.5 text-sm sm:text-base font-extrabold text-[#0B1B2B]">
                    0% APR Plans
                  </dd>
                </div>
                <div className="py-3.5 pr-4 border-r border-[#0B1B2B]/12">
                  <dt className="text-xs font-semibold text-[#4A3F31]">Monthly (OAC)</dt>
                  <dd className="mt-0.5 text-sm sm:text-base font-extrabold text-[#0B1B2B]">
                    From $149/mo
                  </dd>
                </div>
                <div className="py-3.5 pl-4">
                  <dt className="text-xs font-semibold text-[#4A3F31]">System Protection</dt>
                  <dd className="mt-0.5 text-sm sm:text-base font-extrabold text-[#0B1B2B]">
                    25-Yr Warranty
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs sm:text-sm text-[#4A3F31] leading-relaxed tabular-nums">
                Check fixed monthly rates in 2 minutes via soft pull—zero credit impact, covering materials and labor.
              </p>

              <Link prefetch={false}
                href="/roof-financing-san-diego"
                className="mt-5 w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0B1B2B] hover:bg-[#16304B] px-5 py-3 text-sm font-bold text-white transition-colors tabular-nums"
              >
                <span>Explore $0 Down Financing &amp; Calculator</span>
                <Icon name="arrow-right" className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
