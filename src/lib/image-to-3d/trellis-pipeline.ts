import fs from "fs";
import path from "path";
import { Client } from "@gradio/client";
import { prisma } from "@/lib/db";
import * as THREE from "three";
import { validateGLBFile, GLBValidationResult } from "./glb-validator";

export { validateGLBFile };
export type { GLBValidationResult };

export interface GenerationOptions {
  jobId: string;
  sku: string;
  name: string;
  category: string;
  imageFilePath: string;
  provider?: "TRELLIS.2" | "TRELLIS" | "MANUAL_UPLOAD";
  hfToken?: string;
  decimationTarget?: number;
  textureSize?: number;
}

export interface JobProgressUpdate {
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progressPercent: number;
  statusMessage: string;
  generatedGlbPath?: string;
  errorMessage?: string;
}


/**
 * Updates an ImageTo3DJob record in SQLite.
 */
async function updateJob(jobId: string, update: JobProgressUpdate) {
  try {
    await prisma.imageTo3DJob.update({
      where: { jobId },
      data: {
        generationStatus: update.status,
        progressPercent: update.progressPercent,
        statusMessage: update.statusMessage,
        generatedGlbPath: update.generatedGlbPath,
        errorMessage: update.errorMessage,
      },
    });
  } catch (e) {
    console.warn(`Failed to update job ${jobId} in DB:`, e);
  }
}

/**
 * Executes TRELLIS.2 Image-to-3D Generation Pipeline via Hugging Face Hosted Inference.
 */
