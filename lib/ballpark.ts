export const BALLPARK_SERVICES = [
  { value: 'replacement', label: 'Roof Replacement', icon: 'house' },
  { value: 'tile-relay', label: 'Tile Roof Lift & Relay', icon: 'layers' },
  { value: 'repair', label: 'Leak Repair & Storm Triage', icon: 'shield' },
  { value: 'flat', label: 'Commercial Flat / TPO', icon: 'building' },
  { value: 'solar', label: 'Solar Roofing / Detach & Reset', icon: 'sun' },
  { value: 'construction', label: 'Decks, Siding & Exterior', icon: 'hammer' },
] as const;

export const HOME_SIZES = [
  { value: 'lt1500', label: 'Under 1,500 sq ft', icon: 'ruler' },
  { value: '1500-2500', label: '1,500 – 2,500 sq ft', icon: 'ruler' },
  { value: '2500-3500', label: '2,500 – 3,500 sq ft', icon: 'ruler' },
  { value: 'gt3500', label: '3,500+ sq ft', icon: 'ruler' },
] as const;

export type BallparkServiceId = (typeof BALLPARK_SERVICES)[number]['value'];
export type HomeSizeId = (typeof HOME_SIZES)[number]['value'];

export type BallparkInput = { service: string; size: string; zip: string };
export type BallparkResult = { low: number; high: number; monthly: number; note: string };

export type CrmPricingRule = {
  pricePerSqftLow: number;
  pricePerSqftHigh: number;
  baseFeeLow: number;
  baseFeeHigh: number;
  financingApr: number;
  financingTermMonths: number;
};

export const SERVICE_CRM_SLUG: Record<string, string> = {
  replacement: 'residential',
  'tile-relay': 'residential',
  repair: 'repair',
  flat: 'commercial',
  solar: 'solar',
  construction: 'construction',
};

export const SERVICE_CRM_LABEL: Record<string, string> = {
  replacement: 'Roof Replacement',
  'tile-relay': 'Tile Roof Lift & Relay',
  repair: 'Leak Repair & Storm Triage',
  flat: 'Commercial Flat / TPO',
  solar: 'Solar Roofing / Detach & Reset',
  construction: 'Decks, Siding & Exterior Construction',
};

export const SIZE_SQFT: Record<string, number> = {
  lt1500: 1400,
  '1500-2500': 2000,
  '2500-3500': 3000,
  gt3500: 4200,
};

const BASE: Record<string, [number, number]> = {
  replacement: [12000, 26000],
  'tile-relay': [14000, 28000],
  repair: [350, 2500],
  flat: [25000, 85000],
  solar: [2500, 6500],
  construction: [8500, 38000],
};

const SIZE_FACTOR: Record<string, [number, number]> = {
  lt1500: [0, 0.35],
  '1500-2500': [0.2, 0.6],
  '2500-3500': [0.45, 0.85],
  gt3500: [0.7, 1],
};

export function computeBallparkRange(
  service: string,
  size: string,
  crmPricing?: Record<string, CrmPricingRule>,
): [number, number, number] {
  const round = (n: number) => (n >= 5000 ? Math.round(n / 500) * 500 : Math.round(n / 50) * 50);
  const slug = SERVICE_CRM_SLUG[service];
  const rule =
    slug && service !== 'tile-relay' && service !== 'construction' ? crmPricing?.[slug] : undefined;

  if (rule) {
    const sqft = SIZE_SQFT[size] ?? 2000;
    const low = round(rule.baseFeeLow + sqft * rule.pricePerSqftLow);
    const high = round(Math.max(low + 500, rule.baseFeeHigh + sqft * rule.pricePerSqftHigh));
    const term = rule.financingTermMonths || (service === 'repair' ? 24 : 120);
    const apr = rule.financingApr || 0;
    let monthly = Math.max(49, Math.round(low / term));
    if (apr > 0 && term > 0) {
      const r = apr / 100 / 12;
      const f = Math.pow(1 + r, term);
      monthly = Math.max(49, Math.round(low * ((r * f) / (f - 1))));
    }
    return [low, high, monthly];
  }

  const [min, max] = BASE[service] ?? BASE.replacement;
  const [a, b] = SIZE_FACTOR[size] ?? SIZE_FACTOR['1500-2500'];
  const low = round(min + (max - min) * a);
  const high = round(min + (max - min) * b);
  const months = service === 'repair' ? 24 : 120;
  const monthly = Math.max(49, Math.round((low * 1.12) / months));
  return [low, high, monthly];
}

let estimatorConfigPromise: Promise<Record<string, CrmPricingRule>> | null = null;

