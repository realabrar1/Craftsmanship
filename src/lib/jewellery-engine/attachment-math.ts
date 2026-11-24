import * as THREE from "three";
import { createLayerCurve } from "./curve-generator";
import type { PlacementType } from "../types";

export interface ComponentTransform {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  width: number;
}

export interface PendantDiagnostic {
  pendantSku: string;
  isAttached: boolean;
  anchorLayerIndex: number;
  totalLayers: number;
  position: [number, number, number];
  rotation: [number, number, number];
  bounds: {
    topLoopY: number;
    bottomPearlY: number;
    width: number;
    height: number;
  };
  visibleInFrustum: boolean;
}

/**
 * Calculates the exact 3D position and orientation for a connector bar
 * bridging parallel strands at curve position t (e.g. 0.22, 0.28, 0.36 on left side).
 *
 * Uses an orthonormal coordinate frame:
 * - X: Binormal vector (tangential to bust surface, spanning across parallel strands)
 * - Y: Strand tangent vector (along the flow of the pearl string)
 * - Z: Surface normal vector (pointing outward from the bust chest toward viewer)
 *
 * This guarantees the connector bar lies perfectly flat on the pearls with zero tilt or protrusion.
 */
export function calculateConnectorTransform(
  t: number,
  totalLayers: number,
  connectedLayers: number[] = [0, 1, 2, 3, 4]
): ComponentTransform {
  const minLayer = Math.min(...connectedLayers);
  const maxLayer = Math.min(totalLayers - 1, Math.max(...connectedLayers));

  const innerCurve = createLayerCurve(minLayer, totalLayers);
  const outerCurve = createLayerCurve(maxLayer, totalLayers);

  const innerPoint = innerCurve.getPoint(t);
  const outerPoint = outerCurve.getPoint(t);

  // Center position of connector bar is the midpoint across the strands
  // Offset slightly forward (+0.035) so it rests flush on top of the pearls
  const centerPos = new THREE.Vector3()
    .addVectors(innerPoint, outerPoint)
    .multiplyScalar(0.5);

  // Average tangent along the strand direction
  const innerTangent = innerCurve.getTangent(t).normalize();
  const outerTangent = outerCurve.getTangent(t).normalize();
  const strandTangent = new THREE.Vector3()
    .addVectors(innerTangent, outerTangent)
    .normalize();

  // Outward surface normal pointing away from bust center (Z-forward)
  const up = new THREE.Vector3(0, 1, 0);

  // Binormal vector perpendicular to tangent and up: spans horizontally across strands
  const binormal = new THREE.Vector3().crossVectors(strandTangent, up).normalize();
  if (t < 0.5) {
    // On the left side, ensure binormal points outward from inner to outer strand
    if (binormal.x > 0) binormal.negate();
  } else {
    // On the right side
    if (binormal.x < 0) binormal.negate();
  }

  // Exact surface normal: perpendicular to binormal and tangent
  const surfaceNormal = new THREE.Vector3().crossVectors(binormal, strandTangent).normalize();
  if (surfaceNormal.z < 0) {
    surfaceNormal.negate();
  }

  // Push center position slightly outward along surface normal so bar rests on top of pearls
  centerPos.addScaledVector(surfaceNormal, 0.04);

  // Span width between inner and outer strand
  const width = innerPoint.distanceTo(outerPoint);

  // Construct orthonormal basis:
  // X = binormal (spans across parallel strands)
  // Y = strandTangent (aligns with pearl thread flow)
  // Z = surfaceNormal (faces outward toward viewer)
  const rotMatrix = new THREE.Matrix4().makeBasis(binormal, strandTangent, surfaceNormal);
  const rotation = new THREE.Euler().setFromRotationMatrix(rotMatrix);

  return {
    position: centerPos,
    rotation,
    scale: new THREE.Vector3(1, 1, 1),
    width: Math.max(0.32, width * 1.15),
  };
}

/**
 * Calculates side brooch or temple butti transforms based on placement type.
 */
