'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { clsx as cn } from 'clsx';

interface SpotlightCase {
  slug: string;
  shortLabel: string;
  title: string;
  location: string;
  footprint: string;
  systemSpec: string;
  outcome: string;
  beforeAvif: string;
  beforeWebp: string;
  afterAvif: string;
  afterWebp: string;
  beforeAlt: string;
  afterAlt: string;
}

const SPOTLIGHT_CASES: SpotlightCase[] = [
  {
    slug: 'carlsbad-tile-relayment',
    shortLabel: 'Tile Relay',
    title: 'Carlsbad Concrete Tile Relayment',
    location: 'Aviara, Carlsbad',
    footprint: '3,400 sq ft',
    systemSpec: 'Dual SBS 250°F Synthetic · 26-Ga Valley Metal',
    outcome: '98% original tiles salvaged — ~40% saved vs. new tile',
    beforeAvif: '/img/projects/carlsbad-tile-relayment-before.avif',
    beforeWebp: '/img/projects/carlsbad-tile-relayment-before.webp',
    afterAvif: '/img/projects/carlsbad-tile-relayment-after.avif',
    afterWebp: '/img/projects/carlsbad-tile-relayment-after.webp',
    beforeAlt: 'Before concrete tile roof lift-and-reset in Carlsbad showing aged 20-year felt underlayment',
    afterAlt: 'Completed Carlsbad concrete tile roof relayment with new galvanized valleys and sealed ridge mortar',
  },
  {
    slug: 'oceanside-shingle-replacement',
    shortLabel: 'Shingle Tear-Off',
    title: 'Oceanside Architectural Shingle Replacement',
    location: 'Coastal Oceanside',
    footprint: '2,800 sq ft',
    systemSpec: 'Owens Corning Duration · 130 MPH · CRC R908',
    outcome: 'Done in 2 days — passed inspection with 25-yr warranty',
    beforeAvif: '/img/projects/oceanside-shingle-replacement-before.avif',
    beforeWebp: '/img/projects/oceanside-shingle-replacement-before.webp',
    afterAvif: '/img/projects/oceanside-shingle-replacement-after.avif',
    afterWebp: '/img/projects/oceanside-shingle-replacement-after.webp',
    beforeAlt: 'Before coastal Oceanside shingle roof tear-off showing granule loss and marine layer wear',
    afterAlt: 'After Owens Corning Duration architectural shingle installation on Oceanside residence',
  },
  {
    slug: 'carlsbad-solar-detach-reset',
    shortLabel: 'Solar Detach & Reset',
    title: 'Carlsbad Solar Detach, Reroof & Reset',
    location: 'Carlsbad, CA',
    footprint: '28 PV Modules',
    systemSpec: 'In-House DC Isolation · Flashed Boots · OC System',
    outcome: '4-day single-crew turnaround — zero solar warranty gap',
    beforeAvif: '/img/projects/carlsbad-solar-detach-reset-before.avif',
    beforeWebp: '/img/projects/carlsbad-solar-detach-reset-before.webp',
    afterAvif: '/img/projects/carlsbad-solar-detach-reset-after.avif',
    afterWebp: '/img/projects/carlsbad-solar-detach-reset-after.webp',
    beforeAlt: 'Before Carlsbad solar panel detach showing leaking penetrations beneath aging roof array',
    afterAlt: 'Completed Carlsbad roof replacement and torque-verified solar array reset',
  },
  {
    slug: 'oceanside-siding',
    shortLabel: 'Hardie Siding',
    title: 'Coastal James Hardie Siding Renovation',
    location: 'Coastal Oceanside',
    footprint: '2,600 sq ft',
    systemSpec: 'James Hardie Plank · 316 Marine Stainless · Class-A Fire',
    outcome: 'Zero salt-air rot — passed inspection with 25-yr warranty',
    beforeAvif: '/img/projects/oceanside-siding-before.avif',
    beforeWebp: '/img/projects/oceanside-siding-before.webp',
    afterAvif: '/img/projects/oceanside-siding-after.avif',
    afterWebp: '/img/projects/oceanside-siding-after.webp',
    beforeAlt: 'Before coastal Oceanside siding replacement showing salt-air wear on aged wood exterior',
    afterAlt: 'Completed coastal Oceanside James Hardie fiber-cement siding renovation',
  },
];

