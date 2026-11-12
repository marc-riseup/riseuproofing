'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import { clsx as cn } from 'clsx';
import { PHONE_HREF, PHONE_NUMBER, LICENSE_NUMBER } from '@/lib/utils';
import { SERVICES_NAV, TOP_CITIES } from '@/lib/data/navigation';
import type { ReviewStats } from '@/lib/reviews-server';

export function MobileNav({ stats }: { stats?: ReviewStats }) {
  const [open, setOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [areasExpanded, setAreasExpanded] = useState(false);
  const pathname = usePathname() ?? '/';
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setServicesExpanded(false);
    setAreasExpanded(false);
  }

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const ratingLabel = stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0';

  const rowClass = (active: boolean) =>
    cn(
      'flex min-h-11 items-center justify-between gap-3 py-3 text-sm font-bold transition-colors',
      active ? 'text-[#2F9FE3]' : 'text-[#FFFFFF] hover:text-[#2F9FE3]'
    );

  const sheetContent =
    open && typeof document !== 'undefined' ? (
      <div className="fixed inset-0 z-[9999] lg:hidden flex justify-end">
        {/* Scrim Backdrop */}
        <div
          className="fixed inset-0 bg-[#0B1B2B]/75 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* Coastal Ink Slide-Over Drawer */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="relative z-10 w-full max-w-[400px] h-full bg-[#0B1B2B] text-[#FFFFFF] border-l border-white/14 shadow-[0_24px_60px_rgba(11,27,43,0.65)] flex flex-col overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/12 shrink-0">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center"
              aria-label="Rise Up Roofing & Construction — Home"
            >
              <img
                src="/logo-white.svg"
                alt="Rise Up Roofing & Construction"
                width={179}
                height={48}
                decoding="async"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-[10px] border border-white/16 bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#FFFFFF] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Top Dispatch & Conversion Panel */}
            <div className="border border-white/14 bg-white/[0.04] rounded-[14px] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] tabular-nums">
                <span className="h-2 w-2 rounded-full bg-[#10B981] shrink-0" aria-hidden="true" />
                <span>24/7 Leak Dispatch · 60–90 Min</span>
              </div>

              <a
                href={PHONE_HREF}
                className="flex min-h-12 items-center justify-between gap-3 px-3.5 py-2.5 rounded-[10px] border border-white/16 bg-white/[0.06] hover:bg-white/[0.12] transition-colors tabular-nums"
              >
                <span className="inline-flex items-center gap-2.5 text-sm font-extrabold text-[#FFFFFF]">
                  <Icon name="phone" className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{PHONE_NUMBER}</span>
                </span>
                <span className="text-xs font-bold text-[#10B981]">Call Now</span>
              </a>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="w-full min-h-12 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] bg-[#C92D20] hover:opacity-95 font-[family-name:var(--font-display)] text-xs font-extrabold uppercase tracking-[0.04em] text-[#FFFFFF] shadow-[0_8px_20px_-6px_rgba(201,45,32,0.5)] transition-opacity"
              >
                <span>Get Free Estimate</span>
                <Icon name="arrow-right" className="w-4 h-4 shrink-0" />
              </Link>
            </div>

            {/* Clean Hairline Navigation */}
            <nav aria-label="Mobile Primary Links" className="divide-y divide-white/10 border-y border-white/10">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={rowClass(pathname === '/')}
              >
                <span>Home</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              {/* Expandable Services (All 16 Scopes) */}
              <div>
                <button
                  type="button"
                  onClick={() => setServicesExpanded(!servicesExpanded)}
                  aria-expanded={servicesExpanded}
                  className={cn(
                    rowClass(pathname.startsWith('/services') || servicesExpanded),
                    'w-full cursor-pointer text-left'
                  )}
                >
                  <span>Roofing, Solar &amp; Construction Services</span>
                  <Icon
                    name="chevron-down"
                    className={cn(
                      'w-4 h-4 text-[#C8DDF0] shrink-0 transition-transform duration-150',
                      servicesExpanded && 'rotate-180 text-[#2F9FE3]'
                    )}
                  />
                </button>

                {servicesExpanded && (
                  <div className="pb-3 pl-3 space-y-0.5 border-t border-white/10 pt-2">
                    {SERVICES_NAV.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-2 py-2 px-2 rounded-[6px] text-xs font-semibold text-[#C8DDF0] hover:text-[#FFFFFF] hover:bg-white/[0.06] transition-colors"
                      >
                        <span className="truncate">{service.label}</span>
                        <Icon name="chevron-right" className="w-3.5 h-3.5 shrink-0 text-[#C8DDF0]/60" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/projects"
                onClick={() => setOpen(false)}
                className={rowClass(pathname.startsWith('/projects'))}
              >
                <span>Projects &amp; Case Studies</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              {/* Expandable Service Areas */}
              <div>
                <button
                  type="button"
                  onClick={() => setAreasExpanded(!areasExpanded)}
                  aria-expanded={areasExpanded}
                  className={cn(
                    rowClass(pathname.startsWith('/service-area') || areasExpanded),
                    'w-full cursor-pointer text-left'
                  )}
                >
                  <span>Service Areas</span>
                  <Icon
                    name="chevron-down"
                    className={cn(
                      'w-4 h-4 text-[#C8DDF0] shrink-0 transition-transform duration-150',
                      areasExpanded && 'rotate-180 text-[#2F9FE3]'
                    )}
                  />
                </button>

                {areasExpanded && (
                  <div className="pb-3 pt-2 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-1">
                      {TOP_CITIES.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/service-area/${city.slug}`}
                          onClick={() => setOpen(false)}
                          className="py-1.5 px-2.5 rounded-[6px] text-xs font-semibold text-[#C8DDF0] hover:text-[#FFFFFF] hover:bg-white/[0.06] transition-colors truncate"
                        >
                          {city.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/service-area"
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#2F9FE3] hover:text-[#FFFFFF] transition-colors tabular-nums"
                    >
                      <span>All 32 Cities &amp; Coverage Map</span>
                      <Icon name="arrow-right" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/roof-financing-san-diego"
                onClick={() => setOpen(false)}
                className={cn(rowClass(pathname === '/roof-financing-san-diego'), 'tabular-nums')}
              >
                <span>$0 Down Financing</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              <Link
                href="/reviews"
                onClick={() => setOpen(false)}
                className={cn(rowClass(pathname === '/reviews'), 'tabular-nums')}
              >
                <span className="inline-flex items-center gap-2">
                  <span>Client Reviews</span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#FFC700]">
                    <Icon name="star" className="w-3.5 h-3.5 fill-[#FFC700] text-[#FFC700]" />
                    <span>{ratingLabel}</span>
                  </span>
                </span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              <Link
                href="/guides"
                onClick={() => setOpen(false)}
                className={rowClass(pathname.startsWith('/guides'))}
              >
                <span>Engineering &amp; Cost Guides</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className={rowClass(pathname.startsWith('/about'))}
              >
                <span>About Rise Up</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              <Link
                href="/careers"
                onClick={() => setOpen(false)}
                className={rowClass(pathname.startsWith('/careers'))}
              >
                <span>Careers</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={rowClass(pathname === '/contact')}
              >
                <span>Contact Us</span>
                <Icon name="chevron-right" className="w-4 h-4 text-[#C8DDF0]" />
              </Link>
            </nav>
          </div>

          {/* Drawer Footer Strip */}
          <div className="px-5 py-4 border-t border-white/12 bg-[#0B1B2B] space-y-2 text-xs text-[#C8DDF0] shrink-0 tabular-nums">
            <p className="font-semibold text-[#C8DDF0]">
              CA Lic #{LICENSE_NUMBER} · OC Preferred #247226 · 25-Yr Warranty
            </p>
            <div className="flex items-center justify-between">
              <span>&copy; {new Date().getFullYear()} Rise Up Roofing</span>
              <a
                href="https://projektsvision.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#FFFFFF] hover:text-[#2F9FE3] transition-colors"
              >
                <span>Powered by PROJEKTS</span>
                <Icon name="arrow-up-right" className="w-3.5 h-3.5 text-[#2F9FE3]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open navigation menu'}
        aria-expanded={open}
        className="lg:hidden inline-flex min-h-[40px] items-center gap-2 px-3 py-2 rounded-[10px] bg-[#FFFFFF] hover:bg-[#F4F9FC] border border-[#0B1B2B]/16 text-xs font-extrabold uppercase tracking-[0.04em] text-[#0B1B2B] transition-colors cursor-pointer"
      >
        <span>Menu</span>
        <Icon name={open ? 'x' : 'menu'} className="w-4 h-4 text-[#0B1B2B]" />
      </button>

      {sheetContent ? createPortal(sheetContent, document.body) : null}
    </>
  );
}
