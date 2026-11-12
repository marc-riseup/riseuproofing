import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { registerHooks } from 'node:module';
import { checkZip, zipMessage } from '../zip.ts';
import { services } from '../data/services.ts';
import { projects } from '../data/projects.ts';
import {
  computeBallparkRange,
  fetchEstimatorConfig,
  formatPhone,
  getBallpark,
  isValidEmail,
  isValidUsPhone,
  submitLead,
  type CrmPricingRule,
} from '../ballpark.ts';

registerHooks({
  resolve(specifier, ctx, next) {
    return next(
      specifier.startsWith('@/') ? new URL(`../../${specifier.slice(2)}.ts`, import.meta.url).href : specifier,
      ctx,
    );
  },
});

const { buildMetadata, serializeJsonLd, buildLocalBusinessJsonLd } = await import('../seo/metadata.ts');

test('checkZip serves San Diego County, Temecula & Murrieta and rejects Orange County', () => {
  assert.deepEqual(checkZip(''), { state: 'empty' });
  assert.deepEqual(checkZip('920'), { state: 'partial' });
  assert.deepEqual(checkZip('92054'), { state: 'served', zip: '92054', city: 'Oceanside' });
  assert.deepEqual(checkZip('92054-1234'), { state: 'served', zip: '92054', city: 'Oceanside' });
  assert.deepEqual(checkZip('91910'), { state: 'served', zip: '91910', city: 'Chula Vista' });
  assert.deepEqual(checkZip('92101'), { state: 'served', zip: '92101', city: 'San Diego' });
  assert.deepEqual(checkZip('92562'), { state: 'served', zip: '92562', city: 'Murrieta' });
  assert.deepEqual(checkZip('92592'), { state: 'served', zip: '92592', city: 'Temecula' });

  const orangeCounty = checkZip('92672');
  assert.deepEqual(orangeCounty, { state: 'outside', zip: '92672' });
  assert.match(zipMessage(orangeCounty), /\(760\) 622-1230/);

  assert.deepEqual(checkZip('92501'), { state: 'outside', zip: '92501' });
  assert.deepEqual(checkZip('10001'), { state: 'invalid' });
});

test('computeBallparkRange handles presets, CRM overrides, bypasses, and APR math', () => {
  // Preset fallback without CRM rules
  assert.deepEqual(computeBallparkRange('replacement', '1500-2500'), [15000, 20500, 140]);

  const crmRules: Record<string, CrmPricingRule> = {
    residential: {
      pricePerSqftLow: 4,
      pricePerSqftHigh: 6.2,
      baseFeeLow: 500,
      baseFeeHigh: 950,
      financingApr: 0,
      financingTermMonths: 60,
    },
  };

  // CRM pricing override for replacement
  assert.deepEqual(computeBallparkRange('replacement', '1500-2500', crmRules), [8500, 13500, 142]);

  // tile-relay and construction bypass residential CRM rule
  assert.deepEqual(computeBallparkRange('tile-relay', '1500-2500', crmRules), [17000, 22500, 159]);
  assert.deepEqual(computeBallparkRange('construction', '1500-2500', crmRules), [14500, 26000, 135]);

  // Positive APR monthly amortization math (7.99% over 60 months on $8,500 = $172/mo)
  const aprRules: Record<string, CrmPricingRule> = {
    residential: {
      ...crmRules.residential,
      financingApr: 7.99,
      financingTermMonths: 60,
    },
  };
  assert.deepEqual(computeBallparkRange('replacement', '1500-2500', aprRules), [8500, 13500, 172]);
});

