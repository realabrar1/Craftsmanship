"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { calculateConnectorTransform } from "@/lib/jewellery-engine/attachment-math";
import { getAssetBySku } from "@/lib/jewellery-engine/asset-registry";
import { ConnectorPlacementConfig } from "@/lib/types";
import { JewelleryAssetModel } from "./JewelleryAssetModel";

interface ConnectorMeshProps {
  config: ConnectorPlacementConfig;
  totalLayers: number;
}

export function ConnectorMesh({ config, totalLayers }: ConnectorMeshProps) {
  // Calculate pairs - strictly calibrated curve positions along chest (t < 0.5)
  const pairCount = config.quantityPairs || 1;
  const positions = useMemo(() => {
    if (pairCount === 1) return [0.28];
    if (pairCount === 2) return [0.22, 0.34];
    return [0.20, 0.28, 0.36]; // Upper clavicle, mid-chest, lower-chest
  }, [pairCount]);

  const placements = useMemo(() => {
    const list: Array<{ position: THREE.Vector3; rotation: THREE.Euler; width: number }> = [];

    positions.forEach((pos) => {
      // Left side connector (evaluated at pos e.g. 0.20, 0.28, 0.36)
      if (config.placement === "BOTH_SIDES" || config.placement === "LEFT_ONLY") {
        const left = calculateConnectorTransform(pos, totalLayers, config.connectedStrands);
        list.push(left);
      }
      // Right side connector (evaluated at 1.0 - pos e.g. 0.80, 0.72, 0.64)
      if (config.placement === "BOTH_SIDES" || config.placement === "RIGHT_ONLY") {
        const right = calculateConnectorTransform(1.0 - pos, totalLayers, config.connectedStrands);
        list.push(right);
      }
    });

    return list;
  }, [positions, totalLayers, config.connectedStrands, config.placement]);

  const isBrooch = config.type === "SIDE_BROOCH" || config.type === "TEMPLE_BUTTI";

  // Lookup model paths from asset registry
  const assetMetadata = useMemo(() => {
    return getAssetBySku(config.componentSku);
  }, [config.componentSku]);

  const defaultGlb = isBrooch
    ? "/assets/jewellery/brooches/floral-ruby-brooch.glb"
    : "/assets/jewellery/connectors/kundan-5loop-connector.glb";

  const glbPath = assetMetadata?.glbPath || defaultGlb;

  return (
    <group name="Connector_Assembly_Group">
      {placements.map((t, idx) => {
        const scaleFactor = Math.max(0.65, Math.min(1.2, t.width / 0.16));

        return (
          <group key={idx} position={t.position} rotation={t.rotation}>
            <JewelleryAssetModel
              modelUrl={glbPath}
              scale={isBrooch ? 0.75 : scaleFactor * 0.9}
              castShadow
              receiveShadow
              fallbackLabel={assetMetadata?.displayName || config.componentSku}
            />
          </group>
        );
      })}
    </group>
  );
}
