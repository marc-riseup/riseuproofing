'use client';

/**
 * Lazy motion stack. Nothing here is in the initial bundle: GSAP, ScrollTrigger and Lenis are
 * fetched on window `load` or the first scroll/touch/key, whichever comes first.
 */
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

export type Motion = { gsap: typeof GsapType; ScrollTrigger: typeof STType };

let readyP: Promise<void> | null = null;
let motionP: Promise<Motion> | null = null;
let lenis: Lenis | null = null;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

/** Resolves on first scroll or user interaction (or immediately if already scrolled).
 *  At scrollY === 0 the CSS state matches progress 0 of every scroll-linked tween, so keeping
 *  GSAP/ScrollTrigger/Lenis off the initial load path leaves hero LCP and TBT completely clean. */
export function whenReady(): Promise<void> {
  readyP ??= new Promise<void>((resolve) => {
    if (window.scrollY > 0) return resolve();
    let settled = false;
    const events = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    const done = () => {
      if (settled) return;
      settled = true;
      events.forEach((e) => window.removeEventListener(e, done));
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));
    afterLoad().then(() => {
      window.setTimeout(done, 180);
    });
  });
  return readyP;
}

/** Resolves strictly after the window load event (used for the 3D scenes). */
export function afterLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', () => resolve(), { once: true });
  });
}

export function loadMotion(): Promise<Motion> {
  motionP ??= whenReady().then(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      if (Math.abs(window.innerWidth - lastW) > 2) {
        lastW = window.innerWidth;
        ScrollTrigger.refresh();
      }
    });
    if (!reducedMotion() && !isTouch()) {
      const { default: LenisCtor } = await import('lenis');
      lenis = new LenisCtor({ lerp: 0.14, smoothWheel: true, anchors: { offset: -84 } });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis?.raf(t * 1000));
      gsap.ticker.lagSmoothing(500, 33);
      document.documentElement.classList.add('lenis');
    }
    return { gsap, ScrollTrigger };
  });
  return motionP;
}

export const getLenis = () => lenis;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Programmatic scroll used by snapping and the scene rails. */
export function scrollToY(y: number, duration = 0.25) {
  if (reducedMotion()) {
    window.scrollTo(0, y);
    return;
  }
  if (lenis) {
    lenis.scrollTo(y, { duration, easing: easeInOut });
    return;
  }
  const start = window.scrollY;
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / (duration * 1000));
    window.scrollTo(0, start + (y - start) * easeInOut(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
