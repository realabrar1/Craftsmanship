/**
 * SUTRA & MOTI — 3D JEWELLERY ASSET REGISTRY & PIPELINE
 * 
 * Central catalog of authentic 3D GLB/GLTF assets generated externally
 * via Tripo Studio, Blender, or photogrammetry scanning.
 * Defines dimensional calibration (mm), named attachment sockets,
 * PBR material configurations, and physical compatibility rules.
 */

export type JewelleryAssetCategory =
  | "pendants"
  | "necklaces"
  | "pearls"
  | "gemstones"
  | "connectors"
  | "brooches"
  | "buttis"
  | "clasps"
  | "mannequins"
  | "materials";

export type AssetApprovalStatus = "APPROVED" | "PENDING_REVIEW" | "REJECTED";

export interface SocketDefinition {
  name: string;
  position: [number, number, number]; // Local coordinates [x, y, z] in Three.js units (calibrated to mm)
  normal: [number, number, number];   // Outward-facing vector for strand alignment
  loopDiameterMm: number;             // Internal aperture size for thread/wire
  maxThreadThicknessMm: number;       // Maximum gauge supported
  layerIndex?: number;                // Associated strand layer (0 to N-1)
}

export interface JewelleryAssetMetadata {
  assetId: string;
  sku: string;
  displayName: string;
  category: JewelleryAssetCategory;
  glbPath: string;
  thumbnail: string;
  referencePhotos?: Record<string, string>;
  dimensionsMm: {
    width: number;
    height: number;
    depth: number;
  };
  weightGrams: number;
  materialInfo: {
    metalType: string;
    metalPurity: string;
    finish: string;
    stoneTypes: string[];
    gemstoneCut?: string;
  };
  sockets: Record<string, SocketDefinition>;
  compatibilityRules: {
    minStrands: number;
    maxStrands: number;
    supportedBeadDiametersMm: [number, number];
    requiresBailAdapter?: boolean;
  };
  pricing: {
    basePriceInr: number;
    makingChargesInr: number;
    gstRatePercent: number;
  };
  approvalStatus: AssetApprovalStatus;
  tripoStudioMetadata?: {
    modelId?: string;
    promptUsed?: string;
    meshResolution?: "low" | "medium" | "high";
    vertexCount?: number;
    faceCount?: number;
    generationDate?: string;
  };
}

/**
 * Built-in Master Registry of 3D Jewellery Assets
 */
