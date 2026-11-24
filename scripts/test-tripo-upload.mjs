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

async function testUpload() {
  const imagePath = path.resolve(process.cwd(), "public/assets/pendant/lakshmi-temple-pendant-front.jpg");
  console.log("Image exists:", fs.existsSync(imagePath));
  const fileBytes = fs.readFileSync(imagePath);
  
  const blob = new Blob([fileBytes], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, "lakshmi-temple-pendant-front.jpg");

  console.log("Uploading image to https://openapi.tripo3d.ai/v3/upload...");
  const res = await fetch("https://openapi.tripo3d.ai/v3/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: formData,
  });

  console.log("Upload status:", res.status);
  const data = await res.json();
  console.log("Upload response:", JSON.stringify(data, null, 2));
}

testUpload();
