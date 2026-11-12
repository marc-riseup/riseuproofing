'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import { clsx as cn } from 'clsx';
import { PHONE_HREF, PHONE_NUMBER, LICENSE_NUMBER } from '@/lib/utils';
import { SERVICES_MEGA_MENU, TOP_CITIES } from '@/lib/data/navigation';
import type { ReviewStats } from '@/lib/reviews-server';
import { MobileNav } from './MobileNav';

const ROUTE_LABELS: Record<string, string> = {
  services: 'Services',
  projects: 'Projects',
  reviews: 'Reviews',
  about: 'About',
  contact: 'Estimate',
  careers: 'Careers',
  'service-area': 'Areas',
  'roof-financing-san-diego': 'Financing',
  guides: 'Guides',
  privacy: 'Privacy',
  terms: 'Terms',
};

const ROUTE_TITLES: Record<string, string> = {
  services: 'Our Services',
  projects: 'Our Projects',
  reviews: 'Client Reviews',
  about: 'About Rise Up',
  contact: 'Free Estimate',
  careers: 'Careers',
  'service-area': 'Service Areas',
  'roof-financing-san-diego': 'Roof Financing San Diego',
  guides: 'Engineering & Cost Guides',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
};

function getRouteNavInfo(pathname: string | null) {
  if (!pathname || pathname === '/') return null;
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/proposal') ||
    pathname.startsWith('/inspection') ||
    pathname.startsWith('/warranty')
  ) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const first = segments[0];

  if (segments.length === 1) {
    return {
      parentHref: '/',
      label: 'Home',
      title: ROUTE_TITLES[first] || first.charAt(0).toUpperCase() + first.slice(1),
    };
  }

  const parentHref = `/${first}`;
  const parentLabel = ROUTE_LABELS[first] || first.charAt(0).toUpperCase() + first.slice(1);
  const slug = segments[1];

  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    parentHref,
    label: parentLabel,
    title,
  };
}

const NAV_LINK_BASE =
  'inline-flex items-center gap-1 whitespace-nowrap px-2.5 xl:px-3 py-2 rounded-[6px] text-xs xl:text-sm font-bold transition-colors';
const NAV_LINK_IDLE = 'text-[#1E3A52] hover:text-[#0B1B2B] hover:bg-[#F4F9FC]';
const NAV_LINK_ACTIVE = 'text-[#0F5C8C] bg-[#E8F1F8]';

