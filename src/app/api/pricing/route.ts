import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateNecklacePrice } from "@/lib/pricing-engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Fetch active products to ensure latest server-side prices
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

    const pricing = calculateNecklacePrice(body, catalogMap);
    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    console.error("Pricing API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate pricing" },
      { status: 500 }
    );
  }
}
