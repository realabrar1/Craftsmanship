"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem,
  Award,
  Truck,
  Layers,
  Save,
} from "lucide-react";
import { NecklaceCanvas } from "@/components/3d/NecklaceCanvas";
import { StrandHangingSelector, AVAILABLE_STRANDS, StrandOption } from "@/components/customizer/StrandHangingSelector";
import { NecklaceDesignState, ConnectorPlacementConfig, PlacementType } from "@/lib/types";
import { calculateNecklacePrice } from "@/lib/pricing-engine";
import confetti from "canvas-confetti";

// Mock component catalog for lookups
const CATALOG_LOOKUP = new Map([
  ["STR-PINK-01", { sku: "STR-PINK-01", name: "Pink Freshwater Pearls", basePrice: 900 }],
  ["STR-WHITE-02", { sku: "STR-WHITE-02", name: "Ivory White Freshwater Pearls", basePrice: 850 }],
  ["STR-RICE-03", { sku: "STR-RICE-03", name: "Natural Rice Moti", basePrice: 750 }],
  ["STR-CHAMP-04", { sku: "STR-CHAMP-04", name: "Champagne Golden Pearls", basePrice: 1100 }],
  ["STR-RUBY-05", { sku: "STR-RUBY-05", name: "Faceted Ruby Beads", basePrice: 1800 }],
  ["STR-EMERALD-06", { sku: "STR-EMERALD-06", name: "Faceted Emerald Beads", basePrice: 2200 }],
  ["STR-JADE-07", { sku: "STR-JADE-07", name: "Imperial Jade Ovals", basePrice: 1400 }],
  ["STR-GOLD-NAKSHI-08", { sku: "STR-GOLD-NAKSHI-08", name: "Gold Nakshi & Pearl Strand", basePrice: 2600 }],
  ["PEN-LAKSHMI-01", { sku: "PEN-LAKSHMI-01", name: "Lakshmi Kemp Temple Pendant", basePrice: 14500 }],
  ["CON-RECT-01", { sku: "CON-RECT-01", name: "Kundan Connector Bars", basePrice: 2000 }],
  ["BRC-FLORAL-RUBY-02", { sku: "BRC-FLORAL-RUBY-02", name: "Floral Kundan Brooch", basePrice: 2800 }],
  ["BRC-LAKSHMI-RD-03", { sku: "BRC-LAKSHMI-RD-03", name: "Round Lakshmi Butti", basePrice: 2400 }],
  ["ACC-GOLD-NAKSHI-01", { sku: "ACC-GOLD-NAKSHI-01", name: "Gold Pearl Accents", basePrice: 600 }],
  ["CLS-S-HOOK-01", { sku: "CLS-S-HOOK-01", name: "Antique Gold S-Hook Clasp", basePrice: 450 }],
]);

