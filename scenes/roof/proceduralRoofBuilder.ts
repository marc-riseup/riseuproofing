import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ROOF_LAYERS, type RoofLayerSpec } from './roofExplorerConfig';
import { createSeededRng, type ProceduralTextureSet } from './proceduralTextures';

export interface RoofLayerHandle {
  index: number;
  spec: RoofLayerSpec;
  group: THREE.Group;
  bbox: THREE.Box3;
  basePosition: THREE.Vector3;
  explodeOffset: THREE.Vector3;
  materials: THREE.MeshStandardMaterial[];
  /** Builder-computed callout anchor in layer-local space (falls back to spec.calloutAnchor) */
  calloutAnchor?: THREE.Vector3;
  /** Updates active highlight (0..1) and non-active dimming (0..1) without reallocating */
  setVisualState: (highlight: number, dim: number) => void;
}

export interface LoadedRoofAssembly {
  root: THREE.Group;
  layers: RoofLayerHandle[];
  stats: {
    drawCalls: number;
    triangles: number;
  };
  dispose: () => void;
}

/* ==========================================================================
   ROOF GEOMETRY (meters)
   Ridge runs along X, slopes face ±Z, stepped cutaway faces the camera at +X.
   9:12 pitch gable on raised-heel W (Fink) trusses @ 24" O.C.
   ========================================================================== */
const PITCH = 9 / 12;
const SLOPE = Math.atan(PITCH);
const COS = Math.cos(SLOPE);
const SIN = Math.sin(SLOPE);

const X_MIN = -2.7;
const X_MAX = 2.7;
const WALL_RUN = 2.1; // ridge → outside face of wall top plate
const EAVE_RUN = 2.42; // ridge → plumb-cut rafter tails
const HEEL = 0.26; // raised energy heel height
const RIDGE_TOP = HEEL + WALL_RUN * PITCH; // top-of-chord plane at the ridge
const CHORD_D = 0.14; // 2x6 top chord depth (perpendicular)
const CHORD_V = CHORD_D / COS; // vertical depth of top chord
const CHORD_W = 0.045;
const BOTTOM_CHORD_H = 0.14;
const WEB_D = 0.089;
const WEB_W = 0.04;
const TRUSS_COUNT = 10;
const TRUSS_SPACING = 0.585;
const TRUSS_X0 = -((TRUSS_COUNT - 1) * TRUSS_SPACING) / 2;
const FASCIA_T = 0.022;
const FASCIA_H = 0.19;
const RAKE_X = X_MIN - FASCIA_T;
const EAVE_V = (EAVE_RUN + FASCIA_T) / COS; // along-slope distance ridge → deck edge
const SLOT_V = 0.055; // deck stops short of ridge for the ridge-vent slot
const PLY_T = 0.019;

/* Every layer runs the full roof length (clean exploded-diagram look); the +X gable end is left
   open so the trusses and insulation read in profile */
const LAYER_X1 = X_MAX + FASCIA_T;
const PLY_END = LAYER_X1;
const IW_END = LAYER_X1;
const UL_END = LAYER_X1;
const SHINGLE_END = LAYER_X1 + 0.02;
const RIDGE_VENT_END = LAYER_X1 + 0.005;
const CAP_END = LAYER_X1 + 0.03;

/* Shingle course geometry (Duration®-style laminated architectural) */
const SH_EXP = 0.19;
const SH_STRIP = 0.31;
const SH_T = 0.0055;
const SH_N0 = 0.029;
const SH_TILT = 0.016;

const roofY = (r: number) => RIDGE_TOP - r * PITCH;
const trussX = (i: number) => TRUSS_X0 + i * TRUSS_SPACING;

type V3 = [number, number, number];
type RGB = [number, number, number];
type UV = [number, number];
type P2 = [number, number];
const WHITE: RGB = [1, 1, 1];
const tint = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** [z, y] world coords of a point at along-slope distance v and normal offset n */
function slopeYZ(side: 1 | -1, v: number, n: number): P2 {
  return [side * (v * COS + n * SIN), RIDGE_TOP - v * SIN + n * COS];
}
function slopePoint(side: 1 | -1, u: number, v: number, n: number): THREE.Vector3 {
  const [z, y] = slopeYZ(side, v, n);
  return new THREE.Vector3(u, y, z);
}

/** Slope-local frame: local x = u (along ridge), y = n (outward normal), z = v (down-slope) */
function makeSlopeMatrix(side: 1 | -1): THREE.Matrix4 {
  return new THREE.Matrix4()
    .makeBasis(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, COS, side * SIN),
      new THREE.Vector3(0, -SIN, side * COS)
    )
    .setPosition(0, RIDGE_TOP, 0);
}
const SLOPE_M: Record<1 | -1, THREE.Matrix4> = { 1: makeSlopeMatrix(1), [-1]: makeSlopeMatrix(-1) };

function slopeLocal(side: 1 | -1, u: number, n: number, v: number): THREE.Matrix4 {
  return SLOPE_M[side].clone().multiply(new THREE.Matrix4().makeTranslation(u, n, v));
}

/** Truss-plane frame: local (a, b, c) → world (x + c, b, a). Profiles drawn in world (z, y). */
function trussPlane(x: number): THREE.Matrix4 {
  return new THREE.Matrix4()
    .makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0))
    .setPosition(x, 0, 0);
}

/** Box frame whose local Z runs from p1 to p2, local X aligned with `sideHint` */
function beamMatrix(p1: V3, p2: V3, sideHint: V3 = [1, 0, 0]): { m: THREE.Matrix4; len: number } {
  const a = new THREE.Vector3(...p1);
  const b = new THREE.Vector3(...p2);
  const Z = b.clone().sub(a);
  const len = Z.length();
  Z.normalize();
  const X = new THREE.Vector3(...sideHint);
  X.sub(Z.clone().multiplyScalar(X.dot(Z))).normalize();
  const Y = new THREE.Vector3().crossVectors(Z, X);
  const m = new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(a.add(b).multiplyScalar(0.5));
  return { m, len };
}

/* ==========================================================================
   GEOMETRY BUCKET — merges thousands of individually-UV'd, individually-tinted
   pieces into one draw call per material. Winding is derived from normals so
   mirrored transforms (back slope) are always correct.
   ========================================================================== */
class GeoBucket {
  private pos: number[] = [];
  private nrm: number[] = [];
  private uvs: number[] = [];
  private col: number[] = [];
  private m = new THREE.Matrix4();
  private nm = new THREE.Matrix3();
  private flip = false;
  private tv = new THREE.Vector3();

  setMatrix(m?: THREE.Matrix4) {
    if (m) this.m.copy(m);
    else this.m.identity();
    this.nm.getNormalMatrix(this.m);
    this.flip = this.m.determinant() < 0;
  }

  private push(p: V3, n: V3, uv: UV, c: RGB) {
    this.tv.set(p[0], p[1], p[2]).applyMatrix4(this.m);
    this.pos.push(this.tv.x, this.tv.y, this.tv.z);
    this.tv.set(n[0], n[1], n[2]).applyMatrix3(this.nm).normalize();
    this.nrm.push(this.tv.x, this.tv.y, this.tv.z);
    this.uvs.push(uv[0], uv[1]);
    this.col.push(c[0], c[1], c[2]);
  }

  tri(p: [V3, V3, V3], n: [V3, V3, V3], uv: [UV, UV, UV], c: [RGB, RGB, RGB]) {
    const e1x = p[1][0] - p[0][0];
    const e1y = p[1][1] - p[0][1];
    const e1z = p[1][2] - p[0][2];
    const e2x = p[2][0] - p[0][0];
    const e2y = p[2][1] - p[0][1];
    const e2z = p[2][2] - p[0][2];
    const fx = e1y * e2z - e1z * e2y;
    const fy = e1z * e2x - e1x * e2z;
    const fz = e1x * e2y - e1y * e2x;
    const nx = n[0][0] + n[1][0] + n[2][0];
    const ny = n[0][1] + n[1][1] + n[2][1];
    const nz = n[0][2] + n[1][2] + n[2][2];
    let swap = fx * nx + fy * ny + fz * nz < 0;
    if (this.flip) swap = !swap;
    const order = swap ? [0, 2, 1] : [0, 1, 2];
    for (const k of order) this.push(p[k], n[k], uv[k], c[k]);
  }

