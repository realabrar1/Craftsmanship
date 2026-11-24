import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Beginning BeadsBliss atelier seed...");

  // Clean old records
  await prisma.auditLog.deleteMany({});
  await prisma.qualityCheck.deleteMany({});
  await prisma.artisanJob.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.necklaceDesign.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.component3DAsset.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.pricingRule.deleteMany({});
  await prisma.inventoryMovement.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Atelier Director & Chief Curator",
      email: "admin@beadsbliss.com",
      passwordHash: "Atelier@2026",
      role: "SUPER_ADMIN",
      phone: "+91 98401 22334",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "Atelier Suite 4, Rutland Gate 5th Street, Nungambakkam",
      pincode: "600006",
    },
  });

  const karigarUser = await prisma.user.create({
    data: {
      name: "Master Karigar Ramesh Chander",
      email: "ramesh.karigar@beadsbliss.com",
      passwordHash: "Karigar@2026",
      role: "KARIGAR",
      phone: "+91 94440 88219",
      city: "Hyderabad",
      state: "Telangana",
      address: "Karigar Karkhana, Charminar Jewellers Guild",
      pincode: "500002",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Sunita Sharma",
      email: "sunita.sharma@example.com",
      passwordHash: "Customer@2026",
      role: "CUSTOMER",
      phone: "+91 98200 44556",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Penthouse 12B, Altamount Road",
      pincode: "400026",
    },
  });

  // 2. Categories
  const categoriesData = [
    { name: "Pearl Necklaces", slug: "pearl-necklaces", description: "Lustrous freshwater and natural pearls strung by master artisans.", displayOrder: 1 },
    { name: "Moti Haar", slug: "moti-haar", description: "Regal multilayered pearl haars with heritage pendants and Kundan brooches.", displayOrder: 2 },
    { name: "Multi-Strand Necklaces", slug: "multi-strand-necklaces", description: "Bespoke 3 to 7 strand layered creations bridging traditional elegance.", displayOrder: 3 },
    { name: "Temple Jewellery", slug: "temple-jewellery", description: "Hand-carved Nakshi temple motifs depicting Lakshmi, Ganesha, and holy lotuses.", displayOrder: 4 },
    { name: "Kundan Jewellery", slug: "kundan-jewellery", description: "Authentic Jadau Kundan with foil-backed uncut stones and Meenakari craftsmanship.", displayOrder: 5 },
    { name: "Gemstone Necklaces", slug: "gemstone-necklaces", description: "Precious pigeon-blood rubies, Zambian emeralds, and imperial jade beads.", displayOrder: 6 },
    { name: "Bridal Heirlooms", slug: "bridal-heirlooms", description: "Show-stopping royal bridal necklaces custom commissioned for special weddings.", displayOrder: 7 },
    { name: "Custom Creations", slug: "custom-creations", description: "Unique creations designed in our interactive 3D studio.", displayOrder: 8 },
  ];

  const catMap = {};
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c });
    catMap[c.slug] = created.id;
  }

  // 3. 3D Assets & Products
  // Pendants
  const lakshmiAsset = await prisma.component3DAsset.create({
    data: {
      sku: "PEN-LAKSHMI-01",
      name: "Lakshmi Kemp Temple Pendant with Pearl Drops",
      type: "PENDANT",
      categorySubtype: "Lakshmi Temple",
      status: "APPROVED",
      version: 1,
      previewImageUrl: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
      referencePhotosJson: JSON.stringify({
        front: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
        back: "/assets/pendant/lakshmi-temple-pendant-back.jpg",
        sideLeft: "/assets/pendant/lakshmi-temple-pendant-side-left.jpg",
        sideRight: "/assets/pendant/lakshmi-temple-pendant-side-right.jpg",
        angle: "/assets/pendant/lakshmi-temple-pendant-angle.jpg",
        detail: "/assets/pendant/lakshmi-temple-pendant-detail.jpg",
        loop: "/assets/pendant/lakshmi-temple-pendant-loop.jpg",
      }),
      dimensionsMm: JSON.stringify({ width: 55, height: 70, depth: 12 }),
      weightGrams: 38.5,
      metalType: "Antique 22k Gold Nakshi Finish",
      stoneType: "Uncut Kemp Rubies, Emeralds & Natural Pearl Drops",
      attachmentPointsJson: JSON.stringify([
        {
          id: "top-loop-main",
          name: "Center Top Loop",
          type: "TOP_LOOP",
          position: [0, 32, 0],
          supportedStrandCounts: [1, 2, 3, 4, 5],
          mechanism: "loop",
          innerDiameterMm: 4.5,
        },
      ]),
      compatibilityRulesJson: JSON.stringify({
        minLayers: 1,
        maxLayers: 5,
        allowedStrandTypes: ["ALL"],
        requiresCenterAlignment: true,
      }),
      pbrSettingsJson: JSON.stringify({
        metalness: 0.88,
        roughness: 0.28,
        color: "#C59B4B",
        bumpScale: 0.05,
      }),
    },
  });

  await prisma.product.create({
    data: {
      sku: "PEN-LAKSHMI-01",
      name: "Lakshmi Kemp Temple Pendant with Pearl Drops",
      slug: "lakshmi-kemp-temple-pendant",
      categoryId: catMap["temple-jewellery"],
      description: "Magnificent hand-carved Nakshi Lakshmi pendant bordered by radiant kemp rubies, emeralds, and clustered freshwater pearl drops. Features a reinforced antique top loop designed for multi-strand stringing.",
      material: "22k Gold Plated Silver Alloy (Panchaloha Base)",
      purity: "92.5 Silver with 24k Pure Gold Dip",
      gemstones: "Natural Kemp Rubies, Emeralds, Freshwater Rice Pearls",
      grossWeightGm: 38.5,
      netGoldGm: 4.8,
      dimensionsMm: JSON.stringify({ width: 55, height: 70, depth: 12 }),
      basePrice: 14500,
      makingCharges: 2800,
      stockQuantity: 15,
      isCustomizable: true,
      status: "PUBLISHED",
      imagesJson: JSON.stringify([
        "/assets/pendant/lakshmi-temple-pendant-front.jpg",
        "/assets/pendant/lakshmi-temple-pendant-angle.jpg",
        "/assets/pendant/lakshmi-temple-pendant-back.jpg",
        "/assets/pendant/lakshmi-temple-pendant-detail.jpg",
      ]),
      threeDAssetId: lakshmiAsset.id,
    },
  });

  // Strands
  const strandsList = [
    {
      sku: "STR-PINK-01",
      name: "Pink Freshwater Pearls (AAA Grade, 5.5mm)",
      subtype: "Freshwater Pearl",
      previewImageUrl: "/assets/strands/pink-freshwater-pearls.jpg",
      dimensions: { beadDiameter: 5.5, strandLengthInches: 20, beadCount: 86 },
      price: 900,
      color: "#E8BDB5",
      material: "Freshwater Cultured Pearls",
      pbr: { metalness: 0.05, roughness: 0.22, color: "#E8BDB5", iridescence: 0.8 },
    },
    {
      sku: "STR-WHITE-02",
      name: "Ivory White Freshwater Pearls (AAA Grade, 6mm)",
      subtype: "Freshwater Pearl",
      previewImageUrl: "/assets/strands/white-freshwater-pearls.jpg",
      dimensions: { beadDiameter: 6.0, strandLengthInches: 20, beadCount: 80 },
      price: 850,
      color: "#FAF5ED",
      material: "Freshwater Cultured Pearls",
      pbr: { metalness: 0.05, roughness: 0.20, color: "#FFFDF9", iridescence: 0.9 },
    },
    {
      sku: "STR-RICE-03",
      name: "Natural Rice Moti Strands (3x5mm)",
      subtype: "Rice Pearl",
      previewImageUrl: "/assets/strands/rice-pearls.jpg",
      dimensions: { beadDiameter: 4.2, strandLengthInches: 20, beadCount: 105 },
      price: 750,
      color: "#F3EDE2",
      material: "Natural Rice Pearl",
      pbr: { metalness: 0.04, roughness: 0.24, color: "#F7EFE3", iridescence: 0.75 },
    },
    {
      sku: "STR-CHAMP-04",
      name: "Champagne Golden Pearls (7mm)",
      subtype: "Golden Pearl",
      previewImageUrl: "/assets/strands/champagne-pearls.jpg",
      dimensions: { beadDiameter: 7.0, strandLengthInches: 20, beadCount: 72 },
      price: 1100,
      color: "#DFBA83",
      material: "Lustrous Champagne Pearls",
      pbr: { metalness: 0.12, roughness: 0.18, color: "#DDB880", iridescence: 0.85 },
    },
    {
      sku: "STR-RUBY-05",
      name: "Faceted Pigeon-Blood Ruby Beads (4.5mm)",
      subtype: "Precious Gemstone",
      previewImageUrl: "/assets/strands/faceted-ruby.jpg",
      dimensions: { beadDiameter: 4.5, strandLengthInches: 18, beadCount: 96 },
      price: 1800,
      color: "#8B1229",
      material: "Natural Hydrothermal Ruby Beads",
      pbr: { metalness: 0.10, roughness: 0.12, color: "#92132F", transmission: 0.6 },
    },
    {
      sku: "STR-EMERALD-06",
      name: "Faceted Zambian Emerald Beads (4.5mm)",
      subtype: "Precious Gemstone",
      previewImageUrl: "/assets/strands/faceted-emerald.jpg",
      dimensions: { beadDiameter: 4.5, strandLengthInches: 18, beadCount: 96 },
      price: 2200,
      color: "#0F5938",
      material: "Natural Zambian Emerald Beads",
      pbr: { metalness: 0.10, roughness: 0.12, color: "#11603D", transmission: 0.6 },
    },
    {
      sku: "STR-JADE-07",
      name: "Carved Imperial Green Jade Ovals (8x12mm)",
      subtype: "Precious Gemstone",
      previewImageUrl: "/assets/strands/oval-jade.jpg",
      dimensions: { beadDiameter: 8.0, strandLengthInches: 18, beadCount: 42 },
      price: 1400,
      color: "#2C6949",
      material: "Imperial Green Jade",
      pbr: { metalness: 0.05, roughness: 0.25, color: "#2B6848", transmission: 0.4 },
    },
    {
      sku: "STR-GOLD-NAKSHI-08",
      name: "Gold Nakshi Beads & Pearl Alternating Strand",
      subtype: "Traditional Strand",
      previewImageUrl: "/assets/strands/gold-nakshi-pearl.jpg",
      dimensions: { beadDiameter: 6.0, strandLengthInches: 20, beadCount: 78 },
      price: 2600,
      color: "#D4AF37",
      material: "22k Gold Nakshi Beads & Pearls",
      pbr: { metalness: 0.85, roughness: 0.30, color: "#C69E4C" },
    },
  ];

  for (const s of strandsList) {
    const sAsset = await prisma.component3DAsset.create({
      data: {
        sku: s.sku,
        name: s.name,
        type: "STRAND",
        categorySubtype: s.subtype,
        status: "APPROVED",
        version: 1,
        previewImageUrl: s.previewImageUrl,
        referencePhotosJson: JSON.stringify({ detail: s.previewImageUrl }),
        dimensionsMm: JSON.stringify(s.dimensions),
        metalType: s.subtype.includes("Gold") ? "22k Gold Dip" : "None",
        stoneType: s.material,
        attachmentPointsJson: JSON.stringify([
          { id: "front-center-end", position: [0, 0, 0] },
          { id: "rear-clasp-end", position: [0, 150, -50] },
        ]),
        compatibilityRulesJson: JSON.stringify({ strandCountMax: 5 }),
        pbrSettingsJson: JSON.stringify(s.pbr),
      },
    });

    await prisma.product.create({
      data: {
        sku: s.sku,
        name: s.name,
        slug: s.sku.toLowerCase(),
        categoryId: catMap["pearl-necklaces"],
        description: `Premium hand-selected ${s.name} crafted for bespoke layered necklaces. Drilled with micro-precision for resham silk thread.`,
        material: s.material,
        dimensionsMm: JSON.stringify(s.dimensions),
        basePrice: s.price,
        makingCharges: 150,
        stockQuantity: 150,
        isCustomizable: true,
        status: "PUBLISHED",
        imagesJson: JSON.stringify([s.previewImageUrl, "/assets/strands/hanging-rack-full.jpg"]),
        threeDAssetId: sAsset.id,
      },
    });
  }

  // Connectors & Brooches
  const connectorAssets = [
    {
      sku: "CON-RECT-01",
      name: "Kundan 5-Strand Rectangular Connector Bars (Pair)",
      type: "CONNECTOR",
      subtype: "Kundan Bars",
      price: 2000,
      making: 400,
      preview: "/assets/connectors/kundan-5loop-bar-front.jpg",
      photos: {
        front: "/assets/connectors/kundan-5loop-bar-front.jpg",
        back: "/assets/connectors/kundan-5loop-bar-back.jpg",
        side: "/assets/connectors/kundan-5loop-bar-side1.jpg",
        angle: "/assets/connectors/kundan-5loop-bar-angle.jpg",
        stones: "/assets/connectors/kundan-5loop-bar-stones.jpg",
        assembly: "/assets/connectors/connector-5strand-assembly.jpg",
      },
      dimensions: { width: 32, height: 8, depth: 4.5, loopSpacing: 4.2 },
      supportedStrands: 5,
    },
    {
      sku: "BRC-FLORAL-RUBY-02",
      name: "Floral Kundan & Kemp Ruby Side Brooch (Pair)",
      type: "SIDE_BROOCH",
      subtype: "Side Brooches",
      price: 2800,
      making: 500,
      preview: "/assets/connectors/floral-ruby-brooch.jpg",
      photos: {
        front: "/assets/connectors/floral-ruby-brooch.jpg",
        back: "/assets/connectors/floral-ruby-brooch-back.jpg",
      },
      dimensions: { width: 26, height: 26, depth: 6 },
      supportedStrands: 5,
    },
    {
      sku: "BRC-LAKSHMI-RD-03",
      name: "Round Lakshmi Temple Motif Brooch (Pair)",
      type: "TEMPLE_BUTTI",
      subtype: "Temple Buttis",
      price: 2400,
      making: 450,
      preview: "/assets/connectors/round-lakshmi-brooch.jpg",
      photos: {
        front: "/assets/connectors/round-lakshmi-brooch.jpg",
        back: "/assets/connectors/round-lakshmi-brooch-back.jpg",
      },
      dimensions: { width: 28, height: 28, depth: 5 },
      supportedStrands: 5,
    },
    {
      sku: "BRC-PEACOCK-04",
      name: "Royal Meenakari Peacock Side Brooch (Pair)",
      type: "SIDE_BROOCH",
      subtype: "Side Brooches",
      price: 3200,
      making: 600,
      preview: "/assets/connectors/peacock-enamel-brooch.jpg",
      photos: {
        front: "/assets/connectors/peacock-enamel-brooch.jpg",
        back: "/assets/connectors/peacock-enamel-brooch-back.jpg",
      },
      dimensions: { width: 30, height: 24, depth: 5.5 },
      supportedStrands: 4,
    },
    {
      sku: "BRC-TEARDROP-05",
      name: "Teardrop Lakshmi Kemp Motif Brooch (Pair)",
      type: "TEMPLE_BUTTI",
      subtype: "Temple Buttis",
      price: 2600,
      making: 500,
      preview: "/assets/connectors/teardrop-lakshmi-brooch.jpg",
      photos: {
        front: "/assets/connectors/teardrop-lakshmi-brooch.jpg",
        back: "/assets/connectors/teardrop-lakshmi-brooch-back.jpg",
      },
      dimensions: { width: 24, height: 32, depth: 5.5 },
      supportedStrands: 5,
    },
    {
      sku: "CON-PEARL-EDGE-06",
      name: "Pearl-Edged Kundan Multi-Strand Bar (Pair)",
      type: "CONNECTOR",
      subtype: "Kundan Bars",
      price: 2400,
      making: 450,
      preview: "/assets/connectors/pearl-edged-kundan-bar.jpg",
      photos: {
        front: "/assets/connectors/pearl-edged-kundan-bar.jpg",
        back: "/assets/connectors/pearl-edged-kundan-bar-back.jpg",
      },
      dimensions: { width: 34, height: 10, depth: 5 },
      supportedStrands: 5,
    },
  ];

  for (const c of connectorAssets) {
    const cAsset = await prisma.component3DAsset.create({
      data: {
        sku: c.sku,
        name: c.name,
        type: c.type,
        categorySubtype: c.subtype,
        status: "APPROVED",
        version: 1,
        previewImageUrl: c.preview,
        referencePhotosJson: JSON.stringify(c.photos),
        dimensionsMm: JSON.stringify(c.dimensions),
        metalType: "22k Gold Finish Jadau",
        stoneType: "Jadau Kundan, Kemp Stones",
        attachmentPointsJson: JSON.stringify([
          { id: "top-loops", count: c.supportedStrands, mechanism: "loop_bridge" },
          { id: "bottom-loops", count: c.supportedStrands, mechanism: "loop_bridge" },
        ]),
        compatibilityRulesJson: JSON.stringify({ maxConnectedStrands: c.supportedStrands }),
        pbrSettingsJson: JSON.stringify({ metalness: 0.9, roughness: 0.25, color: "#D4AF37" }),
      },
    });

    await prisma.product.create({
      data: {
        sku: c.sku,
        name: c.name,
        slug: c.sku.toLowerCase(),
        categoryId: catMap["kundan-jewellery"],
        description: `Authentic ${c.name} engineered for multi-strand pearl haars. Rear loops guarantee stable alignment without strand twisting.`,
        material: "22k Gold Finished Silver & Kundan",
        dimensionsMm: JSON.stringify(c.dimensions),
        basePrice: c.price,
        makingCharges: c.making,
        stockQuantity: 40,
        isCustomizable: true,
        status: "PUBLISHED",
        imagesJson: JSON.stringify([c.preview, ...(c.photos.back ? [c.photos.back] : [])]),
        threeDAssetId: cAsset.id,
      },
    });
  }

  // Accents & Spacers
  const accentAssets = [
    { sku: "ACC-GOLD-NAKSHI-01", name: "22k Gold Nakshi Balls (Set of 10)", price: 600, preview: "/assets/accents/gold-nakshi-ball.jpg" },
    { sku: "ACC-PEARL-ROUND-02", name: "High-Lustre Round Pearl Accents (Set of 10)", price: 400, preview: "/assets/accents/round-pearl-accent.jpg" },
    { sku: "ACC-RUBY-ACCENT-03", name: "Faceted Ruby Separators (Set of 10)", price: 800, preview: "/assets/accents/faceted-ruby-accent.jpg" },
    { sku: "ACC-EMERALD-ACCENT-04", name: "Faceted Emerald Separators (Set of 10)", price: 900, preview: "/assets/accents/faceted-emerald-accent.jpg" },
    { sku: "ACC-GOLD-CYLINDER-05", name: "Carved Gold Cylinder Beads (Set of 10)", price: 750, preview: "/assets/accents/carved-gold-cylinder.jpg" },
    { sku: "ACC-FLOWER-SPACER-06", name: "Carved Gold Flower Spacers (Set of 10)", price: 500, preview: "/assets/accents/gold-flower-spacer.jpg" },
    { sku: "ACC-KUNDAN-BEAD-07", name: "Round Kundan Gem Beads (Set of 4)", price: 950, preview: "/assets/accents/round-kundan-bead.jpg" },
    { sku: "ACC-MELON-GOLD-08", name: "Corrugated Gold Melon Beads (Set of 10)", price: 650, preview: "/assets/accents/corrugated-melon-gold.jpg" },
  ];

  for (const a of accentAssets) {
    const aAsset = await prisma.component3DAsset.create({
      data: {
        sku: a.sku,
        name: a.name,
        type: "SPACER_BEAD",
        categorySubtype: "Accent Beads",
        status: "APPROVED",
        version: 1,
        previewImageUrl: a.preview,
        referencePhotosJson: JSON.stringify({ front: a.preview }),
        dimensionsMm: JSON.stringify({ diameter: 5.0 }),
        metalType: "22k Gold Plated",
        stoneType: a.name.includes("Pearl") ? "Freshwater Pearl" : "Gold Accent",
        attachmentPointsJson: JSON.stringify([{ id: "center-hole", diameter: 0.8 }]),
        compatibilityRulesJson: JSON.stringify({ allStrands: true }),
        pbrSettingsJson: JSON.stringify({ metalness: 0.88, roughness: 0.28, color: "#D4AF37" }),
      },
    });

    await prisma.product.create({
      data: {
        sku: a.sku,
        name: a.name,
        slug: a.sku.toLowerCase(),
        categoryId: catMap["custom-creations"],
        description: `Delicate ${a.name} to introduce rhythm and traditional grandeur between pearl groupings.`,
        material: "22k Gold Plated Brass & Silver",
        dimensionsMm: JSON.stringify({ diameter: 5.0 }),
        basePrice: a.price,
        makingCharges: 100,
        stockQuantity: 100,
        isCustomizable: true,
        status: "PUBLISHED",
        imagesJson: JSON.stringify([a.preview]),
        threeDAssetId: aAsset.id,
      },
    });
  }

  // Finishing & Closures
  const closures = [
    { sku: "CLS-S-HOOK-01", name: "Traditional Antique Gold S-Hook Clasp with Extension", price: 450, preview: "/assets/finishing/s-hook-clasp.jpg" },
    { sku: "CLS-SCREW-CYL-02", name: "Carved Temple Screw Cylinder Clasp", price: 750, preview: "/assets/finishing/screw-cylinder-clasp.jpg" },
    { sku: "CLS-CHAIN-03", name: "Heavy Link Antique Extension Chain with Ball Drop", price: 550, preview: "/assets/finishing/extension-chain-clasp.jpg" },
    { sku: "CLS-TASSEL-04", name: "Artisan Resham Silk Tassel with Pearl Cluster", price: 650, preview: "/assets/finishing/tassel-pearl-cord.jpg" },
  ];

  for (const c of closures) {
    const cAsset = await prisma.component3DAsset.create({
      data: {
        sku: c.sku,
        name: c.name,
        type: "CLASP",
        categorySubtype: "Clasps & Closures",
        status: "APPROVED",
        version: 1,
        previewImageUrl: c.preview,
        referencePhotosJson: JSON.stringify({ front: c.preview }),
        dimensionsMm: JSON.stringify({ length: 30, width: 12 }),
        attachmentPointsJson: JSON.stringify([{ id: "clasp-loop", count: 5 }]),
        compatibilityRulesJson: JSON.stringify({ maxLayers: 5 }),
        pbrSettingsJson: JSON.stringify({ metalness: 0.9, roughness: 0.25, color: "#D4AF37" }),
      },
    });

    await prisma.product.create({
      data: {
        sku: c.sku,
        name: c.name,
        slug: c.sku.toLowerCase(),
        categoryId: catMap["custom-creations"],
        description: `High-security ${c.name} crafted for multi-strand heirloom necklaces.`,
        material: "22k Antique Gold Finish",
        basePrice: c.price,
        makingCharges: 150,
        stockQuantity: 80,
        isCustomizable: true,
        status: "PUBLISHED",
        imagesJson: JSON.stringify([c.preview]),
        threeDAssetId: cAsset.id,
      },
    });
  }

  // 4. Pricing Rules
  const pricingRulesData = [
    { ruleKey: "STRINGING_PER_STRAND", name: "Artisan Silk Stringing per Strand", chargeType: "PER_STRAND", amountInr: 150, description: "Hand-knotting with resham silk thread" },
    { ruleKey: "CONNECTOR_MOUNTING_PAIR", name: "Multi-Strand Connector Bar Alignment (Per Pair)", chargeType: "PER_PAIR", amountInr: 200, description: "Alignment through individual connector loops" },
    { ruleKey: "PENDANT_ATTACHMENT", name: "Center Pendant Reinforcement Mounting", chargeType: "FIXED", amountInr: 350, description: "Direct central mounting and loop knotting" },
    { ruleKey: "SIDE_BROOCH_PAIR", name: "Side Brooch Rear Bridge Attachment (Per Pair)", chargeType: "PER_PAIR", amountInr: 250, description: "Rear tube pass-through mounting" },
    { ruleKey: "QUALITY_ASSESSMENT_FEE", name: "Master Karigar Inspection & Hallmarking", chargeType: "FIXED", amountInr: 450, description: "10-point artisan verification and certification" },
    { ruleKey: "GST_TAX_PERCENT", name: "Goods and Services Tax (Jewellery)", chargeType: "PERCENTAGE", amountInr: 3.0, description: "3% GST on precious jewellery in India" },
  ];

  for (const pr of pricingRulesData) {
    await prisma.pricingRule.create({ data: pr });
  }

  // 5. Inventory Items
  const inventoryItemsData = [
    { sku: "PEN-LAKSHMI-01", name: "Lakshmi Kemp Temple Pendant", category: "PENDANT", stock: 12, cost: 10500, price: 14500 },
    { sku: "STR-PINK-01", name: "Pink Freshwater Pearls (5.5mm)", category: "STRAND", stock: 95, cost: 650, price: 900 },
    { sku: "STR-WHITE-02", name: "Ivory White Freshwater Pearls (6mm)", category: "STRAND", stock: 110, cost: 600, price: 850 },
    { sku: "CON-RECT-01", name: "Kundan 5-Strand Rectangular Connector Bars", category: "CONNECTOR", stock: 45, cost: 1400, price: 2000 },
    { sku: "BRC-FLORAL-RUBY-02", name: "Floral Kundan Side Brooch", category: "SIDE_BROOCH", stock: 28, cost: 1900, price: 2800 },
    { sku: "ACC-GOLD-NAKSHI-01", name: "22k Gold Nakshi Balls (Set of 10)", category: "SPACER_BEAD", stock: 75, cost: 400, price: 600 },
    { sku: "CLS-S-HOOK-01", name: "Traditional Antique Gold S-Hook Clasp", category: "CLASP", stock: 60, cost: 300, price: 450 },
  ];

  for (const inv of inventoryItemsData) {
    await prisma.inventoryItem.create({
      data: {
        sku: inv.sku,
        componentName: inv.name,
        category: inv.category,
        availableStock: inv.stock,
        reservedStock: 2,
        minThreshold: 5,
        unitOfMeasure: inv.category === "STRAND" ? "strands" : "pairs",
        supplierName: "Hyderabad Pearl Guild & Jaipur Jadau Atelier",
        unitCostInr: inv.cost,
        sellingPriceInr: inv.price,
      },
    });
  }

  // 6. Seed the EXACT Sample Custom Design from the user's reference mockup (Image 1)!
  // Pink freshwater pearls 5 strands = ₹4,500
  // Kundan connector bars 3 pairs = ₹6,000
  // Gold pearl accents = ₹1,200
  // Pendant (or base necklace structure) + Stringing & Making = Total ₹18,700!
  const mockDesign = await prisma.necklaceDesign.create({
    data: {
      designCode: "SM-BESPOKE-2026-9041",
      title: "Royal Panchlada Pink Pearl Haar with Kundan Bars",
      customerId: customerUser.id,
      layersCount: 5,
      layersConfigJson: JSON.stringify([
        { layerIndex: 0, strandSku: "STR-PINK-01", lengthInches: 17, dropCurveDepth: 1.0, beadDiameterMm: 5.5, beadColor: "#E8BDB5" },
        { layerIndex: 1, strandSku: "STR-PINK-01", lengthInches: 18.5, dropCurveDepth: 1.25, beadDiameterMm: 5.5, beadColor: "#E8BDB5" },
        { layerIndex: 2, strandSku: "STR-PINK-01", lengthInches: 20, dropCurveDepth: 1.5, beadDiameterMm: 5.5, beadColor: "#E8BDB5" },
        { layerIndex: 3, strandSku: "STR-PINK-01", lengthInches: 21.5, dropCurveDepth: 1.75, beadDiameterMm: 5.5, beadColor: "#E8BDB5" },
        { layerIndex: 4, strandSku: "STR-PINK-01", lengthInches: 23, dropCurveDepth: 2.0, beadDiameterMm: 5.5, beadColor: "#E8BDB5" },
      ]),
      pendantSku: null,
      connectorsConfigJson: JSON.stringify([
        {
          componentSku: "CON-RECT-01",
          type: "CONNECTOR",
          placement: "BOTH_SIDES",
          quantityPairs: 3,
          curvePositions: [0.28, 0.44, 0.60],
          connectedStrands: [0, 1, 2, 3, 4],
        },
      ]),
      accentsConfigJson: JSON.stringify({
        patternType: "UNIFORM",
        beadSku: "ACC-GOLD-NAKSHI-01",
        quantity: 20,
      }),
      finishingConfigJson: JSON.stringify({
        threadColor: "Soft Pink Resham Silk",
        claspSku: "CLS-S-HOOK-01",
        tasselType: "Pearl Cluster Clasp",
      }),
      pricingSnapshotJson: JSON.stringify({
        components: [
          { name: "Pink Freshwater Pearls (5 Strands)", quantity: 5, unitPrice: 900, total: 4500 },
          { name: "Kundan Connector Bars (3 Pairs)", quantity: 3, unitPrice: 2000, total: 6000 },
          { name: "Gold Pearl Accents (20 beads)", quantity: 2, unitPrice: 600, total: 1200 },
          { name: "Traditional Antique Gold S-Hook Clasp", quantity: 1, unitPrice: 450, total: 450 },
        ],
        componentSubtotal: 12150,
        craftsmanship: {
          stringingCharges: 750,      // 5 strands x 150
          connectorAssembly: 600,     // 3 pairs x 200
          finishingCharges: 450,
          qualityCertification: 450,
          totalLabour: 2250,
        },
        taxes: {
          gstRatePercent: 3,
          gstAmount: 432,
        },
        shipping: 0,
        estimatedTotalInr: 18700,
      }),
      previewSnapshotUrl: "/assets/reference/customizer-mockup-full.jpg",
      status: "SAVED",
    },
  });

  // 7. Seed an Active Order and Karigar Manufacturing Job for testing
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: "ORD-SM-2026-1049",
      customerId: customerUser.id,
      customerName: "Sunita Sharma",
      customerEmail: "sunita.sharma@example.com",
      customerPhone: "+91 98200 44556",
      shippingAddressJson: JSON.stringify({
        address: "Penthouse 12B, Altamount Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400026",
      }),
      billingAddressJson: JSON.stringify({
        address: "Penthouse 12B, Altamount Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400026",
      }),
      designId: mockDesign.id,
      subtotal: 14400,
      makingCharges: 3855,
      taxGst: 445,
      grandTotal: 18700,
      paymentStatus: "PAID",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: "order_Qz891Jkd9A120",
      razorpayPaymentId: "pay_Kx9183491028",
      orderStatus: "IN_PRODUCTION",
      notes: "Client requested soft blush silk thread to match bridal trousseau.",
    },
  });

  const sampleJob = await prisma.artisanJob.create({
    data: {
      jobCode: "KRG-JOB-4081",
      orderId: sampleOrder.id,
      designId: mockDesign.id,
      assignedKarigarId: karigarUser.id,
      karigarName: "Master Karigar Ramesh Chander",
      status: "STRINGING",
      priority: "HIGH",
      targetCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      bomJson: JSON.stringify({
        materials: [
          { sku: "STR-PINK-01", name: "Pink Freshwater Pearls (AAA, 5.5mm)", quantity: "5 strands (approx 430 pearls)", checked: true },
          { sku: "CON-RECT-01", name: "Kundan 5-Strand Rectangular Connector Bars", quantity: "3 pairs (6 pieces)", checked: true },
          { sku: "ACC-GOLD-NAKSHI-01", name: "22k Gold Nakshi Balls", quantity: "20 pieces", checked: true },
          { sku: "CLS-S-HOOK-01", name: "Traditional Antique Gold S-Hook Clasp", quantity: "1 unit", checked: true },
          { sku: "THRD-SILK-PINK", name: "Blush Pink Resham Silk Thread", quantity: "15 meters", checked: true },
        ],
        specifications: {
          layers: 5,
          lengthsInches: [17, 18.5, 20, 21.5, 23],
          connectorPositionsPercent: [28, 44, 60],
          knottingTechnique: "Double resham silk knot between gold nakshi beads",
          finishing: "Reinforced antique loop with extension links",
        },
      }),
      productionNotes: "Materials verified. Strands 1, 2, and 3 stringing completed with balanced curve draping. Proceeding to connector bridge 1 mounting.",
      productionPhotosJson: JSON.stringify([
        "/assets/connectors/connector-5strand-assembly.jpg",
      ]),
      karigarPayoutInr: 3500,
    },
  });

  console.log("Successfully seeded BeadsBliss database with authentic components, design SM-BESPOKE-2026-9041, order ORD-SM-2026-1049, and karigar job KRG-JOB-4081!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
