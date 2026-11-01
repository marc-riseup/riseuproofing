// Review screenshots at 390 / 768 / 1440. Run against a running server:
//   npm run build && npm start   (port 5180)   then   npm run shots
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE = process.env.BASE_URL ?? 'http://localhost:5180';
const only = process.argv[2];

const viewports = [
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: true },
  { name: '1440', width: 1440, height: 900, mobile: false },
].filter((v) => !only || v.name === only);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollTo(page, y) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await wait(250);
  // nudge so scroll-direction logic + ScrollTrigger settle
  await page.evaluate((y) => window.scrollTo(0, y + 1), y);
  await wait(900);
}

async function sectionTop(page, id, frac = 0) {
  return page.evaluate(
    ([id, frac]) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return r.top + window.scrollY + (r.height - window.innerHeight) * frac;
    },
    [id, frac],
  );
}

async function run() {
  // CHROME_PATH lets you reuse an already-installed Chromium instead of `npx playwright install`.
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  for (const vp of viewports) {
    const dir = path.join(root, 'screenshots', vp.name);
    await mkdir(dir, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
    });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && console.log(`[${vp.name}] console:`, m.text()));
    page.on('pageerror', (e) => console.log(`[${vp.name}] pageerror:`, e.message));
    await page.goto(BASE, { waitUntil: 'load' });
    await wait(1800);
    let n = 0;
    const shot = async (name) => {
      n += 1;
      await page.screenshot({ path: path.join(dir, `${String(n).padStart(2, '0')}-${name}.png`) });
    };
    await shot('hero');

    // Trigger motion load + a scroll-up so the nav shows in condensed state
    const steps = [
      ['trust', 0, -200],
      ['roof', 0, 0],
      ['roof', 0.42, 0],
      ['roof', 1, 0],
      ['services', 0, -60],
      ['services', 0.6, 0],
      ['projects', 0, -60],
      ['projects', 0.55, 0],
      ['reviews', 0, -60],
      ['statement', 0.05, 0],
      ['audit', 0, 0],
      ['audit', 0.5, 0],
      ['audit', 1, 0],
      ['standard', 0, -60],
      ['standard', 0.7, 0],
      ['estimate', 0, -60],
      ['faq', 0, -40],
      ['careers', 0, -100],
    ];
    for (const [id, frac, offset] of steps) {
      const y = await sectionTop(page, id, frac);
      await scrollTo(page, Math.max(0, y + offset));
      await shot(`${id}-${Math.round(frac * 100)}`);
    }
    await scrollTo(page, 999999);
    await shot('footer');

    // Map tab
    const y = await sectionTop(page, 'projects', 0);
    await scrollTo(page, y);
    await page.getByRole('tab', { name: 'Map' }).click();
    await wait(2500);
    await page.locator('.pin').first().click({ force: true }).catch(() => {});
    await wait(1200);
    await shot('projects-map');

    await ctx.close();
    console.log(`shots: ${vp.name} done (${n})`);
  }

  // Sample report PDF from the HTML report (placeholder until the real export exists)
  if (!only) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/sample-21-point-report.html`, { waitUntil: 'load' });
    await page.pdf({ path: path.join(root, 'public', 'sample-21-point-report.pdf'), format: 'Letter', printBackground: true });
    await ctx.close();
  }
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
