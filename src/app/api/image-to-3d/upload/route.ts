import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { executeImageTo3DGeneration, validateGLBFile } from "@/lib/image-to-3d";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const glbFile = formData.get("glbFile") as File | null;
    const name = (formData.get("name") as string) || "Bespoke Jewellery Asset";
    const sku = (formData.get("sku") as string) || `PEN-AI-${Date.now().toString().slice(-4)}`;
    const category = (formData.get("category") as string) || "pendants";
    const provider = ((formData.get("provider") as string) || "TRIPO") as "TRIPO" | "TRELLIS.2" | "TRELLIS" | "MANUAL_UPLOAD";
    const hfToken = (formData.get("hfToken") as string) || undefined;
    const tripoModel = ((formData.get("tripoModel") as string) || "v3.1-20260211") as any;

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // =========================================================================
    // CASE A: MANUAL GLB UPLOAD FALLBACK
    // =========================================================================
    if (glbFile && glbFile.size > 0) {
      const glbBytes = Buffer.from(await glbFile.arrayBuffer());

      const outDir = path.resolve(process.cwd(), "public/assets/jewellery/generated");
      fs.mkdirSync(outDir, { recursive: true });

      const cleanFilename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}.glb`;
      const finalGlbPath = path.join(outDir, cleanFilename);
      fs.writeFileSync(finalGlbPath, glbBytes);

      // Validate uploaded model
      const validation = await validateGLBFile(finalGlbPath);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: `Uploaded model validation failed: ${validation.error}` },
          { status: 400 }
        );
      }

      // If reference image also provided, save it
      let originalImagePath = "/assets/pendant/lakshmi-temple-pendant-front.jpg";
      if (imageFile && imageFile.size > 0) {
        const uploadDir = path.resolve(process.cwd(), "public/uploads/source-images");
        fs.mkdirSync(uploadDir, { recursive: true });
        const imgExt = path.extname(imageFile.name) || ".jpg";
        const imgName = `${sku.toLowerCase()}-source${imgExt}`;
        const finalImgPath = path.join(uploadDir, imgName);
        fs.writeFileSync(finalImgPath, Buffer.from(await imageFile.arrayBuffer()));
        originalImagePath = `/uploads/source-images/${imgName}`;
      }

      const publicGlbPath = `/assets/jewellery/generated/${cleanFilename}`;

      // Save directly to database
      await prisma.imageTo3DJob.create({
        data: {
          jobId,
          sku,
          name,
          category,
          originalImagePath,
          generatedGlbPath: publicGlbPath,
          thumbnailPath: originalImagePath,
          generationProvider: "MANUAL_UPLOAD",
          generationStatus: "COMPLETED",
          progressPercent: 100,
          statusMessage: `Model verified successfully (${validation.vertexCount.toLocaleString()} vertices, ${(validation.byteLength / 1024).toFixed(1)} KB).`,
          dimensionsMm: JSON.stringify({ width: 68, height: 82, depth: 14.5 }),
          weightGrams: 42.5,
          approvalStatus: "PENDING_REVIEW",
        },
      });

      return NextResponse.json({
        success: true,
        jobId,
        status: "COMPLETED",
        generatedGlbPath: publicGlbPath,
        originalImagePath,
        validation,
        message: "3D Asset uploaded and validated successfully.",
      });
    }

    // =========================================================================
    // CASE B: HOSTED IMAGE-TO-3D GENERATION (TRIPO STUDIO / TRELLIS)
    // =========================================================================
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Please provide a valid reference photograph (JPG, PNG or WEBP) or an existing GLB model." },
        { status: 400 }
      );
    }

    // Validate MIME type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: `Unsupported image format: ${imageFile.type}. Supported formats: JPG, PNG, WEBP.` },
        { status: 400 }
      );
    }

    // Validate max file size (20MB for Tripo)
    if (imageFile.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size of 20 MB." },
        { status: 400 }
      );
    }

    // Store original image locally
    const uploadDir = path.resolve(process.cwd(), "public/uploads/source-images");
    fs.mkdirSync(uploadDir, { recursive: true });

    const imgExt = path.extname(imageFile.name) || ".jpg";
    const imgFilename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}${imgExt}`;
    const savedImagePath = path.join(uploadDir, imgFilename);
    const imageBytes = Buffer.from(await imageFile.arrayBuffer());
    fs.writeFileSync(savedImagePath, imageBytes);

    const publicImageUrl = `/uploads/source-images/${imgFilename}`;

    // Create DB record with PENDING status
    await prisma.imageTo3DJob.create({
      data: {
        jobId,
        sku,
        name,
        category,
        originalImagePath: publicImageUrl,
        thumbnailPath: publicImageUrl,
        generationProvider: provider,
        generationStatus: "PENDING",
        progressPercent: 5,
        statusMessage: `Job queued for ${provider === "TRIPO" ? "Tripo Studio Official API" : provider}...`,
        dimensionsMm: JSON.stringify({ width: 68, height: 82, depth: 14.5 }),
        weightGrams: 42.0,
        approvalStatus: "PENDING_REVIEW",
      },
    });

    // Fire generation job asynchronously in background (non-blocking)
    executeImageTo3DGeneration({
      jobId,
      sku,
      name,
      category,
      imageFilePath: savedImagePath,
      provider,
      hfToken,
      tripoModel,
    }).catch((err) => {
      console.error(`[Background 3D Generation Error] Job ${jobId} (${provider}):`, err);
    });

    return NextResponse.json({
      success: true,
      jobId,
      status: "PENDING",
      originalImagePath: publicImageUrl,
      provider,
      message: `Image uploaded and ${provider === "TRIPO" ? "Tripo Studio" : provider} generation queued.`,
    });
  } catch (error: any) {
    console.error("Image-to-3D upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during 3D generation request." },
      { status: 500 }
    );
  }
}
