import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerNewAsset, JewelleryAssetMetadata } from "@/lib/jewellery-engine/asset-registry";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sku,
      name,
      category,
      glbPath,
      originalImagePath,
      dimensionsMm,
      weightGrams,
      metalType,
      stoneTypes,
      sockets,
      basePrice,
      makingCharges,
      approvalStatus = "APPROVED",
      jobId,
      provider = "TRIPO",
    } = body;

    if (!sku || !name || !glbPath) {
      return NextResponse.json(
        { error: "SKU, Name, and GLB file path are required to publish asset." },
        { status: 400 }
      );
    }

    const dims = dimensionsMm || { width: 68.0, height: 82.0, depth: 14.5 };
    const weight = weightGrams || 42.0;

    // 1. Save or update Component3DAsset in Database
    const dbAsset = await prisma.component3DAsset.upsert({
      where: { sku },
      update: {
        name,
        type: category.toUpperCase().replace(/S$/, ""),
        glbUrl: glbPath,
        previewImageUrl: originalImagePath || "/assets/pendant/lakshmi-temple-pendant-front.jpg",
        dimensionsMm: JSON.stringify(dims),
        weightGrams: weight,
        metalType: metalType || "22K Antique Temple Gold",
        stoneType: Array.isArray(stoneTypes) ? stoneTypes.join(", ") : stoneTypes || "Kemp Ruby & Emerald",
        attachmentPointsJson: JSON.stringify(sockets || {}),
        status: approvalStatus,
        originalImagePath,
        generatedGlbPath: glbPath,
        generationProvider: provider,
        generationStatus: "COMPLETED",
      },
      create: {
        sku,
        name,
        type: category.toUpperCase().replace(/S$/, ""),
        glbUrl: glbPath,
        previewImageUrl: originalImagePath || "/assets/pendant/lakshmi-temple-pendant-front.jpg",
        referencePhotosJson: JSON.stringify({ front: originalImagePath }),
        dimensionsMm: JSON.stringify(dims),
        weightGrams: weight,
        metalType: metalType || "22K Antique Temple Gold",
        stoneType: Array.isArray(stoneTypes) ? stoneTypes.join(", ") : stoneTypes || "Kemp Ruby & Emerald",
        attachmentPointsJson: JSON.stringify(sockets || {}),
        compatibilityRulesJson: JSON.stringify({ minStrands: 3, maxStrands: 7 }),
        pbrSettingsJson: JSON.stringify({ metalness: 0.9, roughness: 0.25, color: "#D4AF37" }),
        status: approvalStatus,
        originalImagePath,
        generatedGlbPath: glbPath,
        generationProvider: provider,
        generationStatus: "COMPLETED",
      },
    });

    // 2. Also register into in-memory AssetRegistry
    const newAssetMeta: JewelleryAssetMetadata = {
      assetId: dbAsset.id,
      sku,
      displayName: name,
      category: category as any,
      glbPath,
      thumbnail: originalImagePath || "/assets/pendant/lakshmi-temple-pendant-front.jpg",
      dimensionsMm: dims,
      weightGrams: weight,
      materialInfo: {
        metalType: metalType || "22K Antique Temple Gold",
        metalPurity: "916 Hallmark",
        finish: "Hand-brushed Micro-patina",
        stoneTypes: Array.isArray(stoneTypes) ? stoneTypes : [stoneTypes || "Kemp Ruby"],
      },
      sockets: sockets || {
        socket_bail_left: {
          name: "socket_bail_left",
          position: [-0.095, 0.285, 0.02],
          normal: [-0.2, 0.95, 0.15],
          loopDiameterMm: 3.2,
          maxThreadThicknessMm: 1.8,
        },
        socket_bail_right: {
          name: "socket_bail_right",
          position: [0.095, 0.285, 0.02],
          normal: [0.2, 0.95, 0.15],
          loopDiameterMm: 3.2,
          maxThreadThicknessMm: 1.8,
        },
      },
      compatibilityRules: {
        minStrands: 3,
        maxStrands: 7,
        supportedBeadDiametersMm: [4.0, 9.0],
      },
      pricing: {
        basePriceInr: basePrice || 14500,
        makingChargesInr: makingCharges || 3200,
        gstRatePercent: 3,
      },
      approvalStatus: approvalStatus as any,
    };

    registerNewAsset(newAssetMeta);

    // 3. If jobId provided, update Job status
    if (jobId) {
      await prisma.imageTo3DJob.updateMany({
        where: { jobId },
        data: { approvalStatus },
      });
    }

    return NextResponse.json({
      success: true,
      asset: newAssetMeta,
      message: `Asset ${sku} successfully approved and saved to atelier catalog!`,
    });
  } catch (error: any) {
    console.error("Save asset error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save asset to library." },
      { status: 500 }
    );
  }
}
