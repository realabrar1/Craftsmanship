import assert from "node:assert";
import { calculateNecklacePrice } from "../src/lib/pricing-engine.ts";

console.log("Running Pricing Engine Unit Test...");

const CATALOG_MOCK = new Map([
  ["STR-PINK-01", { sku: "STR-PINK-01", name: "Pink Freshwater Pearls", basePrice: 900 }],
  ["CON-RECT-01", { sku: "CON-RECT-01", name: "Kundan Connector Bars", basePrice: 2000 }],
  ["ACC-GOLD-NAKSHI-01", { sku: "ACC-GOLD-NAKSHI-01", name: "Gold Pearl Accents", basePrice: 600 }],
  ["CLS-S-HOOK-01", { sku: "CLS-S-HOOK-01", name: "Antique S-Hook Clasp", basePrice: 450 }],
  ["PEN-LAKSHMI-01", { sku: "PEN-LAKSHMI-01", name: "Lakshmi Temple Pendant", basePrice: 14500 }],
]);

// Test Case 1: Reference Mockup Design (Image 1)
// 5 Strands of Pink Pearls, 3 Pairs of Kundan Bars, 20 Gold Accents, S-Hook Clasp
const testDesign = {
  layersCount: 5,
  layers: Array.from({ length: 5 }).map((_, i) => ({
    layerIndex: i,
    strandSku: "STR-PINK-01",
    lengthInches: 17 + i * 1.5,
    dropCurveDepth: 1.0 + i * 0.25,
    beadDiameterMm: 5.5,
    beadColor: "#E8BDB5",
  })),
  pendantSku: null,
  connectors: [
    {
      componentSku: "CON-RECT-01",
      type: "CONNECTOR",
      placement: "BOTH_SIDES",
      quantityPairs: 3,
      curvePositions: [0.28, 0.44, 0.60],
      connectedStrands: [0, 1, 2, 3, 4],
    },
  ],
  accents: {
    patternType: "UNIFORM",
    beadSku: "ACC-GOLD-NAKSHI-01",
    quantity: 20,
  },
  finishing: {
    threadColor: "Soft Pink",
    claspSku: "CLS-S-HOOK-01",
    tasselType: "Pearl Clustered",
  },
};

const result = calculateNecklacePrice(testDesign, CATALOG_MOCK);

console.log("Estimated Total INR:", result.estimatedTotalInr);
console.log("Component Subtotal:", result.componentSubtotal);
console.log("Craftsmanship Labour:", result.craftsmanship.totalLabour);
console.log("Taxes (3% GST):", result.taxes.gstAmount);

// Assert exact total price from user mockup
assert.strictEqual(result.estimatedTotalInr, 18700, "Estimated price must match ₹18,700!");
assert.strictEqual(result.componentSubtotal, 12150, "Component subtotal must equal ₹12,150!");
assert.strictEqual(result.taxes.gstAmount, 545, "GST must equal ₹545!");

console.log("✔ Pricing Engine Unit Test PASSED with 100% precision!");