export async function executeTrellisGeneration(options: GenerationOptions): Promise<string> {
  const {
    jobId,
    sku,
    name,
    category,
    imageFilePath,
    provider = "TRELLIS.2",
    hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN,
    decimationTarget = 150000,
    textureSize = 2048,
  } = options;

  console.log(`[Job ${jobId}] Starting 3D Generation with provider: ${provider}...`);

  await updateJob(jobId, {
    status: "PROCESSING",
    progressPercent: 10,
    statusMessage: "Reading source photograph and initializing inference session...",
  });

  const absoluteImagePath = path.isAbsolute(imageFilePath)
    ? imageFilePath
    : path.resolve(process.cwd(), imageFilePath);

  if (!fs.existsSync(absoluteImagePath)) {
    const errorMsg = `Source image not found: ${absoluteImagePath}`;
    await updateJob(jobId, { status: "FAILED", progressPercent: 0, statusMessage: "Failed", errorMessage: errorMsg });
    throw new Error(errorMsg);
  }

  const imageBuffer = fs.readFileSync(absoluteImagePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });

  try {
    // -------------------------------------------------------------
    // PROVIDER: MICROSOFT TRELLIS.2
    // -------------------------------------------------------------
    if (provider === "TRELLIS.2") {
      const spaceName = "microsoft/TRELLIS.2";
      console.log(`[Job ${jobId}] Connecting to ${spaceName}...`);

      const connectOptions: any = {};
      if (hfToken && hfToken.trim().startsWith("hf_")) {
        connectOptions.hf_token = hfToken.trim();
        console.log(`[Job ${jobId}] Authenticating with Hugging Face token.`);
      }

      const client = await Client.connect(spaceName, connectOptions);

      await updateJob(jobId, {
        status: "PROCESSING",
        progressPercent: 25,
        statusMessage: "Connected to TRELLIS.2. Preprocessing image (background removal)...",
      });

      console.log(`[Job ${jobId}] Calling /start_session...`);
      await client.predict("/start_session", []);

      console.log(`[Job ${jobId}] Calling /preprocess_image...`);
      const prepRes = await client.predict("/preprocess_image", [blob]);
      const preprocessedImage = (prepRes as any)?.data?.[0];

      if (!preprocessedImage) {
        throw new Error("Failed to preprocess image (transparency extraction failed).");
      }

      await updateJob(jobId, {
        status: "PROCESSING",
        progressPercent: 50,
        statusMessage: "Running 4B flow-matching transformer (Structured Latent generation)...",
      });

      console.log(`[Job ${jobId}] Calling /image_to_3d...`);
      const job = client.submit("/image_to_3d", [
        preprocessedImage,
        0,        // seed
        "1024",   // resolution
        7.5,      // ss_guidance_strength
        0.7,      // ss_guidance_rescale
        12,       // ss_sampling_steps
        5,        // ss_rescale_t
        7.5,      // shape_slat_guidance_strength
        0.5,      // shape_slat_guidance_rescale
        12,       // shape_slat_sampling_steps
        3,        // shape_slat_rescale_t
        1,        // tex_slat_guidance_strength
        0,        // tex_slat_guidance_rescale
        12,       // tex_slat_sampling_steps
        3,        // tex_slat_rescale_t
      ]);

      for await (const msg of job) {
        if (msg.type === "status") {
          console.log(`[Job ${jobId}] Status: ${msg.stage}, queue: ${msg.position ?? 0}`);
          await updateJob(jobId, {
            status: "PROCESSING",
            progressPercent: 65,
            statusMessage: `Generating 3D radiance fields (Queue position: ${msg.position ?? 1})...`,
          });
        }
      }

      await updateJob(jobId, {
        status: "PROCESSING",
        progressPercent: 85,
        statusMessage: "Extracting watertight mesh & baking PBR textures into binary GLB...",
      });

      console.log(`[Job ${jobId}] Calling /extract_glb...`);
      const extractRes: any = await client.predict("/extract_glb", [
        decimationTarget,
        textureSize,
      ]);

      const glbFileData = extractRes?.data?.[1] || extractRes?.data?.[0];
      if (!glbFileData) {
        throw new Error("Failed to extract GLB model from inference output.");
      }

      let downloadUrl = glbFileData.url;
      if (!downloadUrl && glbFileData.path) {
        downloadUrl = `https://microsoft-trellis-2.hf.space/gradio_api/file=${glbFileData.path}`;
      }

      console.log(`[Job ${jobId}] Downloading GLB from: ${downloadUrl}`);
      const glbResponse = await fetch(downloadUrl);
      const glbArrayBuffer = await glbResponse.arrayBuffer();

      // Destination path
      const outDir = path.resolve(process.cwd(), "public/assets/jewellery/generated");
      fs.mkdirSync(outDir, { recursive: true });
      const glbFilename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}.glb`;
      const finalGlbPath = path.join(outDir, glbFilename);
      const publicGlbUrl = `/assets/jewellery/generated/${glbFilename}`;

      fs.writeFileSync(finalGlbPath, Buffer.from(glbArrayBuffer));
      console.log(`[Job ${jobId}] Saved GLB to ${finalGlbPath} (${glbArrayBuffer.byteLength} bytes)!`);

      // Validate geometry
      const validation = await validateGLBFile(finalGlbPath);
      if (!validation.isValid) {
        throw new Error(`Generated model validation failed: ${validation.error}`);
      }

      await updateJob(jobId, {
        status: "COMPLETED",
        progressPercent: 100,
        statusMessage: `3D Model generated successfully (${validation.vertexCount.toLocaleString()} vertices, ${(validation.byteLength / 1024).toFixed(1)} KB)!`,
        generatedGlbPath: publicGlbUrl,
      });

      return publicGlbUrl;
    }

    // -------------------------------------------------------------
    // PROVIDER: COMMUNITY TRELLIS (trellis-community/TRELLIS)
    // -------------------------------------------------------------
    else if (provider === "TRELLIS") {
      const spaceName = "trellis-community/TRELLIS";
      console.log(`[Job ${jobId}] Connecting to ${spaceName}...`);
      const connectOptions: any = {};
      if (hfToken && hfToken.trim().startsWith("hf_")) {
        connectOptions.hf_token = hfToken.trim();
      }

      const client = await Client.connect(spaceName, connectOptions);

      await updateJob(jobId, {
        status: "PROCESSING",
        progressPercent: 25,
        statusMessage: "Connected to community TRELLIS. Preprocessing image...",
      });

      const prepRes: any = await client.predict("/preprocess_image", [blob]);
      const preprocessedImage = prepRes?.data?.[0];

      await updateJob(jobId, {
        status: "PROCESSING",
        progressPercent: 60,
        statusMessage: "Generating 3D radiance field & extracting GLB in unified pass...",
      });

      const genRes: any = await client.predict("/generate_and_extract_glb", [
        preprocessedImage,
        [],
        0,
        7.5,
        12,
        3.0,
        12,
        0.95,
        textureSize,
      ]);

      const glbFileData = genRes?.data?.[1] || genRes?.data?.[0];
      if (!glbFileData) {
        throw new Error("Failed to receive GLB from community TRELLIS.");
      }

      let downloadUrl = glbFileData.url;
      if (!downloadUrl && glbFileData.path) {
        downloadUrl = `https://trellis-community-trellis.hf.space/gradio_api/file=${glbFileData.path}`;
      }

      const glbResponse = await fetch(downloadUrl);
      const glbArrayBuffer = await glbResponse.arrayBuffer();

      const outDir = path.resolve(process.cwd(), "public/assets/jewellery/generated");
      fs.mkdirSync(outDir, { recursive: true });
      const glbFilename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}.glb`;
      const finalGlbPath = path.join(outDir, glbFilename);
      const publicGlbUrl = `/assets/jewellery/generated/${glbFilename}`;

      fs.writeFileSync(finalGlbPath, Buffer.from(glbArrayBuffer));

      const validation = await validateGLBFile(finalGlbPath);
      if (!validation.isValid) {
        throw new Error(`Generated model validation failed: ${validation.error}`);
      }

      await updateJob(jobId, {
        status: "COMPLETED",
        progressPercent: 100,
        statusMessage: `3D Model generated successfully (${validation.vertexCount.toLocaleString()} vertices, ${(validation.byteLength / 1024).toFixed(1)} KB)!`,
        generatedGlbPath: publicGlbUrl,
      });

      return publicGlbUrl;
    }

    throw new Error(`Unsupported generation provider: ${provider}`);
  } catch (err: any) {
    console.error(`[Job ${jobId}] Generation Error:`, err);

    let friendlyError = err?.message || "Failed to generate 3D asset from image.";
    if (friendlyError.includes("ZeroGPU quota")) {
      friendlyError =
        "Hugging Face ZeroGPU Anonymous Quota Exceeded. You can provide a free Hugging Face User Access Token (from https://huggingface.co/settings/tokens) in the HF Token field, or use the Direct 3D Model Upload fallback below.";
    }

    await updateJob(jobId, {
      status: "FAILED",
      progressPercent: 0,
      statusMessage: "Generation Failed",
      errorMessage: friendlyError,
    });

    throw new Error(friendlyError);
  }
}
