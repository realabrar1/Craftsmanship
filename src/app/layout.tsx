import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeadsBliss — Bespoke Pearl & Temple Jewellery Atelier",
  description:
    "Your Imagination. Our Craftsmanship. Create a necklace that tells your story with authentic freshwater pearls, temple motifs, and master karigar craftsmanship.",
  keywords: [
    "BeadsBliss",
    "Bespoke Pearl Jewellery",
    "Panchlada Haar",
    "Kundan Jewellery",
    "Temple Jewellery",
    "Custom Pearl Necklace",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAF2E8] text-[#3C211B] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
