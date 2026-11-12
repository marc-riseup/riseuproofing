import Link from 'next/link';
import { Icon, GoogleIcon, YelpIcon } from '@/components/shared/Icon';
import {
  PHONE_HREF,
  PHONE_NUMBER,
  COMPANY_NAME,
  LICENSE_NUMBER,
  GOOGLE_REVIEWS_URL,
  YELP_REVIEWS_URL,
} from '@/lib/utils';
import { Container } from '@/components/shared/Container';
import { REGIONAL_SERVICE_AREAS, getServiceAreaBySlug } from '@/lib/data/serviceAreas';
import type { ReviewStats } from '@/lib/reviews-server';

const ROOFING_SOLAR_SCOPES = [
  { label: 'Residential Shingle Reroofing', href: '/services/residential' },
  { label: 'Clay & Concrete Tile Relay', href: '/services/tile-roofing' },
  { label: '24/7 Emergency Leak Repair', href: '/services/roof-repair' },
  { label: 'Standing Seam Metal Roofing', href: '/services/metal-roofing' },
  { label: 'Solar Panel Detach & Reset', href: '/services/solar-roofing' },
  { label: '21-Point Roof Inspection', href: '/services/roof-inspection' },
  { label: 'Commercial Flat & TPO Roofing', href: '/services/commercial-roofing' },
  { label: 'Commercial Infrared Audits', href: '/services/commercial-roof-inspection' },
  { label: 'High-Solids Silicone Coatings', href: '/services/roof-coating' },
  { label: 'Modified Bitumen & BUR', href: '/services/modified-bitumen' },
  { label: 'Industrial & Warehouse Roofing', href: '/services/industrial-roofing' },
];

const CONSTRUCTION_HUB_LINKS = [
  { label: 'Custom Trex & View Decks', href: '/services/deck-builder' },
  { label: 'James Hardie Siding', href: '/services/siding' },
  { label: 'Permitted ADU Construction', href: '/services/adu-construction' },
  { label: 'Room & Second-Story Additions', href: '/services/home-additions' },
  { label: 'General Construction & Framing', href: '/services/construction' },
  { label: '$0 Down Roof Financing', href: '/roof-financing-san-diego' },
  { label: 'CRC R908 Bare-Deck Tear-Off', href: '/about/roof-tear-off-process' },
  { label: 'Engineering & Cost Guides', href: '/guides' },
  { label: 'Surveyed Project Case Studies', href: '/projects' },
];

