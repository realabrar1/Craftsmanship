"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";

export interface StrandOption {
  sku: string;
  name: string;
  colorName: string;
  beadColor: string;
  beadDiameterMm: number;
  material: string;
  pricePerStrand: number;
  image: string;
}

export const AVAILABLE_STRANDS: StrandOption[] = [
  {
    sku: "STR-PINK-01",
    name: "Pink Freshwater Pearls",
    colorName: "Blush Pink",
    beadColor: "#E8BDB5",
    beadDiameterMm: 5.5,
    material: "Grade AAA Cultured Pearls",
    pricePerStrand: 900,
    image: "/assets/strands/pink-freshwater-pearls.jpg",
  },
  {
    sku: "STR-WHITE-02",
    name: "Ivory White Pearls",
    colorName: "Warm Ivory",
    beadColor: "#FAF5ED",
    beadDiameterMm: 6.0,
    material: "Grade AAA Cultured Pearls",
    pricePerStrand: 850,
    image: "/assets/strands/white-freshwater-pearls.jpg",
  },
  {
    sku: "STR-RICE-03",
    name: "Fine Rice Moti",
    colorName: "Natural Cream",
    beadColor: "#F3EDE2",
    beadDiameterMm: 4.2,
    material: "Natural Rice Shape Pearls",
    pricePerStrand: 750,
    image: "/assets/strands/rice-pearls.jpg",
  },
  {
    sku: "STR-CHAMP-04",
    name: "Champagne Golden Pearls",
    colorName: "Champagne Gold",
    beadColor: "#DFBA83",
    beadDiameterMm: 7.0,
    material: "High-Lustre Golden Pearls",
    pricePerStrand: 1100,
    image: "/assets/strands/champagne-pearls.jpg",
  },
  {
    sku: "STR-RUBY-05",
    name: "Pigeon-Blood Ruby Beads",
    colorName: "Royal Ruby Red",
    beadColor: "#8B1229",
    beadDiameterMm: 4.5,
    material: "Faceted Precious Rubies",
    pricePerStrand: 1800,
    image: "/assets/strands/faceted-ruby.jpg",
  },
  {
    sku: "STR-EMERALD-06",
    name: "Zambian Emerald Beads",
    colorName: "Deep Emerald Green",
    beadColor: "#0F5938",
    beadDiameterMm: 4.5,
    material: "Faceted Natural Emeralds",
    pricePerStrand: 2200,
    image: "/assets/strands/faceted-emerald.jpg",
  },
  {
    sku: "STR-JADE-07",
    name: "Imperial Green Jade Ovals",
    colorName: "Imperial Jade",
    beadColor: "#2C6949",
    beadDiameterMm: 8.0,
    material: "Smooth Carved Jade",
    pricePerStrand: 1400,
    image: "/assets/strands/oval-jade.jpg",
  },
  {
    sku: "STR-GOLD-NAKSHI-08",
    name: "Gold Nakshi & Pearl Strand",
    colorName: "Antique Gold & Pearl",
    beadColor: "#D4AF37",
    beadDiameterMm: 6.0,
    material: "22k Gold Nakshi + Pearls",
    pricePerStrand: 2600,
    image: "/assets/strands/gold-nakshi-pearl.jpg",
  },
];

interface StrandHangingSelectorProps {
  selectedStrandSku: string;
  onSelectStrand: (strand: StrandOption) => void;
}

export function StrandHangingSelector({
  selectedStrandSku,
  onSelectStrand,
}: StrandHangingSelectorProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-serif text-sm font-semibold text-[#3C211B]">
            Suspended Strand Samples
          </h4>
          <p className="text-xs text-[#7E6359]">
            Selected from our master karigar display rack
          </p>
        </div>
        <span className="text-xs bg-[#B58A4D]/10 text-[#B58A4D] font-serif font-medium px-2.5 py-0.5 rounded-full border border-[#B58A4D]/30">
          8 Artisan Strands
        </span>
      </div>

      {/* Antique Brass Hanging Rail Visualizer */}
      <div className="relative pt-3 pb-2 px-3 bg-gradient-to-b from-[#F3E2CF] to-[#FAF2E8] rounded-2xl border border-[#B58A4D]/40 shadow-inner">
        {/* Brass rail bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#9A723C] via-[#D4AF6E] to-[#9A723C] rounded-full shadow-sm mb-3 relative flex items-center justify-between px-2">
          <div className="w-3 h-3 rounded-full bg-[#641B24] border border-[#B58A4D] shadow-sm -ml-2" />
          <div className="w-3 h-3 rounded-full bg-[#641B24] border border-[#B58A4D] shadow-sm -mr-2" />
        </div>

        {/* Vertically suspended strands grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {AVAILABLE_STRANDS.map((strand) => {
            const isSelected = selectedStrandSku === strand.sku;

            return (
              <button
                key={strand.sku}
                onClick={() => onSelectStrand(strand)}
                className={`group flex flex-col items-center p-2 rounded-xl transition-all duration-300 relative ${
                  isSelected
                    ? "bg-[#641B24]/10 border-2 border-[#641B24] shadow-md scale-105"
                    : "bg-[#FFFDF9]/80 border border-[#E5D2BE] hover:border-[#B58A4D] hover:bg-white"
                }`}
              >
                {/* Suspension cord from rail */}
                <div className="w-0.5 h-3 bg-[#B58A4D] mb-1 opacity-70" />

                {/* Macro bead circle */}
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#E5D2BE] shadow-sm group-hover:border-[#B58A4D] transition-colors">
                  <img
                    src={strand.image}
                    alt={strand.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#641B24]/75 flex items-center justify-center text-white">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                {/* Bead color indicator dot */}
                <div
                  className="w-3 h-3 rounded-full border border-black/10 mt-2 shadow-xs"
                  style={{ backgroundColor: strand.beadColor }}
                />

                <span className="font-serif text-[11px] font-semibold text-[#3C211B] mt-1 text-center line-clamp-1">
                  {strand.name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-[#7E6359] font-mono">
                  {strand.beadDiameterMm}mm
                </span>
                <span className="text-[11px] font-serif font-bold text-[#641B24] mt-0.5">
                  ₹{strand.pricePerStrand.toLocaleString("en-IN")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
