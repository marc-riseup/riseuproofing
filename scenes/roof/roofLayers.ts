/* ==========================================================================
   Rise Up — "How a Roof Works" layer card content (single source of truth for
   the visible card, the server-rendered <ol>, and the no-3D fallback cards).
   All specs verified from Rise Up content & Owens Corning Total Protection System®.
   Zero "TBD" or placeholder strings allowed.
   ========================================================================== */

export interface LayerSpecChips {
  /** Material or type */
  material?: string;
  /** Expected lifespan */
  lifespan?: string;
  /** Standard or rating */
  rating?: string;
}

export interface RoofLayerContent {
  /** 1-based index, top (ridge) to bottom (insulation). Must match ROOF_LAYERS order. */
  index: number;
  name: string;
  /** Eyebrow zone label */
  eyebrow: string;
  /** Optional specialty badge (Layer 4 Underlayment = "Rise Up specialty") */
  specialtyChip?: string;
  /** Optional callout service link (Layer 4 Underlayment differentiator) */
  serviceLink?: {
    label: string;
    href: string;
  };
  /** What the layer does for the homeowner (one-line summary) */
  line: string;
  chips: LayerSpecChips;
  /** "Why it matters" line */
  why: string;
}

export const LAYERS: RoofLayerContent[] = [
  {
    index: 1,
    name: 'Ridge Cap',
    eyebrow: 'Peak Weather Seal',
    line: 'Seals the high-wind peak where both roof slopes meet.',
    chips: {
      material: 'ProEdge® Hip & Ridge Cap',
      lifespan: '50-Yr System Rated',
      rating: 'UL 2218 · 130 MPH Wind',
    },
    why: 'The ridge line takes the highest wind uplift and UV exposure on the entire roof.',
  },
  {
    index: 2,
    name: 'Exhaust Vents',
    eyebrow: 'Thermal Attic Exhaust',
    line: 'Lets superheated, damp attic air escape continuously at the peak.',
    chips: {
      material: 'VentSure® Baffled Ridge Vent',
      lifespan: '50-Yr Matched Life',
      rating: '20 sq. in./ft NFA · CBC R806',
    },
    why: 'Trapped summer attic heat bakes shingles from below and drives up San Diego cooling bills.',
  },
  {
    index: 3,
    name: 'Shingles',
    eyebrow: 'Primary Weather Armor',
    line: 'Your first line of defense against UV sun, Santa Ana winds, and driving rain.',
    chips: {
      material: 'Duration® Cool Architectural',
      lifespan: '50-Yr Preferred Warranty',
      rating: 'UL 790 Class A · Title 24',
    },
    why: 'SureNail® fabric-strip technology resists 130 MPH wind uplift while reflecting solar heat.',
  },
  {
    index: 4,
    name: 'Underlayment',
    eyebrow: 'Secondary Water Barrier',
    specialtyChip: 'Rise Up specialty',
    serviceLink: {
      label: 'Explore Underlayment & Tile Relays →',
      href: '/services/tile-roofing',
    },
    line: 'A breathable high-temp waterproof barrier laid across the entire wood deck.',
    chips: {
      material: 'High-Temp Woven Synthetic',
      lifespan: '30–50 Yr Deck Shield',
      rating: 'ASTM D4869 · 240°F Rated',
    },
    why: 'Most Southern California roof leaks start when builder-grade felt paper turns brittle; our dual-layer synthetic barrier seals the deck.',
  },
  {
    index: 5,
    name: 'Ice & Water Shield',
    eyebrow: 'Valley & Penetration Seal',
    line: 'Self-adhering membrane that seals eaves, valleys, skylights, and nail shanks.',
    chips: {
      material: 'WeatherLock® SBS Membrane',
      lifespan: '50-Yr Self-Healing Seal',
      rating: 'ASTM D1970 Waterproof',
    },
    why: 'Most roof leaks begin in valleys and flashings where two roof planes concentrate storm runoff.',
  },
  {
    index: 6,
    name: 'Intake Vents',
    eyebrow: 'Soffit Airflow Intake',
    line: 'Pulls cool fresh air in at the eaves so the attic ventilation loop can breathe.',
    chips: {
      material: 'Continuous Louvered Eave Vent',
      lifespan: '50+ Yr Corrosion-Free',
      rating: 'Balanced Title 24 Airflow',
    },
    why: 'Without cool intake air at the eaves, ridge exhaust vents cannot flush heat or moisture.',
  },
  {
    index: 7,
    name: 'Plywood Decking',
    eyebrow: 'Structural Sheathing',
    line: 'The solid APA-rated wood foundation every roofing layer is fastened to.',
    chips: {
      material: '19/32" APA CDX Plywood',
      lifespan: '60+ Yr Structural Deck',
      rating: 'APA PS 1 · Seismic 8d Ring-Shank',
    },
    why: 'We strip to bare wood, replace dry-rot sheets, and re-nail the deck to California seismic code.',
  },
  {
    index: 8,
    name: 'Roof Framing',
    eyebrow: 'Engineered Load Structure',
    line: 'Kiln-dried trusses and rafters that carry the weight of your roof and solar array.',
    chips: {
      material: 'Douglas Fir Trusses @ 24" O.C.',
      lifespan: '100+ Yr Framing Envelope',
      rating: 'CBC Ch. 23 · Simpson Ties',
    },
    why: 'As dual C-39 and Class B builders, we repair structural framing and fascia in-house.',
  },
  {
    index: 9,
    name: 'Insulation',
    eyebrow: 'Thermal Envelope',
    line: 'Keeps conditioned indoor comfort in and extreme attic heat out.',
    chips: {
      material: 'PINK® R-38 Fiberglas™ Batts',
      lifespan: 'Lifetime Non-Settling',
      rating: 'R-38 · CA Title 24 Part 6',
    },
    why: 'Proper R-38 attic insulation and balanced ventilation reduce summer cooling loads by up to 25%.',
  },
];

