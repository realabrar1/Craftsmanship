"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, Clock, Truck, Package, ShieldCheck, ArrowRight, Eye, Heart } from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "SAVED_DESIGNS">("ORDERS");

  const milestones = [
    { title: "Design Confirmed", date: "Nov 19, 2026", completed: true },
    { title: "Materials Prepared", date: "Nov 20, 2026", completed: true },
    { title: "Handcrafted by Karigars", date: "In Progress (Stringing)", completed: true, current: true },
    { title: "Quality Inspection", date: "Pending", completed: false },
    { title: "Ready to Dispatch", date: "Pending", completed: false },
    { title: "Shipped via Courier", date: "Pending", completed: false },
    { title: "Delivered", date: "Pending", completed: false },
  ];

  return (
    <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-[#FAF2E8]/95 backdrop-blur-md border-b border-[#E5D2BE]/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-1.5 text-[#B58A4D]">
              <Sparkles className="w-4 h-4 fill-[#B58A4D]" />
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3C211B] group-hover:text-[#641B24] transition-colors">
                beadsBliss
              </span>
            </div>
            <span className="text-[9px] tracking-[0.25em] font-serif uppercase text-[#7E6359] font-medium -mt-1">
              Bespoke Pearl Atelier
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-serif">
            <Link href="/" className="hover:text-[#641B24]">Home</Link>
            <Link href="/design-your-necklace" className="hover:text-[#641B24]">Design Your Necklace</Link>
            <Link href="/collections" className="hover:text-[#641B24]">Our Collections</Link>
            <Link href="/atelier/karigar" className="hover:text-[#641B24] text-[#641B24] font-semibold">Artisan Workbench</Link>
          </nav>

          <div className="w-8 h-8 rounded-full bg-[#641B24] text-white flex items-center justify-center font-serif text-xs font-bold">
            S
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 flex flex-col gap-8">
        {/* User Welcome Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#641B24] text-[#FFFDF9] flex items-center justify-center font-editorial text-2xl font-bold">
              SS
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#3C211B]">
                Sunita Sharma
              </h1>
              <p className="text-xs font-serif text-[#7E6359]">
                sunita.sharma@example.com • Atelier Client since 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("ORDERS")}
              className={`px-5 py-2.5 rounded-full font-serif text-xs font-semibold transition-all ${
                activeTab === "ORDERS"
                  ? "bg-[#641B24] text-white shadow-sm"
                  : "bg-[#FAF2E8] text-[#3C211B] hover:bg-[#E5D2BE]"
              }`}
            >
              Active Orders &amp; Tracking
            </button>
            <button
              onClick={() => setActiveTab("SAVED_DESIGNS")}
              className={`px-5 py-2.5 rounded-full font-serif text-xs font-semibold transition-all ${
                activeTab === "SAVED_DESIGNS"
                  ? "bg-[#641B24] text-white shadow-sm"
                  : "bg-[#FAF2E8] text-[#3C211B] hover:bg-[#E5D2BE]"
              }`}
            >
              Saved Bespoke Designs
            </button>
          </div>
        </div>

        {/* Tab 1: Active Orders & Live Karigar Tracking */}
        {activeTab === "ORDERS" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-8">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5D2BE]/60 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-[#641B24]/10 text-[#641B24] px-3 py-1 rounded-full">
                      ORD-SM-2026-1049
                    </span>
                    <span className="text-xs font-serif text-[#1C5237] bg-[#1C5237]/10 font-bold px-3 py-1 rounded-full">
                      Payment Verified (₹18,700)
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#3C211B] mt-2">
                    Royal Panchlada Pink Pearl Haar with Kundan Bars
                  </h2>
                  <p className="text-xs text-[#7E6359] mt-0.5">
                    Assigned Artisan: Master Karigar Ramesh Chander (Hyderabad Workshop)
                  </p>
                </div>

                <Link
                  href="/design-your-necklace"
                  className="px-5 py-2.5 rounded-full border border-[#B58A4D] text-xs font-serif font-bold text-[#3C211B] hover:bg-[#F3E2CF] transition-colors self-start md:self-auto flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>View 3D Specification</span>
                </Link>
              </div>

              {/* Progress Milestones Stepper */}
              <div className="w-full">
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7E6359] mb-6">
                  Artisan Workshop Production Milestones
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                        m.current
                          ? "bg-[#641B24]/10 border-2 border-[#641B24] shadow-xs"
                          : m.completed
                          ? "bg-[#1C5237]/5 border-[#1C5237]/40"
                          : "bg-[#FAF2E8]/40 border-[#E5D2BE]/60 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${
                          m.current
                            ? "bg-[#641B24] text-white animate-pulse"
                            : m.completed
                            ? "bg-[#1C5237] text-white"
                            : "bg-[#E5D2BE] text-[#7E6359]"
                        }`}
                      >
                        {m.completed ? "✓" : idx + 1}
                      </div>
                      <span className="font-serif text-[11px] font-bold text-[#3C211B] line-clamp-1">
                        {m.title}
                      </span>
                      <span className="text-[10px] text-[#7E6359] mt-0.5">
                        {m.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Karigar Notes from Workshop */}
              <div className="p-4 bg-[#FAF2E8] rounded-2xl border border-[#B58A4D]/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#641B24]">
                  <Clock className="w-4 h-4" />
                  <span>Live Update from Master Karigar Ramesh Chander</span>
                </div>
                <p className="font-serif text-xs text-[#3C211B] leading-relaxed">
                  &quot;Materials verified. AAA Pink pearls calibrated to 5.5mm. Strands 1, 2, and 3 stringing completed with balanced curve draping. Proceeding to connector bridge 1 mounting.&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Designs */}
        {activeTab === "SAVED_DESIGNS" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E5D2BE] shadow-atelier flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-[#FAF2E8]">
                <img
                  src="/assets/reference/assembled-necklace-front.jpg"
                  alt="Saved Design"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#641B24] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                  SM-BESPOKE-2026-9041
                </span>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-serif text-sm font-bold text-[#3C211B]">
                  Royal Panchlada Pink Pearl Haar
                </h3>
                <p className="text-xs text-[#7E6359]">
                  5 Layers • 3 Pairs Kundan Bars • Gold Nakshi Accents
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E5D2BE]/60 mt-2">
                  <span className="font-editorial text-lg font-bold text-[#641B24]">
                    ₹18,700
                  </span>
                  <Link
                    href="/design-your-necklace"
                    className="px-4 py-1.5 rounded-full bg-[#641B24] text-white text-xs font-serif font-semibold hover:bg-[#B58A4D] transition-colors"
                  >
                    Edit in 3D Studio →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
