'use client';

import dynamic from 'next/dynamic';
import { useId, useRef, useState } from 'react';

const ProjectMap = dynamic(() => import('./ProjectMap'), {
  ssr: false,
  loading: () => <div className="pmap__loading">Loading map…</div>,
});

/** Segmented control (Gallery | Map). The map and Leaflet load only when first opened. */
export function ProjectsTabs({ gallery }: { gallery: React.ReactNode }) {
  const id = useId();
  const [tab, setTab] = useState<'gallery' | 'map'>('gallery');
  const [mapEverOpened, setMapEverOpened] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (t: 'gallery' | 'map') => {
    setTab(t);
    if (t === 'map') setMapEverOpened(true);
  };
  const prefetch = () => void import('./ProjectMap');

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = tab === 'gallery' ? 'map' : 'gallery';
    select(next);
    tabs.current[next === 'gallery' ? 0 : 1]?.focus();
  };

  return (
    <>
      <div className="seg" role="tablist" aria-label="Show projects as" onKeyDown={onKey}>
        {(['gallery', 'map'] as const).map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-${t}-tab`}
            aria-controls={`${id}-${t}`}
            aria-selected={tab === t}
            tabIndex={tab === t ? 0 : -1}
            className="seg__btn"
            onClick={() => select(t)}
            onPointerEnter={t === 'map' ? prefetch : undefined}
            onFocus={t === 'map' ? prefetch : undefined}
          >
            {t === 'gallery' ? 'Gallery' : 'Map'}
          </button>
        ))}
        <span className="seg__thumb" data-pos={tab} aria-hidden="true" />
      </div>

      <div id={`${id}-gallery`} role="tabpanel" aria-labelledby={`${id}-gallery-tab`} hidden={tab !== 'gallery'} className="projects__panel">
        {gallery}
      </div>
      <div id={`${id}-map`} role="tabpanel" aria-labelledby={`${id}-map-tab`} hidden={tab !== 'map'} className="projects__panel">
        {mapEverOpened && <ProjectMap active={tab === 'map'} />}
      </div>
    </>
  );
}
