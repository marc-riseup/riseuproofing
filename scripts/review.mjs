// Review + acceptance checks. Run against a running server (npm start, port 5180):
//   node scripts/review.mjs [outDir]
// Prints a JSON-ish report and writes screenshots to screenshots/review/<outDir>.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE = process.env.BASE_URL ?? 'http://localhost:5180';
const OUT = path.join(root, 'screenshots', 'review', process.argv[2] ?? 'latest');
const ONLY = process.argv[3]; // optional: desktop | mobile | reduced
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const log = (k, v) => {
  results.push([k, v]);
  console.log(`${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
};

// Real GPU (ANGLE/D3D11) so the WebGL scenes run at device speed, like a visitor's browser.
const launchArgs = ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu'];

async function diff(a, b) {
  const g = (f) => sharp(f).resize(160, 100, { fit: 'fill' }).greyscale().raw().toBuffer();
  const [x, y] = await Promise.all([g(a), g(b)]);
  let s = 0;
  for (let i = 0; i < x.length; i++) s += Math.abs(x[i] - y[i]);
  return +(s / x.length).toFixed(2); // mean abs grey diff 0..255
}

async function trackY(page, id, frac) {
  return page.evaluate(
    ([id, frac]) => {
      const sec = document.getElementById(id);
      if (!sec) return 0;
      const el = sec.querySelector('.scene-track') ?? sec;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      return Math.round(top + Math.max(0, r.height - window.innerHeight) * frac);
    },
    [id, frac],
  );
}

/** Scroll in wheel-sized steps so ScrollTrigger scrub + scene lerps behave like a real user.
 *  Desktop uses real wheel events (Lenis smooth scroll); touch contexts use stepped scrollTo. */
async function glide(page, y, settle = 1600) {
  y = await page.evaluate((y) => Math.min(y, document.documentElement.scrollHeight - innerHeight), y);
  const touch = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
  if (!touch) {
    await page.mouse.move(720, 450);
    for (let pass = 0; pass < 4; pass++) {
      const delta = await page.evaluate((y) => y - window.scrollY, y);
      if (Math.abs(delta) < 3) break;
      const step = 200;
      const n = Math.ceil(Math.abs(delta) / step);
      for (let i = 0; i < n; i++) {
        const d = i === n - 1 ? delta - Math.sign(delta) * step * (n - 1) : Math.sign(delta) * step;
        await page.mouse.wheel(0, d);
        await wait(45);
      }
      await wait(900);
    }
    await wait(settle);
    return;
  }
  await page.evaluate(async (y) => {
    const from = window.scrollY;
    const steps = Math.max(1, Math.min(40, Math.round(Math.abs(y - from) / 240)));
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, from + ((y - from) * i) / steps);
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 16)));
    }
  }, y);
  await wait(settle);
}

async function canvases(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('canvas')]
      .filter((c) => !c.closest('.leaflet-container'))
      .map((c) => {
        const r = c.getBoundingClientRect();
        return { scene: c.closest('[data-scene]')?.dataset.scene ?? '?', w: c.width, h: c.height, cssW: Math.round(r.width), cssH: Math.round(r.height) };
      }),
  );
}

async function fontsReport(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const body = getComputedStyle(document.body).fontFamily;
    const h = getComputedStyle(document.querySelector('h1')).fontFamily;
    const families = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))];
    const bodyFirst = body.split(',')[0].trim().replace(/["']/g, '');
    const headFirst = h.split(',')[0].trim().replace(/["']/g, '');
    const checks = {
      [bodyFirst]: document.fonts.check(`400 18px "${bodyFirst}"`),
      [headFirst]: document.fonts.check(`800 48px "${headFirst}"`),
    };
    // Any element whose stack would fall to a serif (Times / generic serif without sans-serif)?
    const bad = new Map();
    for (const el of document.querySelectorAll('body *')) {
      const ff = getComputedStyle(el).fontFamily.toLowerCase();
      const serifish = /times|literata|georgia|(^|,)\s*serif\s*($|,)/.test(ff) && !/sans-serif/.test(ff);
      if (serifish) bad.set(ff, (bad.get(ff) ?? 0) + 1);
    }
    return { body, heading: h, loaded: families, checks, serifElements: Object.fromEntries(bad) };
  });
}

async function desktop(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await wait(2200);
  const shot = (n) => page.screenshot({ path: path.join(OUT, `d-${n}.png`) });
  await shot('01-hero');
  log('desktop.fonts', await fontsReport(page));

  // Roof scene at 0 / 50 / 100 % of its pin
  const roofState = () =>
    page.evaluate(() => ({
      sp: getComputedStyle(document.querySelector('#roof .scene-track')).getPropertyValue('--sp'),
      card: document.querySelector('#roof .swap__item[data-on] .swap__num')?.textContent,
      name: document.querySelector('#roof .swap__item[data-on] .swap__name')?.textContent,
      y: Math.round(scrollY),
    }));
  for (const f of [0, 0.5, 1]) {
    await glide(page, await trackY(page, 'roof', f), 2600);
    await shot(`02-roof-${f * 100}`);
    log(`desktop.roof@${f * 100}`, await roofState());
    if (f === 0.5) log('desktop.canvases@roof', await canvases(page));
  }
  // Audit stages 1 / 2 / 3
  const stageAt = [0.12, 0.5, 0.92];
  for (let i = 0; i < 3; i++) {
    await glide(page, await trackY(page, 'audit', stageAt[i]), i === 2 ? 5000 : 3000);
    await shot(`03-audit-stage${i + 1}`);
    log(`desktop.audit@stage${i + 1}`, await page.evaluate(() => document.querySelector('.stepper__row[aria-current] .stepper__title')?.textContent));
    if (i === 1) log('desktop.canvases@audit', await canvases(page));
  }
  // Reverse: back up through audit then roof
  await glide(page, await trackY(page, 'audit', stageAt[0]), 3000);
  await shot('04-audit-back-stage1');
  await glide(page, await trackY(page, 'roof', 0.5), 2600);
  await shot('04-roof-back-50');
  await glide(page, await trackY(page, 'roof', 0), 2600);
  await shot('04-roof-back-0');

  const D = (a, b) => diff(path.join(OUT, `d-${a}.png`), path.join(OUT, `d-${b}.png`));
  log('diff.roof 0 vs 50', await D('02-roof-0', '02-roof-50'));
  log('diff.roof 50 vs 100', await D('02-roof-50', '02-roof-100'));
  log('diff.roof 0 vs 100', await D('02-roof-0', '02-roof-100'));
  log('diff.audit 1 vs 2', await D('03-audit-stage1', '03-audit-stage2'));
  log('diff.audit 2 vs 3', await D('03-audit-stage2', '03-audit-stage3'));
  log('reverse.roof back0 vs 0 (should be small)', await D('04-roof-back-0', '02-roof-0'));
  log('reverse.roof back50 vs 50 (should be small)', await D('04-roof-back-50', '02-roof-50'));
  log('reverse.audit back1 vs stage1 (should be small)', await D('04-audit-back-stage1', '03-audit-stage1'));
  log('reverse.audit back1 vs stage3 (should be large)', await D('04-audit-back-stage1', '03-audit-stage3'));

  // Nav over a dark section (FAQ): scroll down past, then up a little so the nav returns over text
  const faqY = await page.evaluate(() => document.getElementById('faq').getBoundingClientRect().top + scrollY);
  await glide(page, faqY + 260, 400);
  await glide(page, faqY + 120, 1200);
  await page.screenshot({ path: path.join(OUT, 'd-05-nav-over-faq.png'), clip: { x: 0, y: 0, width: 1440, height: 160 } });
  log('nav@faq', await page.evaluate(() => {
    const n = document.querySelector('.nav');
    const cs = getComputedStyle(n);
    return { tone: document.querySelector('.chrome')?.dataset.tone, bg: cs.backgroundColor, blur: cs.backdropFilter, hidden: document.querySelector('.chrome')?.dataset.hidden };
  }));

  await glide(page, 999999, 1500);
  await shot('06-footer');
  log('desktop.hscroll', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));

  // Life: three wheel ticks (3 x 100px) in every section must move at least one sanctioned motion.
  const snap = () =>
    page.evaluate(() => {
      const vis = (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
      };
      const M = (el) => new DOMMatrix(getComputedStyle(el).transform);
      const o = (k) => +getComputedStyle(document.querySelector(`[data-sky="${k}"]`)).opacity;
      const orb = M(document.querySelector('[data-sky="orb"]'));
      const seal = document.querySelector('[data-seal]');
      const sm = seal && vis(seal) ? M(seal) : null;
      const sp = (id) => parseFloat(getComputedStyle(document.querySelector(`#${id} .scene-track`)).getPropertyValue('--sp')) || 0;
      return {
        orb: [orb.e, orb.f],
        sky: ['midday', 'golden', 'dusk', 'night', 'sun', 'moon', 'clouds', 'window'].map(o),
        moving: [...document.querySelectorAll('[data-parallax],[data-statement],[data-ghost]')].map((el) => (vis(el) ? [M(el).f, M(el).a] : null)),
        seal: sm ? (Math.atan2(sm.b, sm.a) * 180) / Math.PI : null,
        sp: [sp('roof'), sp('audit')],
      };
    });
  const life = {};
  for (const id of ['hero', 'trust', 'roof', 'services', 'projects', 'reviews', 'statement', 'audit', 'standard', 'estimate', 'faq', 'careers']) {
    const y = await page.evaluate((id) => {
      const el = document.getElementById(id);
      return el ? Math.max(0, el.getBoundingClientRect().top + scrollY + (id === 'hero' ? 0 : innerHeight * 0.25)) : null;
    }, id);
    if (y == null) continue;
    await glide(page, y, 1400);
    const a = await snap();
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 100);
      await wait(70);
    }
    await wait(1600);
    const b = await snap();
    const r = {};
    r.orbPx = Math.round(Math.hypot(b.orb[0] - a.orb[0], b.orb[1] - a.orb[1]));
    r.skyOpacity = +Math.max(...a.sky.map((v, i) => Math.abs(b.sky[i] - v))).toFixed(2);
    r.parallaxPx = +Math.max(0, ...a.moving.map((v, i) => (v && b.moving[i] ? Math.abs(b.moving[i][0] - v[0]) : 0))).toFixed(1);
    r.scale = +Math.max(0, ...a.moving.map((v, i) => (v && b.moving[i] ? Math.abs(b.moving[i][1] - v[1]) : 0))).toFixed(3);
    if (a.seal != null && b.seal != null) r.sealDeg = +Math.abs(b.seal - a.seal).toFixed(1);
    r.sceneP = +Math.max(Math.abs(b.sp[0] - a.sp[0]), Math.abs(b.sp[1] - a.sp[1])).toFixed(3);
    r.visible = r.orbPx >= 15 || r.skyOpacity >= 0.05 || r.parallaxPx >= 6 || r.scale >= 0.004 || (r.sealDeg ?? 0) >= 8 || r.sceneP >= 0.02;
    life[id] = r;
  }
  log('life (3 wheel ticks per section)', life);
  log('desktop.consoleErrors', errors);
  await ctx.close();
}

