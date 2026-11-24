import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateNecklacePrice } from "@/lib/pricing-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      const design = await prisma.necklaceDesign.findUnique({
        where: { designCode: code },
      });
      if (!design) {
        return NextResponse.json({ success: false, error: "Design not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, design });
    }

    const designs = await prisma.necklaceDesign.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ success: true, designs });
  } catch (error) {
    console.error("Fetch designs error:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve designs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const designCode = body.designCode || "SM-BESPOKE-" + Date.now();

    // Verify server-side pricing
    const products = await prisma.product.findMany();
    const catalogMap = new Map();
    products.forEach((p) => {
      catalogMap.set(p.sku, {
        sku: p.sku,
        name: p.name,
        basePrice: p.basePrice,
        makingCharges: p.makingCharges,
      });
    });

    const verifiedPricing = calculateNecklacePrice(body, catalogMap);

    const saved = await prisma.necklaceDesign.upsert({
      where: { designCode },
      update: {
        title: body.title || "Bespoke Pearl & Temple Necklace",
        layersCount: body.layersCount || 3,
        layersConfigJson: JSON.stringify(body.layers || []),
        pendantSku: body.pendantSku || null,
        connectorsConfigJson: JSON.stringify(body.connectors || []),
        accentsConfigJson: JSON.stringify(body.accents || {}),
        finishingConfigJson: JSON.stringify(body.finishing || {}),
        pricingSnapshotJson: JSON.stringify(verifiedPricing),
        status: "SAVED",
      },
      create: {
        designCode,
        title: body.title || "Bespoke Pearl & Temple Necklace",
        layersCount: body.layersCount || 3,
        layersConfigJson: JSON.stringify(body.layers || []),
        pendantSku: body.pendantSku || null,
        connectorsConfigJson: JSON.stringify(body.connectors || []),
        accentsConfigJson: JSON.stringify(body.accents || {}),
        finishingConfigJson: JSON.stringify(body.finishing || {}),
        pricingSnapshotJson: JSON.stringify(verifiedPricing),
        previewSnapshotUrl: "/assets/reference/assembled-necklace-front.jpg",
        status: "SAVED",
      },
    });

    return NextResponse.json({ success: true, design: saved });
  } catch (error) {
    console.error("Save design error:", error);
    return NextResponse.json({ success: false, error: "Failed to persist design" }, { status: 500 });
  }
}