const COMPANY_LINKS = [
  { label: 'About Rise Up', href: '/about' },
  { label: 'Verified Client Reviews', href: '/reviews' },
  { label: 'All Services Hub', href: '/services' },
  { label: 'Service Areas Hub', href: '/service-area' },
  { label: '25-Year Warranty', href: '/#reviews' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact / Free Estimate', href: '/contact' },
];

const MOBILE_ACCORDION_SECTIONS = [
  { title: 'Roofing & Solar Scopes', links: ROOFING_SOLAR_SCOPES },
  { title: 'Construction & Homeowner Hub', links: CONSTRUCTION_HUB_LINKS },
  { title: 'Company', links: COMPANY_LINKS },
];

const OWENS_CORNING_PROFILE_URL =
  'https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/247226';
const ESCONDIDO_CHAMBER_URL =
  'https://business.escondidochamber.org/list/member/rise-up-roofing-and-construction-inc-9925';

export function Footer({ stats }: { stats?: ReviewStats } = {}) {
  const googleRating = stats?.googleRating ? stats.googleRating.toFixed(1) : '5.0';
  const yelpRating = stats?.yelpRating ? stats.yelpRating.toFixed(1) : '5.0';

  return (
    <footer className="always-dark bg-[#071524] text-[#FFFFFF] border-t border-white/14">
      <Container className="pt-12 lg:pt-14">
        {/* Row 1 — Brand Lockup & Official Credential Seal Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/12">
          <div>
            <Link
              href="/"
              prefetch={false}
              className="inline-block"
              aria-label="Rise Up Roofing & Construction — Home"
            >
              <img
                src="/logo-white.svg"
                alt={COMPANY_NAME}
                width={198}
                height={52}
                loading="lazy"
                decoding="async"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-[#C8DDF0] leading-relaxed max-w-md">
              Dual-licensed C-39 Roofing &amp; Class B General Building contractor serving San Diego
              County, Temecula, and Murrieta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/12 border border-white/14 bg-[#0B1B2B] rounded-[10px] overflow-hidden shrink-0">
            <a
              href="https://www.cslb.ca.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors"
            >
              <img
                src="/img/brand/cslb-80.webp"
                width={34}
                height={34}
                loading="lazy"
                decoding="async"
                alt="CSLB seal"
                className="h-8 w-8 shrink-0 rounded-[6px] bg-[#FFFFFF] p-0.5 object-contain"
              />
              <div>
                <span className="block text-xs font-extrabold text-[#FFFFFF] tabular-nums">
                  CSLB #{LICENSE_NUMBER}
                </span>
                <span className="block text-xs text-[#C8DDF0]">C-39 &amp; Class B Active</span>
              </div>
            </a>

            <a
              href={OWENS_CORNING_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors"
            >
              <img
                src="/img/brand/oc-preferred-seal-136.webp"
                width={34}
                height={34}
                loading="lazy"
                decoding="async"
                alt="Owens Corning Preferred Contractor seal"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <div>
                <span className="block text-xs font-extrabold text-[#FFFFFF] tabular-nums">
                  25-Yr Warranty
                </span>
                <span className="block text-xs text-[#C8DDF0] tabular-nums">
                  OC Preferred #247226
                </span>
              </div>
            </a>

            <a
              href={ESCONDIDO_CHAMBER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors"
            >
              <img
                src="/img/brand/escondido-chamber-84.webp"
                width={38}
                height={32}
                loading="lazy"
                decoding="async"
                alt="Escondido Chamber of Commerce seal"
                className="h-8 w-[38px] shrink-0 object-contain"
              />
              <div>
                <span className="block text-xs font-extrabold text-[#FFFFFF] tabular-nums">
                  Chamber #9925
                </span>
                <span className="block text-xs text-[#C8DDF0] tabular-nums">1,000+ SD Roofs</span>
              </div>
            </a>
          </div>
        </div>

        {/* Row 2 — 12-Column Architectural Directory & Full Local SEO NAP */}
        <div className="py-10 lg:py-12 border-b border-white/12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Oceanside HQ & Direct Dispatch (NAP) */}
          <div className="md:col-span-5 lg:col-span-4">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.05em] text-[#FFFFFF]">
              Oceanside Headquarters &amp; Dispatch
            </p>

            <address className="not-italic space-y-2.5 mt-4 text-xs sm:text-sm text-[#C8DDF0] tabular-nums">
              <p className="flex items-start gap-2.5">
                <Icon name="map-pin" className="w-4 h-4 text-[#2F9FE3] mt-0.5 shrink-0" />
                <span>2182 S El Camino Real, Oceanside, CA 92054</span>
              </p>

              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Icon name="phone" className="w-4 h-4 text-[#10B981] shrink-0" />
                <a
                  href={PHONE_HREF}
                  className="font-extrabold text-[#FFFFFF] hover:text-[#FFC700] transition-colors"
                >
                  {PHONE_NUMBER}
                </a>
                <span className="text-xs text-[#C8DDF0]">&middot; 24/7 Leak Dispatch</span>
              </p>

              <p className="flex items-center gap-2.5">
                <Icon name="mail" className="w-4 h-4 text-[#2F9FE3] shrink-0" />
                <a
                  href="mailto:info@riseuprac.com"
                  className="text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors"
                >
                  info@riseuprac.com
                </a>
              </p>

              <p className="flex items-start gap-2.5 text-xs text-[#C8DDF0]">
                <Icon name="clock" className="w-4 h-4 text-[#2F9FE3] mt-0.5 shrink-0" />
                <span>
                  Estimator Desk: Mon–Fri 7:00 AM – 6:00 PM &middot; Sat 8:00 AM – 2:00 PM
                </span>
              </p>

              <p className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" aria-hidden="true" />
                <span>24/7 Emergency Storm &amp; Leak Response</span>
              </p>
            </address>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href="/contact"
                prefetch={false}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-[#C92D20] hover:opacity-95 px-4 py-2.5 font-[family-name:var(--font-display)] text-xs font-extrabold uppercase tracking-[0.04em] text-[#FFFFFF] transition-opacity"
              >
                <span>Get Free Estimate</span>
                <Icon name="arrow-right" className="w-3.5 h-3.5 shrink-0" />
              </Link>

              <div className="inline-flex items-center gap-1.5">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Google Business Profile — ${googleRating} out of 5 stars`}
                  className="w-9 h-9 rounded-[10px] border border-white/14 bg-white/[0.03] hover:bg-white/[0.10] flex items-center justify-center text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors"
                >
                  <GoogleIcon className="w-4 h-4" />
                </a>

                <a
                  href={YELP_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Yelp Verified Reviews — ${yelpRating} out of 5 stars`}
                  className="w-9 h-9 rounded-[10px] border border-white/14 bg-white/[0.03] hover:bg-white/[0.10] flex items-center justify-center text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors"
                >
                  <YelpIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/riseuproofingandconstruction/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rise Up Roofing & Construction on Instagram"
                  className="w-9 h-9 rounded-[10px] border border-white/14 bg-white/[0.03] hover:bg-white/[0.10] flex items-center justify-center text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors"
                >
                  <Icon name="instagram" className="w-4 h-4" />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61551393216836"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rise Up Roofing & Construction on Facebook"
                  className="w-9 h-9 rounded-[10px] border border-white/14 bg-white/[0.03] hover:bg-white/[0.10] flex items-center justify-center text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors"
                >
                  <Icon name="facebook" className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Roofing & Solar Scopes (Desktop md+) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.05em] text-[#FFFFFF]">
              Roofing &amp; Solar Scopes
            </p>
            <ul className="mt-4 space-y-2 tabular-nums">
              {ROOFING_SOLAR_SCOPES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="text-xs text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Construction & Homeowner Hub (Desktop md+) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.05em] text-[#FFFFFF]">
              Construction &amp; Homeowner Hub
            </p>
            <ul className="mt-4 space-y-2 tabular-nums">
              {CONSTRUCTION_HUB_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="text-xs text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company (Desktop md+) */}
          <div className="hidden md:block md:col-span-12 lg:col-span-2 md:pt-4 lg:pt-0 md:border-t lg:border-t-0 border-white/10">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.05em] text-[#FFFFFF]">
              Company
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 lg:block lg:space-y-2 tabular-nums">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-xs text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Accordions (md:hidden ONLY — visible at 390x844) */}
          <div className="md:hidden space-y-2">
            {MOBILE_ACCORDION_SECTIONS.map((section) => (
              <details
                key={section.title}
                className="group border border-white/14 rounded-[10px] bg-[#0B1B2B]"
              >
                <summary className="list-none [&::-webkit-details-marker]:hidden w-full flex items-center justify-between gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-[0.05em] text-[#FFFFFF] hover:text-[#2F9FE3] transition-colors cursor-pointer">
                  <span>{section.title}</span>
                  <Icon
                    name="chevron-down"
                    className="w-4 h-4 text-[#C8DDF0] shrink-0 transition-transform duration-150 group-open:rotate-180 group-open:text-[#2F9FE3]"
                  />
                </summary>
                <ul className="px-4 pb-3.5 pt-2 space-y-2 border-t border-white/10 tabular-nums">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className="text-xs text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors block py-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        {/* Row 3 — Shared Collapsible 32-City Regional Coverage Drawer (All Viewports) */}
        <div className="py-5 border-b border-white/12">
          <details className="group border border-white/14 rounded-[10px] bg-[#0B1B2B]">
            <summary className="list-none [&::-webkit-details-marker]:hidden flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 cursor-pointer text-xs font-bold text-[#FFFFFF] hover:text-[#2F9FE3] transition-colors tabular-nums">
              <span className="inline-flex flex-wrap items-center gap-2">
                <Icon name="map-pin" className="w-4 h-4 text-[#2F9FE3] shrink-0" />
                <span>San Diego County, Temecula &amp; Murrieta Communities Served</span>
                <span className="rounded-full border border-white/14 bg-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-[#C8DDF0]">
                  Browse All 32 Cities
                </span>
              </span>
              <Icon
                name="chevron-down"
                className="w-4 h-4 text-[#C8DDF0] shrink-0 transition-transform duration-150 group-open:rotate-180 group-open:text-[#2F9FE3]"
              />
            </summary>

            <div className="px-4 pb-5 pt-4 border-t border-white/10 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {REGIONAL_SERVICE_AREAS.map((region) => (
                  <div key={region.id}>
                    <p className="text-xs font-bold uppercase tracking-[0.05em] text-[#2F9FE3] border-b border-white/10 pb-1.5">
                      {region.name}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {region.slugs.map((slug) => {
                        const sa = getServiceAreaBySlug(slug);
                        if (!sa) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/service-area/${slug}`}
                              prefetch={false}
                              className="text-xs text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors block py-0.5 truncate"
                            >
                              {sa.name}, CA
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link
                  href="/service-area"
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F9FE3] hover:text-[#FFFFFF] transition-colors tabular-nums"
                >
                  <span>View Interactive Service Area &amp; Coverage Hub</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </details>
        </div>

        {/* Row 4 — Bottom Legal, License & Attribution Bar */}
        <div className="pt-6 pb-24 md:pb-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#C8DDF0] tabular-nums">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_NAME} Inc. &middot; CA Lic #{LICENSE_NUMBER}{' '}
            (C-39 &amp; Class B)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" prefetch={false} className="hover:text-[#FFFFFF] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" prefetch={false} className="hover:text-[#FFFFFF] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" prefetch={false} className="hover:text-[#FFFFFF] transition-colors">
              Contact
            </Link>
            <a
              href="https://projektsvision.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/14 bg-white/[0.03] hover:bg-white/[0.10] px-2.5 py-1 text-xs font-extrabold text-[#FFFFFF] hover:text-[#2F9FE3] transition-colors"
            >
              <span>Powered by PROJEKTS</span>
              <Icon name="arrow-up-right" className="w-3.5 h-3.5 text-[#2F9FE3]" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
