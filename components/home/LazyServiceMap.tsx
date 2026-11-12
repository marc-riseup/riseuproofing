'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import type { MapPinSpec } from './ServiceMapCanvas';

const ServiceMapCanvas = dynamic(() => import('./ServiceMapCanvas'), { ssr: false });

const SERVICE_MAP_PINS: MapPinSpec[] = [
  {
    id: 'oceanside-hq',
    city: 'Oceanside HQ',
    citySlug: 'oceanside',
    projectSlug: 'oceanside-shingle-replacement',
    label: 'Oceanside Dispatch HQ & Coastal Shingle Tear-Off',
    spec: '2182 S El Camino Real · Owens Corning Duration 130 MPH',
    lat: 33.1812,
    lng: -117.3395,
    isHq: true,
  },
  {
    id: 'carlsbad-relay',
    city: 'Carlsbad',
    citySlug: 'carlsbad',
    projectSlug: 'carlsbad-tile-relayment',
    label: 'Aviara Concrete Tile Lift & Reset',
    spec: '3,400 sq ft · Dual-Ply 250°F SBS Underlayment',
    lat: 33.1259,
    lng: -117.3108,
  },
  {
    id: 'encinitas-coastal',
    city: 'Encinitas',
    citySlug: 'encinitas',
    projectSlug: 'carlsbad-solar-detach-reset',
    label: 'Coastal Reroof & Solar Detach-and-Reset',
    spec: 'Marine-Grade Stainless Fasteners & Flashed Stanchions',
    lat: 33.0445,
    lng: -117.292,
  },
  {
    id: 'vista-shadowridge',
    city: 'Vista',
    citySlug: 'vista',
    projectSlug: 'sd-underlayment-repair',
    label: 'Shadowridge Tile Valley & Underlayment Restoration',
    spec: '26-Gauge W-Valley Metal · High-Temp Synthetic',
    lat: 33.1678,
    lng: -117.2415,
  },
  {
    id: 'escondido-coating',
    city: 'Escondido',
    citySlug: 'escondido',
    projectSlug: 'escondido-roof-coating',
    label: 'Commercial Silicone Cool-Roof Restoration',
    spec: '100% High-Solids Silicone · Title 24 SRI 100+',
    lat: 33.1192,
    lng: -117.0864,
  },
  {
    id: 'poway-wui',
    city: 'Poway',
    citySlug: 'poway',
    projectSlug: 'oceanside-siding',
    label: 'Class-A WUI Fire-Rated Roof & Exterior Upgrade',
    spec: 'Wildland-Urban Interface Ember-Sealed Eaves',
    lat: 32.9628,
    lng: -117.0359,
  },
  {
    id: 'san-diego-metro',
    city: 'San Diego',
    citySlug: 'san-diego',
    projectSlug: 'sd-commercial-tpo',
    label: '10,000 sq ft Commercial 60-Mil TPO Replacement',
    spec: 'Tapered Polyiso Drainage · 20-Yr NDL Warranty',
    lat: 32.735,
    lng: -117.1611,
  },
  {
    id: 'temecula-valley',
    city: 'Temecula',
    citySlug: 'temecula',
    projectSlug: 'carlsbad-tile-relayment',
    label: 'South Riverside Tile Underlayment Relay',
    spec: 'High-Heat Synthetic Membrane · Salvaged Concrete Tile',
    lat: 33.4936,
    lng: -117.1484,
  },
];

export function LazyServiceMap() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPin, setSelectedPin] = useState<MapPinSpec>(SERVICE_MAP_PINS[0]);

  // Trigger Leaflet load strictly when scrolled within 300px
  useEffect(() => {
    if (shouldLoad) return;
    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={wrapperRef}
      className="border border-[#0B1B2B]/14 bg-[#F4F9FC] flex flex-col justify-between"
    >
      <div className="px-5 py-3.5 border-b border-[#0B1B2B]/12 bg-[#FFFFFF] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B2B] tabular-nums">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C92D20]" aria-hidden="true" />
          <span>Oceanside Dispatch HQ · 32 Served Cities</span>
        </div>
        <span className="text-xs font-semibold text-[#3E5871] tabular-nums">
          33.1812° N, 117.3395° W
        </span>
      </div>

      <div className="relative h-[300px] sm:h-[340px] w-full bg-[#E6F0F7]">
        {shouldLoad && (
          <ServiceMapCanvas
            pins={SERVICE_MAP_PINS}
            onSelectPin={setSelectedPin}
            onReady={() => setMapReady(true)}
          />
        )}

        {!mapReady && (
          <div className="absolute inset-0 flex flex-col items-start justify-between p-6 bg-[#EBF3FA] text-[#0B1B2B]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.05em] text-[#0F5C8C]">
                Regional Dispatch Coverage
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-display)] text-lg font-extrabold text-[#0B1B2B]">
                2182 S El Camino Real, Oceanside, CA 92054
              </p>
              <p className="mt-2 text-xs sm:text-sm text-[#233B53] leading-relaxed max-w-[44ch]">
                Direct W-2 crew dispatch across Coastal North County, Inland Valleys, San Diego
                Metro, East County Foothills, plus Temecula &amp; Murrieta.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShouldLoad(true)}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#0B1B2B]/20 bg-[#FFFFFF] px-4 py-2 text-xs font-bold text-[#0B1B2B] hover:border-[#0B1B2B] cursor-pointer"
            >
              <Icon name="map-pin" className="w-3.5 h-3.5 text-[#C92D20]" />
              <span>{shouldLoad ? 'Loading Regional Map...' : 'Load Interactive Project Map'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-5 bg-[#FFFFFF] border-t border-[#0B1B2B]/12">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-bold text-[#0B1B2B]">{selectedPin.label}</p>
          <Link
            href={`/service-area/${selectedPin.citySlug}`}
            prefetch={false}
            className="text-xs font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0"
          >
            {selectedPin.city}
          </Link>
        </div>
        <p className="mt-1 text-xs text-[#233B53] tabular-nums">{selectedPin.spec}</p>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#3E5871]">Select any pin on the map to inspect scope</span>
          <Link
            href={`/projects/${selectedPin.projectSlug}`}
            prefetch={false}
            className="inline-flex items-center gap-1 font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0"
          >
            <span>View {selectedPin.city.replace(' HQ', '')} Project</span>
            <Icon name="arrow-right" className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
