# BeadsBliss — Security, Integrity & Deployment Blueprint

## 1. Security Architecture

1. **Server-Side Price Validation:**
   - Client sends component IDs and selected quantities.
   - Pricing is ALWAYS calculated server-side using active `PricingRule` and component prices from the database.
   - Client-submitted prices are discarded and never trusted.

2. **Cryptographic Payment Integrity (Razorpay):**
   - Razorpay orders created server-side via authenticated API.
   - On completion, HMAC-SHA256 signature calculated:
     $$\text{Signature} = \text{HMAC-SHA256}\left(\text{order\_id} + "|" + \text{payment\_id},\; \text{key\_secret}\right)$$
   - Only matched signatures mark an order as `PAID`.

3. **Data Sanitization & Upload Security:**
   - Image uploads limited to `.jpg`, `.jpeg`, `.png`, `.webp` up to 10MB.
   - 3D models strictly validated for `.glb` / `.gltf` binary format and sanitized headers.
   - Multi-tenant isolation: customers can only view their own designs and orders.

4. **Immutable Design & Quotation Snapshots:**
   - Once an order is placed, `snapshotJson` freezes the exact component prices, asset versions, and assembly specifications.
   - Subsequent price changes or component revisions by administrators do not alter active orders.

---

## 2. Production Deployment Readiness

### Environment Configuration (`.env.production`):
```env
DATABASE_URL="file:./dev.db" # Or mysql://user:pass@localhost:3306/beadsbliss
NEXT_PUBLIC_APP_URL="https://beadsbliss.com"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_BeadsBlissKey2026"
RAZORPAY_KEY_SECRET="BeadsBlissSecretKey2026"
JWT_SECRET="BeadsBlissSuperSecretJwtKey2026Secure"
NODE_ENV="production"
```

### Build & Run Commands:
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Database schema synchronization
node node_modules/prisma/build/index.js db push

# 3. Seed demonstration data
node scripts/seed.mjs

# 4. Production Next.js build
npm run build

# 5. Production execution
npm run start
```
