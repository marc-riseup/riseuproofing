/* ==========================================================================
   Rise Up — "How a Roof Works" 3D Scroll Section Configuration & Tuning Knobs
   Single source of truth for 3D scene-graph node names, anchors, and camera rig.
   Copy/labels are derived from `LAYERS` in `config/roofLayers.ts` to prevent drift.
   ========================================================================== */

import { LAYERS } from './roofLayers';

export interface RoofLayerSpec {
  /** 1-based layer number (1..9, top to bottom) */
  index: number;
  /** Exact scene-graph node name (used by both procedural builder & GLB loader) */
  nodeName: string;
  /** Display title (derived from LAYERS) */
  name: string;
  /** One-line summary (derived from LAYERS) */
  description: string;
  /** Explode translation vector [x, y, z] in world meters at 100% separation */
  explodeOffset: [number, number, number];
  /** Local 3D anchor [x, y, z] on the layer where the floating HTML leader line attaches */
  calloutAnchor: [number, number, number];
}

const LAYER_3D_SPECS: Array<Omit<RoofLayerSpec, 'name' | 'description'>> = [
  {
    index: 1,
    nodeName: 'Layer_01_RidgeCap',
    explodeOffset: [0, 2.35, 0],
    calloutAnchor: [0.25, 1.42, 0.25],
  },
  {
    index: 2,
    nodeName: 'Layer_02_ExhaustVents',
    explodeOffset: [0, 1.82, 0],
    calloutAnchor: [-1.15, 0.98, 0.85],
  },
  {
    index: 3,
    nodeName: 'Layer_03_Shingles',
    explodeOffset: [0, 1.28, 0],
    calloutAnchor: [1.25, 0.58, 1.25],
  },
  {
    index: 4,
    nodeName: 'Layer_04_Underlayment',
    explodeOffset: [0, 0.74, 0],
    calloutAnchor: [-1.25, 0.45, 1.25],
  },
  {
    index: 5,
    nodeName: 'Layer_05_IceWaterShield',
    explodeOffset: [0, 0.24, 0],
    calloutAnchor: [1.35, 0.12, 1.75],
  },
  {
    index: 6,
    nodeName: 'Layer_06_IntakeVents',
    explodeOffset: [0, -0.24, 0],
    calloutAnchor: [1.45, -0.1, 1.85],
  },
  {
    index: 7,
    nodeName: 'Layer_07_PlywoodDecking',
    explodeOffset: [0, -0.74, 0],
    calloutAnchor: [-1.2, -0.25, 1.35],
  },
  {
    index: 8,
    nodeName: 'Layer_08_RoofFraming',
    explodeOffset: [0, -1.32, 0],
    calloutAnchor: [1.25, -0.45, 1.45],
  },
  {
    index: 9,
    nodeName: 'Layer_09_Insulation',
    explodeOffset: [0, -1.92, 0],
    calloutAnchor: [-1.05, -0.85, 1.45],
  },
];

export const ROOF_LAYERS: RoofLayerSpec[] = LAYER_3D_SPECS.map((spec, i) => ({
  ...spec,
  name: LAYERS[i]?.name ?? `Layer ${spec.index}`,
  description: LAYERS[i]?.line ?? '',
}));

export const ROOF_EXPLORER_CONFIG = {
  /**
   * ▸ EDIT TO SWAP IN A GLB:
   * Set to e.g. '/assets/models/roof-assembly.glb' containing named nodes
   * Layer_01_RidgeCap through Layer_09_Insulation. Leave '' to use the procedural model.
   */
  glbUrl: '',

  /** Explode distance multipliers */
  explodeScaleDesktop: 0.88,
  explodeScaleMobile: 0.76,

  /** Pinned scroll distance in vh (snappy, responsive scroll through all 9 layers) */
  scrollLengthDesktopVh: 360,
  scrollLengthMobileVh: 260,

  /** ScrollTrigger scrub smoothing (seconds) */
  scrubSmoothing: 0.35,

  /** Per-frame inertia lerp factor */
  lerpFactor: 0.42,

  /**
   * Camera rig: 3/4 product-shot orbit looking at the front slope + stepped cutaway gable.
   * Azimuth is measured from +Z (front slope) toward +X (cutaway end). The camera distance is
   * solved every frame so `frameW × frameH` meters always fit the canvas at any aspect ratio.
   */
  cameraFov: 28,
  camera: {
    assembled: {
      azimuthDeg: -42,
      elevationDeg: 6,
      target: [0.0, 0.38, 0.0] as [number, number, number],
      frameW: 8.0,
      frameH: 5.1,
    },
    exploded: {
      azimuthDeg: -38,
      elevationDeg: 5,
      target: [0.0, 0.34, 0.0] as [number, number, number],
      frameW: 8.2,
      frameH: 7.8,
    },
    /** How much the look-at height follows the active layer while scrolling (0..1) */
    focusFollow: 0.16,
  },
  /** Vertical separation (m) opened between consecutive layers at full explode */
  explodeGaps: [0.44, 0.38, 0.36, 0.32, 0.32, 0.38, 0.54, 0.58],

  /** Renderer quality knobs */
  quality: {
    maxDprDesktop: 1.5,
    maxDprMobile: 1.25,
    shadowMapDesktop: 1024,
    shadowMapMobile: 1024,
    textureSizeDesktop: 512 as 512 | 1024,
    textureSizeMobile: 512 as 512 | 1024,
  },
};
