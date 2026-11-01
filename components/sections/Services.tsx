'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { featuredServices, moreServices } from '@/lib/content';
import { usd } from '@/lib/ballpark';
import { Icon } from '@/components/ui/Icon';

const pad = (n: number) => String(n).padStart(2, '0');

export function Services() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const cur = featuredServices[active];
  const [dispPrice, setDispPrice] = useState<[number, number, number]>([cur.low, cur.high, cur.monthly]);
  const prevPriceRef = useRef<[number, number, number]>([cur.low, cur.high, cur.monthly]);

  const syncThumb = useCallback(() => {
    const list = listRef.current;
    const btn = tabRefs.current[active];
    if (!list || !btn) return;
    setThumb({
      x: btn.offsetLeft,
      y: btn.offsetTop,
      w: btn.offsetWidth,
      h: btn.offsetHeight,
    });
  }, [active]);

  useEffect(() => {
    syncThumb();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncThumb) : null;
    if (listRef.current) ro?.observe(listRef.current);
    window.addEventListener('resize', syncThumb);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', syncThumb);
    };
  }, [syncThumb]);

  // Smooth price roll-up when switching service tabs
  useEffect(() => {
    const [fromLow, fromHigh, fromMo] = prevPriceRef.current;
    const toLow = cur.low;
    const toHigh = cur.high;
    const toMo = cur.monthly;
    if (fromLow === toLow && fromHigh === toHigh) return;

    const t0 = performance.now();
    const dur = 360;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setDispPrice([
        Math.round(fromLow + (toLow - fromLow) * ease),
        Math.round(fromHigh + (toHigh - fromHigh) * ease),
        Math.round(fromMo + (toMo - fromMo) * ease),
      ]);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevPriceRef.current = [toLow, toHigh, toMo];
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cur.low, cur.high, cur.monthly]);

  const selectTab = (idx: number, focus = false) => {
    const next = (idx + featuredServices.length) % featuredServices.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
    const btn = tabRefs.current[next];
    if (btn && listRef.current && listRef.current.scrollWidth > listRef.current.clientWidth) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectTab(idx + 1, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectTab(idx - 1, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectTab(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      selectTab(featuredServices.length - 1, true);
    }
  };

  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const triggerEstimate = (ballparkId: (typeof featuredServices)[number]['ballparkId']) => {
    window.dispatchEvent(new CustomEvent('riseup:ballpark', { detail: { service: ballparkId } }));
  };

  return (
    <section id="services" className="section services" data-tone="light" aria-labelledby="services-h">
      <div className="wrap">
        {/* 1. Compact Header Row with License Pill & Skewed Gold Marker */}
        <header className="services__head svc__head">
          <div className="services__head-main">
            <div className="services__kicker">
              <span className="services__kicker-dot" aria-hidden="true" />
              <span>CA Lic #1096492 · C-39 Roofing &amp; Class B Construction</span>
            </div>
            <h2 id="services-h" className="h2 services__h">
              Complete Roofing &amp; Construction{' '}
              <mark className="marker hl">
                <span className="hl__bg" aria-hidden="true" />
                <span className="hl__text">Solutions</span>
              </mark>
            </h2>
          </div>
          <div>
            <p className="lead services__lead">
              One licensed crew handles the roof and whatever sits under it — with real San Diego price ranges shown
              upfront before anyone visits.
            </p>
            <a className="tlink" href="/services">
              View all 16 services
              <Icon name="arrow" className="tlink__arrow" />
            </a>
          </div>
        </header>

        {/* 2. Interactive Glass Instrument Tab Dock */}
        <div
          ref={listRef}
          className="svc-tabs glass"
          role="tablist"
          aria-label="Core roofing and construction services"
        >
          {thumb && (
            <span
              className="svc-tabs__thumb"
              aria-hidden="true"
              style={{
                width: `${thumb.w}px`,
                height: `${thumb.h}px`,
                transform: `translate3d(${thumb.x}px, ${thumb.y}px, 0)`,
              }}
            />
          )}
          {featuredServices.map((s, i) => {
            const isOn = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`svc-tab-${s.id}`}
                type="button"
                role="tab"
                aria-selected={isOn}
                aria-controls={`svc-panel-${s.id}`}
                tabIndex={isOn ? 0 : -1}
                className={`svc-tab ${isOn ? 'is-active' : ''}`}
                onClick={() => selectTab(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                <span className={`est__chip svc-tab__chip ${isOn ? 'is-selected' : ''}`} aria-hidden="true">
                  <Icon name={s.icon} className="ico" />
                </span>
                <span className="svc-tab__meta">
                  <span className="svc-tab__title">{s.tab}</span>
                  <span className="svc-tab__sub">{s.tabSub}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Showcase Stage (crisp tonal card so inner HUD glass never stacks glass-on-glass) */}
        <div
          ref={stageRef}
          className="svc svc-stage"
          onPointerMove={onStageMove}
        >
          <span className="svc-stage__glare" aria-hidden="true" />

          {/* Left: Cross-fading Photo Stage + Floating Glass HUD Pills */}
          <div className="svc-stage__media photo">
            {featuredServices.map((s, i) => (
              <picture
                key={s.id}
                className="svc-stage__pic"
                data-active={i === active || undefined}
                aria-hidden={i !== active}
              >
                <source type="image/avif" srcSet={`${s.image}.avif`} />
                <img
                  src={`${s.image}.webp`}
                  alt={s.alt}
                  width={960}
                  height={600}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </picture>
            ))}

            <div className="svc-stage__hud" aria-hidden="true">
              <span className="svc-hud svc-hud--badge glass">
                <Icon name="star" className="svc-hud__star" />
                <span>{cur.badge}</span>
              </span>
            </div>
          </div>

          {/* Right: Elevated Inner White Dossier Well (all 5 articles stay in DOM for SEO) */}
          <div className="svc-stage__well">
            {featuredServices.map((s, i) => {
              const isOn = i === active;
              const plus = s.id === 'commercial' ? '+' : '';
              return (
                <article
                  key={s.id}
                  id={`svc-panel-${s.id}`}
                  role="tabpanel"
                  aria-labelledby={`svc-tab-${s.id}`}
                  aria-hidden={!isOn}
                  data-active={isOn || undefined}
                  className="svc-panel"
                >
                  <div className="svc-panel__top">
                    <span className="svc-panel__idx">
                      {pad(i + 1)} <span>/ {pad(featuredServices.length)}</span>
                    </span>
                    <span className="svc-panel__time-pill">
                      <span className="svc-hud__dot" aria-hidden="true" />
                      {s.time}
                    </span>
                  </div>

                  <h3 id={`svc-${s.id}`} className="h3 svc__title">
                    {s.title}
                  </h3>

                  {/* Hero-Matched Price Range & Monthly Pill Instrument */}
                  <div className="svc-price-box">
                    <div className="svc-price-box__main">
                      <span className="svc-price-box__label">Typical San Diego range</span>
                      <div className="svc-price-box__row">
                        <span className="svc-price-box__val tabular-nums">
                          {isOn ? `${usd(dispPrice[0])}–${usd(dispPrice[1])}${plus}` : s.cost}
                        </span>
                        <span className="est__monthly svc-price-box__mo tabular-nums">
                          or from {usd(isOn ? dispPrice[2] : s.monthly)}/mo
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="svc__bullets">
                    {s.bullets.map((b, bi) => (
                      <li key={b} style={{ '--bi': bi } as React.CSSProperties}>
                        <span className="svc__check" aria-hidden="true">
                          <Icon name="check" />
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="svc__actions">
                    <span className="magnet">
                      <button
                        type="button"
                        className="btn btn--sm svc__est-btn"
                        onClick={() => triggerEstimate(s.ballparkId)}
                      >
                        <span>Estimate {s.tab}</span>
                        <Icon name="arrow" className="btn__arrow" />
                      </button>
                    </span>
                    <a className="btn btn--sm svc__link" href={s.link.href}>
                      <span>{s.link.label}</span>
                      <Icon name="arrow" className="btn__arrow" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 4. Compact Specialty Pill Dock */}
        <nav className="services__more svc-dock" aria-label="Additional roofing and construction services">
          <span className="services__more-label svc-dock__label">Also licensed for</span>
          <div className="svc-dock__pills">
            {moreServices.map((m) => (
              <a key={m.href} className="svc-pill" href={m.href}>
                <span>{m.label}</span>
                <Icon name="arrow" className="svc-pill__arrow" />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
