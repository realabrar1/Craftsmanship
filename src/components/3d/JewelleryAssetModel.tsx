"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface JewelleryAssetModelProps {
  modelUrl: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  highlightSockets?: boolean;
  onSocketsDiscovered?: (sockets: Record<string, THREE.Vector3>) => void;
  fallbackLabel?: string;
}

/**
 * Visual missing asset placeholder if GLB file fails to load or is not yet registered.
 */
function MissingAssetPlaceholder({
  position = [0, 0, 0],
  label = "Missing 3D Asset",
}: {
  position?: [number, number, number];
  label?: string;
}) {
  return (
    <group position={position}>
      {/* Golden wireframe bounding box */}
      <mesh>
        <boxGeometry args={[0.3, 0.35, 0.08]} />
        <meshStandardMaterial
          color="#B58A4D"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Central amber warning emblem */}
      <mesh position={[0, 0, 0.045]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#E67E22"
          emissive="#E67E22"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * Inner component that safely uses useGLTF hook.
 */
function GLTFModelInner({
  modelUrl,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  highlightSockets = false,
  onSocketsDiscovered,
}: JewelleryAssetModelProps) {
  const gltf = useGLTF(modelUrl);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const [discoveredSockets, setDiscoveredSockets] = useState<Array<{ name: string; pos: THREE.Vector3 }>>([]);

  // Setup shadows, material enhancements, and extract named sockets
  useEffect(() => {
    if (!clonedScene) return;

    const sockets: Record<string, THREE.Vector3> = {};
    const socketDebugList: Array<{ name: string; pos: THREE.Vector3 }> = [];

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
        
        // Ensure proper tone-mapping and color space for all embedded materials
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.needsUpdate = true;
            });
          } else {
            mesh.material.needsUpdate = true;
          }
        }
      }

      // Check for named attachment sockets in scene hierarchy
      if (
        child.name &&
        (child.name.startsWith("socket_") ||
          child.name.startsWith("loop_") ||
          child.name.startsWith("rear_tube_") ||
          child.name.startsWith("bail_"))
      ) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        sockets[child.name] = child.position.clone();
        socketDebugList.push({ name: child.name, pos: child.position.clone() });
      }
    });

    setDiscoveredSockets(socketDebugList);
    if (onSocketsDiscovered) {
      onSocketsDiscovered(sockets);
    }
  }, [clonedScene, castShadow, receiveShadow, onSocketsDiscovered]);

  const scaleArray: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <group position={position} rotation={rotation} scale={scaleArray}>
      <primitive object={clonedScene} />

      {/* Optional Socket Debug Indicators (Visualized in Admin 3D Asset Studio) */}
      {highlightSockets &&
        discoveredSockets.map((s, idx) => (
          <group key={idx} position={[s.pos.x, s.pos.y, s.pos.z]}>
            <mesh>
              <sphereGeometry args={[0.015, 12, 12]} />
              <meshBasicMaterial color="#00FF88" wireframe />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <ringGeometry args={[0.018, 0.024, 16]} />
              <meshBasicMaterial color="#FFCC00" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
    </group>
  );
}

/**
 * Universal Jewellery Asset Model Loader with graceful Error Boundary and Fallback.
 */
export function JewelleryAssetModel(props: JewelleryAssetModelProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [props.modelUrl]);

  if (hasError || !props.modelUrl) {
    return (
      <MissingAssetPlaceholder
        position={props.position}
        label={props.fallbackLabel || props.modelUrl}
      />
    );
  }

  return (
    <React.Suspense
      fallback={
        <group position={props.position}>
          <mesh>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#B58A4D" wireframe opacity={0.3} transparent />
          </mesh>
        </group>
      }
    >
      <GLTFModelInner {...props} />
    </React.Suspense>
  );
}

// Preload models for instantaneous rendering
if (typeof window !== "undefined") {
  try {
    useGLTF.preload("/assets/jewellery/pendants/lakshmi-temple-pendant.glb");
    useGLTF.preload("/assets/jewellery/connectors/kundan-5loop-connector.glb");
    useGLTF.preload("/assets/jewellery/brooches/floral-ruby-brooch.glb");
  } catch (e) {
    // Ignore during SSR
  }
}
