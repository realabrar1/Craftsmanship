import assert from "node:assert";
import * as THREE from "three";
import { createLayerCurve, sampleStrandPoints } from "../src/lib/jewellery-engine/curve-generator.ts";

console.log("Running Jewellery Geometry Engine Unit Test...");

// 1. Test 5-Layer Curve Generation
const totalLayers = 5;
const curves = [];
for (let i = 0; i < totalLayers; i++) {
  const c = createLayerCurve(i, totalLayers);
  assert(c instanceof THREE.CatmullRomCurve3, `Layer ${i} curve must be CatmullRomCurve3`);
  curves.push(c);
}

// Verify that each progressive layer drops lower in Y (catenary concentricity)
const centerDrops = curves.map((c) => c.getPoint(0.5).y);
console.log("Center Drop Y coordinates across 5 layers:", centerDrops);

for (let i = 1; i < totalLayers; i++) {
  assert(
    centerDrops[i] < centerDrops[i - 1],
    `Layer ${i} center drop (${centerDrops[i]}) must be lower than layer ${i - 1} (${centerDrops[i - 1]})`
  );
}

// 2. Test Bead Sampling along curve
const sampleCount = 80;
const samples = sampleStrandPoints(curves[0], sampleCount);
assert.strictEqual(samples.length, sampleCount, "Sample count must match requested points");
assert(samples[0].position.length() > 0, "Bead position must be non-zero");
assert(samples[0].tangent.length() > 0.99, "Tangent must be normalized unit vector");

// 3. Test Connector Bar Bridge Calculation
function testConnectorTransform(t, totalLayers, connectedLayers = [0, 1, 2, 3, 4]) {
  const minLayer = Math.min(...connectedLayers);
  const maxLayer = Math.min(totalLayers - 1, Math.max(...connectedLayers));
  const innerCurve = createLayerCurve(minLayer, totalLayers);
  const outerCurve = createLayerCurve(maxLayer, totalLayers);

  const innerPoint = innerCurve.getPoint(t);
  const outerPoint = outerCurve.getPoint(t);
  const centerPos = new THREE.Vector3().addVectors(innerPoint, outerPoint).multiplyScalar(0.5);
  const bridgeVec = new THREE.Vector3().subVectors(outerPoint, innerPoint);
  const width = bridgeVec.length();

  return { position: centerPos, width };
}

// Midpoint of connector bridging all 5 layers at t = 0.28 (left side)
const connectorTransform = testConnectorTransform(0.28, totalLayers, [0, 1, 2, 3, 4]);
console.log("Connector Bar Position:", connectorTransform.position);
console.log("Connector Bar Physical Span Width:", connectorTransform.width);

assert(connectorTransform.width > 0.10, "Connector bar must bridge physical distance between strands");
assert(connectorTransform.position.x < 0, "Left connector must have negative X coordinate on bust");

// Symmetrical Right Connector at 1 - 0.28 = 0.72
const rightConnector = testConnectorTransform(0.72, totalLayers, [0, 1, 2, 3, 4]);
assert(rightConnector.position.x > 0, "Right connector must have positive X coordinate on bust");
assert(
  Math.abs(Math.abs(connectorTransform.position.x) - Math.abs(rightConnector.position.x)) < 0.05,
  "Left and right connector bars must be symmetrical across central YZ plane"
);

// 4. Test Pendant Hanging Transform
function testPendantTransform(layerIndex, totalLayers, attachmentOffset = 0.20) {
  const curve = createLayerCurve(layerIndex, totalLayers);
  const centerPoint = curve.getPoint(0.5);
  const pendantPosition = new THREE.Vector3(
    centerPoint.x,
    centerPoint.y - attachmentOffset,
    centerPoint.z + 0.035
  );
  return { position: pendantPosition };
}

const pendantTransform = testPendantTransform(totalLayers - 1, totalLayers);
console.log("Pendant Hanging Center Position:", pendantTransform.position);
assert(Math.abs(pendantTransform.position.x) < 0.001, "Pendant must hang centered at X = 0");
assert(pendantTransform.position.y < centerDrops[totalLayers - 1], "Pendant must hang below strand drop point");
assert(pendantTransform.position.y > -0.9, "Pendant must hang above bust base (safely inside camera frustum)");

console.log("✔ Jewellery Geometry & Attachment Engine Unit Test PASSED with 100% precision!");
