# BeadsBliss — Administration Platform Guide

## 1. Role-Based Access Control

The BeadsBliss administrative portal (`/admin`) enforces strict role-based authorization:

| Role | Permissions & Operational Scope |
| :--- | :--- |
| **SUPER_ADMIN** | Full system authority: user management, financial audits, configuration overrides, secret management. |
| **CATALOG_MANAGER** | Product CRUD, category sorting, stock updates, marketing collections curation. |
| **3D_ASSET_MANAGER** | 3D models and multi-view photo uploads, anchor definitions, dimensional validation, approval. |
| **PRICING_MANAGER** | Labour rates, stringing charges, connector assembly rates, tax rules, discount coupons. |
| **PRODUCTION_MANAGER**| Karigar job assignments, workshop order flow, stock reservation, BOM oversight. |
| **QUALITY_INSPECTOR**| 10-point QC audits, rework requests, final dispatch approvals. |

---

## 2. Key Administrative Workflows

### 2.1 Product & Component Management (`/admin/products`)
- Create new bespoke components (Pendants, Strands, Connectors, Side Brooches, Clasps, Accents).
- Enter calibrated dimensions (mm), weight (grams), metal composition, and gemstone types.
- Link products to approved 3D assets.

### 2.2 3D Asset Studio (`/admin/assets-3d`)
- Ingest multi-view reference sets (front, back, side, angle, details).
- Visual 3D inspector with 360-degree rotation, lighting presets, and dimension inspection.
- Lifecycle state transitions (`DRAFT` ➔ `UNDER_REVIEW` ➔ `APPROVED` ➔ `PUBLISHED`).

### 2.3 Visual Placement & Anchor Editor (`/admin/placement-editor`)
- Interactive bust scene to test component attachment.
- Define anchor positions ($X, Y, Z$) and supported strand counts.
- Test compatibility across 1, 2, 3, 4, and 5-strand configurations.

### 2.4 Pricing & Labour Engine Administration (`/admin/pricing`)
- Manage base stringing rates per strand (e.g. ₹150).
- Manage connector pair assembly rates (e.g. ₹200).
- Manage central pendant mounting charges (e.g. ₹350).
- Configure GST rates (3%) and shipping rules.

### 2.5 Shared Designer Simulator (`/admin/simulator`)
- Runs the identical Six-Step Jewellery Engine as the customer studio.
- Allows admins to test unpublished or staging components before releasing them to customers.
- Simulates real-time pricing recalculations and manufacturing feasibility flags.

### 2.6 Order & Production Dispatch (`/admin/orders`)
- Real-time order queue with live Razorpay payment status.
- Generate Karigar Manufacturing Jobs and dispatch to the artisan workshop.
