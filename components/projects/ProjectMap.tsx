'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './pmap.css';
import { mapPins, mapCities, pinCategories, type Pin } from '@/lib/content';

/**
 * Basemap: OpenStreetMap standard tiles styled as a muted light basemap via CSS filter.
 * License: ODbL / OpenStreetMap Tile Usage Policy — free with required visible
 * "© OpenStreetMap contributors" attribution (rendered in the bottom-right control).
 * For high-traffic production, set NEXT_PUBLIC_MAP_TILE_URL to a dedicated tile host
 * (e.g. Protomaps, Stadia, or CARTO with NEXT_PUBLIC_CARTO_KEY).
 */
const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

export default function ProjectMap({ active }: { active: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const [selected, setSelected] = useState<Pin | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, {
      center: [33.03, -117.19],
      zoom: 10,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    m.attributionControl.setPrefix(false);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(m);

    for (const pin of mapPins) {
      const color = pinCategories[pin.cat].color;
      const marker = L.marker([pin.lat, pin.lng], {
        icon: L.divIcon({
          className: 'pin',
          html: `<span class="pin__dot" style="--c:${color}"></span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
        keyboard: true,
        title: `${pin.title}, ${pin.city}`,
        alt: `${pin.title}, ${pin.city}`,
        riseOnHover: true,
      });
      marker.on('click', () => select(pin));
      marker.addTo(m);
      const node = marker.getElement();
      node?.setAttribute('data-city', pin.slug);
      markers.current.set(pin.id, marker);
    }
    map.current = m;

    function select(pin: Pin) {
      markers.current.forEach((mk) => mk.getElement()?.classList.remove('is-selected'));
      const node = markers.current.get(pin.id)?.getElement();
      if (node) {
        node.classList.remove('is-selected');
        void node.offsetWidth; // restart the one-time pulse
        node.classList.add('is-selected');
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      m.flyTo([pin.lat, pin.lng], 12, { duration: reduce ? 0 : 0.7, animate: !reduce });
      setSelected(pin);
    }

    return () => {
      m.remove();
      map.current = null;
      markers.current.clear();
    };
  }, []);

  // Leaflet needs a size recalculation after the tab panel becomes visible.
  useEffect(() => {
    if (active) requestAnimationFrame(() => map.current?.invalidateSize());
  }, [active]);

  const highlight = (slug: string | null) => {
    markers.current.forEach((mk) => {
      const node = mk.getElement();
      node?.classList.toggle('is-hl', !!slug && node.getAttribute('data-city') === slug);
    });
  };

  return (
    <div className="pmap">
      <div className="pmap__frame">
        <div ref={el} className="pmap__map" role="region" aria-label="Map of Rise Up projects in San Diego County" />
        <aside className="pcard" data-open={selected ? '' : undefined} aria-live="polite" inert={!selected}>
          {selected && (
            <>
              <button type="button" className="pcard__close" aria-label="Close project details" onClick={() => setSelected(null)}>
                <span aria-hidden="true">×</span>
              </button>
              <picture className="pcard__img">
                <source type="image/avif" srcSet={`${selected.image}.avif`} />
                <img src={`${selected.image}.webp`} alt={`${selected.title} in ${selected.city}`} width={960} height={600} />
              </picture>
              <p className="pcard__cat">{pinCategories[selected.cat].label}</p>
              <h3 className="pcard__title">{selected.title}</h3>
              <dl className="pcard__facts">
                <div>
                  <dt>City</dt>
                  <dd>{selected.city}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{selected.size}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{selected.days}</dd>
                </div>
              </dl>
              <a className="btn btn--block" href="#estimate" data-red>
                Get an estimate in {selected.city}
              </a>
            </>
          )}
        </aside>
      </div>

      <div className="pmap__below">
        <ul className="pmap__legend" aria-label="Pin colors">
          {Object.entries(pinCategories).map(([k, v]) => (
            <li key={k}>
              <span className="pmap__swatch" style={{ background: v.color }} aria-hidden="true" />
              {v.label}
            </li>
          ))}
        </ul>
        <ul className="pmap__cities" aria-label="Roofing by city">
          {mapCities.map((c) => (
            <li key={c.slug}>
              <a
                href={`/service-area/${c.slug}`}
                className="pmap__city"
                onPointerEnter={() => highlight(c.slug)}
                onPointerLeave={() => highlight(null)}
                onFocus={() => highlight(c.slug)}
                onBlur={() => highlight(null)}
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