async function mobile(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'load' });
  await wait(2200);
  const shot = (n) => page.screenshot({ path: path.join(OUT, `m-${n}.png`) });
  await shot('01-hero');
  for (const f of [0, 0.5, 1]) {
    await glide(page, await trackY(page, 'roof', f), 2600);
    await shot(`02-roof-${f * 100}`);
    if (f === 0.5) log('mobile.canvases@roof', await canvases(page));
  }
  for (const [i, f] of [0.12, 0.5, 0.92].entries()) {
    await glide(page, await trackY(page, 'audit', f), 3000);
    await shot(`03-audit-stage${i + 1}`);
  }
  log('mobile.canvases@audit', await canvases(page));
  for (const id of ['services', 'projects', 'reviews', 'standard', 'estimate']) {
    await glide(page, await trackY(page, id, 0), 900);
    await shot(`04-${id}`);
  }
  await glide(page, 999999, 1200);
  await shot('05-footer');
  log('mobile.hscroll(px)', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  log('mobile.edgeOffenders(<24px gutter, text blocks)', await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('h1,h2,h3,p,li,a.btn,label,dt,dd')) {
      if (el.closest('.sr-only,.chrome,.mbar,.strip,.leaflet-container,.ru3d,.footer__ghost,.sky,.scene')) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.left < 23.5 || r.right > innerWidth - 23.5) out.push(`${el.tagName}.${el.className}`.slice(0, 60) + ` [${Math.round(r.left)}..${Math.round(r.right)}]`);
    }
    return [...new Set(out)].slice(0, 15);
  }));
  log('mobile.consoleErrors', errors);
  await ctx.close();
}

