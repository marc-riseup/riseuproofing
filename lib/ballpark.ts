/**
 * CRM Estimator & Lead Capture integration (/api/estimator/config, /api/estimator/calculate, /api/estimate).
 */

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
};

export const SERVICE_CRM_LABEL: Record<string, string> = {
  replacement: 'Roof Replacement',
  'tile-relay': 'Tile Roof & Underlayment Relay',
  repair: 'Leak Diagnostic & Repair',
  flat: 'Commercial Roofing',
  solar: 'Solar Roofing Integration',
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
  const rule = slug && service !== 'tile-relay' ? crmPricing?.[slug] : undefined;

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

export async function fetchEstimatorConfig(): Promise<Record<string, CrmPricingRule>> {
  try {
    const res = await fetch('/api/estimator/config');
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
    // Fallback to local pricing constants when offline
  }
  return {};
}

export async function getBallpark(input: BallparkInput): Promise<BallparkResult> {
  const [fallbackLow, fallbackHigh, fallbackMonthly] = computeBallparkRange(input.service, input.size);
  const note = 'Firmed up after a free inspection. Pitch, layers and access move the number.';

  try {
    const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('_ruid') || undefined : undefined;
    const res = await fetch('/api/estimator/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceSlug: SERVICE_CRM_SLUG[input.service] ?? 'residential',
        sqft: SIZE_SQFT[input.size] ?? 2000,
        source: 'preset',
        sessionId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.ok && data.estimate && input.service !== 'tile-relay') {
        return {
          low: Number(data.estimate.low) || fallbackLow,
          high: Number(data.estimate.high) || fallbackHigh,
          monthly: Number(data.estimate.monthlyLow) || fallbackMonthly,
          note,
        };
      }
    }
  } catch {
    // Graceful local fallback when backend is unreachable
  }

  return {
    low: fallbackLow,
    high: fallbackHigh,
    monthly: fallbackMonthly,
    note,
  };
}

export type LeadInput = BallparkInput & {
  name: string;
  phone: string;
  email?: string;
  city?: string | null;
  low?: number;
  high?: number;
  monthly?: number;
  formType?: 'estimator_full' | 'estimate';
  leadSource?: string;
  leadSourceDetail?: string;
  notes?: string;
  honeypotWebsite?: string;
  honeypotFax?: string;
  formStartedAt?: number;
  turnstileToken?: string;
};

export async function submitLead(input: LeadInput): Promise<{ ok: boolean; error?: string }> {
  const sqft = SIZE_SQFT[input.size] ?? 2000;
  const serviceLabel = SERVICE_CRM_LABEL[input.service] ?? 'Roof Replacement';
  const serviceSlug = SERVICE_CRM_SLUG[input.service] ?? 'residential';
  const [calcLow, calcHigh] = computeBallparkRange(input.service, input.size);
  const low = input.low ?? calcLow;
  const high = input.high ?? calcHigh;
  const midpoint = Math.round((low + high) / 2);

  const defaultNotes = `📊 Calculated Ballpark: $${low.toLocaleString()} – $${high.toLocaleString()} (${sqft.toLocaleString()} sq ft, ZIP ${input.zip}${input.city ? ` · ${input.city}` : ''})`;

  const startedAt =
    input.formStartedAt && Date.now() - input.formStartedAt >= 3100
      ? input.formStartedAt
      : Date.now() - 5000;

  const payload = {
    fullName: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    zip: input.zip,
    city: input.city || undefined,
    address: input.city ? `${input.city}, CA ${input.zip}` : input.zip,
    serviceType: serviceLabel,
    service_type: serviceSlug,
    roof_sqf: sqft,
    estimated_value: midpoint,
    notes: input.notes || defaultNotes,
    formType: input.formType ?? 'estimator_full',
    leadSource: input.leadSource ?? 'website_estimator',
    leadSourceDetail: input.leadSourceDetail ?? '📊 Instant Estimator',
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

  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data?.ok) {
    throw new Error(data?.detail || data?.error || 'Unable to submit your estimate request right now.');
  }

  return { ok: true };
}

export const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