export const ASSET_REGISTRY: Record<string, JewelleryAssetMetadata> = {
  "PEN-LAKSHMI-01": {
    assetId: "ast_pen_lakshmi_01",
    sku: "PEN-LAKSHMI-01",
    displayName: "Goddess Lakshmi Kemp Temple Pendant",
    category: "pendants",
    glbPath: "/assets/jewellery/pendants/lakshmi-temple-pendant.glb",
    thumbnail: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
    referencePhotos: {
      front: "/assets/pendant/lakshmi-temple-pendant-front.jpg",
      back: "/assets/pendant/lakshmi-temple-pendant-back.jpg",
      side: "/assets/pendant/lakshmi-temple-pendant-side.jpg",
      detail: "/assets/pendant/lakshmi-temple-pendant-detail.jpg",
    },
    dimensionsMm: {
      width: 68.0,
      height: 82.0,
      depth: 14.5,
    },
    weightGrams: 46.5,
    materialInfo: {
      metalType: "22K Antique Temple Gold",
      metalPurity: "916 Hallmark",
      finish: "Hand-brushed Micro-patina",
      stoneTypes: ["Natural Burmese Kemp Ruby", "Natural Zambian Emerald", "Kundan Rock Crystal"],
      gemstoneCut: "Cabochon Bezel Set",
    },
    sockets: {
      socket_bail_left: {
        name: "socket_bail_left",
        position: [-0.095, 0.285, 0.02],
        normal: [-0.2, 0.95, 0.15],
        loopDiameterMm: 3.2,
        maxThreadThicknessMm: 1.8,
        layerIndex: 4,
      },
      socket_bail_right: {
        name: "socket_bail_right",
        position: [0.095, 0.285, 0.02],
        normal: [0.2, 0.95, 0.15],
        loopDiameterMm: 3.2,
        maxThreadThicknessMm: 1.8,
        layerIndex: 4,
      },
      socket_center_top: {
        name: "socket_center_top",
        position: [0, 0.31, 0.01],
        normal: [0, 1.0, 0],
        loopDiameterMm: 4.0,
        maxThreadThicknessMm: 2.2,
      },
    },
    compatibilityRules: {
      minStrands: 3,
      maxStrands: 7,
      supportedBeadDiametersMm: [4.0, 9.0],
      requiresBailAdapter: false,
    },
    pricing: {
      basePriceInr: 14500,
      makingChargesInr: 3200,
      gstRatePercent: 3,
    },
    approvalStatus: "APPROVED",
    tripoStudioMetadata: {
      modelId: "tripo_lakshmi_padakkam_v2",
      promptUsed: "Intricate antique south Indian temple jewellery pendant of Goddess Lakshmi on lotus throne with Makara arch, kemp rubies, emeralds and dangling pearl jhumkas",
      meshResolution: "high",
      vertexCount: 18450,
      faceCount: 24800,
      generationDate: "2026-11-20",
    },
  },

  "CON-RECT-01": {
    assetId: "ast_con_rect_01",
    sku: "CON-RECT-01",
    displayName: "Kundan 5-Strand Spacer Bar",
    category: "connectors",
    glbPath: "/assets/jewellery/connectors/kundan-5loop-connector.glb",
    thumbnail: "/assets/connector/kundan-bar-front.jpg",
    referencePhotos: {
      front: "/assets/connector/kundan-bar-front.jpg",
      back: "/assets/connector/kundan-bar-back.jpg",
    },
    dimensionsMm: {
      width: 48.0,
      height: 12.0,
      depth: 6.5,
    },
    weightGrams: 14.2,
    materialInfo: {
      metalType: "22K Antique Yellow Gold Foil",
      metalPurity: "Kundan Setting 24K pure gold leaf",
      finish: "Meenakari reverse enamel",
      stoneTypes: ["Uncut Polki Diamond Crystal", "Kemp Green Emerald"],
    },
    sockets: {
      loop_01: {
        name: "loop_01",
        position: [-0.072, 0.0, 0.0],
        normal: [0, 1, 0],
        loopDiameterMm: 2.0,
        maxThreadThicknessMm: 1.2,
        layerIndex: 0,
      },
      loop_02: {
        name: "loop_02",
        position: [-0.036, 0.0, 0.0],
        normal: [0, 1, 0],
        loopDiameterMm: 2.0,
        maxThreadThicknessMm: 1.2,
        layerIndex: 1,
      },
      loop_03: {
        name: "loop_03",
        position: [0.0, 0.0, 0.0],
        normal: [0, 1, 0],
        loopDiameterMm: 2.0,
        maxThreadThicknessMm: 1.2,
        layerIndex: 2,
      },
      loop_04: {
        name: "loop_04",
        position: [0.036, 0.0, 0.0],
        normal: [0, 1, 0],
        loopDiameterMm: 2.0,
        maxThreadThicknessMm: 1.2,
        layerIndex: 3,
      },
      loop_05: {
        name: "loop_05",
        position: [0.072, 0.0, 0.0],
        normal: [0, 1, 0],
        loopDiameterMm: 2.0,
        maxThreadThicknessMm: 1.2,
        layerIndex: 4,
      },
    },
    compatibilityRules: {
      minStrands: 3,
      maxStrands: 5,
      supportedBeadDiametersMm: [4.5, 7.0],
    },
    pricing: {
      basePriceInr: 6000,
      makingChargesInr: 1200,
      gstRatePercent: 3,
    },
    approvalStatus: "APPROVED",
  },

  "BRC-FLORAL-RUBY-02": {
    assetId: "ast_brc_floral_02",
    sku: "BRC-FLORAL-RUBY-02",
    displayName: "Floral Ruby & Pearl Side Brooch",
    category: "brooches",
    glbPath: "/assets/jewellery/brooches/floral-ruby-brooch.glb",
    thumbnail: "/assets/brooches/floral-ruby-brooch.jpg",
    dimensionsMm: {
      width: 32.0,
      height: 32.0,
      depth: 8.0,
    },
    weightGrams: 9.8,
    materialInfo: {
      metalType: "22K Antique Gold",
      metalPurity: "916 Hallmark",
      finish: "Hand-engraved filigree",
      stoneTypes: ["Pigeon Blood Ruby", "Seed Pearls"],
    },
    sockets: {
      rear_tube_left: {
        name: "rear_tube_left",
        position: [-0.04, 0, -0.02],
        normal: [0, 0, -1],
        loopDiameterMm: 2.5,
        maxThreadThicknessMm: 1.5,
      },
      rear_tube_right: {
        name: "rear_tube_right",
        position: [0.04, 0, -0.02],
        normal: [0, 0, -1],
        loopDiameterMm: 2.5,
        maxThreadThicknessMm: 1.5,
      },
    },
    compatibilityRules: {
      minStrands: 1,
      maxStrands: 5,
      supportedBeadDiametersMm: [3.5, 8.0],
    },
    pricing: {
      basePriceInr: 4200,
      makingChargesInr: 950,
      gstRatePercent: 3,
    },
    approvalStatus: "APPROVED",
  },
};

/**
 * Lookup an asset by SKU with fallback lookup
 */
export function getAssetBySku(sku: string): JewelleryAssetMetadata | undefined {
  if (!sku) return undefined;
  return ASSET_REGISTRY[sku] || Object.values(ASSET_REGISTRY).find((a) => a.sku === sku);
}

/**
 * Filter assets by category
 */
export function getAssetsByCategory(category: JewelleryAssetCategory): JewelleryAssetMetadata[] {
  return Object.values(ASSET_REGISTRY).filter((a) => a.category === category);
}

/**
 * Get all registered assets
 */
export function getAllRegisteredAssets(): JewelleryAssetMetadata[] {
  return Object.values(ASSET_REGISTRY);
}

/**
 * Register a new asset at runtime (e.g. from Admin 3D Asset Studio upload)
 */
export function registerNewAsset(asset: JewelleryAssetMetadata): void {
  ASSET_REGISTRY[asset.sku] = asset;
}

/**
 * Validate asset metadata for required fields before publishing
 */
export function validateAssetMetadata(asset: Partial<JewelleryAssetMetadata>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!asset.sku || asset.sku.trim() === "") errors.push("SKU is required.");
  if (!asset.displayName || asset.displayName.trim() === "") errors.push("Display name is required.");
  if (!asset.category) errors.push("Asset category is required.");
  if (!asset.glbPath || !asset.glbPath.endsWith(".glb")) errors.push("Valid .glb file path is required.");
  if (!asset.dimensionsMm || asset.dimensionsMm.width <= 0 || asset.dimensionsMm.height <= 0) {
    errors.push("Accurate physical dimensions in mm are required.");
  }
  if (!asset.weightGrams || asset.weightGrams <= 0) {
    errors.push("Physical weight in grams is required.");
  }
  if (!asset.sockets || Object.keys(asset.sockets).length === 0) {
    errors.push("At least one named attachment socket (e.g. socket_bail_left) must be defined.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
