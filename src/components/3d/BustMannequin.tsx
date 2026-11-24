"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export function BustMannequin() {
  // Champagne/Warm Ivory Atelier Velvet Material
  const bustMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#F4EBE1", // Luxurious warm champagne atelier velvet
      roughness: 0.88,
      metalness: 0.03,
      flatShading: false,
    });
  }, []);

  // Turned Antique Wood / Gilded Champagne Brass Pedestal Material
  const pedestalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#D8C2AD",
      roughness: 0.40,
      metalness: 0.28,
    });
  }, []);

  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#C59B5F",
      roughness: 0.28,
      metalness: 0.82,
    });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================ */}
      {/* 1. SCULPTED SLENDER NECK & FINIAL DOME CROWN                 */}
      {/* ============================================================ */}
      {/* Rounded Dome Cap on Top of Neck */}
      <mesh position={[0, 0.68, -0.04]} scale={[1, 0.45, 1]} material={bustMaterial} castShadow>
        <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      </mesh>
      {/* Gilded Ribbon Trim around Neck Crown */}
      <mesh position={[0, 0.68, -0.04]} rotation={[Math.PI / 2, 0, 0]} material={trimMaterial}>
        <torusGeometry args={[0.22, 0.009, 16, 32]} />
      </mesh>
      {/* Slender Atelier Neck Body */}
      <mesh position={[0, 0.50, -0.04]} material={bustMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.36, 32]} />
      </mesh>

      {/* ============================================================ */}
      {/* 2. CONTOURED SLENDER ATELIER TORSO (ELEGANT OVAL IN Z)       */}
      {/* ============================================================ */}
      <group scale={[1.0, 1.0, 0.42]}>
        {/* Seamless Clavicle & Shoulder Slope */}
        <mesh position={[0, 0.22, 0.0]} material={bustMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.76, 0.28, 36]} />
        </mesh>

        {/* Upper Chest Section */}
        <mesh position={[0, -0.06, 0.02]} material={bustMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.76, 0.62, 0.34, 36]} />
        </mesh>

        {/* Contoured Front Chest Cushion (Flush velvet support for pearls) */}
        <mesh
          position={[0, -0.01, 0.32]}
          scale={[1.10, 0.85, 0.54]}
          material={bustMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>

        {/* Lower Torso Taper */}
        <mesh position={[0, -0.36, 0.01]} material={bustMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.32, 0.30, 32]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. ATELIER PEDESTAL WAIST RING, COLUMN & BASE PLINTH         */}
      {/* ============================================================ */}
      {/* Gilded Atelier Waist Ring */}
      <mesh position={[0, -0.54, 0.0]} material={trimMaterial} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 32]} />
      </mesh>

      {/* Turned Wood / Brushed Brass Pedestal Column */}
      <mesh position={[0, -0.68, 0.0]} material={pedestalMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.30, 0.24, 32]} />
      </mesh>

      {/* Heavy Base Plinth Plaque */}
      <mesh position={[0, -0.82, 0.0]} material={pedestalMaterial} receiveShadow>
        <cylinderGeometry args={[0.54, 0.60, 0.08, 40]} />
      </mesh>
      <mesh position={[0, -0.78, 0.0]} rotation={[Math.PI / 2, 0, 0]} material={trimMaterial}>
        <torusGeometry args={[0.57, 0.012, 16, 40]} />
      </mesh>
    </group>
  );
}
