import assert from "assert";
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/db.ts";
import { validateGLBFile } from "../src/lib/image-to-3d/glb-validator.ts";
import {
  ASSET_REGISTRY,
  getAssetBySku,
  registerNewAsset,
} from "../src/lib/jewellery-engine/asset-registry.ts";

console.log("=================================================================");
console.log("  SUTRA & MOTI — IMAGE-TO-3D PIPELINE & GLB VERIFICATION TEST");
console.log("=================================================================\n");

// 1. TEST GLB FILE VALIDATOR
console.log("1. Testing Binary GLB Geometry & Header Validator...");
const testGlbPath = path.resolve("public/assets/jewellery/pendants/lakshmi-temple-pendant.glb");
const validResult = await validateGLBFile(testGlbPath);

console.log("  ✔ Valid GLB Inspection:", {
  isValid: validResult.isValid,
  byteLength: `${(validResult.byteLength / 1024).toFixed(1)} KB`,
  vertexCount: validResult.vertexCount.toLocaleString(),
  meshCount: validResult.meshCount,
});
assert(validResult.isValid, "Valid GLB must pass inspection");
assert(validResult.vertexCount > 1000, "Vertex count must exceed 1000");
assert(validResult.meshCount > 0, "Mesh count must be > 0");

// Test with corrupted file
const invalidResult = await validateGLBFile("public/assets/pendant/lakshmi-temple-pendant-front.jpg");
console.log("  ✔ Corrupted/Non-GLB Detection:", {
  isValid: invalidResult.isValid,
  error: invalidResult.error,
});
assert(!invalidResult.isValid, "Non-GLB file must fail inspection");

// 2. TEST DATABASE SCHEMA & JOBS LIFECYCLE
console.log("\n2. Testing ImageTo3DJob Lifecycle in SQLite Database...");
const testJobId = `job_test_${Date.now()}`;
const testSku = `PEN-AI-TEST-${Date.now().toString().slice(-4)}`;

const createdJob = await prisma.imageTo3DJob.create({
  data: {
    jobId: testJobId,
    sku: testSku,
    name: "Goddess Lakshmi Kemp AI Test Padakkam",
    category: "pendants",
    originalImagePath: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
    thumbnailPath: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
    generationProvider: "TRELLIS.2",
    generationStatus: "PENDING",
    progressPercent: 10,
    statusMessage: "Initializing inference session...",
    dimensionsMm: JSON.stringify({ width: 68.0, height: 82.0, depth: 14.5 }),
    weightGrams: 46.5,
    attachmentPointsJson: JSON.stringify({
      socket_bail_left: { position: [-0.095, 0.285, 0.02] },
      socket_bail_right: { position: [0.095, 0.285, 0.02] },
    }),
    approvalStatus: "PENDING_REVIEW",
  },
});

console.log(`  ✔ Created ImageTo3DJob: ${createdJob.jobId} (Status: ${createdJob.generationStatus})`);
assert.strictEqual(createdJob.jobId, testJobId);
assert.strictEqual(createdJob.generationStatus, "PENDING");

// Update Job to COMPLETED
const updatedJob = await prisma.imageTo3DJob.update({
  where: { jobId: testJobId },
  data: {
    generationStatus: "COMPLETED",
    progressPercent: 100,
    statusMessage: "Watertight GLB extracted successfully.",
    generatedGlbPath: "/assets/jewellery/pendants/lakshmi-temple-pendant.glb",
    approvalStatus: "APPROVED",
  },
});

console.log(`  ✔ Updated ImageTo3DJob: ${updatedJob.jobId} (Status: ${updatedJob.generationStatus}, Progress: ${updatedJob.progressPercent}%)`);
assert.strictEqual(updatedJob.generationStatus, "COMPLETED");
assert.strictEqual(updatedJob.approvalStatus, "APPROVED");

// 3. TEST ASSET REGISTRATION & CATALOG VISIBILITY
console.log("\n3. Testing Runtime Asset Registration from Generated Model...");
registerNewAsset({
  assetId: createdJob.id,
  sku: testSku,
  displayName: createdJob.name,
  category: "pendants",
  glbPath: updatedJob.generatedGlbPath,
  thumbnail: createdJob.thumbnailPath || createdJob.originalImagePath,
  dimensionsMm: { width: 68.0, height: 82.0, depth: 14.5 },
  weightGrams: 46.5,
  materialInfo: {
    metalType: "22K Antique Temple Gold",
    metalPurity: "916 Hallmark",
    finish: "Hand-brushed Micro-patina",
    stoneTypes: ["Natural Burmese Kemp Ruby", "Natural Zambian Emerald"],
  },
  sockets: {
    socket_bail_left: {
      name: "socket_bail_left",
      position: [-0.095, 0.285, 0.02],
      normal: [-0.2, 0.95, 0.15],
      loopDiameterMm: 3.2,
      maxThreadThicknessMm: 1.8,
    },
    socket_bail_right: {
      name: "socket_bail_right",
      position: [0.095, 0.285, 0.02],
      normal: [0.2, 0.95, 0.15],
      loopDiameterMm: 3.2,
      maxThreadThicknessMm: 1.8,
    },
  },
  compatibilityRules: {
    minStrands: 3,
    maxStrands: 7,
    supportedBeadDiametersMm: [4.0, 9.0],
  },
  pricing: {
    basePriceInr: 16500,
    makingChargesInr: 3400,
    gstRatePercent: 3,
  },
  approvalStatus: "APPROVED",
});

const retrievedAsset = getAssetBySku(testSku);
console.log(`  ✔ Retrieved Registered Asset from Catalog: ${retrievedAsset?.sku} -> ${retrievedAsset?.displayName}`);
assert(retrievedAsset, "Asset must be retrievable from ASSET_REGISTRY by SKU");
assert.strictEqual(retrievedAsset.approvalStatus, "APPROVED");

// Clean up test DB record
await prisma.imageTo3DJob.delete({ where: { jobId: testJobId } });
console.log("  ✔ Cleaned up test database record.");

console.log("\n=================================================================");
console.log("  ✔ ALL IMAGE-TO-3D PIPELINE UNIT TESTS PASSED WITH 100% SUCCESS!");
console.log("=================================================================\n");
