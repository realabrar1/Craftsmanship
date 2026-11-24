import fs from "fs";
import path from "path";
import { Client } from "@gradio/client";
import { prisma } from "@/lib/db";
import { validateGLBFile } from "../glb-validator";
import { ImageTo3DProvider, GenerationJobOptions, ProviderGenerationResult } from "./image-to-3d-provider";

export class TrellisProvider implements ImageTo3DProvider {
  id: string;
  name: string;
  description: string;
  spaceName: string;

  constructor(variant: "TRELLIS.2" | "TRELLIS" = "TRELLIS.2") {
    this.id = variant;
    if (variant === "TRELLIS.2") {
      this.name = "Microsoft TRELLIS.2";
      this.description = "Hugging Face ZeroGPU hosted 4B flow-matching transformer.";
      this.spaceName = "microsoft/TRELLIS.2";
    } else {
      this.name = "Community TRELLIS";
      this.description = "trellis-community/TRELLIS open inference pipeline.";
      this.spaceName = "trellis-community/TRELLIS";
    }
  }

  private async updateJob(
    jobId: string,
    status: "PROCESSING" | "COMPLETED" | "FAILED",
    progress: number,
    message: string,
    glbPath?: string,
    error?: string
  ) {
    try {
      await prisma.imageTo3DJob.update({
        where: { jobId },
        data: {
          generationStatus: status,
          progressPercent: progress,
          statusMessage: message,
          ...(glbPath ? { generatedGlbPath: glbPath } : {}),
          ...(error ? { errorMessage: error } : {}),
        },
      });
    } catch (e) {
      console.warn(`[TrellisProvider] Failed to update job ${jobId} in DB:`, e);
    }
  }

  async generate(options: GenerationJobOptions): Promise<ProviderGenerationResult> {
    const {
      jobId,
      sku,
      imageFilePath,
      hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN,
      decimationTarget = 150000,
      textureSize = 2048,
    } = options;

    const absoluteImagePath = path.isAbsolute(imageFilePath)
      ? imageFilePath
      : path.resolve(process.cwd(), imageFilePath);

    if (!fs.existsSync(absoluteImagePath)) {
      const err = `Source image not found: ${absoluteImagePath}`;
      await this.updateJob(jobId, "FAILED", 0, "Image not found", undefined, err);
      throw new Error(err);
    }

    const imageBuffer = fs.readFileSync(absoluteImagePath);
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });

    await this.updateJob(
      jobId,
      "PROCESSING",
      15,
      `Connecting to Hugging Face space ${this.spaceName}...`
    );

    const connectOptions: any = {};
    if (hfToken && hfToken.trim().startsWith("hf_")) {
      connectOptions.hf_token = hfToken.trim();
    }

    const client = await Client.connect(this.spaceName, connectOptions);

    await this.updateJob(
      jobId,
      "PROCESSING",
      30,
      "Preprocessing photograph and removing background..."
    );

    if (this.id === "TRELLIS.2") {
      await client.predict("/start_session", []);
      const prepRes: any = await client.predict("/preprocess_image", [blob]);
      const preprocessedImage = prepRes?.data?.[0];

      if (!preprocessedImage) {
        throw new Error("Failed to preprocess image (transparency extraction failed).");
      }

      await this.updateJob(
        jobId,
        "PROCESSING",
        55,
        "Running 4B flow-matching transformer (Structured Latent generation)..."
      );

      const job = client.submit("/image_to_3d", [
        preprocessedImage,
        0,
        "1024",
        7.5,
        0.7,
        12,
        5,
        7.5,
        0.5,
        12,
        3,
        1,
        0,
        12,
        3,
      ]);

      for await (const msg of job) {
        if (msg.type === "status") {
          await this.updateJob(
            jobId,
            "PROCESSING",
            65,
            `Generating 3D radiance fields (Queue position: ${msg.position ?? 1})...`
          );
        }
      }

      await this.updateJob(
        jobId,
        "PROCESSING",
        85,
        "Extracting watertight mesh & baking PBR textures into binary GLB..."
      );

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

      const successMsg = `TRELLIS.2 model generated successfully (${validation.vertexCount.toLocaleString()} vertices, ${(validation.byteLength / 1024).toFixed(1)} KB)!`;

      await this.updateJob(jobId, "COMPLETED", 100, successMsg, publicGlbUrl);

      return {
        publicGlbUrl,
        finalGlbPath,
        vertexCount: validation.vertexCount,
        meshCount: validation.meshCount,
        byteLength: validation.byteLength,
        message: successMsg,
      };
    } else {
      // Community TRELLIS
      const prepRes: any = await client.predict("/preprocess_image", [blob]);
      const preprocessedImage = prepRes?.data?.[0];

      await this.updateJob(
        jobId,
        "PROCESSING",
        60,
        "Generating 3D radiance field & extracting GLB in unified pass..."
      );

      const genRes: any = await client.predict("/generate_and_extract_glb", [
        preprocessedImage,
        [],
        0,
        7.5,
        decimationTarget,
        textureSize,
      ]);

      const glbFileData = genRes?.data?.[0];
      if (!glbFileData?.url) {
        throw new Error("Failed to extract GLB model from community TRELLIS.");
      }

      const glbResponse = await fetch(glbFileData.url);
      const glbArrayBuffer = await glbResponse.arrayBuffer();

      const outDir = path.resolve(process.cwd(), "public/assets/jewellery/generated");
      fs.mkdirSync(outDir, { recursive: true });
      const glbFilename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-comm-${Date.now()}.glb`;
      const finalGlbPath = path.join(outDir, glbFilename);
      const publicGlbUrl = `/assets/jewellery/generated/${glbFilename}`;

      fs.writeFileSync(finalGlbPath, Buffer.from(glbArrayBuffer));

      const validation = await validateGLBFile(finalGlbPath);
      if (!validation.isValid) {
        throw new Error(`Generated model validation failed: ${validation.error}`);
      }

      const successMsg = `Community TRELLIS model generated (${validation.vertexCount.toLocaleString()} vertices)!`;
      await this.updateJob(jobId, "COMPLETED", 100, successMsg, publicGlbUrl);

      return {
        publicGlbUrl,
        finalGlbPath,
        vertexCount: validation.vertexCount,
        meshCount: validation.meshCount,
        byteLength: validation.byteLength,
        message: successMsg,
      };
    }
  }
}
