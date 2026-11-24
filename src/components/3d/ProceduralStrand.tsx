"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { createLayerCurve, sampleStrandPoints } from "@/lib/jewellery-engine/curve-generator";
import { AccentConfig } from "@/lib/types";

interface ProceduralStrandProps {
  layerIndex: number;
  totalLayers: number;
  beadColor?: string;
  beadDiameterMm?: number;
  shapeType?: "ROUND" | "RICE" | "BAROQUE" | "POTATO" | "FACETED";
  accents?: AccentConfig;
  threadColor?: string;
  explodedOffset?: number; // For exploded assembly view
}

// Deterministic pseudo-random jitter generator
function pseudoNoise(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function ProceduralStrand({
  layerIndex,
  totalLayers,
  beadColor = "#E8BDB5",
  beadDiameterMm = 5.5,
  shapeType = "ROUND",
  accents,
  threadColor = "#D9A89D",
  explodedOffset = 0,
}: ProceduralStrandProps) {
  const pearlMeshRef = useRef<THREE.InstancedMesh>(null);
  const goldMeshRef = useRef<THREE.InstancedMesh>(null);

  // Bead count: inner layer has ~64 beads, outer layer ~84 beads
  const beadCount = useMemo(() => {
    return Math.floor(64 + layerIndex * 5);
  }, [layerIndex]);

  // Curve and samples
  const { curve, samples, pearlMatrices, goldMatrices } = useMemo(() => {
    const c = createLayerCurve(layerIndex, totalLayers);
    const samps = sampleStrandPoints(c, beadCount);

    const pearlList: THREE.Matrix4[] = [];
    const goldList: THREE.Matrix4[] = [];

    // Base unit radius (5.5mm ≈ 0.014 units calibrated to bust dimensions)
    const baseRadius = (beadDiameterMm / 5.5) * 0.014;
    const dummy = new THREE.Object3D();

    samps.forEach((sample, i) => {
      // Natural organic size jitter (±3.5% variation)
      const jitter = 0.965 + pseudoNoise(i + layerIndex * 100) * 0.07;
      const beadR = baseRadius * jitter;

      // Position along strand (plus exploded offset along normal if enabled)
      const pos = sample.position.clone();
      if (explodedOffset > 0) {
        pos.addScaledVector(sample.normal, explodedOffset * (layerIndex + 1) * 0.08);
      }
      dummy.position.copy(pos);

      // Align dummy with tangent and normal
      const rotMatrix = new THREE.Matrix4().makeBasis(
        sample.binormal,
        sample.tangent,
        sample.normal
      );
      dummy.quaternion.setFromRotationMatrix(rotMatrix);

      // Subtle rotation around tangent axis so nacre sheen is slightly randomized
      dummy.rotateY(pseudoNoise(i * 3.7) * Math.PI * 2);

      // Shape deformation
      let sx = beadR;
      let sy = beadR;
      let sz = beadR;

      if (shapeType === "RICE") {
        sy = beadR * 1.42; // Elongated along tangent
        sx = beadR * 0.84;
        sz = beadR * 0.84;
      } else if (shapeType === "POTATO") {
        sy = beadR * 0.88; // Slightly squashed rondelle
        sx = beadR * 1.06;
        sz = beadR * 1.06;
      } else if (shapeType === "BAROQUE") {
        const asym = 1.0 + (pseudoNoise(i * 7.1) - 0.5) * 0.22;
        sy = beadR * 1.25 * asym;
        sx = beadR * 0.92;
        sz = beadR * 0.98;
      } else {
        // ROUND: natural subtle pearl flattening
        sy = beadR * 0.97;
        sx = beadR * 1.01;
        sz = beadR * 1.01;
      }

      // Check if accent bead
      let isGoldAccent = false;
      if (accents && accents.beadSku) {
        if (accents.patternType === "EVERY_5TH" && i % 5 === 0) {
          isGoldAccent = true;
        } else if (accents.patternType === "ALTERNATING_GOLD" && i % 2 === 0) {
          isGoldAccent = true;
        }
      }

      if (isGoldAccent) {
        dummy.scale.set(sx * 1.1, sy * 1.1, sz * 1.1);
        dummy.updateMatrix();
        goldList.push(dummy.matrix.clone());
      } else {
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        pearlList.push(dummy.matrix.clone());
      }
    });

    return {
      curve: c,
      samples: samps,
      pearlMatrices: pearlList,
      goldMatrices: goldList,
    };
  }, [layerIndex, totalLayers, beadCount, beadDiameterMm, shapeType, accents, explodedOffset]);

  // Update instanced matrices
  useEffect(() => {
    if (pearlMeshRef.current && pearlMatrices.length > 0) {
      pearlMatrices.forEach((mat, idx) => {
        pearlMeshRef.current?.setMatrixAt(idx, mat);
      });
      pearlMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (goldMeshRef.current && goldMatrices.length > 0) {
      goldMatrices.forEach((mat, idx) => {
        goldMeshRef.current?.setMatrixAt(idx, mat);
      });
      goldMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [pearlMatrices, goldMatrices]);

  // 1. Premium Pearl PBR Nacre Material (Clearcoat, subtle orient, silky sheen)
  const pearlMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: beadColor,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.94,
      clearcoatRoughness: 0.12,
      sheen: 0.88,
      sheenColor: new THREE.Color(beadColor).lerp(new THREE.Color("#FFF5F0"), 0.5),
      specularIntensity: 0.92,
    });
  }, [beadColor]);

  // 2. 22K Antique Nakshi Carved Gold Accent Material
  const goldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#D4AF37",
      roughness: 0.24,
      metalness: 0.92,
      bumpScale: 0.04,
    });
  }, []);

  // 3. Resham Silk Stringing Thread Material
  const threadMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: threadColor,
      roughness: 0.75,
      metalness: 0.05,
    });
  }, [threadColor]);

  // Smooth Resham Thread Curve Tube
  const threadGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.003, 8, false);
  }, [curve]);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 22, 22), []);

  return (
    <group>
      {/* Internal Resham Silk Stringing Thread */}
      <mesh geometry={threadGeometry} material={threadMaterial} />

      {/* Instanced Pearls */}
      {pearlMatrices.length > 0 && (
        <instancedMesh
          ref={pearlMeshRef}
          args={[sphereGeometry, pearlMaterial, pearlMatrices.length]}
          castShadow
          receiveShadow
        />
      )}

      {/* Instanced Nakshi Gold Accent Beads */}
      {goldMatrices.length > 0 && (
        <instancedMesh
          ref={goldMeshRef}
          args={[sphereGeometry, goldMaterial, goldMatrices.length]}
          castShadow
          receiveShadow
        />
      )}
    </group>
  );
}