test('formatPhone, isValidUsPhone, and isValidEmail handle pastes and reject 0xx/1xx area codes', () => {
  assert.equal(formatPhone('7606221230'), '(760) 622-1230');
  assert.equal(formatPhone('17606221230'), '(760) 622-1230');
  assert.equal(formatPhone('+1 (760) 622-1230 ext 4'), '(760) 622-1230');

  assert.equal(isValidUsPhone('(760) 622-1230'), true);
  assert.equal(isValidUsPhone('+1 (760) 622-1230'), true);
  assert.equal(isValidUsPhone('(012) 345-6789'), false);
  assert.equal(isValidUsPhone('(123) 456-7890'), false);
  assert.equal(isValidUsPhone('+1 (123) 456-7890'), false);
  assert.equal(isValidUsPhone('760-622-123'), false);

  assert.equal(isValidEmail('alex@example.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail(''), false);
});

test('getBallpark caches fetchEstimatorConfig and submitLead preserves real formStartedAt', async () => {
  const originalFetch = globalThis.fetch;
  let configCalls = 0;
  let capturedBody: Record<string, unknown> | null = null;

  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url === '/api/estimator/config') {
      configCalls += 1;
      return new Response(
        JSON.stringify({
          ok: true,
          services: [
            {
              slug: 'residential',
              pricing: {
                pricePerSqftLow: 4,
                pricePerSqftHigh: 6.2,
                baseFeeLow: 500,
                baseFeeHigh: 950,
                financingApr: 0,
                financingTermMonths: 60,
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (url === '/api/estimate') {
      capturedBody = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    throw new Error(`Unexpected URL: ${url}`);
  }) as typeof fetch;

  try {
    const r1 = await getBallpark({ service: 'replacement', size: '1500-2500', zip: '92054' });
    const r2 = await getBallpark({ service: 'replacement', size: '1500-2500', zip: '92054' });
    await fetchEstimatorConfig();

    assert.equal(configCalls, 1);
    assert.equal(r1.low, 8500);
    assert.equal(r1.high, 13500);
    assert.equal(r1.monthly, 142);
    assert.deepEqual(r1, r2);

    const fastTimestamp = Date.now() - 400;
    await submitLead({
      service: 'replacement',
      size: '1500-2500',
      zip: '92054',
      name: 'Alex Rivera',
      phone: '(760) 555-0192',
      formStartedAt: fastTimestamp,
    });

    assert.ok(capturedBody);
    assert.equal(capturedBody['formStartedAt'], fastTimestamp);
    assert.equal(capturedBody['estimated_value'], 11000);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('serializeJsonLd escapes closing script tags and buildMetadata caps unbranded >55-char titles', () => {
  const malicious = {
    reviewBody: 'Great roof </script><script>alert(1)</script>!',
  };
  const serialized = serializeJsonLd(malicious);
  assert.ok(!serialized.includes('</script>'));
  assert.ok(serialized.includes('\\u003c/script>'));
  assert.deepEqual(JSON.parse(serialized), malicious);

  // Short unbranded title gets "| Rise Up Roofing"
  const shortMeta = buildMetadata({
    title: 'Client Reviews | 5-Star San Diego Roofing',
    description: 'desc',
    path: '/reviews',
  });
  assert.equal((shortMeta.title as { absolute: string }).absolute, 'Client Reviews | 5-Star San Diego Roofing | Rise Up Roofing');

  // Trailing "| Free Estimates" is replaced with brand when resulting base fits
  const freeEstMeta = buildMetadata({
    title: 'Solar Roofing San Diego | Detach & Reset | Free Estimates',
    description: 'desc',
    path: '/services/solar-roofing',
  });
  assert.equal((freeEstMeta.title as { absolute: string }).absolute, 'Solar Roofing San Diego | Detach & Reset | Rise Up Roofing');

  // Unbranded >55-char dynamic title is preserved without pushing past SERP limits
  const longTitle = 'Tile Roof Underlayment Relay in Oceanside | San Diego Roofing Case Study';
  const longMeta = buildMetadata({
    title: longTitle,
    description: 'desc',
    path: '/projects/oceanside-tile-relay',
  });
  assert.equal((longMeta.title as { absolute: string }).absolute, longTitle);

  // LocalBusiness schema serves San Diego County + 32 exact cities (no whole-county Riverside claim)
  const lb = buildLocalBusinessJsonLd();
  assert.equal(lb.areaServed.length, 33);
  assert.ok(!lb.areaServed.some((a: { name: string }) => a.name === 'Riverside County'));
  assert.ok(lb.areaServed.some((a: { name: string }) => a.name === 'Temecula'));
  assert.ok(lb.areaServed.some((a: { name: string }) => a.name === 'Murrieta'));
});

test('services, projects, and HOMEPAGE_FAQS enforce 25-year warranty standard with zero 50-year/lifetime warranty claims', () => {
  const servicesJson = JSON.stringify(services);
  const projectsJson = JSON.stringify(projects);
  const homepageFaqSrc = fs.readFileSync(
    new URL('../../components/home/HomepageFaqAndGuides.tsx', import.meta.url),
    'utf8',
  );

  for (const [label, text] of [
    ['services.ts', servicesJson],
    ['projects.ts', projectsJson],
    ['HOMEPAGE_FAQS', homepageFaqSrc],
  ] as const) {
    assert.match(text, /25[-\s]?(?:year|yr)/i, `${label} must include 25-year warranty coverage`);
    assert.doesNotMatch(
      text,
      /\b(?:50[-\s]?(?:year|yr)|lifetime)\b/i,
      `${label} must not contain 50-year, 50-yr, or lifetime warranty claims`,
    );
  }
});
