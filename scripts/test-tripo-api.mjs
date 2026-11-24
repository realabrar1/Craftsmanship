import fs from "fs";
import path from "path";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

const key = process.env.TRIPO_API_KEY;
console.log("TRIPO_API_KEY set:", !!key);

async function testBalance() {
  console.log("Testing Tripo API v3 endpoints...");
  try {
    const res = await fetch("https://openapi.tripo3d.ai/v3/user/balance", {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    console.log("Balance status:", res.status);
    const data = await res.json();
    console.log("Balance response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Balance test failed:", err);
  }
}

testBalance();
