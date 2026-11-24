import * as THREE from "three";

export interface CurveParameters {
  layerIndex: number;
  totalLayers: number;
  neckRadius?: number;
  dropSeparation?: number;
}

/**
 * Generates a physically realistic 3D drape curve for a necklace layer resting on a velvet atelier bust.
 * Coordinate space:
 * - Y is up (neck crown at y ≈ 0.68, clavicle at y ≈ 0.25, chest cushion at y ≈ 0.0, pedestal at y ≈ -0.84)
 * - Z is forward (front of bust at +Z, rear closure clasp at -Z)
 * - X is lateral (-X is left shoulder, +X is right shoulder)
 */
export function createLayerCurve(
  layerIndex: number,
  totalLayers: number,
  options: {
    baseDropY?: number;
    layerStepY?: number;
    shoulderWidth?: number;
    neckDepthZ?: number;
  } = {}
): THREE.CatmullRomCurve3 {
  const {
    baseDropY = 0.06,
    layerStepY = 0.065,
    shoulderWidth = 0.52,
    neckDepthZ = -0.16,
  } = options;

  // Step down progressively for each layer in authentic jewellery proportions
  const dropY = baseDropY - layerIndex * layerStepY;
  // Step forward gracefully to drape over the chest cushion and prevent inter-strand collision
  const forwardZ = 0.36 + layerIndex * 0.024;
  // Natural lateral shoulder spread
  const lateralStep = layerIndex * 0.022;

  // Key control points following natural drape over clavicle and bust contour
  const points = [
    // 0: Rear left neck closure
    new THREE.Vector3(-0.24 - lateralStep * 0.3, 0.58, neckDepthZ),
    // 1: Left neck curve / upper clavicle
    new THREE.Vector3(-shoulderWidth - lateralStep, 0.32, 0.06),
    // 2: Left chest transition
    new THREE.Vector3(-0.38 - lateralStep * 0.4, 0.16 - layerIndex * 0.035, 0.26 + layerIndex * 0.015),
    // 3: Front center drape apex
    new THREE.Vector3(0, dropY, forwardZ),
    // 4: Right chest transition
    new THREE.Vector3(0.38 + lateralStep * 0.4, 0.16 - layerIndex * 0.035, 0.26 + layerIndex * 0.015),
    // 5: Right neck curve / upper clavicle
    new THREE.Vector3(shoulderWidth + lateralStep, 0.32, 0.06),
    // 6: Rear right neck closure
    new THREE.Vector3(0.24 + lateralStep * 0.3, 0.58, neckDepthZ),
  ];

  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.42);
  return curve;
}

/**
 * Computes uniform sampling points along a layer curve for bead placement.
 */
export function sampleStrandPoints(
  curve: THREE.CatmullRomCurve3,
  beadCount: number
): Array<{
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  binormal: THREE.Vector3;
  t: number;
}> {
  const samples = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < beadCount; i++) {
    const t = i / (beadCount - 1);
    const position = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();
    
    // Binormal perpendicular to tangent and up vector
    const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    // Normal pointing outward from the bust surface
    const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

    samples.push({ position, tangent, normal, binormal, t });
  }

  return samples;
}