export function Header({ stats }: { stats?: ReviewStats } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<'services' | 'areas' | null>(null);
  const servicesOpen = openMenu === 'services';
  const areasOpen = openMenu === 'areas';
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const navInfo = getRouteNavInfo(pathname);

  const handleMobileBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else if (navInfo?.parentHref) {
      router.push(navInfo.parentHref);
    }
  };

  const navRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 24;
          if (isScrolled !== lastScrolled) {
            setScrolled(isScrolled);
            lastScrolled = isScrolled;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => clearCloseTimer, []);

  useEffect(() => {
    if (!openMenu) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearCloseTimer();
        setOpenMenu(null);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        clearCloseTimer();
        setOpenMenu(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [openMenu]);

  // Close dropdowns on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
  }

  const openDropdown = (menu: 'services' | 'areas') => {
    clearCloseTimer();
    setOpenMenu(menu);
  };

  const scheduleCloseDropdown = (menu: 'services' | 'areas') => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu((cur) => (cur === menu ? null : cur));
    }, 150);
  };

  const ratingLabel = stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0';
  const reviewCount = Math.max(stats?.totalCount ?? 9, 9);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Tier 1 — Coastal Ink Utility Strip */}
      <div
        className={cn(
          'w-full bg-[#0B1B2B] text-[#FFFFFF] border-b border-white/12 transition-all duration-200 overflow-hidden',
          scrolled ? 'max-h-0 opacity-0 py-0 border-b-0' : 'max-h-10 opacity-100 py-1.5'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between text-xs leading-tight tabular-nums">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 font-semibold text-[#FFFFFF]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] shrink-0" aria-hidden="true" />
              <span>24/7 Emergency Leak Dispatch · 60–90 Min</span>
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 text-[#C8DDF0]">
              <Icon name="shield-check" className="w-3.5 h-3.5 text-[#FFC700] shrink-0" />
              <span>CSLB #{LICENSE_NUMBER} (C-39 &amp; Class B) · OC #247226</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/reviews"
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-[#FFFFFF] hover:text-[#FFC700] transition-colors font-semibold"
            >
              <Icon name="star" className="w-3.5 h-3.5 text-[#FFC700] fill-[#FFC700] shrink-0" />
              <span className="font-extrabold">{ratingLabel}</span>
              <span className="hidden sm:inline text-[#C8DDF0] font-medium">
                ({reviewCount}+ Verified Reviews)
              </span>
            </Link>

            <a
              href="mailto:info@riseuprac.com"
              className="hidden lg:inline-flex items-center gap-1.5 text-[#C8DDF0] hover:text-[#FFFFFF] transition-colors font-medium"
            >
              <Icon name="mail" className="w-3.5 h-3.5 text-[#2F9FE3] shrink-0" />
              <span>info@riseuprac.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tier 2 — Crisp Daylight Navigation Bar */}
      <div className="w-full glass-nav-surface transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-2.5 flex items-center justify-between gap-3 xl:gap-6">
          {/* Brand Logo Lockup & Subpage Mobile Back Navigation */}
          <Link
            href="/"
            prefetch={false}
            className={cn('shrink-0 items-center', navInfo ? 'hidden lg:flex' : 'flex')}
            aria-label="Rise Up Roofing & Construction — Home"
          >
            <img
              src="/logo.svg"
              alt="Rise Up Roofing & Construction"
              width={191}
              height={50}
              fetchPriority="low"
              decoding="async"
              className="h-9 sm:h-10 lg:h-[42px] w-auto object-contain"
            />
          </Link>

          {navInfo && (
            <div className="lg:hidden flex items-center gap-2.5 min-w-0 flex-1 mr-2">
              <button
                type="button"
                onClick={handleMobileBack}
                className="inline-flex min-h-[38px] items-center gap-1 -ml-1 px-3 py-1.5 rounded-[10px] bg-[#F4F9FC] hover:bg-[#E8F1F8] text-[#0B1B2B] font-bold text-xs border border-[#0B1B2B]/14 transition-colors shrink-0 cursor-pointer"
                aria-label={`Go back to ${navInfo.label}`}
              >
                <Icon name="chevron-left" className="w-4 h-4 text-[#0F5C8C]" />
                <span className="truncate max-w-[84px] sm:max-w-[120px]">{navInfo.label}</span>
              </button>
              <span className="text-xs sm:text-sm font-extrabold text-[#0B1B2B] tracking-[-0.015em] truncate">
                {navInfo.title}
              </span>
            </div>
          )}

          {/* Single-Line 7-Link Desktop Navigation */}
          <nav
            ref={navRef}
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-0.5 xl:gap-1"
          >
            {/* 1. Services + Architectural Spec Mega-Menu */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('services')}
              onMouseLeave={() => scheduleCloseDropdown('services')}
            >
              <Link
                href="/services"
                prefetch={false}
                aria-expanded={servicesOpen}
                className={cn(
                  NAV_LINK_BASE,
                  pathname.startsWith('/services') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
                )}
              >
                <span>Services</span>
                <Icon
                  name="chevron-down"
                  className={cn(
                    'w-3.5 h-3.5 text-[#3D566E] transition-transform duration-150',
                    servicesOpen && 'rotate-180 text-[#0F5C8C]'
                  )}
                />
              </Link>

              <div
                aria-hidden={!servicesOpen}
                inert={!servicesOpen ? true : undefined}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('a')) setOpenMenu(null);
                }}
                className={cn(
                  'absolute top-full -left-16 xl:-left-20 pt-2.5 w-[min(800px,calc(100vw-32px))] z-50 transition-all duration-150 ease-out',
                  servicesOpen
                    ? 'opacity-100 visible pointer-events-auto translate-y-0'
                    : 'opacity-0 invisible pointer-events-none translate-y-1'
                )}
              >
                <div className="bg-[#FFFFFF] rounded-[14px] border border-[#0B1B2B]/14 shadow-[0_24px_54px_-12px_rgba(11,27,43,0.22)] overflow-hidden">
                  <div className="grid grid-cols-3 divide-x divide-[#0B1B2B]/10 p-6">
                    {SERVICES_MEGA_MENU.map((col, colIdx) => (
                      <div
                        key={col.category}
                        className={cn(
                          'flex flex-col',
                          colIdx === 0 && 'pr-5',
                          colIdx === 1 && 'px-5',
                          colIdx === 2 && 'pl-5'
                        )}
                      >
                        <Link
                          href={col.href}
                          prefetch={false}
                          className="group/cat block pb-3 border-b border-[#0B1B2B]/10"
                        >
                          <span className="block font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[-0.015em] text-[#0B1B2B] group-hover/cat:text-[#0F5C8C] transition-colors">
                            {col.category}
                          </span>
                          <span className="block mt-1 text-xs text-[#3D566E] leading-snug tabular-nums">
                            {col.description}
                          </span>
                        </Link>

                        <ul className="mt-2.5 space-y-0.5">
                          {col.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                prefetch={false}
                                className="group/item flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded-[6px] text-xs font-semibold text-[#1E3A52] hover:text-[#0F5C8C] hover:bg-[#F4F9FC] transition-colors"
                              >
                                <span className="truncate">{item.label}</span>
                                <Icon
                                  name="arrow-right"
                                  className="w-3 h-3 shrink-0 text-[#0F5C8C] opacity-0 group-hover/item:opacity-100 transition-opacity"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Coastal Ink Credential & Action Strip */}
                  <div className="bg-[#0B1B2B] text-[#FFFFFF] px-6 py-3.5 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-[#C8DDF0] tabular-nums">
                      Owens Corning Preferred #247226 · 25-Year Non-Prorated System Warranty
                    </p>
                    <Link
                      href="/contact"
                      prefetch={false}
                      className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#FFC700] hover:opacity-95 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.04em] text-[#0B1B2B] transition-opacity shrink-0 tabular-nums"
                    >
                      <span>Book Free 21-Point Inspection</span>
                      <Icon name="arrow-right" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Projects */}
            <Link
              href="/projects"
              prefetch={false}
              className={cn(
                NAV_LINK_BASE,
                pathname.startsWith('/projects') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
              )}
            >
              Projects
            </Link>

            {/* 3. Service Areas + City Hubs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('areas')}
              onMouseLeave={() => scheduleCloseDropdown('areas')}
            >
              <Link
                href="/service-area"
                prefetch={false}
                aria-expanded={areasOpen}
                className={cn(
                  NAV_LINK_BASE,
                  pathname.startsWith('/service-area') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
                )}
              >
                <span>Service Areas</span>
                <Icon
                  name="chevron-down"
                  className={cn(
                    'w-3.5 h-3.5 text-[#3D566E] transition-transform duration-150',
                    areasOpen && 'rotate-180 text-[#0F5C8C]'
                  )}
                />
              </Link>

              <div
                aria-hidden={!areasOpen}
                inert={!areasOpen ? true : undefined}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('a')) setOpenMenu(null);
                }}
                className={cn(
                  'absolute top-full left-0 pt-2.5 w-[320px] z-50 transition-all duration-150 ease-out',
                  areasOpen
                    ? 'opacity-100 visible pointer-events-auto translate-y-0'
                    : 'opacity-0 invisible pointer-events-none translate-y-1'
                )}
              >
                <div className="bg-[#FFFFFF] rounded-[14px] border border-[#0B1B2B]/14 shadow-[0_24px_54px_-12px_rgba(11,27,43,0.22)] overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#0B1B2B]/10 text-xs font-bold uppercase tracking-[0.05em] text-[#3D566E]">
                    San Diego &amp; North County Hubs
                  </div>

                  <div className="grid grid-cols-2 gap-0.5 p-2.5">
                    {TOP_CITIES.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/service-area/${city.slug}`}
                        prefetch={false}
                        className="px-2.5 py-1.5 rounded-[6px] text-xs font-semibold text-[#1E3A52] hover:text-[#0F5C8C] hover:bg-[#F4F9FC] transition-colors truncate"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>

                  <div className="bg-[#F4F9FC] px-4 py-2.5 border-t border-[#0B1B2B]/10">
                    <Link
                      href="/service-area"
                      prefetch={false}
                      className="flex items-center justify-between text-xs font-bold text-[#0F5C8C] hover:text-[#0B1B2B] transition-colors tabular-nums"
                    >
                      <span>All 32 Cities &amp; Coverage Map</span>
                      <Icon name="arrow-right" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Financing */}
            <Link
              href="/roof-financing-san-diego"
              prefetch={false}
              className={cn(
                NAV_LINK_BASE,
                pathname === '/roof-financing-san-diego' ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
              )}
            >
              Financing
            </Link>

            {/* 5. Reviews */}
            <Link
              href="/reviews"
              prefetch={false}
              className={cn(NAV_LINK_BASE, pathname === '/reviews' ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
            >
              Reviews
            </Link>

            {/* 6. Guides */}
            <Link
              href="/guides"
              prefetch={false}
              className={cn(
                NAV_LINK_BASE,
                pathname.startsWith('/guides') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
              )}
            >
              Guides
            </Link>

            {/* 7. About */}
            <Link
              href="/about"
              prefetch={false}
              className={cn(
                NAV_LINK_BASE,
                pathname.startsWith('/about') ? NAV_LINK_ACTIVE : NAV_LINK_IDLE
              )}
            >
              About
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 xl:gap-3 shrink-0">
            <a
              href={PHONE_HREF}
              className="hidden xl:inline-flex min-h-[42px] items-center gap-2 px-3 py-2 rounded-[10px] border border-[#0B1B2B]/14 bg-[#F4F9FC] hover:bg-[#FFFFFF] hover:border-[#0B1B2B]/28 text-xs font-extrabold text-[#0B1B2B] transition-colors tabular-nums whitespace-nowrap"
              aria-label={`Call ${PHONE_NUMBER}`}
            >
              <Icon name="phone" className="w-3.5 h-3.5 text-[#0F5C8C] shrink-0" />
              <span>{PHONE_NUMBER}</span>
            </a>

            <Link
              href="/contact"
              prefetch={false}
              className="hidden sm:inline-flex min-h-[42px] items-center gap-1.5 rounded-[10px] bg-[#C92D20] hover:opacity-95 px-4 py-2 font-[family-name:var(--font-display)] text-xs font-extrabold uppercase tracking-[0.04em] text-[#FFFFFF] shadow-[0_2px_4px_rgba(201,45,32,0.28),0_10px_22px_-6px_rgba(201,45,32,0.45)] transition-opacity whitespace-nowrap"
            >
              <span>Free Estimate</span>
              <Icon name="arrow-right" className="w-3.5 h-3.5 shrink-0" />
            </Link>

            <MobileNav stats={stats} />
          </div>
        </div>
      </div>
    </header>
  );
}