  /** Planar convex polygon with a single normal */
  poly(pts: V3[], n: V3, uv: UV[], c: RGB | RGB[]) {
    const cols = (Array.isArray(c[0]) ? c : pts.map(() => c)) as RGB[];
    for (let i = 1; i < pts.length - 1; i++) {
      this.tri([pts[0], pts[i], pts[i + 1]], [n, n, n], [uv[0], uv[i], uv[i + 1]], [
        cols[0],
        cols[i],
        cols[i + 1],
      ]);
    }
  }

  get isEmpty() {
    return this.pos.length === 0;
  }

  toGeometry(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

/* ── Primitive emitters ──────────────────────────────────────────────────── */

const dominantAxis = (n: V3) => {
  const ax = Math.abs(n[0]);
  const ay = Math.abs(n[1]);
  const az = Math.abs(n[2]);
  return ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
};

interface BoxOpts {
  w: number;
  h: number;
  l: number;
  matrix: THREE.Matrix4;
  chamfer?: number;
  uvScale?: UV;
  uvOffset?: UV;
  /** Axis the texture V (grain) follows */
  grain?: 'z' | 'x';
  color?: RGB;
  endTint?: number;
}

/** Box with optional 45° chamfered (eased) edges that catch highlights like real lumber */
function addBox(b: GeoBucket, o: BoxOpts) {
  b.setMatrix(o.matrix);
  const half = [o.w / 2, o.h / 2, o.l / 2];
  const c = Math.min(o.chamfer ?? 0, half[0] * 0.45, half[1] * 0.45, half[2] * 0.45);
  const [su, sv] = o.uvScale ?? [1, 1];
  const [ou, ov] = o.uvOffset ?? [0, 0];
  const color = o.color ?? WHITE;
  const grainAxis = o.grain === 'x' ? 0 : 2;
  const endTint = o.endTint ?? 0.78;

  const uvOf = (p: V3, dom: number): UV => {
    let u: number;
    let v: number;
    if (grainAxis === 2) {
      if (dom === 0) [u, v] = [p[1], p[2]];
      else if (dom === 1) [u, v] = [p[0], p[2]];
      else [u, v] = [p[0], p[1]];
    } else {
      if (dom === 0) [u, v] = [p[1], p[2]];
      else if (dom === 1) [u, v] = [p[2], p[0]];
      else [u, v] = [p[1], p[0]];
    }
    return [u * su + ou, v * sv + ov];
  };
  const emit = (pts: V3[], n: V3) => {
    const dom = dominantAxis(n);
    const col = dom === grainAxis ? tint(color, endTint) : color;
    b.poly(
      pts,
      n,
      pts.map((p) => uvOf(p, dom)),
      col
    );
  };

  for (let k = 0; k < 3; k++) {
    for (const s of [-1, 1]) {
      const i = (k + 1) % 3;
      const j = (k + 2) % 3;
      const pts: V3[] = [];
      for (const [a, bb] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ]) {
        const p: V3 = [0, 0, 0];
        p[k] = s * half[k];
        p[i] = a * (half[i] - c);
        p[j] = bb * (half[j] - c);
        pts.push(p);
      }
      const n: V3 = [0, 0, 0];
      n[k] = s;
      emit(pts, n);
    }
  }
  if (c <= 0) return;
  for (let k1 = 0; k1 < 3; k1++) {
    for (let k2 = k1 + 1; k2 < 3; k2++) {
      const k3 = 3 - k1 - k2;
      for (const s1 of [-1, 1]) {
        for (const s2 of [-1, 1]) {
          const mk = (s3: number, first: boolean): V3 => {
            const p: V3 = [0, 0, 0];
            p[k1] = s1 * (first ? half[k1] : half[k1] - c);
            p[k2] = s2 * (first ? half[k2] - c : half[k2]);
            p[k3] = s3 * (half[k3] - c);
            return p;
          };
          const n: V3 = [0, 0, 0];
          n[k1] = s1 * Math.SQRT1_2;
          n[k2] = s2 * Math.SQRT1_2;
          emit([mk(-1, true), mk(-1, false), mk(1, false), mk(1, true)], n);
        }
      }
    }
  }
  const inv = 1 / Math.sqrt(3);
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        emit(
          [
            [sx * half[0], sy * (half[1] - c), sz * (half[2] - c)],
            [sx * (half[0] - c), sy * half[1], sz * (half[2] - c)],
            [sx * (half[0] - c), sy * (half[1] - c), sz * half[2]],
          ],
          [sx * inv, sy * inv, sz * inv]
        );
      }
    }
  }
}

interface PrismOpts {
  /** Profile polygon in local XY */
  poly: P2[];
  z0: number;
  z1: number;
  matrix: THREE.Matrix4;
  uvScale?: UV;
  uvOffset?: UV;
  /** 2D direction (in profile plane) the texture V/grain follows */
  grainDir?: P2;
  color?: RGB;
  capTint?: number;
  caps?: boolean;
}

/** Extrudes an arbitrary (possibly concave) profile along local Z */
function addPrism(b: GeoBucket, o: PrismOpts) {
  b.setMatrix(o.matrix);
  let pts = o.poly;
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const c = pts[(i + 1) % pts.length];
    area += a[0] * c[1] - c[0] * a[1];
  }
  if (area < 0) pts = pts.slice().reverse();
  const [su, sv] = o.uvScale ?? [1, 1];
  const [ou, ov] = o.uvOffset ?? [0, 0];
  const gd = o.grainDir ?? [0, 1];
  const gl = Math.hypot(gd[0], gd[1]);
  const g: P2 = [gd[0] / gl, gd[1] / gl];
  const gp: P2 = [-g[1], g[0]];
  const color = o.color ?? WHITE;
  const capCol = tint(color, o.capTint ?? 0.9);

  if (o.caps !== false) {
    const tris = THREE.ShapeUtils.triangulateShape(
      pts.map((p) => new THREE.Vector2(p[0], p[1])),
      []
    );
    for (const [z, nz] of [
      [o.z0, -1],
      [o.z1, 1],
    ] as const) {
      for (const t of tris) {
        const P = t.map((i) => [pts[i][0], pts[i][1], z] as V3);
        const uv = t.map(
          (i) =>
            [
              (pts[i][0] * gp[0] + pts[i][1] * gp[1]) * su + ou,
              (pts[i][0] * g[0] + pts[i][1] * g[1]) * sv + ov,
            ] as UV
        );
        b.poly(P, [0, 0, nz], uv, capCol);
      }
    }
  }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const c = pts[(i + 1) % pts.length];
    const ex = c[0] - a[0];
    const ey = c[1] - a[1];
    const el = Math.hypot(ex, ey) || 1;
    const n: V3 = [ey / el, -ex / el, 0];
    const va = (a[0] * g[0] + a[1] * g[1]) * sv + ov;
    const vc = (c[0] * g[0] + c[1] * g[1]) * sv + ov;
    b.poly(
      [
        [a[0], a[1], o.z0],
        [c[0], c[1], o.z0],
        [c[0], c[1], o.z1],
        [a[0], a[1], o.z1],
      ],
      n,
      [
        [o.z0 * su + ou, va],
        [o.z0 * su + ou, vc],
        [o.z1 * su + ou, vc],
        [o.z1 * su + ou, va],
      ],
      color
    );
  }
}

interface SlabOpts {
  side: 1 | -1;
  /** u extents at the first row (v0) */
  u0: number;
  u1: number;
  /** u extents at the last row (v1) — enables skewed/trapezoid tabs */
  u0b?: number;
  u1b?: number;
  vRows: number[];
  segU?: number;
  /** Bottom-surface normal offset (can include displacement) */
  nBase: (u: number, v: number) => number;
  t: number;
  topColor?: (u: number, v: number) => RGB;
  sideColor?: RGB;
  bottomColor?: RGB;
  uvScale?: UV;
  uvOffset?: UV;
  bottom?: boolean;
  edges?: { v0?: boolean; v1?: boolean; u0?: boolean; u1?: boolean };
  edgeBucket?: GeoBucket;
  edgeUV01?: boolean;
  edgeUScale?: number;
}

