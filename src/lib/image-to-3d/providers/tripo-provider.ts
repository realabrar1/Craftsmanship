import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { validateGLBFile } from "../glb-validator";
import { ImageTo3DProvider, GenerationJobOptions, ProviderGenerationResult } from "./image-to-3d-provider";

export class TripoProvider implements ImageTo3DProvider {
  id = "TRIPO";
  name = "Tripo Studio Official API";
  description = "Official Tripo v3.1 H-Series high-fidelity PBR 3D reconstruction engine.";

  private getApiKey(): string {
    const key = process.env.TRIPO_API_KEY;
    if (!key || key.trim() === "") {
      throw new Error(
        "TRIPO_API_KEY environment variable is not configured. Please set TRIPO_API_KEY in .env.local."
      );
    }
    return key.trim();
  }

  private getBaseUrl(): string {
    return process.env.TRIPO_API_BASE_URL || "https://openapi.tripo3d.ai/v3";
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
      console.warn(`[TripoProvider] Failed to update job ${jobId} in DB:`, e);
    }
  }

  async generate(options: GenerationJobOptions): Promise<ProviderGenerationResult> {
    const {
      jobId,
      sku,
      imageFilePath,
      tripoModel = "v3.1-20260211",
    } = options;

    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();

    const absoluteImagePath = path.isAbsolute(imageFilePath)
      ? imageFilePath
      : path.resolve(process.cwd(), imageFilePath);

    if (!fs.existsSync(absoluteImagePath)) {
      const err = `Source image file not found at: ${absoluteImagePath}`;
      await this.updateJob(jobId, "FAILED", 0, "Image not found", undefined, err);
      throw new Error(err);
    }

    console.log(`[TripoProvider] Starting generation for job ${jobId} using model ${tripoModel}...`);

    // -------------------------------------------------------------------------
    // STEP 1: Upload Source Image to Tripo API v3 /files
    // -------------------------------------------------------------------------
    await this.updateJob(
      jobId,
      "PROCESSING",
      15,
      "Uploading reference photograph to Tripo Studio v3 cloud storage..."
    );

    const imageBuffer = fs.readFileSync(absoluteImagePath);
    const ext = path.extname(absoluteImagePath).toLowerCase();
    const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    const fileTypeParam = ext === ".png" ? "png" : "jpg";

    const blob = new Blob([imageBuffer], { type: mimeType });
    const formData = new FormData();
    formData.append("file", blob, path.basename(absoluteImagePath));

    console.log(`[TripoProvider] Uploading ${imageBuffer.length} bytes to ${baseUrl}/files...`);
    const uploadRes = await fetch(`${baseUrl}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const uploadData: any = await uploadRes.json();
    if (uploadData.code !== 0 || !uploadData.data?.file_token) {
      const errMsg = uploadData.message || `File upload failed with code ${uploadData.code}`;
      await this.updateJob(jobId, "FAILED", 0, "Upload failed", undefined, errMsg);
      throw new Error(`Tripo file upload error: ${errMsg}`);
    }

    const fileToken = uploadData.data.file_token;
    console.log(`[TripoProvider] Received file_token: ${fileToken}`);

    // -------------------------------------------------------------------------
    // STEP 2: Submit Image-to-Model Task (v3.1-20260211)
    // -------------------------------------------------------------------------
    await this.updateJob(
      jobId,
      "PROCESSING",
      30,
      `Creating Tripo 3D neural reconstruction task (${tripoModel})...`
    );

    const taskPayload = {
      model: tripoModel,
      file: {
        type: fileTypeParam,
        file_token: fileToken,
      },
      enable_image_autofix: true,
    };

    console.log(`[TripoProvider] Submitting task to ${baseUrl}/generation/image-to-model...`);
    const taskRes = await fetch(`${baseUrl}/generation/image-to-model`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskPayload),
    });

    const taskData: any = await taskRes.json();
    if (taskData.code !== 0 || !taskData.data?.task_id) {
      let friendlyError = taskData.message || `Task creation failed (code ${taskData.code})`;
      if (taskData.code === 2010 || taskRes.status === 403) {
        friendlyError =
          "Tripo Studio account has insufficient credits. Please recharge credits on tripo3d.ai or switch provider to TRELLIS or Direct GLB Upload.";
      }
      await this.updateJob(jobId, "FAILED", 0, "Task failed", undefined, friendlyError);
      throw new Error(friendlyError);
    }

    const taskId = taskData.data.task_id;
    console.log(`[TripoProvider] Task created successfully. Task ID: ${taskId}`);

    // -------------------------------------------------------------------------
    // STEP 3: Poll Tripo Task Status (tasks/{task_id})
    // -------------------------------------------------------------------------
    await this.updateJob(
      jobId,
      "PROCESSING",
      45,
      `Tripo AI neural geometry synthesis in progress (Task: ${taskId})...`
    );

    let modelUrl: string | null = null;
    let attempts = 0;
    const maxAttempts = 75; // ~5 minutes max

    while (attempts < maxAttempts) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const pollRes = await fetch(`${baseUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const pollData: any = await pollRes.json();
      const task = pollData.data;

      if (!task) continue;

      const progress = Math.min(92, Math.max(45, task.progress || 50));
      await this.updateJob(
        jobId,
        "PROCESSING",
        progress,
        `Tripo AI 3D Reconstruction: ${task.status} (${progress}% complete)...`
      );

      if (task.status === "success") {
        modelUrl = task.output?.model_url || task.output?.pbr_model;
        console.log(`[TripoProvider] Task completed successfully! Model URL: ${modelUrl}`);
        break;
      } else if (
        task.status === "failed" ||
        task.status === "cancelled" ||
        task.status === "expired"
      ) {
        const failureReason =
          task.error_message || `Tripo task ended with status: ${task.status}`;
        await this.updateJob(jobId, "FAILED", 0, "Generation failed", undefined, failureReason);
        throw new Error(failureReason);
      }
    }

    if (!modelUrl) {
      const timeoutErr = "Tripo task timed out waiting for 3D model generation.";
      await this.updateJob(jobId, "FAILED", 0, "Timed out", undefined, timeoutErr);
      throw new Error(timeoutErr);
    }

    // -------------------------------------------------------------------------
    // STEP 4: Download Binary GLB File
    // -------------------------------------------------------------------------
    await this.updateJob(
      jobId,
      "PROCESSING",
      95,
      "Downloading high-poly GLB model with PBR material textures..."
    );

    console.log(`[TripoProvider] Downloading GLB from: ${modelUrl}`);
    const glbRes = await fetch(modelUrl);
    if (!glbRes.ok) {
      throw new Error(`Failed to download GLB from Tripo: ${glbRes.statusText}`);
    }

    const glbArrayBuffer = await glbRes.arrayBuffer();
    const outDir = path.resolve(process.cwd(), "public/assets/jewellery/generated");
    fs.mkdirSync(outDir, { recursive: true });

    const glbFilename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-tripo-${Date.now()}.glb`;
    const finalGlbPath = path.join(outDir, glbFilename);
    const publicGlbUrl = `/assets/jewellery/generated/${glbFilename}`;

    fs.writeFileSync(finalGlbPath, Buffer.from(glbArrayBuffer));
    console.log(
      `[TripoProvider] Saved Tripo GLB (${glbArrayBuffer.byteLength} bytes) to ${finalGlbPath}`
    );

    // -------------------------------------------------------------------------
    // STEP 5: Validate GLB Geometry & Three.js Compatibility
    // -------------------------------------------------------------------------
    const validation = await validateGLBFile(finalGlbPath);
    if (!validation.isValid) {
      const valErr = `GLB validation error: ${validation.error}`;
      await this.updateJob(jobId, "FAILED", 0, "Validation failed", undefined, valErr);
      throw new Error(valErr);
    }

    const successMsg = `Tripo 3D model generated & validated successfully (${validation.vertexCount.toLocaleString()} vertices, ${(validation.byteLength / 1024).toFixed(1)} KB, ${validation.meshCount} meshes)!`;

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