export default function DesignYourNecklacePage() {
  // Active customizer step (1 to 6) - default to Step 4 to match reference mockup Image 1!
  const [activeStep, setActiveStep] = useState<number>(4);

  // Active connector category tab in Step 4
  const [activeConnectorTab, setActiveConnectorTab] = useState<"BROOCHES" | "SPACERS" | "BUTTIS">("BROOCHES");

  // Selected connector component
  const [selectedConnectorSku, setSelectedConnectorSku] = useState<string>("CON-RECT-01");
  const [connectorQuantity, setConnectorQuantity] = useState<number>(3);
  const [connectorPlacement, setConnectorPlacement] = useState<PlacementType>("BOTH_SIDES");
  const [live2DCapture, setLive2DCapture] = useState<string | null>(null);

  // Main design state
  const [design, setDesign] = useState<NecklaceDesignState>({
    designCode: "SM-BESPOKE-2026-9041",
    title: "Royal Panchlada Pink Pearl Haar with Lakshmi Temple Pendant",
    layersCount: 5,
    layers: Array.from({ length: 5 }).map((_, i) => ({
      layerIndex: i,
      strandSku: "STR-PINK-01",
      lengthInches: 17 + i * 1.5,
      dropCurveDepth: 1.0 + i * 0.25,
      beadDiameterMm: 5.5,
      beadColor: "#E8BDB5",
    })),
    pendantSku: "PEN-LAKSHMI-01",
    connectors: [
      {
        componentSku: "CON-RECT-01",
        type: "CONNECTOR",
        placement: "BOTH_SIDES",
        quantityPairs: 3,
        curvePositions: [0.20, 0.28, 0.36],
        connectedStrands: [0, 1, 2, 3, 4],
      },
    ],
    accents: {
      patternType: "UNIFORM",
      beadSku: "ACC-GOLD-NAKSHI-01",
      quantity: 20,
    },
    finishing: {
      threadColor: "Soft Pink Resham Silk",
      claspSku: "CLS-S-HOOK-01",
      tasselType: "Pearl Cluster Clasp",
    },
    pricing: {
      components: [],
      componentSubtotal: 12150,
      craftsmanship: {
        stringingCharges: 750,
        connectorAssembly: 600,
        pendantMounting: 0,
        sideBroochAssembly: 0,
        finishingCharges: 450,
        qualityCertification: 450,
        totalLabour: 5668,
      },
      taxes: {
        gstRatePercent: 3,
        gstAmount: 432,
      },
      shipping: 0,
      estimatedTotalInr: 18700,
    },
    viewMode: "3D",
  });

  // Re-calculate price whenever design configuration changes
  const livePricing = useMemo(() => {
    return calculateNecklacePrice(design, CATALOG_LOOKUP);
  }, [design]);

  // Update layers count
  const handleLayerCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(5, design.layersCount + delta));
    if (newCount === design.layersCount) return;

    const currentStrandSku = design.layers[0]?.strandSku || "STR-PINK-01";
    const currentStrand = AVAILABLE_STRANDS.find((s) => s.sku === currentStrandSku) || AVAILABLE_STRANDS[0];

    const newLayers = Array.from({ length: newCount }).map((_, i) => ({
      layerIndex: i,
      strandSku: currentStrand.sku,
      lengthInches: 17 + i * 1.5,
      dropCurveDepth: 1.0 + i * 0.25,
      beadDiameterMm: currentStrand.beadDiameterMm,
      beadColor: currentStrand.beadColor,
    }));

    // Update connector connected strands to match new layer count
    const updatedConnectors = design.connectors.map((c) => ({
      ...c,
      connectedStrands: Array.from({ length: newCount }).map((_, idx) => idx),
    }));

    setDesign((prev) => ({
      ...prev,
      layersCount: newCount,
      layers: newLayers,
      connectors: updatedConnectors,
    }));
  };

  // Update strand selection across all layers
  const handleStrandSelect = (strand: StrandOption) => {
    const newLayers = Array.from({ length: design.layersCount }).map((_, i) => ({
      layerIndex: i,
      strandSku: strand.sku,
      lengthInches: 17 + i * 1.5,
      dropCurveDepth: 1.0 + i * 0.25,
      beadDiameterMm: strand.beadDiameterMm,
      beadColor: strand.beadColor,
    }));

    setDesign((prev) => ({
      ...prev,
      layers: newLayers,
    }));
  };

  // Update connector configuration
  const handleConnectorChange = (sku: string, qty: number, place: PlacementType) => {
    setSelectedConnectorSku(sku);
    setConnectorQuantity(qty);
    setConnectorPlacement(place);

    const isBrooch = sku.startsWith("BRC-");
    const isButti = sku.includes("LAKSHMI");

    setDesign((prev) => ({
      ...prev,
      connectors: [
        {
          componentSku: sku,
          type: isBrooch ? "SIDE_BROOCH" : isButti ? "TEMPLE_BUTTI" : "CONNECTOR",
          placement: place,
          quantityPairs: qty,
          curvePositions: qty === 1 ? [0.28] : qty === 2 ? [0.22, 0.34] : [0.20, 0.28, 0.36],
          connectedStrands: Array.from({ length: prev.layersCount }).map((_, i) => i),
        },
      ],
    }));
  };

  // Toggle Pendant attachment
  const handlePendantToggle = (sku: string) => {
    setDesign((prev) => ({
      ...prev,
      pendantSku: prev.pendantSku === sku ? null : sku,
    }));
  };

  // Reset all to blank/fresh design
  const handleClearAll = () => {
    setDesign((prev) => ({
      ...prev,
      pendantSku: null,
      connectors: [],
      accents: { patternType: "UNIFORM", beadSku: "", quantity: 0 },
    }));
  };

  // Add to Cart with festive celebration
  const handleAddToCart = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#B58A4D", "#641B24", "#E8C7B6", "#FAF2E8"],
    });

    // Store in localStorage for shopping bag
    const cartItem = {
      id: "cart-" + Date.now(),
      designId: design.designCode,
      designTitle: design.title,
      price: livePricing.estimatedTotalInr,
      layers: design.layersCount,
      strandName: "Pink Freshwater Pearls",
      connectorsSummary: `${connectorQuantity} Pairs Kundan Connector Bars`,
      previewImage: "/assets/reference/assembled-necklace-front.jpg",
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("beadsbliss_cart") || "[]");
    localStorage.setItem("beadsbliss_cart", JSON.stringify([...existing, cartItem]));

    alert(`✨ Bespoke design added to bag!\nDesign Code: ${design.designCode}\nEstimated Total: ₹${livePricing.estimatedTotalInr.toLocaleString("en-IN")}`);
  };

  const handleSaveDesign = () => {
    alert(`✨ Your bespoke necklace design has been preserved!\nDesign Code: ${design.designCode}\nYou can restore or share this creation anytime.`);
  };

  return (
    <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans selection:bg-[#B58A4D]/20">
      {/* 1. Atelier Top Navigation Header matching reference Image 1 */}
      <header className="w-full bg-[#FAF2E8]/95 backdrop-blur-md border-b border-[#E5D2BE]/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand Logo matching user mockup Image 1 */}
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-serif">
            <Link href="/" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              Home
            </Link>
            <Link
              href="/design-your-necklace"
              className="text-[#641B24] font-semibold underline underline-offset-8 decoration-[#B58A4D] decoration-2"
            >
              Design Your Necklace
            </Link>
            <Link href="/collections" className="text-[#3C211B] hover:text-[#641B24] transition-colors flex items-center gap-1">
              Our Collections <span className="text-[10px] text-[#B58A4D]">▼</span>
            </Link>
            <Link href="/atelier" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              The Atelier
            </Link>
            <Link href="/craftsmanship" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              About
            </Link>
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center gap-4">
            <button className="text-[#3C211B] hover:text-[#641B24] p-1.5 transition-colors" title="Search">
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>
            <button className="text-[#3C211B] hover:text-[#641B24] p-1.5 transition-colors" title="Wishlist">
              <Heart className="w-5 h-5 stroke-[1.75]" />
            </button>
            <Link href="/cart" className="text-[#3C211B] hover:text-[#641B24] p-1.5 transition-colors relative" title="Bag">
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#641B24] text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </Link>
            <Link
              href="/account"
              className="w-8 h-8 rounded-full bg-[#641B24] text-[#FFFDF9] flex items-center justify-center font-serif text-xs font-semibold shadow-xs hover:bg-[#B58A4D] transition-colors"
              title="Customer Account"
            >
              S
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Brand Positioning Tagline & Page Title matching user mockup Image 1 */}
      <div className="w-full text-center pt-6 pb-4 px-4 bg-gradient-to-b from-[#FAF2E8] to-[#FAF2E8]/60">
        <p className="text-xs md:text-sm font-serif italic text-[#7E6359] tracking-wider mb-1">
          Your Imagination. Our Craftsmanship.
        </p>
        <h1 className="font-editorial text-2xl md:text-4xl font-normal text-[#3C211B] tracking-wide flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-[#B58A4D]/40 hidden sm:inline-block" />
          Design a Necklace as Unique as You
          <span className="w-8 h-px bg-[#B58A4D]/40 hidden sm:inline-block" />
        </h1>
        {/* Subtle lotus divider */}
        <div className="flex items-center justify-center gap-2 mt-2 text-[#B58A4D]">
          <span className="w-12 h-px bg-[#B58A4D]/30" />
          <Sparkles className="w-3 h-3 fill-[#B58A4D]/60" />
          <span className="w-12 h-px bg-[#B58A4D]/30" />
        </div>
      </div>

      {/* 3. Six-Step Interactive Progress Bar matching user mockup Image 1 */}
      <div className="max-w-6xl mx-auto px-4 w-full mb-6">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar bg-[#FFFDF9]/60 backdrop-blur-sm p-1.5 rounded-full border border-[#E5D2BE]/60 shadow-xs">
          {[
            { step: 1, label: "Choose Pendant" },
            { step: 2, label: "Select Strands" },
            { step: 3, label: "Arrange Layers" },
            { step: 4, label: "Add Connectors" },
            { step: 5, label: "Bead Patterns" },
            { step: 6, label: "Review & Order" },
          ].map((s) => {
            const isActive = activeStep === s.step;
            const isCompleted = activeStep > s.step;

            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-serif transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-[#641B24] text-[#FFFDF9] font-semibold shadow-md"
                    : isCompleted
                    ? "text-[#641B24] font-medium hover:bg-[#B58A4D]/10"
                    : "text-[#7E6359] hover:text-[#3C211B]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? "bg-[#FAF2E8] text-[#641B24]"
                      : isCompleted
                      ? "bg-[#641B24]/10 text-[#641B24]"
                      : "bg-[#E5D2BE]/50 text-[#7E6359]"
                  }`}
                >
                  {isCompleted ? "✓" : s.step}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main 3-Panel Studio Layout matching user mockup Image 1 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-10">
        {/* LEFT PANEL: Step Configuration & Component Selection */}
        <section className="lg:col-span-4 bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D2BE] shadow-atelier flex flex-col gap-6">
          {activeStep === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3C211B]">
                  1. Choose Your Pendant
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Select an authentic heirloom pendant or craft a pure multi-strand moti haar
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePendantToggle("PEN-LAKSHMI-01")}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                    design.pendantSku === "PEN-LAKSHMI-01"
                      ? "border-[#641B24] bg-[#641B24]/5 shadow-sm"
                      : "border-[#E5D2BE] hover:border-[#B58A4D]"
                  }`}
                >
                  <div className="w-20 h-24 rounded-xl overflow-hidden border border-[#E5D2BE]">
                    <img
                      src="/assets/pendant/lakshmi-temple-pendant-front.jpg"
                      alt="Lakshmi Pendant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-serif text-xs font-bold text-[#3C211B]">
                    Lakshmi Temple Pendant
                  </span>
                  <span className="text-xs font-bold text-[#641B24]">₹14,500</span>
                </button>

                <button
                  onClick={() => handlePendantToggle("")}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                    !design.pendantSku
                      ? "border-[#641B24] bg-[#641B24]/5 shadow-sm"
                      : "border-[#E5D2BE] hover:border-[#B58A4D]"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#B58A4D]/60 flex items-center justify-center text-[#B58A4D]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-xs font-bold text-[#3C211B]">
                    Pure Moti Haar (No Pendant)
                  </span>
                  <span className="text-[11px] text-[#7E6359]">Classic Panchlada</span>
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3C211B]">
                  2. Select Your Strands
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Explore authentic pearl, gemstone, and traditional strands from our atelier
                </p>
              </div>

              <StrandHangingSelector
                selectedStrandSku={design.layers[0]?.strandSku || "STR-PINK-01"}
                onSelectStrand={handleStrandSelect}
              />
            </div>
          )}

          {activeStep === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3C211B]">
                  3. Arrange Your Layers
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Choose from 1 to 5 concentric hanging layers with natural neck curvature
                </p>
              </div>

              {/* Layer Stepper */}
              <div className="flex items-center justify-between p-4 bg-[#FAF2E8] rounded-2xl border border-[#B58A4D]/30">
                <span className="font-serif text-sm font-semibold text-[#3C211B]">
                  Number of Layers:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLayerCountChange(-1)}
                    disabled={design.layersCount <= 1}
                    className="w-8 h-8 rounded-full bg-white border border-[#B58A4D]/50 text-[#3C211B] flex items-center justify-center disabled:opacity-40 hover:bg-[#641B24] hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif text-base font-bold text-[#641B24] w-6 text-center">
                    {design.layersCount}
                  </span>
                  <button
                    onClick={() => handleLayerCountChange(1)}
                    disabled={design.layersCount >= 5}
                    className="w-8 h-8 rounded-full bg-white border border-[#B58A4D]/50 text-[#3C211B] flex items-center justify-center disabled:opacity-40 hover:bg-[#641B24] hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Layer list */}
              <div className="flex flex-col gap-2">
                {design.layers.map((layer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5D2BE] text-xs font-serif"
                  >
                    <span className="font-semibold text-[#3C211B]">Layer {idx + 1}</span>
                    <span className="text-[#7E6359]">{layer.lengthInches}&quot; Drop Length</span>
                    <span className="text-[#641B24] font-medium">{layer.beadDiameterMm}mm Pearls</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3C211B]">
                  4. Add Connectors &amp; Signature Motifs
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Enhance your design with traditional elements
                </p>
              </div>

              {/* Tabs matching reference Image 1: Side Brooches | Spacer Bars | Temple Buttis */}
              <div className="flex items-center gap-1.5 p-1 bg-[#FAF2E8] rounded-xl border border-[#B58A4D]/30">
                <button
                  onClick={() => setActiveConnectorTab("BROOCHES")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                    activeConnectorTab === "BROOCHES"
                      ? "bg-[#641B24] text-[#FFFDF9] shadow-xs"
                      : "text-[#3C211B] hover:text-[#641B24]"
                  }`}
                >
                  Side Brooches
                </button>
                <button
                  onClick={() => setActiveConnectorTab("SPACERS")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                    activeConnectorTab === "SPACERS"
                      ? "bg-[#641B24] text-[#FFFDF9] shadow-xs"
                      : "text-[#3C211B] hover:text-[#641B24]"
                  }`}
                >
                  Spacer Bars
                </button>
                <button
                  onClick={() => setActiveConnectorTab("BUTTIS")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                    activeConnectorTab === "BUTTIS"
                      ? "bg-[#641B24] text-[#FFFDF9] shadow-xs"
                      : "text-[#3C211B] hover:text-[#641B24]"
                  }`}
                >
                  Temple Buttis
                </button>
              </div>

              {/* Component Grid matching reference Image 1 */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. Floral Brooch */}
                <button
                  onClick={() => handleConnectorChange("BRC-FLORAL-RUBY-02", connectorQuantity, connectorPlacement)}
                  className={`relative p-2 rounded-2xl border flex flex-col items-center transition-all ${
                    selectedConnectorSku === "BRC-FLORAL-RUBY-02"
                      ? "border-[#641B24] bg-[#641B24]/5 shadow-sm"
                      : "border-[#E5D2BE] hover:border-[#B58A4D]"
                  }`}
                >
                  <img
                    src="/assets/connectors/floral-ruby-brooch.jpg"
                    alt="Floral Brooch"
                    className="w-12 h-12 object-contain"
                  />
                  {selectedConnectorSku === "BRC-FLORAL-RUBY-02" && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#641B24] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </button>

                {/* 2. Round Lakshmi Butti */}
                <button
                  onClick={() => handleConnectorChange("BRC-LAKSHMI-RD-03", connectorQuantity, connectorPlacement)}
                  className={`relative p-2 rounded-2xl border flex flex-col items-center transition-all ${
                    selectedConnectorSku === "BRC-LAKSHMI-RD-03"
                      ? "border-[#641B24] bg-[#641B24]/5 shadow-sm"
                      : "border-[#E5D2BE] hover:border-[#B58A4D]"
                  }`}
                >
                  <img
                    src="/assets/connectors/round-lakshmi-brooch.jpg"
                    alt="Round Lakshmi Butti"
                    className="w-12 h-12 object-contain"
                  />
                  {selectedConnectorSku === "BRC-LAKSHMI-RD-03" && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#641B24] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </button>

                {/* 3. Teardrop Brooch */}
                <button
                  onClick={() => handleConnectorChange("BRC-TEARDROP-05", connectorQuantity, connectorPlacement)}
                  className={`relative p-2 rounded-2xl border flex flex-col items-center transition-all ${
                    selectedConnectorSku === "BRC-TEARDROP-05"
                      ? "border-[#641B24] bg-[#641B24]/5 shadow-sm"
                      : "border-[#E5D2BE] hover:border-[#B58A4D]"
                  }`}
                >
                  <img
                    src="/assets/connectors/teardrop-lakshmi-brooch.jpg"
                    alt="Teardrop Brooch"
                    className="w-12 h-12 object-contain"
                  />
                  {selectedConnectorSku === "BRC-TEARDROP-05" && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#641B24] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </button>

                {/* 4. Kundan 5-Strand Rectangular Connector Bar (ACTIVE in Image 1) */}
                <button
                  onClick={() => handleConnectorChange("CON-RECT-01", connectorQuantity, connectorPlacement)}
                  className={`relative p-2 rounded-2xl border flex flex-col items-center col-span-3 transition-all ${
                    selectedConnectorSku === "CON-RECT-01"
                      ? "border-2 border-[#641B24] bg-[#641B24]/5 shadow-sm"
                      : "border-[#E5D2BE] hover:border-[#B58A4D]"
                  }`}
                >
                  <img
                    src="/assets/connectors/kundan-5loop-bar-front.jpg"
                    alt="Kundan Rectangular Connector Bar"
                    className="w-full h-10 object-contain"
                  />
                  {selectedConnectorSku === "CON-RECT-01" && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#641B24] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </button>
              </div>

              {/* Select Quantity matching reference Image 1: "- 3 +" */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-xs font-semibold text-[#3C211B]">
                  Select Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleConnectorChange(
                        selectedConnectorSku,
                        Math.max(1, connectorQuantity - 1),
                        connectorPlacement
                      )
                    }
                    className="w-7 h-7 rounded-full bg-[#FAF2E8] border border-[#B58A4D]/40 text-[#3C211B] flex items-center justify-center hover:bg-[#641B24] hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-serif text-sm font-bold text-[#641B24] w-4 text-center">
                    {connectorQuantity}
                  </span>
                  <button
                    onClick={() =>
                      handleConnectorChange(
                        selectedConnectorSku,
                        Math.min(3, connectorQuantity + 1),
                        connectorPlacement
                      )
                    }
                    className="w-7 h-7 rounded-full bg-[#FAF2E8] border border-[#B58A4D]/40 text-[#3C211B] flex items-center justify-center hover:bg-[#641B24] hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Placement Radio Options matching reference Image 1: Both Sides | Left Only | Right Only */}
              <div className="flex flex-col gap-2">
                <span className="font-serif text-xs font-semibold text-[#3C211B]">
                  Placement
                </span>
                <div className="flex items-center gap-4 text-xs font-serif text-[#3C211B]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="placement"
                      checked={connectorPlacement === "BOTH_SIDES"}
                      onChange={() =>
                        handleConnectorChange(selectedConnectorSku, connectorQuantity, "BOTH_SIDES")
                      }
                      className="accent-[#641B24]"
                    />
                    <span>Both Sides</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="placement"
                      checked={connectorPlacement === "LEFT_ONLY"}
                      onChange={() =>
                        handleConnectorChange(selectedConnectorSku, connectorQuantity, "LEFT_ONLY")
                      }
                      className="accent-[#641B24]"
                    />
                    <span>Left Only</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="placement"
                      checked={connectorPlacement === "RIGHT_ONLY"}
                      onChange={() =>
                        handleConnectorChange(selectedConnectorSku, connectorQuantity, "RIGHT_ONLY")
                      }
                      className="accent-[#641B24]"
                    />
                    <span>Right Only</span>
                  </label>
                </div>
              </div>

              {/* Detail Photo Box matching reference Image 1 */}
              <div className="w-full rounded-2xl overflow-hidden border border-[#E5D2BE] shadow-xs relative aspect-[16/9] bg-[#FAF2E8]">
                <img
                  src="/assets/connectors/connector-5strand-assembly.jpg"
                  alt="Connector Detail View"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-[#FAF2E8]/90 backdrop-blur-xs text-[10px] font-serif px-2.5 py-0.5 rounded-full text-[#3C211B] border border-[#B58A4D]/30">
                  Micro-knotting Detail over 5 Strands
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3C211B]">
                  5. Bead Patterns &amp; Finishing
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Personalize with interspersed gold accents and resham silk thread
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-serif text-xs font-semibold text-[#3C211B]">
                  Accent Bead Rhythm:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                  <button
                    onClick={() =>
                      setDesign((prev) => ({
                        ...prev,
                        accents: { patternType: "UNIFORM", beadSku: "ACC-GOLD-NAKSHI-01", quantity: 20 },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-center ${
                      design.accents.patternType === "UNIFORM"
                        ? "border-[#641B24] bg-[#641B24]/5 font-bold"
                        : "border-[#E5D2BE]"
                    }`}
                  >
                    Uniform Pearls
                  </button>
                  <button
                    onClick={() =>
                      setDesign((prev) => ({
                        ...prev,
                        accents: { patternType: "EVERY_5TH", beadSku: "ACC-GOLD-NAKSHI-01", quantity: 20 },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-center ${
                      design.accents.patternType === "EVERY_5TH"
                        ? "border-[#641B24] bg-[#641B24]/5 font-bold"
                        : "border-[#E5D2BE]"
                    }`}
                  >
                    Every 5th Gold Nakshi
                  </button>
                </div>
              </div>

              {/* Silk thread selector */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="font-serif text-xs font-semibold text-[#3C211B]">
                  Hand-Dyed Resham Silk Thread:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: "Blush Pink", color: "#E8BDB5" },
                    { name: "Warm Ivory", color: "#FAF5ED" },
                    { name: "Antique Gold", color: "#D4AF37" },
                    { name: "Emerald Green", color: "#0F5938" },
                  ].map((t) => (
                    <button
                      key={t.name}
                      onClick={() =>
                        setDesign((prev) => ({
                          ...prev,
                          finishing: { ...prev.finishing, threadColor: t.name },
                        }))
                      }
                      className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                        design.finishing.threadColor.includes(t.name)
                          ? "border-[#641B24] bg-[#641B24]/5"
                          : "border-[#E5D2BE]"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs mb-1"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-[10px] font-serif">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3C211B]">
                  6. Review &amp; Order
                </h3>
                <p className="text-xs text-[#7E6359]">
                  Inspect your custom creation and finalize your commission
                </p>
              </div>

              <div className="p-4 bg-[#FAF2E8] rounded-2xl border border-[#B58A4D]/30 flex flex-col gap-2 text-xs font-serif">
                <p className="font-bold text-[#641B24] text-sm">{design.title}</p>
                <p className="text-[#7E6359]">Design Code: {design.designCode}</p>
                <div className="h-px bg-[#B58A4D]/20 my-1" />
                <p>• {design.layersCount} Concentric Draping Layers</p>
                <p>• Handcrafted with Resham Silk ({design.finishing.threadColor})</p>
                <p>• Verified 10-Point Workshop QC Guarantee</p>
                <p>• Estimated Crafting Time: 5-7 business days</p>
              </div>
            </div>
          )}

          {/* Step Navigation Next / Back buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E5D2BE]/60">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-4 py-2 rounded-full border border-[#B58A4D]/40 text-xs font-serif text-[#3C211B] hover:bg-[#F3E2CF] disabled:opacity-30 transition-colors"
            >
              ← Previous Step
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
              disabled={activeStep === 6}
              className="px-5 py-2 rounded-full bg-[#641B24] text-white text-xs font-serif font-semibold hover:bg-[#B58A4D] disabled:opacity-30 transition-colors shadow-sm"
            >
              Next Step →
            </button>
          </div>
        </section>

        {/* CENTER PANEL: Large 3D Interactive Necklace Preview matching reference Image 1 */}
        <section className="lg:col-span-5 w-full flex flex-col h-[640px] xl:h-[680px] min-h-[640px]">
          <NecklaceCanvas
            design={design}
            onToggleViewMode={(mode) => setDesign((prev) => ({ ...prev, viewMode: mode }))}
            onCapture2D={(url) => setLive2DCapture(url)}
          />
        </section>

        {/* RIGHT PANEL: "Your Design", Selected Components & Live Price matching reference Image 1 */}
        <section className="lg:col-span-3 bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D2BE] shadow-atelier flex flex-col gap-5">
          {/* Header matching Image 1: "Your Design" + Clear All icon */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#3C211B]">
              Your Design
            </h3>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-xs text-[#7E6359] hover:text-[#641B24] transition-colors"
              title="Clear Design"
            >
              <span>Clear All</span>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Design Thumbnail Card matching reference Image 1 */}
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5D2BE] shadow-inner bg-[#FAF2E8] relative">
            <img
              src={live2DCapture || "/assets/reference/assembled-necklace-front.jpg"}
              alt="Necklace Design Preview"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Selected Components Section matching reference Image 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7E6359]">
              Selected Components
            </h4>

            {/* Item 1: Pink Freshwater Pearls matching Image 1 */}
            <div className="flex items-center justify-between p-2.5 bg-[#FAF2E8]/60 rounded-xl border border-[#E5D2BE]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E5D2BE]">
                  <img
                    src="/assets/strands/pink-freshwater-pearls.jpg"
                    alt="Pink Pearls"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-serif font-bold text-[#3C211B] line-clamp-1">
                    Pink Freshwater Pearls
                  </p>
                  <p className="text-[10px] text-[#7E6359]">({design.layersCount} Strands)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs font-bold text-[#3C211B]">
                  ₹ {(design.layersCount * 900).toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => handleLayerCountChange(-1)}
                  className="text-[#7E6359] hover:text-[#641B24] text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Item 2: Kundan Connector Bars matching Image 1 */}
            {connectorQuantity > 0 && (
              <div className="flex items-center justify-between p-2.5 bg-[#FAF2E8]/60 rounded-xl border border-[#E5D2BE]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#E5D2BE] bg-white flex items-center justify-center p-0.5">
                    <img
                      src="/assets/connectors/kundan-5loop-bar-front.jpg"
                      alt="Kundan Bars"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-serif font-bold text-[#3C211B] line-clamp-1">
                      Kundan Connector Bars
                    </p>
                    <p className="text-[10px] text-[#7E6359]">({connectorQuantity} Pairs)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xs font-bold text-[#3C211B]">
                    ₹ {(connectorQuantity * 2000).toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleConnectorChange(selectedConnectorSku, 0, connectorPlacement)}
                    className="text-[#7E6359] hover:text-[#641B24] text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Item 3: Gold Pearl Accents matching Image 1 */}
            <div className="flex items-center justify-between p-2.5 bg-[#FAF2E8]/60 rounded-xl border border-[#E5D2BE]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E5D2BE]">
                  <img
                    src="/assets/accents/gold-nakshi-ball.jpg"
                    alt="Gold Accents"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-serif font-bold text-[#3C211B] line-clamp-1">
                    Gold Pearl Accents
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs font-bold text-[#3C211B]">
                  ₹ 1,200
                </span>
                <button className="text-[#7E6359] hover:text-[#641B24] text-xs">✕</button>
              </div>
            </div>

            {/* Item 4: Center Pendant if selected */}
            {design.pendantSku && (
              <div className="flex items-center justify-between p-2.5 bg-[#FAF2E8]/60 rounded-xl border border-[#E5D2BE]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#E5D2BE]">
                    <img
                      src="/assets/pendant/lakshmi-temple-pendant-front.jpg"
                      alt="Lakshmi Pendant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-serif font-bold text-[#3C211B] line-clamp-1">
                      Lakshmi Kemp Pendant
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xs font-bold text-[#3C211B]">
                    ₹ 14,500
                  </span>
                  <button
                    onClick={() => handlePendantToggle(design.pendantSku!)}
                    className="text-[#7E6359] hover:text-[#641B24] text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Layers Selector matching reference Image 1: "- 3 +" with mini strand visualizer */}
          <div className="pt-2 border-t border-[#E5D2BE]/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-semibold text-[#3C211B]">
                Layers
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleLayerCountChange(-1)}
                  disabled={design.layersCount <= 1}
                  className="w-6 h-6 rounded-full bg-[#FAF2E8] border border-[#B58A4D]/40 text-[#3C211B] flex items-center justify-center hover:bg-[#641B24] hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-serif text-xs font-bold text-[#641B24] w-3 text-center">
                  {design.layersCount}
                </span>
                <button
                  onClick={() => handleLayerCountChange(1)}
                  disabled={design.layersCount >= 5}
                  className="w-6 h-6 rounded-full bg-[#FAF2E8] border border-[#B58A4D]/40 text-[#3C211B] flex items-center justify-center hover:bg-[#641B24] hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mini layered strand visualization matching Image 1 */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {Array.from({ length: design.layersCount }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-0.5 items-center bg-[#FAF2E8] p-1 rounded-sm border border-[#E5D2BE]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8BDB5]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8BDB5]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8BDB5]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8BDB5]" />
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Price Section matching reference Image 1 */}
          <div className="pt-2 border-t border-[#E5D2BE]/60 flex flex-col items-center text-center">
            <span className="text-[11px] font-serif uppercase tracking-wider text-[#7E6359]">
              Estimated Price
            </span>
            <span className="font-editorial text-3xl font-bold text-[#3C211B] tracking-tight mt-0.5">
              ₹ {livePricing.estimatedTotalInr.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Primary Action Button matching reference Image 1: "Add to Cart ->" */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 rounded-full bg-[#641B24] text-[#FFFDF9] font-serif font-semibold text-sm tracking-wide shadow-md hover:bg-[#B58A4D] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Add to Cart</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Action: "Save Design" matching reference Image 1 */}
          <button
            onClick={handleSaveDesign}
            className="w-full flex items-center justify-center gap-2 text-xs font-serif text-[#7E6359] hover:text-[#641B24] transition-colors py-1"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Save Design</span>
          </button>
        </section>
      </main>

      {/* 5. Trust Badges Ribbon matching reference Image 1 */}
      <section className="w-full bg-[#FFFDF9] border-y border-[#E5D2BE]/60 py-4 px-6 mb-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-serif text-[#3C211B]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#B58A4D]" />
            <span>Handcrafted with Love</span>
          </div>
          <span className="text-[#B58A4D]/40 hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-[#B58A4D]" />
            <span>Premium Freshwater Pearls</span>
          </div>
          <span className="text-[#B58A4D]/40 hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B58A4D]" />
            <span>Custom Made for You</span>
          </div>
          <span className="text-[#B58A4D]/40 hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#B58A4D]" />
            <span>Delivered with Elegance</span>
          </div>
        </div>
      </section>

      {/* 6. Bottom Horizontal Component Carousel Ribbon matching reference Image 1 */}
      <section className="max-w-7xl mx-auto px-6 w-full pb-10">
        <div className="flex items-center gap-3">
          <button
            className="w-8 h-8 rounded-full border border-[#B58A4D]/40 bg-[#FFFDF9] text-[#3C211B] flex items-center justify-center hover:bg-[#641B24] hover:text-white transition-colors shrink-0"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-4 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: "CON-RECT-01", img: "/assets/connectors/kundan-5loop-bar-front.jpg" },
              { id: "BRC-FLORAL-RUBY-02", img: "/assets/connectors/floral-ruby-brooch.jpg" },
              { id: "CON-PEARL-EDGE-06", img: "/assets/connectors/pearl-edged-kundan-bar.jpg" },
              { id: "BRC-LAKSHMI-RD-03", img: "/assets/connectors/round-lakshmi-brooch.jpg" },
              { id: "BRC-PEACOCK-04", img: "/assets/connectors/peacock-enamel-brooch.jpg" },
              { id: "BRC-TEARDROP-05", img: "/assets/connectors/teardrop-lakshmi-brooch.jpg" },
              { id: "CON-RECT-01B", img: "/assets/connectors/kundan-5loop-bar-front.jpg" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleConnectorChange(item.id.replace("B", ""), connectorQuantity, connectorPlacement)}
                className="w-24 h-16 rounded-2xl bg-[#FFFDF9] border border-[#E5D2BE] hover:border-[#B58A4D] hover:shadow-xs p-2 flex items-center justify-center shrink-0 transition-all"
              >
                <img src={item.img} alt="Connector Motif" className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>

          <button
            className="w-8 h-8 rounded-full border border-[#B58A4D]/40 bg-[#FFFDF9] text-[#3C211B] flex items-center justify-center hover:bg-[#641B24] hover:text-white transition-colors shrink-0"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