export function fetchEstimatorConfig(): Promise<Record<string, CrmPricingRule>> {
  if (estimatorConfigPromise) return estimatorConfigPromise;
  estimatorConfigPromise = (async () => {
    try {
      const res = await fetch('/api/estimator/config');
      if (!res.ok) {
        estimatorConfigPromise = null;
        return {};
      }
      const data = await res.json();
      if (data?.ok && Array.isArray(data.services)) {
        const map: Record<string, CrmPricingRule> = {};
        for (const s of data.services) {
          if (s?.slug && s?.pricing) {
            map[s.slug] = {
              pricePerSqftLow: Number(s.pricing.pricePerSqftLow ?? 4),
              pricePerSqftHigh: Number(s.pricing.pricePerSqftHigh ?? 6.2),
              baseFeeLow: Number(s.pricing.baseFeeLow ?? 500),
              baseFeeHigh: Number(s.pricing.baseFeeHigh ?? 950),
              financingApr: Number(s.pricing.financingApr ?? 0),
              financingTermMonths: Number(s.pricing.financingTermMonths ?? 60),
            };
          }
        }
        return map;
      }
    } catch {
      // Fallback to local pricing constants when offline or outside browser
      estimatorConfigPromise = null;
    }
    return {};
  })();
  return estimatorConfigPromise;
}

export async function getBallpark(input: BallparkInput): Promise<BallparkResult> {
  const crmPricing = await fetchEstimatorConfig();
  const [low, high, monthly] = computeBallparkRange(input.service, input.size, crmPricing);
  return {
    low,
    high,
    monthly,
    note: 'Final price confirmed at your free 21-point drone & roof inspection.',
  };
}

export type LeadInput = {
  service: string;
  size?: string;
  zip: string;
  name: string;
  phone: string;
  email?: string;
  city?: string | null;
  address?: string;
  low?: number;
  high?: number;
  monthly?: number;
  formType?: 'estimator_full' | 'estimate' | string;
  leadSource?: string;
  leadSourceDetail?: string;
  notes?: string;
  honeypotWebsite?: string;
  honeypotFax?: string;
  formStartedAt?: number;
  turnstileToken?: string;
};

export async function submitLead(input: LeadInput): Promise<{ ok: boolean }> {
  const sizeKey = input.size || '1500-2500';
  const sqft = SIZE_SQFT[sizeKey] ?? 2000;
  const serviceLabel = SERVICE_CRM_LABEL[input.service] ?? input.service ?? 'Roof Replacement';
  const serviceSlug = SERVICE_CRM_SLUG[input.service] ?? 'residential';
  const crmPricing =
    input.low !== undefined && input.high !== undefined ? undefined : await fetchEstimatorConfig();
  const [calcLow, calcHigh] = computeBallparkRange(input.service, sizeKey, crmPricing);
  const low = input.low ?? calcLow;
  const high = input.high ?? calcHigh;
  const midpoint = Math.round((low + high) / 2);

  const defaultNotes = `Calculated Ballpark: $${low.toLocaleString()} - $${high.toLocaleString()} (${sqft.toLocaleString()} sq ft, ZIP ${input.zip}${input.city ? `, ${input.city}` : ''})`;

  const startedAt = input.formStartedAt || Date.now();

  const resolvedAddress =
    input.address?.trim() || (input.city ? `${input.city}, CA ${input.zip}` : input.zip);

  const payload = {
    fullName: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    zip: input.zip,
    city: input.city || undefined,
    address: resolvedAddress,
    serviceType: serviceLabel,
    service_type: serviceSlug,
    roof_sqf: sqft,
    estimated_value: midpoint,
    notes: input.notes || defaultNotes,
    formType: input.formType ?? 'estimator_full',
    leadSource: input.leadSource ?? 'website_estimator',
    leadSourceDetail: input.leadSourceDetail ?? 'Hero Ballpark Estimator',
    business_fax: input.honeypotFax || '',
    company_website: input.honeypotWebsite || '',
    formStartedAt: startedAt,
    turnstileToken: input.turnstileToken || '',
  };

  const res = await fetch('/api/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail =
      typeof data?.detail === 'string' && data.detail
        ? data.detail
        : typeof data?.error === 'string' && data.error
          ? data.error
          : 'Unable to submit your quote request right now. Please retry or call (760) 622-1230.';
    throw new Error(detail);
  }

  return { ok: true };
}

export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isValidUsPhone(raw: string): boolean {
  return /^[2-9]\d{9}$/.test(raw.replace(/\D/g, '').replace(/^1/, ''));
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

export const usd = (n: number): string =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
