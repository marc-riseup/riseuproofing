'use client';

import { useEffect, useState } from 'react';
import { roofLayers } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { useScrollScene } from './useScrollScene';
import { Rail } from './Rail';

const pad = (n: number) => String(n).padStart(2, '0');
const COUNT = roofLayers.length;

export function RoofScene() {
  // 9 layers over 300vh; layer 4 (underlayment) dwells slightly longer.
  const { trackRef, slotRef, active, goTo, stepMode } = useScrollScene({ count: COUNT, holds: { 3: 0.15 }, distance: 3 });
  const [posterReady, setPosterReady] = useState(false);
  useEffect(() => {
    if (stepMode || window.scrollY > 0) {
      setPosterReady(true);
      return;
    }
    const onScroll = () => setPosterReady(true);
    const id = window.setTimeout(() => setPosterReady(true), 1200);
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('scroll', onScroll);
    };
  }, [stepMode]);
  const layer = roofLayers[active];
  const last = active === COUNT - 1;

  return (
    <section id="roof" className="scene-sec" data-tone="light" aria-labelledby="roof-h">
      <div ref={trackRef} className="scene-track" style={{ '--distance': 3 } as React.CSSProperties} data-step={stepMode || undefined}>
        <div className="scene-stage">
          <div className="scene-layout wrap">
            <div
              ref={slotRef}
              className="scene scene--roof"
              data-scene="roof"
              data-poster="/img/roof/poster.webp"
              data-frames="/img/{scene}/{n}.avif"
              data-count={COUNT}
            >
              {(posterReady || stepMode) && (
                <picture>
                  <source type="image/avif" srcSet="/img/roof/poster-640.avif 640w, /img/roof/poster.avif 1400w" sizes="(max-width: 640px) 360px, 62vw" />
                  <img className="scene__poster" src="/img/roof/poster.webp" alt="" width={1400} height={988} decoding="async" />
                </picture>
              )}
            </div>

            <div className="scene-panel">
              <h2 id="roof-h" className="h2 scene-panel__h">
                How a roof works
              </h2>

              <div className="swap" aria-hidden="true">
                {roofLayers.map((l, i) => (
                  <div key={l.id} className="swap__item" data-on={i === active || undefined}>
                    <p className="swap__num">
                      {pad(i + 1)} <span>/ {pad(COUNT)}</span>
                    </p>
                    <p className="swap__name">
                      {l.name}
                      {l.specialty && <span className="tag">{l.specialty.tag}</span>}
                    </p>
                    <p className="swap__text">{l.sentence}</p>
                    <dl className="facts">
                      <div>
                        <dt>Material</dt>
                        <dd>{l.material}</dd>
                      </div>
                      <div>
                        <dt>Lifespan</dt>
                        <dd>{l.lifespan}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <div className="scene-panel__foot">
                {layer.specialty && (
                  <a className="tlink" href={layer.specialty.href}>
                    {layer.specialty.label}
                    <Icon name="arrow" className="tlink__arrow" />
                  </a>
                )}
                {last && (
                  <a className="btn" href="#inspect" data-red>
                    Book Free Inspection
                  </a>
                )}
              </div>

              <Rail
                label="Roof layers"
                items={roofLayers.map((l, i) => `${pad(i + 1)} ${l.name}`)}
                active={active}
                onSelect={goTo}
                stepMode={stepMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text equivalent of the 3D scene: always in the DOM for SEO and screen readers. */}
      <ol className="sr-only">
        {roofLayers.map((l, i) => (
          <li key={l.id}>
            <h3>
              Layer {i + 1} of {COUNT}: {l.name}
              {l.specialty ? ` (${l.specialty.tag})` : ''}
            </h3>
            <p>{l.sentence}</p>
            <p>
              Material: {l.material}. Lifespan: {l.lifespan}.
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
