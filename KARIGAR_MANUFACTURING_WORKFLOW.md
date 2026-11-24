# BeadsBliss — Artisan / Karigar Manufacturing Workflow

## 1. Artisan Workshop Philosophy

At BeadsBliss, technology does not replace the traditional karigar; it empowers them.

Every bespoke necklace created in the 3D studio generates a structured, printable **Manufacturing Job Docket & Bill of Materials (BOM)** that is dispatched to the Karigar Karkhana (Workshop) in Hyderabad or Jaipur.

---

## 2. The 11-Stage Production Pipeline

```
 [1. Awaiting Assignment] ────► [2. Accepted by Master Karigar]
                │
                ▼
 [3. Materials Preparation] ─── Verified pearl strands, connector loop counts & silk thread
                │
                ▼
 [4. Pearl Stringing] ──────── Hand-knotting resham silk with calibrated tension
                │
                ▼
 [5. Connector Assembly] ───── Passing strands through 5-loop connector bars
                │
                ▼
 [6. Pendant Attachment] ───── Central reinforced loop mounting
                │
                ▼
 [7. Clasp & Finishing] ────── S-hook clasp and cluster tassel cord
                │
                ▼
 [8. Quality Inspection] ───── 10-point audit by Senior Assessor
                │
                ▼
 [9. Approved] ────────────── Hallmarking & certification signed
                │
                ▼
 [10. Packed] ─────────────── Velvet heirloom box & moisture barrier
                │
                ▼
 [11. Dispatched] ─────────── Insured secure logistics tracking
```

---

## 3. Bill of Materials (BOM) Specification

Each job docket contains an immutable component checklist:

```json
{
  "orderNumber": "ORD-SM-2026-1049",
  "jobCode": "KRG-JOB-4081",
  "assignedKarigar": "Master Karigar Ramesh Chander",
  "karigarPayoutInr": 3500.0,
  "materialsList": [
    {
      "sku": "STR-PINK-01",
      "name": "Pink Freshwater Pearls (AAA, 5.5mm)",
      "requiredQuantity": "5 strands (~430 pearls)",
      "inspectionRequirement": "Check uniform 5.5mm diameter and high nacre lustre"
    },
    {
      "sku": "CON-RECT-01",
      "name": "Kundan 5-Strand Rectangular Connector Bars",
      "requiredQuantity": "3 pairs (6 pieces)",
      "inspectionRequirement": "Verify 5 open loops on top and bottom without burrs"
    },
    {
      "sku": "ACC-GOLD-NAKSHI-01",
      "name": "22k Gold Nakshi Balls",
      "requiredQuantity": "20 pieces",
      "inspectionRequirement": "Even spacing between connector stages"
    },
    {
      "sku": "THRD-SILK-PINK",
      "name": "Hand-Dyed Blush Pink Resham Silk Thread",
      "requiredQuantity": "15 meters",
      "inspectionRequirement": "Double thread waxing prior to knotting"
    },
    {
      "sku": "CLS-S-HOOK-01",
      "name": "Antique 22k Gold Finish S-Hook Clasp",
      "requiredQuantity": "1 unit",
      "inspectionRequirement": "Smooth spring catch and 2-inch extension chain"
    }
  ],
  "assemblyInstructions": [
    "1. Cut 5 silk threads of 30 inches each; wax with pure beeswax.",
    "2. String Layer 1 to 17 inches, Layer 2 to 18.5 inches, Layer 3 to 20 inches, Layer 4 to 21.5 inches, Layer 5 to 23 inches.",
    "3. Position Connector Pair 1 at 28% curve arc; pass each strand sequentially through loops 1 to 5.",
    "4. Secure with micro-knots on reverse side of connector bar.",
    "5. Position Connector Pair 2 at 44% arc and Connector Pair 3 at 60% arc.",
    "6. Assemble rear strand termination caps and connect to S-hook extension clasp."
  ]
}
```

---

## 4. 10-Point Quality Assurance Protocol

Before any order moves from `STRINGING` to `PACKED`:
1. **Pendant Symmetry:** Pendant hangs perfectly perpendicular to center vertical axis.
2. **Pearl Caliber:** No size variance exceeding $\pm 0.3\text{ mm}$ along same strand.
3. **Lustre & Color Consistency:** No discolored or blemished pearls in front drape.
4. **Strand Parallelism:** Parallel strands do not cross, twist, or overlap.
5. **Connector Loop Integrity:** All 5 strands firmly anchored through their respective loops.
6. **Thread Tension:** Neither overly rigid (causing buckling) nor loose (revealing bare thread).
7. **Kemp Stone Setting:** Kundan and kemp stones securely set with no loose foils.
8. **Gold Plating Inspection:** Antique 22k gold finish free from scratches or discoloration.
9. **Clasp Security:** S-hook and safety catch withstand 5 kg pull test without opening.
10. **Design Fidelity:** Assembled piece matches customer's approved 3D design code.
