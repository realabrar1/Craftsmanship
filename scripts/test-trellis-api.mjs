import { Client } from "@gradio/client";
import fs from "fs";
import path from "path";

async function testTrellis() {
  console.log("Connecting to microsoft/TRELLIS.2...");
  const client = await Client.connect("microsoft/TRELLIS.2");
  console.log("Connected!");

  const imagePath = path.resolve("public/assets/pendant/lakshmi-temple-pendant-front.jpg");
  console.log("Reading test image:", imagePath);
  const imageBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });

  console.log("Step 1: Starting session...");
  await client.predict("/start_session", []);

  console.log("Step 2: Preprocessing image (background removal / transparency)...");
  const preprocessRes = await client.predict("/preprocess_image", [blob]);
  console.log("Preprocess result:", preprocessRes.data);

  const preprocessedImg = preprocessRes.data[0];

  console.log("Step 3: Running image_to_3d inference (flow-matching)...");
  const job = client.submit("/image_to_3d", [
    preprocessedImg, // Image Prompt
    0,               // Seed
    "1024",          // Resolution
    7.5,             // ss_guidance_strength
    0.7,             // ss_guidance_rescale
    12,              // ss_sampling_steps
    5,               // ss_rescale_t
    7.5,             // shape_slat_guidance_strength
    0.5,             // shape_slat_guidance_rescale
    12,              // shape_slat_sampling_steps
    3,               // shape_slat_rescale_t
    1,               // tex_slat_guidance_strength
    0,               // tex_slat_guidance_rescale
    12,              // tex_slat_sampling_steps
    3,               // tex_slat_rescale_t
  ]);

  for await (const msg of job) {
    if (msg.type === "status") {
      console.log(`Status: ${msg.stage}, queue pos: ${msg.position ?? 0}, eta: ${msg.eta ?? "?"}s`);
    } else if (msg.type === "data") {
      console.log("image_to_3d inference completed! Data:", msg.data);
    }
  }

  console.log("Step 4: Extracting GLB binary model...");
  const extractRes = await client.predict("/extract_glb", [
    150000, // decimation_target (optimized for web viewing)
    2048,   // texture_size
  ]);
  console.log("Extract result:", extractRes.data);

  if (extractRes.data && extractRes.data[1]) {
    const glbFile = extractRes.data[1];
    console.log("GLB File info:", glbFile);
    let glbUrl = glbFile.url;
    if (!glbUrl && glbFile.path) {
      glbUrl = `https://microsoft-trellis-2.hf.space/file=${glbFile.path}`;
    }
    console.log("Downloading GLB from:", glbUrl);
    const glbResponse = await fetch(glbUrl);
    const glbBuf = await glbResponse.arrayBuffer();
    const outPath = "public/assets/jewellery/pendants/trellis-generated-lakshmi.glb";
    fs.writeFileSync(outPath, Buffer.from(glbBuf));
    console.log(`Successfully saved generated GLB -> ${outPath} (${glbBuf.byteLength} bytes)!`);
  }
}

testTrellis().catch((err) => {
  console.error("TRELLIS test failed:", err);
});
