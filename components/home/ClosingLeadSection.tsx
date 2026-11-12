import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Icon } from '@/components/shared/Icon';
import { ClosingLeadForm } from '@/components/home/ClosingLeadForm';
import { LICENSE_NUMBER, PHONE_HREF, PHONE_NUMBER } from '@/lib/utils';

const PROMISE_ROWS = [
  '15-minute callback during business hours',
  '100% in-house W-2 crews — zero subcontractors',
  '25-year non-prorated system warranty & itemized written scope',
] as const;

export function ClosingLeadSection() {
  return (
    <section
      id="final-estimate"
      className="relative bg-[#0B1B2B] text-white py-16 sm:py-20 lg:py-26 border-t border-white/12"
    >
      <span id="estimate" className="absolute -top-24" aria-hidden="true" />
      <span id="inspect" className="absolute -top-24" aria-hidden="true" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 5 Cols: Practitioner Reassurance & Direct Dispatch */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.025em] leading-[1.08] text-white tabular-nums">
                Get Your Written San Diego Roof Estimate or Free 21-Point Inspection
              </h2>

              <p className="mt-3.5 text-base text-[#C8DDF0] leading-relaxed">
                Speak directly with a licensed Oceanside estimator—never a high-pressure call center.
              </p>

              <ul className="mt-5 space-y-2.5 text-sm font-semibold text-white tabular-nums">
                {PROMISE_ROWS.map((promise) => (
                  <li key={promise} className="flex items-start gap-2.5">
                    <Icon
                      name="check-circle"
                      className="w-4 h-4 text-[#FFC700] shrink-0 mt-0.5"
                    />
                    <span>{promise}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 py-5 border-y border-white/14">
                <p className="text-xs font-bold uppercase tracking-[0.05em] text-[#C8DDF0]">
                  Direct Oceanside Dispatch &amp; Estimator Desk
                </p>
                <a
                  href={PHONE_HREF}
                  className="mt-1.5 inline-flex items-center gap-3 font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#FFC700] hover:text-white transition-colors tabular-nums"
                >
                  <Icon name="phone" className="w-6 h-6 shrink-0" />
                  <span>{PHONE_NUMBER}</span>
                </a>
                <p className="mt-1.5 text-xs text-[#C8DDF0] tabular-nums">
                  Mon–Fri 7:00 AM – 6:00 PM · Sat 8:00 AM – 2:00 PM · 24/7 Emergency Leak Dispatch
                </p>
              </div>

              <dl className="mt-6 space-y-3 text-sm text-[#C8DDF0] tabular-nums">
                <div>
                  <dt className="sr-only">Headquarters</dt>
                  <dd className="flex items-start gap-2.5">
                    <Icon name="map-pin" className="w-4 h-4 text-[#FFC700] shrink-0 mt-1" />
                    <span>
                      <strong className="font-bold text-white">Oceanside HQ:</strong> 2182 S El Camino Real, Oceanside, CA 92054
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="sr-only">Contractor License</dt>
                  <dd className="flex items-start gap-2.5">
                    <Icon name="shield-check" className="w-4 h-4 text-[#FFC700] shrink-0 mt-1" />
                    <span>
                      <strong className="font-bold text-white">CA Lic #{LICENSE_NUMBER}</strong> (C-39 Roofing &amp; Class B General Building) · $2M+ Insured
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <p className="mt-8 pt-5 border-t border-white/12 text-xs sm:text-sm text-[#C8DDF0]">
              <Link prefetch={false}
                href="/careers"
                className="inline-flex items-center gap-1.5 font-semibold text-[#C8DDF0] hover:text-[#FFC700] underline decoration-white/30 hover:decoration-[#FFC700] underline-offset-4 transition-colors"
              >
                <span>Experienced roofer or foreman? View open San Diego crew positions</span>
                <Icon name="arrow-right" className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </p>
          </div>

          {/* Right 7 Cols: High-Contrast White Inline Lead & Ballpark Form */}
          <div className="lg:col-span-7">
            <ClosingLeadForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
