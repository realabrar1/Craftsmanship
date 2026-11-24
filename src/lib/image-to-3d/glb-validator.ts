import fs from "fs";
import * as THREE from "three";

export interface GLBValidationResult {
  isValid: boolean;
  byteLength: number;
  vertexCount: number;
  meshCount: number;
  error?: string;
}

/**
 * Validates binary GLB file header and verifies Three.js can parse geometry.
 */
export async function validateGLBFile(filePath: string): Promise<GLBValidationResult> {
  try {
    if (!fs.existsSync(filePath)) {
      return { isValid: false, byteLength: 0, vertexCount: 0, meshCount: 0, error: "File does not exist on disk." };
    }

    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 1000) {
      return { isValid: false, byteLength: buffer.length, vertexCount: 0, meshCount: 0, error: "GLB file size too small (< 1KB)." };
    }

    // Verify GLB Magic header: 'glTF' (0x46546C67 in Little Endian)
    const magic = buffer.readUInt32LE(0);
    if (magic !== 0x46546C67) {
      return { isValid: false, byteLength: buffer.length, vertexCount: 0, meshCount: 0, error: "Invalid binary GLB magic header (expected glTF)." };
    }

    // Parse with Three.js GLTFLoader in Node
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    const loader = new GLTFLoader();

    let vertexCount = 0;
    let meshCount = 0;

    await new Promise<void>((resolve, reject) => {
      loader.parse(
        buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
        "",
        (gltf) => {
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              meshCount++;
              const geom = (child as THREE.Mesh).geometry;
              if (geom && geom.attributes.position) {
                vertexCount += geom.attributes.position.count;
              }
            }
          });
          resolve();
        },
        (err) => reject(err)
      );
    });

    return {
      isValid: true,
      byteLength: buffer.length,
      vertexCount,
      meshCount,
    };
  } catch (err: any) {
    return {
      isValid: false,
      byteLength: 0,
      vertexCount: 0,
      meshCount: 0,
      error: err?.message || "Failed to parse GLB geometry.",
    };
  }
}
