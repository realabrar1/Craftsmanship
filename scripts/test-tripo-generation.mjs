import fs from "fs";
import path from "path";

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

const key = process.env.TRIPO_API_KEY;
const baseUrl = process.env.TRIPO_API_BASE_URL || "https://openapi.tripo3d.ai/v3";

console.log("=== Testing Official Tripo API v3 ===");
console.log("Base URL:", baseUrl);
console.log("API Key present:", !!key);

async function run() {
  const imagePath = path.resolve(process.cwd(), "public/assets/pendant/lakshmi-temple-pendant-front.jpg");
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found at ${imagePath}`);
  }

  // 1. Upload file to /v3/files
  console.log("\nStep 1: Uploading image to POST /v3/files...");
  const fileBytes = fs.readFileSync(imagePath);
  const blob = new Blob([fileBytes], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, "lakshmi-temple-pendant-front.jpg");

  const uploadRes = await fetch(`${baseUrl}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: formData,
  });

  const uploadData = await uploadRes.json();
  console.log("Upload response:", JSON.stringify(uploadData, null, 2));

  if (uploadData.code !== 0 || !uploadData.data?.file_token) {
    throw new Error(`Upload failed: ${uploadData.message || JSON.stringify(uploadData)}`);
  }

  const fileToken = uploadData.data.file_token;
  console.log("Acquired file_token:", fileToken);

  // 2. Submit image-to-model generation task
  console.log("\nStep 2: Submitting image-to-model generation request...");
  const genPayload = {
    model: "v3.1-20260211",
    input: {
      file_token: fileToken,
    },
    enable_image_autofix: true,
  };

  const genRes = await fetch(`${baseUrl}/generation/image-to-model`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(genPayload),
  });

  const genData = await genRes.json();
  console.log("Generation response:", JSON.stringify(genData, null, 2));

  if (genData.code !== 0 || !genData.data?.task_id) {
    throw new Error(`Task creation failed: ${genData.message || JSON.stringify(genData)}`);
  }

  const taskId = genData.data.task_id;
  console.log("Task ID created successfully:", taskId);

  // 3. Poll task status
  console.log("\nStep 3: Polling task status every 5 seconds...");
  let attempts = 0;
  const maxAttempts = 60; // 5 mins max
  let modelUrl = null;

  while (attempts < maxAttempts) {
    attempts++;
    await new Promise((r) => setTimeout(r, 5000));

    const pollRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    const pollData = await pollRes.json();
    const task = pollData.data;
    console.log(`[Attempt ${attempts}] Status: ${task?.status}, Progress: ${task?.progress}%`);

    if (task?.status === "success") {
      modelUrl = task.output?.model_url;
      console.log("Task SUCCESS! Model URL:", modelUrl);
      break;
    } else if (task?.status === "failed" || task?.status === "cancelled" || task?.status === "expired") {
      throw new Error(`Task ${taskId} ended with status: ${task.status}`);
    }
  }

  if (!modelUrl) {
    throw new Error("Task timed out before completion.");
  }

  // 4. Download generated GLB
  console.log("\nStep 4: Downloading generated GLB model...");
  const glbRes = await fetch(modelUrl);
  if (!glbRes.ok) {
    throw new Error(`Failed to download GLB: ${glbRes.statusText}`);
  }

  const glbBuffer = Buffer.from(await glbRes.arrayBuffer());
  const outDir = path.resolve(process.cwd(), "public/assets/jewellery/pendants");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "tripo-lakshmi-temple-pendant.glb");
  fs.writeFileSync(outPath, glbBuffer);

  console.log(`\nSUCCESS! Saved Tripo GLB (${glbBuffer.length} bytes) to ${outPath}`);
  console.log("Magic bytes (glTF):", glbBuffer.toString("utf8", 0, 4));
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
