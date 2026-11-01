'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isTouch, loadMotion, reducedMotion, scrollToY } from '@/lib/motion';
import { mountScene, type SceneAPI } from '@/lib/scene-adapter';

type Options = {
  count: number;
  /** Extra dwell per index, in screens (e.g. { 3: 0.6 } for the underlayment layer). */
  holds?: Record<number, number>;
  /** Scroll distance of the track in screens (track height = 100svh + distance). */
  distance: number;
  /** Scene progress (0..1) → active index. Defaults to the nearest stop. */
  activeFrom?: (p: number) => number;
};

/**
 * Host-owned scroll for a scene: a CSS sticky stage (no pin spacer, so zero CLS) + one ScrollTrigger
 * (scrub 0.6) that feeds setProgress. Soft-snaps to each stop (0.25s). Reduced motion: step-through.
 * Writes the scene progress to `--sp` on the track so CSS (stepper fill) can follow without React renders.
 */
export function useScrollScene({ count, holds = {}, distance, activeFrom }: Options) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const api = useRef<SceneAPI | null>(null);
  const [active, setActive] = useState(0);
  const [stepMode, setStepMode] = useState(false);
  const activeRef = useRef(0);

  // Hold ranges in normalized scroll progress: [start, end] per index.
  const ranges = useRef<Array<[number, number]>>([]);
  if (!ranges.current.length) {
    const totalHold = Object.values(holds).reduce((a, b) => a + b, 0);
    const T = (distance - totalHold) / Math.max(1, count - 1);
    let s = 0;
    for (let i = 0; i < count; i++) {
      const h = holds[i] ?? 0;
      ranges.current.push([s / distance, (s + h) / distance]);
      s += h + T;
    }
  }

  /** scroll progress (0..1) → scene progress (0..1), flat across each hold range */
  const toScene = useCallback(
    (sp: number) => {
      const r = ranges.current;
      for (let i = 0; i < count; i++) {
        const [a, b] = r[i];
        if (sp <= b) {
          if (sp >= a || i === 0) return i / (count - 1);
          const prevEnd = r[i - 1][1];
          return (i - 1 + (sp - prevEnd) / (a - prevEnd)) / (count - 1);
        }
      }
      return 1;
    },
    [count],
  );

  const commitActive = useCallback((i: number) => {
    trackRef.current?.style.setProperty('--sp', String(count > 1 ? i / (count - 1) : 0));
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
  }, [count]);

  const trackBounds = () => {
    const t = trackRef.current!;
    const top = t.getBoundingClientRect().top + window.scrollY;
    return { start: top, end: top + t.offsetHeight - window.innerHeight };
  };

  /** Rail / tab click */
  const goTo = useCallback(
    (i: number) => {
      if (stepMode || !trackRef.current) {
        commitActive(i);
        api.current?.setActive(i);
        return;
      }
      const [a, b] = ranges.current[i];
      const { start, end } = trackBounds();
      const target = start + ((a + b) / 2) * (end - start);
      scrollToY(target, Math.min(1.2, 0.35 + Math.abs(target - window.scrollY) / 4000));
    },
    [stepMode, commitActive],
  );

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    api.current = mountScene(slot);
    const step = reducedMotion();
    setStepMode(step);
    if (step) return () => api.current?.destroy();

    let killed = false;
    const cleanup: Array<() => void> = [];
    loadMotion().then(({ gsap }) => {
      if (killed || !trackRef.current) return;
      const proxy = { sp: 0 };
      const scrubVal = isTouch() ? 0.12 : true;
      const tween = gsap.to(proxy, {
        sp: 1,
        ease: 'none',
        scrollTrigger: { trigger: trackRef.current, start: 'top top', end: 'bottom bottom', scrub: scrubVal },
        onUpdate: () => {
          const p = toScene(proxy.sp);
          api.current?.setProgress(p);
          const i = activeFrom ? activeFrom(p) : Math.round(p * (count - 1));
          if (i !== activeRef.current) {
            activeRef.current = i;
            setActive(i);
          }
          trackRef.current?.style.setProperty('--sp', p.toFixed(4));
        },
      });
      cleanup.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });

    return () => {
      killed = true;
      cleanup.forEach((fn) => fn());
      api.current?.destroy();
    };
  }, [count, distance, toScene, commitActive, activeFrom]);

  return { trackRef, slotRef, active, goTo, stepMode };
}
