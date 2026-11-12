import { preload } from 'react-dom';
import { PHONE_HREF, PHONE_NUMBER } from '@/lib/utils';
import type { ReviewStats } from '@/lib/reviews-server';
import { HeroBallparkBar } from './HeroBallparkBar';

const HERO_AVIF_SRCSET =
  '/img/hero/skyline-640.avif 640w, /img/hero/skyline-960.avif 960w, /img/hero/skyline-1280.avif 1280w, /img/hero/skyline-1920.avif 1920w';
const HERO_WEBP_SRCSET =
  '/img/hero/skyline-640.webp 640w, /img/hero/skyline-960.webp 960w, /img/hero/skyline-1280.webp 1280w, /img/hero/skyline-1920.webp 1920w';
const HERO_SIZES = '(max-width: 640px) 360px, (max-width: 1440px) 960px, 1280px';

const AVATARS = [
  { src: '/img/hero/avatar-1.webp', initials: 'JR' },
  { src: '/img/hero/avatar-2.webp', initials: 'KL' },
  { src: '/img/hero/avatar-3.webp', initials: 'MT' },
] as const;

const OC_PROFILE_URL =
  'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/247226';

export function Hero({ stats }: { stats?: ReviewStats }) {
  preload('/img/hero/skyline-1280.avif', {
    as: 'image',
    type: 'image/avif',
    fetchPriority: 'high',
    imageSrcSet: HERO_AVIF_SRCSET,
    imageSizes: HERO_SIZES,
  });

  const ratingLabel = stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0';
  const reviewCount = Math.max(stats?.totalCount ?? 9, 9);

  return (
    <section
      id="hero"
      className="hero pt-[108px] md:pt-[116px]"
      aria-labelledby="hero-h"
    >
      {/* Scoped Daylight Coastal San Diego Sky (position: absolute inside .hero) */}
      <div className="hero-sky" aria-hidden="true">
        <div className="hero-sky__gradient" />
        <div className="hero-sky__orb">
          <div className="hero-sky__sun">
            <div className="hero-sky__sun-corona" />
            <div className="hero-sky__sun-core" />
          </div>
        </div>
        <div className="hero-sky__clouds">
          <span className="hero-cloud hero-cloud--far hero-cloud--f1" />
          <span className="hero-cloud hero-cloud--far hero-cloud--f2" />
          <span className="hero-cloud hero-cloud--near hero-cloud--n1" />
          <span className="hero-cloud hero-cloud--near hero-cloud--n2" />
        </div>
      </div>

      <div className="hero__stack hero-wrap">
        {/* Verified Owens Corning Preferred Contractor (#247226) Credential Badge */}
        <div className="badge-wrap">
          <a
            href={OC_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ocbadge hero-glass hero-glass--hover"
            aria-label="Verified Owens Corning Preferred Contractor #247226"
          >
            <img
              className="ocbadge__crest"
              src="/img/brand/owens-corning.svg"
              alt="Owens Corning logo"
              width={38}
              height={38}
              fetchPriority="low"
              decoding="async"
            />
            <span className="ocbadge__text">
              <span className="ocbadge__brand">
                Owens Corning<sup>&reg;</sup>
              </span>
              <span className="ocbadge__title">Preferred Contractor</span>
            </span>
            <img
              className="ocbadge__panther"
              src="/img/brand/oc-panther.svg"
              alt=""
              aria-hidden="true"
              width={48}
              height={59}
              fetchPriority="low"
              decoding="async"
            />
          </a>
        </div>

        <h1 id="hero-h" className="hero__title">
          San Diego&apos;s Trusted Roofing &amp; Construction{' '}
          <mark className="hero-mark">
            <span className="hero-mark__bg" aria-hidden="true" />
            <span className="hero-mark__text">Contractor</span>
          </mark>
        </h1>

        <p className="hero__sub">
          Coastal reroofs, tile relays, solar resets &amp; 24/7 leak repair across San Diego.
        </p>

        <div id="hero-ctas" className="hero__ctas">
          <a className="hero-btn hero-btn--primary hero-btn--lg hero__cta" href="#hero-estimator">
            <span>Get a Free Estimate</span>
            <svg className="hero-btn__arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15m-6-6 6 6-6 6" />
            </svg>
          </a>
          <a
            className="hero-btn hero-btn--glass hero-btn--lg hero-glass hero-glass--hover hero__call tabular-nums"
            href={PHONE_HREF}
          >
            <svg className="hero-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
            </svg>
            <span>Call {PHONE_NUMBER}</span>
          </a>
        </div>

        {/* Verified Google & Yelp Reviews Proof Strip */}
        <a
          className="rchip reviews hero-glass hero-glass--hover"
          href="#reviews"
        >
          <span className="reviews__dock">
            <span className="reviews__avatars" aria-hidden="true">
              {AVATARS.map((av) => (
                <span key={av.initials} className="reviews__av-wrap">
                  <img
                    className="reviews__av"
                    src={av.src}
                    width={40}
                    height={40}
                    alt=""
                    fetchPriority="low"
                    decoding="async"
                  />
                  <span className="reviews__av-init">{av.initials}</span>
                </span>
              ))}
            </span>

            <span className="reviews__pill">
              <span className="reviews__platforms" aria-hidden="true">
                <span className="reviews__plat reviews__plat--google">
                  <svg className="reviews__g" viewBox="0 0 48 48">
                    <path
                      fill="#4285F4"
                      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12.7 28.1A12 12 0 0 1 12 24c0-1.4.3-2.8.7-4.1l-6.4-5.2A20 20 0 0 0 4 24c0 3.2.8 6.3 2.2 9.1z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 12c3.1 0 5.8 1.2 8 3l5.6-5.6C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7l6.4 5.2C14.4 15.1 18.8 12 24 12z"
                    />
                  </svg>
                </span>
                <span className="reviews__plat reviews__plat--yelp">
                  <svg className="reviews__yelp" viewBox="0 0 24 24" fill="#FF1A1A">
                    <path d="M11.15 10.45c.08.52-.54.82-.9.44L4.78 5.02c-.4-.43-.22-1.13.33-1.35l3.72-1.48c.56-.22 1.17.16 1.24.76l1.08 7.5z" />
                    <path d="M13.72 11.2c-.48.18-.92-.34-.62-.76l3.48-4.88c.35-.49 1.08-.49 1.43 0l2.14 3.01c.35.49.12 1.18-.45 1.39l-5.98 1.24z" />
                    <path d="M13.85 13.45c-.48-.2-.46-.88.03-1.05l5.72-1.98c.57-.2 1.16.25 1.12.85l-.26 3.68c-.04.6-.68.96-1.22.68l-5.39-2.18z" />
                    <path d="M12.02 14.65c.25-.46.93-.35 1.02.17l1.02 5.92c.1.58-.41 1.09-.99.98l-3.62-.68c-.58-.11-.88-.75-.58-1.27l3.15-5.12z" />
                    <path d="M10.18 12.92c.46.24.44.91-.03 1.12l-5.52 2.46c-.55.25-1.18-.17-1.18-.77l.02-3.68c0-.6.62-.99 1.17-.73l5.54 1.6z" />
                  </svg>
                </span>
              </span>

              <span className="reviews__score">
                <svg className="rchip__star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />
                </svg>
                <span className="reviews__rating tabular-nums">{ratingLabel}</span>
              </span>
            </span>
          </span>

          <span className="reviews__copy">
            <strong className="reviews__headline">{reviewCount} Verified Reviews</strong>
            <span className="reviews__sub">
              <span className="reviews__cta">See all reviews</span>
              <svg className="reviews__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </span>
          </span>
        </a>
      </div>

      {/* Cutout San Diego Rooftop Skyline */}
      <div className="hero__stage">
        <div className="hero__roof">
          <picture>
            <source type="image/avif" srcSet={HERO_AVIF_SRCSET} sizes={HERO_SIZES} />
            <source type="image/webp" srcSet={HERO_WEBP_SRCSET} sizes={HERO_SIZES} />
            <img
              className="hero__roof-img"
              src="/img/hero/skyline-1280.webp"
              alt="San Diego coastal homes with clay tile, architectural shingle, and solar roofing"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
        </div>
        <div className="hero__haze" aria-hidden="true" />
      </div>

      {/* Horizontal Glass Ballpark Instrument Bar + Inline Expandable Drawer */}
      <div className="hero__bar-wrap hero-wrap">
        <HeroBallparkBar />
      </div>
    </section>
  );
}
