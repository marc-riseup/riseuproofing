import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';
import { ServiceBallparkButton } from '@/components/home/ServiceBallparkButton';
import { PHONE_HREF, PHONE_NUMBER } from '@/lib/utils';

const ALL_SERVICE_SCOPES = [
  { href: '/services/residential', label: 'Residential Shingle Reroofing' },
  { href: '/services/tile-roofing', label: 'Concrete & Clay Tile Relay' },
  { href: '/services/metal-roofing', label: 'Standing Seam Metal Roofing' },
  { href: '/services/roof-repair', label: '24/7 Emergency Leak Repair' },
  { href: '/services/roof-inspection', label: 'Drone & FLIR Roof Inspection' },
  { href: '/services/solar-roofing', label: 'Solar Panel Detach & Reset' },
  { href: '/services/commercial-roofing', label: 'Commercial Flat & TPO Roofing' },
  { href: '/services/roof-coating', label: 'Silicone Roof Coatings' },
  { href: '/services/modified-bitumen', label: 'Modified Bitumen & BUR' },
  { href: '/services/industrial-roofing', label: 'Industrial & Warehouse Roofing' },
  { href: '/services/commercial-roof-inspection', label: 'Commercial Infrared Audits' },
  { href: '/services/deck-builder', label: 'Custom Trex & View Decks' },
  { href: '/services/siding', label: 'James Hardie Fiber-Cement Siding' },
  { href: '/services/adu-construction', label: 'Permitted ADU Construction' },
  { href: '/services/home-additions', label: 'Room & Second-Story Additions' },
  { href: '/services/construction', label: 'Class B Exterior Construction' },
] as const;