/** Closing state shown after layer 9 completes and the roof reassembles (the section's only CTA). */
export const CLOSING_CONTENT = {
  eyebrow: 'Complete 9-Layer Total Protection System®',
  title: 'Want every layer done right?',
  line: 'Every layer works in concert to block wind-driven rain, reflect Southern California heat, and protect your home.',
  ctaLabel: 'Book the free inspection',
  ctaHref: '#estimate',
  linkLabel: 'Explore our roofing systems',
  linkHref: '#services',
};

/* ── Step mapping shared by the card, the progress rail and the 3D leader line ──
   Scroll progress p (0..1):
   - 0.00–0.06: Assembled intro
   - 0.06–0.86: Nine layer segments (steps 1..9), with 1.8x dwell slowdown on Layer 4 (Underlayment)
   - 0.86–1.00: Reverse explode (reassemble) + reveal "Book the free inspection" CTA (step 10)
*/
export const CLOSING_STEP = 10;
export const SEG_START = 0.06;
export const SEG_SPAN = 0.80;
export const CLOSING_AT = 0.87;

const LAYER_WEIGHTS = [1, 1, 1, 1.8, 1, 1, 1, 1, 1];
const TOTAL_WEIGHT = LAYER_WEIGHTS.reduce((a, b) => a + b, 0);
const LAYER_BOUNDS: number[] = [0];
for (let i = 0; i < LAYER_WEIGHTS.length; i++) {
  LAYER_BOUNDS.push(LAYER_BOUNDS[i] + LAYER_WEIGHTS[i] / TOTAL_WEIGHT);
}

export function segmentU(p: number): number {
  return Math.max(0, Math.min(1, (p - SEG_START) / SEG_SPAN));
}

/** Piecewise-linear continuous step coordinate 0..9 with Layer 4 slowdown */
function continuousStepFromProgress(p: number): number {
  const u = segmentU(p);
  if (u <= 0) return 0;
  if (u >= 1) return 9;
  for (let i = 0; i < 9; i++) {
    const b0 = LAYER_BOUNDS[i];
    const b1 = LAYER_BOUNDS[i + 1];
    if (u <= b1 || i === 8) {
      return i + (u - b0) / Math.max(1e-6, b1 - b0);
    }
  }
  return 9;
}

/** 1..9 = layer card, 10 = closing card (reassembled state) */
export function cardStepFromProgress(p: number): number {
  if (p >= CLOSING_AT) return CLOSING_STEP;
  const s = continuousStepFromProgress(p);
  return Math.max(1, Math.min(9, Math.floor(s + 0.5)));
}

/** 0..1 position inside the current card's display window (used to fade the leader line) */
export function cardPhaseFromProgress(p: number): number {
  const step = cardStepFromProgress(p);
  if (step === CLOSING_STEP) return 1;
  const s = continuousStepFromProgress(p);
  if (step === 1 && s < 0.5) return 0.5;
  return Math.max(0, Math.min(1, s - (step - 0.5)));
}

/** Scroll progress that lands centered on layer k's card window */
export function progressForStep(step: number): number {
  if (step >= CLOSING_STEP) return 0.96;
  const k = Math.max(1, Math.min(9, Math.round(step)));
  const b0 = LAYER_BOUNDS[k - 1];
  const b1 = LAYER_BOUNDS[k];
  const u = b0 + 0.65 * (b1 - b0);
  return SEG_START + u * SEG_SPAN;
}

/** Rail fill 0..1 so dot k is reached when card k is active */
export function railFillFromProgress(p: number): number {
  if (p >= CLOSING_AT) return 1;
  const s = continuousStepFromProgress(p);
  return Math.max(0, Math.min(1, (s - 0.5) / 8));
}
