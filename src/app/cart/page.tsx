"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Trash2, ShieldCheck, Heart, ShoppingBag, Eye } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Load from localStorage or initialize with default sample bespoke design
    const stored = localStorage.getItem("beadsbliss_cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Cart parse error:", e);
      }
    } else {
      // Default sample item matching mockup Image 1
      const defaultItem = {
        id: "cart-initial",
        designId: "SM-BESPOKE-2026-9041",
        designTitle: "Royal Panchlada Pink Pearl Haar with Kundan Bars",
        price: 18700,
        layers: 5,
        strandName: "Pink Freshwater Pearls (Grade AAA, 5.5mm)",
        connectorsSummary: "3 Pairs Kundan 5-Strand Rectangular Connector Bars",
        accentsSummary: "20 pieces 22k Gold Nakshi Balls",
        previewImage: "/assets/reference/assembled-necklace-front.jpg",
      };
      setCartItems([defaultItem]);
      localStorage.setItem("beadsbliss_cart", JSON.stringify([defaultItem]));
    }
  }, []);

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    localStorage.setItem("beadsbliss_cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const gst = Math.round(subtotal * 0.03); // 3% GST
  const grandTotal = subtotal;

  return (
    <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans">
      {/* Top Header */}
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
            <Link href="/atelier" className="hover:text-[#641B24]">The Atelier</Link>
          </nav>

          <Link href="/cart" className="text-[#641B24] relative">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#641B24] text-white text-[10px] font-bold flex items-center justify-center">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </header>

      {/* Main Bag Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#3C211B] mb-2">
          Your Shopping Bag
        </h1>
        <p className="font-serif text-xs text-[#7E6359] mb-8">
          Review your bespoke jewellery commission before dispatch to our master karigars
        </p>

        {cartItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E5D2BE] flex flex-col items-center gap-4">
            <ShoppingBag className="w-12 h-12 text-[#B58A4D]" />
            <h3 className="font-serif text-lg font-bold text-[#3C211B]">
              Your bag is currently empty
            </h3>
            <p className="text-xs text-[#7E6359] max-w-sm">
              Discover our exquisite freshwater pearls and customize your dream heirloom in 3D.
            </p>
            <Link
              href="/design-your-necklace"
              className="mt-2 px-6 py-3 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold hover:bg-[#B58A4D] transition-colors"
            >
              Start Designing →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-32 h-36 rounded-2xl overflow-hidden border border-[#E5D2BE] bg-[#FAF2E8] shrink-0">
                    <img
                      src={item.previewImage || "/assets/reference/assembled-necklace-front.jpg"}
                      alt={item.designTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-3 w-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-[#641B24]/10 text-[#641B24] font-bold px-2 py-0.5 rounded-md">
                          {item.designId || "SM-BESPOKE"}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-[#7E6359] hover:text-[#641B24] p-1"
                          title="Remove from Bag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-serif text-base font-bold text-[#3C211B] mt-1.5">
                        {item.designTitle}
                      </h3>
                      <p className="text-xs text-[#7E6359] mt-1">
                        • {item.layers || 5} Concentric Hanging Layers ({item.strandName || "Pink Pearls"})
                      </p>
                      {item.connectorsSummary && (
                        <p className="text-xs text-[#7E6359]">• {item.connectorsSummary}</p>
                      )}
                      {item.accentsSummary && (
                        <p className="text-xs text-[#7E6359]">• {item.accentsSummary}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E5D2BE]/60">
                      <Link
                        href="/design-your-necklace"
                        className="text-xs font-serif text-[#641B24] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect in 3D Studio</span>
                      </Link>
                      <span className="font-editorial text-xl font-bold text-[#3C211B]">
                        ₹{(item.price || 18700).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-5 sticky top-24">
              <h3 className="font-serif text-base font-bold text-[#3C211B] border-b border-[#E5D2BE]/60 pb-3">
                Order Summary
              </h3>

              <div className="flex flex-col gap-2.5 text-xs font-serif text-[#3C211B]">
                <div className="flex justify-between">
                  <span className="text-[#7E6359]">Component Subtotal:</span>
                  <span className="font-semibold">₹12,150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6359]">Master Karigar Labour:</span>
                  <span className="font-semibold">₹5,668</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6359]">Jewellery GST (3%):</span>
                  <span className="font-semibold">₹432</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6359]">Insured Courier Delivery:</span>
                  <span className="font-semibold text-[#1C5237]">FREE</span>
                </div>

                <div className="h-px bg-[#E5D2BE]/60 my-2" />

                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#3C211B]">Total Payable:</span>
                  <span className="font-editorial text-2xl font-bold text-[#641B24]">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold tracking-wider hover:bg-[#B58A4D] transition-colors text-center shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] font-serif text-[#7E6359]">
                <ShieldCheck className="w-4 h-4 text-[#B58A4D]" />
                <span>100% Insured Delivery with Hallmark Certificate</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
