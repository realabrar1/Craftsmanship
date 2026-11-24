# BeadsBliss — 3D Asset Pipeline & Physical Verification Guide

## 1. 2D Reference to Production 3D Asset Lifecycle

BeadsBliss strictly enforces the rule that no unverified 2D photograph can be published as a production 3D asset without rigorous dimensional calibration and multi-angle verification.

```
 [Raw Photography] ────► [Scale Calibration] ────► [PBR Asset Ingestion] ────► [Anchor Configuration] ────► [Artisan Review] ────► [Published]
  - Front, Back,          - Caliper mm           - Geometry / GLB /            - Center pendant loop        - Karigar signoff     - Ready for
    Side, Angle,            measurements           parametric procedural         - Connector loop arrays      - Weight check        Customer
    Macro Details         - Loop spacing           PBR shader maps             - Rear bridge clearance      - Purity check        Customizer
```

---

## 2. Mandatory Reference Photography Package

Every physical jewellery component requires an authentic 6-view inspection package before approval:
1. **Front View (Orthographic/Calibrated):** Primary aesthetic face, gemstone faceting, Kundan stone alignment.
2. **Back View:** Essential for craftsmanship verification. Shows mounting plates, reverse Meenakari enameling, loop welds, and rear pass-through tubes.
3. **Left & Right Side Profiles:** Verifies physical thickness ($Z$-depth in mm), loop curvature, and stone bezel heights.
4. **3/4 Perspective Angle:** Reveals 3-dimensional relief, tiered step heights, and domed profiles.
5. **Macro Gemstone / Setting Detail:** Close-up inspection of prongs, foil-backed Jadau settings, and pearls.
6. **Attachment Loop Detail:** Calibrated measurement of loop inner diameter and center-to-center loop spacing.

---

## 3. Physical Metadata Schema

```json
{
  "sku": "CON-RECT-01",
  "name": "Kundan 5-Strand Rectangular Connector Bars",
  "physicalDimensions": {
    "widthMm": 32.0,
    "heightMm": 8.0,
    "thicknessMm": 4.5,
    "weightGrams": 14.2
  },
  "attachmentConfiguration": {
    "supportedStrands": 5,
    "topLoopsCount": 5,
    "bottomLoopsCount": 5,
    "loopInnerDiameterMm": 1.4,
    "loopCenterSpacingMm": 4.2,
    "mechanism": "loop_bridge"
  },
  "materials": {
    "metalBase": "92.5 Silver with 24k Gold Dip",
    "plating": "Antique 22k Gold Finish",
    "stones": ["Foil-backed Uncut Polki Kundan", "Hydrothermal Emerald Cabochons"]
  },
  "pbrMaterial": {
    "metalness": 0.90,
    "roughness": 0.25,
    "color": "#D4AF37",
    "normalMap": "/assets/textures/kundan-metal-normal.jpg"
  }
}
```

---

## 4. Asset Approval States

- `DRAFT`: Initial image ingestion and SKU registration.
- `PROCESSING`: Automated multi-view cropping, background isolation, and dimensional bounding.
- `AWAITING_ARTISAN_VERIFICATION`: Awaiting workshop caliper measurement of loop inner diameters and physical weight.
- `UNDER_REVIEW`: Interactive 360-degree inspection in the Admin 3D Asset Studio.
- `APPROVED`: Confirmed mathematically compatible with the parametric necklace draping engine.
- `PUBLISHED`: Live in the customer-facing 6-step Customizer.
- `ARCHIVED`: Deprecated or out-of-stock component.
