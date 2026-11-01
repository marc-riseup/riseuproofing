// @ts-nocheck
/* AUTO-GENERATED engine — do not edit by hand.
 * Source: static-hero/inspection-3d.html · regenerate with: node scripts/build-inspection-engine.cjs */
/* Rise Up 3.0 host patch (the only changes to this file, all marked `[3.0 host]`):
 *  - deps.external: skip the engine's own GSAP ScrollTrigger pin/scrub; the host page drives
 *    progress through api.setProgress(s) (s = 0..1 across the three stages).
 *  - api.pause() / api.resume() for the host adapter, deps.onFirstFrame() after the first render.
 * Scene content, HUD, shaders, camera keys and report are untouched. */

export function initInspection3D(root, deps) {
  'use strict';
  deps = deps || {};

  /* ===========================================================================
   * 1. CONFIG — the knobs you will most likely want to tweak
   * ========================================================================= */
  const CONFIG = {
    colors: {
      sky: '#5bbcff', amber: '#ffc21a', red: '#e8412c', green: '#2ed39a',
      navy: '#06121f', navy2: '#0a2540',
      stucco: '#efe4d0', trim: '#f6f1e7', door: '#5a3a24', glass: '#1a2a3c', windowGlow: '#ffb25e',
      tiles: ['#b5532f', '#c2623a', '#a9492a', '#cd7046', '#9b4327', '#bb5a37', '#c86a3f'],
      // dusk environment
      skyTop: '#0b1f3d', skyMid: '#3c5a8a', skyHorizon: '#f2a36a', sunGlow: '#ffc98f',
      fog: '#5a6386', fogThermal: '#03060f', fogReport: '#081a2e',
      sunLight: '#ffd2a1', fillLight: '#7da8ff', hemiSky: '#a9cbff', hemiGround: '#4d3a2a',
    },
    house: {                 // world units ≈ metres
      length: 12, depth: 8, wallH: 3,
      pitch: 0.45,           // rise/run (0.45 = 5.4:12)
      eaveOverhang: 0.5, gableOverhang: 0.3,
      wing: { xc: -2.6, halfWidth: 2.4, front: 7.4 },   // cross-gable wing (creates the valleys)
      chimney: { x: -4.4, z: -1.9 },
      pipeBoot: { x: 1.05, z: 2.9 },
    },
    camera: {
      // Spherical camera keys per stage: target, radius, azimuth (deg, from +Z toward +X),
      // azimuthEnd (drift across the stage's scroll), elevation (deg), fov, shift (screen-right offset)
      stages: [
        { target: [-0.2, 2.7, 1.1], r: 25.5, az: 38, azEnd: 22, el: 24, fov: 34, shift: 0 },
        { target: [-1.8, 3.8, 0.0], r: 8.8, az: 84, azEnd: 78, el: -1.8, fov: 50, shift: 0 },
        { target: [-0.4, 5.0, 0.8], r: 31.5, az: 30, azEnd: 20, el: 15, fov: 34, shift: 3.1 },
      ],
      mobile: { rScale: 1.06, stage3Shift: 3.2, stage3Lift: 0.3 },
      parallax: 0.55,         // mouse sway (world units)
      parallaxDamping: 3.5,
      idleSway: 0.12,
    },
    scroll: {
      lengthVh: 300,          // pinned scroll distance (vh)
      scrub: 0.9,             // ScrollTrigger scrub smoothing (seconds)
      transition: 0.42,       // fraction of total scroll used by each stage-to-stage morph
      stops: [0.0, 0.5, 1.0], // where tab clicks land (0..1 of the pinned distance)
      stackedStops: [0.06, 0.5, 0.97],
    },
    cutaway: { x: 2.5, steps: [0, 0.4, 0.85, 1.45] },   // struct / decking / underlayment / tiles peel offsets
    explode: { offsets: { deck: 0.6, under: 1.55, flash: 2.5, tile: 3.45, ridge: 4.4, solar: 5.4 } },
    timings: {
      droneOrbitSpeed: 0.3, rotorSpeed: 46, sweepPeriod: 5.5,
      probeDwell: 2.2, probeMove: 1.1, countUp: 1.6, stackedEase: 2.2,
    },
    drone: { scale: 1.7, radius: 10.5, height: 8.6 },
    quality: {
      desktop: { pixelRatio: 1.5, shadow: 1024, particles: 160, tileScale: 1.25, texSize: 128, shrubs: 7, antialias: true },
      mobile:  { pixelRatio: 1.25, shadow: 1024, particles: 90, tileScale: 1.45, texSize: 128, shrubs: 5, antialias: false },
      adaptive: true,        // drop pixel ratio if frames get slow
    },
    hud: {
      titles: ['01 · Drone Roof Scan', '02 · Attic & Leak Check', '03 · Free Photo Report'],
      code: 'CSLB #1096492 · San Diego, CA',
    },
    telemetry: [
      [['On-Site Time', '30 minutes'], ['Photo Binder', '64 photos'], ['Homeowner Cost', '$0 (Included Free)']],
      [['On-Site Time', '30 minutes'], ['Photo Binder', '64 photos'], ['Homeowner Cost', '$0 (Included Free)']],
      [['On-Site Time', '30 minutes'], ['Photo Binder', '64 photos'], ['Homeowner Cost', '$0 (Included Free)']],
    ],
    report: {
      id: '#RU-1096-SD', title: '21-Point Summary', grade: 'GRADE B+',
      metrics: [
        { label: 'SQ FT', value: 2184, decimals: 0 },
        { label: 'PITCH /12', value: 5.4, decimals: 1 },
        { label: 'TILES', value: 2340, decimals: 0 },
      ],
      items: [
        { st: 'fail', tag: 'REPAIR', name: 'Pipe Boot Flashing', note: 'Possible moisture at pipe boot', cost: '$240–380' },
        { st: 'warn', tag: 'ACTION', name: 'Cracked Clay Tiles ×7', note: '7 cracked tiles found', cost: '$310–460' },
        { st: 'warn', tag: 'MONITOR', name: 'Underlayment Seam', note: 'Aged felt · currently dry', cost: '$690–1,140' },
        { st: 'pass', tag: 'PASS', name: 'Roof Deck & Rafters', note: 'Roof deck: dry ✓', cost: '—' },
        { st: 'pass', tag: 'PASS', name: 'Valley Channel Metal', note: 'Valley: clear ✓', cost: '—' },
        { st: 'pass', tag: 'PASS', name: 'Ridge Cap & Vent', note: 'Ridge: sealed ✓', cost: '—' },
      ],
      life: 0.62, lifeLabel: '12–15 YRS LEFT',
      total: { label: 'TARGETED REPAIR RANGE', min: 1240, max: 1980 },
      alt: 'Signed by Luis, C-39 inspector · Zero obligation.',
    },
    links: { download: '/assets/sample-21-point-audit-report.html', schedule: '#estimate' },
  };

  /* ===========================================================================
   * 2. DOM + small utilities
   * ========================================================================= */
  const noop = { destroy() {}, goToStage() {}, config: CONFIG, state: {} };
  if (!root || !root.classList.contains('ru3d')) return noop;
  const $ = (sel, el) => (el || root).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || root).querySelectorAll(sel));
  const dom = {
    pin: $('.ru3d__pin'), tabs: $$('.ru3d-tab'), panels: $$('.ru3d-panel'),
    visual: $('.ru3d-visual'), viewport: $('.ru3d-viewport'), labels: $('.ru3d-labels'),
    hudTitle: $('[data-hud-title]'), hudCode: $('[data-hud-code]'), scanReadout: $('[data-scan-readout]'),
    tele: $$('.ru3d-tele__cell'), report: $('.ru3d-report'), cta3d: $('.ru3d-cta3d'),
  };

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
  const DEG = Math.PI / 180;
  const fmt = new Intl.NumberFormat('en-US');
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Map the scroll value s∈[0,1] to a continuous stage value p∈[0,2] (with "hold" plateaus) + per-stage local progress. */
  function mapScroll(s) {
    const w = CONFIG.scroll.transition, a1 = 1 / 3, a2 = 2 / 3;
    const p = smooth(a1 - w / 2, a1 + w / 2, s) + smooth(a2 - w / 2, a2 + w / 2, s);
    return { p, local: [clamp01(s / a1), clamp01((s - a1) / (a2 - a1)), clamp01((s - a2) / (1 - a2))] };
  }

  /* ===========================================================================
   * 3. Shared runtime state
   * ========================================================================= */
  const state = {
    layout: 'tabs',          // 'pinned' | 'stacked' | 'tabs'
    reduced: deps.external ? false : matchMedia('(prefers-reduced-motion: reduce)').matches,
    s: 0, sTarget: 0, p: 0, local: [0, 0, 0], stage: -1,
    t: 0, mx: 0, my: 0, mxs: 0, mys: 0,
    visible: !deps.external, hostPaused: !!deps.external, running: false, needsRender: true,
    reportOn: false, reportT: 0, probeReading: '',
    threeReady: false, fallback: false,
  };
  const proxy = { s: 0 };   // tweened by ScrollTrigger (scrub-smoothed)
  let scrubTween = null;
  let mm = null;            // gsap.matchMedia context
  const cleanups = [];      // listeners / observers to tear down in destroy()
  let destroyed = false;

  /* ===========================================================================
   * 4. Procedural texture helpers (canvas-generated tileable value noise)
   * ========================================================================= */
  function makeNoise(seed) {
    const rnd = mulberry32(seed);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    return function noise(x, y, px, py) {     // periodic value noise in [0,1]; px/py = period in cells
      px = px || 256; py = py || px;
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const x0 = ((xi % px) + px) % px, y0 = ((yi % py) + py) % py;
      const x1 = (x0 + 1) % px, y1 = (y0 + 1) % py;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const a = perm[perm[x0] + y0], b = perm[perm[x1] + y0], c = perm[perm[x0] + y1], d = perm[perm[x1] + y1];
      return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) / 255;
    };
  }
  const N1 = makeNoise(7), N2 = makeNoise(1337), N3 = makeNoise(42);
  function fbm(n, x, y, oct, px, py) {
    let sum = 0, amp = 0.5, f = 1, norm = 0;
    py = py || px;
    for (let i = 0; i < oct; i++) { sum += amp * n(x * f, y * f, px * f, py * f); norm += amp; amp *= 0.5; f *= 2; }
    return sum / norm;
  }

  /* ===========================================================================
   * 5. Main 3D module (created lazily in idle slices so scroll never stalls)
   * ========================================================================= */
  function yieldToIdle() {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => resolve(), { timeout: 32 });
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  async function create3D() {
    const THREE = deps.THREE || window.THREE;
    const isSmall = matchMedia('(max-width: 767px)').matches;
    const Q = isSmall ? CONFIG.quality.mobile : CONFIG.quality.desktop;
    const C = CONFIG.colors;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const col = (hex) => new THREE.Color(hex);
    const disposables = new Set();    // geometries / materials / textures we own
    const track = (o) => { disposables.add(o); return o; };

    /* ---------- Renderer (transparent so the page dusk sky shows through) ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: Q.antialias, alpha: true, powerPreference: 'high-performance' });
    const gl = renderer.getContext();
    const dbg = gl && gl.getExtension && gl.getExtension('WEBGL_debug_renderer_info');
    const gpuName = String((dbg && gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) || (gl && gl.getParameter(gl.RENDERER)) || '');
    const isSoftware = /SwiftShader|llvmpipe|Software|Basic Render Driver/i.test(gpuName);
    let pixelRatio = isSoftware ? 0.35 : Math.min(window.devicePixelRatio || 1, Q.pixelRatio);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = false;
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0x000000, 0);
    dom.viewport.insertBefore(renderer.domElement, dom.viewport.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 420);

    /* ---------- Canvas texture factory ---------- */
    function toTex(canvas, srgb, repeat) {
      const t = track(new THREE.CanvasTexture(canvas));
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      if (repeat) t.repeat.set(repeat[0], repeat[1]);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    /** Paint a color map pixel by pixel. fn(u,v,out) fills out=[r,g,b,bump]. */
    function genTex(w, h, fn, opts) {
      opts = opts || {};
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); const img = ctx.createImageData(w, h); const d = img.data;
      const out = [0, 0, 0, 0];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          fn(x / w, y / h, out);
          const i = (y * w + x) * 4;
          d[i] = out[0]; d[i + 1] = out[1]; d[i + 2] = out[2]; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      if (opts.post) opts.post(ctx, w, h);
      return { map: toTex(c, true, opts.repeat), bump: null };
    }
    const TS = Q.texSize, TS2 = TS / 2;

    // Stucco: cream base, cloudy trowel mottling + fine sand speckle
    const texStucco = genTex(TS, TS, (u, v, o) => {
      const n1 = fbm(N1, u * 5, v * 5, 4, 5), n2 = fbm(N2, u * 48, v * 48, 3, 48), sp = N3(u * 192, v * 192, 192);
      const k = 0.86 + 0.15 * n1 + 0.05 * (n2 - 0.5) - (sp > 0.86 ? 0.06 : 0);
      o[0] = 239 * k; o[1] = 228 * k; o[2] = 208 * k; o[3] = 255 * (0.55 * n2 + 0.3 * sp + 0.15 * n1);
    }, { bump: true, repeat: [0.42, 0.42] });
    await yieldToIdle();
    if (destroyed) return null;

    // Clay tile: warm off-white streaks (instance colors supply the terracotta hue)
    const texTile = genTex(TS2, TS2, (u, v, o) => {
      const streak = fbm(N1, u * 3, v * 14, 3, 3, 14), sp = N2(u * 64, v * 64, 64);
      const edge = Math.min(v, 1 - v);
      let k = (0.8 + 0.2 * streak + 0.07 * (sp - 0.5)) * (0.8 + 0.2 * smooth(0, 0.14, edge));
      if (sp > 0.9) k *= 0.82;
      o[0] = 255 * k; o[1] = 236 * k; o[2] = 222 * k; o[3] = 255 * (0.35 + 0.4 * sp * streak + 0.25 * streak);
    }, { bump: true });

    // CDX plywood (one 2.44 x 1.22 m sheet) with knots, seams and an APA stamp
    const texPly = genTex(TS, TS2, (u, v, o) => {
      const pn = fbm(N1, u * 4, v * 2, 4, 4, 2);
      const warp = fbm(N2, u * 2, v * 8, 3, 2, 8);
      const grain = Math.sin((v * 46 + warp * 7) * Math.PI) * 0.5 + 0.5;
      const knot = smooth(0.72, 0.84, fbm(N3, u * 6, v * 3, 2, 6, 3));
      let k = 0.76 + 0.2 * pn + 0.07 * grain;
      k *= 1 - 0.38 * knot;
      if (u < 0.004 || u > 0.996 || v < 0.008 || v > 0.992) k *= 0.5;
      o[0] = 206 * k; o[1] = 166 * k; o[2] = 112 * k; o[3] = 255 * (0.5 * grain + 0.5 * pn);
    }, {
      bump: true, repeat: [1 / 2.44, 1 / 1.22],
      post: (ctx, w, h) => {
        ctx.fillStyle = 'rgba(70, 40, 110, 0.32)'; ctx.font = `700 ${Math.round(h * 0.06)}px monospace`;
        ctx.fillText('APA  RATED SHEATHING  32/16', w * 0.3, h * 0.5);
        ctx.fillText('15/32 INCH  CDX  EXPOSURE 1', w * 0.3, h * 0.58);
      },
    });
    await yieldToIdle();
    if (destroyed) return null;

    // Lumber (rafters / joists)
    const texWood = genTex(TS2, TS2, (u, v, o) => {
      const warp = fbm(N2, u * 3, v * 3, 3, 3);
      const grain = Math.sin((v * 22 + warp * 5) * Math.PI) * 0.5 + 0.5;
      const k = 0.78 + 0.14 * grain + 0.08 * fbm(N1, u * 8, v * 8, 2, 8);
      o[0] = 214 * k; o[1] = 178 * k; o[2] = 126 * k; o[3] = 255 * grain;
    }, { bump: true });

    // Underlayment: charcoal synthetic with printed lap lines (1 course ≈ 0.9 m)
    const texFelt = genTex(TS2, TS2, (u, v, o) => {
      const fib = fbm(N1, u * 32, v * 32, 3, 32), lo = fbm(N2, u * 4, v * 4, 3, 4);
      let k = 40 + 26 * fib + 14 * lo;
      if (v > 0.04 && v < 0.055) k = 120;
      if (v > 0.09 && v < 0.098 && (u * 24) % 1 < 0.6) k = 150;
      o[0] = k; o[1] = k * 1.04; o[2] = k * 1.1; o[3] = 255 * fib;
    }, { bump: true, repeat: [1 / 2.2, 1 / 0.9] });

    // Fiberglass insulation batts
    const texInsul = genTex(TS2, TS2, (u, v, o) => {
      const n = fbm(N1, u * 10, v * 10, 4, 10), f = N2(u * 80, v * 80, 80);
      const k = 0.75 + 0.25 * n;
      o[0] = 236 * k; o[1] = 206 * k; o[2] = 132 * k + 10 * f; o[3] = 255 * (0.6 * n + 0.4 * f);
    }, { bump: true, repeat: [0.5, 0.5] });
    await yieldToIdle();
    if (destroyed) return null;

    // Solar cells (10 x 6 cell landscape panel)
    const texSolar = (() => {
      const c = document.createElement('canvas'); c.width = 320; c.height = 192;
      const g = c.getContext('2d');
      g.fillStyle = '#cfd6e0'; g.fillRect(0, 0, 320, 192);
      const cw = 320 / 10, ch = 192 / 6;
      for (let i = 0; i < 10; i++) for (let j = 0; j < 6; j++) {
        const gr = g.createLinearGradient(i * cw, j * ch, (i + 1) * cw, (j + 1) * ch);
        gr.addColorStop(0, '#16305e'); gr.addColorStop(1, '#0a1a3a');
        g.fillStyle = gr; g.fillRect(i * cw + 1.5, j * ch + 1.5, cw - 3, ch - 3);
        g.fillStyle = 'rgba(190, 205, 225, 0.55)';
        g.fillRect(i * cw + cw * 0.33, j * ch + 1.5, 1, ch - 3); g.fillRect(i * cw + cw * 0.66, j * ch + 1.5, 1, ch - 3);
      }
      return toTex(c, true);
    })();

    // Radial glow sprite (cheap "bloom")
    const texGlow = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,0.65)');
      gr.addColorStop(0.5, 'rgba(255,255,255,0.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      const t = toTex(c, true); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
    })();

    /* ---------- FLIR thermal patch (injected into every scene material) ---------- */
    const TH = {
      uThermal: { value: 0 }, uThTime: { value: 0 },
      uHot: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
      uHotR: { value: [0.75, 0.6, 0.85] },
    };
    const TH_HEAD = /* glsl */`
      uniform float uThermal; uniform float uThermBase; uniform float uThTime;
      uniform vec4 uHot[3]; uniform float uHotR[3];
      varying vec3 vThWP;
      float thNoise(vec3 x){
        return sin(dot(x, vec3(1.7, 2.3, 1.9))) * cos(dot(x, vec3(3.1, -1.3, 2.7))) * 0.5 + 0.5;
      }
      vec3 thRamp(float t){            // Brand palette: deep navy -> ocean blue -> sky blue -> brand gold/yellow -> warm white
        t = clamp(t, 0.0, 1.0);
        vec3 c0 = vec3(0.02,0.06,0.11), c1 = vec3(0.04,0.15,0.28), c2 = vec3(0.11,0.38,0.62),
             c3 = vec3(0.18,0.61,0.91), c4 = vec3(0.43,0.78,1.00), c5 = vec3(1.0,0.78,0.00), c6 = vec3(1.0,0.98,0.90);
        if (t < 0.16) return mix(c0, c1, t / 0.16);
        if (t < 0.34) return mix(c1, c2, (t - 0.16) / 0.18);
        if (t < 0.52) return mix(c2, c3, (t - 0.34) / 0.18);
        if (t < 0.70) return mix(c3, c4, (t - 0.52) / 0.18);
        if (t < 0.86) return mix(c4, c5, (t - 0.70) / 0.16);
        return mix(c5, c6, (t - 0.86) / 0.14);
      }
    `;
    const TH_BODY = /* glsl */`
      if (uThermal > 0.001) {
        float th = uThermBase + (vThWP.y - 3.0) * 0.07;                 // heat rises in the attic
        th += (thNoise(vThWP * 1.6) - 0.5) * 0.12 + (thNoise(vThWP * 7.0) - 0.5) * 0.035;
        vec3 d0 = vThWP - uHot[0].xyz; th += uHot[0].w * exp(-dot(d0, d0) / (uHotR[0] * uHotR[0]));
        vec3 d1 = vThWP - uHot[1].xyz; th += uHot[1].w * exp(-dot(d1, d1) / (uHotR[1] * uHotR[1]));
        vec3 d2 = vThWP - uHot[2].xyz; th += uHot[2].w * exp(-dot(d2, d2) / (uHotR[2] * uHotR[2]));
        vec3 tc = thRamp(th);
        float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
        tc *= 0.74 + 0.4 * clamp(lum * 1.7, 0.0, 1.0);                   // keep some form shading
        float sy = 2.4 + mod(uThTime * 0.85, 3.4);
        tc += vec3(0.55, 0.85, 1.0) * exp(-pow((vThWP.y - sy) * 9.0, 2.0)) * 0.55;   // sweeping scan line
        tc *= 0.93 + 0.07 * sin(gl_FragCoord.y * 1.35);                   // sensor line texture
        gl_FragColor.rgb = mix(gl_FragColor.rgb, tc, uThermal);
      }
    `;
    /** Patch a built-in material so it can morph into the thermal heat-map view. `base` = intrinsic heat 0..1 */
    function thermalize(mat, base) {
      mat.userData.thermBase = { value: base };
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uThermal = TH.uThermal; sh.uniforms.uThTime = TH.uThTime;
        sh.uniforms.uHot = TH.uHot; sh.uniforms.uHotR = TH.uHotR;
        sh.uniforms.uThermBase = mat.userData.thermBase;
        sh.vertexShader = 'varying vec3 vThWP;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
          vec4 thwp = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            thwp = instanceMatrix * thwp;
          #endif
          vThWP = (modelMatrix * thwp).xyz;`);
        sh.fragmentShader = TH_HEAD + sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n' + TH_BODY);
      };
      mat.customProgramCacheKey = () => 'ru3d-thermal';
      return mat;
    }
    const std = (params, heat) => track(thermalize(new THREE.MeshStandardMaterial(params), heat));

    /* ---------- Materials (PBR + thermal patch; number = intrinsic heat for the FLIR view) ---------- */
    const DS = THREE.DoubleSide;
    texInsul.map.repeat.set(10, 7);
    const M = {
      stucco: std({ color: C.stucco, map: texStucco.map, roughness: 0.93 }, 0.36),
      trim: std({ color: C.trim, roughness: 0.6 }, 0.38),
      glass: std({ color: C.glass, roughness: 0.06, metalness: 0.15, emissive: col(C.windowGlow), emissiveIntensity: 0.35 }, 0.24),
      door: std({ color: C.door, map: texWood.map, roughness: 0.55 }, 0.3),
      wood: std({ color: '#ffffff', map: texWood.map, roughness: 0.78 }, 0.42),
      insul: std({ color: '#ffffff', map: texInsul.map, roughness: 1 }, 0.26),
      drywall: std({ color: '#d9d4cb', roughness: 0.95 }, 0.3),
      ventDark: std({ color: '#1b1f25', roughness: 0.8 }, 0.32),
      metalDark: std({ color: '#2f343b', roughness: 0.45, metalness: 0.6 }, 0.5),
      deck: std({ color: '#ffffff', map: texPly.map, roughness: 0.82 }, 0.5),
      under: std({ color: '#ffffff', map: texFelt.map, roughness: 0.66 }, 0.58),
      tile: std({ color: '#ffffff', map: texTile.map, roughness: 0.92, side: DS }, 0.64),
      ventClay: std({ color: '#a24c2c', map: texTile.map, roughness: 0.85 }, 0.66),
      mortar: std({ color: '#ddd3c3', map: texStucco.map, roughness: 0.95 }, 0.6),
      flash: std({ color: '#bcc5ce', roughness: 0.3, metalness: 0.92 }, 0.74),
      lead: std({ color: '#7d858d', roughness: 0.6, metalness: 0.55, side: DS }, 0.7),
      solar: std({ color: '#ffffff', map: texSolar, roughness: 0.14, metalness: 0.25 }, 0.8),
      alu: std({ color: '#c8ced6', roughness: 0.35, metalness: 0.95 }, 0.7),
    };
    const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
    /**
     * ExtrudeGeometry options. NOTE: we enable a *zero-size* single-segment bevel instead of
     * `bevelEnabled: false` — some three builds (incl. the r175 copy in this repo) emit no front/back
     * cap faces when bevels are disabled, which made walls and roof slabs render hollow.
     */
    const extrudeOpts = (depth, curveSegments) => ({ depth, curveSegments: curveSegments || 6, bevelEnabled: true, bevelThickness: 0, bevelSize: 0, bevelOffset: 0, bevelSegments: 1 });
    const cylGeo = track(new THREE.CylinderGeometry(1, 1, 1, 10));
    /** quick mesh helper: unit geometry scaled to `size`, positioned, added to `parent`. */
    function mesh(parent, geo, mat, size, pos, opts) {
      const m = new THREE.Mesh(geo, mat);
      if (size) m.scale.set(size[0], size[1], size[2]);
      if (pos) m.position.set(pos[0], pos[1], pos[2]);
      if (opts && opts.quat) m.quaternion.copy(opts.quat);
      parent.add(m); return m;
    }

    /* ---------- House geometry (derived from CONFIG.house) ---------- */
    const Hc = CONFIG.house, s = Hc.pitch, NS = Math.sqrt(1 + s * s);
    const halfL = Hc.length / 2, halfD = Hc.depth / 2, wallH = Hc.wallH;
    const Hr = wallH + halfD * s;                       // main ridge height
    const xc = Hc.wing.xc, hw = Hc.wing.halfWidth, wingF = Hc.wing.front;
    const Hw = wallH + hw * s;                          // wing ridge height
    const K = (Hr - Hw) / s;                            // z where the wing ridge meets the main slope
    const eave = halfD + Hc.eaveOverhang;
    const wingExt = hw + Hc.eaveOverhang;
    const roofL = Hc.length + 2 * Hc.gableOverhang;
    const wingRoofF = wingF + Hc.gableOverhang;
    const yEave = wallH - Hc.eaveOverhang * s;

    /** Approximate top-of-deck height at (x,z), or -1 when there is no roof there. */
    function roofTop(x, z) {
      let y = -1;
      if (Math.abs(x) <= roofL / 2 && Math.abs(z) <= eave) y = Hr - Math.abs(z) * s;
      const dx = Math.abs(x - xc);
      if (dx <= wingExt && z >= 0 && z <= wingRoofF) y = Math.max(y, Hw - dx * s);
      return y;
    }
    /** A roof plane: P(u,v,h) = origin + ridgeDir*u + vDir*v (down-slope) + n*h (outward). */
    function makeSlope(origin, ridgeDir, vDir, uLen, vLen) {
      vDir = vDir.clone().normalize(); ridgeDir = ridgeDir.clone().normalize();
      const n = new THREE.Vector3().crossVectors(vDir, ridgeDir).normalize();
      if (n.y < 0) n.negate();
      const tx = new THREE.Vector3().crossVectors(n, vDir).normalize();     // right-handed tile basis (tx, n, vDir)
      const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(tx, n, vDir));
      return {
        origin, ridgeDir, vDir, n, quat, uLen, vLen,
        P(u, v, h, out) { return (out || new THREE.Vector3()).copy(origin).addScaledVector(ridgeDir, u).addScaledVector(vDir, v).addScaledVector(n, h); },
      };
    }
    const vMain = eave * NS, vWing = wingExt * NS;
    const slopes = {
      mainF: makeSlope(V3(-roofL / 2, Hr, 0), V3(1, 0, 0), V3(0, -s, 1), roofL, vMain),
      mainB: makeSlope(V3(-roofL / 2, Hr, 0), V3(1, 0, 0), V3(0, -s, -1), roofL, vMain),
      wingL: makeSlope(V3(xc, Hw, 0), V3(0, 0, 1), V3(-1, -s, 0), wingRoofF, vWing),
      wingR: makeSlope(V3(xc, Hw, 0), V3(0, 0, 1), V3(1, -s, 0), wingRoofF, vWing),
    };
    const uA = xc + roofL / 2;
    const POLY = {
      main: [[0, 0.06], [roofL, 0.06], [roofL, vMain], [0, vMain]],                    // 6cm ridge-vent slot at top
      mainVis: [[0, 0], [roofL, 0], [roofL, vMain], [uA + wingExt, vMain], [uA, K * NS], [uA - wingExt, vMain], [0, vMain]],
      mainFull: [[0, 0], [roofL, 0], [roofL, vMain], [0, vMain]],
      wing: [[K, 0.06], [wingRoofF, 0.06], [wingRoofF, vWing], [K + wingExt, vWing]],   // trimmed exactly at the valleys
    };
    /** Build a slab (extruded polygon) lying in a roof plane. Top surface sits at normal offset `hTop`. */
    function slabGeo(slope, pts, thick, hTop) {
      const yAxis = slope.vDir.clone();
      const m = new THREE.Matrix4().makeBasis(slope.ridgeDir, yAxis, slope.n);
      let flip = 1;
      if (m.determinant() < 0) { flip = -1; yAxis.negate(); m.makeBasis(slope.ridgeDir, yAxis, slope.n); }
      const sh = new THREE.Shape();
      pts.forEach(([u, v], i) => (i ? sh.lineTo(u, v * flip) : sh.moveTo(u, v * flip)));
      const geo = thick > 0 ? new THREE.ExtrudeGeometry(sh, extrudeOpts(thick)) : new THREE.ShapeGeometry(sh);
      m.setPosition(slope.origin.clone().addScaledVector(slope.n, hTop - thick));
      geo.applyMatrix4(m);
      return track(geo);
    }

    /* ---------- Scene graph: house layer groups (explode + per-layer clipping) ---------- */
    const houseG = new THREE.Group(); scene.add(houseG);
    const G = {};
    ['struct', 'deck', 'under', 'flash', 'tile', 'ridge', 'solar'].forEach((k) => { G[k] = new THREE.Group(); G[k].name = k; houseG.add(G[k]); });
    const occluders = [];       // simple meshes used for label occlusion raycasts
    const winGlowMat = track(new THREE.SpriteMaterial({ map: texGlow, color: col(C.windowGlow), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    const _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(1, 1, 1), _m = new THREE.Matrix4(), _c = new THREE.Color();

    // ---- Walls with real window/door openings (extruded stucco shapes with holes) ----
    const WALL_T = 0.18;
    function holeShape(x, y, w, h, arch) {
      const p = new THREE.Shape();
      p.moveTo(x, y); p.lineTo(x + w, y);
      if (arch) { p.lineTo(x + w, y + h - w / 2); p.absarc(x + w / 2, y + h - w / 2, w / 2, 0, Math.PI, false); }
      else { p.lineTo(x + w, y + h); p.lineTo(x, y + h); }
      p.lineTo(x, y);
      return p;
    }
    function wall(spec) {
      const h = wallH, w = spec.w, rise = spec.rise || 0, holes = spec.holes || [];
      const sh = new THREE.Shape();
      sh.moveTo(0, 0); sh.lineTo(w, 0); sh.lineTo(w, h);
      if (rise) sh.lineTo(w / 2, h + rise);
      sh.lineTo(0, h); sh.lineTo(0, 0);
      holes.forEach((o) => sh.holes.push(holeShape(o.x, o.y, o.w, o.h, o.arch)));
      const g = new THREE.Group();
      g.position.set(spec.pos[0], spec.pos[1], spec.pos[2]); g.rotation.y = spec.rotY;
      const wm = new THREE.Mesh(track(new THREE.ExtrudeGeometry(sh, extrudeOpts(WALL_T, 10))), M.stucco);
      wm.castShadow = wm.receiveShadow = true; g.add(wm); occluders.push(wm);
      holes.forEach((o) => {
        const inner = holeShape(o.x, o.y, o.w, o.h, o.arch);
        if (o.kind === 'vent') {                         // gable attic vent with louvers
          const back = new THREE.Mesh(track(new THREE.ShapeGeometry(inner)), M.ventDark); back.position.z = WALL_T * 0.3; g.add(back);
          for (let k = 0; k < 4; k++) mesh(g, boxGeo, M.trim, [o.w, 0.035, 0.06], [o.x + o.w / 2, o.y + 0.08 + k * (o.h - 0.1) / 4, WALL_T * 0.6]);
          return;
        }
        const isDoor = o.kind === 'door';
        const pane = new THREE.Mesh(track(new THREE.ShapeGeometry(inner, 10)), isDoor ? M.door : M.glass);
        pane.position.z = WALL_T * 0.45; g.add(pane);
        const fo = 0.08;
        const outer = holeShape(o.x - fo, isDoor ? o.y : o.y - fo, o.w + 2 * fo, isDoor ? o.h + fo : o.h + 2 * fo, o.arch);
        outer.holes.push(holeShape(o.x, o.y, o.w, o.h, o.arch));
        const frame = new THREE.Mesh(track(new THREE.ExtrudeGeometry(outer, extrudeOpts(0.05, 10))), M.trim);
        frame.position.z = WALL_T - 0.01; frame.castShadow = true; g.add(frame);
        if (!isDoor) {
          mesh(g, boxGeo, M.trim, [0.045, o.h - 0.05, 0.04], [o.x + o.w / 2, o.y + o.h / 2, WALL_T * 0.5]);
          mesh(g, boxGeo, M.trim, [o.w + 0.3, 0.06, 0.16], [o.x + o.w / 2, o.y - 0.08, WALL_T + 0.05]);
          const glow = new THREE.Sprite(winGlowMat);
          glow.position.set(o.x + o.w / 2, o.y + o.h / 2, WALL_T + 0.35); glow.scale.set(o.w * 2.4, o.h * 1.9, 1);
          g.add(glow);
        }
      });
      G.struct.add(g);
      return g;
    }
    const L = Hc.length, D = Hc.depth, wy = 1.0, wh = 1.25;
    wall({ w: L, pos: [-halfL, 0, halfD - WALL_T], rotY: 0, holes: [
      { x: 6.55, y: 0.04, w: 0.95, h: 2.3, arch: true, kind: 'door' },
      { x: 8.5, y: wy, w: 1.4, h: 1.4, arch: true }, { x: 10.4, y: wy, w: 1.2, h: wh }] });
    wall({ w: L, pos: [halfL, 0, -halfD + WALL_T], rotY: Math.PI, holes: [
      { x: 1.5, y: wy, w: 1.4, h: wh }, { x: 5.3, y: wy, w: 1.4, h: wh }, { x: 9.0, y: wy, w: 1.4, h: wh }] });
    wall({ w: D, rise: Hr - wallH, pos: [halfL - WALL_T, 0, halfD], rotY: Math.PI / 2, holes: [
      { x: 1.0, y: wy, w: 1.4, h: wh }, { x: 5.6, y: wy, w: 1.4, h: wh }, { x: D / 2 - 0.35, y: 3.45, w: 0.7, h: 0.6, kind: 'vent' }] });
    wall({ w: D, rise: Hr - wallH, pos: [-halfL + WALL_T, 0, -halfD], rotY: -Math.PI / 2, holes: [
      { x: 3.3, y: wy, w: 1.4, h: wh }, { x: D / 2 - 0.35, y: 3.45, w: 0.7, h: 0.6, kind: 'vent' }] });
    wall({ w: 2 * hw, rise: Hw - wallH, pos: [xc - hw, 0, wingF - WALL_T], rotY: 0, holes: [
      { x: hw - 0.8, y: 0.85, w: 1.6, h: 1.8, arch: true }, { x: hw - 0.25, y: 3.25, w: 0.5, h: 0.4, kind: 'vent' }] });
    wall({ w: wingF - halfD, pos: [xc - hw + WALL_T, 0, halfD], rotY: -Math.PI / 2, holes: [{ x: 1.0, y: wy, w: 1.4, h: wh }] });
    wall({ w: wingF - halfD, pos: [xc + hw - WALL_T, 0, wingF], rotY: Math.PI / 2, holes: [{ x: 1.0, y: wy, w: 1.4, h: wh }] });

    // ---- Attic interior: ceiling, insulation, joists, rafters, ridge board, collar ties ----
    const atticG = new THREE.Group(); G.struct.add(atticG);
    mesh(atticG, boxGeo, M.drywall, [L - 0.2, 0.03, D - 0.2], [0, wallH - 0.02, 0]);
    mesh(atticG, boxGeo, M.insul, [L - 0.3, 0.12, D - 0.3], [0, wallH + 0.06, 0]);
    mesh(atticG, boxGeo, M.drywall, [2 * hw - 0.3, 0.03, wingF - halfD], [xc, wallH - 0.02, (wingF + halfD) / 2]);
    mesh(atticG, boxGeo, M.insul, [2 * hw - 0.4, 0.12, wingF - halfD - 0.2], [xc, wallH + 0.06, (wingF + halfD) / 2]);
    const rafterMs = [], joistMs = [], tieMs = [];
    const xsMain = []; for (let x = -halfL + 0.15; x <= halfL - 0.1; x += 0.6) xsMain.push(x);
    function addRafters(slope, us, v0, v1) {
      us.forEach((u) => { slope.P(u, (v0 + v1) / 2, -0.06 - 0.085, _p); _m.compose(_p, slope.quat, _s.set(0.05, 0.17, v1 - v0)); rafterMs.push(_m.clone()); });
    }
    addRafters(slopes.mainF, xsMain.map((x) => x + roofL / 2), 0.06, vMain);
    addRafters(slopes.mainB, xsMain.map((x) => x + roofL / 2), 0.06, vMain);
    const zsWing = []; for (let z = halfD + 0.3; z <= wingF - 0.05; z += 0.6) zsWing.push(z);
    addRafters(slopes.wingL, zsWing, 0.06, vWing); addRafters(slopes.wingR, zsWing, 0.06, vWing);
    const tieY = 3.95, tieLen = 2 * ((Hr - 0.25 - tieY) / s);
    xsMain.forEach((x, i) => {
      _m.compose(_p.set(x, wallH + 0.07, 0), _q.identity(), _s.set(0.05, 0.14, D - 0.2)); joistMs.push(_m.clone());
      if (i % 2 === 0) { _m.compose(_p.set(x + 0.05, tieY, 0), _q.identity(), _s.set(0.04, 0.12, tieLen)); tieMs.push(_m.clone()); }
    });
    _m.compose(_p.set(0, Hr - 0.2, 0), _q.identity(), _s.set(L, 0.24, 0.045)); rafterMs.push(_m.clone()); // ridge board
    _s.set(1, 1, 1);
    function instancedFromMatrices(list, mat, parent) {
      const im = new THREE.InstancedMesh(boxGeo, mat, list.length);
      list.forEach((mm, i) => im.setMatrixAt(i, mm));
      im.instanceMatrix.needsUpdate = true; im.frustumCulled = false;
      parent.add(im); return im;
    }
    instancedFromMatrices(rafterMs, M.wood, atticG);
    instancedFromMatrices(joistMs, M.wood, atticG);
    instancedFromMatrices(tieMs, M.wood, atticG);

    // ---- Chimney + plumbing vent pipe ----
    const ch = Hc.chimney;
    const chim = mesh(G.struct, boxGeo, M.stucco, [0.9, 3.9, 0.9], [ch.x, 2.6 + 1.95, ch.z]); occluders.push(chim);
    mesh(G.struct, boxGeo, M.trim, [1.1, 0.12, 1.1], [ch.x, 6.56, ch.z]);
    mesh(G.struct, cylGeo, M.metalDark, [0.12, 0.45, 0.12], [ch.x, 6.85, ch.z]);
    mesh(G.struct, boxGeo, M.metalDark, [0.42, 0.03, 0.42], [ch.x, 7.1, ch.z]);
    const pb = Hc.pipeBoot, pipeTop = roofTop(pb.x, pb.z) + 0.6;
    mesh(G.struct, cylGeo, M.metalDark, [0.055, pipeTop - (wallH + 0.12), 0.055], [pb.x, (pipeTop + wallH + 0.12) / 2, pb.z]);

    // ---- Fascia, rake boards, soffits (+ soffit intake vents) ----
    const fasciaY = yEave - 0.1;
    const frontSegs = [[-roofL / 2, xc - wingExt], [xc + wingExt, roofL / 2]];
    mesh(G.struct, boxGeo, M.trim, [roofL, 0.22, 0.06], [0, fasciaY, -eave]);
    frontSegs.forEach(([a, b]) => mesh(G.struct, boxGeo, M.trim, [b - a, 0.22, 0.06], [(a + b) / 2, fasciaY, eave]));
    const wl = wingRoofF - eave;
    [-1, 1].forEach((sg) => mesh(G.struct, boxGeo, M.trim, [0.06, 0.22, wl], [xc + sg * wingExt, fasciaY, eave + wl / 2]));
    function rake(slope, u) { slope.P(u, slope.vLen / 2, 0.0, _p); mesh(G.struct, boxGeo, M.trim, [0.07, 0.24, slope.vLen], [_p.x, _p.y, _p.z], { quat: slope.quat }); }
    rake(slopes.mainF, 0.035); rake(slopes.mainF, roofL - 0.035); rake(slopes.mainB, 0.035); rake(slopes.mainB, roofL - 0.035);
    rake(slopes.wingL, wingRoofF - 0.035); rake(slopes.wingR, wingRoofF - 0.035);
    const soffY = yEave - 0.2, soffW = eave - halfD;
    mesh(G.struct, boxGeo, M.trim, [roofL, 0.03, soffW], [0, soffY, -(halfD + eave) / 2]);
    mesh(G.struct, boxGeo, M.ventDark, [roofL - 1, 0.035, 0.12], [0, soffY - 0.005, -(halfD + eave) / 2]);
    frontSegs.forEach(([a, b]) => {
      mesh(G.struct, boxGeo, M.trim, [b - a, 0.03, soffW], [(a + b) / 2, soffY, (halfD + eave) / 2]);
      mesh(G.struct, boxGeo, M.ventDark, [(b - a) * 0.85, 0.035, 0.12], [(a + b) / 2, soffY - 0.005, (halfD + eave) / 2]);
    });
    [-1, 1].forEach((sg) => mesh(G.struct, boxGeo, M.trim, [soffW, 0.03, wingF - halfD], [xc + sg * (hw + soffW / 2), soffY, (wingF + halfD) / 2]));

    // ---- Decking (CDX) + underlayment slabs ----
    const slabSet = [[slopes.mainF, POLY.main], [slopes.mainB, POLY.main], [slopes.wingL, POLY.wing], [slopes.wingR, POLY.wing]];
    const edgeMat = track(new THREE.LineBasicMaterial({ color: col(C.sky), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const edgeLines = [];
    const addEdge = (parent, geo) => { const ln = new THREE.LineSegments(track(new THREE.EdgesGeometry(geo, 20)), edgeMat); parent.add(ln); edgeLines.push(ln); };
    slabSet.forEach(([sl, poly]) => {
      const geo = slabGeo(sl, poly, 0.06, 0);
      const dm = new THREE.Mesh(geo, M.deck); G.deck.add(dm); occluders.push(dm);
      addEdge(G.deck, geo);
      const ug = slabGeo(sl, poly, 0.012, 0.016);
      const um = new THREE.Mesh(ug, M.under); G.under.add(um);
      addEdge(G.under, ug);
    });

    // ---- Clay barrel tiles (two InstancedMeshes: pans + caps) ----
    const q = Q.tileScale;
    function tileGeo(r, len, cap) {
      const g = new THREE.CylinderGeometry(r, r * 0.9, len, 5, 1, true, cap ? Math.PI / 2 : -Math.PI / 2, Math.PI);
      g.rotateX(Math.PI / 2);               // axis → local Z (down-slope); taper: nose wider than head
      g.translate(0, cap ? 0 : r, 0);       // pans: trough bottom at 0, caps: rims at 0
      return track(g);
    }
    const panGeo = tileGeo(0.135 * q, 0.44 * q, false), capGeo = tileGeo(0.125 * q, 0.44 * q, true), ridgeGeo = tileGeo(0.19, 0.46, true);
    const tilePal = C.tiles.map(col);
    const rnd = mulberry32(2024);
    const pans = [], caps = [];
    const underWing = (x, z) => { const dx = Math.abs(x - xc); return z > 0 && dx < wingExt + 0.05 && z > dx + K - 0.2; };
    const insideMain = (x, z) => z < Math.abs(x - xc) + K + 0.14;
    const nearChimney = (x, z) => Math.abs(x - ch.x) < 0.6 && Math.abs(z - ch.z) < 0.6;
    const nearPipe = (x, z) => Math.hypot(x - pb.x, z - pb.z) < 0.2;
    function layTiles(slope, cull) {
      const cs = 0.3 * q, vs = 0.34 * q;
      const nC = Math.floor(slope.uLen / cs), nV = Math.floor((slope.vLen - 0.2) / vs);
      for (let j = 0; j < nV; j++) {
        const v = 0.2 + vs * (j + 0.5);
        for (let i = 0; i < nC; i++) for (let k = 0; k < 2; k++) {
          const u = cs * (i + 0.5) + k * cs * 0.5;
          if (u > slope.uLen - 0.1 || u < 0.08) continue;
          slope.P(u, v, k ? 0.11 * q : 0.02, _p);
          if (cull && cull(_p.x, _p.z)) continue;
          _e.set(-0.075 + (rnd() - 0.5) * 0.03, (rnd() - 0.5) * 0.05, (rnd() - 0.5) * 0.05);
          _q.setFromEuler(_e).premultiply(slope.quat);
          _m.compose(_p, _q, _s);
          _c.copy(tilePal[Math.floor(rnd() * tilePal.length)]).offsetHSL((rnd() - 0.5) * 0.02, (rnd() - 0.5) * 0.08, (rnd() - 0.5) * 0.07);
          _c.multiplyScalar(1 - (v / slope.vLen) * 0.12);           // a little eave weathering
          if (rnd() < 0.035) _c.offsetHSL(0, 0.05, 0.08);             // occasional replacement tile
          (k ? caps : pans).push({ m: _m.clone(), c: _c.clone() });
        }
      }
    }
    layTiles(slopes.mainF, (x, z) => underWing(x, z) || nearPipe(x, z));
    layTiles(slopes.mainB, (x, z) => nearChimney(x, z));
    layTiles(slopes.wingL, (x, z) => insideMain(x, z));
    layTiles(slopes.wingR, (x, z) => insideMain(x, z));
    function instancedTiles(geo, list, parent) {
      const im = new THREE.InstancedMesh(geo, M.tile, list.length);
      list.forEach((it, i) => { im.setMatrixAt(i, it.m); im.setColorAt(i, it.c); });
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false;
      parent.add(im); return im;
    }
    instancedTiles(panGeo, pans, G.tile);
    instancedTiles(capGeo, caps, G.tile);
    const tileCount = pans.length + caps.length;
    // holographic outline for the tile layer (used in the exploded view)
    [[slopes.mainF, POLY.mainVis], [slopes.mainB, POLY.mainFull], [slopes.wingL, POLY.wing], [slopes.wingR, POLY.wing]].forEach(([sl, poly]) => {
      addEdge(G.tile, slabGeo(sl, poly, 0, 0.3));
    });
    // Roof vents (low-profile clay "O'Hagin" style)
    function roofVent(slope, x, z) {
      const u = x + roofL / 2, v = Math.abs(z) * NS;
      slope.P(u, v, 0.26, _p); mesh(G.tile, boxGeo, M.ventClay, [0.46, 0.14, 0.5], [_p.x, _p.y, _p.z], { quat: slope.quat });
      slope.P(u, v + 0.05, 0.36, _p); mesh(G.tile, boxGeo, M.ventClay, [0.36, 0.08, 0.3], [_p.x, _p.y, _p.z], { quat: slope.quat });
    }
    roofVent(slopes.mainB, 1.4, -2.6); roofVent(slopes.mainB, -1.3, -3.1); roofVent(slopes.mainF, 0.45, 1.9);

    // ---- Ridge caps on mortar bed, with a ridge vent strip underneath ----
    const ridgeList = [];
    const qMainRidge = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(0, 0, -1), V3(0, 1, 0), V3(1, 0, 0)));
    for (let x = -roofL / 2 + 0.22; x <= roofL / 2 - 0.2; x += 0.4) {
      _q.setFromEuler(_e.set(-0.06, (rnd() - 0.5) * 0.03, 0)).premultiply(qMainRidge);
      _m.compose(_p.set(x, Hr + 0.13, 0), _q, _s); _c.copy(tilePal[Math.floor(rnd() * tilePal.length)]).multiplyScalar(0.92);
      ridgeList.push({ m: _m.clone(), c: _c.clone() });
    }
    for (let z = K + 0.1; z <= wingRoofF - 0.2; z += 0.4) {
      _q.setFromEuler(_e.set(-0.06, (rnd() - 0.5) * 0.03, 0));
      _m.compose(_p.set(xc, Hw + 0.13, z), _q, _s); _c.copy(tilePal[Math.floor(rnd() * tilePal.length)]).multiplyScalar(0.92);
      ridgeList.push({ m: _m.clone(), c: _c.clone() });
    }
    instancedTiles(ridgeGeo, ridgeList, G.ridge);
    mesh(G.ridge, boxGeo, M.mortar, [roofL - 0.1, 0.1, 0.34], [0, Hr + 0.1, 0]);
    mesh(G.ridge, boxGeo, M.ventDark, [roofL - 0.8, 0.06, 0.24], [0, Hr + 0.03, 0]);
    mesh(G.ridge, boxGeo, M.mortar, [0.34, 0.1, wingRoofF - K], [xc, Hw + 0.1, (K + wingRoofF) / 2]);

    // ---- Flashing: W-valley metal, pipe boot, chimney collar, drip edge ----
    function valley(sign) {
      const A = V3(xc + sign * wingExt, yEave, eave), B = V3(xc, Hw, K);
      const dir = B.clone().sub(A); const len = dir.length(); dir.normalize();
      const ny = slopes.mainF.n.clone().add(sign > 0 ? slopes.wingR.n : slopes.wingL.n).normalize();
      const nx = new THREE.Vector3().crossVectors(ny, dir).normalize(); ny.crossVectors(dir, nx).normalize();
      const vq = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(nx, ny, dir));
      const mid = A.clone().add(B).multiplyScalar(0.5).addScaledVector(ny, 0.05);
      mesh(G.flash, boxGeo, M.flash, [0.5, 0.014, len], [mid.x, mid.y, mid.z], { quat: vq });
      mesh(G.flash, boxGeo, M.flash, [0.035, 0.06, len], [mid.x + ny.x * 0.02, mid.y + ny.y * 0.02, mid.z + ny.z * 0.02], { quat: vq });
      return { A, B, mid, ny };
    }
    const valleyR = valley(1), valleyL = valley(-1);
    slopes.mainF.P(pb.x + roofL / 2, pb.z * NS, 0.27, _p);
    mesh(G.flash, boxGeo, M.lead, [0.6, 0.016, 0.66], [_p.x, _p.y, _p.z], { quat: slopes.mainF.quat });
    const bootCone = new THREE.Mesh(track(new THREE.CylinderGeometry(0.075, 0.17, 0.26, 12, 1, true)), M.lead);
    bootCone.position.set(pb.x, _p.y + 0.12, pb.z); G.flash.add(bootCone);
    slopes.mainB.P(ch.x + roofL / 2, Math.abs(ch.z) * NS, 0.27, _p);
    mesh(G.flash, boxGeo, M.flash, [1.12, 0.05, 1.12], [_p.x, _p.y, _p.z], { quat: slopes.mainB.quat });
    mesh(G.flash, boxGeo, M.flash, [roofL, 0.03, 0.05], [0, yEave + 0.01, -eave - 0.03]);
    frontSegs.forEach(([a, b]) => mesh(G.flash, boxGeo, M.flash, [b - a, 0.03, 0.05], [(a + b) / 2, yEave + 0.01, eave + 0.03]));

    // ---- Solar array (2 x 2 landscape panels on rails + flashed standoffs) ----
    const panelGeo = track(new THREE.BoxGeometry(1.68, 0.045, 1.0));
    const sx0 = 2.0, sv0 = 0.7;
    for (let row = 0; row < 2; row++) {
      const vc = sv0 + 0.5 + row * 1.04;
      for (let c2 = 0; c2 < 2; c2++) {
        slopes.mainF.P(sx0 + roofL / 2 + 0.84 + c2 * 1.72, vc, 0.47, _p);
        const pm = new THREE.Mesh(panelGeo, M.solar); pm.position.copy(_p); pm.quaternion.copy(slopes.mainF.quat);
        G.solar.add(pm); occluders.push(pm);
      }
      [-0.3, 0.3].forEach((dv) => {
        const uMid = sx0 + roofL / 2 + 1.72;
        slopes.mainF.P(uMid, vc + dv, 0.425, _p);
        mesh(G.solar, boxGeo, M.alu, [3.5, 0.04, 0.05], [_p.x, _p.y, _p.z], { quat: slopes.mainF.quat });
        [-1.4, 0, 1.4].forEach((du) => {
          slopes.mainF.P(uMid + du, vc + dv, 0.22, _p);
          mesh(G.solar, cylGeo, M.alu, [0.026, 0.4, 0.026], [_p.x, _p.y, _p.z], { quat: slopes.mainF.quat });
          slopes.mainF.P(uMid + du, vc + dv, 0.25, _p);
          mesh(G.solar, boxGeo, M.flash, [0.17, 0.014, 0.22], [_p.x, _p.y, _p.z], { quat: slopes.mainF.quat, noShadow: true });
        });
      });
    }
    // holographic outline of the solar array
    addEdge(G.solar, slabGeo(slopes.mainF, [[sx0 + roofL / 2, sv0], [sx0 + roofL / 2 + 3.44, sv0], [sx0 + roofL / 2 + 3.44, sv0 + 2.08], [sx0 + roofL / 2, sv0 + 2.08]], 0, 0.5));

    /* ---------- Per-layer clipping planes (stage-2 stepped cutaway) ---------- */
    const planes = { struct: new THREE.Plane(V3(-1, 0, 0), 100), deck: new THREE.Plane(V3(-1, 0, 0), 100), under: new THREE.Plane(V3(-1, 0, 0), 100), tile: new THREE.Plane(V3(-1, 0, 0), 100) };
    function clipGroup(group, plane) {
      const cache = new Map();
      const fix = (m) => {
        if (cache.has(m)) return cache.get(m);
        let out = m;
        if (m.clippingPlanes && m.clippingPlanes.length && m.clippingPlanes[0] !== plane) {   // shared with another layer → clone
          out = track(m.clone());
          thermalize(out, m.userData.thermBase.value);
        }
        out.clippingPlanes = [plane]; out.clipShadows = false;
        cache.set(m, out); return out;
      };
      group.traverse((o) => { if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(fix) : fix(o.material); });
    }
    clipGroup(G.struct, planes.struct); clipGroup(G.deck, planes.deck); clipGroup(G.under, planes.under);
    clipGroup(G.flash, planes.tile); clipGroup(G.tile, planes.tile); clipGroup(G.ridge, planes.tile); clipGroup(G.solar, planes.tile);
    await yieldToIdle();
    if (destroyed) return null;

    /* ---------- Environment: lights + grounding contact shadow ---------- */
    const hemi = new THREE.HemisphereLight(col(C.hemiSky), col(C.hemiGround), 1.05); scene.add(hemi);
    const sun = new THREE.DirectionalLight(col(C.sunLight), 3.1);
    sun.position.set(-13, 14, 11); sun.target.position.set(0, 2, 1.5);
    scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight(col(C.fillLight), 0.95); fill.position.set(14, 7, -9); scene.add(fill);

    const shadowCatcher = new THREE.Mesh(
      track(new THREE.PlaneGeometry(19, 19)),
      track(new THREE.MeshBasicMaterial({ map: texGlow, color: 0x020816, transparent: true, opacity: 0.34, depthWrite: false })),
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.set(-0.5, 0.01, 1.2);
    scene.add(shadowCatcher);

    /* ---------- Drone (procedural quadcopter) ---------- */
    const droneG = new THREE.Group(); scene.add(droneG);
    const dBody = std({ color: '#d9dee5', roughness: 0.35, metalness: 0.15 }, 0.5), dDark = std({ color: '#262c34', roughness: 0.5, metalness: 0.3 }, 0.5);
    const droneInner = new THREE.Group(); droneG.add(droneInner); droneInner.scale.setScalar(CONFIG.drone.scale);
    const capsule = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.15, 0.34, 4, 12)), dBody);
    capsule.rotation.x = Math.PI / 2; capsule.scale.set(1.2, 1, 0.55); capsule.castShadow = true; droneInner.add(capsule);
    const rotors = [];
    const bladeGeo = track(new THREE.BoxGeometry(0.46, 0.006, 0.045));
    const blurMat = track(new THREE.MeshBasicMaterial({ color: '#dfefff', transparent: true, opacity: 0.09, depthWrite: false, side: DS }));
    const blurGeo = track(new THREE.CircleGeometry(0.24, 28));
    [45, 135, 225, 315].forEach((deg, i) => {
      const a = deg * DEG, ex = Math.cos(a) * 0.46, ez = Math.sin(a) * 0.46;
      const arm = mesh(droneInner, cylGeo, dDark, [0.022, 0.46, 0.022], [ex / 2, 0, ez / 2]);
      arm.rotation.set(0, -a, Math.PI / 2);
      mesh(droneInner, cylGeo, dDark, [0.045, 0.07, 0.045], [ex, 0.02, ez]);
      const rot = new THREE.Group(); rot.position.set(ex, 0.07, ez); droneInner.add(rot);
      rot.add(new THREE.Mesh(bladeGeo, dDark));
      const blur = new THREE.Mesh(blurGeo, blurMat); blur.rotation.x = -Math.PI / 2; rot.add(blur);
      rotors.push(rot);
      const led = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: texGlow, color: col(i < 2 ? '#38ff9c' : '#ff3b2f'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
      led.position.set(ex, -0.03, ez); led.scale.setScalar(0.22); droneInner.add(led);
    });
    [-0.12, 0.12].forEach((lx) => mesh(droneInner, boxGeo, dDark, [0.02, 0.14, 0.3], [lx, -0.12, 0]));
    const gimbal = new THREE.Group(); gimbal.position.set(0, -0.1, 0.22); droneInner.add(gimbal);
    gimbal.add(new THREE.Mesh(track(new THREE.SphereGeometry(0.065, 16, 12)), dDark));
    const lens = mesh(gimbal, cylGeo, M.glass, [0.03, 0.03, 0.03], [0, -0.01, 0.06]); lens.rotation.x = Math.PI / 2 + 0.6;
    const strobe = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: texGlow, color: col('#ffffff'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
    strobe.position.set(0, 0.1, -0.18); droneInner.add(strobe);

    /* ---------- Stage 1: scanning light fan + photogrammetry mesh overlay ---------- */
    const overlayG = new THREE.Group(); scene.add(overlayG);
    const wireMat = track(new THREE.ShaderMaterial({
      uniforms: { uSweep: { value: 0 }, uAmt: { value: 1 }, uCell: { value: 0.55 }, uColor: { value: col(C.sky) } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: DS, extensions: { derivatives: true },
      vertexShader: 'varying vec2 vUv; varying vec3 vWP; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vWP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `
        uniform float uSweep, uAmt, uCell; uniform vec3 uColor; varying vec2 vUv; varying vec3 vWP;
        float ln(float x){ float d = abs(fract(x - 0.5) - 0.5) / fwidth(x); return 1.0 - min(d, 1.0); }
        void main(){
          vec2 c = vUv / uCell;
          float m = max(max(ln(c.x), ln(c.y)), ln(c.x - c.y) * 0.6);   // triangulated mesh look
          float behind = uSweep - vWP.x;
          float reveal = behind > 0.0 ? exp(-behind / 5.0) : 0.0;
          float edge = exp(-behind * behind * 6.0);
          float a = clamp((m * (0.06 + 0.9 * reveal) + edge * 0.28 + m * edge * 1.2) * uAmt, 0.0, 1.0);
          vec3 cc = mix(uColor, vec3(1.0), clamp(edge, 0.0, 1.0) * 0.7);
          gl_FragColor = vec4(cc, a);
          #include <colorspace_fragment>
        }`,
    }));
    [[slopes.mainF, POLY.mainVis], [slopes.mainB, POLY.mainFull], [slopes.wingL, POLY.wing], [slopes.wingR, POLY.wing]].forEach(([sl, poly]) => {
      const wm = new THREE.Mesh(slabGeo(sl, poly, 0, 0.42), wireMat); wm.renderOrder = 5; overlayG.add(wm);
    });
    const FAN_N = 30;
    const fanGeo = track(new THREE.BufferGeometry());
    fanGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((FAN_N + 1) * 3), 3));
    const aT = new Float32Array(FAN_N + 1); aT.fill(1); aT[0] = 0;
    fanGeo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
    const fanIdx = []; for (let i = 1; i < FAN_N; i++) fanIdx.push(0, i, i + 1); fanGeo.setIndex(fanIdx);
    const fanMat = track(new THREE.ShaderMaterial({
      uniforms: { uColor: { value: col(C.sky) }, uAmt: { value: 1 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: DS,
      vertexShader: 'attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 uColor; uniform float uAmt; varying float vT; void main(){ float a = clamp((0.025 + 0.32 * pow(vT, 5.0)) * uAmt, 0.0, 1.0); gl_FragColor = vec4(uColor, a); \n#include <colorspace_fragment>\n }',
    }));
    const fan = new THREE.Mesh(fanGeo, fanMat); fan.frustumCulled = false; fan.renderOrder = 6; overlayG.add(fan);
    const scanGeo = track(new THREE.BufferGeometry());
    scanGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FAN_N * 3), 3));
    const scanMat = track(new THREE.LineBasicMaterial({ color: col('#c8ecff'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    const scanLine = new THREE.Line(scanGeo, scanMat); scanLine.frustumCulled = false; overlayG.add(scanLine);
    function updateFan(apex, sweepX, amt) {
      const fp = fanGeo.attributes.position.array, lp = scanGeo.attributes.position.array;
      fp[0] = apex.x; fp[1] = apex.y; fp[2] = apex.z;
      const zMax = Math.abs(sweepX - xc) <= wingExt ? wingRoofF : eave;
      for (let i = 0; i < FAN_N; i++) {
        const z = lerp(-eave, zMax, i / (FAN_N - 1));
        let y = roofTop(sweepX, z); y = (y < 0 ? yEave : y) + 0.36;
        fp[(i + 1) * 3] = lp[i * 3] = sweepX; fp[(i + 1) * 3 + 1] = lp[i * 3 + 1] = y; fp[(i + 1) * 3 + 2] = lp[i * 3 + 2] = z;
      }
      fanGeo.attributes.position.needsUpdate = true; scanGeo.attributes.position.needsUpdate = true;
      const edgeFade = smooth(-roofL / 2 - 0.8, -roofL / 2 + 0.4, sweepX) * (1 - smooth(roofL / 2 - 0.4, roofL / 2 + 0.8, sweepX));
      fanMat.uniforms.uAmt.value = amt * edgeFade; scanMat.opacity = amt * edgeFade;
    }

    /* ---------- Stage 2: thermal hotspots, airflow particles, moisture probe ---------- */
    const hot = {
      leak: slopes.mainF.P(pb.x + roofL / 2, pb.z * NS, -0.07),
      seam: slopes.mainB.P(0.45 + roofL / 2, 2.3 * NS, -0.07),
      vent: V3(1.65, Hr - 0.14, 0),
    };
    TH.uHot.value[0].set(hot.leak.x, hot.leak.y, hot.leak.z, -0.4);   // cold, wet spot
    TH.uHot.value[1].set(hot.seam.x, hot.seam.y, hot.seam.z, 0.18);
    TH.uHot.value[2].set(hot.vent.x, hot.vent.y, hot.vent.z, 0.32);   // hot exhaust air at the ridge
    const stage2G = new THREE.Group(); scene.add(stage2G);
    const hotSprites = [[hot.leak, C.red, slopes.mainF.n], [hot.seam, C.amber, slopes.mainB.n], [hot.vent, C.green, V3(0, 1, 0)]].map(([pt, c, n]) => {
      const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: texGlow, color: col(c), transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false })));
      sp.position.copy(pt).addScaledVector(n, -0.12); sp.scale.setScalar(1.1); sp.renderOrder = 20; stage2G.add(sp);
      return sp;
    });
    // Airflow: soffit intake → under the deck → out the ridge vent
    const PN = Q.particles, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 3), pSeed = [];
    const prnd = mulberry32(99);
    for (let i = 0; i < PN; i++) pSeed.push({ side: i % 2 ? 1 : -1, x: lerp(-5.4, CONFIG.cutaway.x - 0.25, prnd()), ph: prnd(), sp: 0.07 + prnd() * 0.05, wob: prnd() * 6.28 });
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const pMat = track(new THREE.PointsMaterial({ size: 0.17, map: texGlow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, opacity: 0, fog: false }));
    const particles = new THREE.Points(pGeo, pMat); particles.frustumCulled = false; stage2G.add(particles);
    const cCool = col('#5bd2ff'), cWarm = col('#ffb35c'), _pc = new THREE.Color();
    function updateParticles(t) {
      for (let i = 0; i < PN; i++) {
        const sd = pSeed[i], u = (sd.ph + t * sd.sp) % 1;
        let y, za;
        if (u < 0.12) { const k = u / 0.12; za = lerp(eave - 0.15, halfD - 0.2, k); y = lerp(yEave - 0.15, wallH + 0.2, k); }
        else if (u < 0.88) { const k = (u - 0.12) / 0.76; za = lerp(halfD - 0.2, 0.1, k); y = Hr - za * s - 0.34 + Math.sin(u * 20 + sd.wob) * 0.05; }
        else { const k = (u - 0.88) / 0.12; za = 0.1 * (1 - k); y = Hr - 0.34 + k * 1.0; }
        pPos[i * 3] = sd.x + Math.sin(u * 6 + sd.wob) * 0.08; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = sd.side * za;
        const a = smooth(0, 0.06, u) * (1 - smooth(0.9, 1, u));
        _pc.copy(cCool).lerp(cWarm, smooth(0.2, 0.9, u)).multiplyScalar(a);
        pCol[i * 3] = _pc.r; pCol[i * 3 + 1] = _pc.g; pCol[i * 3 + 2] = _pc.b;
      }
      pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
    }
    // Handheld pinless moisture meter
    const probeG = new THREE.Group(); stage2G.add(probeG);
    const probeInner = new THREE.Group(); probeInner.scale.setScalar(2.2); probeG.add(probeInner);
    const probeBody = new THREE.MeshStandardMaterial({ color: C.amber, roughness: 0.55 }); track(probeBody);
    const probeDark = new THREE.MeshStandardMaterial({ color: '#1d232b', roughness: 0.5 }); track(probeDark);
    mesh(probeInner, boxGeo, probeBody, [0.17, 0.3, 0.07], [0, 0, 0]);
    mesh(probeInner, boxGeo, probeDark, [0.12, 0.05, 0.06], [0, 0.165, 0]);
    [-0.03, 0.03].forEach((px) => mesh(probeInner, cylGeo, M.alu, [0.006, 0.07, 0.006], [px, 0.22, 0]));
    const scr = document.createElement('canvas'); scr.width = 128; scr.height = 80;
    const sctx = scr.getContext('2d'); const scrTex = toTex(scr, true); scrTex.wrapS = scrTex.wrapT = THREE.ClampToEdgeWrapping;
    const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(0.13, 0.085)), track(new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false })));
    screen.position.set(0, 0.04, 0.0365); probeInner.add(screen);
    const probeTargets = [
      { pt: hot.leak, a: slopes.mainF.n, big: 'DAMP', small: 'PIPE BOOT', color: '#ff6b55' },
      { pt: hot.seam, a: slopes.mainB.n, big: 'DRY ✓', small: 'ROOF DECK', color: '#ffc700' },
      { pt: hot.vent, a: V3(0, 1, 0), big: 'CLEAR ✓', small: 'AIRFLOW', color: '#4cf0b0' },
    ];
    function drawScreen(i) {
      const tg = probeTargets[i];
      sctx.fillStyle = '#07140e'; sctx.fillRect(0, 0, 128, 80);
      sctx.fillStyle = tg.color; sctx.font = 'bold 28px sans-serif'; sctx.fillText(tg.big, 8, 40);
      sctx.font = 'bold 14px sans-serif'; sctx.fillText(tg.small, 8, 66);
      scrTex.needsUpdate = true; state.probeReading = tg.big + ' ' + tg.small.split(' ')[0];
    }
    let probeIdx = -1;
    const _pa = new THREE.Vector3(), _pb2 = new THREE.Vector3(), _na = new THREE.Vector3(), _zd = new THREE.Vector3(), _xd = new THREE.Vector3(), _bm = new THREE.Matrix4();
    function updateProbe(t) {
      const T = CONFIG.timings, per = T.probeDwell + T.probeMove, tt = t % (per * 3);
      const idx = Math.floor(tt / per), lt = tt - idx * per, prev = (idx + 2) % 3;
      const k = smooth(0, T.probeMove, lt);
      const tip = (i, out) => out.copy(probeTargets[i].pt).addScaledVector(probeTargets[i].a, -0.6);   // probe centre below the surface (tip just touches)
      tip(prev, _pa); tip(idx, _pb2);
      _pa.lerp(_pb2, k); _pa.y -= Math.sin(k * Math.PI) * 0.25;          // little arc between points
      _pa.addScaledVector(probeTargets[idx].a, Math.sin(t * 6) * 0.01 * (lt > T.probeMove ? 1 : 0));
      probeG.position.copy(_pa);
      _na.copy(probeTargets[prev].a).lerp(probeTargets[idx].a, k).normalize();   // tip direction (+Y)
      _zd.copy(camera.position).sub(_pa); _zd.addScaledVector(_na, -_zd.dot(_na)).normalize();  // screen faces camera
      _xd.crossVectors(_na, _zd).normalize();
      _bm.makeBasis(_xd, _na, _zd); probeG.quaternion.setFromRotationMatrix(_bm);
      if (k > 0.98 && idx !== probeIdx) { probeIdx = idx; drawScreen(idx); }
    }
    drawScreen(1);

    /* ---------- Stage 3: holographic grid floor + exploded-layer leader lines ---------- */
    const holoMat = track(new THREE.ShaderMaterial({
      uniforms: { uAmt: { value: 0 }, uTime: { value: 0 }, uColor: { value: col(C.sky) } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, extensions: { derivatives: true },
      vertexShader: 'varying vec3 vWP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `
        uniform float uAmt, uTime; uniform vec3 uColor; varying vec3 vWP;
        float grid(vec2 c){ vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c); return 1.0 - min(min(g.x, g.y), 1.0); }
        void main(){
          float r = length(vWP.xz - vec2(-0.5, 1.2));
          float fade = smoothstep(10.2, 4.0, r);
          float ring = exp(-pow((r - mod(uTime * 3.0, 10.2)) * 1.4, 2.0));
          float a = clamp((grid(vWP.xz) * 0.34 + grid(vWP.xz / 4.0) * 0.62 + ring * 0.35) * fade * uAmt, 0.0, 1.0);
          gl_FragColor = vec4(uColor, a);
          #include <colorspace_fragment>
        }`,
    }));
    const holo = new THREE.Mesh(track(new THREE.PlaneGeometry(46, 46)), holoMat);
    holo.rotation.x = -Math.PI / 2; holo.position.y = 0.04; holo.renderOrder = 4; scene.add(holo);
    const leaderMat = track(new THREE.LineBasicMaterial({ color: col(C.sky), transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    const endX = -roofL / 2 - 1.6;
    const explodeDefs = [
      { g: 'solar', title: 'Solar mounts: flashed ✓', sub: '8 standoffs sealed', anchor: slopes.mainF.P(sx0 + roofL / 2 + 0.1, sv0 + 0.1, 0.5) },
      { g: 'ridge', title: 'Ridge: sealed ✓', sub: 'Cap & exhaust vent', anchor: V3(-halfL + 0.3, Hr + 0.3, 0) },
      { g: 'tile', title: '7 cracked tiles found', sub: 'Clay tile field', anchor: slopes.mainF.P(0.6, 1.4, 0.28) },
      { g: 'flash', title: 'Possible moisture at pipe boot', sub: 'Flashing & valley metal', anchor: valleyL.mid.clone() },
      { g: 'under', title: 'Underlayment barrier', sub: 'Aged felt · currently dry', anchor: slopes.mainF.P(0.45, 2.6, 0.02) },
      { g: 'deck', title: 'Roof deck: dry ✓', sub: 'Solid plywood sheathing', anchor: slopes.mainF.P(0.45, 3.7, 0.0) },
    ];
    const leaderLines = [];
    explodeDefs.forEach((d, i) => {
      // leader end-points are evenly spaced in *exploded* world space so the tags never collide
      d.end = V3(endX, 10.6 - i * 1.75 - CONFIG.explode.offsets[d.g], d.anchor.z);
      const lg = track(new THREE.BufferGeometry().setFromPoints([d.anchor, d.end]));
      const line = new THREE.Line(lg, leaderMat); line.renderOrder = 30; line.frustumCulled = false; G[d.g].add(line);
      leaderLines.push(line);
    });

    /* ---------- 3D-anchored DOM callouts (Homeowner-friendly labels) ---------- */
    const labels = [];
    function addLabel(def) {
      const el = document.createElement('div');
      el.className = 'ru3d-tag' + (def.side === 'l' ? ' ru3d-tag--l' : '') + (def.cls ? ' ' + def.cls : '');
      el.style.setProperty('--c', def.color);
      el.innerHTML = (def.mini ? '' : '<i class="ru3d-tag__ring"></i><i class="ru3d-tag__ring"></i>') +
        '<i class="ru3d-tag__dot"></i><i class="ru3d-tag__line"></i><span class="ru3d-tag__box"><b>' + def.title + '</b>' + (def.sub ? '<em>' + def.sub + '</em>' : '') + '</span>';
      dom.labels.appendChild(el);
      Object.assign(def, { el, pos: new THREE.Vector3(), occluded: false, op: -1, tx: '', isL: def.side === 'l' });
      labels.push(def);
    }
    const fixed = (v) => (out) => out.copy(v);
    // Stage 1: Homeowner-friendly labels
    addLabel({ title: 'Ridge: sealed ✓', sub: 'Mortar-set cap intact', color: C.sky, side: 'r', occlude: true, get: fixed(V3(-1.4, Hr + 0.55, 0)), w: (W) => W.w0 });
    addLabel({ title: 'Valley: clear ✓', sub: 'Sheet metal channel clean', color: C.amber, side: 'l', occlude: true, get: fixed(valleyR.mid.clone().addScaledVector(valleyR.ny, 0.3)), w: (W) => W.w0 });
    addLabel({ title: '7 cracked tiles found', sub: 'Flagged for reset & replace', color: C.red, side: 'r', dy: 9, occlude: true, get: fixed(V3(4.7, roofTop(4.7, 3.95) + 0.36, 3.95)), w: (W) => W.w0 });
    addLabel({ title: 'Solar mounts: flashed ✓', sub: '8 standoffs sealed', color: C.green, side: 'r', dy: -9, occlude: true, get: fixed(slopes.mainF.P(sx0 + roofL / 2 + 0.25, sv0 + 2.2, 0.32)), w: (W) => W.w0 });
    // Stage 2: Homeowner-friendly labels
    addLabel({ title: 'Possible moisture at pipe boot', sub: 'Flagged for flashing seal', color: C.red, side: 'r', dy: 16, get: fixed(hot.leak.clone().addScaledVector(slopes.mainF.n, -0.1)), w: (W) => W.w1 });
    addLabel({ title: 'Roof deck: dry ✓', sub: 'No wood rot detected', color: C.amber, side: 'l', dy: -16, get: fixed(hot.seam.clone().addScaledVector(slopes.mainB.n, -0.1)), w: (W) => W.w1 });
    addLabel({ title: 'Attic airflow: balanced ✓', sub: 'Clear intake to ridge', color: C.green, side: 'r', get: fixed(hot.vent.clone()), w: (W) => W.w1 });
    // Stage 3 (follow the exploded groups)
    explodeDefs.forEach((d) => addLabel({ title: d.title, sub: d.sub, color: C.sky, side: 'r', mini: true, cls: 'ru3d-tag--x',
      get: (out) => G[d.g].localToWorld(out.copy(d.end)), w: (W) => W.w2 * smooth(0.45, 0.85, W.ex) }));

    const ray = new THREE.Raycaster(), _lv = new THREE.Vector3(), _ld = new THREE.Vector3();
    let labelFrame = 0, lastOccP = -1;
    function updateLabels(W) {
      labelFrame++;
      const pMoved = Math.abs(state.p - lastOccP) > 0.002;
      const doOcc = (pMoved && labelFrame % 4 === 0) || lastOccP < 0;
      if (doOcc) lastOccP = state.p;
      for (const d of labels) {
        const w = d.w(W);
        let op = 0;
        if (w > 0.01) {
          d.get(d.pos); _lv.copy(d.pos).project(camera);
          const x = (_lv.x * 0.5 + 0.5) * vpW, y = (-_lv.y * 0.5 + 0.5) * vpH + (d.dy || 0) * (vpW < 640 ? 1 : 0.4);
          const off = _lv.z > 1 || x < -30 || x > vpW + 30 || y < -30 || y > vpH + 30;
          if (d.occlude && doOcc && !off) {
            _ld.copy(d.pos).sub(camera.position); const dist = _ld.length();
            ray.set(camera.position, _ld.multiplyScalar(1 / dist)); ray.far = dist - 0.15;
            d.occluded = ray.intersectObjects(occluders, false).length > 0;
          }
          op = off || d.occluded ? 0 : w;
          // auto-flip the tag box away from the viewport edges
          const padR = vpW < 500 ? 140 : 195;
          const padL = vpW < 500 ? 115 : 175;
          const wantL = d.side === 'l' ? x > padL : x > vpW - padR;
          if (wantL !== d.isL) { d.el.classList.toggle('ru3d-tag--l', wantL); d.isL = wantL; }
          const tx = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
          if (tx !== d.tx) { d.el.style.transform = tx; d.tx = tx; }
        }
        if (Math.abs(op - d.op) > 0.004) { d.el.style.opacity = op.toFixed(3); d.op = op; }
      }
    }

    /* ---------- Per-frame update ---------- */
    let vpW = 1, vpH = 1, aspectFactor = 1;
    const camCfg = CONFIG.camera, T = CONFIG.timings, EX = CONFIG.explode.offsets;
    const kA = {}, kB = {}, _tgt = new THREE.Vector3(), _right = new THREE.Vector3(), _apex = new THREE.Vector3();
    const layerOrder = ['deck', 'under', 'flash', 'tile', 'ridge', 'solar'];
    function camKey(i, local, o) {
      const k = camCfg.stages[i];
      o.x = k.target[0]; o.y = k.target[1]; o.z = k.target[2];
      o.r = k.r; o.az = lerp(k.az, k.azEnd, local) * DEG; o.el = k.el * DEG; o.fov = k.fov; o.shift = k.shift || 0;
      if (state.layout === 'stacked' || vpW < 640) { o.r *= camCfg.mobile.rScale; if (i === 2) { o.shift = camCfg.mobile.stage3Shift; o.y += camCfg.mobile.stage3Lift; } }
      return o;
    }
    function update(dt) {
      const p = state.p, t = state.t, W = stageWeights(p, state.s);
      // --- camera: spherical interpolation between stage keys (no hard cuts) ---
      const i0 = Math.min(1, Math.floor(p)), f = p - i0;
      camKey(i0, state.local[i0], kA); camKey(i0 + 1, state.local[i0 + 1], kB);
      const r = lerp(kA.r, kB.r, f) * aspectFactor, az = lerp(kA.az, kB.az, f), el = lerp(kA.el, kB.el, f);
      _tgt.set(lerp(kA.x, kB.x, f), lerp(kA.y, kB.y, f), lerp(kA.z, kB.z, f));
      _right.set(Math.cos(az), 0, -Math.sin(az));
      _tgt.addScaledVector(_right, lerp(kA.shift, kB.shift, f) * Math.min(1, aspectFactor));
      camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(r).add(_tgt);
      if (!state.reduced) {
        const par = camCfg.parallax * (1 - 0.6 * W.w1);   // calmer inside the attic
        camera.position.addScaledVector(_right, state.mxs * par + Math.sin(t * 0.23) * camCfg.idleSway);
        camera.position.y += -state.mys * par * 0.6 + Math.sin(t * 0.31) * camCfg.idleSway * 0.5;
      }
      camera.lookAt(_tgt);
      const fov = lerp(kA.fov, kB.fov, f);
      if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

      // --- stepped cutaway (stage 2) + hidden interior layer culling ---
      const cutX = CONFIG.cutaway.x + (1 - W.cut) * 7.8, st = CONFIG.cutaway.steps;
      planes.struct.constant = cutX - st[0] * W.peel; planes.deck.constant = cutX - st[1] * W.peel;
      planes.under.constant = cutX - st[2] * W.peel; planes.tile.constant = cutX - st[3] * W.peel;
      const roofOpen = W.cut > 0.005 || W.ex > 0.005;
      atticG.visible = G.deck.visible = G.under.visible = roofOpen;

      // --- thermal view + environment mood ---
      TH.uThermal.value = W.th; TH.uThTime.value = t;
      sun.intensity = 3.1 * (1 - 0.3 * W.w2); hemi.intensity = 1.05 * (1 - 0.25 * W.w2);
      winGlowMat.opacity = 0.5 * (1 - W.th) * (1 - 0.5 * W.w2);
      shadowCatcher.material.opacity = 0.34 * (1 - W.w1);

      // --- stage 1: drone orbit + scan ---
      droneG.visible = overlayG.visible = W.w0 > 0.01;
      if (droneG.visible) {
        const a = t * T.droneOrbitSpeed + 0.9, R = CONFIG.drone.radius;
        const h = CONFIG.drone.height + Math.sin(t * 1.3) * 0.25 + (1 - W.w0) * 8;
        droneG.position.set(Math.cos(a) * R, h, 1.2 + Math.sin(a) * R);
        droneG.lookAt(0, h - 2.2, 1.2); droneG.rotateZ(-0.1);
        rotors.forEach((ro, i) => { ro.rotation.y += (i % 2 ? 1 : -1) * T.rotorSpeed * dt; });
        strobe.material.opacity = (t % 1.2) < 0.08 ? 1 : 0;
        const sw = (t % T.sweepPeriod) / T.sweepPeriod, sweepX = lerp(-roofL / 2 - 1, roofL / 2 + 1, sw);
        wireMat.uniforms.uSweep.value = sweepX; wireMat.uniforms.uAmt.value = W.w0;
        droneG.updateMatrixWorld(true); gimbal.getWorldPosition(_apex);
        updateFan(_apex, sweepX, W.w0);
        state.scanPct = sw; state.scanPass = (Math.floor(t / T.sweepPeriod) % 4) + 1;
      }

      // --- stage 2: hotspots, airflow, probe ---
      stage2G.visible = W.w1 > 0.01;
      if (stage2G.visible) {
        hotSprites.forEach((sp, i) => { const k = Math.sin(t * 3 + i * 2); sp.material.opacity = W.w1 * (0.6 + 0.25 * k); sp.scale.setScalar(1.0 + 0.18 * k); });
        pMat.opacity = W.w1; updateParticles(t);
        probeInner.scale.setScalar(2.2 * smooth(0.2, 1, W.w1)); updateProbe(t);
      }

      // --- stage 3: explode layers, holo blueprint base, leaders ---
      layerOrder.forEach((k, i) => { G[k].position.y = W.ex * EX[k] + W.ex * 0.06 * Math.sin(t * 1.1 + i * 0.9); });
      holo.visible = true;
      holoMat.uniforms.uAmt.value = 0.42 * (1 - 0.7 * W.th) + 0.58 * W.w2;
      holoMat.uniforms.uTime.value = t;
      edgeMat.opacity = W.w2 * smooth(0.25, 0.8, W.ex) * 0.6;
      leaderMat.opacity = W.w2 * smooth(0.45, 0.85, W.ex) * 0.85;
      const showEdges = edgeMat.opacity > 0.005;
      for (let i = 0; i < edgeLines.length; i++) edgeLines[i].visible = showEdges;
      const showLeaders = leaderMat.opacity > 0.005;
      for (let i = 0; i < leaderLines.length; i++) leaderLines[i].visible = showLeaders;

      scene.updateMatrixWorld();
      camera.updateMatrixWorld();
      updateLabels(W);
      return W;
    }

    function resize() {
      const w = Math.max(1, dom.viewport.clientWidth), h = Math.max(1, dom.viewport.clientHeight);
      vpW = w; vpH = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      aspectFactor = camera.aspect < 1.25 ? Math.pow(1.25 / camera.aspect, 0.85) : 1;
      state.needsRender = true;
    }
    function setPixelRatio(pr) { pixelRatio = pr; renderer.setPixelRatio(pr); resize(); }
    function dispose() {
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      disposables.forEach((d) => d && d.dispose && d.dispose());
      disposables.clear();
      renderer.dispose(); renderer.forceContextLoss();
      renderer.domElement.remove();
      labels.forEach((l) => l.el.remove());
    }
    renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onFatal(new Error('WebGL context lost')); }, false);

    return {
      update, resize, dispose, setPixelRatio, tileCount,
      compileGroups: [G.struct, atticG, G.deck, G.under, G.flash, G.tile, G.ridge, G.solar, droneG, overlayG, stage2G, holo],
      debug: { scene, camera, planes, renderer, TH },
      render: () => renderer.render(scene, camera),
      get pixelRatio() { return pixelRatio; },
    };
  } // end create3D

  /* ===========================================================================
   * 6. Stage weights shared by 3D + DOM (all derived from p∈[0,2] and s∈[0,1])
   * ========================================================================= */
  function stageWeights(p, s) {
    const cut = smooth(0.12, 0.88, p) * (1 - smooth(1.06, 1.6, p));
    return {
      w0: 1 - smooth(0.28, 0.62, p),
      w1: smooth(0.55, 0.92, p) * (1 - smooth(1.1, 1.45, p)),
      w2: smooth(1.55, 1.92, p),
      th: smooth(0.35, 0.85, p) * (1 - smooth(1.12, 1.55, p)),
      cut,
      peel: cut * (0.3 + 0.7 * smooth(0.4, 0.6, s)),
      ex: smooth(1.2, 1.95, p) * 0.8 + 0.2 * smooth(0.72, 0.98, s),
    };
  }

  /* ===========================================================================
   * 7. DOM UI: tabs, panels, HUD, telemetry, report card
   * ========================================================================= */
  function setStageUI(i) {
    if (i === state.stage) return;
    state.stage = i;
    dom.tabs.forEach((tab, k) => {
      const on = k === i;
      tab.classList.toggle('is-active', on); tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1;
    });
    dom.panels.forEach((pn, k) => {
      const on = k === i; pn.classList.toggle('is-active', on);
      if (state.layout === 'stacked') pn.removeAttribute('aria-hidden'); else pn.setAttribute('aria-hidden', String(!on));
    });
    dom.hudTitle.textContent = CONFIG.hud.titles[i];
    dom.viewport.dataset.stage = String(i);
    root.dataset.activeStage = String(i + 1);
    CONFIG.telemetry[i].forEach(([label], k) => { if (dom.tele[k]) dom.tele[k].firstElementChild.textContent = label; });
    updateTelemetry();
  }
  function updateTelemetry() {
    const row = CONFIG.telemetry[Math.max(0, state.stage)];
    row.forEach(([, val], k) => {
      const b = dom.tele[k] && dom.tele[k].lastElementChild; if (!b) return;
      const txt = typeof val === 'function' ? val(state.t, state) : val;
      if (b.textContent !== txt) b.textContent = txt;
    });
    if (state.stage === 0 && dom.scanReadout) {
      const txt = 'Checking every slope & valley';
      if (dom.scanReadout.textContent !== txt) dom.scanReadout.textContent = txt;
    }
  }
  const tabFill = [-1, -1, -1];
  function updateTabFill() {
    dom.tabs.forEach((tab, i) => {
      const v = state.local[i];
      if (Math.abs(v - tabFill[i]) > 0.003) { tab.style.setProperty('--fill', v.toFixed(3)); tabFill[i] = v; }
    });
  }
  const vpVars = { w0: -1, w1: -1, w2: -1, th: -1 };
  function updateViewportVars(W) {
    ['w0', 'w1', 'w2', 'th'].forEach((k) => {
      if (Math.abs(W[k] - vpVars[k]) > 0.004) { dom.viewport.style.setProperty('--' + k, W[k].toFixed(3)); vpVars[k] = W[k]; }
    });
  }
  // Report card markup is generated from CONFIG.report so numbers/items live in one place
  const counters = [];
  function buildReport() {
    const R = CONFIG.report;
    let row = 0;
    const r = () => ' data-row style="--i:' + row++ + '"';
    dom.report.innerHTML =
      '<div class="ru3d-r__top"' + r() + '><span>RISE UP · DIGITAL ROOF REPORT</span><span>' + R.id + '</span></div>' +
      '<div class="ru3d-r__title"' + r() + '><span>' + R.title + '</span><span class="ru3d-r__grade">' + R.grade + '</span></div>' +
      '<div class="ru3d-r__metrics"' + r() + '>' + R.metrics.map((m, i) => '<div><b data-c="m' + i + '">0</b><span>' + m.label + '</span></div>').join('') + '</div>' +
      '<ul class="ru3d-r__items">' + R.items.map((it) => '<li data-st="' + it.st + '"' + r() + '><i>' + it.tag + '</i><span>' + it.name + '<small>' + it.note + '</small></span><b>' + it.cost + '</b></li>').join('') + '</ul>' +
      '<div class="ru3d-r__life"' + r() + ' style="--life:' + R.life + ';--i:' + (row - 1) + '"><span>REMAINING LIFE</span><div><i></i></div><span>' + R.lifeLabel + '</span></div>' +
      '<div class="ru3d-r__total"' + r() + '><span>' + R.total.label + '</span><strong>$<b data-c="tmin">0</b>–$<b data-c="tmax">0</b></strong></div>' +
      '<div class="ru3d-r__alt"' + r() + '>' + R.alt + '</div>';
    R.metrics.forEach((m, i) => counters.push({ el: $('[data-c="m' + i + '"]', dom.report), value: m.value, decimals: m.decimals }));
    counters.push({ el: $('[data-c="tmin"]', dom.report), value: R.total.min, decimals: 0 });
    counters.push({ el: $('[data-c="tmax"]', dom.report), value: R.total.max, decimals: 0 });
    $$('[data-link]', dom.cta3d).forEach((a) => { const href = CONFIG.links[a.dataset.link]; if (href) a.href = href; });
  }
  const fmtNum = (v, d) => (d ? v.toFixed(d) : fmt.format(Math.round(v)));
  function setCounters(k) { counters.forEach((c) => { const txt = fmtNum(c.value * k, c.decimals); if (c.el.textContent !== txt) c.el.textContent = txt; }); }
  function updateReport(W, dt) {
    if (!state.reportOn && W.w2 > 0.6) {
      state.reportOn = true; state.reportT = 0;
      dom.report.classList.add('is-on'); dom.cta3d.classList.add('is-on');
    } else if (state.reportOn && W.w2 < 0.3) {
      state.reportOn = false;
      dom.report.classList.remove('is-on'); dom.cta3d.classList.remove('is-on'); setCounters(0);
    }
    if (state.reportOn && state.reportT < CONFIG.timings.countUp + 1) {
      state.reportT += dt;
      const k = state.reduced ? 1 : clamp01((state.reportT - 0.45) / CONFIG.timings.countUp);
      setCounters(1 - Math.pow(1 - k, 3));                          // ease-out count-up
    }
    if (!state.reduced) dom.report.style.setProperty('--rx', (state.mxs * -6).toFixed(1) + 'px');
  }

  /* ===========================================================================
   * 8. Render loop (paused when offscreen / tab hidden)
   * ========================================================================= */
  let three = null, rafId = 0, lastT = 0, perfAcc = 0, perfN = 0, skipTick = 0;
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const rawDt = lastT ? (now - lastT) / 1000 : 0.016;
    const dt = Math.min(0.05, rawDt); lastT = now;
    try {
      // 1) resolve the scroll value s
      const prevS = state.s;
      if (state.layout === 'pinned') state.s = proxy.s;
      else if (state.reduced) state.s = state.sTarget;
      else state.s = Math.abs(state.sTarget - state.s) < 1e-4 ? state.sTarget : damp(state.s, state.sTarget, CONFIG.timings.stackedEase, dt);
      const m = mapScroll(state.s); state.p = m.p; state.local = m.local;
      setStageUI(state.p < 0.5 ? 0 : state.p < 1.5 ? 1 : 2);
      updateTabFill();
      // 2) time + pointer smoothing (frozen when reduced motion)
      const adt = state.reduced ? 0 : dt;
      state.t += adt;
      state.mxs = damp(state.mxs, state.mx, CONFIG.camera.parallaxDamping, dt);
      state.mys = damp(state.mys, state.my, CONFIG.camera.parallaxDamping, dt);
      const W = stageWeights(state.p, state.s);
      updateViewportVars(W);
      updateReport(W, dt);
      // 3) 3D (render on demand when motion is reduced)
      if (three && (!state.reduced || state.needsRender || Math.abs(state.s - prevS) > 1e-6)) {
        if (rawDt > 0.035 && (++skipTick % 3 !== 0)) { state.needsRender = true; return; }
        three.update(adt); three.render(); state.needsRender = false;
        if (!state.firstFramed) { state.firstFramed = true; if (deps.onFirstFrame) deps.onFirstFrame(); }   // [3.0 host]
        // adaptive quality: drop pixel ratio quickly if frames exceed 28ms
        if (CONFIG.quality.adaptive && !state.reduced) {
          perfAcc += rawDt; perfN++;
          if (perfN >= 3) {
            if (perfAcc / perfN > 0.028 && three.pixelRatio > 0.5) {
              three.setPixelRatio(Math.max(0.5, +(three.pixelRatio - 0.25).toFixed(2)));
            }
            perfAcc = 0; perfN = 0;
          }
        }
      }
    } catch (err) { onFatal(err); }
  }
  function start() { if (state.running) return; state.running = true; lastT = 0; rafId = requestAnimationFrame(frame); }
  function stop() { state.running = false; cancelAnimationFrame(rafId); }
  function syncRunning() { (state.visible && !document.hidden && !state.hostPaused) ? start() : stop(); }   // [3.0 host] hostPaused

  /* ===========================================================================
    * 9. WebGL init / fallback
    * ========================================================================= */
  function hasWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }
  function showFallback(reason) {
    if (state.fallback) return;
    state.fallback = true;
    root.classList.add('is-fallback', 'is-ready');
    if (reason) console.info('[RiseUp 3D] using static SVG fallback:', reason);
  }
  function onFatal(err) {
    if (destroyed) return;     // e.g. the context-lost event fired by our own dispose()
    console.warn('[RiseUp 3D] runtime error, switching to SVG fallback', err);
    try { if (three) three.dispose(); } catch (e) { /* ignore */ }
    three = null;
    dom.viewport.querySelectorAll('canvas').forEach((c) => c.remove());
    showFallback('error');
  }
  let initPending = false;
  async function init3D() {
    if (three || initPending || state.fallback || destroyed) return;
    if (!(deps.THREE || window.THREE)) return showFallback('three.js failed to load');
    if (!hasWebGL()) return showFallback('WebGL unavailable');
    initPending = true;
    try {
      const created = await create3D();
      if (!created || destroyed) return;
      created.resize();
      created.update(0);
      // Warm every stage's shaders & clipping state 1 group per idle slice on a tiny 16x16 viewport
      const { renderer: r, scene: sc, camera: cam } = created.debug;
      r.setViewport(0, 0, 16, 16);
      sc.traverse((o) => { o.visible = true; });
      for (const grp of created.compileGroups) grp.visible = false;
      const tWarm0 = performance.now();
      for (const grp of created.compileGroups) {
        if (destroyed) return;
        grp.visible = true;
        if (grp.parent && !grp.parent.visible) grp.parent.visible = true;
        r.render(sc, cam);
        grp.visible = false;
        await yieldToIdle();
      }
      if (destroyed) return;
      for (const grp of created.compileGroups) grp.visible = true;
      if (performance.now() - tWarm0 > 300) created.setPixelRatio(0.5);
      created.resize();
      created.update(0);
      three = created;
      if (state.visible) three.render();
      if (!state.firstFramed) { state.firstFramed = true; if (deps.onFirstFrame) deps.onFirstFrame(); }
      state.needsRender = true;
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
      syncRunning();
    } catch (err) { onFatal(err); }
  }

  /* ===========================================================================
   * 10. Layout modes + scroll control
   *     pinned  : ≥768px, motion OK, GSAP present → pin + scrub
   *     stacked : <768px → no pin, stages listed vertically, sticky small canvas
   *     tabs    : ≥768px but reduced-motion or no GSAP → click tabs, no pin
   * ========================================================================= */
  let panelIO = null;
  function applyLayout(layout, reduced) {
    state.layout = layout; state.reduced = !!reduced;
    root.classList.toggle('is-pinned', layout === 'pinned');
    root.classList.toggle('is-stacked', layout === 'stacked');
    root.classList.toggle('is-tabs', layout === 'tabs');
    root.classList.toggle('is-reduced', !!reduced);
    if (panelIO) { panelIO.disconnect(); panelIO = null; }
    if (layout === 'stacked' && 'IntersectionObserver' in window) {
      panelIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { state.sTarget = CONFIG.scroll.stackedStops[+en.target.dataset.stage]; state.needsRender = true; } });
      }, { rootMargin: '-52% 0px -38% 0px' });
      dom.panels.forEach((pn) => panelIO.observe(pn));
    }
    if (layout !== 'pinned') { const st = Math.max(0, state.stage); state.sTarget = (layout === 'stacked' ? CONFIG.scroll.stackedStops : CONFIG.scroll.stops)[st]; if (reduced) state.s = state.sTarget; }
    state.stage = -1;           // force UI refresh (aria-hidden differs per layout)
    state.needsRender = true;
    if (three) requestAnimationFrame(() => three && three.resize());
  }
  function setupScroll() {
    if (deps.external) {
      applyLayout('pinned', false);
      return;
    }   // [3.0 host] progress comes from api.setProgress()
    const gsap = deps.gsap || window.gsap, ScrollTrigger = deps.ScrollTrigger || window.ScrollTrigger;
    const hasGsap = !!(gsap && ScrollTrigger);
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      mm = gsap.matchMedia();
      // NB: gsap.matchMedia only invokes the callback when at least one condition matches → include `mobile`
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767.98px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        const { desktop, reduce } = ctx.conditions;
        if (!desktop) { applyLayout('stacked', reduce); return; }
        if (reduce) { applyLayout('tabs', true); return; }
        applyLayout('pinned', false);
        scrubTween = gsap.to(proxy, {
          s: 1, ease: 'none',
          scrollTrigger: {
            trigger: dom.pin, pin: true, start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * CONFIG.scroll.lengthVh / 100),
            scrub: CONFIG.scroll.scrub, anticipatePin: 1, invalidateOnRefresh: true,
          },
        });
        // other pinned sections may have been created earlier/later → order by page position, then re-measure
        if (ScrollTrigger.sort) ScrollTrigger.sort();
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => { scrubTween = null; };
      });
    } else {
      const mqD = matchMedia('(min-width: 768px)'), mqR = matchMedia('(prefers-reduced-motion: reduce)');
      const apply = () => applyLayout(mqD.matches ? 'tabs' : 'stacked', mqR.matches);
      apply();
      mqD.addEventListener('change', apply); mqR.addEventListener('change', apply);
      cleanups.push(() => { mqD.removeEventListener('change', apply); mqR.removeEventListener('change', apply); });
    }
  }
  /** Jump to a stage (tab click / keyboard / API). */
  function goToStage(i) {
    i = Math.max(0, Math.min(2, i | 0));
    if (state.layout === 'pinned' && scrubTween && scrubTween.scrollTrigger) {
      const st = scrubTween.scrollTrigger;
      const y = Math.round(st.start + (st.end - st.start) * CONFIG.scroll.stops[i]) + (i === 0 ? 2 : 0);
      const lenis = window.__lenis;                 // respect a smooth-scroll library if the site has one
      if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (state.layout === 'stacked') {
      dom.panels[i].scrollIntoView({ behavior: state.reduced ? 'auto' : 'smooth', block: 'center' });
      state.sTarget = CONFIG.scroll.stackedStops[i];
    } else {
      state.sTarget = CONFIG.scroll.stops[i];
    }
    state.needsRender = true;
  }

  /* ===========================================================================
   * 11. Wire everything up
   * ========================================================================= */
  try {
    dom.hudCode.textContent = CONFIG.hud.code;
    buildReport();
    setupScroll();

    // Tabs: click + arrow-key navigation
    const tabHandlers = dom.tabs.map((tab, i) => { const h = () => goToStage(i); tab.addEventListener('click', h); return h; });
    cleanups.push(() => dom.tabs.forEach((tab, i) => tab.removeEventListener('click', tabHandlers[i])));
    const onKey = (e) => {
      const i = dom.tabs.indexOf(document.activeElement); if (i < 0) return;
      let n = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % 3;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + 2) % 3;
      if (e.key === 'Home') n = 0; if (e.key === 'End') n = 2;
      if (n >= 0) { e.preventDefault(); dom.tabs[n].focus(); goToStage(n); }
    };
    const tablist = $('.ru3d-tabs');
    tablist.addEventListener('keydown', onKey);
    cleanups.push(() => tablist.removeEventListener('keydown', onKey));

    // Mouse parallax (normalized to the visual card, cached rect to avoid layout thrashing)
    let visualRect = null;
    const onEnter = () => { visualRect = dom.visual.getBoundingClientRect(); };
    const onMove = (e) => {
      if (!visualRect) visualRect = dom.visual.getBoundingClientRect();
      state.mx = Math.max(-1, Math.min(1, ((e.clientX - visualRect.left) / visualRect.width) * 2 - 1));
      state.my = Math.max(-1, Math.min(1, ((e.clientY - visualRect.top) / visualRect.height) * 2 - 1));
    };
    const onLeave = () => { visualRect = null; state.mx = 0; state.my = 0; };
    root.addEventListener('pointerenter', onEnter, { passive: true });
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerup', onLeave);
    root.addEventListener('pointercancel', onLeave);
    cleanups.push(() => {
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerup', onLeave);
      root.removeEventListener('pointercancel', onLeave);
    });

    // Lazy-init WebGL shortly before the section scrolls into view; pause rendering when offscreen
    if (deps.external) {
      init3D();
      if ('IntersectionObserver' in window) {
        const visIO = new IntersectionObserver((en) => { state.visible = en[0].isIntersecting; syncRunning(); }, { rootMargin: '150px 0px' });
        visIO.observe(root);
        cleanups.push(() => visIO.disconnect());
      } else { state.visible = true; }
    } else if ('IntersectionObserver' in window) {
      const nearIO = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { init3D(); nearIO.disconnect(); } }, { rootMargin: '1200px 0px' });
      nearIO.observe(root);
      const visIO = new IntersectionObserver((en) => { state.visible = en[0].isIntersecting; syncRunning(); }, { rootMargin: '250px 0px' });
      visIO.observe(root);
      cleanups.push(() => { nearIO.disconnect(); visIO.disconnect(); });
    } else { init3D(); }
    const onVis = () => syncRunning();
    document.addEventListener('visibilitychange', onVis);
    cleanups.push(() => document.removeEventListener('visibilitychange', onVis));

    // Keep the renderer sized to the viewport box
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => { if (three) three.resize(); });
      ro.observe(dom.viewport);
      cleanups.push(() => ro.disconnect());
    } else {
      const onR = () => three && three.resize();
      window.addEventListener('resize', onR); cleanups.push(() => window.removeEventListener('resize', onR));
    }
    syncRunning();
  } catch (err) {
    onFatal(err);
  }

  /** Tear everything down (SPA route changes, React unmount / StrictMode double-invoke). */
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stop();
    try { if (mm) mm.revert(); } catch (e) { /* ignore */ }
    if (panelIO) panelIO.disconnect();
    cleanups.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
    try { if (three) three.dispose(); } catch (e) { /* ignore */ }
    three = null;
    dom.viewport.querySelectorAll('canvas').forEach((c) => c.remove());
    dom.labels.innerHTML = ''; dom.report.innerHTML = '';
    dom.report.classList.remove('is-on'); dom.cta3d.classList.remove('is-on');
    root.classList.remove('is-ready', 'is-fallback', 'is-pinned', 'is-stacked', 'is-tabs', 'is-reduced');
    if (typeof window !== 'undefined' && window.RiseUpInspection3D === api) {
      delete window.RiseUpInspection3D;
    }
  }
  const api = {
    config: CONFIG, goToStage, destroy, state, get three() { return three; },
    // [3.0 host] adapter hooks
    setProgress(s) { proxy.s = clamp01(+s || 0); state.needsRender = true; },
    pause() { state.hostPaused = true; stop(); },
    resume() { state.hostPaused = false; state.needsRender = true; syncRunning(); },
  };
  if (typeof window !== 'undefined') window.RiseUpInspection3D = api;   // handy for debugging in DevTools
  return api;
}

export default initInspection3D;
