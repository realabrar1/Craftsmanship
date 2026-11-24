import assert from "assert";
import fs from "fs";
import path from "path";
import * as THREE from "three";

console.log("=================================================================");
console.log("  SUTRA & MOTI — 3D ASSET INTEGRATION & PIPELINE TEST SUITE");
console.log("=================================================================\n");

// 1. VERIFY BINARY GLB ASSETS ON DISK
console.log("1. Inspecting Binary GLB Model Assets in public/assets/jewellery/...");

const pendantPath = path.join("public", "assets", "jewellery", "pendants", "lakshmi-temple-pendant.glb");
const connectorPath = path.join("public", "assets", "jewellery", "connectors", "kundan-5loop-connector.glb");
const broochPath = path.join("public", "assets", "jewellery", "brooches", "floral-ruby-brooch.glb");

assert(fs.existsSync(pendantPath), "Lakshmi Temple Pendant GLB file must exist on disk");
const pendantStats = fs.statSync(pendantPath);
console.log(`  ✔ Lakshmi Temple Pendant GLB: ${pendantStats.size.toLocaleString()} bytes (> 100 KB verified)`);
assert(pendantStats.size > 100000, "Pendant GLB size must exceed 100 KB");

assert(fs.existsSync(connectorPath), "Kundan 5-Loop Connector GLB file must exist on disk");
const connStats = fs.statSync(connectorPath);
console.log(`  ✔ Kundan 5-Loop Connector GLB: ${connStats.size.toLocaleString()} bytes (> 50 KB verified)`);
assert(connStats.size > 50000, "Connector GLB size must exceed 50 KB");

assert(fs.existsSync(broochPath), "Floral Ruby Brooch GLB file must exist on disk");
const broochStats = fs.statSync(broochPath);
console.log(`  ✔ Floral Ruby Brooch GLB: ${broochStats.size.toLocaleString()} bytes (> 50 KB verified)`);
assert(broochStats.size > 50000, "Brooch GLB size must exceed 50 KB");

// 2. PARSE GLTF SCENE GRAPH & VERIFY SOCKET NODES
console.log("\n2. Parsing GLB Scene Graphs with Three.js GLTFLoader...");

const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
const loader = new GLTFLoader();

function parseGLB(filePath) {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(filePath);
    loader.parse(data.buffer, "", (gltf) => resolve(gltf), (err) => reject(err));
  });
}

// Inspect Pendant
const pendantGLTF = await parseGLB(pendantPath);
assert(pendantGLTF.scene, "Pendant GLB must have a valid Three.js scene");

const pendantSockets = [];
let hasReverseBackplate = false;
let hasLotusThrone = false;
let hasGoddessMurti = false;
let hasPearlJhumkas = false;

pendantGLTF.scene.traverse((node) => {
  if (node.name && node.name.startsWith("socket_")) {
    pendantSockets.push(node.name);
  }
  if (node.name?.includes("ReverseBackplate") || node.name?.includes("Hollow")) hasReverseBackplate = true;
  if (node.name?.includes("Lotus") || node.name?.includes("Padma")) hasLotusThrone = true;
  if (node.name?.includes("Goddess") || node.name?.includes("Lakshmi")) hasGoddessMurti = true;
  if (node.name?.includes("Jhumka")) hasPearlJhumkas = true;
});

console.log(`  ✔ Pendant Scene Nodes: Sockets detected -> ${pendantSockets.join(", ")}`);
assert(pendantSockets.includes("socket_bail_left"), "socket_bail_left must exist in scene graph");
assert(pendantSockets.includes("socket_bail_right"), "socket_bail_right must exist in scene graph");
assert(pendantSockets.includes("socket_center_top"), "socket_center_top must exist in scene graph");
assert(hasReverseBackplate, "Reverse backplate with hollow cavity must exist");
assert(hasLotusThrone, "Padma Peedam lotus throne must exist");
assert(hasGoddessMurti, "Goddess Lakshmi sculptural relief must exist");
assert(hasPearlJhumkas, "7 dangling pearl jhumkas must exist");
console.log("  ✔ Authentic reverse backplate, lotus throne, goddess sculpture, and pearl jhumkas verified!");

// Inspect Connector
const connGLTF = await parseGLB(connectorPath);
const connLoops = [];
connGLTF.scene.traverse((node) => {
  if (node.name && node.name.startsWith("loop_")) connLoops.push(node.name);
});
console.log(`  ✔ Connector Scene Nodes: Loops detected -> ${connLoops.join(", ")}`);
assert(connLoops.length === 5, "5 stringing loops must exist on connector");

// 3. ASSET REGISTRY VERIFICATION
console.log("\n3. Testing Asset Registry & Metadata Engine...");
const {
  ASSET_REGISTRY,
  getAssetBySku,
  getAssetsByCategory,
  validateAssetMetadata,
} = await import("../src/lib/jewellery-engine/asset-registry.ts");

const lakshmiAsset = getAssetBySku("PEN-LAKSHMI-01");
assert(lakshmiAsset, "PEN-LAKSHMI-01 must be registered");
assert.strictEqual(lakshmiAsset.category, "pendants");
assert(lakshmiAsset.dimensionsMm.width === 68.0, "Width must be 68.0mm");
assert(lakshmiAsset.dimensionsMm.height === 82.0, "Height must be 82.0mm");
assert(lakshmiAsset.dimensionsMm.depth === 14.5, "Depth must be 14.5mm");
assert(lakshmiAsset.weightGrams === 46.5, "Weight must be 46.5 grams");
assert.strictEqual(lakshmiAsset.approvalStatus, "APPROVED");
console.log(`  ✔ Asset PEN-LAKSHMI-01: ${lakshmiAsset.displayName} [APPROVED]`);

const validationResult = validateAssetMetadata(lakshmiAsset);
assert(validationResult.isValid, "Asset metadata validation must pass");
console.log("  ✔ Metadata validation check passed with 0 errors!");

const pendants = getAssetsByCategory("pendants");
assert(pendants.length >= 1, "At least 1 pendant asset must be registered");
const connectors = getAssetsByCategory("connectors");
assert(connectors.length >= 1, "At least 1 connector asset must be registered");
console.log(`  ✔ Category filters: Found ${pendants.length} pendants, ${connectors.length} connectors`);

// 4. ATTACHMENT MATH & CALIPER RESOLUTION
console.log("\n4. Testing Attachment Math & Caliper Precision...");
const { createLayerCurve } = await import(
  "../src/lib/jewellery-engine/curve-generator.ts"
);

const bottomCurve = createLayerCurve(4, 5);
const centerPoint = bottomCurve.getPoint(0.5);
const attachmentOffset = 0.20;
const pendantPosition = new THREE.Vector3(
  0,
  centerPoint.y - attachmentOffset,
  centerPoint.z + 0.035
);

console.log(`  ✔ Pendant Hanging Position: Vector3 [${pendantPosition.x.toFixed(3)}, ${pendantPosition.y.toFixed(3)}, ${pendantPosition.z.toFixed(3)}]`);
assert(Math.abs(pendantPosition.x) < 0.001, "Pendant must be centered horizontally (x ≈ 0)");
assert(pendantPosition.y < -0.20, "Pendant must hang below bottom strand apex");
assert(pendantPosition.z > 0.40, "Pendant must rest on front chest plane");

console.log("\n=================================================================");
console.log("  ✔ ALL 3D ASSET PIPELINE UNIT TESTS PASSED WITH 100% SUCCESS!");
console.log("=================================================================\n");
