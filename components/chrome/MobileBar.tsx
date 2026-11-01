'use client';

import { useEffect, useState } from 'react';
import { company } from '@/lib/content';

/**
 * Mobile action bar. Appears once the hero CTAs have left the viewport; hides only while the
 * final form is on screen or the on-screen keyboard is open. No idle animation.
 */
export function MobileBar() {
  const [pastHero, setPastHero] = useState(false);
  const [finalInView, setFinalInView] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const ctas = document.getElementById('hero-ctas');
    const final = document.getElementById('final-form');
    const ioHero = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    const ioFinal = new IntersectionObserver(([e]) => setFinalInView(e.isIntersecting), { threshold: 0.15 });
    if (ctas) ioHero.observe(ctas);
    if (final) ioFinal.observe(final);

    const vv = window.visualViewport;
    const onVV = () => vv && setKeyboard(window.innerHeight - vv.height > 150);
    vv?.addEventListener('resize', onVV);
    return () => {
      ioHero.disconnect();
      ioFinal.disconnect();
      vv?.removeEventListener('resize', onVV);
    };
  }, []);

  const show = pastHero && !finalInView && !keyboard;

  return (
    <div className="mbar" data-show={show || undefined} inert={!show} aria-label="Quick actions" role="region">
      <a className="mbar__call" href={company.phoneHref}>
        Call
      </a>
      <a className="btn mbar__cta chrome-red" href="#estimate">
        Get My Ballpark
      </a>
    </div>
  );
}

/**
 * Enforces "one red button per viewport": while any in-content red button (data-red) is visible,
 * the persistent chrome CTAs (nav + mobile bar) drop to navy.
 */
export function RedArbiter() {
  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      const busy = visible.size > 0;
      if (document.documentElement.hasAttribute('data-red-busy') !== busy) {
        document.documentElement.toggleAttribute('data-red-busy', busy);
      }
    });
    const observeAll = () => document.querySelectorAll('[data-red]').forEach((el) => io.observe(el));
    observeAll();
    // Red buttons that appear later (scene final beats, map card) are picked up here.
    const mo = new MutationObserver(observeAll);
    mo.observe(document.getElementById('main') ?? document.body, { subtree: true, childList: true, attributeFilter: ['data-red', 'hidden'] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
