import type * as THREE from 'three';

export interface Inspection3DDeps {
  THREE?: typeof THREE;
  gsap?: unknown;
  ScrollTrigger?: unknown;
  /** [3.0 host] skip the engine's own ScrollTrigger; progress comes from setProgress() */
  external?: boolean;
  /** [3.0 host] called once after the first WebGL frame */
  onFirstFrame?: () => void;
}

export interface Inspection3DInstance {
  destroy: () => void;
  goToStage: (index: number) => void;
  config: Record<string, unknown>;
  state: Record<string, unknown>;
  three: unknown;
  /** [3.0 host] */
  setProgress: (s: number) => void;
  pause: () => void;
  resume: () => void;
}

export declare function initInspection3D(
  root: HTMLElement | null,
  deps?: Inspection3DDeps
): Inspection3DInstance;

export default initInspection3D;