export function ServicesOverview() {
  return (
    <section
      id="services"
      className="bg-[#F4F9FC] text-[#0B1B2B] py-16 sm:py-20 lg:py-24 border-b border-[#0B1B2B]/12"
    >
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-9 sm:pb-11 border-b border-[#0B1B2B]/12">
          <div className="max-w-[70ch]">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] leading-[1.08] text-[#0B1B2B]">
              Residential, Commercial &amp; Solar Roofing Services in San Diego
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-[#233B53] leading-relaxed max-w-[66ch] tabular-nums">
              Installed strictly by our in-house C-39 &amp; Class B crews to California CRC R908 and Title 24 code.
            </p>
          </div>

          <Link prefetch={false}
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0 tabular-nums"
          >
            <span>All 16 Services</span>
            <Icon name="arrow-right" className="w-4 h-4" />
          </Link>
        </div>

        {/* Flagship Spread 1: Residential Roof Replacement & Concrete/Clay Tile Relay */}
        <article className="mt-10 sm:mt-12 bg-[#FFFFFF] border border-[#0B1B2B]/12 shadow-[0_14px_34px_-12px_rgba(11,27,43,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#0B1B2B]/12 flex flex-col">
              <picture className="block w-full overflow-hidden bg-[#E5EFF7]">
                <source
                  srcSet="/img/services/residential-roofing-480.avif 480w, /img/services/residential-roofing.avif 960w"
                  sizes="(max-width: 640px) 260px, 720px"
                  type="image/avif"
                />
                <source
                  srcSet="/img/services/residential-roofing-480.webp 480w, /img/services/residential-roofing.webp 960w"
                  sizes="(max-width: 640px) 260px, 720px"
                  type="image/webp"
                />
                <img
                  src="/img/services/residential-roofing.webp"
                  alt="Owens Corning architectural shingle roof replacement installed in North County San Diego"
                  width={960}
                  height={630}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 sm:h-80 lg:h-[330px] object-cover"
                />
              </picture>

              <div className="grid grid-cols-1 sm:grid-cols-12 border-t border-[#0B1B2B]/12 flex-1">
                <div className="sm:col-span-5 border-b sm:border-b-0 sm:border-r border-[#0B1B2B]/12">
                  <picture className="block w-full h-full bg-[#E5EFF7]">
                    <source
                      srcSet="/img/services/tile-roofing-480.avif 480w, /img/services/tile-roofing.avif 960w"
                      sizes="(max-width: 640px) 260px, 320px"
                      type="image/avif"
                    />
                    <source
                      srcSet="/img/services/tile-roofing-480.webp 480w, /img/services/tile-roofing.webp 960w"
                      sizes="(max-width: 640px) 260px, 320px"
                      type="image/webp"
                    />
                    <img
                      src="/img/services/tile-roofing.webp"
                      alt="Concrete and Spanish clay tile roof lift-and-reset with synthetic underlayment in Carlsbad"
                      width={960}
                      height={536}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-44 sm:h-full object-cover"
                    />
                  </picture>
                </div>
                <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-center bg-[#FFFFFF]">
                  <p className="text-sm font-bold text-[#0B1B2B] tabular-nums">
                    Tile Lift &amp; Reset Saves ~50% vs. New Tile
                  </p>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#233B53] leading-relaxed tabular-nums">
                    Keep your 50-year clay or concrete tiles—we replace only the failed 20-year paper beneath.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.7rem] font-extrabold tracking-[-0.02em] leading-[1.14] text-[#0B1B2B]">
                  Residential Roof Replacement &amp; Concrete/Clay Tile Relay
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#233B53] leading-relaxed tabular-nums">
                  Bare-deck tear-offs with CDX dry-rot repair, 26-gauge valley flashings, ridge ventilation, and city permit sign-off.
                </p>

                <dl className="mt-5 grid grid-cols-3 border-y border-[#0B1B2B]/12 divide-x divide-[#0B1B2B]/12 py-3.5 text-left tabular-nums">
                  <div className="pr-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-[#3E5871]">
                      Lifespan
                    </dt>
                    <dd className="mt-0.5 text-xs sm:text-sm font-bold text-[#0B1B2B]">
                      30–50+ Yrs
                    </dd>
                  </div>
                  <div className="px-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-[#3E5871]">
                      Code
                    </dt>
                    <dd className="mt-0.5 text-xs sm:text-sm font-bold text-[#0B1B2B]">
                      CRC R908 · T24
                    </dd>
                  </div>
                  <div className="pl-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-[#3E5871]">
                      Warranty
                    </dt>
                    <dd className="mt-0.5 text-xs sm:text-sm font-bold text-[#0B1B2B]">
                      25-Yr System
                    </dd>
                  </div>
                </dl>

                <ul className="mt-5 space-y-2.5 text-sm">
                  <li>
                    <Link prefetch={false}
                      href="/services/residential"
                      className="inline-flex items-center gap-2 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                    >
                      <span>Owens Corning Shingle Roof Replacement</span>
                      <Icon name="arrow-right" className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                  <li>
                    <Link prefetch={false}
                      href="/services/tile-roofing"
                      className="inline-flex items-center gap-2 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                    >
                      <span>Concrete &amp; Spanish Clay Tile Lift-and-Reset</span>
                      <Icon name="arrow-right" className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                  <li>
                    <Link prefetch={false}
                      href="/services/metal-roofing"
                      className="inline-flex items-center gap-2 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                    >
                      <span>Standing Seam Class-A Wildfire Metal Roofs</span>
                      <Icon name="arrow-right" className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-[#0B1B2B]/12 flex flex-wrap gap-3">
                <ServiceBallparkButton service="replacement" label="Shingle Ballpark" />
                <ServiceBallparkButton
                  service="tile-relay"
                  label="Tile Relay Ballpark"
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Flagship Spread 2: 24/7 Emergency Roof Leak Repair & Storm Tarping */}
        <article className="mt-8 bg-[#FFFFFF] border border-[#0B1B2B]/12 shadow-[0_14px_34px_-12px_rgba(11,27,43,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-9 flex flex-col justify-between order-2 lg:order-1">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.7rem] font-extrabold tracking-[-0.02em] leading-[1.14] text-[#0B1B2B]">
                  24/7 Emergency Roof Leak Repair &amp; Storm Tarping
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#233B53] leading-relaxed max-w-[60ch] tabular-nums">
                  Oceanside dispatch arrives in 60–90 minutes with ridge-anchored storm tarps, FLIR thermal moisture tracing, and insurance photo scopes.
                </p>

                <dl className="mt-5 grid grid-cols-3 border-y border-[#0B1B2B]/12 divide-x divide-[#0B1B2B]/12 py-3.5 text-left tabular-nums">
                  <div className="pr-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-[#3E5871]">
                      Response
                    </dt>
                    <dd className="mt-0.5 text-xs sm:text-sm font-bold text-[#0B1B2B]">
                      60–90 Minutes
                    </dd>
                  </div>
                  <div className="px-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-[#3E5871]">
                      Diagnostics
                    </dt>
                    <dd className="mt-0.5 text-xs sm:text-sm font-bold text-[#0B1B2B]">
                      FLIR Moisture
                    </dd>
                  </div>
                  <div className="pl-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-[#3E5871]">
                      Insurance
                    </dt>
                    <dd className="mt-0.5 text-xs sm:text-sm font-bold text-[#0B1B2B]">
                      Photo Scope
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <Link prefetch={false}
                    href="/services/roof-repair"
                    className="inline-flex items-center gap-2 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>Emergency Leak Repair &amp; Valley Flashing</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                  <Link prefetch={false}
                    href="/services/roof-inspection"
                    className="inline-flex items-center gap-2 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>21-Point Roof &amp; Attic Inspection</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#0B1B2B]/12 flex flex-wrap items-center gap-3">
                <ServiceBallparkButton service="repair" label="Price Leak Repair" />
                <a
                  href={PHONE_HREF}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#0B1B2B]/22 bg-[#FFFFFF] px-4 py-2.5 text-sm font-bold text-[#0B1B2B] hover:border-[#0B1B2B] hover:bg-[#F4F9FC] transition-colors tabular-nums"
                >
                  <Icon name="phone" className="w-4 h-4 text-[#C92D20]" />
                  <span>24/7 Dispatch: {PHONE_NUMBER}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-l border-[#0B1B2B]/12 order-1 lg:order-2">
              <picture className="block w-full h-full bg-[#E5EFF7]">
                <source
                  srcSet="/img/services/roof-repair-480.avif 480w, /img/services/roof-repair.avif 960w"
                  sizes="(max-width: 640px) 260px, 620px"
                  type="image/avif"
                />
                <source
                  srcSet="/img/services/roof-repair-480.webp 480w, /img/services/roof-repair.webp 960w"
                  sizes="(max-width: 640px) 260px, 620px"
                  type="image/webp"
                />
                <img
                  src="/img/services/roof-repair.webp"
                  alt="Licensed San Diego roof repair technician replacing damaged underlayment and valley flashing"
                  width={960}
                  height={630}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 sm:h-80 lg:h-full object-cover"
                />
              </picture>
            </div>
          </div>
        </article>

        {/* Asymmetric Photo Showcase: Solar Detach & Reset (7 cols) + Commercial TPO & Coatings (5 cols) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <article className="lg:col-span-7 bg-[#FFFFFF] border border-[#0B1B2B]/12 shadow-[0_14px_34px_-12px_rgba(11,27,43,0.08)] flex flex-col">
            <picture className="block w-full overflow-hidden bg-[#E5EFF7] border-b border-[#0B1B2B]/12">
              <source
                srcSet="/img/projects/carlsbad-solar-detach-reset-after-480.avif 480w, /img/projects/carlsbad-solar-detach-reset-after.avif 960w"
                sizes="(max-width: 640px) 260px, 720px"
                type="image/avif"
              />
              <source
                srcSet="/img/projects/carlsbad-solar-detach-reset-after-480.webp 480w, /img/projects/carlsbad-solar-detach-reset-after.webp 960w"
                sizes="(max-width: 640px) 260px, 720px"
                type="image/webp"
              />
              <img
                src="/img/projects/carlsbad-solar-detach-reset-after.webp"
                alt="Reset residential solar panel array over flashed stanchions in Carlsbad, San Diego"
                width={960}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-56 sm:h-64 object-cover"
              />
            </picture>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-[-0.02em] leading-[1.15] text-[#0B1B2B]">
                  Solar Roofing &amp; Certified Panel Detach-and-Reset
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#233B53] leading-relaxed max-w-[60ch] tabular-nums">
                  Skip the 3-month solar wait—our crew isolates, crates, flashes, and torque-resets your array in-house with a 25-year roof system.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#0B1B2B]/12 flex flex-wrap items-center justify-between gap-3">
                <Link prefetch={false}
                  href="/services/solar-roofing"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                >
                  <span>Solar Detach, Reroof &amp; Reset</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5" />
                </Link>
                <ServiceBallparkButton service="solar" label="Price Solar Detach & Reset" />
              </div>
            </div>
          </article>

          <article className="lg:col-span-5 bg-[#FFFFFF] border border-[#0B1B2B]/12 shadow-[0_14px_34px_-12px_rgba(11,27,43,0.08)] flex flex-col">
            <picture className="block w-full overflow-hidden bg-[#E5EFF7] border-b border-[#0B1B2B]/12">
              <source
                srcSet="/img/projects/sd-commercial-tpo-after-480.avif 480w, /img/projects/sd-commercial-tpo-after.avif 960w"
                sizes="(max-width: 640px) 260px, (max-width: 1440px) 480px, 560px"
                type="image/avif"
              />
              <source
                srcSet="/img/projects/sd-commercial-tpo-after-480.webp 480w, /img/projects/sd-commercial-tpo-after.webp 960w"
                sizes="(max-width: 640px) 260px, (max-width: 1440px) 480px, 560px"
                type="image/webp"
              />
              <img
                src="/img/projects/sd-commercial-tpo-after.webp"
                alt="Heat-welded white Title 24 TPO commercial flat roof in San Diego"
                width={960}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-56 sm:h-64 object-cover"
              />
            </picture>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-[-0.02em] leading-[1.15] text-[#0B1B2B]">
                  Commercial Flat Roofing, TPO &amp; Coatings
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#233B53] leading-relaxed tabular-nums">
                  60-mil heat-welded TPO and high-solids silicone restorations with 20–25 Yr NDL protection and zero tenant downtime.
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Link prefetch={false}
                    href="/services/commercial-roofing"
                    className="inline-flex items-center gap-1.5 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>Commercial Flat &amp; TPO</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                  <Link prefetch={false}
                    href="/services/roof-coating"
                    className="inline-flex items-center gap-1.5 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>Silicone Coatings</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#0B1B2B]/12 flex items-center">
                <ServiceBallparkButton
                  service="flat"
                  label="Price Commercial Roof"
                  variant="outline"
                />
              </div>
            </div>
          </article>
        </div>

        {/* Full-Width Split Photo Feature: Class B Decks, Siding & ADUs */}
        <article className="mt-6 bg-[#FFFFFF] border border-[#0B1B2B]/12 shadow-[0_14px_34px_-12px_rgba(11,27,43,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#0B1B2B]/12">
              <picture className="block w-full h-full bg-[#E5EFF7]">
                <source
                  srcSet="/img/projects/sd-patio-cover-after-480.avif 480w, /img/projects/sd-patio-cover-after.avif 960w"
                  sizes="(max-width: 640px) 260px, (max-width: 1440px) 480px, 560px"
                  type="image/avif"
                />
                <source
                  srcSet="/img/projects/sd-patio-cover-after-480.webp 480w, /img/projects/sd-patio-cover-after.webp 960w"
                  sizes="(max-width: 640px) 260px, (max-width: 1440px) 480px, 560px"
                  type="image/webp"
                />
                <img
                  src="/img/projects/sd-patio-cover-after.webp"
                  alt="Custom coastal patio cover and Class B exterior construction in San Diego"
                  width={960}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-56 sm:h-full object-cover"
                />
              </picture>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-[-0.02em] leading-[1.15] text-[#0B1B2B]">
                  Class B Exterior Construction, Decks, Siding &amp; ADUs
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#233B53] leading-relaxed max-w-[62ch]">
                  Dual C-39 &amp; Class B licensing covers custom Trex view decks, James Hardie siding, structural dry-rot framing, and permitted ADUs.
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Link prefetch={false}
                    href="/services/deck-builder"
                    className="inline-flex items-center gap-1.5 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>Custom Trex Decks</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                  <Link prefetch={false}
                    href="/services/siding"
                    className="inline-flex items-center gap-1.5 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>James Hardie Siding</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                  <Link prefetch={false}
                    href="/services/adu-construction"
                    className="inline-flex items-center gap-1.5 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                  >
                    <span>Permitted ADUs</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#0B1B2B]/12 flex items-center">
                <ServiceBallparkButton
                  service="construction"
                  label="Price Exterior Construction"
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Progressive-Disclosure Drawer Linking All 16/16 Licensed Service Scopes */}
        <details className="group mt-8 border-y border-[#0B1B2B]/14 py-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm sm:text-base font-bold text-[#0B1B2B] [&::-webkit-details-marker]:hidden">
            <span className="tabular-nums">
              Browse All 16 Licensed Roofing, Solar &amp; Construction Scopes · CSLB #1096492
            </span>
            <Icon
              name="chevron-down"
              className="h-4 w-4 shrink-0 text-[#0F5C8C] transition-transform duration-200 group-open:rotate-180"
            />
          </summary>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {ALL_SERVICE_SCOPES.map((scope) => (
              <li key={scope.href}>
                <Link prefetch={false}
                  href={scope.href}
                  className="flex min-h-10 items-center justify-between gap-2 rounded-full border border-[#0B1B2B]/14 bg-[#FFFFFF] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0B1B2B] hover:border-[#0F5C8C] hover:text-[#0F5C8C] transition-colors"
                >
                  <span className="truncate">{scope.label}</span>
                  <Icon name="arrow-up-right" className="h-3.5 w-3.5 shrink-0 text-[#0F5C8C]" />
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </Container>
    </section>
  );
}
