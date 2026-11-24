import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Gem,
  Truck,
  Heart,
  Search,
  ShoppingBag,
  Star,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans selection:bg-[#B58A4D]/20">
      {/* 1. Atelier Top Navigation Header */}
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
            <Link href="/" className="text-[#641B24] font-semibold underline underline-offset-8 decoration-[#B58A4D] decoration-2">
              Home
            </Link>
            <Link href="/design-your-necklace" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              Design Your Necklace
            </Link>
            <Link href="/collections" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              Our Collections
            </Link>
            <Link href="/atelier" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              The Atelier
            </Link>
            <Link href="/craftsmanship" className="text-[#3C211B] hover:text-[#641B24] transition-colors">
              About Us
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/collections" className="text-[#3C211B] hover:text-[#641B24] p-1.5 transition-colors">
              <Search className="w-5 h-5 stroke-[1.75]" />
            </Link>
            <Link href="/cart" className="text-[#3C211B] hover:text-[#641B24] p-1.5 transition-colors relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#641B24] text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </Link>
            <Link
              href="/account"
              className="w-8 h-8 rounded-full bg-[#641B24] text-[#FFFDF9] flex items-center justify-center font-serif text-xs font-semibold shadow-xs hover:bg-[#B58A4D] transition-colors"
            >
              S
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Premium Hero Banner */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF2E8] via-[#F3E2CF]/50 to-[#FAF2E8] px-6 py-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B58A4D]/15 border border-[#B58A4D]/30 text-[#641B24] text-xs font-serif font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-[#B58A4D]" />
              Bespoke Pearl &amp; Temple Atelier
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#3C211B] leading-[1.08] tracking-tight">
              Your Imagination. <br />
              <span className="italic font-light text-[#641B24]">Our Craftsmanship.</span>
            </h1>

            <p className="font-serif text-base sm:text-lg text-[#7E6359] max-w-xl leading-relaxed">
              Create a necklace that tells your story. Choose your pearls, discover your motifs and let our karigars bring your creation to life.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/design-your-necklace"
                className="px-8 py-4 rounded-full bg-[#641B24] text-[#FFFDF9] font-serif font-semibold text-sm tracking-wide shadow-atelierLg hover:bg-[#B58A4D] transition-all duration-300 flex items-center gap-3 group"
              >
                <span>Design Your Necklace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/collections"
                className="px-7 py-4 rounded-full border border-[#B58A4D] text-[#3C211B] font-serif font-semibold text-sm hover:bg-[#F3E2CF] transition-colors"
              >
                Explore Collections
              </Link>
            </div>

            {/* Micro badges */}
            <div className="pt-6 flex items-center gap-6 text-xs font-serif text-[#7E6359]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#B58A4D]" /> AAA Freshwater Pearls
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#B58A4D]" /> Authentic Nakshi &amp; Jadau
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#B58A4D]" /> Master Karigars
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDF9] bg-white group">
              <img
                src="/assets/reference/assembled-necklace-front.jpg"
                alt="Heirloom Panchlada Moti Haar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3C211B]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-[#FFFDF9]">
                <span className="text-xs uppercase font-serif tracking-widest text-[#D4AF6E]">
                  Commission Highlight
                </span>
                <h3 className="font-editorial text-2xl font-normal mt-1">
                  Royal Panchlada Pink Pearl Haar
                </h3>
                <p className="text-xs text-[#FFFDF9]/80 font-serif mt-1">
                  5-strand freshwater pearls with 3 pairs of 22k Kundan connector bars
                </p>
                <Link
                  href="/design-your-necklace"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-serif text-[#D4AF6E] hover:underline"
                >
                  Customise this design in 3D →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Brand Introduction */}
      <section className="py-20 px-6 bg-[#FFFDF9] border-y border-[#E5D2BE]/60 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#B58A4D] font-semibold">
            The Bespoke Experience
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#3C211B]">
            From the beads you choose, to the heirloom you wear.
          </h2>
          <div className="w-16 h-px bg-[#B58A4D] my-2" />
          <p className="font-serif text-[#7E6359] leading-relaxed">
            Every creation at BeadsBliss is an intimate dialogue between your personal vision and generations of Indian jewelry craftsmanship. Whether it is the soft blush of Hyderabad freshwater pearls or the sacred motifs of Nakshi temple padakkams, your piece is individually commissioned and meticulously hand-strung by master karigars.
          </p>
        </div>
      </section>

      {/* 4. Shop by Jewellery Category */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-[#B58A4D]">
              Atelier Collections
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#3C211B] mt-1">
              Shop by Jewellery Category
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs font-serif text-[#641B24] font-semibold hover:text-[#B58A4D] transition-colors mt-2 md:mt-0 flex items-center gap-1"
          >
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Pearl Necklaces",
              desc: "Lustrous AAA pearls",
              img: "/assets/strands/pink-freshwater-pearls.jpg",
              href: "/collections/pearl-necklaces",
            },
            {
              title: "Moti Haar",
              desc: "Multi-strand regal haars",
              img: "/assets/reference/assembled-necklace-angle-left.jpg",
              href: "/collections/moti-haar",
            },
            {
              title: "Temple Jewellery",
              desc: "Nakshi Lakshmi & Ganesha",
              img: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
              href: "/collections/temple-jewellery",
            },
            {
              title: "Kundan & Jadau",
              desc: "Uncut stones & connector bars",
              img: "/assets/connectors/kundan-5loop-bar-front.jpg",
              href: "/collections/kundan-jewellery",
            },
          ].map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-[#E5D2BE] shadow-atelier hover:shadow-atelierLg transition-all duration-300"
            >
              <div className="w-full aspect-square overflow-hidden bg-[#FAF2E8] p-4 flex items-center justify-center">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col">
                <h3 className="font-serif text-base font-bold text-[#3C211B] group-hover:text-[#641B24] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#7E6359] mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Design Your Necklace Feature Callout */}
      <section className="py-16 px-6 bg-[#F3E2CF]/60 border-y border-[#E5D2BE]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-serif uppercase tracking-widest text-[#641B24] font-semibold">
              The 3D Design Studio
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#3C211B]">
              Experience the Six-Step Jewellery Customizer
            </h2>
            <p className="font-serif text-sm text-[#7E6359] leading-relaxed">
              Step into our digital atelier. Choose your pendant, preview suspended hanging strands, arrange 1 to 5 concentric layers, add Kundan connector bars, and inspect your bespoke creation in 360-degree 3D before our karigars begin stringing.
            </p>
            <div className="pt-2">
              <Link
                href="/design-your-necklace"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold hover:bg-[#B58A4D] transition-colors shadow-md"
              >
                Launch 3D Studio →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border-2 border-[#B58A4D]/40 shadow-xl">
            <img
              src="/assets/reference/customizer-mockup-full.jpg"
              alt="Interactive Customizer Studio"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. Meet our Karigars & Craftsmanship */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-[#E5D2BE]">
              <img
                src="/assets/connectors/connector-5strand-assembly.jpg"
                alt="Karigar Silk Knotting"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#E5D2BE]">
              <img
                src="/assets/pendant/lakshmi-temple-pendant-detail.jpg"
                alt="Nakshi Carving Detail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <span className="text-xs font-serif uppercase tracking-widest text-[#B58A4D] font-semibold">
              Heritage &amp; Lineage
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#3C211B]">
              Handcrafted by Skilled Karigars
            </h2>
            <p className="font-serif text-sm text-[#7E6359] leading-relaxed">
              In our Hyderabad and Jaipur karkhanas, every knot is tied by hand using pure resham silk thread. Our master karigars calibrate the exact drape tension, loop alignment, and drop curve depth so that your necklace hugs the collarbone with effortless grace.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-serif text-[#3C211B]">
              <div className="p-3 bg-white rounded-xl border border-[#E5D2BE]">
                <p className="font-bold text-[#641B24]">10-Point QC Audit</p>
                <p className="text-[#7E6359] mt-0.5">Every loop, stone, and thread tension checked</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5D2BE]">
                <p className="font-bold text-[#641B24]">Guaranteed Karigar Payout</p>
                <p className="text-[#7E6359] mt-0.5">Fair artisan wages and ethical craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="py-20 px-6 bg-[#FFFDF9] border-y border-[#E5D2BE]/60 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center gap-1 text-[#B58A4D]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-[#B58A4D]" />
            ))}
          </div>
          <blockquote className="font-editorial text-2xl sm:text-3xl text-[#3C211B] leading-snug">
            &quot;Designing my 5-strand Panchlada haar in 3D allowed me to choose the exact blush shade of pearls and placement of Kundan bars. When the velvet box arrived, the physical piece was identical down to the millimeter.&quot;
          </blockquote>
          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-sm text-[#3C211B]">
              Sunita Sharma
            </span>
            <span className="text-xs text-[#7E6359] font-serif">
              Bespoke Bridal Commission • Mumbai
            </span>
          </div>
        </div>
      </section>

      {/* 8. Newsletter & Footer */}
      <footer className="w-full bg-[#3C211B] text-[#FAF2E8] pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#FAF2E8]/20 text-xs font-serif">
          <div className="flex flex-col gap-3">
            <span className="font-serif text-xl font-bold text-[#D4AF6E]">
              beadsBliss
            </span>
            <p className="text-[#FAF2E8]/70 leading-relaxed">
              Bespoke Pearl &amp; Temple Jewellery Atelier. Handcrafted freshwater pearls, authentic Kundan and traditional Indian craftsmanship.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold uppercase tracking-wider text-[#D4AF6E] mb-2">
              Atelier Collections
            </span>
            <Link href="/collections/pearl-necklaces" className="hover:text-[#D4AF6E]">
              Freshwater Pearl Necklaces
            </Link>
            <Link href="/collections/moti-haar" className="hover:text-[#D4AF6E]">
              Royal Moti Haar
            </Link>
            <Link href="/collections/temple-jewellery" className="hover:text-[#D4AF6E]">
              Nakshi Temple Jewellery
            </Link>
            <Link href="/collections/kundan-jewellery" className="hover:text-[#D4AF6E]">
              Jadau Kundan &amp; Polki
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold uppercase tracking-wider text-[#D4AF6E] mb-2">
              Bespoke Services
            </span>
            <Link href="/design-your-necklace" className="hover:text-[#D4AF6E]">
              3D Customizer Studio
            </Link>
            <Link href="/atelier/karigar" className="hover:text-[#D4AF6E]">
              Artisan Workshop Portal
            </Link>
            <Link href="/admin" className="hover:text-[#D4AF6E]">
              Administration Suite
            </Link>
            <Link href="/craftsmanship" className="hover:text-[#D4AF6E]">
              Care &amp; Authenticity Guide
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-bold uppercase tracking-wider text-[#D4AF6E] mb-2">
              Newsletter
            </span>
            <p className="text-[#FAF2E8]/70">
              Receive invitations to private commissions and heritage collections.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#FAF2E8]/10 border border-[#FAF2E8]/30 px-3 py-2 rounded-lg text-xs text-white placeholder-[#FAF2E8]/50 flex-1"
              />
              <button className="px-3 py-2 bg-[#D4AF6E] text-[#3C211B] font-bold rounded-lg hover:bg-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF2E8]/50 font-serif">
          <p>© 2026 BeadsBliss Atelier. All Rights Reserved. Made in India.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping &amp; GST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