/** Sheet material lying on a roof slope (decking, membranes, shingles) */
function addSlab(b: GeoBucket, o: SlabOpts) {
  const M = SLOPE_M[o.side];
  b.setMatrix(M);
  const eb = o.edgeBucket ?? b;
  if (o.edgeBucket) o.edgeBucket.setMatrix(M);

  const rows = o.vRows;
  const R = rows.length;
  const C = (o.segU ?? 1) + 1;
  const v0 = rows[0];
  const v1 = rows[R - 1];
  const u0b = o.u0b ?? o.u0;
  const u1b = o.u1b ?? o.u1;
  const [su, sv] = o.uvScale ?? [1, 1];
  const [ou, ov] = o.uvOffset ?? [0, 0];
  const eps = 0.002;

  const top: V3[][] = [];
  const bot: V3[][] = [];
  const nT: V3[][] = [];
  const uvT: UV[][] = [];
  const cT: RGB[][] = [];
  for (let r = 0; r < R; r++) {
    const v = rows[r];
    const f = v1 > v0 ? (v - v0) / (v1 - v0) : 0;
    const L = lerp(o.u0, u0b, f);
    const Rr = lerp(o.u1, u1b, f);
    top.push([]);
    bot.push([]);
    nT.push([]);
    uvT.push([]);
    cT.push([]);
    for (let i = 0; i < C; i++) {
      const u = lerp(L, Rr, i / (C - 1));
      const nb = o.nBase(u, v);
      top[r].push([u, nb + o.t, v]);
      bot[r].push([u, nb, v]);
      const dndu = (o.nBase(u + eps, v) - o.nBase(u - eps, v)) / (2 * eps);
      const dndv = (o.nBase(u, v + eps) - o.nBase(u, v - eps)) / (2 * eps);
      const len = Math.hypot(dndu, 1, dndv);
      nT[r].push([-dndu / len, 1 / len, -dndv / len]);
      uvT[r].push([u * su + ou, v * sv + ov]);
      cT[r].push(o.topColor ? o.topColor(u, v) : WHITE);
    }
  }

  const botCol = o.bottomColor ?? tint(WHITE, 0.62);
  for (let r = 0; r < R - 1; r++) {
    for (let i = 0; i < C - 1; i++) {
      const A: [number, number] = [r, i];
      const B: [number, number] = [r, i + 1];
      const Cc: [number, number] = [r + 1, i + 1];
      const D: [number, number] = [r + 1, i];
      for (const tri of [
        [A, B, Cc],
        [A, Cc, D],
      ]) {
        b.tri(
          tri.map(([rr, ii]) => top[rr][ii]) as [V3, V3, V3],
          tri.map(([rr, ii]) => nT[rr][ii]) as [V3, V3, V3],
          tri.map(([rr, ii]) => uvT[rr][ii]) as [UV, UV, UV],
          tri.map(([rr, ii]) => cT[rr][ii]) as [RGB, RGB, RGB]
        );
        if (o.bottom !== false) {
          b.tri(
            tri.map(([rr, ii]) => bot[rr][ii]) as [V3, V3, V3],
            tri.map(([rr, ii]) => {
              const n = nT[rr][ii];
              return [-n[0], -n[1], -n[2]] as V3;
            }) as [V3, V3, V3],
            tri.map(([rr, ii]) => uvT[rr][ii]) as [UV, UV, UV],
            [botCol, botCol, botCol]
          );
        }
      }
    }
  }

  const sc = o.sideColor ?? tint(WHITE, 0.7);
  const eu = o.edgeUScale ?? su;
  const edge = (tops: V3[], bots: V3[], n: V3) => {
    let acc = 0;
    for (let k = 0; k < tops.length - 1; k++) {
      const t0 = tops[k];
      const t1 = tops[k + 1];
      const b0 = bots[k];
      const b1 = bots[k + 1];
      const seg = Math.hypot(t1[0] - t0[0], t1[1] - t0[1], t1[2] - t0[2]);
      const ua = acc * eu + ou;
      const ub = (acc + seg) * eu + ou;
      acc += seg;
      const vt = o.edgeUV01 ? 1 : o.t * sv;
      eb.tri([t0, t1, b1], [n, n, n], [
        [ua, vt],
        [ub, vt],
        [ub, 0],
      ], [sc, sc, sc]);
      eb.tri([t0, b1, b0], [n, n, n], [
        [ua, vt],
        [ub, 0],
        [ua, 0],
      ], [sc, sc, sc]);
    }
  };
  const ed = o.edges ?? {};
  if (ed.v0 !== false) edge(top[0], bot[0], [0, 0, -1]);
  if (ed.v1 !== false) edge(top[R - 1], bot[R - 1], [0, 0, 1]);
  if (ed.u0 !== false)
    edge(
      top.map((row) => row[0]),
      bot.map((row) => row[0]),
      [-1, 0, 0]
    );
  if (ed.u1 !== false)
    edge(
      top.map((row) => row[C - 1]),
      bot.map((row) => row[C - 1]),
      [1, 0, 0]
    );
}

interface CylOpts {
  rBottom: number;
  rTop: number;
  h: number;
  seg: number;
  matrix: THREE.Matrix4;
  color?: RGB;
  topColor?: RGB;
  top?: boolean;
  bottom?: boolean;
}

/** Cylinder / cone along local +Y, base at y = 0 */
function addCylinder(b: GeoBucket, o: CylOpts) {
  b.setMatrix(o.matrix);
  const col = o.color ?? WHITE;
  const tcol = o.topColor ?? col;
  const slope = (o.rBottom - o.rTop) / o.h;
  for (let i = 0; i < o.seg; i++) {
    const a0 = (i / o.seg) * Math.PI * 2;
    const a1 = ((i + 1) / o.seg) * Math.PI * 2;
    const c0 = Math.cos(a0);
    const s0 = Math.sin(a0);
    const c1 = Math.cos(a1);
    const s1 = Math.sin(a1);
    const nl0 = Math.hypot(1, slope);
    const n0: V3 = [c0 / nl0, slope / nl0, s0 / nl0];
    const n1: V3 = [c1 / nl0, slope / nl0, s1 / nl0];
    const pb0: V3 = [c0 * o.rBottom, 0, s0 * o.rBottom];
    const pb1: V3 = [c1 * o.rBottom, 0, s1 * o.rBottom];
    const pt0: V3 = [c0 * o.rTop, o.h, s0 * o.rTop];
    const pt1: V3 = [c1 * o.rTop, o.h, s1 * o.rTop];
    const u0 = i / o.seg;
    const u1 = (i + 1) / o.seg;
    b.tri([pb0, pb1, pt1], [n0, n1, n1], [
      [u0, 0],
      [u1, 0],
      [u1, 1],
    ], [col, col, col]);
    b.tri([pb0, pt1, pt0], [n0, n1, n0], [
      [u0, 0],
      [u1, 1],
      [u0, 1],
    ], [col, col, col]);
    if (o.top !== false && o.rTop > 0) {
      b.tri([[0, o.h, 0], pt0, pt1], [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ], [
        [0.5, 0.5],
        [0.5 + c0 * 0.5, 0.5 + s0 * 0.5],
        [0.5 + c1 * 0.5, 0.5 + s1 * 0.5],
      ], [tcol, tcol, tcol]);
    }
    if (o.bottom) {
      b.tri([[0, 0, 0], pb1, pb0], [
        [0, -1, 0],
        [0, -1, 0],
        [0, -1, 0],
      ], [
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
      ], [col, col, col]);
    }
  }
}

/** Appends an indexed/non-indexed BufferGeometry with triplanar meter-UVs and a color function */
function addGeometry(
  b: GeoBucket,
  geo: THREE.BufferGeometry,
  uvScale: number,
  colorFn: (p: THREE.Vector3) => RGB
) {
  b.setMatrix();
  const pos = geo.attributes.position;
  const nrm = geo.attributes.normal;
  const idx = geo.index;
  const count = idx ? idx.count : pos.count;
  const P = new THREE.Vector3();
  const vert = (k: number) => {
    const i = idx ? idx.getX(k) : k;
    P.fromBufferAttribute(pos, i);
    const p: V3 = [P.x, P.y, P.z];
    const n: V3 = [nrm.getX(i), nrm.getY(i), nrm.getZ(i)];
    const dom = dominantAxis(n);
    const uv: UV =
      dom === 0
        ? [p[2] * uvScale, p[1] * uvScale]
        : dom === 1
          ? [p[0] * uvScale, p[2] * uvScale]
          : [p[0] * uvScale, p[1] * uvScale];
    return { p, n, uv, c: colorFn(P) };
  };
  for (let k = 0; k < count; k += 3) {
    const a = vert(k);
    const bb = vert(k + 1);
    const c = vert(k + 2);
    b.tri([a.p, bb.p, c.p], [a.n, bb.n, c.n], [a.uv, bb.uv, c.uv], [a.c, bb.c, c.c]);
  }
}