async function reduced(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'load' });
  await wait(1500);
  const y = await trackY(page, 'roof', 0);
  await glide(page, y, 1500);
  const before = await page.evaluate(() => ({
    step: !!document.querySelector('#roof [data-step]'),
    num: document.querySelector('#roof .swap__item[data-on] .swap__num')?.textContent,
  }));
  await page.screenshot({ path: path.join(OUT, 'r-01-roof-step1.png') });
  await page.mouse.wheel(0, 400);
  await wait(900);
  const afterScroll = await page.evaluate(() => document.querySelector('#roof .swap__item[data-on] .swap__num')?.textContent);
  await page.locator('#roof .rail__step', { hasText: 'Next' }).click();
  await wait(900);
  const afterNext = await page.evaluate(() => document.querySelector('#roof .swap__item[data-on] .swap__num')?.textContent);
  await page.locator('#roof').screenshot({ path: path.join(OUT, 'r-02-roof-step2.png') });
  log('reduced.roof', { stepMode: before.step, start: before.num, afterWheel: afterScroll, afterNextClick: afterNext, canvases: await canvases(page) });

  // Audit: frames step only via the stepper rows; wheel does not scrub
  await glide(page, await trackY(page, 'audit', 0), 1500);
  const cur = () => page.evaluate(() => document.querySelector('.stepper__row[aria-current] .stepper__title')?.textContent);
  const aStart = await cur();
  await page.mouse.wheel(0, 400);
  await wait(900);
  const aWheel = await cur();
  await page.locator('#audit .stepper__row').nth(2).click();
  await wait(900);
  const aClick = await cur();
  await page.locator('#audit').screenshot({ path: path.join(OUT, 'r-03-audit-step3.png') });
  log('reduced.audit', { start: aStart, afterWheel: aWheel, afterRow3Click: aClick, canvases: await canvases(page), poster: await page.evaluate(() => document.querySelector('#audit [data-scene] img')?.getAttribute('src')) });
  log('reduced.consoleErrors', errors);
  await ctx.close();
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: launchArgs,
});
try {
  if (!ONLY || ONLY === 'desktop') await desktop(browser);
  if (!ONLY || ONLY === 'mobile') await mobile(browser);
  if (!ONLY || ONLY === 'reduced') await reduced(browser);
} finally {
  await browser.close();
}
