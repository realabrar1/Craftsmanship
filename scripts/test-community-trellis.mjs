import { Client } from "@gradio/client";
import fs from "fs";

async function run() {
  console.log("Connecting to trellis-community/TRELLIS...");
  const client = await Client.connect("trellis-community/TRELLIS");
  console.log("Connected!");

  const imageBuffer = fs.readFileSync("public/assets/pendant/lakshmi-temple-pendant-front.jpg");
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });

  console.log("1. Preprocessing image...");
  const prep = await client.predict("/preprocess_image", [blob]);
  console.log("Preprocessed:", prep.data);

  console.log("2. Generating and extracting GLB...");
  const job = client.submit("/generate_and_extract_glb", [
    prep.data[0], // image
    [],           // multiimages
    0,            // seed
    7.5,          // ss_guidance_strength
    12,           // ss_sampling_steps
    3.0,          // slat_guidance_strength
    12,           // slat_sampling_steps
    0.95,         // mesh_simplify
    1024,         // texture_size
  ]);

  for await (const msg of job) {
    if (msg.type === "status") {
      console.log(`Status: ${msg.stage}, queue: ${msg.position ?? 0}, eta: ${msg.eta ?? "?"}s`);
    } else if (msg.type === "data") {
      console.log("Generation finished! Data:", msg.data);
      const glbFile = msg.data[1] || msg.data[0];
      console.log("GLB File:", glbFile);
      if (glbFile?.url || glbFile?.path) {
        let url = glbFile.url;
        if (!url && glbFile.path) {
          url = `https://trellis-community-trellis.hf.space/gradio_api/file=${glbFile.path}`;
        }
        console.log("Downloading GLB from:", url);
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const out = "public/assets/jewellery/pendants/trellis-community-lakshmi.glb";
        fs.writeFileSync(out, Buffer.from(buf));
        console.log(`Saved generated GLB to ${out} (${buf.byteLength} bytes)!`);
      }
    }
  }
}

run().catch((e) => console.error("Error:", e));