export function BeforeAfterCompare() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [split, setSplit] = useState(50);

  const active = SPOTLIGHT_CASES[activeIndex] ?? SPOTLIGHT_CASES[0];

  return (
    <div className="border border-[#0B1B2B]/14 bg-[#FFFFFF] shadow-[0_14px_34px_-12px_rgba(11,27,43,0.08)]">
      {/* Project Switcher Strip */}
      <div
        role="group"
        aria-label="Select project transformation"
        className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#0B1B2B]/12 bg-[#F4F9FC]"
      >
        {SPOTLIGHT_CASES.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'min-h-11 px-3 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer border-[#0B1B2B]/12 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0B1B2B]',
                idx % 2 === 1 && 'border-l',
                idx >= 2 && 'border-t sm:border-t-0',
                idx > 0 && 'sm:border-l',
                isSelected
                  ? 'bg-[#0B1B2B] text-white'
                  : 'text-[#233B53] hover:bg-[#FFFFFF] hover:text-[#0B1B2B]'
              )}
            >
              <span className="block truncate">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Before / After Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B1B2B] select-none">
        {/* After Base Layer */}
        <picture className="block w-full h-full">
          <source
            srcSet={`${active.afterAvif.replace('.avif', '-480.avif')} 480w, ${active.afterAvif} 960w`}
            sizes="(max-width: 640px) 260px, 720px"
            type="image/avif"
          />
          <source
            srcSet={`${active.afterWebp.replace('.webp', '-480.webp')} 480w, ${active.afterWebp} 960w`}
            sizes="(max-width: 640px) 260px, 720px"
            type="image/webp"
          />
          <img
            src={active.afterWebp}
            alt={active.afterAlt}
            width={960}
            height={600}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </picture>

        {/* Before Clipped Top Layer */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <picture className="block w-full h-full">
            <source
              srcSet={`${active.beforeAvif.replace('.avif', '-480.avif')} 480w, ${active.beforeAvif} 960w`}
              sizes="(max-width: 640px) 260px, 720px"
              type="image/avif"
            />
            <source
              srcSet={`${active.beforeWebp.replace('.webp', '-480.webp')} 480w, ${active.beforeWebp} 960w`}
              sizes="(max-width: 640px) 260px, 720px"
              type="image/webp"
            />
            <img
              src={active.beforeWebp}
              alt={active.beforeAlt}
              width={960}
              height={600}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        {/* Accessible Range Input */}
        <input
          type="range"
          min={5}
          max={95}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label="Compare before and after roof transformation"
          className="peer absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />

        {/* Hairline Divider & Handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 z-10 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(11,27,43,0.55)] peer-focus-visible:bg-[#FFC700]"
          style={{ left: `${split}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0B1B2B] bg-[#FFFFFF] text-[#0B1B2B] shadow-[0_6px_18px_rgba(11,27,43,0.35)]">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M7 6L3 10l4 4m6-8l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Solid Architectural Corner Plates */}
        <span className="pointer-events-none absolute top-3 left-3 z-10 bg-[#0B1B2B] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.05em] text-white">
          Before
        </span>
        <span className="pointer-events-none absolute top-3 right-3 z-10 bg-[#FFFFFF] border border-[#0B1B2B]/20 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.05em] text-[#0B1B2B]">
          After
        </span>
      </div>

      {/* Compact Spec & Outcome Caption */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
          <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-[#0B1B2B]">
            {active.title}
          </p>
          <span className="text-xs font-bold text-[#3E5871] tabular-nums shrink-0">
            {active.location} · {active.footprint}
          </span>
        </div>

        <p className="mt-1.5 text-xs sm:text-sm text-[#233B53] leading-snug tabular-nums">
          <strong className="font-bold text-[#0B1B2B]">{active.systemSpec}</strong> · {active.outcome}.
        </p>

        <div className="mt-3.5 pt-3 border-t border-[#0B1B2B]/12 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#3E5871] tabular-nums">
            Drag or arrow keys ({split}% / {100 - split}%)
          </span>
          <Link
            href={`/projects/${active.slug}`}
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F5C8C] hover:text-[#0B1B2B] underline underline-offset-4 shrink-0"
          >
            <span>{active.shortLabel} Case Study</span>
            <Icon name="arrow-right" className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