/** Smooth 3D value noise (-1..1) */
function createNoise3(seed: number) {
  const rng = createSeededRng(seed);
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const vals = new Float32Array(256);
  for (let i = 0; i < 256; i++) vals[i] = rng() * 2 - 1;
  const fade = (t: number) => t * t * (3 - 2 * t);
  const h = (x: number, y: number, z: number) =>
    vals[perm[(perm[(perm[x & 255] + y) & 255] + z) & 255]];
  return (x: number, y: number, z: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const w = fade(z - zi);
    const x0 = lerp(h(xi, yi, zi), h(xi + 1, yi, zi), u);
    const x1 = lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u);
    const x2 = lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u);
    const x3 = lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u);
    return lerp(lerp(x0, x1, v), lerp(x2, x3, v), w);
  };
}

/**
 * Builds the 9-layer procedural 9:12 gable roof assembly as a stepped cutaway.
 * Every repeated element (shingle tabs, sheets, truss members, plates, nails) is merged into
 * one draw call per material while keeping per-piece UV offsets and tones for realism.
 */
export function buildProceduralRoofAssembly(
  textures: ProceduralTextureSet,
  isMobile = false
): LoadedRoofAssembly {
  const rng = createSeededRng(1096492);
  const tx = textures;
  const root = new THREE.Group();
  root.name = 'RoofAssemblyRoot';

  const layerGroups = new Map<number, THREE.Group>();
  const layerMaterials = new Map<number, THREE.MeshStandardMaterial[]>();
  const anchors = new Map<number, THREE.Vector3>();
  ROOF_LAYERS.forEach((spec) => {
    const g = new THREE.Group();
    g.name = spec.nodeName;
    root.add(g);
    layerGroups.set(spec.index, g);
    layerMaterials.set(spec.index, []);
  });

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const buckets: Array<{ layer: number; bucket: GeoBucket; mat: THREE.MeshStandardMaterial }> = [];

  const rimColor = new THREE.Color('#F9C500');
  const mat = (layer: number, params: THREE.MeshStandardMaterialParameters) => {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: (layer - 5) * 0.5, polygonOffsetUnits: (layer - 5) * 2, ...params });
    m.userData.baseColor = m.color.clone();
    materialsToDispose.push(m);
    layerMaterials.get(layer)!.push(m);
    return m;
  };
  const bucket = (layer: number, m: THREE.MeshStandardMaterial) => {
    const b = new GeoBucket();
    buckets.push({ layer, bucket: b, mat: m });
    return b;
  };
  const woodTone = (): RGB => {
    const t = 0.88 + rng() * 0.2;
    const warm = (rng() - 0.5) * 0.06;
    return [t * (1 + warm), t, t * (1 - warm * 1.4)];
  };
  const SIDES = [1, -1] as const;

  /* =========================================================================
     LAYER 8: ROOF FRAMING — raised-heel W trusses @ 24" O.C., gusset plates,
     double top plates, lateral bracing, fascia & rake boards, hurricane ties
     ========================================================================= */
  {
    const lumber = mat(8, {
      map: tx.lumberColor,
      normalMap: tx.lumberNormal,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: tx.lumberRoughness,
      roughness: 1,
      metalness: 0,
    });
    const galv = mat(8, {
      map: tx.metalColor,
      normalMap: tx.metalNormal,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 0.42,
      metalness: 0.55,
    });
    const LB = bucket(8, lumber);
    const GB = bucket(8, galv);
    const LUV: UV = [4, 1];
    const WEB_EXT = 0.035;

    const web = (x: number, a: P2, c: P2, tone: RGB) => {
      const dz = c[0] - a[0];
      const dy = c[1] - a[1];
      const l = Math.hypot(dz, dy);
      const ez = (dz / l) * WEB_EXT;
      const ey = (dy / l) * WEB_EXT;
      const { m, len } = beamMatrix([x, a[1] - ey, a[0] - ez], [x, c[1] + ey, c[0] + ez]);
      addBox(LB, {
        w: WEB_W,
        h: WEB_D,
        l: len,
        matrix: m,
        chamfer: 0.0035,
        uvScale: LUV,
        uvOffset: [rng(), rng()],
        color: tone,
      });
    };
    const plate = (x: number, z: number, y: number, h: number, l: number, angle = 0) => {
      const tone = tint(WHITE, 0.92 + rng() * 0.12);
      for (const sx of [-1, 1]) {
        const m = new THREE.Matrix4()
          .makeTranslation(x + sx * (CHORD_W / 2 + 0.0009), y, z)
          .multiply(new THREE.Matrix4().makeRotationX(angle));
        addBox(GB, {
          w: 0.0016,
          h,
          l,
          matrix: m,
          uvScale: [5, 5],
          uvOffset: [rng(), rng()],
          color: tone,
          endTint: 1,
        });
      }
    };

    const B_Z = 0.7;
    const T_R = 1.05;
    const K_Y = 1.2;
    const tY = roofY(T_R) - CHORD_V / 2;

    for (let i = 0; i < TRUSS_COUNT; i++) {
      const x = trussX(i);
      const tone = woodTone();
      // Top chords with plumb-cut ridge and tails
      for (const s of SIDES) {
        addPrism(LB, {
          poly: [
            [0, RIDGE_TOP],
            [s * EAVE_RUN, roofY(EAVE_RUN)],
            [s * EAVE_RUN, roofY(EAVE_RUN) - CHORD_V],
            [0, RIDGE_TOP - CHORD_V],
          ],
          z0: -CHORD_W / 2,
          z1: CHORD_W / 2,
          matrix: trussPlane(x),
          grainDir: [s * COS, -SIN],
          uvScale: LUV,
          uvOffset: [rng(), rng()],
          color: tone,
          capTint: 1,
        });
      }
      // Bottom chord
      {
        const { m, len } = beamMatrix(
          [x, BOTTOM_CHORD_H / 2, -WALL_RUN],
          [x, BOTTOM_CHORD_H / 2, WALL_RUN]
        );
        addBox(LB, {
          w: CHORD_W,
          h: BOTTOM_CHORD_H,
          l: len,
          matrix: m,
          chamfer: 0.004,
          uvScale: LUV,
          uvOffset: [rng(), rng()],
          color: tone,
        });
      }
      // King post + W webs
      web(x, [0, BOTTOM_CHORD_H - 0.02], [0, RIDGE_TOP - CHORD_V], tone);
      for (const s of SIDES) {
        web(x, [s * B_Z, BOTTOM_CHORD_H * 0.5], [s * T_R, tY], tone);
        web(x, [s * B_Z, BOTTOM_CHORD_H * 0.5], [0, K_Y], tone);
      }
      // Galvanized truss connector plates at every joint
      plate(x, 0, RIDGE_TOP - CHORD_V * 0.75, 0.2, 0.26);
      plate(x, 0, K_Y, 0.15, 0.12);
      for (const s of SIDES) {
        plate(x, s * (WALL_RUN - 0.14), 0.13, 0.2, 0.22);
        plate(x, s * B_Z, BOTTOM_CHORD_H * 0.5, 0.13, 0.2);
        plate(x, s * T_R, tY, 0.13, 0.14, s * SLOPE);
        // Hurricane tie strapping the heel to the top plate
        const m = new THREE.Matrix4().makeTranslation(
          x - (CHORD_W / 2 + 0.0009),
          0.03,
          s * (WALL_RUN - 0.035)
        );
        addBox(GB, { w: 0.0016, h: 0.2, l: 0.045, matrix: m, uvScale: [5, 5], endTint: 1 });
      }
    }

    // Double 2x4 top plates (wall frame rectangle under the trusses)
    const plateLen0 = X_MIN + 0.05;
    const plateLen1 = X_MAX - 0.05;
    for (const s of SIDES) {
      for (const yc of [-0.019, -0.057]) {
        const { m, len } = beamMatrix(
          [plateLen0, yc, s * (WALL_RUN - 0.0445)],
          [plateLen1, yc, s * (WALL_RUN - 0.0445)],
          [0, 0, 1]
        );
        addBox(LB, {
          w: 0.089,
          h: 0.038,
          l: len,
          matrix: m,
          chamfer: 0.003,
          uvScale: LUV,
          uvOffset: [rng(), rng()],
          color: woodTone(),
        });
      }
    }
    for (const xe of [plateLen0 + 0.0445, plateLen1 - 0.0445]) {
      for (const yc of [-0.019, -0.057]) {
        const { m, len } = beamMatrix(
          [xe, yc, -(WALL_RUN - 0.089)],
          [xe, yc, WALL_RUN - 0.089],
          [1, 0, 0]
        );
        addBox(LB, {
          w: 0.089,
          h: 0.038,
          l: len,
          matrix: m,
          chamfer: 0.003,
          uvScale: LUV,
          uvOffset: [rng(), rng()],
          color: woodTone(),
        });
      }
    }

    // Permanent lateral bracing: on bottom chords and along the king posts
    const bx0 = trussX(0) - 0.06;
    const bx1 = trussX(TRUSS_COUNT - 1) + 0.06;
    for (const s of SIDES) {
      const { m, len } = beamMatrix(
        [bx0, BOTTOM_CHORD_H + 0.019, s * 1.25],
        [bx1, BOTTOM_CHORD_H + 0.019, s * 1.25],
        [0, 0, 1]
      );
      addBox(LB, {
        w: 0.089,
        h: 0.038,
        l: len,
        matrix: m,
        chamfer: 0.003,
        uvScale: LUV,
        uvOffset: [rng(), rng()],
        color: woodTone(),
      });
    }
    {
      const zc = WEB_D / 2 + 0.019;
      const { m, len } = beamMatrix([bx0, 0.72, zc], [bx1, 0.72, zc], [0, 0, 1]);
      addBox(LB, {
        w: 0.038,
        h: 0.089,
        l: len,
        matrix: m,
        chamfer: 0.003,
        uvScale: LUV,
        uvOffset: [rng(), rng()],
        color: woodTone(),
      });
    }

    // 1x8 fascia boards along both eaves
    for (const s of SIDES) {
      const yTop = roofY(EAVE_RUN + FASCIA_T) + 0.002;
      const yc = yTop - FASCIA_H / 2;
      const zc = s * (EAVE_RUN + FASCIA_T / 2);
      const { m, len } = beamMatrix([RAKE_X, yc, zc], [LAYER_X1, yc, zc], [0, 0, 1]);
      addBox(LB, {
        w: FASCIA_T,
        h: FASCIA_H,
        l: len,
        matrix: m,
        chamfer: 0.003,
        uvScale: LUV,
        uvOffset: [rng(), rng()],
        color: woodTone(),
      });
    }
    // Rake (barge) boards following the far gable
    for (const s of SIDES) {
      const zo = s * (EAVE_RUN + FASCIA_T);
      const yo = roofY(EAVE_RUN + FASCIA_T) + 0.004;
      addPrism(LB, {
        poly: [
          [0, RIDGE_TOP + 0.004],
          [zo, yo],
          [zo, yo - FASCIA_H / COS],
          [0, RIDGE_TOP + 0.004 - FASCIA_H / COS],
        ],
        z0: -FASCIA_T / 2,
        z1: FASCIA_T / 2,
        matrix: trussPlane(X_MIN - FASCIA_T / 2),
        grainDir: [s * COS, -SIN],
        uvScale: LUV,
        uvOffset: [rng(), rng()],
        color: woodTone(),
        capTint: 1,
      });
    }

    anchors.set(8, new THREE.Vector3(trussX(8), tY + 0.05, T_R * 0.92));
  }

  /* =========================================================================
     LAYER 7: PLYWOOD DECKING — 19/32" APA sheets, staggered joints on truss
     centers, cross-laminated ply edges, H-clips, ring-shank nails
     ========================================================================= */
  {
    const plyFace = mat(7, {
      map: tx.plywoodColor,
      normalMap: tx.plywoodNormal,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughnessMap: tx.plywoodRoughness,
      roughness: 1,
      metalness: 0,
    });
    const plyEdge = mat(7, { map: tx.plywoodEdge, roughness: 0.86, metalness: 0 });
    const steel = mat(7, { color: '#C9CED6', roughness: 0.32, metalness: 0.9 });
    const PB = bucket(7, plyFace);
    const EB = bucket(7, plyEdge);
    const SB = bucket(7, steel);
    const GAP = 0.0016;
    const SHEET = 1.22;
    const rows = [
      { v0: EAVE_V - SHEET, v1: EAVE_V, joints: [trussX(4), trussX(8)] },
      { v0: EAVE_V - SHEET * 2, v1: EAVE_V - SHEET, joints: [trussX(2), trussX(6)] },
      { v0: SLOT_V, v1: EAVE_V - SHEET * 2, joints: [trussX(4), trussX(8)] },
    ];
    for (const s of SIDES) {
      for (const row of rows) {
        const cuts = [RAKE_X, ...row.joints.filter((j) => j < PLY_END - 0.06), PLY_END];
        for (let k = 0; k < cuts.length - 1; k++) {
          const tone = woodTone();
          const isEave = row.v1 >= EAVE_V - 1e-6;
          addSlab(PB, {
            side: s,
            u0: cuts[k] + (k === 0 ? 0 : GAP),
            u1: cuts[k + 1] - (k === cuts.length - 2 ? 0 : GAP),
            vRows: [row.v0 + GAP, row.v1 - (isEave ? 0 : GAP)],
            nBase: () => 0,
            t: PLY_T,
            topColor: () => tone,
            bottomColor: tint(tone, 0.8),
            uvScale: [1 / SHEET, 1 / SHEET],
            uvOffset: [rng(), rng()],
            edgeBucket: EB,
            edgeUV01: true,
            edgeUScale: 2,
            sideColor: tint(tone, 0.95),
          });
        }
        // H-clips along the horizontal seam at the top of the row
        if (row.v0 > SLOT_V + 0.01) {
          for (let i = 0; i < TRUSS_COUNT - 1; i++) {
            const xc = trussX(i) + TRUSS_SPACING / 2;
            if (xc > PLY_END - 0.05) break;
            addBox(SB, {
              w: 0.026,
              h: PLY_T + 0.004,
              l: 0.006,
              matrix: slopeLocal(s, xc, PLY_T / 2, row.v0),
              color: WHITE,
            });
          }
        }
      }
      // Ring-shank nails along every truss line
      if (!isMobile) {
        for (let i = 0; i < TRUSS_COUNT; i++) {
          const xn = trussX(i);
          if (xn > PLY_END) break;
          for (let v = 0.16; v < EAVE_V - 0.04; v += 0.152) {
            addCylinder(SB, {
              rBottom: 0.0045,
              rTop: 0.0045,
              h: 0.0018,
              seg: 6,
              matrix: slopeLocal(s, xn + (rng() - 0.5) * 0.008, PLY_T - 0.0004, v),
            });
          }
        }
      }
    }
    anchors.set(7, slopePoint(1, 1.3, 2.2, PLY_T));
  }

  /* =========================================================================
     LAYER 6: INTAKE VENTS — continuous louvered eave intake vent (deck-mounted
     edge vent with an over-fascia louvered lip)
     ========================================================================= */
  {
    const vent = mat(6, {
      map: tx.ventColor,
      normalMap: tx.ventNormal,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.55,
      metalness: 0,
    });
    const VB = bucket(6, vent);
    const STRIP = 0.32;
    const v0 = EAVE_V - STRIP;
    const v1 = EAVE_V + 0.01;
    for (const s of SIDES) {
      addSlab(VB, {
        side: s,
        u0: RAKE_X - 0.005,
        u1: LAYER_X1 + 0.005,
        vRows: [v0, v1],
        nBase: (_u, v) => PLY_T + 0.0004 + 0.0035 * clamp01((v - v0) / 0.06),
        t: 0.003,
        topColor: () => WHITE,
        bottomColor: tint(WHITE, 0.55),
        sideColor: tint(WHITE, 0.8),
        uvScale: [4, 1 / (v1 - v0)],
        uvOffset: [0, -v0 / (v1 - v0)],
        edgeUV01: true,
        edgeUScale: 4,
      });
      // Louvered lip that drops over the fascia face
      const yTop = roofY(EAVE_RUN + FASCIA_T) + 0.012;
      const zc = s * (EAVE_RUN + FASCIA_T + 0.006);
      const { m, len } = beamMatrix(
        [RAKE_X - 0.005, yTop - 0.03, zc],
        [LAYER_X1 + 0.005, yTop - 0.03, zc],
        [0, 0, 1]
      );
      addBox(VB, {
        w: 0.008,
        h: 0.06,
        l: len,
        matrix: m,
        uvScale: [16, 4],
        color: tint(WHITE, 0.92),
        endTint: 0.8,
      });
    }
    anchors.set(6, slopePoint(1, 1.3, EAVE_V - STRIP * 0.5, PLY_T + 0.01));
  }

  /* =========================================================================
     LAYER 5: ICE & WATER SHIELD — self-adhered membrane in lapped 36" courses
     ========================================================================= */
  {
    const iw = mat(5, {
      map: tx.iceWaterColor,
      normalMap: tx.iceWaterNormal,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: tx.iceWaterRoughness,
      roughness: 1,
      metalness: 0.02,
    });
    const IB = bucket(5, iw);
    const ROLL = 0.914;
    const LAP = 0.076;
    for (const s of SIDES) {
      for (let k = 0; ; k++) {
        const v1 = EAVE_V - k * (ROLL - LAP);
        if (v1 <= SLOT_V + 0.05) break;
        const v0 = Math.max(SLOT_V, v1 - ROLL);
        const n0 = PLY_T + 0.0002 + k * 0.0008;
        addSlab(IB, {
          side: s,
          u0: RAKE_X,
          u1: IW_END,
          vRows: [v0, v1],
          nBase: () => n0,
          t: 0.0018,
          topColor: () => tint(WHITE, 0.96 + rng() * 0.06),
          bottomColor: [0.55, 0.58, 0.64],
          uvScale: [1, 1],
          uvOffset: [rng(), -v0],
          sideColor: tint(WHITE, 0.6),
        });
      }
    }
    anchors.set(5, slopePoint(1, 1.3, 1.9, 0.022));
  }

  /* =========================================================================
     LAYER 4: SYNTHETIC UNDERLAYMENT — rippled woven sheets with 4" laps and
     plastic cap nails
     ========================================================================= */
  {
    const ul = mat(4, {
      map: tx.underlaymentColor,
      normalMap: tx.underlaymentNormal,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.62,
      metalness: 0,
    });
    const capNail = mat(4, { color: '#D8462C', roughness: 0.48, metalness: 0 });
    const UB = bucket(4, ul);
    const CB = bucket(4, capNail);
    const ROLL = 1.0;
    const LAP = 0.1;
    const width = UL_END - RAKE_X;
    const segU = Math.max(12, Math.ceil(width / (isMobile ? 0.1 : 0.05)));
    for (const s of SIDES) {
      for (let k = 0; ; k++) {
        const v1 = EAVE_V - k * (ROLL - LAP);
        if (v1 <= SLOT_V + 0.05) break;
        const v0 = Math.max(SLOT_V, v1 - ROLL);
        const n0 = 0.0242 + k * 0.0006;
        const ph = rng() * 6.28;
        const disp = (u: number, v: number) => {
          const edgeFade = clamp01((v - v0) / 0.08) * clamp01((v1 - v) / 0.05);
          return (
            n0 +
            (Math.sin(u * 8.5 + ph + Math.sin(v * 2.4 + ph) * 1.4) * 0.0011 +
              Math.sin(u * 23 + v * 3 + ph) * 0.0004) *
              (0.4 + 0.6 * edgeFade)
          );
        };
        const vRows: number[] = [];
        const nv = 7;
        for (let r = 0; r <= nv; r++) vRows.push(lerp(v0, v1, r / nv));
        addSlab(UB, {
          side: s,
          u0: RAKE_X,
          u1: UL_END,
          vRows,
          segU,
          nBase: disp,
          t: 0.0012,
          uvScale: [1, 1],
          uvOffset: [rng(), -v0],
          bottomColor: tint(WHITE, 0.55),
          sideColor: tint(WHITE, 0.7),
        });
        // Plastic cap nails: two field rows + one row along the lap
        for (const vr of [v0 + 0.3, v0 + 0.62, v1 - 0.05]) {
          if (vr <= v0 || vr >= v1) continue;
          for (let u = RAKE_X + 0.16; u < UL_END - 0.04; u += isMobile ? 0.45 : 0.3) {
            const uu = u + (rng() - 0.5) * 0.02;
            const vv = vr + (rng() - 0.5) * 0.02;
            addCylinder(CB, {
              rBottom: 0.0128,
              rTop: 0.0118,
              h: 0.0018,
              seg: 10,
              matrix: slopeLocal(s, uu, disp(uu, vv) + 0.0012, vv),
            });
          }
        }
      }
    }
    anchors.set(4, slopePoint(1, 1.3, 1.6, 0.027));
  }

  /* =========================================================================
     LAYER 3: ARCHITECTURAL SHINGLES — laminated dimensional tabs on a dark
     base strip, starter course, aluminum drip edge (eave + rake)
     ========================================================================= */
  {
    const shingle = mat(3, {
      map: tx.shingleColor,
      normalMap: tx.shingleNormal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: tx.shingleRoughness,
      roughness: 1,
      metalness: 0,
    });
    const drip = mat(3, { color: '#2E3034', roughness: 0.42, metalness: 0.55 });
    const SHB = bucket(3, shingle);
    const DB = bucket(3, drip);
    const xStart = RAKE_X - 0.02;

    const shadeAt = (v: number, vb: number) => {
      const d = v - (vb - SH_EXP);
      if (d <= 0) return 0.5;
      if (d < 0.06) return 0.58 + 0.34 * (d / 0.06);
      return 0.92 + 0.08 * ((d - 0.06) / (SH_EXP - 0.06));
    };

    for (const s of SIDES) {
      let firstEnd = SHINGLE_END;
      for (let c = 0; ; c++) {
        const vb = EAVE_V + 0.02 - c * SH_EXP;
        if (vb <= SLOT_V + 0.035) break;
        const vt = vb - SH_STRIP;
        const vStart = Math.max(SLOT_V, vt);
        const nB = (_u: number, v: number) => SH_N0 + (SH_TILT * (v - vt)) / SH_STRIP;
        const xEnd = SHINGLE_END;
        if (c === 0) firstEnd = xEnd;

        const rowsAll = [vStart, vb - SH_EXP, vb - SH_EXP + 0.06, vb];
        const rows = rowsAll.filter((v, i) => v >= vStart && (i === 0 || v > rowsAll[i - 1] + 1e-4));
        const uniqRows = rows.filter((v, i) => i === 0 || v > rows[i - 1] + 1e-4);

        // Laminated base strip (dark, shows in the gaps between tabs)
        const baseTone = 0.4 + rng() * 0.06;
        addSlab(SHB, {
          side: s,
          u0: xStart,
          u1: xEnd,
          vRows: uniqRows,
          nBase: nB,
          t: SH_T,
          topColor: (_u, v) => tint(WHITE, baseTone * shadeAt(v, vb)),
          bottomColor: tint(WHITE, 0.3),
          sideColor: tint(WHITE, 0.32),
          uvScale: [2, 2],
          uvOffset: [rng(), rng()],
          edges: { v0: false },
        });

        // Dimensional tabs
        let x = xStart - rng() * 0.2;
        while (x < xEnd) {
          const w = 0.13 + rng() * 0.24;
          const gap = rng() < 0.28 ? 0.0025 : 0.012 + rng() * 0.03;
          const a = Math.max(x, xStart);
          const b = Math.min(x + w, xEnd);
          if (b - a > 0.035) {
            const r = rng();
            const tone = r < 0.1 ? 0.62 + rng() * 0.1 : 0.78 + rng() * 0.46;
            const hue = (rng() - 0.5) * 0.08;
            const col: RGB = [tone * (1 + hue), tone, tone * (1 - hue)];
            const skL = a > xStart + 0.001 ? (rng() - 0.5) * 0.024 : 0;
            const skR = b < xEnd - 0.001 ? (rng() - 0.5) * 0.024 : 0;
            const tabTop = Math.max(vStart, vb - SH_EXP - 0.035);
            const tr = [tabTop, vb - SH_EXP, vb - SH_EXP + 0.06, vb].filter(
              (v) => v >= tabTop - 1e-6
            );
            const tRows = tr.filter((v, i) => i === 0 || v > tr[i - 1] + 1e-4);
            if (tRows.length >= 2) {
              addSlab(SHB, {
                side: s,
                u0: a,
                u1: b,
                u0b: Math.max(xStart, a + skL),
                u1b: Math.min(xEnd, b + skR),
                vRows: tRows,
                nBase: (u, v) => nB(u, v) + SH_T,
                t: SH_T,
                topColor: (_u, v) => tint(col, shadeAt(v, vb)),
                sideColor: tint(col, 0.42),
                uvScale: [2, 2],
                uvOffset: [rng(), rng()],
                bottom: false,
                edges: { v0: false },
              });
            }
          }
          x += w + gap;
        }
      }

      // Starter strip under the first course
      const sv1 = EAVE_V + 0.02;
      const sv0 = sv1 - 0.33;
      addSlab(SHB, {
        side: s,
        u0: xStart,
        u1: firstEnd,
        vRows: [sv0, sv1],
        nBase: (_u, v) => 0.0285 + (0.011 * (v - sv0)) / (sv1 - sv0),
        t: SH_T,
        topColor: () => tint(WHITE, 0.45),
        sideColor: tint(WHITE, 0.35),
        uvScale: [2, 2],
        uvOffset: [rng(), rng()],
      });

      // Eave drip edge: deck flange + face over the fascia
      addSlab(DB, {
        side: s,
        u0: RAKE_X - 0.01,
        u1: firstEnd,
        vRows: [EAVE_V - 0.07, EAVE_V + 0.004],
        nBase: () => 0.0255,
        t: 0.0012,
        topColor: () => WHITE,
      });
      const fy = roofY(EAVE_RUN + FASCIA_T) + 0.02;
      const fz = s * (EAVE_RUN + FASCIA_T + 0.003);
      const fm = beamMatrix([RAKE_X - 0.01, fy - 0.03, fz], [firstEnd, fy - 0.03, fz], [0, 0, 1]);
      addBox(DB, { w: 0.0014, h: 0.06, l: fm.len, matrix: fm.m, color: WHITE });

      // Rake drip edge along the far gable
      const vR0 = SLOT_V;
      const vR1 = EAVE_V + 0.01;
      const [z0, y0] = slopeYZ(s, vR0, 0.03);
      const [z1, y1] = slopeYZ(s, vR1, 0.03);
      addPrism(DB, {
        poly: [
          [z0, y0],
          [z1, y1],
          [z1, y1 - 0.06],
          [z0, y0 - 0.06],
        ],
        z0: -0.0008,
        z1: 0.0008,
        matrix: trussPlane(RAKE_X - 0.003),
      });
    }
    anchors.set(3, slopePoint(1, 1.3, 1.3, 0.05));
  }

  /* =========================================================================
     LAYER 2: EXHAUST VENTS — continuous baffled ridge vent, pipe flashing boot,
     dampered low-profile exhaust roof jack
     ========================================================================= */
  {
    const plastic = mat(2, { color: '#2A2C30', roughness: 0.62, metalness: 0.02 });
    const paintedMetal = mat(2, { color: '#24262A', roughness: 0.4, metalness: 0.6 });
    const PB = bucket(2, plastic);
    const MB = bucket(2, paintedMetal);

    // Ridge vent body (low-profile shingle-over vent)
    const VENT_V = 0.24;
    const nb = 0.05;
    const nt = 0.072;
    const ventProfile: P2[] = [
      slopeYZ(-1, VENT_V, nb),
      [0, RIDGE_TOP + nb / COS],
      slopeYZ(1, VENT_V, nb),
      slopeYZ(1, VENT_V, nt),
      [0, RIDGE_TOP + nt / COS],
      slopeYZ(-1, VENT_V, nt),
    ];
    addPrism(PB, {
      poly: ventProfile,
      z0: RAKE_X - 0.015,
      z1: RIDGE_VENT_END,
      matrix: trussPlane(0),
      color: WHITE,
      capTint: 0.7,
    });
    // Corrugated baffle ribs across the vent + filtered edge louvers
    for (let x = RAKE_X + 0.02; x < RIDGE_VENT_END - 0.01; x += 0.055) {
      for (const s of SIDES) {
        addSlab(PB, {
          side: s,
          u0: x,
          u1: x + 0.012,
          vRows: [0, VENT_V - 0.03],
          nBase: () => nt - 0.001,
          t: 0.003,
          topColor: () => tint(WHITE, 0.85),
          sideColor: tint(WHITE, 0.6),
          bottom: false,
        });
        addSlab(PB, {
          side: s,
          u0: x + 0.006,
          u1: x + 0.04,
          vRows: [VENT_V - 0.004, VENT_V + 0.0005],
          nBase: () => nb + 0.003,
          t: nt - nb - 0.006,
          topColor: () => tint(WHITE, 0.25),
          sideColor: tint(WHITE, 0.25),
          bottom: false,
        });
      }
    }

    // Plumbing vent stack with EPDM boot + painted flashing
    const px = 1.15;
    const pv = 0.95;
    addSlab(MB, {
      side: 1,
      u0: px - 0.2,
      u1: px + 0.2,
      vRows: [pv - 0.26, pv + 0.22],
      nBase: () => 0.058,
      t: 0.0016,
      topColor: () => WHITE,
    });
    const base = slopePoint(1, px, pv, 0.058);
    addCylinder(PB, {
      rBottom: 0.13,
      rTop: 0.07,
      h: 0.11,
      seg: 28,
      matrix: new THREE.Matrix4().makeTranslation(base.x, base.y - 0.04, base.z),
      color: tint(WHITE, 0.8),
    });
    addCylinder(PB, {
      rBottom: 0.075,
      rTop: 0.075,
      h: 0.03,
      seg: 28,
      matrix: new THREE.Matrix4().makeTranslation(base.x, base.y + 0.07, base.z),
      color: tint(WHITE, 0.7),
    });
    addCylinder(PB, {
      rBottom: 0.05,
      rTop: 0.05,
      h: 0.5,
      seg: 28,
      matrix: new THREE.Matrix4().makeTranslation(base.x, base.y - 0.04, base.z),
      color: tint(WHITE, 1.1),
      topColor: tint(WHITE, 0.08),
    });

    // Low-profile exhaust roof jack with louvered damper opening
    const jx = -1.25;
    const jv = 0.78;
    addSlab(MB, {
      side: 1,
      u0: jx - 0.24,
      u1: jx + 0.24,
      vRows: [jv - 0.26, jv + 0.24],
      nBase: () => 0.058,
      t: 0.0016,
      topColor: () => WHITE,
    });
    const jm = SLOPE_M[1]
      .clone()
      .multiply(new THREE.Matrix4().makeTranslation(jx, 0, 0))
      .multiply(
        new THREE.Matrix4().makeBasis(
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(1, 0, 0)
        )
      );
    addPrism(MB, {
      poly: [
        [jv - 0.18, 0.058],
        [jv + 0.16, 0.058],
        [jv + 0.16, 0.165],
        [jv + 0.13, 0.182],
        [jv + 0.06, 0.168],
        [jv - 0.18, 0.09],
      ],
      z0: -0.18,
      z1: 0.18,
      matrix: jm,
      color: WHITE,
      capTint: 0.85,
    });
    addBox(MB, {
      w: 0.32,
      h: 0.085,
      l: 0.004,
      matrix: slopeLocal(1, jx, 0.106, jv + 0.162),
      color: tint(WHITE, 0.12),
    });
    for (let k = 0; k < 4; k++) {
      const m = slopeLocal(1, jx, 0.073 + k * 0.022, jv + 0.168).multiply(
        new THREE.Matrix4().makeRotationX(0.6)
      );
      addBox(MB, { w: 0.31, h: 0.004, l: 0.026, matrix: m, color: tint(WHITE, 0.9) });
    }

    anchors.set(2, new THREE.Vector3(base.x, base.y + 0.42, base.z));
  }

  /* =========================================================================
     LAYER 1: RIDGE CAP — high-profile folded cap shingles lapped along the ridge
     ========================================================================= */
  {
    const cap = mat(1, {
      map: tx.shingleColor,
      normalMap: tx.shingleNormal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: tx.shingleRoughness,
      roughness: 1,
      metalness: 0,
    });
    const CB = bucket(1, cap);
    const CAP_LEN = 0.305;
    const CAP_EXP = 0.2;
    const CAP_T = 0.012;
    const nIn = 0.073;
    const r = 0.045;
    const zMax = 0.25;
    const surfY = (z: number, n: number) =>
      RIDGE_TOP + n / COS - (Math.sqrt(z * z + r * r) - r) * PITCH;
    const zs = [-zMax, -0.17, -0.1, -0.055, -0.025, 0, 0.025, 0.055, 0.1, 0.17, zMax];
    const outer: P2[] = zs.map((z) => [z, surfY(z, nIn + CAP_T)]);
    const inner: P2[] = zs
      .slice()
      .reverse()
      .map((z) => [z, surfY(z, nIn)]);
    const profile = [...outer, ...inner];
    const tilt = Math.atan2(0.013, CAP_LEN);
    const apexY = surfY(0, nIn);

    for (let k = 0; ; k++) {
      const xb = CAP_END - k * CAP_EXP;
      const xa = xb - CAP_LEN;
      if (xb < RAKE_X + 0.05) break;
      const za = Math.max(xa, RAKE_X - 0.015);
      const tone = 0.82 + rng() * 0.3;
      const m = new THREE.Matrix4()
        .makeTranslation(xa, apexY, 0)
        .multiply(new THREE.Matrix4().makeRotationZ(tilt))
        .multiply(new THREE.Matrix4().makeTranslation(-xa, -apexY, 0))
        .multiply(trussPlane(0));
      addPrism(CB, {
        poly: profile,
        z0: za,
        z1: xb,
        matrix: m,
        grainDir: [1, 0],
        uvScale: [2, 2],
        uvOffset: [rng(), rng()],
        color: tint(WHITE, tone),
        capTint: 0.55,
      });
    }
    anchors.set(1, new THREE.Vector3(1.4, RIDGE_TOP + 0.12, 0.02));
  }

  /* =========================================================================
     LAYER 9: INSULATION — lofted R-38 pink fiberglass batts between bottom
     chords, resting on the gypsum ceiling
     ========================================================================= */
  {
    const pink = mat(9, {
      map: tx.insulationColor,
      normalMap: tx.insulationNormal,
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughness: 0.96,
      metalness: 0,
    });
    const drywall = mat(9, { color: '#E9E7E2', roughness: 0.9, metalness: 0 });
    const IB = bucket(9, pink);
    const KB = bucket(9, drywall);
    const noise = createNoise3(77);
    const BATT_H = 0.25;
    const battW = TRUSS_SPACING - CHORD_W + 0.012;
    const zSpan = WALL_RUN * 2 - 0.06;
    const battCount = 4;
    const battL = zSpan / battCount;
    const seg: [number, number, number] = isMobile ? [6, 3, 8] : [10, 5, 14];
    const rad = 0.06;

    for (let i = 0; i < TRUSS_COUNT - 1; i++) {
      const cx = trussX(i) + TRUSS_SPACING / 2;
      for (let k = 0; k < battCount; k++) {
        const cz = -zSpan / 2 + battL * (k + 0.5);
        const L = battL - 0.012;
        const g = new THREE.BoxGeometry(battW, BATT_H, L, seg[0], seg[1], seg[2]);
        const pos = g.attributes.position;
        const half = new THREE.Vector3(battW / 2, BATT_H / 2, L / 2);
        const inner = new THREE.Vector3();
        const p = new THREE.Vector3();
        const d = new THREE.Vector3();
        for (let vi = 0; vi < pos.count; vi++) {
          p.fromBufferAttribute(pos, vi);
          inner.set(
            Math.max(-half.x + rad, Math.min(half.x - rad, p.x)),
            Math.max(-half.y + rad, Math.min(half.y - rad, p.y)),
            Math.max(-half.z + rad, Math.min(half.z - rad, p.z))
          );
          d.copy(p).sub(inner);
          if (d.lengthSq() > 1e-10) p.copy(inner).add(d.normalize().multiplyScalar(rad));
          const wx = cx + p.x;
          const wy = BATT_H / 2 + p.y;
          const wz = cz + p.z;
          const up = clamp01((p.y + half.y) / BATT_H);
          const pillow = (1 - Math.pow(p.x / half.x, 2)) * (1 - Math.pow(p.z / half.z, 4));
          const lump =
            noise(wx * 7, wy * 7, wz * 7) * 0.016 + noise(wx * 19, wy * 19, wz * 19) * 0.006;
          const n = d.lengthSq() > 0 ? d : new THREE.Vector3(0, 1, 0);
          p.addScaledVector(n, lump * (0.35 + up * 0.65));
          if (p.y > 0) p.y += pillow * 0.028 * up;
          // Bottom stays flat on the ceiling
          if (p.y < -half.y) p.y = -half.y;
          pos.setXYZ(vi, cx + p.x, BATT_H / 2 + p.y, cz + p.z);
        }
        g.deleteAttribute('normal');
        g.deleteAttribute('uv');
        const merged = mergeVertices(g, 1e-5);
        merged.computeVertexNormals();
        addGeometry(IB, merged, 1 / 0.6, (q) => {
          const ao = 0.66 + 0.34 * clamp01(q.y / BATT_H);
          return [ao, ao, ao];
        });
        g.dispose();
        merged.dispose();
      }
    }
    // 1/2" gypsum ceiling the batts rest on
    addBox(KB, {
      w: X_MAX - X_MIN - 0.2,
      h: 0.0127,
      l: (WALL_RUN - 0.089) * 2,
      matrix: new THREE.Matrix4().makeTranslation((X_MIN + X_MAX) / 2, -0.0066, 0),
      chamfer: 0.002,
      color: WHITE,
      endTint: 0.85,
    });
    anchors.set(9, new THREE.Vector3(trussX(7) + TRUSS_SPACING / 2, BATT_H + 0.02, 1.2));
  }

  /* ── Finalize meshes, layer handles & visual-state controller ─────────── */
  for (const { layer, bucket: b, mat: m } of buckets) {
    if (b.isEmpty) continue;
    const geo = b.toGeometry();
    geometriesToDispose.push(geo);
    const mesh = new THREE.Mesh(geo, m);
    mesh.castShadow = layer === 1 || layer === 2 || layer === 3 || layer === 8;
    mesh.receiveShadow = layer >= 7;
    layerGroups.get(layer)!.add(mesh);
  }

  const highlightColor = new THREE.Color('#FFF6E0');
  const dimTintColor = new THREE.Color('#C5D5E4');
  const tempColor = new THREE.Color();

  let totalDrawCalls = 0;
  let totalTriangles = 0;
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      totalDrawCalls += 1;
      const g = mesh.geometry;
      const tris = g.index ? g.index.count / 3 : (g.attributes.position?.count || 0) / 3;
      totalTriangles += Math.round(tris);
    }
  });

  const layers: RoofLayerHandle[] = ROOF_LAYERS.map((spec) => {
    const group = layerGroups.get(spec.index)!;
    const mats = layerMaterials.get(spec.index)!;
    const bbox = new THREE.Box3().setFromObject(group);
    const basePosition = group.position.clone();
    const explodeOffset = new THREE.Vector3(...spec.explodeOffset);

    let lastHighlight = -1;
    let lastDim = -1;

    return {
      index: spec.index,
      spec,
      group,
      bbox,
      basePosition,
      explodeOffset,
      materials: mats,
      calloutAnchor: anchors.get(spec.index),
      setVisualState(highlight: number, dim: number) {
        if (Math.abs(highlight - lastHighlight) < 0.005 && Math.abs(dim - lastDim) < 0.005) {
          return;
        }
        lastHighlight = highlight;
        lastDim = dim;

        for (const m of mats) {
          const baseCol = m.userData.baseColor as THREE.Color;
          tempColor
            .copy(baseCol)
            .lerp(dimTintColor, dim * 0.12)
            .multiplyScalar(1 - dim * 0.16);
          m.color.copy(tempColor);
          const rim = m.userData.rim as { value: number } | undefined;
          if (rim) rim.value = highlight * 0.55;
          if (highlight > 0.01) {
            m.emissive.copy(highlightColor);
            m.emissiveIntensity = highlight * 0.02;
          } else {
            m.emissive.setRGB(0, 0, 0);
            m.emissiveIntensity = 0;
          }
        }
      },
    };
  });

  return {
    root,
    layers,
    stats: {
      drawCalls: totalDrawCalls,
      triangles: totalTriangles,
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
    },
  };
}
