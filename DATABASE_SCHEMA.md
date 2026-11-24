# BeadsBliss — Database Schema & Data Dictionary

This document details the normalized relational database powering BeadsBliss.

---

## 1. Entity-Relationship Overview

```
 [User] 1 ────────── * [NecklaceDesign]
   │                         │ 1
   │                         │
   │                         ▼ *
   │ 1 ───────────── * [CartItem]
   │                         │
   │                         ▼
   │ 1 ───────────── * [Order] 1 ─────── * [OrderItem]
   │                         │ 1
   │                         │
   │ 1 (Karigar)             ▼ 1
   └──────────────── * [ArtisanJob] 1 ─── * [QualityCheck]
                             │
                             ▼
                   [InventoryMovement]

 [Category] 1 ─────── * [Product] 1 ──── 0..1 [Component3DAsset]
```

---

## 2. Table Specifications

### `User`
Stores system accounts across all administrative, customer, and artisan roles:
- `id`: UUID primary key.
- `name`: Full name.
- `email`: Unique email identifier.
- `passwordHash`: Salted credentials.
- `role`: `SUPER_ADMIN`, `CATALOG_MANAGER`, `ASSET_MANAGER`, `PRICING_MANAGER`, `PRODUCTION_MANAGER`, `KARIGAR`, `CUSTOMER`.
- `phone`, `address`, `city`, `state`, `pincode`: Logistics and contact details.

### `Component3DAsset`
Authentic jewellery components ingested into the 3D asset pipeline:
- `sku`: Unique SKU identifier (e.g. `PEN-LAKSHMI-01`, `CON-RECT-01`).
- `name`: Display title.
- `type`: `PENDANT`, `STRAND`, `CONNECTOR`, `SIDE_BROOCH`, `TEMPLE_BUTTI`, `SPACER_BEAD`, `CLASP`, `THREAD`.
- `status`: `DRAFT`, `PROCESSING`, `AWAITING_ARTISAN_VERIFICATION`, `UNDER_REVIEW`, `APPROVED`, `PUBLISHED`.
- `referencePhotosJson`: Multi-view reference photography (`front`, `back`, `side`, `angle`, `detail`, `loop`).
- `dimensionsMm`: Physical dimensions JSON `{width, height, depth, beadDiameter, loopSpacing}`.
- `attachmentPointsJson`: Configured physical connection points `{id, name, type, position: [x,y,z], supportedStrands: [1..5], mechanism}`.
- `compatibilityRulesJson`: Strand count constraints, minimum spacing, curvature limits.
- `pbrSettingsJson`: PBR metallic, roughness, color, transmission, and normal scale values.

### `Product`
Commercial e-commerce representation of finished pieces and customizable components:
- `sku`: Associated component or finished piece SKU.
- `basePrice`: Component retail price in INR (₹).
- `makingCharges`: Base manufacturing/artisan fee.
- `stockQuantity`: Real-time stock available.
- `threeDAssetId`: 1-to-1 link to `Component3DAsset`.

### `NecklaceDesign`
Complete versioned state of a bespoke necklace created in the 6-step customizer:
- `designCode`: Unique human-readable code (e.g. `SM-BESPOKE-2026-9041`).
- `layersCount`: Number of active hanging strands/layers (1 to 5).
- `layersConfigJson`: Array of layer specifications `{layerIndex, strandSku, beadDiameterMm, lengthInches, dropCurveDepth, beadColor}`.
- `pendantSku`: Central pendant SKU or `null`.
- `connectorsConfigJson`: Array of placed connectors `{componentSku, type, placement: "BOTH_SIDES"|"LEFT_ONLY"|"RIGHT_ONLY", quantityPairs, curvePositions: [0.28, 0.44, 0.60], connectedStrands: [0,1,2,3,4]}`.
- `accentsConfigJson`: Interspersed accent bead patterns `{patternType, beadSku, quantity, interval}`.
- `finishingConfigJson`: `{threadColor, claspSku, tasselType}`.
- `pricingSnapshotJson`: Frozen price breakdown recorded at the time of design saving or ordering.
- `previewSnapshotUrl`: Generated or stored high-res visual preview.

### `Order` & `OrderItem`
Transaction-safe commerce records:
- `orderNumber`: Unique alphanumeric ID (e.g. `ORD-SM-2026-1049`).
- `subtotal`, `makingCharges`, `taxGst`, `discount`, `grandTotal`: Itemized financials.
- `paymentStatus`: `PENDING`, `AUTHORIZED`, `PAID`, `FAILED`, `REFUNDED`.
- `paymentMethod`: `RAZORPAY` or `COD`.
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`: Cryptographic payment verification.
- `orderStatus`: `CONFIRMED`, `MATERIALS_PREPARATION`, `IN_PRODUCTION`, `QUALITY_CHECK`, `READY_TO_DISPATCH`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

### `ArtisanJob`
The physical production docket assigned to a Master Karigar:
- `jobCode`: Unique job identifier (e.g. `KRG-JOB-4081`).
- `assignedKarigarId`: Master artisan assigned.
- `status`: 11-step manufacturing workflow.
- `bomJson`: Structured Bill of Materials detailing bead count, wire lengths, component SKUs, and assembly steps.
- `productionPhotosJson`: Evidence photos uploaded during assembly.
- `karigarPayoutInr`: Guaranteed artisan compensation for craftsmanship.

### `QualityCheck`
Formal 10-point quality audit prior to packing:
- `artisanJobId`: Associated manufacturing job.
- `checklistJson`: Verification of stone settings, loop alignment, thread tension, and hallmarking.
- `status`: `PASSED`, `REWORK_REQUIRED`, `REJECTED`.

### `PricingRule`
Configurable business charges:
- `ruleKey`: e.g. `STRINGING_PER_STRAND`, `CONNECTOR_MOUNTING_PAIR`, `PENDANT_ATTACHMENT`, `GST_TAX_PERCENT`.
- `chargeType`: `FIXED`, `PER_STRAND`, `PER_PAIR`, `PERCENTAGE`.
- `amountInr`: Currency rate.
