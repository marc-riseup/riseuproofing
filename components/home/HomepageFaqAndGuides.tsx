import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';

export interface HomepageFaqItem {
  question: string;
  answer: string;
  linkHref: string;
  linkLabel: string;
}

export const HOMEPAGE_FAQS: HomepageFaqItem[] = [
  {
    question: 'How much does a roof replacement cost in San Diego County?',
    answer:
      'San Diego architectural shingle replacements typically run $9,500–$18,500, while concrete or clay tile lift-and-reset relays run $12,500–$26,000 depending on square footage, pitch, and CDX wood repairs. Standing seam metal systems start around $24,000+, quoted line-by-line after our 21-point inspection.',
    linkHref: '/services/residential',
    linkLabel: 'Compare San Diego shingle & residential replacement specs',
  },
  {
    question: 'What is a concrete or clay tile lift-and-reset, and how does it save ~50%?',
    answer:
      'Concrete and clay roof tiles last 50+ years, while the asphalt paper underneath fails around year 20. Our crew lifts and salvages your original tiles, repairs rotted decking, installs dual-ply 250°F synthetic underlayment, and resets your tiles—restoring 25+ years of waterproofing at ~50% lower cost.',
    linkHref: '/services/tile-roofing',
    linkLabel: 'Explore concrete & Spanish clay tile lift-and-reset specs',
  },
  {
    question: 'How fast can you respond to an active roof leak, and do you provide insurance documentation?',
    answer:
      'Our Oceanside dispatch reaches North County and San Diego properties within 60–90 minutes. Crews install ridge-anchored storm tarps, trace concealed moisture with calibrated FLIR thermal cameras, and deliver timestamped photo scopes formatted for insurance adjusters.',
    linkHref: '/guides/emergency-roof-leak-triage-san-diego',
    linkLabel: 'Read our first 60-minute San Diego roof leak triage protocol',
  },
  {
    question: 'Can Rise Up detach and reset my solar panels during reroofing without voiding warranties?',
    answer:
      'Yes. Skip waiting months on third-party solar crews—our technicians isolate DC strings, crate your panels on-site, install your new roof with waterproof stanchion flashings, torque-reset the racking to spec, and verify full string output.',
    linkHref: '/services/solar-roofing',
    linkLabel: 'See our in-house solar panel detach, flashing & reset process',
  },
  {
    question: 'Do San Diego roof replacements require California Title 24 Cool Roof compliance and city permits?',
    answer:
      'Yes. San Diego cities enforce California CRC R908 bare-deck tear-offs (banning moisture-trapping overlays) and Title 24 Part 6 Cool Roof reflectance in Climate Zones 7 and 10. Rise Up handles all permits, CF-1R forms, and final city sign-offs.',
    linkHref: '/about/roof-tear-off-process',
    linkLabel: 'Review California CRC R908 bare-deck tear-off code rules',
  },
  {
    question: 'What $0 down roof financing and 25-year Owens Corning warranty options do you offer?',
    answer:
      'Qualified San Diego, Temecula, and Murrieta homeowners can access $0 down plans, 0% promotional APR, and payments from $149/mo via soft-pull check. As Owens Corning Preferred Contractor #247226, our full systems carry transferable 25-year non-prorated material and labor warranties.',
    linkHref: '/roof-financing-san-diego',
    linkLabel: 'Compare $0 down San Diego roof financing plans & payments',
  },
];

const FEATURED_GUIDES = [
  {
    href: '/guides/tile-roof-relay-vs-replacement',
    title: 'Tile Roof Relay vs. Full Replacement',
    meta: 'Saves 40%–55% · 8 Min Read',
    avif: '/img/services/tile-roofing-240.avif',
    webp: '/img/services/tile-roofing-240.webp',
    width: 240,
    height: 134,
    alt: 'Concrete and clay tile roof underlayment relay in San Diego',
  },
  {
    href: '/about/roof-tear-off-process',
    title: '5-Phase CRC R908 Bare-Deck Tear-Off Protocol',
    meta: 'CA Code Spec · Bare Wood',
    avif: '/img/projects/sd-underlayment-repair-after-240.avif',
    webp: '/img/projects/sd-underlayment-repair-after-240.webp',
    width: 240,
    height: 150,
    alt: 'Bare-deck synthetic underlayment and roof flashing installation in San Diego',
  },
  {
    href: '/guides/california-title-24-cool-roof-guide',
    title: 'California Title 24 Cool Roof Guide (Zones 7 & 10)',
    meta: 'SRI Ratings & Permits · 7 Min Read',
    avif: '/img/services/residential-roofing-240.avif',
    webp: '/img/services/residential-roofing-240.webp',
    width: 240,
    height: 158,
    alt: 'Title 24 Cool Roof residential roofing installation in San Diego County',
  },
] as const;

