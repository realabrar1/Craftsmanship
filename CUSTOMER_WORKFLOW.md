# BeadsBliss — Customer Customization & Ordering Journey

## 1. Journey Architecture

```
 [Discover] ────► [Step 1: Pendant] ────► [Step 2: Strands] ────► [Step 3: Layers] ────► [Step 4: Connectors]
                       │                        │                       │                      │
                       ▼                        ▼                       ▼                      ▼
               Lakshmi, Ganesha,       Pink/White Pearl,       1 to 5 Layers,         Kundan bars, floral
               Kundan, Polki           Ruby/Emerald Gems       Drop depth, drape      brooches, buttis
                       │                        │                       │                      │
                       └────────────────────────┼───────────────────────┴──────────────────────┘
                                                │
                                                ▼
                                    [Step 5: Patterns & Thread]
                                       Gold spacers, knotting,
                                       silk thread, clasps
                                                │
                                                ▼
                                    [Step 6: Review & 3D Inspect]
                                       360° rotation, closeups,
                                       itemized pricing breakdown
                                                │
                                                ▼
                                    [Save Design or Order]
                                       Instant unique Design Code
                                       (e.g. SM-BESPOKE-2026-9041)
                                                │
                                                ▼
                                    [Razorpay Payment & Tracking]
                                       Live karigar workshop updates
```

---

## 2. Detailed Six-Step Customizer Specification

### Step 01 — Choose Your Pendant
- Visual gallery of authentic Indian heirloom pendants.
- Customer clicks any pendant:
  1. Engine loads the component metadata and approved visual asset.
  2. Inspects top attachment loop inner diameter and anchor position.
  3. Aligns the pendant with the front-center coordinate ($t = 0.5$) of the innermost necklace curve.
  4. Real-time live price and weight update.

### Step 02 — Select Your Strands
- Displays an interactive hanging display rack with suspended strands:
  - White freshwater pearls, pink freshwater pearls, rice pearls, champagne pearls, rubies, emeralds, jade.
- Customer previews bead diameter, grade, lustre, and price per strand.
- Direct selection updates the necklace's current strands immediately.

### Step 03 — Arrange Your Layers
- Configurable from 1 to 5 concentric layers.
- Presets: Single Classic, Double Pearl, Triple Moti Haar, Four-Layer Bridal, Five-Layer Heirloom (Panchlada).
- Engine recalculates natural catenary curves, maintaining concentricity without inter-strand clipping.

### Step 04 — Add Connectors & Signature Motifs
- Three categories:
  - **Side Brooches:** Floral Kundan, Ruby Brooches, Peacock motifs with rear pass-through tubes.
  - **Kundan Connector Bars:** 5-loop rectangular bars holding parallel strands in place.
  - **Temple Buttis:** Carved Nakshi Lakshmi or round chakra motifs.
- Customer selects placement:
  - `Both Sides` (symmetrical pairs), `Left Only`, or `Right Only`.
  - Number of pairs (1, 2, or 3 pairs).
- Live 3D preview mounts connector bars across all parallel strands at mathematically aligned angles.

### Step 05 — Bead Patterns & Finishing
- Accents: 22k Gold Nakshi balls, carved flower spacers, faceted ruby separators.
- Placement intervals: Uniform, Alternating Gold, Every 5th bead.
- Finishing: Resham silk thread colors (Blush Pink, Ivory, Antique Gold, Emerald Green).
- Clasp options: Traditional S-hook, screw cylinder, or extension chain.

### Step 06 — Review & Order
- Large 3D viewer with 360° OrbitControls, Close-up inspect, Front/Side/Back view presets, 3D/2D toggle.
- Itemized price breakdown:
  - Component costs (strands, pendant, connectors, accents, clasp).
  - Craftsmanship labour (stringing charges, connector assembly, mounting).
  - Taxes (3% GST) & complimentary insured luxury shipping.
- Action: "Save Design" (generates persistent shareable code) or "Add to Cart ➔ Checkout".
