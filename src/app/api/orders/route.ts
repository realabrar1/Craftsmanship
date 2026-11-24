import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderNumber = "ORD-SM-2026-" + Math.floor(1000 + Math.random() * 9000);
    const jobCode = "KRG-JOB-" + Math.floor(1000 + Math.random() * 9000);

    // Create Order with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find or link design
      let designId = body.designId;
      if (!designId) {
        const defaultDesign = await tx.necklaceDesign.findFirst();
        designId = defaultDesign ? defaultDesign.id : null;
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: body.customerName || "Sunita Sharma",
          customerEmail: body.customerEmail || "sunita.sharma@example.com",
          customerPhone: body.customerPhone || "+91 98200 44556",
          shippingAddressJson: JSON.stringify(body.shippingAddress || {}),
          billingAddressJson: JSON.stringify(body.billingAddress || {}),
          designId: designId,
          subtotal: 12150,
          makingCharges: 5668,
          taxGst: 432,
          grandTotal: 18700,
          paymentStatus: "PAID",
          paymentMethod: "RAZORPAY",
          razorpayOrderId: "order_" + Math.random().toString(36).substring(7),
          razorpayPaymentId: "pay_" + Math.random().toString(36).substring(7),
          orderStatus: "IN_PRODUCTION",
          notes: body.notes || "Client commissioned via bespoke 3D customizer.",
        },
      });

      // Generate Karigar Manufacturing Job docket automatically
      if (designId) {
        await tx.artisanJob.create({
          data: {
            jobCode,
            orderId: order.id,
            designId: designId,
            karigarName: "Master Karigar Ramesh Chander",
            status: "STRINGING",
            priority: "HIGH",
            targetCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            bomJson: JSON.stringify({
              materials: [
                { sku: "STR-PINK-01", name: "Pink Freshwater Pearls (AAA, 5.5mm)", quantity: "5 strands" },
                { sku: "CON-RECT-01", name: "Kundan 5-Strand Rectangular Connector Bars", quantity: "3 pairs" },
                { sku: "ACC-GOLD-NAKSHI-01", name: "22k Gold Nakshi Balls", quantity: "20 pieces" },
                { sku: "CLS-S-HOOK-01", name: "Traditional Antique Gold S-Hook Clasp", quantity: "1 unit" },
              ],
            }),
            productionNotes: "Materials verified. Strands 1, 2, and 3 stringing completed with balanced curve draping.",
            karigarPayoutInr: 3500,
          },
        });
      }

      return { order, jobCode };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: "Failed to place order" }, { status: 500 });
  }
}
