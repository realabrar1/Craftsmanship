"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Filter, ShoppingBag, Eye, Heart } from "lucide-react";

const PRODUCTS = [
  {
    id: "prod-1",
    sku: "PEN-LAKSHMI-01",
    name: "Lakshmi Kemp Temple Pendant with Pearl Drops",
    category: "temple-jewellery",
    categoryName: "Temple Jewellery",
    price: 14500,
    material: "22k Antique Gold Plated Silver with Kemp Rubies & Pearls",
    image: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
    angleImage: "/assets/pendant/lakshmi-temple-pendant-angle.jpg",
    isCustomizable: true,
  },
  {
    id: "prod-2",
    sku: "STR-PINK-01",
    name: "Royal Panchlada Pink Freshwater Pearl Haar",
    category: "moti-haar",
    categoryName: "Moti Haar",
    price: 18700,
    material: "AAA Grade 5.5mm Pink Pearls with 3 Pairs Kundan Bars",
    image: "/assets/reference/assembled-necklace-front.jpg",
    angleImage: "/assets/reference/assembled-necklace-side.jpg",
    isCustomizable: true,
  },
  {
    id: "prod-3",
    sku: "CON-RECT-01",
    name: "Kundan 5-Strand Rectangular Connector Bars (Pair)",
    category: "kundan-jewellery",
    categoryName: "Kundan Jewellery",
    price: 2000,
    material: "Foil-Backed Jadau Kundan with 5-Loop Bridge",
    image: "/assets/connectors/kundan-5loop-bar-front.jpg",
    angleImage: "/assets/connectors/kundan-5loop-bar-angle.jpg",
    isCustomizable: true,
  },
  {
    id: "prod-4",
    sku: "BRC-FLORAL-RUBY-02",
    name: "Floral Kundan & Kemp Ruby Side Brooch (Pair)",
    category: "kundan-jewellery",
    categoryName: "Kundan Jewellery",
    price: 2800,
    material: "22k Gold Finish with Center Pigeon-Blood Ruby",
    image: "/assets/connectors/floral-ruby-brooch.jpg",
    angleImage: "/assets/connectors/floral-ruby-brooch-back.jpg",
    isCustomizable: true,
  },
  {
    id: "prod-5",
    sku: "STR-WHITE-02",
    name: "Triple Layer Ivory White Pearl Choker",
    category: "pearl-necklaces",
    categoryName: "Pearl Necklaces",
    price: 9800,
    material: "Lustrous 6mm Round Freshwater Pearls",
    image: "/assets/strands/white-freshwater-pearls.jpg",
    angleImage: "/assets/strands/hanging-rack-full.jpg",
    isCustomizable: true,
  },
  {
    id: "prod-6",
    sku: "BRC-LAKSHMI-RD-03",
    name: "Round Nakshi Lakshmi Temple Motif Brooch (Pair)",
    category: "temple-jewellery",
    categoryName: "Temple Jewellery",
    price: 2400,
    material: "Hand-Carved Nakshi Goddess Lakshmi with Rear Bar",
    image: "/assets/connectors/round-lakshmi-brooch.jpg",
    angleImage: "/assets/connectors/round-lakshmi-brooch-back.jpg",
    isCustomizable: true,
  },
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [maxPrice, setMaxPrice] = useState<number>(25000);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchPrice = p.price <= maxPrice;
    return matchCat && matchPrice;
  });

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
            <Link href="/collections" className="text-[#641B24] font-semibold underline underline-offset-8 decoration-[#B58A4D]">Our Collections</Link>
            <Link href="/atelier" className="hover:text-[#641B24]">The Atelier</Link>
            <Link href="/craftsmanship" className="hover:text-[#641B24]">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-[#3C211B] hover:text-[#641B24] relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#641B24] text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </Link>
            <Link href="/account" className="w-8 h-8 rounded-full bg-[#641B24] text-white flex items-center justify-center text-xs font-serif font-bold">
              S
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="w-full bg-[#F3E2CF]/50 border-b border-[#E5D2BE] py-12 px-6 text-center">
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#3C211B]">
          Atelier Collections &amp; Components
        </h1>
        <p className="font-serif text-sm text-[#7E6359] max-w-xl mx-auto mt-2">
          Discover certified freshwater pearl haars, hand-carved temple pendants, and authentic Kundan connector bars.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#E5D2BE]/60 pb-3">
            <h3 className="font-serif text-base font-bold text-[#3C211B] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#B58A4D]" />
              Filter Collections
            </h3>
            {selectedCategory !== "ALL" && (
              <button
                onClick={() => setSelectedCategory("ALL")}
                className="text-[11px] font-serif text-[#641B24] hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#7E6359]">
              Category
            </span>
            {[
              { id: "ALL", label: "All Masterpieces" },
              { id: "pearl-necklaces", label: "Pearl Necklaces" },
              { id: "moti-haar", label: "Royal Moti Haar" },
              { id: "temple-jewellery", label: "Temple Jewellery" },
              { id: "kundan-jewellery", label: "Kundan & Jadau" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-left text-xs font-serif py-1.5 px-3 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-[#641B24] text-white font-semibold"
                    : "text-[#3C211B] hover:bg-[#FAF2E8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E5D2BE]/60">
            <div className="flex items-center justify-between text-xs font-serif">
              <span className="font-bold text-[#7E6359]">Max Price:</span>
              <span className="font-bold text-[#641B24]">₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[#641B24] cursor-pointer"
            />
          </div>

          {/* Direct CTA */}
          <div className="p-4 bg-[#FAF2E8] rounded-2xl border border-[#B58A4D]/30 flex flex-col gap-2 text-center">
            <span className="font-serif text-xs font-bold text-[#641B24]">
              Want a Bespoke Creation?
            </span>
            <p className="text-[11px] text-[#7E6359]">
              Assemble pearls, motifs, and layers yourself in 3D.
            </p>
            <Link
              href="/design-your-necklace"
              className="mt-1 py-2 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold hover:bg-[#B58A4D] transition-colors"
            >
              Open 3D Studio →
            </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-serif text-[#7E6359]">
            <span>Showing {filteredProducts.length} authentic pieces</span>
            <span>All certified by Hyderabad &amp; Jaipur Guilds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E5D2BE] shadow-atelier hover:shadow-atelierLg transition-all duration-300"
              >
                <div className="relative w-full aspect-square bg-[#FAF2E8] p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-white/90 shadow-sm border border-[#E5D2BE] flex items-center justify-center text-[#3C211B] hover:text-[#641B24]">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#B58A4D] font-bold">
                      {prod.categoryName}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-[#3C211B] mt-1 group-hover:text-[#641B24] transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#7E6359] mt-1 line-clamp-2">
                      {prod.material}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5D2BE]/60">
                    <div>
                      <span className="text-[10px] text-[#7E6359] font-serif uppercase">Price</span>
                      <p className="font-editorial text-lg font-bold text-[#641B24]">
                        ₹{prod.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <Link
                      href="/design-your-necklace"
                      className="px-4 py-2 rounded-full bg-[#FAF2E8] border border-[#B58A4D]/50 text-xs font-serif font-bold text-[#3C211B] hover:bg-[#641B24] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Customise</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
