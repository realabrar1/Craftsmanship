import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { validateGLBFile } from "../glb-validator";
import { ImageTo3DProvider, GenerationJobOptions, ProviderGenerationResult } from "./image-to-3d-provider";

export class ManualGLBProvider implements ImageTo3DProvider {
  id = "MANUAL_UPLOAD";
  name = "Direct GLB Asset Upload";
  description = "Manual upload for pre-generated Blender or Tripo Studio GLB assets.";

  async generate(options: GenerationJobOptions): Promise<ProviderGenerationResult> {
    const { jobId, sku, imageFilePath } = options;

    const absoluteGlbPath = path.isAbsolute(imageFilePath)
      ? imageFilePath
      : path.resolve(process.cwd(), imageFilePath);

    const validation = await validateGLBFile(absoluteGlbPath);
    if (!validation.isValid) {
      throw new Error(`Direct GLB validation failed: ${validation.error}`);
    }

    const filename = path.basename(absoluteGlbPath);
    const publicGlbUrl = `/assets/jewellery/generated/${filename}`;

    const msg = `Asset verified successfully (${validation.vertexCount.toLocaleString()} vertices, ${(validation.byteLength / 1024).toFixed(1)} KB, ${validation.meshCount} meshes).`;

    await prisma.imageTo3DJob.update({
      where: { jobId },
      data: {
        generationStatus: "COMPLETED",
        progressPercent: 100,
        statusMessage: msg,
        generatedGlbPath: publicGlbUrl,
      },
    });

    return {
      publicGlbUrl,
      finalGlbPath: absoluteGlbPath,
      vertexCount: validation.vertexCount,
      meshCount: validation.meshCount,
      byteLength: validation.byteLength,
      message: msg,
    };
  }
}
