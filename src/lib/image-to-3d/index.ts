import { ImageTo3DProvider, GenerationJobOptions, ProviderGenerationResult } from "./providers/image-to-3d-provider";
import { TripoProvider } from "./providers/tripo-provider";
import { TrellisProvider } from "./providers/trellis-provider";
import { ManualGLBProvider } from "./providers/manual-provider";
import { validateGLBFile, GLBValidationResult } from "./glb-validator";

export * from "./providers/image-to-3d-provider";
export { validateGLBFile };
export type { GLBValidationResult };

const tripoProvider = new TripoProvider();
const trellis2Provider = new TrellisProvider("TRELLIS.2");
const trellisCommunityProvider = new TrellisProvider("TRELLIS");
const manualProvider = new ManualGLBProvider();

export const PROVIDERS: Record<string, ImageTo3DProvider> = {
  TRIPO: tripoProvider,
  tripo: tripoProvider,
  "TRELLIS.2": trellis2Provider,
  TRELLIS: trellisCommunityProvider,
  MANUAL_UPLOAD: manualProvider,
  manual: manualProvider,
};

/**
 * Returns the requested provider or defaults to Tripo Studio.
 */
export function getProvider(providerId?: string): ImageTo3DProvider {
  if (!providerId) return tripoProvider;
  return PROVIDERS[providerId] || tripoProvider;
}

/**
 * Executes 3D generation using the selected provider (Tripo Studio by default).
 */
export async function executeImageTo3DGeneration(
  options: GenerationJobOptions
): Promise<ProviderGenerationResult> {
  const providerKey = options.provider || process.env.IMAGE_TO_3D_PROVIDER || "TRIPO";
  const provider = getProvider(providerKey);

  console.log(`[ImageTo3D] Executing 3D generation with provider: ${provider.name} (${provider.id})...`);
  return await provider.generate(options);
}
