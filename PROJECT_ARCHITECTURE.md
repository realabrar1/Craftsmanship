# BeadsBliss — Bespoke Pearl & Temple Jewellery Atelier
## Project Architecture & Technical Blueprint

**Brand Name:** BeadsBliss  
**Positioning:** Premium Handmade Pearl, Moti, Kundan & Temple Jewellery Atelier  
**Brand Statement:** *"Your Imagination. Our Craftsmanship."* — *"From the beads you choose, to the heirloom you wear."*  
**Primary Currency:** INR (₹)  
**Primary Aesthetic:** Warm Ivory (`#FAF2E8`), Champagne Beige (`#F3E2CF`), Antique Gold (`#B58A4D`), Deep Burgundy (`#641B24`), Pure Pearl White (`#FFFDF9`), Soft Blush (`#E8C7B6`), Emerald (`#1C5237`).

---

## 1. Unified Architecture Overview

BeadsBliss integrates three distinct operational domains over a single shared database, jewellery geometry engine, and business logic layer:

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    BeadsBliss Platform                  │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
        ┌──────────────────────────────────────────────────┼──────────────────────────────────────────────────┐
        │                                                  │                                                  │
        ▼                                                  ▼                                                  ▼
┌───────────────────────────┐            ┌───────────────────────────────────┐              ┌───────────────────────────────────┐
│   Customer Storefront     │            │    Administration Platform        │              │    Artisan / Karigar Portal       │
│  - Luxury Editorial Home  │            │   - 3D Asset Studio & Inspection  │              │   - Mobile-First Workshop UI      │
│  - Collections Catalog    │            │   - Anchor & Placement Editor     │              │   - Bill of Materials (BOM)       │
│  - 6-Step 3D Customizer   │            │   - Pricing & Labour Rules        │              │   - Assembly Step-by-Step Spec    │
│  - Saved Designs & Share  │            │   - Shared Designer Simulator     │              │   - Progress Photo Uploads        │
│  - Cart & Razorpay Pay    │            │   - Inventory Reconciliation      │              │   - 10-Point QC Certification     │
│  - Live Order Tracking    │            │   - Order & Karigar Dispatch      │              │   - Dispatch Readiness Signoff    │
└─────────────┬─────────────┘            └─────────────────┬─────────────────┘              └─────────────────┬─────────────────┘
              │                                            │                                                  │
              └────────────────────────────────────────────┼──────────────────────────────────────────────────┘
                                                           │
                                                           ▼
                                      ┌─────────────────────────────────────────┐
                                      │        Parametric Jewellery Engine      │
                                      │  - Bezier / Catmull-Rom Curve Draping   │
                                      │  - Instanced Bead Geometry (Pearls/Gems)│
                                      │  - Symmetrical Anchor Placement Engine  │
                                      │  - Multi-Loop Connector Bridge Math     │
                                      │  - Physical Collision & Feasibility     │
                                      │  - Dynamic Rule-Based Pricing Engine    │
                                      └────────────────────┬────────────────────┘
                                                           │
                                                           ▼
                                      ┌─────────────────────────────────────────┐
                                      │           Prisma Relational DB          │
                                      │   (SQLite / MySQL / Postgres Ready)     │
                                      └─────────────────────────────────────────┘
```

---

## 2. Technology Stack Selection & Rationale

| Layer | Technology | Rationale & Architectural Choice |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 App Router + React 18 | Unified full-stack React framework with SSR for SEO collections and rich client interactivity for 3D Customizer. |
| **Language** | TypeScript (Strict mode) | Type safety across 3D vector coordinates, necklace configuration trees, pricing structures, and database records. |
| **Styling** | Tailwind CSS + Custom Design System | Handcrafted luxury palette (`atelier.bg`, `atelier.gold`, `atelier.burgundy`) with Cinzel & Cormorant Garamond typography. |
| **3D Engine** | Three.js + React Three Fiber + Drei | Hardware-accelerated WebGL rendering with PBR metallic nacre shaders, instanced mesh rendering for 500+ beads at 60fps. |
| **Database ORM** | Prisma Client | Normalized relational data access, schema validation, transaction safety, and instant multi-database compatibility. |
| **Asset Pipeline** | Python 3 + Pillow | Automatic multi-view cropping, dimension calibration, texture compression, and inspection package preparation. |
| **Payment** | Razorpay Gateway (Test Mode) | Server-side order creation, HMAC-SHA256 signature verification, and idempotent webhook handling. |

---

## 3. Directory & Codebase Layout

```text
c:\xampp\htdocs\Craftsmanship\
├── prisma/
│   ├── schema.prisma               # Complete normalized database schema
│   └── dev.db                      # SQLite transactional database
├── public/
│   └── assets/                     # Real extracted jewellery photographs & references
│       ├── pendant/                # Lakshmi Temple multi-angle photography
│       ├── strands/                # 8 hanging strands & micro-textures
│       ├── connectors/             # Kundan 5-loop bars, brooches & assemblies
│       ├── accents/                # Gold nakshi balls, carved spacers & gemstones
│       ├── finishing/              # S-hooks, screw clasps, silk thread skeins
│       └── reference/              # Full customizer mockup & finished necklace busts
├── scripts/
│   ├── process_assets.py           # High-resolution image segmentation & asset preparation
│   └── seed.mjs                    # Database seeder with authentic components & sample orders
├── src/
│   ├── app/
│   │   ├── api/                    # REST APIs for designs, cart, orders, assets, karigar
│   │   ├── design-your-necklace/   # The signature Six-Step 3D Customizer Studio
│   │   ├── collections/            # Editorial collections catalog & filters
│   │   ├── products/[id]/          # Detailed product view with multi-angle gallery
│   │   ├── cart/                   # Shopping bag with design snapshot inspection
│   │   ├── checkout/               # Razorpay checkout & address form
│   │   ├── account/                # Customer profile, saved designs & order history
│   │   ├── admin/                  # Business & 3D Asset Administration suite
│   │   ├── atelier/karigar/        # Artisan manufacturing & QC workspace
│   │   ├── craftsmanship/          # Brand story & karigar heritage editorial
│   │   ├── page.tsx                # Luxury editorial homepage
│   │   └── layout.tsx              # Root layout with bespoke header & navigation
│   ├── components/
│   │   ├── 3d/                     # Three.js Canvas, NecklaceScene, BustMannequin, StrandCurve
│   │   ├── customizer/             # Six-step panels, StrandHangingSelector, ConnectorPanel
│   │   ├── admin/                  # Asset uploader, placement gizmo, inventory table
│   │   ├── karigar/                # Printable BOM generator, status updater, QC form
│   │   └── ui/                     # Luxury buttons, badges, modals, sliders, price breakdowns
│   └── lib/
│       ├── db.ts                   # Prisma singleton instance
│       ├── jewellery-engine/       # Parametric curve calculations & bead spacing
│       ├── placement-engine/       # Multi-strand connector & brooch placement logic
│       ├── pricing-engine.ts       # Transparent rule-based pricing calculator
│       └── types.ts                # TypeScript interfaces for all bespoke components
└── package.json
```
