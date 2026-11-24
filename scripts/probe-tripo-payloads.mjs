import fs from "fs";
import path from "path";

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
const baseUrl = "https://openapi.tripo3d.ai/v3";

async function probe() {
  const fileToken = "file_5ab92878-a1d2-4aed-8e38-2e23061a08f0"; // valid token from upload earlier
  
  const payloads = [
    { name: "file as object with type and file_token", body: { type: "image_to_model", file: { type: "jpg", file_token: fileToken } } },
    { name: "file as object with file_token only", body: { type: "image_to_model", file: { file_token: fileToken } } },
    { name: "file as string token", body: { type: "image_to_model", file: fileToken } },
    { name: "model + file object", body: { model: "v3.1-20260211", file: { type: "jpg", file_token: fileToken } } },
    { name: "model + file string", body: { model: "v3.1-20260211", file: fileToken } },
    { name: "input as string token", body: { model: "v3.1-20260211", input: fileToken } },
  ];

  const endpoints = [
    "/generation/image-to-model",
    "/task",
  ];

  for (const ep of endpoints) {
    for (const p of payloads) {
      console.log(`\nTesting endpoint ${ep} with ${p.name}:`);
      try {
        const res = await fetch(`${baseUrl}${ep}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(p.body),
        });
        const data = await res.json();
        console.log(`Status ${res.status}:`, JSON.stringify(data));
      } catch (e) {
        console.error("Error:", e.message);
      }
    }
  }
}

probe();
