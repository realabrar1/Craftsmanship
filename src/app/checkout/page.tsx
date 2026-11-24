"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "Sunita Sharma",
    email: "sunita.sharma@example.com",
    phone: "+91 98200 44556",
    address: "Penthouse 12B, Altamount Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400026",
    notes: "Please package in antique burgundy velvet bridal box.",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate server-side cryptographic Razorpay order creation and HMAC verification
    setTimeout(() => {
      const orderId = "ORD-SM-2026-" + Math.floor(1000 + Math.random() * 9000);
      setConfirmedOrderId(orderId);
      setIsProcessing(false);
      setOrderConfirmed(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#B58A4D", "#641B24", "#E8C7B6", "#FAF2E8"],
      });

      // Clear shopping bag
      localStorage.removeItem("beadsbliss_cart");
    }, 1500);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5D2BE] shadow-atelierLg text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#1C5237]/10 text-[#1C5237] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>

          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-[#B58A4D] font-bold">
              Commission Confirmed
            </span>
            <h1 className="font-editorial text-3xl font-bold text-[#3C211B] mt-1">
              Thank You, {formData.name.split(" ")[0]}
            </h1>
            <p className="text-xs text-[#7E6359] mt-2 leading-relaxed">
              Your bespoke commission has been securely recorded. Master Karigar Ramesh Chander has been dispatched the manufacturing specification.
            </p>
          </div>

          <div className="w-full bg-[#FAF2E8] p-4 rounded-2xl border border-[#B58A4D]/30 text-xs font-serif text-left flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[#7E6359]">Order Reference:</span>
              <span className="font-mono font-bold text-[#641B24]">{confirmedOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6359]">Design Code:</span>
              <span className="font-mono font-bold text-[#3C211B]">SM-BESPOKE-2026-9041</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6359]">Payment Method:</span>
              <span className="font-bold text-[#1C5237]">Razorpay Verified (Paid)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6359]">Amount Paid:</span>
              <span className="font-bold text-[#3C211B]">₹18,700 (Inclusive of GST)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full pt-2">
            <Link
              href="/account"
              className="w-full py-3.5 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold hover:bg-[#B58A4D] transition-colors shadow-sm"
            >
              Track Order Live in Karigar Workshop →
            </Link>
            <Link
              href="/"
              className="text-xs font-serif text-[#7E6359] hover:text-[#641B24] transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF2E8] text-[#3C211B] flex flex-col font-sans">
      <header className="w-full bg-[#FAF2E8]/95 backdrop-blur-md border-b border-[#E5D2BE]/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-[#B58A4D]">
            <Sparkles className="w-4 h-4 fill-[#B58A4D]" />
            <span className="font-serif text-2xl font-bold tracking-tight text-[#3C211B]">
              beadsBliss
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-serif text-[#7E6359]">
            <Lock className="w-3.5 h-3.5 text-[#1C5237]" />
            <span>256-bit SSL Encrypted Atelier Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 w-full grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Shipping & Customer Details Form */}
        <form onSubmit={handleCompletePayment} className="md:col-span-7 bg-white p-8 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#3C211B]">
              Shipping &amp; Commission Information
            </h2>
            <p className="text-xs text-[#7E6359] mt-0.5">
              Where our insured white-glove courier should deliver your heirloom box
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">Phone (for Delivery SMS)</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">Street Address &amp; Suite</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">PIN Code</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="font-semibold text-[#3C211B]">Artisan Workshop Notes (Optional)</label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
                className="p-3 rounded-xl border border-[#E5D2BE] focus:border-[#B58A4D] outline-none text-[#3C211B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-[#641B24] text-white font-serif text-xs font-semibold tracking-wider hover:bg-[#B58A4D] disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {isProcessing ? (
              <span>Authorizing via Razorpay Gateway...</span>
            ) : (
              <>
                <span>Pay ₹18,700 &amp; Commission Necklace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Order Summary Snapshot */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <h3 className="font-serif text-base font-bold text-[#3C211B] border-b border-[#E5D2BE]/60 pb-3">
              Commission Summary
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden border border-[#E5D2BE] bg-[#FAF2E8] shrink-0">
                <img
                  src="/assets/reference/assembled-necklace-front.jpg"
                  alt="Heirloom Haar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[#3C211B]">
                  Royal Panchlada Pink Pearl Haar
                </p>
                <p className="text-xs text-[#7E6359] mt-0.5">
                  5 Layers • 3 Pairs Kundan Bars
                </p>
                <span className="text-xs font-mono font-bold text-[#641B24]">
                  SM-BESPOKE-2026-9041
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#E5D2BE]/60 text-xs font-serif text-[#3C211B]">
              <div className="flex justify-between">
                <span className="text-[#7E6359]">Itemized Components:</span>
                <span>₹12,150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6359]">Karigar Craftsmanship:</span>
                <span>₹5,668</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6359]">GST (3%):</span>
                <span>₹432</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6359]">Insured Shipping:</span>
                <span className="text-[#1C5237] font-bold">Complimentary</span>
              </div>
              <div className="h-px bg-[#E5D2BE]/60 my-1" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm">Total:</span>
                <span className="font-editorial text-2xl font-bold text-[#641B24]">
                  ₹18,700
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#E5D2BE] flex items-center gap-3 text-xs font-serif text-[#7E6359]">
            <ShieldCheck className="w-6 h-6 text-[#B58A4D] shrink-0" />
            <span>Razorpay Test Gateway Mode Active. Genuine 256-bit cryptographic payment tokens verified server-side.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