const MORE_GUIDE_CHIPS = [
  {
    href: '/guides/coastal-tile-roof-underlayment-lifespan',
    label: 'Coastal Underlayment Lifespan',
  },
  {
    href: '/guides/emergency-roof-leak-triage-san-diego',
    label: '60-Min Leak Triage',
  },
  {
    href: '/guides/commercial-flat-roof-solutions',
    label: 'Commercial TPO & Coatings',
  },
  {
    href: '/guides/home-remodeling-costs-san-diego',
    label: 'Additions & Deck Costs',
  },
] as const;

export function HomepageFaqAndGuides() {
  return (
    <section
      id="faq"
      className="bg-[#FFFFFF] text-[#0B1B2B] py-16 sm:py-20 lg:py-24 border-b border-[#0B1B2B]/12"
    >
      <Container>
        <div className="max-w-[70ch] pb-9 sm:pb-11 border-b border-[#0B1B2B]/12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] leading-[1.08] text-[#0B1B2B]">
            San Diego Roofing Cost, Code &amp; Homeowner Questions
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-[#233B53] leading-relaxed max-w-[65ch]">
            Straight answers on San Diego replacement pricing, tile relays, solar resets, and California building codes.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 7 Cols: Exact 6 Native Accessible <details>/<summary> FAQ Items */}
          <div className="lg:col-span-7 divide-y divide-[#0B1B2B]/12 border-b border-[#0B1B2B]/12">
            {HOMEPAGE_FAQS.map((item, idx) => (
              <details
                key={item.question}
                open={idx === 0}
                className="group py-4.5 first:pt-0"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-[family-name:var(--font-display)] text-base sm:text-lg font-extrabold tracking-[-0.015em] text-[#0B1B2B] hover:text-[#0F5C8C] transition-colors [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B1B2B]">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0B1B2B]/18 text-[#0B1B2B] transition-transform duration-200 group-open:rotate-180"
                  >
                    <Icon name="chevron-down" className="w-3.5 h-3.5" />
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm sm:text-base text-[#233B53] leading-relaxed tabular-nums">
                  {item.answer}
                </p>
                <p className="mt-2 pr-8 text-xs sm:text-sm">
                  <Link prefetch={false}
                    href={item.linkHref}
                    className="inline-flex items-center gap-1.5 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 transition-colors"
                  >
                    <span>{item.linkLabel}</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </p>
              </details>
            ))}
          </div>

          {/* Right 5 Cols: Photo-Backed Featured Guides + Compact Guide Chips */}
          <div className="lg:col-span-5">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.02em] leading-snug text-[#0B1B2B]">
              Engineering &amp; Cost Guides
            </h3>
            <p className="mt-2 text-sm text-[#233B53] leading-relaxed tabular-nums">
              Field-tested San Diego roofing specs and cost breakdowns from our C-39 &amp; Class B team.
            </p>

            <ul className="mt-5 border-t border-[#0B1B2B]/14 divide-y divide-[#0B1B2B]/12 border-b">
              {FEATURED_GUIDES.map((guide) => (
                <li key={guide.href}>
                  <Link prefetch={false}
                    href={guide.href}
                    className="group flex items-center gap-3.5 py-3.5 px-2 -mx-2 transition-colors hover:bg-[#F4F9FC]"
                  >
                    <picture className="w-[88px] h-[60px] shrink-0 overflow-hidden rounded border border-[#0B1B2B]/12 bg-[#E5EFF7]">
                      <source srcSet={guide.avif} type="image/avif" />
                      <img
                        src={guide.webp}
                        alt={guide.alt}
                        width={guide.width}
                        height={guide.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </picture>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-[#0B1B2B] group-hover:text-[#0F5C8C] leading-snug transition-colors">
                          {guide.title}
                        </span>
                        <Icon
                          name="arrow-up-right"
                          className="w-4 h-4 text-[#0F5C8C] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                      <span className="mt-1 block text-xs text-[#3E5871] tabular-nums">
                        {guide.meta}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-4 flex flex-wrap gap-2">
              {MORE_GUIDE_CHIPS.map((chip) => (
                <li key={chip.href}>
                  <Link prefetch={false}
                    href={chip.href}
                    className="inline-flex items-center gap-1 rounded-full border border-[#0B1B2B]/16 bg-[#F4F9FC] hover:bg-[#0B1B2B] hover:text-white px-3 py-1.5 text-xs font-semibold text-[#0B1B2B] transition-colors tabular-nums"
                  >
                    <span>{chip.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Link prefetch={false}
                href="/guides"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 tabular-nums"
              >
                <span>Browse All 9 Roofing &amp; Construction Guides</span>
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
