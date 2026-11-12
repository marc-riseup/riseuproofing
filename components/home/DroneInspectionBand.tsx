import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';

const INSPECTION_PLATES = [
  {
    title: '1. 4K Drone Ridge, Tile & Flashing Scan',
    base: '/img/audit/1',
    width: 1100,
    height: 1103,
    alt: '4K aerial drone scan over San Diego concrete tile ridge caps, valley metal, and penetrations',
    spec: 'Aerial Orthomosaic · Zero Foot Traffic',
    description:
      'Aerial passes catch hairline tile fractures, lifted shingles, and unsealed solar boots—zero foot traffic.',
  },
  {
    title: '2. Attic Decking, Dry-Rot & Thermal Check',
    base: '/img/audit/2',
    width: 1100,
    height: 1101,
    alt: 'Attic rafter, CDX plywood sheathing, and thermal moisture diagnostic inspection',
    spec: 'FLIR Infrared · CDX Decking & Airflow',
    description:
      'FLIR infrared cameras trace hidden rafter leaks, probe CDX rot, and check attic airflow.',
  },
  {
    title: '3. Written 21-Point Photo Scope',
    base: '/img/audit/3',
    width: 1100,
    height: 1101,
    alt: 'Written itemized roof diagnostic photo report and California CRC R908 scope specification',
    spec: '21 Checkpoints · Fixed-Scope Proposal',
    description:
      'Timestamped photos separate active leaks from sound roof areas with an itemized written scope.',
  },
] as const;

const BARE_DECK_PILLS = [
  'Zero Subcontractors',
  'CRC R908 Bare-Deck',
  '25-Year System Warranty',
] as const;

export function DroneInspectionBand() {
  return (
    <section
      id="inspection-protocol"
      className="bg-[#0B1B2B] text-white py-16 sm:py-20 lg:py-24 border-b border-white/12"
    >
      <Container>
        <div className="max-w-[70ch]">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] leading-[1.08] text-white tabular-nums">
            Free 21-Point 4K Drone &amp; Thermal Roof Inspection
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-[#C8DDF0] leading-relaxed max-w-[64ch] tabular-nums">
            Every complimentary inspection documents all 21 structural, flashing, and underlayment failure points in writing.
          </p>
        </div>

        {/* 3 Visual Diagnostic Plates */}
        <div className="mt-10 sm:mt-12 border border-white/14 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/14 bg-[#0E2236]">
          {INSPECTION_PLATES.map((plate) => (
            <article key={plate.title} className="flex flex-col justify-between">
              <div>
                <div className="border-b border-white/14 bg-[#081523] overflow-hidden">
                  <picture className="block w-full">
                    <source
                      srcSet={`${plate.base}-480.avif 480w, ${plate.base}.avif 1100w`}
                      sizes="(max-width: 1023px) 260px, 420px"
                      type="image/avif"
                    />
                    <source
                      srcSet={`${plate.base}-480.webp 480w, ${plate.base}.webp 1100w`}
                      sizes="(max-width: 1023px) 260px, 420px"
                      type="image/webp"
                    />
                    <img
                      src={`${plate.base}.webp`}
                      alt={plate.alt}
                      width={plate.width}
                      height={plate.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[16/11] object-cover"
                    />
                  </picture>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-extrabold tracking-[-0.015em] leading-snug text-white tabular-nums">
                    {plate.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#C8DDF0] leading-relaxed">
                    {plate.description}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3 border-t border-white/12 text-xs font-semibold text-[#C8DDF0] tabular-nums">
                {plate.spec}
              </div>
            </article>
          ))}
        </div>

        {/* Coastal Bare-Deck Craft Split Banner */}
        <div className="mt-6 border border-white/14 bg-[#0E2236] grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/14 bg-[#081523] overflow-hidden">
            <picture className="block w-full h-full">
              <source
                srcSet="/img/standard/craft-480.avif 480w, /img/standard/craft.avif 960w"
                sizes="(max-width: 640px) 260px, (max-width: 1440px) 480px, 560px"
                type="image/avif"
              />
              <source
                srcSet="/img/standard/craft-480.webp 480w, /img/standard/craft.webp 960w"
                sizes="(max-width: 640px) 260px, (max-width: 1440px) 480px, 560px"
                type="image/webp"
              />
              <img
                src="/img/standard/craft.webp"
                alt="Rise Up Roofing crew resetting coastal Spanish clay barrel tiles over waterproof underlayment overlooking the San Diego ocean"
                width={960}
                height={630}
                loading="lazy"
                decoding="async"
                className="w-full h-56 sm:h-64 lg:h-full object-cover"
              />
            </picture>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.7rem] font-extrabold tracking-[-0.02em] leading-[1.14] text-white">
                Built to Bare Wood—Never Illegal Overlays
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#C8DDF0] leading-relaxed max-w-[60ch] tabular-nums">
                Our W-2 crews strip failed felt to bare sheathing, replace rotted plywood, and back every full system with a 25-year non-prorated warranty.
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {BARE_DECK_PILLS.map((pill) => (
                  <li
                    key={pill}
                    className="border border-white/18 bg-[#0B1B2B] px-3 py-1 text-xs font-bold text-[#C8DDF0] rounded-full tabular-nums"
                  >
                    {pill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/12">
              <a
                href="#inspect"
                data-lead-intent="inspection"
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-[#FFC700] hover:bg-[#F0B800] px-5 py-3 text-sm font-extrabold text-[#0B1B2B] tracking-[-0.01em] transition-colors shadow-[0_10px_24px_-6px_rgba(255,199,0,0.3)] tabular-nums"
              >
                <span>Book My Free 21-Point Inspection</span>
                <Icon name="arrow-right" className="w-4 h-4" />
              </a>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
                <Link prefetch={false}
                  href="/services/roof-inspection"
                  className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#FFC700] underline decoration-white/35 hover:decoration-[#FFC700] underline-offset-4 transition-colors tabular-nums"
                >
                  <span>21 Inspection Checkpoints</span>
                  <Icon name="arrow-up-right" className="w-3.5 h-3.5" />
                </Link>
                <Link prefetch={false}
                  href="/about/roof-tear-off-process"
                  className="inline-flex items-center gap-1.5 font-bold text-[#C8DDF0] hover:text-white underline decoration-[#C8DDF0]/40 hover:decoration-white underline-offset-4 transition-colors tabular-nums"
                >
                  <span>CRC R908 Tear-Off Protocol</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
