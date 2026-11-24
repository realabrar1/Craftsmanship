"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Printer,
  Camera,
  CheckSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
} from "lucide-react";

export default function KarigarWorkbenchPage() {
  const [jobStatus, setJobStatus] = useState<string>("STRINGING");
  const [karigarNotes, setKarigarNotes] = useState<string>(
    "Materials verified. Strands 1, 2, and 3 stringing completed with balanced curve draping. Proceeding to connector bridge 1 mounting."
  );
  const [qcChecklist, setQcChecklist] = useState({
    pendantSymmetry: true,
    pearlCaliber: true,
    lustreConsistency: true,
    strandParallelism: true,
    connectorLoopIntegrity: true,
    threadTension: true,
    kempSetting: true,
    goldFinish: true,
    claspSecurity: true,
    designFidelity: true,
  });

  const [activePhoto, setActivePhoto] = useState<string>(
    "/assets/connectors/connector-5strand-assembly.jpg"
  );

  const handlePrintBOM = () => {
    window.print();
  };

  const handleToggleQc = (key: keyof typeof qcChecklist) => {
    setQcChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allQcPassed = Object.values(qcChecklist).every(Boolean);

  return (
    <div className="min-h-screen bg-[#F7EFE5] text-[#3C211B] flex flex-col font-sans">
      {/* Workshop Header */}
      <header className="w-full bg-[#3C211B] text-[#FAF2E8] px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl font-bold text-[#D4AF6E]">
              beadsBliss
            </Link>
            <span className="text-xs bg-[#D4AF6E]/20 text-[#D4AF6E] font-mono px-2.5 py-0.5 rounded-full border border-[#D4AF6E]/40">
              Karigar Karkhana Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-serif">
            <span className="hidden sm:inline text-[#FAF2E8]/80">
              Artisan: <strong className="text-white">Master Karigar Ramesh Chander</strong>
            </span>
            <button
              onClick={handlePrintBOM}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF6E] text-[#3C211B] font-bold hover:bg-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print BOM</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workbench */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Manufacturing Docket & BOM */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Active Job Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5D2BE]/60 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#641B24]/10 text-[#641B24] px-2.5 py-1 rounded-md">
                  JOB DOCKET: KRG-JOB-4081
                </span>
                <h1 className="font-serif text-xl font-bold text-[#3C211B] mt-1.5">
                  Royal Panchlada Pink Pearl Haar
                </h1>
                <p className="text-xs text-[#7E6359]">
                  Order: <span className="font-mono font-bold text-[#3C211B]">ORD-SM-2026-1049</span> • Customer: Sunita Sharma
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="text-[10px] uppercase font-serif text-[#7E6359]">Artisan Compensation</span>
                <span className="font-editorial text-2xl font-bold text-[#1C5237]">₹3,500</span>
              </div>
            </div>

            {/* Visual Design References */}
            <div>
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7E6359] mb-3">
                Approved 3D Visual Specification
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setActivePhoto("/assets/reference/assembled-necklace-front.jpg")}
                  className={`rounded-2xl overflow-hidden border-2 aspect-[4/3] bg-[#FAF2E8] ${
                    activePhoto.includes("front") ? "border-[#641B24]" : "border-[#E5D2BE]"
                  }`}
                >
                  <img src="/assets/reference/assembled-necklace-front.jpg" alt="Front" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setActivePhoto("/assets/connectors/connector-5strand-assembly.jpg")}
                  className={`rounded-2xl overflow-hidden border-2 aspect-[4/3] bg-[#FAF2E8] ${
                    activePhoto.includes("assembly") ? "border-[#641B24]" : "border-[#E5D2BE]"
                  }`}
                >
                  <img src="/assets/connectors/connector-5strand-assembly.jpg" alt="Assembly" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setActivePhoto("/assets/reference/assembled-necklace-side.jpg")}
                  className={`rounded-2xl overflow-hidden border-2 aspect-[4/3] bg-[#FAF2E8] ${
                    activePhoto.includes("side") ? "border-[#641B24]" : "border-[#E5D2BE]"
                  }`}
                >
                  <img src="/assets/reference/assembled-necklace-side.jpg" alt="Side" className="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            {/* Bill of Materials (BOM) Table */}
            <div>
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7E6359] mb-3">
                Bill of Materials (BOM) &amp; Calibration
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-[#E5D2BE]">
                <table className="w-full text-left text-xs font-serif">
                  <thead className="bg-[#FAF2E8] border-b border-[#E5D2BE] text-[#7E6359]">
                    <tr>
                      <th className="p-3">Component SKU</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Calibrated Spec</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5D2BE]/60 text-[#3C211B]">
                    <tr>
                      <td className="p-3 font-mono font-bold">STR-PINK-01</td>
                      <td className="p-3 font-bold">Pink Freshwater Pearls</td>
                      <td className="p-3">5 Strands</td>
                      <td className="p-3 text-[#7E6359]">5.5mm AAA Grade (approx 430 pearls)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">CON-RECT-01</td>
                      <td className="p-3 font-bold">Kundan 5-Strand Bars</td>
                      <td className="p-3">3 Pairs (6 pcs)</td>
                      <td className="p-3 text-[#7E6359]">5 Loops top/bottom, 4.2mm loop spacing</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">ACC-GOLD-NAKSHI-01</td>
                      <td className="p-3 font-bold">22k Gold Nakshi Balls</td>
                      <td className="p-3">20 Pieces</td>
                      <td className="p-3 text-[#7E6359]">5.0mm diameter, 0.8mm hole</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">CLS-S-HOOK-01</td>
                      <td className="p-3 font-bold">Antique S-Hook Clasp</td>
                      <td className="p-3">1 Unit</td>
                      <td className="p-3 text-[#7E6359]">Reinforced loop with 2&quot; extension chain</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">THRD-SILK-PINK</td>
                      <td className="p-3 font-bold">Resham Silk Thread</td>
                      <td className="p-3">15 Meters</td>
                      <td className="p-3 text-[#7E6359]">Double-threaded waxed blush pink silk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step Assembly Instructions */}
            <div className="p-4 bg-[#FAF2E8] rounded-2xl border border-[#B58A4D]/30 flex flex-col gap-2 text-xs font-serif">
              <h4 className="font-bold text-[#641B24]">Master Artisan Assembly Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-[#3C211B]/90">
                <li>Cut 5 silk threads of 30 inches each; wax with pure beeswax.</li>
                <li>String Layer 1 to 17&quot;, Layer 2 to 18.5&quot;, Layer 3 to 20&quot;, Layer 4 to 21.5&quot;, Layer 5 to 23&quot;.</li>
                <li>Position Connector Pair 1 at 28% curve arc; pass each strand sequentially through loops 1 to 5.</li>
                <li>Secure with micro-knots on reverse side of connector bar.</li>
                <li>Position Connector Pair 2 at 44% arc and Connector Pair 3 at 60% arc.</li>
                <li>Assemble rear strand termination caps and connect to S-hook extension clasp.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Right Column: Production Workflow Status & 10-Point QC Audit */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Status Pipeline Updater */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <h3 className="font-serif text-base font-bold text-[#3C211B] flex items-center justify-between">
              <span>Production Pipeline Status</span>
              <span className="text-xs font-mono font-bold text-[#641B24] bg-[#641B24]/10 px-2.5 py-0.5 rounded-full">
                {jobStatus}
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-serif">
              {[
                "MATERIALS_PREPARATION",
                "STRINGING",
                "CONNECTOR_ASSEMBLY",
                "FINISHING",
                "QUALITY_INSPECTION",
                "APPROVED",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setJobStatus(s)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    jobStatus === s
                      ? "bg-[#641B24] text-white font-bold border-[#641B24] shadow-xs"
                      : "bg-[#FAF2E8]/60 text-[#3C211B] border-[#E5D2BE] hover:bg-[#FAF2E8]"
                  }`}
                >
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* Karigar Notes input */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs font-serif font-bold text-[#7E6359]">
                Live Karigar Log (Visible to Customer):
              </label>
              <textarea
                rows={3}
                value={karigarNotes}
                onChange={(e) => setKarigarNotes(e.target.value)}
                className="p-3 text-xs font-serif rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none"
              />
              <button
                onClick={() => alert("Karigar update broadcasted to customer tracking portal!")}
                className="self-end px-4 py-1.5 rounded-full bg-[#3C211B] text-white text-xs font-serif hover:bg-[#641B24] transition-colors"
              >
                Broadcast Update
              </button>
            </div>
          </div>

          {/* 10-Point Quality Control Audit Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E5D2BE]/60 pb-3">
              <h3 className="font-serif text-base font-bold text-[#3C211B] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#B58A4D]" />
                10-Point Workshop QC Audit
              </h3>
              <span
                className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded-full ${
                  allQcPassed ? "bg-[#1C5237]/10 text-[#1C5237]" : "bg-[#8B1229]/10 text-[#8B1229]"
                }`}
              >
                {allQcPassed ? "10/10 Passed" : "Audit Incomplete"}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-serif text-[#3C211B]">
              {[
                { key: "pendantSymmetry", label: "1. Pendant Symmetry & Center Gravity" },
                { key: "pearlCaliber", label: "2. Pearl Caliber Uniformity (±0.3mm)" },
                { key: "lustreConsistency", label: "3. Nacre Lustre & Grade Consistency" },
                { key: "strandParallelism", label: "4. Concentric Strand Parallelism (No Twisting)" },
                { key: "connectorLoopIntegrity", label: "5. Connector Loops Secure (5 Strands Fixed)" },
                { key: "threadTension", label: "6. Resham Silk Knot Tension (No Buckling)" },
                { key: "kempSetting", label: "7. Jadau Stone Foils Tight (No Rattle)" },
                { key: "goldFinish", label: "8. Antique 22k Gold Finish Scuff-Free" },
                { key: "claspSecurity", label: "9. S-Hook Clasp 5kg Pull Resistance Test" },
                { key: "designFidelity", label: "10. Exact Fidelity to Approved 3D Code" },
              ].map((item) => {
                const isChecked = qcChecklist[item.key as keyof typeof qcChecklist];
                return (
                  <label
                    key={item.key}
                    onClick={() => handleToggleQc(item.key as keyof typeof qcChecklist)}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FAF2E8]/40 hover:bg-[#FAF2E8] cursor-pointer transition-colors"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="accent-[#1C5237] w-4 h-4 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>

            <button
              disabled={!allQcPassed}
              onClick={() => {
                setJobStatus("APPROVED");
                alert("✨ 10-Point QC Certification Approved! Order cleared for luxury packaging and insured dispatch.");
              }}
              className="w-full py-3.5 rounded-full bg-[#1C5237] text-white font-serif text-xs font-semibold hover:bg-[#153D29] disabled:opacity-40 transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Certify &amp; Clear for Dispatch</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
