# BeadsBliss — Implementation Roadmap & Execution Plan

## Phase 1 — Foundation & Data Architecture (COMPLETED)
- [x] Inspect workspace and runtime environments (Node 24, npm 11, Python 3.14, Pillow).
- [x] Configure Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide icons, Three.js, React Three Fiber.
- [x] Segment and calibrate authentic high-resolution jewellery photographs into `public/assets/`.
- [x] Design normalized relational schema (`prisma/schema.prisma`).
- [x] Push database schema to SQLite `dev.db`.
- [x] Create and execute seed script `scripts/seed.mjs` with authentic Indian jewellery components.
- [x] Author comprehensive architecture and engineering documentation.

## Phase 2 — Core Parametric Jewellery & 3D WebGL Engine (IN PROGRESS)
- [ ] Parametric necklace curve generator (catenary/splines for 1-5 layers).
- [ ] Instanced bead rendering with PBR pearl nacre and metallic gold shaders.
- [ ] 3D Mannequin bust rendering with warm studio lighting and soft shadows.
- [ ] Multi-strand connector bar mounting engine bridging parallel strands.
- [ ] Side brooch rear bridge bar placement engine.
- [ ] Pendant central drop attachment engine.
- [ ] OrbitControls with camera view presets (Front, Side, Back, Close-up, Reset).

## Phase 3 — The Six-Step Bespoke Customer Customizer (`/design-your-necklace`)
- [ ] Step 1: Choose Pendant with instant 3D center attachment.
- [ ] Step 2: Hanging Strand Selector rack with vertical strand comparison.
- [ ] Step 3: Layer Arranger (1 to 5 concentric layers with drop separation).
- [ ] Step 4: Connectors & Motifs with placement controls (Both Sides, Left, Right, 1-3 pairs).
- [ ] Step 5: Bead Patterns, Spacers & Silk Thread finishing.
- [ ] Step 6: Review, 360° Inspection & Itemized Quotation.
- [ ] Design persistence (Save Design, Share Code, Restore).

## Phase 4 — Customer Storefront & E-Commerce Journey
- [ ] Luxury editorial homepage matching visual direction.
- [ ] Collections catalog with material, price, and category filters.
- [ ] Product detail pages with multi-view photography.
- [ ] Craftsmanship and karigar heritage pages.
- [ ] Shopping bag & persistent cart.
- [ ] Razorpay payment checkout with test mode server-side verification.
- [ ] Customer account dashboard & order tracking.

## Phase 5 — Administration Platform (`/admin`)
- [ ] Dashboard with real-time financial, order, and workshop KPIs.
- [ ] Product catalog management (CRUD, calibrated dimensions, stock).
- [ ] 3D Asset Studio (multi-view inspection, PBR adjustment, approval workflow).
- [ ] Visual Placement & Anchor Editor.
- [ ] Pricing Rules manager.
- [ ] Shared Designer Simulator.
- [ ] Order management and Karigar dispatch.

## Phase 6 — Artisan / Karigar Manufacturing Workspace (`/atelier/karigar`)
- [ ] Mobile-friendly workshop interface.
- [ ] Active manufacturing jobs queue.
- [ ] Printable Bill of Materials (BOM) & assembly specifications.
- [ ] Production progress photo upload.
- [ ] 10-point Quality Control audit checklist.

## Phase 7 — Verification & Automated Testing
- [ ] Pricing calculation unit tests.
- [ ] Geometry curve & loop alignment tests.
- [ ] End-to-end design-to-order-to-manufacturing flow verification.
