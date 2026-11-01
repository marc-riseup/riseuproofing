'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BRAND_DATA } from '@/lib/brand-data';
import { company, navServiceGroups, navTopCities } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';

const PRIMARY_AFTER_AREAS = [
  { id: 'financing', label: 'Financing', href: '/roof-financing-san-diego' },
  { id: 'reviews', label: 'Reviews', href: '/reviews' },
  { id: 'guides', label: 'Guides', href: '/guides' },
  { id: 'about', label: 'About', href: '/about' },
] as const;

const MOBILE_PAGE_LINKS = [
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'financing', label: 'Financing Options', href: '/roof-financing-san-diego' },
  { id: 'reviews', label: 'Customer Reviews', href: '/reviews' },
  { id: 'guides', label: 'Roofing Guides', href: '/guides' },
  { id: 'about', label: 'About Rise Up', href: '/about' },
  { id: 'tear-off', label: 'Roof Tear-Off Process', href: '/about/roof-tear-off-process' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
  { id: 'careers', label: 'Careers', href: '/careers' },
  { id: 'contact', label: 'Contact Us', href: '/contact' },
] as const;

type Strip = { kind: 'default' } | { kind: 'rain' };
type MenuKind = 'services' | 'areas' | null;

export function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKind>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false);
  const [strip, setStrip] = useState<Strip>({ kind: 'default' });
  const [menuPillStyle, setMenuPillStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const chromeRef = useRef<HTMLDivElement>(null);
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const areasBtn = useRef<HTMLButtonElement>(null);
  const menuWrapRef = useRef<HTMLLIElement>(null);
  const areasWrapRef = useRef<HTMLLIElement>(null);
  const menuColsRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const menuOpen = openMenu === 'services';
  const areasOpen = openMenu === 'areas';

  const moveMenuPill = useCallback((el: HTMLElement | null) => {
    const container = menuColsRef.current;
    if (!el || !container) {
      setMenuPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setMenuPillStyle({
      width: `${er.width}px`,
      height: `${er.height}px`,
      transform: `translate3d(${er.left - cr.left}px, ${er.top - cr.top}px, 0)`,
      opacity: 1,
    });
  }, []);

  /* Scroll: strip collapses after 80px; nav hides on scroll down, returns condensed on scroll up */
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let isHidden = false;
    let isCondensed = false;
    let idleTimer: number | undefined;
    const syncChrome = (y: number) => {
      const el = chromeRef.current;
      if (!el) return;
      const stripVal = y > 80 ? 'closed' : 'open';
      if (el.dataset.strip !== stripVal) el.dataset.strip = stripVal;
      if (isHidden && !sheetOpenRef.current) {
        if (el.dataset.hidden !== 'true') el.dataset.hidden = 'true';
      } else if (el.dataset.hidden) {
        delete el.dataset.hidden;
      }
      if (isCondensed) {
        if (el.dataset.condensed !== 'true') el.dataset.condensed = 'true';
      } else if (el.dataset.condensed) {
        delete el.dataset.condensed;
      }
    };
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const dy = y - lastY;
      if (y < 80) {
        isHidden = false;
        isCondensed = false;
      } else if (dy > 6 && y > 200) {
        isHidden = true;
        setOpenMenu((prev) => (prev ? null : prev));
      } else if (dy < -6) {
        isHidden = false;
        isCondensed = true;
      }
      if (Math.abs(dy) > 6) lastY = y;
      syncChrome(y);
    };
    const onScroll = () => {
      const el = chromeRef.current;
      if (el && el.dataset.scrolling !== 'true') el.dataset.scrolling = 'true';
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (chromeRef.current) delete chromeRef.current.dataset.scrolling;
      }, 150);
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer);
    };
  }, []);

  /* Rain check (Open-Meteo via /api/forecast). Any failure silently keeps the default strip. */
  useEffect(() => {
    const run = () =>
      fetch('/api/forecast')
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { rainSoon?: boolean } | null) => d?.rainSoon && setStrip({ kind: 'rain' }))
        .catch(() => undefined);
    const schedule = () => window.setTimeout(run, 4500);
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  }, []);

  /* Chrome tone follows the section under the nav (dark only once the live sky is running).
     Written to <html data-chrome-tone> so the nav and the mobile bar share it. */
  useEffect(() => {
    let raf = 0;
    let innerH = window.innerHeight;
    type ToneSpan = { top: number; bottom: number; tone: string };
    let spans: ToneSpan[] = [];

    const measure = () => {
      innerH = window.innerHeight;
      const y = window.scrollY;
      const els = document.querySelectorAll<HTMLElement>('main [data-tone], body > [data-tone], footer[data-tone]');
      spans = Array.from(els).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          top: r.top + y,
          bottom: r.bottom + y,
          tone: el.dataset.tone ?? 'light',
        };
      });
    };

    const setAttr = (el: HTMLElement, key: 'chromeTone' | 'barTone', val: string) => {
      if (el.dataset[key] !== val) el.dataset[key] = val;
    };

    const update = () => {
      raf = 0;
      const root = document.documentElement;
      if (!root.classList.contains('sky-live')) {
        setAttr(root, 'chromeTone', 'light');
        setAttr(root, 'barTone', 'light');
        return;
      }
      const scrollY = window.scrollY;
      const probe = (docY: number) => {
        let tone = 'light';
        for (let i = 0; i < spans.length; i++) {
          const s = spans[i];
          if (s.top <= docY && s.bottom > docY) tone = s.tone;
        }
        return tone;
      };
      setAttr(root, 'chromeTone', probe(scrollY + 40));
      setAttr(root, 'barTone', probe(scrollY + innerH - 40));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    const mo = new MutationObserver(() => {
      measure();
      onScroll();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(document.body);
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      mo.disconnect();
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Dropdown menus: 100ms hover intent, click/keyboard toggle, Escape closes */
  const enterMenu = (kind: Exclude<MenuKind, null>, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || chromeRef.current?.dataset.scrolling === 'true') return;
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setOpenMenu(kind), 100);
  };
  const leaveMenu = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      setMenuPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }, 180);
  };
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        (!menuWrapRef.current || !menuWrapRef.current.contains(t)) &&
        (!areasWrapRef.current || !areasWrapRef.current.contains(t))
      ) {
        setOpenMenu(null);
        setMenuPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu && !sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const wasAreas = openMenu === 'areas';
      setOpenMenu(null);
      setSheetOpen(false);
      setMobileServicesOpen(false);
      setMobileAreasOpen(false);
      setMenuPillStyle((prev) => ({ ...prev, opacity: 0 }));
      if (wasAreas) areasBtn.current?.focus();
      else servicesBtn.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMenu, sheetOpen]);

  const closeAllMobile = () => {
    setMobileServicesOpen(false);
    setMobileAreasOpen(false);
    setSheetOpen(false);
  };

  const rain = strip.kind === 'rain';

  let itemIdx = 0;

  return (
    <div
      ref={chromeRef}
      className="chrome"
      data-strip="open"
    >
      <a className="strip" href={rain ? '#inspect' : company.phoneHref} data-rain={rain || undefined}>
        <span className="strip__dot" aria-hidden="true" />
        <span className="strip__text">
          {rain ? 'Rain on the way - book a free leak check' : '24/7 emergency storm dispatch'}
        </span>
        <span className="strip__call">{rain ? 'Book now' : `Call ${company.phone}`}</span>
      </a>

      <header className="nav">
        <a className="nav__brand" href="/" aria-label="Rise Up Roofing & Construction, home">
          <img className="nav__logo nav__logo--light" src={BRAND_DATA.logoLight} alt="" width="168" height="40" />
          <img className="nav__logo nav__logo--dark" src="/img/brand/logo-dark-bg.svg" alt="" width="168" height="40" loading="lazy" />
        </a>

        <nav className="nav__primary" aria-label="Primary">
          <ul className="nav__list">
            {/* 1. Services Mega-Menu (all 16 services in 3 categories) */}
            <li
              ref={menuWrapRef}
              className="nav__item nav__item--menu"
              data-nav="services"
              onPointerEnter={(e) => enterMenu('services', e)}
              onPointerLeave={leaveMenu}
            >
              <button
                ref={servicesBtn}
                type="button"
                className="nav__link"
                aria-expanded={menuOpen}
                aria-controls="services-menu"
                onClick={() => setOpenMenu((v) => (v === 'services' ? null : 'services'))}
              >
                Services
                <Icon name="chevron" className="nav__chev" />
              </button>
              <div id="services-menu" className="menu menu--services" data-open={menuOpen || undefined} inert={!menuOpen}>
                <div
                  ref={menuColsRef}
                  className="menu__cols"
                  onPointerLeave={() => setMenuPillStyle((prev) => ({ ...prev, opacity: 0 }))}
                >
                  <span className="menu__pill" style={menuPillStyle} aria-hidden="true" />
                  {navServiceGroups.map((group) => (
                    <div key={group.category} className="menu__col">
                      <p className="menu__cat-title">{group.category}</p>
                      <ul className="menu__group-list">
                        {group.items.map((s) => {
                          const idx = itemIdx++;
                          return (
                            <li key={s.href} style={{ '--i': idx } as React.CSSProperties}>
                              <a
                                className="menu__link"
                                href={s.href}
                                onPointerEnter={(e) => {
                                  if (e.pointerType === 'mouse') moveMenuPill(e.currentTarget);
                                }}
                                onFocus={(e) => moveMenuPill(e.currentTarget)}
                                onClick={() => setOpenMenu(null)}
                              >
                                <span className="menu__ico" aria-hidden="true">
                                  <Icon name={s.icon} className="ico" />
                                </span>
                                <span className="menu__copy">
                                  <span className="menu__label">{s.label}</span>
                                  <span className="menu__note">{s.note}</span>
                                </span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="menu__foot">
                  <a className="tlink menu__all" href="/services" onClick={() => setOpenMenu(null)}>
                    Explore All 16 Services
                    <Icon name="arrow" className="tlink__arrow" />
                  </a>
                </div>
              </div>
            </li>

            {/* 2. Projects */}
            <li className="nav__item" data-nav="projects">
              <a className="nav__link" href="/projects">
                Projects
              </a>
            </li>

            {/* 3. Service Areas Dropdown (Top 10 cities + All 32 hub link) */}
            <li
              ref={areasWrapRef}
              className="nav__item nav__item--menu"
              data-nav="service-areas"
              onPointerEnter={(e) => enterMenu('areas', e)}
              onPointerLeave={leaveMenu}
            >
              <button
                ref={areasBtn}
                type="button"
                className="nav__link"
                aria-expanded={areasOpen}
                aria-controls="areas-menu"
                onClick={() => setOpenMenu((v) => (v === 'areas' ? null : 'areas'))}
              >
                Service Areas
                <Icon name="chevron" className="nav__chev" />
              </button>
              <div id="areas-menu" className="menu menu--areas" data-open={areasOpen || undefined} inert={!areasOpen}>
                <p className="menu__cat-title menu__cat-title--areas">San Diego County Coverage</p>
                <ul className="menu__cities">
                  {navTopCities.map((c, idx) => (
                    <li key={c.slug} style={{ '--i': idx } as React.CSSProperties}>
                      <a className="menu__city-link" href={c.href} onClick={() => setOpenMenu(null)}>
                        <Icon name="pin" className="menu__city-pin" />
                        <span>{c.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="menu__foot">
                  <a className="tlink menu__all" href="/service-area" onClick={() => setOpenMenu(null)}>
                    View All 32 Service Areas
                    <Icon name="arrow" className="tlink__arrow" />
                  </a>
                </div>
              </div>
            </li>

            {/* 4–7. Financing, Reviews, Guides, About */}
            {PRIMARY_AFTER_AREAS.map((l) => (
              <li key={l.id} className="nav__item" data-nav={l.id}>
                <a className="nav__link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="nav__phone" href={company.phoneHref}>
          <span className="nav__phone-icon" aria-hidden="true">
            <Icon name="phone" />
          </span>
          <span className="nav__phone-text">
            <span className="nav__phone-kicker">Talk to a roofer</span>
            <span className="nav__phone-num">{company.phone}</span>
          </span>
        </a>

        <a className="btn nav__cta chrome-red" href="#estimate">
          Free estimate
        </a>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={sheetOpen}
          aria-controls="mobile-sheet"
          aria-label={sheetOpen ? 'Close menu' : 'Open menu'}
          onClick={() =>
            setSheetOpen((v) => {
              if (v) {
                setMobileServicesOpen(false);
                setMobileAreasOpen(false);
              }
              return !v;
            })
          }
        >
          <span />
          <span />
        </button>
      </header>

      <div id="mobile-sheet" data-sheet="mnav-sheet" className="sheet" data-open={sheetOpen || undefined} inert={!sheetOpen}>
        <ul className="sheet__list">
          {/* Mobile Services Accordion (all 16 services) */}
          <li className="sheet__item sheet__item--services">
            <button
              type="button"
              className="sheet__link sheet__trigger"
              aria-expanded={mobileServicesOpen}
              aria-controls="mobile-services-list"
              onClick={() => setMobileServicesOpen((v) => !v)}
            >
              <span>Services (16)</span>
              <Icon name="chevron" className="nav__chev sheet__chev" />
            </button>
            <div
              id="mobile-services-list"
              className="sheet__sub"
              data-open={mobileServicesOpen || undefined}
              inert={!mobileServicesOpen}
            >
              <div className="sheet__sub-in">
                {navServiceGroups.map((group) => (
                  <div key={group.category} className="sheet__group">
                    <p className="sheet__group-title">{group.category}</p>
                    <ul className="sheet__services">
                      {group.items.map((s) => (
                        <li key={s.href}>
                          <a className="sheet__service-link" href={s.href} onClick={closeAllMobile}>
                            <span className="menu__ico" aria-hidden="true">
                              <Icon name={s.icon} className="ico" />
                            </span>
                            <span className="menu__copy">
                              <span className="menu__label">{s.label}</span>
                              <span className="menu__note">{s.note}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <a className="tlink menu__all sheet__all" href="/services" onClick={closeAllMobile}>
                  Explore All 16 Services
                  <Icon name="arrow" className="tlink__arrow" />
                </a>
              </div>
            </div>
          </li>

          {/* Mobile Service Areas Accordion (Top 10 cities + All 32 hub link) */}
          <li className="sheet__item sheet__item--areas">
            <button
              type="button"
              className="sheet__link sheet__trigger"
              aria-expanded={mobileAreasOpen}
              aria-controls="mobile-areas-list"
              onClick={() => setMobileAreasOpen((v) => !v)}
            >
              <span>Service Areas (32 Cities)</span>
              <Icon name="chevron" className="nav__chev sheet__chev" />
            </button>
            <div
              id="mobile-areas-list"
              className="sheet__sub"
              data-open={mobileAreasOpen || undefined}
              inert={!mobileAreasOpen}
            >
              <div className="sheet__sub-in">
                <ul className="sheet__cities">
                  {navTopCities.map((c) => (
                    <li key={c.slug}>
                      <a className="sheet__city-link" href={c.href} onClick={closeAllMobile}>
                        <Icon name="pin" className="menu__city-pin" />
                        <span>{c.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="tlink menu__all sheet__all" href="/service-area" onClick={closeAllMobile}>
                  View All 32 Service Areas
                  <Icon name="arrow" className="tlink__arrow" />
                </a>
              </div>
            </div>
          </li>

          {/* Mobile Direct Page Links */}
          {MOBILE_PAGE_LINKS.map((l) => (
            <li key={l.id}>
              <a className="sheet__link" href={l.href} onClick={closeAllMobile}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="sheet__tel" href={company.phoneHref}>
          Call {company.phone}
        </a>
      </div>
    </div>
  );
}
