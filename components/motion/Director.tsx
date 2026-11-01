'use client';

import { useEffect, useRef } from 'react';
import { HORIZON_PATHS } from '@/components/sky/horizon-paths';
import { loadMotion, reducedMotion } from '@/lib/motion';

/**
 * Owns the page's ambient motion & micro-interactions:
 *  - the sky: one ScrollTrigger timeline keyed to section anchors, cross-fading 5 gradient layers
 *  - the sun/moon arc, cloud fade, horizon tone, the one warm window
 *  - scroll-linked details: hero roof parallax, statement scale, warranty seal, footer wordmark
 *  - desktop micro-interactions: magnetic cursor-sticking buttons with spring release,
 *    hero pointer depth parallax (clouds, rooftops, badge panther), 3D card tilt + specular glare,
 *    skewed highlighter draw-in, number roll-up counters, and staggered scroll reveals
 *  - runtime optimizations: `html.hero-off` loop pausing and `html.lite` low-power detection
 * Reduced motion: none of it runs; the sky stays at morning and every section keeps light tone.
 */
export function Director() {
  const bar = useRef<HTMLDivElement>(null);

  // Page progress line (plain scroll listener, so it works in every mode).
  useEffect(() => {
    for (const k of ['back', 'mid', 'front'] as const) {
      document.getElementById(`hz-${k}`)?.setAttribute('d', HORIZON_PATHS[k]);
    }
    let raf = 0;
    let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y <= 0) {
        if (bar.current) bar.current.style.transform = 'scaleX(0)';
        return;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, y / maxScroll)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(document.body);
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Micro-interactions & runtime optimizations (zero-wait on mount)
  useEffect(() => {
    const html = document.documentElement;
    const cleanups: Array<() => void> = [];

    // 1. Runtime Optimization: Low-power / Save-Data detection + Hero off-screen loop pausing
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const lowPower =
      nav.connection?.saveData === true ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2);
    if (lowPower) html.classList.add('lite');

    const heroEl = document.getElementById('hero');
    if (heroEl && 'IntersectionObserver' in window) {
      const heroIo = new IntersectionObserver(([e]) => {
        html.classList.toggle('hero-off', !e.isIntersecting);
      });
      heroIo.observe(heroEl);
      cleanups.push(() => heroIo.disconnect());
    }

    if (reducedMotion()) {
      document.querySelectorAll<HTMLElement>('.hl, .marker').forEach((el) => el.classList.add('is-drawn'));
      return () => cleanups.forEach((fn) => fn());
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    // 2. Highlighter Marker Draw-In (.hl, .marker) + Hero Star Glint
    const hlEls = Array.from(document.querySelectorAll<HTMLElement>('.hl, .marker'));
    if ('IntersectionObserver' in window && hlEls.length) {
      const hlIo = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-drawn');
              hlIo.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.2 },
      );
      hlEls.forEach((el) => hlIo.observe(el));
      cleanups.push(() => hlIo.disconnect());
    } else {
      hlEls.forEach((el) => el.classList.add('is-drawn'));
    }

    const starWrap = document.querySelector<HTMLElement>('.rchip__score');
    if (starWrap) {
      const timer = window.setTimeout(() => starWrap.classList.add('is-glinting'), 320);
      cleanups.push(() => window.clearTimeout(timer));
    }

    // 3. Number Roll-Up Counters (zero childList mutations inside RAF loop)
    const animateCounter = (el: HTMLElement) => {
      if (el.dataset.counted === 'true') return;
      el.dataset.counted = 'true';
      const unitEl = el.querySelector<HTMLElement>('.stat__unit');
      const firstChild = el.childNodes[0];
      const textNode =
        firstChild && firstChild.nodeType === Node.TEXT_NODE
          ? (firstChild as Text)
          : null;
      const rawText = (unitEl && textNode ? textNode.nodeValue : el.textContent) ?? '';
      const trimmed = rawText.trim();
      const match = trimmed.match(/^(\$?)(\d+(?:\.\d+)?)(\+?)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseFloat(numStr);
      if (!Number.isFinite(target) || target === 0) return;
      const decimals = (numStr.split('.')[1] || '').length;
      const dur = 880;
      const t0 = performance.now();

      // Update only TextNode.nodeValue so MutationObservers on childList never fire at 60fps
      let targetTextNode: Text;
      if (unitEl && textNode) {
        targetTextNode = textNode;
      } else {
        targetTextNode = document.createTextNode(trimmed);
        el.replaceChildren(targetTextNode);
        if (unitEl) el.appendChild(unitEl);
      }

      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const val = (target * easeOutExpo(p)).toFixed(decimals);
        targetTextNode.nodeValue = `${prefix}${val}${suffix}`;
        if (p < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    const counterEls = Array.from(
      document.querySelectorAll<HTMLElement>('.reviews__rating, .agg__score, .seal__num, .stat__value'),
    );
    if ('IntersectionObserver' in window && counterEls.length) {
      const countIo = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              animateCounter(entry.target as HTMLElement);
              countIo.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.35 },
      );
      counterEls.forEach((el) => countIo.observe(el));
      cleanups.push(() => countIo.disconnect());
    }

    // 4. Staggered Below-the-Fold Scroll Reveals (never hides above-the-fold LCP content)
    const revealSelector =
      '.services__head, .svc-tabs, .svc, .services__more, .projects__head, .seg, .proj, .reviews__agg, .quote, .claim, .standard__photo, .warranty, .cred, .stat, .inspector, .final__copy, form.lead, .faq__h, .faq__item, .careers__row';
    const revealCandidates = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    if ('IntersectionObserver' in window && revealCandidates.length) {
      const vh = window.innerHeight;
      const toObserve: HTMLElement[] = [];
      let parentPrev: Element | null = null;
      let siblingIdx = 0;

      for (const el of revealCandidates) {
        const r = el.getBoundingClientRect();
        // Only arm elements strictly below the current viewport so initial paint & anchor jumps never flash
        if (r.top > vh * 0.98) {
          if (el.parentElement === parentPrev) {
            siblingIdx = Math.min(5, siblingIdx + 1);
          } else {
            parentPrev = el.parentElement;
            siblingIdx = 0;
          }
          el.classList.add('will-reveal');
          if (siblingIdx > 0) {
            el.style.setProperty('--reveal-delay', `${siblingIdx * 65}ms`);
          }
          toObserve.push(el);
        }
      }

      if (toObserve.length) {
        const revealIo = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                target.classList.add('is-revealed');
                revealIo.unobserve(target);
                window.setTimeout(() => {
                  target.classList.remove('will-reveal', 'is-revealed');
                  target.style.removeProperty('--reveal-delay');
                }, 750);
              }
            }
          },
          { threshold: 0.08, rootMargin: '0px 0px 32px 0px' },
        );
        toObserve.forEach((el) => revealIo.observe(el));
        cleanups.push(() => {
          revealIo.disconnect();
          toObserve.forEach((el) => {
            el.classList.remove('will-reveal', 'is-revealed');
            el.style.removeProperty('--reveal-delay');
          });
        });
      }
    }

    // 5a-hero. Hero Pointer & Touch Depth Parallax (rooftops, clouds, OC Pink Panther)
    if (heroEl && !lowPower) {
      const roofImg = heroEl.querySelector<HTMLElement>('.hero__roof-img');
      const cloudsEl = document.querySelector<HTMLElement>('.sky__clouds');
      const pantherEl = heroEl.querySelector<HTMLElement>('.badge__panther');
      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;
      let ptrRaf = 0;
      let lastTime = performance.now();

      const ptrTick = (now: number) => {
        const dt = Math.min(48, Math.max(8, now - lastTime));
        lastTime = now;
        const k = 1 - Math.pow(1 - 0.08, dt / 16.67);
        cx += (tx - cx) * k;
        cy += (ty - cy) * k;

        if (roofImg) {
          roofImg.style.translate = `${(-cx * 10).toFixed(2)}px ${(-cy * 3.8).toFixed(2)}px`;
        }
        if (cloudsEl) {
          cloudsEl.style.translate = `${(-cx * 15).toFixed(2)}px ${(-cy * 5.5).toFixed(2)}px`;
        }
        if (pantherEl) {
          pantherEl.style.translate = `${(cx * 3.2).toFixed(2)}px ${(-cy * 2.2).toFixed(2)}px`;
        }

        if (Math.abs(tx - cx) < 0.0015 && Math.abs(ty - cy) < 0.0015) {
          ptrRaf = 0;
        } else {
          ptrRaf = requestAnimationFrame(ptrTick);
        }
      };

      const onHeroMove = (e: PointerEvent) => {
        if (html.classList.contains('hero-off')) return;
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        if (!ptrRaf) {
          lastTime = performance.now();
          ptrRaf = requestAnimationFrame(ptrTick);
        }
      };

      const onHeroLeave = () => {
        tx = 0;
        ty = 0;
        if (!ptrRaf) {
          lastTime = performance.now();
          ptrRaf = requestAnimationFrame(ptrTick);
        }
      };

      heroEl.addEventListener('pointerdown', onHeroMove, { passive: true });
      heroEl.addEventListener('pointermove', onHeroMove, { passive: true });
      heroEl.addEventListener('pointerleave', onHeroLeave);
      heroEl.addEventListener('pointerup', onHeroLeave, { passive: true });
      heroEl.addEventListener('pointercancel', onHeroLeave, { passive: true });
      cleanups.push(() => {
        if (ptrRaf) cancelAnimationFrame(ptrRaf);
        if (roofImg) roofImg.style.translate = '';
        if (cloudsEl) cloudsEl.style.translate = '';
        if (pantherEl) pantherEl.style.translate = '';
        heroEl.removeEventListener('pointerdown', onHeroMove);
        heroEl.removeEventListener('pointermove', onHeroMove);
        heroEl.removeEventListener('pointerleave', onHeroLeave);
        heroEl.removeEventListener('pointerup', onHeroLeave);
        heroEl.removeEventListener('pointercancel', onHeroLeave);
      });
    }

    // 5. Desktop Fine-Pointer Micro-Interactions: Magnetic Buttons, 3D Card Tilt
    if (finePointer) {
      // 5a. Magnetic Cursor-Sticking Buttons & Controls (uses CSS `translate` so it composes with `:hover` `transform`)
      const magnetStates = new WeakMap<
        HTMLElement,
        {
          rect: DOMRect | null;
          tx: number;
          ty: number;
          cx: number;
          cy: number;
          vx: number;
          vy: number;
          hovering: boolean;
          raf: number;
          icon: HTMLElement | SVGElement | null;
        }
      >();

      const bindMagnet = (el: HTMLElement) => {
        if (magnetStates.has(el)) return;
        const icon = el.querySelector<HTMLElement | SVGElement>('.btn__arrow, .btn__icon, .nav__phone-icon, svg');
        const state = {
          rect: null as DOMRect | null,
          tx: 0,
          ty: 0,
          cx: 0,
          cy: 0,
          vx: 0,
          vy: 0,
          hovering: false,
          raf: 0,
          icon,
        };
        magnetStates.set(el, state);

        const tick = () => {
          if (state.hovering) {
            state.cx += (state.tx - state.cx) * 0.26;
            state.cy += (state.ty - state.cy) * 0.26;
            state.vx = 0;
            state.vy = 0;
          } else {
            // Underdamped spring release back to (0, 0)
            const k = 0.16;
            const damp = 0.74;
            state.vx = (state.vx - state.cx * k) * damp;
            state.vy = (state.vy - state.cy * k) * damp;
            state.cx += state.vx;
            state.cy += state.vy;
          }

          el.style.translate = `${state.cx.toFixed(2)}px ${state.cy.toFixed(2)}px`;
          if (state.icon) {
            state.icon.style.translate = `${(state.cx * 0.32).toFixed(2)}px ${(state.cy * 0.32).toFixed(2)}px`;
          }

          const settled =
            !state.hovering &&
            Math.abs(state.cx) < 0.06 &&
            Math.abs(state.cy) < 0.06 &&
            Math.abs(state.vx) < 0.06 &&
            Math.abs(state.vy) < 0.06;

          if (settled) {
            state.cx = 0;
            state.cy = 0;
            state.raf = 0;
            el.style.translate = '';
            if (state.icon) state.icon.style.translate = '';
          } else {
            state.raf = requestAnimationFrame(tick);
          }
        };

        const onEnter = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return;
          state.rect = el.getBoundingClientRect();
          state.hovering = true;
          if (!state.raf) state.raf = requestAnimationFrame(tick);
        };

        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse' || !state.rect) return;
          const dx = e.clientX - (state.rect.left + state.rect.width / 2);
          const dy = e.clientY - (state.rect.top + state.rect.height / 2);
          const isSmall = el.classList.contains('rnav') || el.classList.contains('nav__phone');
          const maxX = isSmall ? 5 : 8.5;
          const maxY = isSmall ? 5 : 6.5;
          state.tx = clamp(-maxX, maxX, dx * 0.24);
          state.ty = clamp(-maxY, maxY, dy * 0.34);
          if (!state.raf) state.raf = requestAnimationFrame(tick);
        };

        const onLeave = () => {
          state.hovering = false;
          state.rect = null;
          state.tx = 0;
          state.ty = 0;
          if (!state.raf) state.raf = requestAnimationFrame(tick);
        };

        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          if (state.raf) cancelAnimationFrame(state.raf);
          el.style.translate = '';
          if (state.icon) state.icon.style.translate = '';
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        });
      };

      let scanRaf = 0;
      const scanMagnets = () => {
        scanRaf = 0;
        document
          .querySelectorAll<HTMLElement>('.magnet, .btn:not(.est__dd):not(.magnet *), .rnav, .nav__phone, .reviews.rchip')
          .forEach(bindMagnet);
      };
      scanMagnets();
      const magMo = new MutationObserver(() => {
        if (!scanRaf) scanRaf = requestAnimationFrame(scanMagnets);
      });
      magMo.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => {
        if (scanRaf) cancelAnimationFrame(scanRaf);
        magMo.disconnect();
      });

      // 5c. 3D Interactive Card Tilt (rAF-throttled, zero background-image repaint)
      if (!lowPower) {
        const tiltSelector = '.svc, .proj, .quote, .claim, .cred, .stat, .inspector';
        const tiltCards = Array.from(document.querySelectorAll<HTMLElement>(tiltSelector));
        tiltCards.forEach((card) => {
          let rect: DOMRect | null = null;
          let tiltRaf = 0;
          let lastX = 0;
          let lastY = 0;
          const isLarge =
            card.classList.contains('svc--big') ||
            card.classList.contains('svc-stage') ||
            card.classList.contains('proj--featured');
          const maxDeg = isLarge ? 1.8 : 4.2;

          const applyTilt = () => {
            tiltRaf = 0;
            if (!rect) return;
            const nx = clamp(-0.5, 0.5, (lastX - rect.left) / rect.width - 0.5);
            const ny = clamp(-0.5, 0.5, (lastY - rect.top) / rect.height - 0.5);
            card.style.setProperty('--rx', `${(-ny * maxDeg * 2).toFixed(2)}deg`);
            card.style.setProperty('--ry', `${(nx * maxDeg * 2).toFixed(2)}deg`);
          };

          const onCardEnter = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            rect = card.getBoundingClientRect();
            card.classList.add('is-tilting');
          };

          const onCardMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse' || !rect) return;
            if ((e.target as HTMLElement | null)?.closest('.ba')) {
              card.style.setProperty('--rx', '0deg');
              card.style.setProperty('--ry', '0deg');
              return;
            }
            lastX = e.clientX;
            lastY = e.clientY;
            if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt);
          };

          const onCardLeave = () => {
            if (tiltRaf) {
              cancelAnimationFrame(tiltRaf);
              tiltRaf = 0;
            }
            rect = null;
            card.classList.remove('is-tilting');
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
          };

          card.addEventListener('pointerenter', onCardEnter);
          card.addEventListener('pointermove', onCardMove, { passive: true });
          card.addEventListener('pointerleave', onCardLeave);
          cleanups.push(() => {
            if (tiltRaf) cancelAnimationFrame(tiltRaf);
            card.removeEventListener('pointerenter', onCardEnter);
            card.removeEventListener('pointermove', onCardMove);
            card.removeEventListener('pointerleave', onCardLeave);
          });
        });
      }
    } else if (!lowPower) {
      // 5d. Mobile / Touch Micro-Interactions: Tactile Spring Press + Touch 3D Card Tilt + Hero Touch Sway
      const pressSelector = '.btn, .rchip, .ocbadge, .rnav, .seg__btn, .svc-tab, .svc-pill, .mbar__call, .mbar__cta';
      const onTouchDown = (e: PointerEvent) => {
        const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>(pressSelector);
        if (btn) btn.classList.add('is-pressing');
      };
      const onTouchUp = () => {
        document.querySelectorAll<HTMLElement>('.is-pressing').forEach((el) => el.classList.remove('is-pressing'));
      };
      window.addEventListener('pointerdown', onTouchDown, { passive: true });
      window.addEventListener('pointerup', onTouchUp, { passive: true });
      window.addEventListener('pointercancel', onTouchUp, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('pointerdown', onTouchDown);
        window.removeEventListener('pointerup', onTouchUp);
        window.removeEventListener('pointercancel', onTouchUp);
      });

      const tiltSelector = '.svc, .proj, .quote, .claim, .cred, .stat, .inspector';
      const tiltCards = Array.from(document.querySelectorAll<HTMLElement>(tiltSelector));
      tiltCards.forEach((card) => {
        const isLarge = card.classList.contains('svc--big') || card.classList.contains('proj--featured');
        const maxDeg = isLarge ? 2.0 : 3.2;
        const onDown = (e: PointerEvent) => {
          if ((e.target as HTMLElement | null)?.closest('.ba, a, button')) return;
          const r = card.getBoundingClientRect();
          const nx = clamp(-0.5, 0.5, (e.clientX - r.left) / r.width - 0.5);
          const ny = clamp(-0.5, 0.5, (e.clientY - r.top) / r.height - 0.5);
          card.classList.add('is-tilting');
          card.style.setProperty('--rx', `${(-ny * maxDeg * 2).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${(nx * maxDeg * 2).toFixed(2)}deg`);
        };
        const onUp = () => {
          card.classList.remove('is-tilting');
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        };
        card.addEventListener('pointerdown', onDown, { passive: true });
        card.addEventListener('pointermove', onDown, { passive: true });
        card.addEventListener('pointerup', onUp, { passive: true });
        card.addEventListener('pointercancel', onUp, { passive: true });
        card.addEventListener('pointerleave', onUp, { passive: true });
        cleanups.push(() => {
          card.removeEventListener('pointerdown', onDown);
          card.removeEventListener('pointermove', onDown);
          card.removeEventListener('pointerup', onUp);
          card.removeEventListener('pointercancel', onUp);
          card.removeEventListener('pointerleave', onUp);
        });
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;
    let killed = false;
    let revert: (() => void) | undefined;

    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (killed) return;
      const ctx = gsap.context(() => {
        const sky = (k: string) => Array.from(document.querySelectorAll<HTMLElement>(`[data-sky="${k}"]`));
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: document.body, start: 0, end: 'max', scrub: true },
        });

        const build = () => {
          tl.clear();
          const max = Math.max(1, ScrollTrigger.maxScroll(window));
          const vh = window.innerHeight;
          const vw = window.innerWidth;
          const top = (id: string) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().top + window.scrollY : 0;
          };
          const bottom = (id: string) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().bottom + window.scrollY : 0;
          };
          const at = (y: number) => Math.min(1, Math.max(0, y / max));
          const seg = (
            el: Element | Element[] | null,
            from: gsap.TweenVars,
            to: gsap.TweenVars,
            a: number,
            b: number,
          ) => {
            if (!el || (Array.isArray(el) && !el.length)) return;
            const s = at(a);
            const d = Math.max(0.0005, at(b) - s);
            tl.fromTo(el, { ...from }, { ...to, duration: d, immediateRender: false }, s);
          };

          const statementTop = top('statement');
          const cover = [statementTop + 4, statementTop + vh * 0.5 - 4] as const; // photo fully covers the viewport here

          // Morning → midday (both light; contrast holds at every mix)
          const midStart = top('hero') + vh * 0.3;
          const midEnd = top('roof') - vh * 0.15;
          seg(sky('midday'), { opacity: 0 }, { opacity: 1 }, midStart, midEnd);
          seg(sky('morning'), { opacity: 1 }, { opacity: 0 }, midEnd, midEnd + vh * 0.25);

          // Midday → golden hour, arriving with the reviews
          const goldStart = bottom('projects') - vh * 0.9;
          const goldEnd = top('reviews') + vh * 0.15;
          seg(sky('golden'), { opacity: 0 }, { opacity: 1 }, goldStart, goldEnd);
          seg(sky('midday'), { opacity: 1 }, { opacity: 0 }, goldEnd, goldEnd + vh * 0.25);

          // Golden → dusk ONLY while the statement photo is opaque over the whole viewport (tone flips here)
          seg(sky('dusk'), { opacity: 0 }, { opacity: 1 }, cover[0], cover[1]);
          seg(sky('golden'), { opacity: 1 }, { opacity: 0 }, cover[1], cover[1] + vh * 0.15);
          seg(sky('clouds'), { opacity: 1 }, { opacity: 0.14 }, cover[0], cover[1]);
          seg(sky('horizon-night'), { opacity: 0 }, { opacity: 1 }, cover[0], cover[1]);

          // Dusk → night (both dark)
          const nightStart = bottom('audit') - vh * 0.7;
          const nightEnd = top('standard') + vh * 0.2;
          seg(sky('night'), { opacity: 0 }, { opacity: 1 }, nightStart, nightEnd);
          seg(sky('dusk'), { opacity: 1 }, { opacity: 0 }, nightEnd, nightEnd + vh * 0.25);

          // Warm San Diego neighborhood windows along the horizon light up as night falls
          seg(sky('window'), { opacity: 0 }, { opacity: 1 }, bottom('audit') - vh * 0.5, top('estimate') - vh * 0.1);

          // Sun arc: high in the east at morning, overhead at midday, low and warm for golden hour,
          // sets bottom-left at dusk. The moon then rises on the right and climbs through the night.
          const orb = sky('orb');
          const P = (x: number, y: number) => ({ x: vw * x, y: vh * y });
          seg(orb, P(0.82, 0.16), P(0.56, 0.07), 0, bottom('services'));
          seg(orb, P(0.56, 0.07), P(0.3, 0.3), bottom('services'), top('reviews') + vh * 0.2);
          seg(orb, P(0.3, 0.3), P(0.12, 0.9), top('reviews') + vh * 0.2, cover[1]);
          // Moon rides the right page margin (outside the 1280 measure) so it never sits behind copy,
          // and keeps climbing through the whole night, to the last pixel of the page.
          const disc = Math.min(48, Math.max(16, vw * 0.034)); // matches .sky__moon-disc width
          const mx = vw >= 1360 ? vw - (vw - 1280) / 4 : vw - disc / 2 - 4; // narrower: inside the edge gutter
          const moonFrom = bottom('audit') - vh * 0.6;
          seg(orb, { x: mx, y: vh * 0.66 }, { x: mx, y: vh * 0.12 }, moonFrom, max);
          seg(sky('sun'), { opacity: 1 }, { opacity: 0 }, cover[0], cover[1]);
          seg(sky('moon'), { opacity: 0 }, { opacity: 1 }, bottom('audit') - vh * 0.6, top('standard') + vh * 0.4);

          tl.set({}, {}, 1); // pad the timeline to exactly 1 so positions == scroll fractions
          tl.scrollTrigger?.update();
        };

        build();
        ScrollTrigger.addEventListener('refresh', build);
        document.documentElement.classList.add('sky-live');

        // Hero: rooftops rise ~24px over the first 100vh; the haze moves less (two layers).
        const heroST = { trigger: '#hero', start: 'top top', end: () => `+=${window.innerHeight}`, scrub: true };
        gsap.to('[data-parallax="roofs"]', { y: -24, ease: 'none', scrollTrigger: heroST });
        gsap.to('[data-parallax="haze"]', { y: -8, ease: 'none', scrollTrigger: { ...heroST } });

        // Horizon: three depths drift sideways at different rates across the whole page.
        const pageST = { trigger: document.body, start: 0, end: 'max', scrub: true };
        ([['back', -40], ['mid', -90], ['front', -160]] as const).forEach(([k, x]) =>
          gsap.to(`[data-horizon="${k}"]`, { x, ease: 'none', scrollTrigger: { ...pageST } }),
        );

        // Photos: ~40px scroll-linked parallax while each crosses the viewport (inner image only).
        gsap.utils.toArray<HTMLElement>('[data-parallax="photo"]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 0, y: 20 },
            { y: -20, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
          );
        });

        // Statement: image settles 1.06 → 1, linked to scroll (no timers)
        gsap.fromTo(
          '[data-statement]',
          { scale: 1.06 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: '#statement', start: 'top bottom', end: 'bottom bottom', scrub: true } },
        );

        // Warranty seal: text ring turns with scroll
        gsap.to('[data-seal]', {
          rotation: 220,
          transformOrigin: '50% 50%',
          ease: 'none',
          scrollTrigger: { trigger: '.warranty', start: 'top bottom', end: 'bottom top', scrub: true },
        });

        // Footer ghost wordmark: slight parallax
        gsap.fromTo(
          '[data-ghost]',
          { yPercent: 22 },
          { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } },
        );

        return () => ScrollTrigger.removeEventListener('refresh', build);
      });
      revert = () => {
        ctx.revert();
        document.documentElement.classList.remove('sky-live');
      };
    });

    return () => {
      killed = true;
      revert?.();
    };
  }, []);

  return <div ref={bar} className="progress" aria-hidden="true" />;
}
