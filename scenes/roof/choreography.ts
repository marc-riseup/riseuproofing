/* Extracted verbatim from Riseup 2.0 components/roof-explorer/RoofCanvas3D.tsx (lines 59-177):
   the scroll choreography that maps progress p (0..1) to layer offsets, highlight, dim and camera rig. */
import { ROOF_EXPLORER_CONFIG } from './roofExplorerConfig';
import { CLOSING_AT, SEG_START, cardStepFromProgress, segmentU } from './roofLayers';
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export interface CameraRig {
  azimuth: number; // radians, from +Z toward +X
  elevation: number; // radians
  target: [number, number, number];
  frameW: number;
  frameH: number;
}

/**
 * Computes each layer's target vertical offset, active highlight (0..1),
 * dim amount (0..1), active layer index (0..9) and the camera rig from master scroll progress (0..1).
 */
export function evaluateScrollChoreography(
  progress: number,
  explodeScale: number
): {
  activeLayer: number; // 0 = overview, 1..9 = active layer
  layerY: number[]; // length 9
  highlights: number[]; // length 9
  dims: number[]; // length 9
  rig: CameraRig;
} {
  const p = clamp01(progress);

  // 0..SEG_START (0.06): Assembled roof
  // SEG_START..CLOSING_AT (0.87): 9 layer steps (explode 0 -> 1)
  // CLOSING_AT..1.00: Reverse explode (reassemble 1 -> 0) and reveal closing CTA
  const isReassembling = p >= CLOSING_AT;
  const u = isReassembling
    ? 1 - easeInOutCubic(clamp01((p - CLOSING_AT) / (1 - CLOSING_AT)))
    : segmentU(p);

  // Determine active layer (1..9 during SEG_START..CLOSING_AT, 0 outside) — matches cardStepFromProgress
  const activeLayer = p >= SEG_START && p < CLOSING_AT ? cardStepFromProgress(p) : 0;

  // 8 inter-layer gaps (between layer g and g+1) open sequentially as u progresses 0 -> 1
  const gapSizes = ROOF_EXPLORER_CONFIG.explodeGaps;
  const openedGaps = gapSizes.map((size, g) => {
    const start = g / 9;
    const span = 1.35 / 9;
    const localT = clamp01((u - start) / span);
    return easeInOutCubic(localT) * size * explodeScale;
  });

  // Accumulate vertical offsets relative to Layer 5 (index 4, the mid-plane)
  const rawY = new Array<number>(9).fill(0);
  // Layers 1..4 lift UP relative to Layer 5
  for (let i = 3; i >= 0; i--) {
    rawY[i] = rawY[i + 1] + openedGaps[i];
  }
  // Layers 6..9 drop DOWN relative to Layer 5
  for (let i = 5; i < 9; i++) {
    rawY[i] = rawY[i - 1] - openedGaps[i - 1];
  }

  // Subtle center-of-mass balance shift so the stack stays framed around y = 0
  const midShift = (rawY[0] + rawY[8]) * 0.35;
  const layerY = rawY.map((y) => y - midShift);

  // Per-layer highlight (1 for active layer) and dimming (farther layers dim slightly)
  const highlights = new Array<number>(9).fill(0);
  const dims = new Array<number>(9).fill(0);

  if (activeLayer >= 1 && activeLayer <= 9) {
    const stepFloat = u * 9; // 0..9
    for (let i = 0; i < 9; i++) {
      const center = i + 0.5;
      const dist = Math.abs(stepFloat - center);
      highlights[i] = clamp01(1 - dist * 1.35);
      dims[i] = clamp01((dist - 0.6) / 3.2);
    }
    // Extra presentation separation around the active layer. Everything above/below shifts as a
    // block so stacking order is always preserved (even where the regular gap is still closed).
    const sep = 0.07 * highlights[activeLayer - 1] * explodeScale;
    for (let i = 0; i < 9; i++) {
      if (i < activeLayer - 1) layerY[i] += sep;
      if (i > activeLayer - 1) layerY[i] -= sep;
    }
  }

  // Camera rig: smooth orbit + pull-back from the assembled hero shot to the exploded overview
  const A = ROOF_EXPLORER_CONFIG.camera.assembled;
  const E = ROOF_EXPLORER_CONFIG.camera.exploded;
  const macro = easeInOutCubic(u);
  const deg = Math.PI / 180;
  const target: [number, number, number] = [
    A.target[0] + (E.target[0] - A.target[0]) * macro,
    A.target[1] + (E.target[1] - A.target[1]) * macro,
    A.target[2] + (E.target[2] - A.target[2]) * macro,
  ];
  if (activeLayer >= 1) {
    const focusWeight = Math.sin(u * Math.PI);
    target[1] += layerY[activeLayer - 1] * ROOF_EXPLORER_CONFIG.camera.focusFollow * focusWeight;
  }

  return {
    activeLayer,
    layerY,
    highlights,
    dims,
    rig: {
      azimuth: (A.azimuthDeg + (E.azimuthDeg - A.azimuthDeg) * macro) * deg,
      elevation: (A.elevationDeg + (E.elevationDeg - A.elevationDeg) * macro) * deg,
      target,
      frameW: A.frameW + (E.frameW - A.frameW) * macro,
      frameH: A.frameH + (E.frameH - A.frameH) * macro,
    },
  };
}

const INITIAL_RIG = evaluateScrollChoreography(0, 1).rig;

export { INITIAL_RIG, easeInOutCubic };

