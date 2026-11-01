'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { slug: string; title: string; beforeAlt: string; afterAlt: string; priority?: boolean };

/** Before/after slider. Transform-only reveal; keyboard operable via a native range input. */
export function BeforeAfter({ slug, title, beforeAlt, afterAlt }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [p, setP] = useState(50);

  const mounted = useRef(false);
  const apply = (v: number) => {
    if (clip.current) clip.current.style.transform = `translateX(${v - 100}%)`;
    if (inner.current) inner.current.style.transform = `translateX(${100 - v}%)`;
    if (handle.current) handle.current.style.transform = `translateX(${v}%)`;
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    apply(p);
  }, [p]);

  // One sweep on first view: 50 → 15 → 85 → 50 over 1.4s.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const keys = [50, 15, 85, 50];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const D = 1400;
        const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const step = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - t0) / D);
          const seg = Math.min(2, Math.floor(t * 3));
          const local = ease(t * 3 - seg);
          const v = keys[seg] + (keys[seg + 1] - keys[seg]) * local;
          apply(v);
          if (t < 1) requestAnimationFrame(step);
          else setP(50);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = `/img/projects/${slug}`;
  return (
    <div ref={root} className="ba">
      <picture className="ba__img">
        <source type="image/avif" srcSet={`${base}-after.avif`} />
        <img src={`${base}-after.webp`} alt={afterAlt} width={960} height={600} loading="lazy" decoding="async" />
      </picture>
      <div ref={clip} className="ba__clip">
        <div ref={inner} className="ba__inner">
          <picture className="ba__img">
            <source type="image/avif" srcSet={`${base}-before.avif`} />
            <img src={`${base}-before.webp`} alt={beforeAlt} width={960} height={600} loading="lazy" decoding="async" />
          </picture>
        </div>
      </div>
      <div ref={handle} className="ba__handle" aria-hidden="true">
        <span className="ba__knob" />
      </div>
      <span className="ba__tag ba__tag--before" aria-hidden="true">
        Before
      </span>
      <span className="ba__tag ba__tag--after" aria-hidden="true">
        After
      </span>
      <input
        className="ba__range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={p}
        aria-label={`Compare before and after: ${title}`}
        aria-valuetext={`${p}% before photo shown`}
        onPointerDown={() => (touched.current = true)}
        onKeyDown={() => (touched.current = true)}
        onChange={(e) => {
          touched.current = true;
          setP(Number(e.target.value));
        }}
      />
    </div>
  );
}
