import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';

export function TrustLedger() {
  return (
    <section
      aria-label="Official contractor seals, warranty credentials, and emergency dispatch"
      className="bg-[#FFFFFF] text-[#0B1B2B] border-b border-[#0B1B2B]/12"
    >
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-[#0B1B2B]/12">
          <div className="py-3.5 sm:py-4 sm:pr-4 lg:px-3.5 xl:px-4 lg:first:pl-0 flex items-center gap-3">
            <img
              src="/img/brand/cslb-80.webp"
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              alt="California Contractors State License Board seal"
              className="h-9 w-9 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm xl:text-base font-extrabold tracking-[-0.015em] text-[#0B1B2B] leading-tight tabular-nums">
                CSLB #1096492
              </p>
              <p className="text-xs text-[#233B53] leading-snug mt-0.5 tabular-nums">
                C-39 &amp; Class B ·{' '}
                <a
                  href="https://www.cslb.ca.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                >
                  Verified
                </a>
              </p>
            </div>
          </div>

          <div className="py-3.5 sm:py-4 sm:pl-4 lg:px-3.5 xl:px-4 flex items-center gap-3 sm:border-l lg:border-l-0 border-[#0B1B2B]/12">
            <img
              src="/img/brand/oc-preferred-seal-136.webp"
              width={38}
              height={38}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              alt="Owens Corning Preferred Contractor seal"
              className="h-[38px] w-[38px] shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm xl:text-base font-extrabold tracking-[-0.015em] text-[#0B1B2B] leading-tight tabular-nums">
                25-Yr Warranty
              </p>
              <p className="text-xs text-[#233B53] leading-snug mt-0.5 tabular-nums">
                OC #247226 ·{' '}
                <a
                  href="https://www.owenscorning.com/en-us/roofing/contractors/contractor-profile/247226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                >
                  Profile
                </a>
              </p>
            </div>
          </div>

          <div className="py-3.5 sm:py-4 sm:pr-4 lg:px-3.5 xl:px-4 flex items-center gap-3 sm:border-t lg:border-t-0 border-[#0B1B2B]/12">
            <img
              src="/img/brand/escondido-chamber-84.webp"
              width={42}
              height={36}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              alt="Escondido Chamber of Commerce seal"
              className="h-9 w-[42px] shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm xl:text-base font-extrabold tracking-[-0.015em] text-[#0B1B2B] leading-tight tabular-nums">
                1,000+ SD Roofs
              </p>
              <p className="text-xs text-[#233B53] leading-snug mt-0.5">
                In-House W-2 Crews
              </p>
            </div>
          </div>

          <div className="py-3.5 sm:py-4 sm:pl-4 lg:px-3.5 xl:px-4 flex items-center gap-3 sm:border-t sm:border-l lg:border-t-0 lg:border-l-0 border-[#0B1B2B]/12">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#0B1B2B]/12 bg-[#F4F9FC]"
              aria-hidden="true"
            >
              <Icon name="dollar-sign" className="w-[18px] h-[18px] text-[#0F5C8C]" />
            </span>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm xl:text-base font-extrabold tracking-[-0.015em] text-[#0B1B2B] leading-tight tabular-nums">
                $0 Down · 0% APR
              </p>
              <p className="text-xs text-[#233B53] leading-snug mt-0.5 tabular-nums">
                <Link prefetch={false}
                  href="/roof-financing-san-diego"
                  className="font-semibold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                >
                  From $149/mo (OAC)
                </Link>
              </p>
            </div>
          </div>

          <div className="py-3.5 sm:py-4 sm:col-span-2 lg:col-span-1 lg:pl-3.5 xl:pl-4 lg:pr-0 flex items-center gap-3 sm:border-t lg:border-t-0 border-[#0B1B2B]/12">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C92D20]/20 bg-[#FEF2F2]"
              aria-hidden="true"
            >
              <Icon name="clock" className="w-[18px] h-[18px] text-[#C92D20]" />
            </span>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm xl:text-base font-extrabold tracking-[-0.015em] text-[#0B1B2B] leading-tight tabular-nums">
                60–90 Min Dispatch
              </p>
              <p className="text-xs text-[#233B53] leading-snug mt-0.5 tabular-nums">
                <Link prefetch={false}
                  href="/services/roof-repair"
                  className="font-semibold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4"
                >
                  24/7 Leak Triage
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
