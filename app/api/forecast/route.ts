/**
 * Rain check for the emergency strip. Proxies Open-Meteo (no key needed on the free endpoint) and caches
 * for 30 minutes, so one upstream call serves every visitor.
 *
 * LICENSE NOTE: Open-Meteo's free API is for non-commercial use. A business site should use the paid
 * "API Standard" plan: set OPEN_METEO_API_KEY and this switches to customer-api.open-meteo.com. TODO before launch.
 */
export const revalidate = 1800;

const SAN_DIEGO = { lat: 32.7157, lng: -117.1611 };

export async function GET() {
  const key = process.env.OPEN_METEO_API_KEY;
  const host = key ? 'https://customer-api.open-meteo.com' : 'https://api.open-meteo.com';
  const url =
    `${host}/v1/forecast?latitude=${SAN_DIEGO.lat}&longitude=${SAN_DIEGO.lng}` +
    `&hourly=precipitation_probability,precipitation&forecast_hours=48&timezone=America%2FLos_Angeles` +
    (key ? `&apikey=${key}` : '');
  try {
    const res = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { hourly?: { precipitation_probability?: number[]; precipitation?: number[] } };
    const prob = data.hourly?.precipitation_probability ?? [];
    const mm = data.hourly?.precipitation ?? [];
    // "Rain forecast" = any hour with ≥50% chance and measurable rain, or ≥1 mm in total over 48h.
    const total = mm.reduce((a, b) => a + (b ?? 0), 0);
    const rainSoon = prob.some((p, i) => p >= 50 && (mm[i] ?? 0) >= 0.2) || total >= 1;
    return Response.json({ rainSoon }, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=600' } });
  } catch {
    return Response.json({ rainSoon: false }, { headers: { 'Cache-Control': 'public, s-maxage=300' } });
  }
}
