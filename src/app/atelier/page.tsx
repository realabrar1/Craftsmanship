import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

export default function AtelierPage() {
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
            <Link href="/atelier" className="text-[#641B24] font-semibold underline underline-offset-8 decoration-[#B58A4D]">The Atelier</Link>
            <Link href="/craftsmanship" className="hover:text-[#641B24]">About</Link>
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
            Private Commissions &amp; Studios
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#3C211B]">
            The BeadsBliss Atelier
          </h1>
          <p className="font-serif text-sm text-[#7E6359] max-w-xl">
            Where digital 3D bespoke design meets master karigar workshops in Chennai, Hyderabad, and Jaipur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-serif">
          {/* Atelier Studio */}
          <div className="p-8 bg-white rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <h3 className="font-serif text-base font-bold text-[#641B24]">
              Chennai Flagship Salon &amp; Studio
            </h3>
            <p className="text-[#7E6359] leading-relaxed">
              Visit our private viewing salon for tactile pearl comparisons, bespoke bridal consultations, and live 3D customizer demonstrations on high-resolution touch displays.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-[#3C211B]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B58A4D]" />
                <span>Atelier Suite 4, Rutland Gate 5th Street, Nungambakkam, Chennai 600006</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B58A4D]" />
                <span>+91 98401 22334 (By Appointment Only)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B58A4D]" />
                <span>Tuesday – Sunday, 11:00 AM – 7:30 PM</span>
              </div>
            </div>
          </div>

          {/* Master Workshop */}
          <div className="p-8 bg-white rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <h3 className="font-serif text-base font-bold text-[#641B24]">
              Hyderabad Karigar Guild &amp; Karkhana
            </h3>
            <p className="text-[#7E6359] leading-relaxed">
              Our central stringing and assembly workshop where Master Karigar Ramesh Chander and our guild artisans hand-craft each confirmed 3D custom commission.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-[#3C211B]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B58A4D]" />
                <span>Karigar Karkhana, Charminar Jewellers Quarter, Hyderabad 500002</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B58A4D]" />
                <span>atelier@beadsbliss.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B58A4D]" />
                <span>Workshop Hours: Mon – Sat, 9:00 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/design-your-necklace"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold hover:bg-[#B58A4D] transition-colors shadow-md"
          >
            <span>Commission a Bespoke Necklace in 3D</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
