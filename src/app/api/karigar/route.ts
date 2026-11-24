import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await prisma.artisanJob.findMany({
      include: {
        order: true,
        design: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("Fetch karigar jobs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch artisan jobs" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { jobId, status, notes } = body;

    const updated = await prisma.artisanJob.update({
      where: { id: jobId },
      data: {
        ...(status && { status }),
        ...(notes && { productionNotes: notes }),
      },
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    console.error("Update karigar job error:", error);
    return NextResponse.json({ success: false, error: "Failed to update artisan job" }, { status: 500 });
  }
}
