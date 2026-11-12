'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export interface MapPinSpec {
  id: string;
  city: string;
  citySlug: string;
  projectSlug: string;
  label: string;
  spec: string;
  lat: number;
  lng: number;
  isHq?: boolean;
}

interface ServiceMapCanvasProps {
  pins: MapPinSpec[];
  onSelectPin: (pin: MapPinSpec) => void;
  onReady: () => void;
}

export default function ServiceMapCanvas({
  pins,
  onSelectPin,
  onReady,
}: ServiceMapCanvasProps) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ remove: () => void; invalidateSize: () => void } | null>(null);
  const onSelectPinRef = useRef(onSelectPin);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onSelectPinRef.current = onSelectPin;
    onReadyRef.current = onReady;
  }, [onSelectPin, onReady]);

  useEffect(() => {
    if (!mapElRef.current) return;
    let active = true;

    async function mountLeaflet() {
      try {
        const mod = await import('leaflet');
        const L = mod.default ?? mod;
        if (!active || !mapElRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapElRef.current, {
          center: [33.09, -117.21],
          zoom: 9,
          scrollWheelZoom: false,
          zoomControl: true,
        });

        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 18,
            crossOrigin: true,
          },
        ).addTo(map);

        pins.forEach((pin) => {
          const bg = pin.isHq ? '#C92D20' : '#0B1B2B';
          const icon = L.divIcon({
            className: 'riseup-survey-pin',
            html: `<span style="display:flex;align-items:center;justify-content:center;width:${pin.isHq ? 28 : 22}px;height:${pin.isHq ? 28 : 22}px;border-radius:9999px;background:${bg};border:2.5px solid #FFFFFF;box-shadow:0 4px 10px rgba(11,27,43,0.35);cursor:pointer;"><span style="width:7px;height:7px;border-radius:9999px;background:${pin.isHq ? '#FFC700' : '#FFFFFF'};"></span></span>`,
            iconSize: [pin.isHq ? 28 : 22, pin.isHq ? 28 : 22],
            iconAnchor: [pin.isHq ? 14 : 11, pin.isHq ? 14 : 11],
          });

          const marker = L.marker([pin.lat, pin.lng], {
            icon,
            title: `${pin.city}: ${pin.label}`,
          }).addTo(map);

          marker.on('click', () => {
            onSelectPinRef.current(pin);
          });
        });

        mapInstanceRef.current = map;
        onReadyRef.current();

        window.setTimeout(() => {
          if (active) map.invalidateSize();
        }, 180);
      } catch {
        // Keep clean static summary visible if network blocks map tiles
      }
    }

    void mountLeaflet();

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pins]);

  return (
    <div
      ref={mapElRef}
      className="absolute inset-0 z-10 h-full w-full"
      aria-label="Interactive San Diego County and South Riverside service area map"
    />
  );
}
