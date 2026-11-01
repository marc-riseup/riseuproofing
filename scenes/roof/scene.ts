/**
 * "How a Roof Works" live scene — ES module behind the host adapter API.
 *
 * Everything that makes the picture is reused from Riseup 2.0 unchanged:
 *   proceduralTextures.ts, proceduralRoofBuilder.ts, modelLoader.ts (9-layer procedural model),
 *   roofExplorerConfig.ts + roofLayers.ts (camera keys, gaps, step mapping),
 *   choreography.ts (evaluateScrollChoreography, verbatim).
 * This file is a vanilla port of the R3F wrapper `InnerRoofScene` (RoofCanvas3D.tsx): same
 * light rig, PMREM RoomEnvironment, per-frame lerp, rim light and callout projection.
 * Removed: its own scroll subscription and drag-orbit. The host drives progress via setProgress().
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ROOF_EXPLORER_CONFIG, ROOF_LAYERS } from './roofExplorerConfig';
import { cardStepFromProgress, progressForStep } from './roofLayers';
import { evaluateScrollChoreography, INITIAL_RIG, type CameraRig } from './choreography';
import { loadRoofAssembly } from './modelLoader';
import type { LoadedRoofAssembly } from './proceduralRoofBuilder';

export interface MountOptions {
  dpr: number;
  count: number;
  reducedMotion: boolean;
  /** Fires once, after the first frame with the model has been drawn. */
  onFirstFrame?: () => void;
  /** Fires when the active layer (0-based) changes. */
  onActive?: (i: number) => void;
}

