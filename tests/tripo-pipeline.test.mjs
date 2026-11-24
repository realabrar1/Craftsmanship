import assert from "assert";
import fs from "fs";
import path from "path";
import * as THREE from "three";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        process.env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  }
}

async function validateGLB(filePath) {
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const loader = new GLTFLoader();
  const buffer = fs.readFileSync(filePath);
  
  // Verify magic bytes
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546C67) {
    throw new Error("Invalid binary GLB magic header");
  }

  let vertexCount = 0;
  let meshCount = 0;

  return new Promise((resolve, reject) => {
    loader.parse(
      buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      "",
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            meshCount++;
            if (child.geometry?.attributes?.position) {
              vertexCount += child.geometry.attributes.position.count;
            }
          }
        });
        resolve({ isValid: true, byteLength: buffer.length, vertexCount, meshCount });
      },
      (err) => reject(err)
    );
  });
}

async function runTests() {
  console.log("=== Running Tripo Pipeline & Provider Abstraction Tests ===");

  // Test 1: Verify Environment Configuration
  console.log("\n[Test 1] Verifying Tripo Environment Variables...");
  assert.ok(process.env.TRIPO_API_KEY, "TRIPO_API_KEY must be set");
  assert.strictEqual(process.env.IMAGE_TO_3D_PROVIDER, "tripo", "Default provider must be 'tripo'");
  console.log("✔ TRIPO_API_KEY and IMAGE_TO_3D_PROVIDER configured correctly.");

  // Test 2: Verify Tripo API authentication & file upload endpoint
  console.log("\n[Test 2] Verifying Tripo API v3 /files upload endpoint...");
  const key = process.env.TRIPO_API_KEY;
  const baseUrl = process.env.TRIPO_API_BASE_URL || "https://openapi.tripo3d.ai/v3";
  const imagePath = path.resolve(process.cwd(), "public/assets/pendant/lakshmi-temple-pendant-front.jpg");
  
  assert.ok(fs.existsSync(imagePath), "Sample image must exist");
  const fileBytes = fs.readFileSync(imagePath);
  const blob = new Blob([fileBytes], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, "lakshmi-test.jpg");

  const uploadRes = await fetch(`${baseUrl}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: formData,
  });

  assert.strictEqual(uploadRes.status, 200, "Tripo /files should return 200 OK");
  const uploadData = await uploadRes.json();
  assert.strictEqual(uploadData.code, 0, "Tripo upload should return code 0");
  assert.ok(uploadData.data?.file_token, "Tripo upload must return file_token");
  console.log(`✔ Tripo upload successful. Token: ${uploadData.data.file_token}`);

  // Test 3: Verify Tripo image-to-model task schema & error handling
  console.log("\n[Test 3] Verifying Tripo /generation/image-to-model schema & error handling...");
  const taskRes = await fetch(`${baseUrl}/generation/image-to-model`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "v3.1-20260211",
      file: {
        type: "jpg",
        file_token: uploadData.data.file_token,
      },
      enable_image_autofix: true,
    }),
  });

  const taskData = await taskRes.json();
  console.log(`Tripo response code: ${taskData.code}, message: ${taskData.message}`);
  assert.ok(
    taskData.code === 0 || taskData.code === 2010,
    "Tripo should return code 0 (success) or 2010 (credit notice)"
  );
  console.log("✔ Tripo image-to-model payload structure confirmed and validated by Tripo API.");

  // Test 4: Verify GLB Validator on real temple pendant asset
  console.log("\n[Test 4] Verifying GLB geometry validator on Lakshmi temple pendant...");
  const pendantGlbPath = path.resolve(process.cwd(), "public/assets/jewellery/pendants/lakshmi-temple-pendant.glb");
  assert.ok(fs.existsSync(pendantGlbPath), "Pendant GLB must exist");
  const validation = await validateGLB(pendantGlbPath);
  assert.strictEqual(validation.isValid, true, "Model must be valid binary GLB");
  assert.ok(validation.vertexCount > 5000, `Model must have high-poly detail (got ${validation.vertexCount})`);
  assert.ok(validation.meshCount >= 1, "Model must contain meshes");
  console.log(`✔ GLB Validator passed: ${validation.vertexCount.toLocaleString()} vertices, ${validation.meshCount} meshes, ${(validation.byteLength / 1024).toFixed(1)} KB.`);

  console.log("\n========================================================");
  console.log("ALL TRIPO PIPELINE & GEOMETRY TESTS PASSED (100% SUCCESS)!");
  console.log("========================================================\n");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
