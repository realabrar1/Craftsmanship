"use client";

import React from "react";
import { BustMannequin } from "./BustMannequin";
import { ProceduralStrand } from "./ProceduralStrand";
import { ConnectorMesh } from "./ConnectorMesh";
import { PendantMesh } from "./PendantMesh";
import { NecklaceDesignState } from "@/lib/types";

interface NecklaceSceneProps {
  design: NecklaceDesignState;
  isExploded?: boolean;
  onPendantDiagnostic?: (diag: any) => void;
}

export function NecklaceScene({ design, isExploded = false, onPendantDiagnostic }: NecklaceSceneProps) {
  const layersCount = design.layersCount || 5;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Atelier Velvet Mannequin Bust */}
      <BustMannequin />

      {/* 2. Draped Pearl & Gemstone Strands */}
      {Array.from({ length: layersCount }).map((_, index) => {
        const layerCfg = design.layers[index] || {
          layerIndex: index,
          strandSku: "STR-PINK-01",
          beadDiameterMm: 5.5,
          lengthInches: 17 + index * 1.5,
          dropCurveDepth: 1.0 + index * 0.25,
          beadColor: "#E8BDB5",
        };

        // Determine shape type from strand SKU
        let shapeType: "ROUND" | "RICE" | "BAROQUE" | "POTATO" | "FACETED" = "ROUND";
        if (layerCfg.strandSku?.includes("RICE")) shapeType = "RICE";
        else if (layerCfg.strandSku?.includes("JADE")) shapeType = "POTATO";
        else if (layerCfg.strandSku?.includes("BAROQUE")) shapeType = "BAROQUE";

        return (
          <ProceduralStrand
            key={index}
            layerIndex={index}
            totalLayers={layersCount}
            beadColor={layerCfg.beadColor || "#E8BDB5"}
            beadDiameterMm={layerCfg.beadDiameterMm || 5.5}
            shapeType={shapeType}
            accents={design.accents}
            threadColor={design.finishing?.threadColor?.includes("Pink") ? "#D9A89D" : "#FAF0E6"}
            explodedOffset={isExploded ? 0.35 : 0}
          />
        );
      })}

      {/* 3. Mounted 5-Loop Kundan Connectors & Brooches */}
      {design.connectors &&
        design.connectors.map((conn, idx) => (
          <ConnectorMesh key={idx} config={conn} totalLayers={layersCount} />
        ))}

      {/* 4. Center Hero Pendant */}
      {design.pendantSku && (
        <PendantMesh
          pendantSku={design.pendantSku}
          totalLayers={layersCount}
          onDiagnosticUpdate={onPendantDiagnostic}
        />
      )}
    </group>
  );
}
