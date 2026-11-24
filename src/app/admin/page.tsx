"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Admin3DAssetStudio } from "@/components/admin/Admin3DAssetStudio";
import { AdminImageTo3DStudio } from "@/components/admin/AdminImageTo3DStudio";
import {
  Sparkles,
  BarChart3,
  Package,
  Layers,
  DollarSign,
  Users,
  Settings,
  Eye,
  CheckCircle,
  AlertTriangle,
  Upload,
  Plus,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "PRODUCTS" | "ASSETS_3D" | "IMAGE_TO_3D" | "PRICING">("OVERVIEW");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "ASSETS_3D" || tabParam === "IMAGE_TO_3D" || tabParam === "PRODUCTS" || tabParam === "PRICING" || tabParam === "OVERVIEW") {
      setActiveTab(tabParam as any);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F7EFE5] text-[#3C211B] flex flex-col font-sans">
      {/* Admin Top Bar */}
      <header className="w-full bg-[#3C211B] text-[#FAF2E8] px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-xl font-bold text-[#D4AF6E]">
              beadsBliss
            </Link>
            <span className="text-xs bg-[#B58A4D]/20 text-[#D4AF6E] font-mono px-2.5 py-0.5 rounded-full border border-[#D4AF6E]/30">
              Executive Administration Suite
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-serif">
            <Link href="/design-your-necklace" className="text-[#FAF2E8]/80 hover:text-white flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Launch 3D Simulator</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#D4AF6E] text-[#3C211B] flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Sub-navigation Tabs */}
      <div className="bg-white border-b border-[#E5D2BE] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs font-serif font-bold">
          {[
            { id: "OVERVIEW", label: "Executive Overview" },
            { id: "PRODUCTS", label: "Component & Product Catalog" },
            { id: "ASSETS_3D", label: "3D Asset Studio & Verification" },
            { id: "IMAGE_TO_3D", label: "AI Image-to-3D Generator" },
            { id: "PRICING", label: "Pricing & Labour Rules" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-[#641B24] text-white shadow-xs"
                  : "text-[#7E6359] hover:bg-[#FAF2E8] hover:text-[#3C211B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 flex flex-col gap-8">
        {activeTab === "OVERVIEW" && (
          <div className="flex flex-col gap-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-1">
                <span className="text-[11px] font-serif uppercase tracking-wider text-[#7E6359]">
                  Total Atelier Revenue
                </span>
                <span className="font-editorial text-3xl font-bold text-[#641B24]">
                  ₹ 1,84,700
                </span>
                <span className="text-[10px] text-[#1C5237] font-semibold mt-1">
                  ↑ 14% vs last week (10 Orders)
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-1">
                <span className="text-[11px] font-serif uppercase tracking-wider text-[#7E6359]">
                  In Active Production
                </span>
                <span className="font-editorial text-3xl font-bold text-[#3C211B]">
                  4 Necklaces
                </span>
                <span className="text-[10px] text-[#B58A4D] font-semibold mt-1">
                  Assigned across 2 Karkhanas
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-1">
                <span className="text-[11px] font-serif uppercase tracking-wider text-[#7E6359]">
                  3D Assets Approved
                </span>
                <span className="font-editorial text-3xl font-bold text-[#1C5237]">
                  15 Assets
                </span>
                <span className="text-[10px] text-[#7E6359] font-semibold mt-1">
                  0 Awaiting Artisan Review
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-1">
                <span className="text-[11px] font-serif uppercase tracking-wider text-[#7E6359]">
                  Stock Alert
                </span>
                <span className="font-editorial text-3xl font-bold text-[#8B1229]">
                  1 SKU Low
                </span>
                <span className="text-[10px] text-[#8B1229] font-semibold mt-1">
                  Kundan Bars (12 pairs left)
                </span>
              </div>
            </div>

            {/* Recent Orders Queue */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E5D2BE]/60 pb-3">
                <h3 className="font-serif text-base font-bold text-[#3C211B]">
                  Recent Bespoke Commissions &amp; Orders
                </h3>
                <span className="text-xs font-serif text-[#7E6359]">Auto-sync with Razorpay</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-serif">
                  <thead className="bg-[#FAF2E8] border-b border-[#E5D2BE] text-[#7E6359]">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Design Specification</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Production Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5D2BE]/60 text-[#3C211B]">
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#641B24]">ORD-SM-2026-1049</td>
                      <td className="p-3">Sunita Sharma (Mumbai)</td>
                      <td className="p-3">Royal Panchlada Pink Haar (5L, 3P Kundan)</td>
                      <td className="p-3 font-bold">₹18,700</td>
                      <td className="p-3 text-[#1C5237] font-bold">PAID (Razorpay)</td>
                      <td className="p-3">
                        <span className="bg-[#641B24]/10 text-[#641B24] font-bold px-2 py-0.5 rounded-full text-[10px]">
                          STRINGING
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href="/atelier/karigar" className="text-[#641B24] font-bold hover:underline">
                          Inspect Workbench →
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "PRODUCTS" && (
          <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#3C211B]">
                  Component &amp; Jewellery Inventory
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Physical measurements, selling prices, and making charges
                </p>
              </div>
              <button
                onClick={() => alert("Component modal: Enter SKU, name, dimensions mm, base price & 3D model")}
                className="px-4 py-2 rounded-full bg-[#641B24] text-white text-xs font-serif font-bold flex items-center gap-1.5 hover:bg-[#B58A4D] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E5D2BE]">
              <table className="w-full text-left text-xs font-serif">
                <thead className="bg-[#FAF2E8] border-b border-[#E5D2BE] text-[#7E6359]">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Component Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Selling Price</th>
                    <th className="p-3">Labour / Making</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D2BE]/60 text-[#3C211B]">
                  {[
                    { sku: "PEN-LAKSHMI-01", name: "Lakshmi Kemp Temple Pendant", type: "PENDANT", dim: "55x70x12 mm", price: "₹14,500", making: "₹2,800", stock: 12 },
                    { sku: "STR-PINK-01", name: "Pink Freshwater Pearls (AAA)", type: "STRAND", dim: "5.5mm (20 inches)", price: "₹900", making: "₹150", stock: 95 },
                    { sku: "STR-WHITE-02", name: "Ivory White Round Pearls", type: "STRAND", dim: "6.0mm (20 inches)", price: "₹850", making: "₹150", stock: 110 },
                    { sku: "CON-RECT-01", name: "Kundan 5-Strand Connector Bars", type: "CONNECTOR", dim: "32x8x4.5 mm", price: "₹2,000", making: "₹400", stock: 45 },
                    { sku: "BRC-FLORAL-RUBY-02", name: "Floral Kundan Ruby Brooch", type: "SIDE_BROOCH", dim: "26x26x6 mm", price: "₹2,800", making: "₹500", stock: 28 },
                    { sku: "ACC-GOLD-NAKSHI-01", name: "22k Gold Nakshi Balls", type: "ACCENT", dim: "5.0mm diameter", price: "₹600", making: "₹100", stock: 75 },
                    { sku: "CLS-S-HOOK-01", name: "Traditional Antique S-Hook Clasp", type: "CLASP", dim: "30x12 mm", price: "₹450", making: "₹150", stock: 60 },
                  ].map((item) => (
                    <tr key={item.sku} className="hover:bg-[#FAF2E8]/40">
                      <td className="p-3 font-mono font-bold text-[#641B24]">{item.sku}</td>
                      <td className="p-3 font-bold">{item.name}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3 text-[#7E6359]">{item.dim}</td>
                      <td className="p-3 font-bold">{item.price}</td>
                      <td className="p-3 text-[#7E6359]">{item.making}</td>
                      <td className="p-3">{item.stock} in stock</td>
                      <td className="p-3">
                        <span className="bg-[#1C5237]/10 text-[#1C5237] font-bold px-2 py-0.5 rounded-full text-[10px]">
                          PUBLISHED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ASSETS_3D" && <Admin3DAssetStudio />}

        {activeTab === "IMAGE_TO_3D" && <AdminImageTo3DStudio />}

        {activeTab === "PRICING" && (
          <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3C211B]">
                Atelier Labour &amp; Pricing Rules Engine
              </h3>
              <p className="text-xs text-[#7E6359]">
                Rules enforced on all bespoke quotations and server-side payment verification
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "STRINGING_PER_STRAND", name: "Silk Stringing per Strand", rate: "₹150", type: "PER_STRAND" },
                { key: "CONNECTOR_MOUNTING_PAIR", name: "Connector Bar Assembly", rate: "₹200", type: "PER_PAIR" },
                { key: "PENDANT_ATTACHMENT", name: "Pendant Center Mounting", rate: "₹350", type: "FIXED" },
                { key: "SIDE_BROOCH_PAIR", name: "Side Brooch Rear Attachment", rate: "₹250", type: "PER_PAIR" },
                { key: "QUALITY_ASSESSMENT_FEE", name: "Master Karigar Inspection", rate: "₹450", type: "FIXED" },
                { key: "GST_TAX_PERCENT", name: "Jewellery GST Tax Rate", rate: "3.0%", type: "PERCENTAGE" },
              ].map((r) => (
                <div key={r.key} className="p-4 rounded-2xl border border-[#E5D2BE] bg-[#FAF2E8]/40 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#7E6359]">{r.key}</span>
                    <h4 className="font-serif text-xs font-bold text-[#3C211B] mt-0.5">{r.name}</h4>
                  </div>
                  <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-[#E5D2BE]/60">
                    <span className="text-[10px] text-[#7E6359] font-mono">{r.type}</span>
                    <span className="font-editorial text-lg font-bold text-[#641B24]">{r.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
