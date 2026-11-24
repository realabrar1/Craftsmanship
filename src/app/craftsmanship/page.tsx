import React from "react";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans">
      <header className="w-full bg-[#FAF2E8]/95 backdrop-blur-md border-b border-[#E5D2BE]/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-[#B58A4D]">
            <Sparkles className="w-4 h-4 fill-[#B58A4D]" />
            <span className="font-serif text-2xl font-bold tracking-tight text-[#3C211B]">
              beadsBliss
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-serif">
            <Link href="/" className="hover:text-[#641B24]">Home</Link>
            <Link href="/design-your-necklace" className="hover:text-[#641B24]">Design Your Necklace</Link>
            <Link href="/collections" className="hover:text-[#641B24]">Our Collections</Link>
            <Link href="/atelier" className="hover:text-[#641B24]">The Atelier</Link>
            <Link href="/craftsmanship" className="text-[#641B24] font-semibold underline underline-offset-8 decoration-[#B58A4D]">About Us</Link>
          </nav>
          <Link
            href="/design-your-necklace"
            className="px-5 py-2 rounded-full bg-[#641B24] text-white text-xs font-serif font-bold hover:bg-[#B58A4D] transition-colors"
          >
            Design in 3D
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 w-full flex-1 flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#B58A4D] font-bold">
            Heritage &amp; Lineage
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#3C211B]">
            Our Craftsmanship Story
          </h1>
          <p className="font-serif text-sm text-[#7E6359] max-w-xl">
            Tracing the timeless artistry of Hyderabad moti stringing, Jaipur Jadau Kundan, and sacred South Indian Nakshi temple carving.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border-2 border-[#E5D2BE] shadow-atelier bg-[#FAF2E8]">
          <img
            src="/assets/reference/assembled-necklace-angle-left.jpg"
            alt="Handcrafted Moti Haar"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-serif">
          <div className="p-6 bg-white rounded-2xl border border-[#E5D2BE] flex flex-col gap-2">
            <h3 className="font-bold text-sm text-[#641B24]">1. Freshwater Cultured Pearls</h3>
            <p className="text-[#7E6359] leading-relaxed">
              Every pearl is hand-calibrated for roundness, thick nacre depth, and soft pink or ivory undertones. No synthetic or plastic coatings are ever used.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E5D2BE] flex flex-col gap-2">
            <h3 className="font-bold text-sm text-[#641B24]">2. Pure Resham Silk Knotting</h3>
            <p className="text-[#7E6359] leading-relaxed">
              Using traditional beeswax-waxed resham silk threads, our karigars place micro-knots that provide maximum drape flexibility while safeguarding the pearls from friction.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E5D2BE] flex flex-col gap-2">
            <h3 className="font-bold text-sm text-[#641B24]">3. 22k Antique Gold Nakshi</h3>
            <p className="text-[#7E6359] leading-relaxed">
              Padakkams and connector bars feature hand-beaten gold sheet with sacred floral or deity motifs, accented with authentic uncut polki and hydrothermal gemstones.
            </p>
          </div>
        </div>

        <div className="p-8 bg-[#F3E2CF]/50 rounded-3xl border border-[#B58A4D]/40 text-center flex flex-col items-center gap-4">
          <h2 className="font-editorial text-2xl text-[#3C211B]">
            Ready to design your personal heirloom?
          </h2>
          <Link
            href="/design-your-necklace"
            className="px-8 py-3.5 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold hover:bg-[#B58A4D] transition-colors shadow-md"
          >
            Launch the 3D Customizer Studio →
          </Link>
        </div>
      </main>
    </div>
  );
}
