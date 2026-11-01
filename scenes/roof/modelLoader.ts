import * as THREE from 'three';
import { ROOF_LAYERS, ROOF_EXPLORER_CONFIG } from './roofExplorerConfig';
import { generateProceduralTextures } from './proceduralTextures';
import {
  buildProceduralRoofAssembly,
  type LoadedRoofAssembly,
  type RoofLayerHandle,
} from './proceduralRoofBuilder';

export interface LoadRoofAssemblyOptions {
  glbUrl?: string;
  maxAnisotropy?: number;
  isMobile?: boolean;
}

/**
 * Unified loader abstraction for the 9-layer roof assembly.
 * - If `glbUrl` (or `ROOF_EXPLORER_CONFIG.glbUrl`) is provided, loads the GLB and binds
 *   nodes named `Layer_01_RidgeCap` through `Layer_09_Insulation` to the scroll controller.
 * - Otherwise generates the procedural textures in idle slices and builds the 9-layer
 *   procedural 6:12 gable roof assembly.
 */
export async function loadRoofAssembly(
  options: LoadRoofAssemblyOptions = {}
): Promise<LoadedRoofAssembly> {
  const glbUrl = options.glbUrl ?? ROOF_EXPLORER_CONFIG.glbUrl;
  const isMobile = options.isMobile ?? false;
  const maxAnisotropy = options.maxAnisotropy ?? 8;

  if (glbUrl) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(glbUrl);
    const root = gltf.scene;
    root.name = 'RoofAssemblyRoot';

    const goldHighlightColor = new THREE.Color('#F9C500');
    const dimTintColor = new THREE.Color('#C5D5E4');
    const tempColor = new THREE.Color();

    const disposablesGeo: THREE.BufferGeometry[] = [];
    const disposablesMat: THREE.Material[] = [];
    const disposablesTex: THREE.Texture[] = [];

    let totalDrawCalls = 0;
    let totalTriangles = 0;

    const layers: RoofLayerHandle[] = ROOF_LAYERS.map((spec) => {
      const found = root.getObjectByName(spec.nodeName);
      const group = found instanceof THREE.Group ? found : new THREE.Group();
      if (!found) {
        group.name = spec.nodeName;
        root.add(group);
      }

      const mats: THREE.MeshStandardMaterial[] = [];
      group.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          totalDrawCalls += 1;
          const geo = mesh.geometry;
          disposablesGeo.push(geo);
          const tris = geo.index
            ? geo.index.count / 3
            : (geo.attributes.position?.count || 0) / 3;
          totalTriangles += Math.round(tris);

          const mList = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mList.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              const cloned = m.clone();
              cloned.userData.baseColor = cloned.color.clone();
              mats.push(cloned);
              disposablesMat.push(cloned);
              if (cloned.map) disposablesTex.push(cloned.map);
              if (cloned.normalMap) disposablesTex.push(cloned.normalMap);
              if (cloned.roughnessMap) disposablesTex.push(cloned.roughnessMap);
              mesh.material = cloned;
            }
          });
        }
      });

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
        setVisualState(highlight: number, dim: number) {
          if (Math.abs(highlight - lastHighlight) < 0.005 && Math.abs(dim - lastDim) < 0.005) {
            return;
          }
          lastHighlight = highlight;
          lastDim = dim;
          for (const m of mats) {
            const baseCol = m.userData.baseColor as THREE.Color;
            tempColor.copy(baseCol).lerp(dimTintColor, dim * 0.32);
            m.color.copy(tempColor);
            if (highlight > 0.01) {
              m.emissive.copy(goldHighlightColor);
              m.emissiveIntensity = highlight * 0.16;
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
        disposablesGeo.forEach((g) => g.dispose());
        disposablesMat.forEach((m) => m.dispose());
        disposablesTex.forEach((t) => t.dispose());
      },
    };
  }

  // Default: idle-chunked procedural textures + procedural 9-layer roof model
  const texSize = isMobile
    ? ROOF_EXPLORER_CONFIG.quality.textureSizeMobile
    : ROOF_EXPLORER_CONFIG.quality.textureSizeDesktop;
  const textures = await generateProceduralTextures(texSize, maxAnisotropy);
  const assembly = buildProceduralRoofAssembly(textures, isMobile);

  return {
    ...assembly,
    dispose() {
      assembly.dispose();
      textures.dispose();
    },
  };
}
