/**
 * "Free 21-Point Audit" live scene — ES module behind the host adapter API.
 *
 * Reuses the Riseup 2.0 engine (inspectionEngine.js: Spanish-tile house, orbiting drone + scan grid,
 * GLSL thermal attic cutaway, 3D callouts, holographic report) and its scoped stylesheet unchanged.
 * The markup below is the engine's own visual card from HealthAuditSection.tsx (HUD pill, viewport,
 * stage overlays, report). The engine runs in `external` mode: no ScrollTrigger of its own; the host
 * calls setProgress(s) with s = 0..1 across the three stages.
 */
import * as THREE from 'three';
import { initInspection3D } from './inspectionEngine';
import './health-audit-3d.css';

export interface MountOptions {
  dpr: number;
  count: number;
  reducedMotion: boolean;
  onFirstFrame?: () => void;
}

type EngineApi = ReturnType<typeof initInspection3D>;

const MARKUP = `
<div class="ru3d" data-active-stage="1">
  <div class="ru3d-tabs" role="presentation" hidden></div>
  <div class="ru3d-visual">
    <div class="ru3d-hud">
      <span class="ru3d-hud__pill"><span class="ru3d-dot"></span><span data-hud-title>01 · Drone Roof Scan</span></span>
      <span class="ru3d-hud__code" data-hud-code>CSLB #1096492 · San Diego, CA</span>
    </div>
    <div class="ru3d-viewport" data-stage="0">
      <div class="ru3d-labels"></div>
      <div class="ru3d-ov ru3d-rec"><span>Live Drone Roof Pass</span><span data-scan-readout>Checking every slope &amp; valley</span></div>
      <div class="ru3d-ov ru3d-flir">
        <i class="ru3d-flir__c"></i><i class="ru3d-flir__c"></i><i class="ru3d-flir__c"></i><i class="ru3d-flir__c"></i>
        <div class="ru3d-flir__meta">Attic Moisture &amp; Airflow Check</div>
        <div class="ru3d-flir__x"></div><div class="ru3d-flir__scale"></div><div class="ru3d-flir__line"></div>
      </div>
      <div class="ru3d-ov ru3d-report"></div>
      <div class="ru3d-ov ru3d-cta3d" hidden>
        <a class="ru3d-hbtn" href="/sample-21-point-report.pdf" data-link="download" tabindex="-1">See a sample report (PDF)</a>
        <a class="ru3d-hbtn" href="#inspect" data-link="schedule" tabindex="-1">Book Free Inspection</a>
      </div>
    </div>
  </div>
</div>`;

export async function mount(host: HTMLElement, opts: MountOptions) {
  const wrap = document.createElement('div');
  wrap.className = 'scene__engine';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = MARKUP;
  host.appendChild(wrap);
  const root = wrap.firstElementChild as HTMLElement;

  let fired = false;
  const api: EngineApi = initInspection3D(root, {
    THREE,
    external: true,
    onFirstFrame: () => {
      if (fired) return;
      fired = true;
      opts.onFirstFrame?.();
    },
  });
  // The in-scene links point at the old site; keep the host's targets.
  (api.config as { links: Record<string, string> }).links = { download: '/sample-21-point-report.pdf', schedule: '#inspect' };

  const canvas = () => root.querySelector('canvas');

  return {
    get canvas() {
      return canvas();
    },
    setProgress(p: number) {
      api.setProgress(p);
    },
    setActive(i: number) {
      api.setProgress([0, 0.5, 1][Math.max(0, Math.min(2, i))]);
    },
    pause() {
      api.pause();
    },
    resume() {
      api.resume();
    },
    destroy() {
      api.destroy();
      wrap.remove();
    },
  };
}
