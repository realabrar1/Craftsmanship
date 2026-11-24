export interface GenerationJobOptions {
  jobId: string;
  sku: string;
  name: string;
  category: string;
  imageFilePath: string;
  provider?: "TRIPO" | "TRELLIS.2" | "TRELLIS" | "MANUAL_UPLOAD";
  hfToken?: string;
  tripoModel?: "v3.1-20260211" | "v3.0-20250812" | "P1-20260311" | "P2-20260801";
  decimationTarget?: number;
  textureSize?: number;
}

export interface ProviderGenerationResult {
  publicGlbUrl: string;
  finalGlbPath: string;
  vertexCount: number;
  meshCount: number;
  byteLength: number;
  message: string;
}

export interface ImageTo3DProvider {
  id: string;
  name: string;
  description: string;
  generate(options: GenerationJobOptions): Promise<ProviderGenerationResult>;
}
