'use client';

/**
 * Scene adapter: the only bridge between the host page and the 3D scenes.
 *
 * Mount slot (server-rendered):
 *   <div class="scene" data-scene="roof|audit" data-poster="…" data-frames="/img/{scene}/{n}.avif" data-count="9|3">
 *     <img class="scene__poster" …>      ← shown first, crossfades out after the first live frame
 *   </div>
 *
 * Default path: the live WebGL scene (ES module from /scenes/{name}/scene.ts, lazy chunk).
 * Fallback path (low-tier device, no WebGL2, Save-Data, or prefers-reduced-motion): the poster and
 * the image frames, stepped by setActive / setProgress. The host owns scroll and calls
 * setProgress(p) from a ScrollTrigger (scrub 0.6), setActive(i) from the rail.
 */

export interface SceneAPI {
  setProgress(p: number): void;
  setActive(i: number): void;
  pause(): void;
  destroy(): void;
  readonly isLowTier: boolean;
}

export interface LiveSceneInstance {
  setProgress(p: number): void;
  setActive(i: number): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}

type MountFn = (
  host: HTMLElement,
  opts: { dpr: number; count: number; reducedMotion: boolean; onFirstFrame?: () => void },
) => Promise<LiveSceneInstance>;

/** Live scene registry. Each import() is its own chunk, fetched only when the slot is near. */
const MODULES: Record<string, () => Promise<{ mount: MountFn }>> = {
  roof: () => import('@/scenes/roof/scene'),
  audit: () => import('@/scenes/audit/scene'),
};

declare global {
  interface Navigator {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  }
}

/** Low tier = we serve frames instead of WebGL. All WebGL2-capable devices run live 3D. */
export function detectLowTier(): boolean {
  return false;
}

/** WebGL2 probe: creating a context spins up the GPU process (100s of ms on some devices), so it
 *  runs once, lazily, only when a scene is about to start. */
let webgl2: boolean | null = null;
function hasWebGL2(): boolean {
  if (webgl2 === null) {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2');
      webgl2 = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function mountScene(slot: HTMLElement): SceneAPI {
  const name = slot.dataset.scene ?? 'scene';
  const count = Math.max(1, Number(slot.dataset.count ?? 1));
  const framesPattern = slot.dataset.frames ?? '';
  let isLowTier = detectLowTier();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxDpr = window.innerWidth < 900 ? 1.25 : 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

  let progress = 0;
  let active = 0;
  let destroyed = false;
  let started = false;
  let visible = false;
  let live: LiveSceneInstance | null = null;
  let frames: HTMLImageElement[] = [];
  const frameOk: boolean[] = [];
  const cleanups: Array<() => void> = [];

  let layer: HTMLDivElement | null = null;
  const ensureLayer = () => {
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'scene__live';
      layer.setAttribute('aria-hidden', 'true');
      slot.appendChild(layer);
    }
    return layer;
  };

  /* ---------- fallback: image frames ---------- */
  const showFrame = (i: number) => {
    if (!frames.length) return;
    const idx = Math.min(count - 1, Math.max(0, i));
    frames.forEach((img, n) => img.classList.toggle('is-on', n === idx && frameOk[n]));
    slot.classList.toggle('is-live', !!frameOk[idx]);
  };
  const buildFrames = () => {
    if (!framesPattern || frames.length) return;
    const host = ensureLayer();
    frames = Array.from({ length: count }, (_, n) => {
      const img = new Image();
      img.decoding = 'async';
      img.alt = '';
      img.className = 'scene__frame';
      img.onload = () => {
        frameOk[n] = true;
        if (n === active) showFrame(active);
      };
      img.onerror = () => {
        frameOk[n] = false;
        img.remove();
      };
      img.src = framesPattern.replace('{scene}', name).replace('{n}', String(n + 1));
      host.appendChild(img);
      return img;
    });
  };

  /* ---------- default: live module ---------- */
  const start = async () => {
    if (started || destroyed) return;
    started = true;
    const host = ensureLayer();
    if (!isLowTier && !hasWebGL2()) {
      isLowTier = true;
    }
    slot.dataset.mode = isLowTier ? 'frames' : 'live';
    if (!isLowTier && MODULES[name]) {
      try {
        const mod = await MODULES[name]();
        if (destroyed) return;
        const inst = await mod.mount(host, {
          dpr,
          count,
          reducedMotion: reduced,
          // Poster first, then crossfade to the canvas as soon as it has drawn a frame.
          onFirstFrame: () => !destroyed && slot.classList.add('is-live'),
        });
        if (destroyed) return inst.destroy();
        live = inst;
        live.setProgress(progress);
        visible ? live.resume() : live.pause();
        return;
      } catch (err) {
        console.warn(`[scene:${name}] live scene failed, using frames`, err);
        slot.dataset.mode = 'frames';
      }
    }
    buildFrames();
    showFrame(active);
  };

  // Start when within ~2.2 viewports so mobile touch-scrolling never hits an unmounted scene.
  const near = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        near.disconnect();
        requestAnimationFrame(() => start());
      }
    },
    { rootMargin: '220% 0px 220% 0px' },
  );
  near.observe(slot);
  cleanups.push(() => near.disconnect());

  // Pause rendering when offscreen.
  const onScreen = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false;
    if (live) visible ? live.resume() : live.pause();
  });
  onScreen.observe(slot);
  cleanups.push(() => onScreen.disconnect());

  return {
    get isLowTier() {
      return isLowTier;
    },
    setProgress(p: number) {
      progress = clamp01(p);
      if (live) live.setProgress(progress);
      else if (frames.length) {
        active = Math.round(progress * (count - 1));
        showFrame(active);
      }
    },
    setActive(i: number) {
      active = Math.min(count - 1, Math.max(0, i));
      progress = count > 1 ? active / (count - 1) : 0;
      if (live) live.setActive(active);
      else showFrame(active);
    },
    pause() {
      live?.pause();
    },
    destroy() {
      destroyed = true;
      cleanups.forEach((fn) => fn());
      live?.destroy();
      live = null;
      layer?.remove();
      slot.classList.remove('is-live');
    },
  };
}
