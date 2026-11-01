import { BRAND_DATA } from '@/lib/brand-data';
import { company, reviewsSummary } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { BallparkForm } from './BallparkForm';

export const HERO_AVIF_SRCSET =
  '/img/hero/skyline-640.avif 640w, /img/hero/skyline-1280.avif 1280w, /img/hero/skyline-1920.avif 1920w';
export const HERO_SIZES = '(max-width: 640px) 50vw, 100vw';

const AVATARS = [
  { src: '/img/hero/avatar-1.webp', initials: 'JR' },
  { src: '/img/hero/avatar-2.webp', initials: 'KL' },
  { src: '/img/hero/avatar-3.webp', initials: 'MT' },
];

export function Hero() {
  return (
    <section id="hero" className="hero" data-tone="light" aria-labelledby="hero-h">
      <div className="hero__stack wrap">
        {/* Owens Corning credential badge (Riseup 2.0 .badge.glass with overflowing Pink Panther) */}
        <div className="badge-wrap">
          <div className="ocbadge badge glass">
            <img
              className="ocbadge__crest badge__oc"
              src={BRAND_DATA.ocLogo}
              alt="Owens Corning logo"
              width="38"
              height="38"
            />
            <span className="ocbadge__text badge__text">
              <span className="ocbadge__kicker badge__eyebrow">
                Owens Corning<sup>®</sup>
              </span>
              <span className="ocbadge__title badge__title">Preferred Contractor</span>
            </span>
            <img
              className="ocbadge__panther badge__panther"
              src={BRAND_DATA.ocPanther}
              alt=""
              aria-hidden="true"
              width="48"
              height="59"
            />
          </div>
        </div>

        <h1 id="hero-h" className="h1 hero__h hero__title">
          San Diego Roofing &amp; Construction{' '}
          <mark className="marker hl">
            <span className="hl__bg" aria-hidden="true" />
            <span className="hl__text">Experts</span>
          </mark>
        </h1>

        <p className="hero__sub">Premium roof replacements, tile and underlayment, built for coastal weather.</p>

        <div id="hero-ctas" className="hero__ctas">
          <span className="magnet">
            <a className="btn btn--primary btn--lg hero__cta" href="#ballpark" data-red>
              <span>Get a Free Estimate</span>
              <Icon name="arrow" className="btn__arrow" />
            </a>
          </span>
          <a className="btn btn--glass btn--lg glass glass--hover hero__call" href={company.phoneHref}>
            <Icon name="phone" className="btn__icon" />
            <span>Call {company.phone}</span>
          </a>
        </div>

        {/* Riseup 2.0 Reviews Proof Strip: Avatars + Google/Yelp Medallions + 5.0 Pill + Copy */}
        <a
          className="rchip reviews glass glass--hover"
          href="#reviews"
          aria-label={`${reviewsSummary.rating} out of 5 stars across ${reviewsSummary.total} verified Google and Yelp reviews`}
        >
          <span className="reviews__dock">
            <span className="rchip__avatars reviews__avatars" aria-hidden="true">
              {AVATARS.map((av) => (
                <span key={av.initials} className="reviews__av-wrap">
                  <img
                    className="reviews__av"
                    src={av.src}
                    width="40"
                    height="40"
                    alt=""
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

              <span className="rchip__score reviews__score">
                <Icon name="star" className="rchip__star" />
                <span className="reviews__rating">{reviewsSummary.rating}</span>
              </span>
            </span>
          </span>

          <span className="rchip__meta reviews__copy">
            <strong className="reviews__headline">{reviewsSummary.total} Verified Reviews</strong>
            <span className="reviews__sub">
              <span className="reviews__cta">See all reviews</span>
              <Icon name="arrow" className="reviews__arrow" />
            </span>
          </span>
        </a>
      </div>

      {/* Cutout San Diego rooftops: transparent sky above the ridgeline, bottom feathers into the ballpark bar */}
      <div className="hero__stage">
        <div className="hero__roof" data-parallax="roofs">
          <picture>
            <source type="image/avif" srcSet={HERO_AVIF_SRCSET} sizes={HERO_SIZES} />
            <source
              type="image/webp"
              srcSet="/img/hero/skyline-640.webp 640w, /img/hero/skyline-1280.webp 1280w, /img/hero/skyline-1920.webp 1920w"
              sizes={HERO_SIZES}
            />
            <img
              className="hero__roof-img"
              src="/img/hero/skyline-1280.webp"
              alt="San Diego homes with clay tile, architectural shingle and solar roofs"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="hero__haze" data-parallax="haze" aria-hidden="true" />
      </div>

      <div className="hero__bar-wrap wrap">
        <BallparkForm />
      </div>
    </section>
  );
}
