import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "jobId query parameter is required." }, { status: 400 });
    }

    const job = await prisma.imageTo3DJob.findUnique({
      where: { jobId },
    });

    if (!job) {
      return NextResponse.json({ error: `Job ${jobId} not found.` }, { status: 404 });
    }

    return NextResponse.json({
      jobId: job.jobId,
      sku: job.sku,
      name: job.name,
      category: job.category,
      provider: job.generationProvider,
      status: job.generationStatus,
      progressPercent: job.progressPercent,
      statusMessage: job.statusMessage,
      generatedGlbPath: job.generatedGlbPath,
      originalImagePath: job.originalImagePath,
      errorMessage: job.errorMessage,
      approvalStatus: job.approvalStatus,
      dimensionsMm: job.dimensionsMm ? JSON.parse(job.dimensionsMm) : null,
      weightGrams: job.weightGrams,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (error: any) {
    console.error("Job status check error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