export interface RoofSceneInstance {
  setProgress(p: number): void;
  setActive(i: number): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  readonly canvas: HTMLCanvasElement;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Host progress q (0..1) → original section progress p.
 * Knots: q = i/8 lands exactly on the centre of layer i+1's window (progressForStep), so the host's
 * rail/card index (round(q*8)) and the model's active layer always agree, and q=1 is the fully
 * exploded stack with layer 09 lit. Linear between knots → continuous scrubbing in both directions.
 */
const KNOTS = Array.from({ length: 9 }, (_, i) => progressForStep(i + 1));
function hostToSection(q: number): number {
  const x = clamp01(q) * 8;
  const i = Math.min(7, Math.floor(x));
  return KNOTS[i] + (KNOTS[i + 1] - KNOTS[i]) * (x - i);
}

export async function mount(host: HTMLElement, opts: MountOptions): Promise<RoofSceneInstance> {
  let isMobile = window.matchMedia('(max-width: 899px)').matches;
  const maxDpr = isMobile ? ROOF_EXPLORER_CONFIG.quality.maxDprMobile : ROOF_EXPLORER_CONFIG.quality.maxDprDesktop;

  /* ---------- renderer: transparent so the page sky shows through ---------- */
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr, opts.dpr || maxDpr));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'scene__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(ROOF_EXPLORER_CONFIG.cameraFov, 1, 0.5, 60);
  camera.position.set(12, 6, 12);

  /* ---------- 1. PMREM RoomEnvironment (as in the original) ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envRT = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.5;
  roomEnv.dispose();
  pmrem.dispose();

  /* ---------- light rig (verbatim values from the JSX) ---------- */
  const shadowMapSize = isMobile ? ROOF_EXPLORER_CONFIG.quality.shadowMapMobile : ROOF_EXPLORER_CONFIG.quality.shadowMapDesktop;
  scene.add(new THREE.HemisphereLight('#CFE6FF', '#E7DCC8', 0.62));
  const sun = new THREE.DirectionalLight('#FFF4E2', 3.1);
  sun.position.set(9.5, 11.5, 6.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  Object.assign(sun.shadow.camera, { left: -5.8, right: 5.8, top: 5.8, bottom: -5.8, near: 2.0, far: 34.0 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 3;
  scene.add(sun);
  const fills: Array<[number, number, number, number, string]> = [
    [-8.0, 5.0, 7.5, 0.75, '#D7ECFF'],
    [-4.0, 6.5, -8.0, 1.0, '#FFE7B8'],
    [2.0, -6.0, 4.0, 0.25, '#F3E6D2'],
  ];
  for (const [x, y, z, i, c] of fills) {
    const l = new THREE.DirectionalLight(c, i);
    l.position.set(x, y, z);
    scene.add(l);
  }
  const rim = new THREE.PointLight('#F9C500', 0, 6.5, 2);
  rim.position.set(3.2, 1.4, 3.4);
  scene.add(rim);
  const pivot = new THREE.Group();
  scene.add(pivot);

  /* ---------- hotspot ring (the original leader ring + dot, SVG over the canvas) ---------- */
  const svgNS = 'http://www.w3.org/2000/svg';
  const hotspot = document.createElementNS(svgNS, 'svg');
  hotspot.setAttribute('class', 'scene__hotspot');
  hotspot.setAttribute('aria-hidden', 'true');
  const ring = document.createElementNS(svgNS, 'circle');
  ring.setAttribute('class', 'scene__hotspot-ring');
  ring.setAttribute('r', '13');
  const dot = document.createElementNS(svgNS, 'circle');
  dot.setAttribute('class', 'scene__hotspot-dot');
  dot.setAttribute('r', '4.5');
  hotspot.append(ring, dot);
  host.appendChild(hotspot);

  /* ---------- state ---------- */
  let assembly: LoadedRoofAssembly | null = null;
  let q = 0;
  let p = hostToSection(0);
  let destroyed = false;
  let paused = false;
  let visible = true;
  let raf = 0;
  let lastT = 0;
  let firstFrameSent = false;
  let lastActive = -1;
  let hasSnapped = false;
  let width = 1;
  let height = 1;
  let ptrX = 0;
  let ptrY = 0;
  let curPtrX = 0;
  let curPtrY = 0;
  const curLayerY = new Array<number>(9).fill(0);
  const curHighlights = new Array<number>(9).fill(0);
  const curDims = new Array<number>(9).fill(0);
  const curRig: CameraRig = { ...INITIAL_RIG, target: [...INITIAL_RIG.target] };
  const tmpTarget = new THREE.Vector3();
  const projVec = new THREE.Vector3();

  /* ---------- sizing: ResizeObserver ---------- */
  const resize = () => {
    isMobile = window.innerWidth < 900;
    const r = host.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    hotspot.setAttribute('viewBox', `0 0 ${width} ${height}`);
    kick();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  /* ---------- pointer & touch parallax ---------- */
  const onPtrMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ptrX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    ptrY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    kick();
  };
  const onPtrReset = () => {
    ptrX = 0;
    ptrY = 0;
    kick();
  };
  host.addEventListener('pointermove', onPtrMove, { passive: true });
  host.addEventListener('pointerleave', onPtrReset, { passive: true });
  host.addEventListener('pointerup', onPtrReset, { passive: true });
  host.addEventListener('pointercancel', onPtrReset, { passive: true });

  /* ---------- pause offscreen: IntersectionObserver ---------- */
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false;
    visible ? kick() : stop();
  });
  io.observe(host);
  const onVis = () => (document.hidden ? stop() : kick());
  document.addEventListener('visibilitychange', onVis);

  /* ---------- 4. per-frame lerp choreography (port of useFrame) ---------- */
  function frame(now: number) {
    raf = 0;
    if (destroyed || paused || !visible || document.hidden || !assembly) return;
    const delta = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60;
    lastT = now;
    const dtMs = delta * 1000;
    const explodeScale = isMobile ? ROOF_EXPLORER_CONFIG.explodeScaleMobile : ROOF_EXPLORER_CONFIG.explodeScaleDesktop;
    const target = evaluateScrollChoreography(p, explodeScale);
    const k = hasSnapped && !opts.reducedMotion ? 1 - Math.pow(1 - ROOF_EXPLORER_CONFIG.lerpFactor, Math.min(2.5, dtMs / 16.67)) : 1;
    hasSnapped = true;
    let maxDelta = 0;

    for (let i = 0; i < 9; i++) {
      const handle = assembly.layers[i];
      const ty = target.layerY[i];
      const cy = curLayerY[i] + (ty - curLayerY[i]) * k;
      maxDelta = Math.max(maxDelta, Math.abs(ty - cy));
      curLayerY[i] = cy;
      handle.group.position.y = handle.basePosition.y + cy;
      curHighlights[i] += (target.highlights[i] - curHighlights[i]) * k;
      curDims[i] += (target.dims[i] - curDims[i]) * k;
      handle.setVisualState(curHighlights[i], curDims[i]);
    }

    const rig = curRig;
    const tr = target.rig;
    rig.azimuth += (tr.azimuth - rig.azimuth) * k;
    rig.elevation += (tr.elevation - rig.elevation) * k;
    rig.frameW += (tr.frameW - rig.frameW) * k;
    rig.frameH += (tr.frameH - rig.frameH) * k;
    for (let a = 0; a < 3; a++) {
      rig.target[a] += (tr.target[a] - rig.target[a]) * k;
      maxDelta = Math.max(maxDelta, Math.abs(tr.target[a] - rig.target[a]));
    }
    maxDelta = Math.max(maxDelta, Math.abs(tr.azimuth - rig.azimuth), Math.abs(tr.elevation - rig.elevation), Math.abs(tr.frameH - rig.frameH) * 0.1);

    // Camera drift: the original orbit (azimuth/elevation keys) plus a slight host-progress yaw + pointer/touch parallax.
    curPtrX += (ptrX - curPtrX) * k;
    curPtrY += (ptrY - curPtrY) * k;
    maxDelta = Math.max(maxDelta, Math.abs(ptrX - curPtrX), Math.abs(ptrY - curPtrY));
    const drift = (q - 0.5) * 0.14 + curPtrX * 0.08;
    const aspect = width / Math.max(1, height);
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = isMobile ? 1.04 : 1.04;
    const dist = Math.max((rig.frameH * fit) / 2 / tanV, (rig.frameW * fit) / 2 / (tanV * aspect));
    const az = rig.azimuth + drift;
    const el = Math.max(-0.12, Math.min(1.25, rig.elevation - curPtrY * 0.04));
    const ce = Math.cos(el);
    tmpTarget.set(rig.target[0], rig.target[1], rig.target[2]);
    camera.position.set(rig.target[0] + Math.sin(az) * ce * dist, rig.target[1] + Math.sin(el) * dist, rig.target[2] + Math.cos(az) * ce * dist);
    camera.lookAt(tmpTarget);
    if (camera.far < dist + 20) {
      camera.far = dist + 20;
      camera.updateProjectionMatrix();
    }

    // Sunshine Gold rim light near the active layer
    if (target.activeLayer >= 1) {
      rim.position.set(3.2, curLayerY[target.activeLayer - 1] + 1.4, 3.4);
      rim.intensity = 1.2;
    } else rim.intensity = 0;

    // Hotspot ring → projected callout anchor of the card's layer
    const step = cardStepFromProgress(p);
    if (step >= 1 && step <= 9) {
      const handle = assembly.layers[step - 1];
      if (handle.calloutAnchor) projVec.copy(handle.calloutAnchor);
      else projVec.set(...ROOF_LAYERS[step - 1].calloutAnchor);
      handle.group.localToWorld(projVec);
      projVec.project(camera);
      const sx = clamp01((projVec.x + 1) * 0.5) * width;
      const sy = clamp01((-projVec.y + 1) * 0.5) * height;
      for (const c of [ring, dot]) {
        c.setAttribute('cx', sx.toFixed(1));
        c.setAttribute('cy', sy.toFixed(1));
      }
      hotspot.style.opacity = '1';
      if (step - 1 !== lastActive) {
        lastActive = step - 1;
        ring.classList.remove('is-pulse');
        requestAnimationFrame(() => ring.classList.add('is-pulse'));
        opts.onActive?.(lastActive);
      }
    }

    renderer.render(scene, camera);
    if (!firstFrameSent) {
      firstFrameSent = true;
      opts.onFirstFrame?.();
    }
    // Demand loop: keep going only while the lerp is still settling.
    if (maxDelta > 0.00035) raf = requestAnimationFrame(frame);
    else lastT = 0;
  }
  function kick() {
    if (!raf && !destroyed && !paused && visible && !document.hidden && assembly) raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastT = 0;
  }

  /* ---------- 2. load the procedural model (idle-sliced textures) ---------- */
  resize();
  const loaded = await loadRoofAssembly({ isMobile, maxAnisotropy: renderer.capabilities.getMaxAnisotropy() });
  if (destroyed) {
    loaded.dispose();
  } else {
    assembly = loaded;
    pivot.add(loaded.root);
    if (typeof renderer.compileAsync === 'function') {
      await renderer.compileAsync(scene, camera);
    }
    if (destroyed) {
      pivot.remove(loaded.root);
      loaded.dispose();
      assembly = null;
    } else {
      // Warm up and render the first frame immediately even if not yet scrolled into view
      const wasVisible = visible;
      const wasPaused = paused;
      visible = true;
      paused = false;
      frame(performance.now());
      visible = wasVisible;
      paused = wasPaused;
      kick();
    }
  }

  return {
    canvas,
    setProgress(next: number) {
      q = clamp01(next);
      p = hostToSection(q);
      kick();
    },
    setActive(i: number) {
      q = clamp01(i / 8);
      p = hostToSection(q);
      kick();
    },
    pause() {
      paused = true;
      stop();
    },
    resume() {
      paused = false;
      kick();
    },
    destroy() {
      destroyed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onPtrMove);
      host.removeEventListener('pointerleave', onPtrReset);
      host.removeEventListener('pointerup', onPtrReset);
      host.removeEventListener('pointercancel', onPtrReset);
      document.removeEventListener('visibilitychange', onVis);
      if (assembly) {
        pivot.remove(assembly.root);
        assembly.dispose();
        assembly = null;
      }
      envRT.dispose();
      scene.environment = null;
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      hotspot.remove();
    },
  };
}
