'use client';

import { auditStages, auditStats } from '@/lib/content';
import { useScrollScene } from './useScrollScene';

const pad = (n: number) => String(n).padStart(2, '0');
/** Same thresholds as the engine's stage switch (p crosses 0.5 / 1.5 at s = 1/3 / 2/3). */
const auditActive = (s: number) => (s < 1 / 3 ? 0 : s < 2 / 3 ? 1 : 2);

export function AuditScene() {
  const { trackRef, slotRef, active, goTo, stepMode } = useScrollScene({ count: 3, distance: 2, activeFrom: auditActive });
  const stage = auditStages[active];

  return (
    <section id="audit" className="scene-sec scene-sec--audit" data-tone="dark" aria-labelledby="audit-h">
      <div ref={trackRef} className="scene-track" style={{ '--distance': 2 } as React.CSSProperties} data-step={stepMode || undefined}>
        <div className="scene-stage">
          <div className="scene-layout scene-layout--audit wrap">
            <div
              ref={slotRef}
              className="scene scene--audit"
              data-scene="audit"
              data-poster="/img/audit/poster.webp"
              data-frames="/img/{scene}/{n}.avif"
              data-count={3}
            >
              <picture>
                <source type="image/avif" srcSet="/img/audit/poster.avif" />
                <img className="scene__poster" src="/img/audit/poster.webp" alt="" width={1100} height={831} loading="lazy" decoding="async" />
              </picture>
            </div>

            <div className="scene-panel scene-panel--audit">
              <p className="audit__eyebrow">
                <span className="audit__dot" aria-hidden="true" />
                <span>21‑Point Diagnostic · CA Lic #1096492</span>
              </p>

              {/* U+2011 non-breaking hyphen keeps "21‑point" together */}
              <h2 id="audit-h" className="h2 scene-panel__h audit__h">
                Free 21‑point roof inspection
              </h2>

              <ol className="stepper" aria-label="Inspection stages">
                {auditStages.map((s, i) => (
                  <li key={s.id} className="stepper__item" style={{ '--a': i / 3 } as React.CSSProperties}>
                    <button
                      type="button"
                      className="stepper__row"
                      aria-current={i === active ? 'step' : undefined}
                      data-done={i < active || undefined}
                      onClick={() => goTo(i)}
                    >
                      <span className="stepper__line" aria-hidden="true">
                        <span className="stepper__fill" />
                      </span>
                      <span className="stepper__num">{pad(i + 1)}</span>
                      <span className="stepper__body">
                        <span className="stepper__title">{s.title}</span>
                        <span className="stepper__text">
                          <span>{s.sentence}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <ul className="stats" aria-label="Inspection highlights">
                {auditStats.map((s) => (
                  <li key={s.label} className="stat">
                    <p className="stat__value">
                      {s.value}
                      {s.unit && <span className="stat__unit"> {s.unit}</span>}
                    </p>
                    <p className="stat__label">{s.label}</p>
                  </li>
                ))}
              </ul>

              <figure className="inspector">
                {/* TODO: replace with a real photo of Luis. */}
                <picture>
                  <source type="image/avif" srcSet="/img/audit/inspector.avif" />
                  <img src="/img/audit/inspector.webp" alt="Luis, Rise Up's C-39 licensed roof inspector" width={320} height={407} loading="lazy" />
                </picture>
                <figcaption>
                  <span className="inspector__name">Luis, C-39 inspector</span>
                  <span className="inspector__note">He does the climbing and the photos, and walks you through the report.</span>
                </figcaption>
              </figure>

              <div className="scene-panel__cta">
                <a className="btn" href="#inspect" data-red>
                  Book Free Inspection
                </a>
              </div>
              <p className="sr-only" aria-live="polite">
                Stage {active + 1} of 3: {stage.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ol className="sr-only">
        {auditStages.map((s, i) => (
          <li key={s.id}>
            <h3>
              Stage {i + 1}: {s.title}
            </h3>
            <p>{s.sentence}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
