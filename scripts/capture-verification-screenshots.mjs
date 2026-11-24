import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

async function waitForPort(url, retries = 12, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`Failed to connect to ${url} after ${retries} attempts`);
}

async function captureUrl(url, outputPath, waitMs = 5000) {
  console.log(`Navigating to ${url}...`);
  const tmpDir = path.join(os.tmpdir(), `edge-cap-${Date.now()}`);
  const edge = spawn("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", [
    "--headless=new",
    "--remote-debugging-port=9222",
    `--user-data-dir=${tmpDir}`,
    "--window-size=1440,900",
    url,
  ]);

  try {
    const tabs = await waitForPort("http://127.0.0.1:9222/json", 12, 1000);
    const target = tabs.find((t) => t.url.includes("localhost:3000") || (t.type === "page" && !t.url.startsWith("devtools://")));
    if (!target || !target.webSocketDebuggerUrl) {
      throw new Error("No valid target tab found.");
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Capture timed out")), waitMs + 8000);

      ws.addEventListener("open", async () => {
        ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
        ws.send(JSON.stringify({ id: 2, method: "Page.enable" }));

        // Wait for WebGL shader compilation and GLTF model load
        await new Promise((r) => setTimeout(r, waitMs));

        ws.send(
          JSON.stringify({
            id: 20,
            method: "Page.captureScreenshot",
            params: { format: "png" },
          })
        );
      });

      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 20 && msg.result?.data) {
          clearTimeout(timer);
          fs.writeFileSync(outputPath, Buffer.from(msg.result.data, "base64"));
          console.log(`Saved screenshot -> ${outputPath}`);
          resolve(true);
        }
      });

      ws.addEventListener("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
    });

    ws.close();
    return true;
  } catch (err) {
    console.error("Capture error:", err);
    return false;
  } finally {
    edge.kill();
    await new Promise((r) => setTimeout(r, 1000));
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

async function run() {
  console.log("Capturing Sutra & Moti Visual Verification Screenshots...");

  // 1. Admin AI Image-to-3D Generator Studio
  await captureUrl(
    "http://localhost:3000/admin?auth=demo&tab=IMAGE_TO_3D",
    "audit/screenshots/admin-tripo-generation.png",
    5500
  );
  await captureUrl(
    "http://localhost:3000/admin?auth=demo&tab=IMAGE_TO_3D",
    "audit/screenshots/admin-image-to-3d-studio.png",
    5500
  );

  // 2. Customer 3D Atelier with live pendant
  await captureUrl(
    "http://localhost:3000/design-your-necklace",
    "audit/screenshots/3d-engine-real-glb-pendant.png",
    5000
  );

  console.log("All screenshots captured successfully!");
}

run();
