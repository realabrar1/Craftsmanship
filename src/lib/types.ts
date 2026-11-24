export type ComponentType =
  | "PENDANT"
  | "STRAND"
  | "CONNECTOR"
  | "SIDE_BROOCH"
  | "TEMPLE_BUTTI"
  | "SIGNATURE_MOTIF"
  | "SPACER_BAR"
  | "SPACER_BEAD"
  | "CLASP"
  | "THREAD";

export type PlacementType = "BOTH_SIDES" | "LEFT_ONLY" | "RIGHT_ONLY" | "CENTER";

export interface ComponentAsset {
  id: string;
  sku: string;
  name: string;
  type: ComponentType;
  categorySubtype?: string;
  previewImageUrl: string;
  referencePhotos?: Record<string, string>;
  dimensionsMm: {
    width?: number;
    height?: number;
    depth?: number;
    beadDiameter?: number;
    strandLengthInches?: number;
    beadCount?: number;
    loopSpacing?: number;
  };
  weightGrams?: number;
  metalType?: string;
  stoneType?: string;
  attachmentPoints?: Array<{
    id: string;
    name?: string;
    type?: string;
    position?: [number, number, number];
    supportedStrandCounts?: number[];
    mechanism?: string;
    innerDiameterMm?: number;
  }>;
  pbrSettings?: {
    metalness?: number;
    roughness?: number;
    color?: string;
    transmission?: number;
    iridescence?: number;
  };
  basePrice: number;
  makingCharges: number;
  stockQuantity: number;
}

export interface LayerConfig {
  layerIndex: number;
  strandSku: string;
  beadDiameterMm: number;
  lengthInches: number;
  dropCurveDepth: number;
  beadColor: string;
  strandName?: string;
}

export interface ConnectorPlacementConfig {
  componentSku: string;
  type: "CONNECTOR" | "SIDE_BROOCH" | "TEMPLE_BUTTI" | "SPACER_BAR";
  placement: PlacementType;
  quantityPairs: number;
  curvePositions: number[]; // e.g. [0.28, 0.44, 0.60] along the strand curve
  connectedStrands: number[]; // e.g. [0, 1, 2, 3, 4] for 5 strands
}

export interface AccentConfig {
  patternType: "UNIFORM" | "ALTERNATING_GOLD" | "EVERY_5TH" | "CUSTOM";
  beadSku: string;
  quantity: number;
  interval?: number;
}

export interface FinishingConfig {
  threadColor: string;
  claspSku: string;
  tasselType: string;
}

export interface ItemizedPriceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface PricingBreakdown {
  components: ItemizedPriceItem[];
  componentSubtotal: number;
  craftsmanship: {
    stringingCharges: number;
    connectorAssembly: number;
    pendantMounting: number;
    sideBroochAssembly: number;
    finishingCharges: number;
    qualityCertification: number;
    totalLabour: number;
  };
  taxes: {
    gstRatePercent: number;
    gstAmount: number;
  };
  shipping: number;
  estimatedTotalInr: number;
}

export interface NecklaceDesignState {
  designCode?: string;
  title: string;
  layersCount: number;
  layers: LayerConfig[];
  pendantSku: string | null;
  connectors: ConnectorPlacementConfig[];
  accents: AccentConfig;
  finishing: FinishingConfig;
  pricing: PricingBreakdown;
  viewMode: "3D" | "2D";
}