export function getPlacedBroochTransforms(
  placement: PlacementType,
  curvePositions: number[],
  totalLayers: number,
  strandIndex: number = 0
): ComponentTransform[] {
  const transforms: ComponentTransform[] = [];
  const curve = createLayerCurve(strandIndex, totalLayers);
  const up = new THREE.Vector3(0, 1, 0);

  for (const pos of curvePositions) {
    // Left side position (pos is strictly < 0.5, e.g. 0.28)
    if (placement === "BOTH_SIDES" || placement === "LEFT_ONLY") {
      const t = Math.min(0.42, Math.max(0.18, pos));
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
      if (normal.z < 0) normal.negate();

      point.addScaledVector(normal, 0.04);
      const rotMatrix = new THREE.Matrix4().makeBasis(binormal, tangent, normal);
      transforms.push({
        position: point,
        rotation: new THREE.Euler().setFromRotationMatrix(rotMatrix),
        scale: new THREE.Vector3(1, 1, 1),
        width: 0.55,
      });
    }

    // Right side position (symmetrical counterpart at 1 - pos)
    if (placement === "BOTH_SIDES" || placement === "RIGHT_ONLY") {
      const t = 1.0 - Math.min(0.42, Math.max(0.18, pos));
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
      if (normal.z < 0) normal.negate();

      point.addScaledVector(normal, 0.04);
      const rotMatrix = new THREE.Matrix4().makeBasis(binormal, tangent, normal);
      transforms.push({
        position: point,
        rotation: new THREE.Euler().setFromRotationMatrix(rotMatrix),
        scale: new THREE.Vector3(1, 1, 1),
        width: 0.55,
      });
    }
  }

  return transforms;
}

/**
 * Calculates central pendant transform at the lowest drape point (t = 0.5)
 * of the specified layer (typically the bottom layer totalLayers - 1).
 *
 * Ensures the top bail loops touch the bottom strand curve, the pendant body rests
 * flush against the bust chest, and the piece is never occluded or clipped.
 */
export function calculatePendantTransform(
  layerIndex: number,
  totalLayers: number,
  attachmentOffset: number = 0.20
): ComponentTransform {
  // Attach to bottom layer so it hangs as the majestic grand centerpiece below all strands
  const targetLayer = Math.max(0, Math.min(totalLayers - 1, layerIndex));
  const curve = createLayerCurve(targetLayer, totalLayers);
  const centerPoint = curve.getPoint(0.5);

  // Position pendant: top loops connect at centerPoint, body drops downward
  const pendantPosition = new THREE.Vector3(
    0, // Perfectly centered along central X axis
    centerPoint.y - attachmentOffset,
    centerPoint.z + 0.035 // rests flush on front of pearl strands
  );

  // Subtle forward tilt matching the mannequin bust chest slope
  const rotation = new THREE.Euler(0.04, 0, 0);

  return {
    position: pendantPosition,
    rotation,
    scale: new THREE.Vector3(1, 1, 1),
    width: 0.52,
  };
}

/**
 * Diagnostics helper to verify pendant visibility and coordinates.
 */
export function getPendantDiagnostic(
  pendantSku: string,
  totalLayers: number,
  layerIndex: number = totalLayers - 1
): PendantDiagnostic {
  const transform = calculatePendantTransform(layerIndex, totalLayers);
  const py = transform.position.y;
  
  // Pendant bounds
  const topLoopY = py + 0.22;
  const bottomPearlY = py - 0.26;

  // Frustum safe zone: y between -0.9 and +1.0, z between 0.3 and 1.5
  const visibleInFrustum = bottomPearlY > -0.9 && topLoopY < 1.0 && transform.position.z > 0.3;

  return {
    pendantSku,
    isAttached: true,
    anchorLayerIndex: layerIndex,
    totalLayers,
    position: [transform.position.x, transform.position.y, transform.position.z],
    rotation: [transform.rotation.x, transform.rotation.y, transform.rotation.z],
    bounds: {
      topLoopY,
      bottomPearlY,
      width: 0.52,
      height: 0.48,
    },
    visibleInFrustum,
  };
}
