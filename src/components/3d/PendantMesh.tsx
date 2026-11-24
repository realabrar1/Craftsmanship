"use client";

import React, { useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { calculatePendantTransform, getPendantDiagnostic } from "@/lib/jewellery-engine/attachment-math";
import { getAssetBySku } from "@/lib/jewellery-engine/asset-registry";
import { JewelleryAssetModel } from "./JewelleryAssetModel";

interface PendantMeshProps {
  pendantSku: string;
  totalLayers: number;
  onDiagnosticUpdate?: (diag: any) => void;
  highlightSockets?: boolean;
}

/**
 * Hero Pendant Mesh Component
 * Loads genuine binary 3D GLB model assets (sculpted relief, gem bezels, dangling pearl jhumkas,
 * reverse cavity, and physical top bails) using the asset registry.
 */
export function PendantMesh({
  pendantSku,
  totalLayers,
  onDiagnosticUpdate,
  highlightSockets = false,
}: PendantMeshProps) {
  // Attached to the lowest strand apex so it hangs as the grand focal centerpiece
  const transform = useMemo(() => {
    return calculatePendantTransform(totalLayers - 1, totalLayers, 0.20);
  }, [totalLayers]);

  // Lookup 3D Asset Metadata from the Asset Registry
  const assetMetadata = useMemo(() => {
    return getAssetBySku(pendantSku);
  }, [pendantSku]);

  // Model file path with fallback
  const glbPath = assetMetadata?.glbPath || "/assets/jewellery/pendants/lakshmi-temple-pendant.glb";

  // Report diagnostic info to canvas overlay
  useEffect(() => {
    if (onDiagnosticUpdate) {
      const diag = getPendantDiagnostic(pendantSku, totalLayers);
      onDiagnosticUpdate({
        ...diag,
        glbPath,
        isAssetLoaded: true,
        assetSku: pendantSku,
      });
    }
  }, [pendantSku, totalLayers, glbPath, onDiagnosticUpdate]);

  return (
    <group
      position={transform.position}
      rotation={transform.rotation}
      name="Hero_Pendant_Mount"
    >
      <JewelleryAssetModel
        modelUrl={glbPath}
        scale={0.92}
        castShadow
        receiveShadow
        highlightSockets={highlightSockets}
        fallbackLabel={`Pendant: ${assetMetadata?.displayName || pendantSku}`}
      />
    </group>
  );
}
