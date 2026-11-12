import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';
import { BeforeAfterCompare } from '@/components/home/BeforeAfterCompare';
import { LazyServiceMap } from '@/components/home/LazyServiceMap';
import { REGIONAL_SERVICE_AREAS, getServiceAreaBySlug } from '@/lib/data/serviceAreas';

const SURVEYED_CASE_STUDIES = [
  {
    slug: 'sd-commercial-tpo',
    city: 'San Diego',
    title: '10,000 sq ft Commercial 60-Mil TPO Flat Roof',
    spec: '60-Mil TPO · Title 24 Cool Roof · 20–25 Yr NDL',
    avif: '/img/projects/sd-commercial-tpo-after-240.avif',
    webp: '/img/projects/sd-commercial-tpo-after-240.webp',
    alt: 'Commercial white 60-mil TPO flat roof completed in San Diego',
  },
  {
    slug: 'escondido-roof-coating',
    city: 'Escondido',
    title: 'Industrial Silicone Roof Coating Restoration',
    spec: 'High-Solids Silicone · Saved 50%+ vs. Tear-Off',
    avif: '/img/projects/escondido-roof-coating-after-240.avif',
    webp: '/img/projects/escondido-roof-coating-after-240.webp',
    alt: 'High-solids reflective silicone roof coating restoration in Escondido',
  },
  {
    slug: 'sd-underlayment-repair',
    city: 'San Diego',
    title: 'Tile Underlayment & CDX Decking Repair',
    spec: 'CDX Decking · Dual Synthetic · 25-Yr System',
    avif: '/img/projects/sd-underlayment-repair-after-240.avif',
    webp: '/img/projects/sd-underlayment-repair-after-240.webp',
    alt: 'Tile underlayment and CDX wood decking repair completed in San Diego',
  },
  {
    slug: 'oceanside-siding',
    city: 'Oceanside',
    title: 'Coastal James Hardie Siding Renovation',
    spec: '316 Marine Stainless · Class-A Fire Rated',
    avif: '/img/projects/oceanside-siding-after-240.avif',
    webp: '/img/projects/oceanside-siding-after-240.webp',
    alt: 'Coastal James Hardie fiber-cement siding renovation in Oceanside',
  },
  {
    slug: 'sd-patio-cover',
    city: 'San Diego',
    title: 'Heavy-Timber Patio Cover & Roof Tie-In',
    spec: 'Glu-Lam Timber · Permitted Roof Tie-In',
    avif: '/img/projects/sd-patio-cover-after-240.avif',
    webp: '/img/projects/sd-patio-cover-after-240.webp',
    alt: 'Custom heavy-timber patio cover and shingle roof tie-in in San Diego',
  },
] as const;

export function LocalProofSection() {
  return (
    <section
      id="projects"
      className="bg-[#FFFFFF] text-[#0B1B2B] py-16 sm:py-20 lg:py-24 border-b border-[#0B1B2B]/12"
    >
      <Container>
        {/* Part 1: Before/After Spotlight + Thumbnail Case Study Rows */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-9 sm:pb-11 border-b border-[#0B1B2B]/12">
          <div className="max-w-[70ch]">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] leading-[1.08] text-[#0B1B2B]">
              Recent Roofing &amp; Construction Projects Across San Diego County
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-[#233B53] leading-relaxed max-w-[66ch]">
              Drag the slider to inspect real before-and-after reroofs, tile relays, solar resets, and commercial restorations.
            </p>
          </div>

          <Link prefetch={false}
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0 tabular-nums"
          >
            <span>All 11 Case Studies</span>
            <Icon name="arrow-right" className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7">
            <BeforeAfterCompare />
          </div>

          <div className="lg:col-span-5">
            <div className="border-t border-[#0B1B2B]/14 divide-y divide-[#0B1B2B]/12 border-b">
              {SURVEYED_CASE_STUDIES.map((study) => (
                <Link prefetch={false}
                  key={study.slug}
                  href={`/projects/${study.slug}`}
                  className="group flex items-center gap-3.5 py-3 px-2 -mx-2 hover:bg-[#F4F9FC] transition-colors"
                >
                  <picture className="w-[88px] h-[60px] shrink-0 overflow-hidden rounded border border-[#0B1B2B]/12 bg-[#E5EFF7]">
                    <source srcSet={study.avif} type="image/avif" />
                    <img
                      src={study.webp}
                      alt={study.alt}
                      width={240}
                      height={150}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </picture>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-bold text-[#0B1B2B] group-hover:text-[#0F5C8C] transition-colors truncate">
                        {study.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F5C8C] shrink-0">
                        <span>{study.city}</span>
                        <Icon
                          name="arrow-up-right"
                          className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#3E5871] tabular-nums truncate">
                      {study.spec}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-xs sm:text-sm text-[#233B53]">
              <span className="tabular-nums">Permitted &amp; city-inspected to CRC R908.</span>
              <Link prefetch={false}
                href="/projects"
                className="font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0"
              >
                Full Archive
              </Link>
            </div>
          </div>
        </div>

        {/* Part 2: Regional Service Area Accordions + Lazy Map */}
        <div className="mt-16 sm:mt-20 pt-14 sm:pt-16 border-t border-[#0B1B2B]/14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-8">
            <div className="max-w-[70ch]">
              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] leading-[1.12] text-[#0B1B2B] tabular-nums">
                Serving Oceanside, North County &amp; 32 Southern California Communities
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#233B53] leading-relaxed max-w-[65ch] tabular-nums">
                Dispatched from South El Camino Real in Oceanside across 30 San Diego cities plus Temecula and Murrieta.
              </p>
            </div>

            <Link prefetch={false}
              href="/service-area"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0 tabular-nums"
            >
              <span>All 32 City Roofing Guides</span>
              <Icon name="arrow-right" className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* 5 Regional Native <details> Accordions */}
            <div className="lg:col-span-7 border-t border-[#0B1B2B]/14 divide-y divide-[#0B1B2B]/12 border-b">
              {REGIONAL_SERVICE_AREAS.map((region, idx) => {
                const cities = region.slugs
                  .map((slug) => getServiceAreaBySlug(slug))
                  .filter((city): city is NonNullable<typeof city> => Boolean(city));

                return (
                  <details
                    key={region.id}
                    open={idx === 0}
                    className="group py-3.5 sm:py-4"
                  >
                    <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0 flex items-center gap-2.5">
                        <span className="font-[family-name:var(--font-display)] text-base sm:text-lg font-extrabold text-[#0B1B2B] shrink-0">
                          {region.name}
                        </span>
                        <span className="rounded-full border border-[#0B1B2B]/14 bg-[#F4F9FC] px-2 py-0.5 text-xs font-bold text-[#233B53] tabular-nums shrink-0">
                          {cities.length} cities
                        </span>
                        <span className="hidden sm:inline text-xs font-medium text-[#3E5871] truncate">
                          {region.description}
                        </span>
                      </div>

                      <Icon
                        name="chevron-down"
                        className="h-4 w-4 shrink-0 text-[#0F5C8C] transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>

                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {cities.map((city) => (
                        <li key={city.slug}>
                          <Link prefetch={false}
                            href={`/service-area/${city.slug}`}
                            className="inline-flex items-center rounded-md border border-[#0B1B2B]/14 bg-[#F4F9FC] hover:bg-[#0B1B2B] hover:text-white px-2.5 py-1 text-xs font-semibold text-[#0B1B2B] transition-colors"
                          >
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>

            {/* Lazy Service Map */}
            <div className="lg:col-span-5">
              <LazyServiceMap />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
