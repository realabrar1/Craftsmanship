"use client";

import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { NecklaceScene } from "./NecklaceScene";
import { NecklaceDesignState } from "@/lib/types";
import {
  RotateCcw,
  Maximize2,
  Sparkles,
  Move3d,
  Camera,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface NecklaceCanvasProps {
  design: NecklaceDesignState;
  onToggleViewMode?: (mode: "3D" | "2D") => void;
  onCapture2D?: (dataUrl: string) => void;
}

// Internal component inside Canvas to handle real-time frame capture
function CanvasCaptureHelper({
  onCaptureReady,
}: {
  onCaptureReady: (captureFn: () => string) => void;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const capture = () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    };
    onCaptureReady(capture);
  }, [gl, scene, camera, onCaptureReady]);

  return null;
}

export function NecklaceCanvas({ design, onToggleViewMode, onCapture2D }: NecklaceCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("Front");
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [backgroundTheme, setBackgroundTheme] = useState<"IVORY" | "STUDIO" | "BURGUNDY">("IVORY");
  const [captured2DImage, setCaptured2DImage] = useState<string | null>(null);
  const [captureFunction, setCaptureFunction] = useState<(() => string) | null>(null);
  const [pendantDiagnostic, setPendantDiagnostic] = useState<any>(null);

  // 8 Calibrated Camera Presets (Strictly centered on the necklace and chest)
  const setCameraView = useCallback((presetName: string) => {
    if (!controlsRef.current) return;
    setActivePreset(presetName);

    const norm = presetName.toLowerCase();
    if (norm.includes("exploded")) {
      setIsExploded(true);
      controlsRef.current.object.position.set(2.5, 0.25, 3.6);
      controlsRef.current.target.set(0, -0.05, 0.1);
    } else {
      setIsExploded(false);
      if (norm.includes("macro")) {
        // Macro view: focuses closely on the Lakshmi temple pendant
        controlsRef.current.object.position.set(0, -0.38, 1.5);
        controlsRef.current.target.set(0, -0.38, 0.4);
      } else if (norm.includes("close")) {
        // Close-up view: focuses on the 5-layer chest drape
        controlsRef.current.object.position.set(0, 0.04, 2.5);
        controlsRef.current.target.set(0, 0.0, 0.1);
      } else if (norm.includes("left")) {
        // Left 3/4 perspective
        controlsRef.current.object.position.set(-3.0, 0.15, 3.2);
        controlsRef.current.target.set(0, -0.05, 0);
      } else if (norm.includes("right")) {
        // Right 3/4 perspective
        controlsRef.current.object.position.set(3.0, 0.15, 3.2);
        controlsRef.current.target.set(0, -0.05, 0);
      } else if (norm.includes("side") || norm.includes("profile")) {
        // Pure side profile showing natural neck and bust slope
        controlsRef.current.object.position.set(3.6, 0.10, 0.2);
        controlsRef.current.target.set(0, -0.05, 0);
      } else if (norm.includes("rear") || norm.includes("clasp")) {
        // Rear neck closure and S-hook clasp
        controlsRef.current.object.position.set(0, 0.85, -3.0);
        controlsRef.current.target.set(0, 0.60, -0.2);
      } else {
        // Front View (Default): Perfectly centered overview of entire necklace and bust
        controlsRef.current.object.position.set(0, -0.05, 4.4);
        controlsRef.current.target.set(0, -0.05, 0);
      }
    }
    controlsRef.current.update();
  }, []);

  const handleResetCamera = () => {
    setCameraView("Front");
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Sync preset and theme from URL query params for testing and deep-linking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("preset");
    const t = params.get("theme");
    const m = params.get("mode");

    if (t === "STUDIO" || t === "BURGUNDY" || t === "IVORY") {
      setBackgroundTheme(t);
    }
    if (m === "2D" && onToggleViewMode) {
      onToggleViewMode("2D");
    }
    const initialPreset = p || "Front";
    const timer = setTimeout(() => {
      setCameraView(initialPreset);
    }, 250);
    return () => clearTimeout(timer);
  }, [setCameraView, onToggleViewMode]);

  // Perform dynamic 2D capture before switching to 2D
  const handleSwitchTo2D = () => {
    if (captureFunction) {
      try {
        const url = captureFunction();
        setCaptured2DImage(url);
        if (onCapture2D) onCapture2D(url);
      } catch (e) {
        console.error("Canvas capture error:", e);
      }
    }
    if (onToggleViewMode) onToggleViewMode("2D");
  };

  // Background styling
  const bgClasses =
    backgroundTheme === "IVORY"
      ? "bg-gradient-to-b from-[#FAF4EC] via-[#EFE4D6] to-[#E3D1BE]"
      : backgroundTheme === "STUDIO"
      ? "bg-gradient-to-b from-[#F5F5F7] via-[#EAEAEB] to-[#D5D5D8]"
      : "bg-gradient-to-b from-[#3D1016] via-[#2A0B10] to-[#1A060A]";

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[640px] xl:h-[680px] min-h-[640px] ${bgClasses} rounded-3xl overflow-hidden shadow-atelier border border-[#E5D2BE]/60 transition-colors duration-500 flex flex-col`}
    >
      {/* ============================================================ */}
      {/* 1. TOP HEADER BAR: 3D/2D TOGGLE & STUDIO CONTROLS            */}
      {/* ============================================================ */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: 3D / 2D Mode Switcher */}
        <div className="flex items-center bg-[#FAF2E8]/90 backdrop-blur-md rounded-full p-1 border border-[#B58A4D]/30 shadow-sm pointer-events-auto">
          <button
            onClick={() => onToggleViewMode && onToggleViewMode("3D")}
            className={`px-3 py-1 rounded-full text-xs font-serif font-semibold tracking-wider transition-all duration-300 ${
              design.viewMode === "3D"
                ? "bg-[#641B24] text-[#FFFDF9] shadow-md"
                : "text-[#3C211B] hover:text-[#641B24]"
            }`}
          >
            3D
          </button>
          <button
            onClick={handleSwitchTo2D}
            className={`px-3 py-1 rounded-full text-xs font-serif font-semibold tracking-wider transition-all duration-300 ${
              design.viewMode === "2D"
                ? "bg-[#641B24] text-[#FFFDF9] shadow-md"
                : "text-[#3C211B] hover:text-[#641B24]"
            }`}
          >
            2D
          </button>
        </div>

        {/* Right: Studio Themes & Utilities */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Theme Selector */}
          <div className="flex items-center bg-[#FAF2E8]/85 backdrop-blur-md rounded-full p-0.5 border border-[#B58A4D]/30 shadow-xs text-[10px]">
            <button
              onClick={() => setBackgroundTheme("IVORY")}
              className={`px-2 py-0.5 rounded-full font-serif transition-colors ${
                backgroundTheme === "IVORY" ? "bg-[#B58A4D] text-white" : "text-[#7E6359]"
              }`}
            >
              Ivory
            </button>
            <button
              onClick={() => setBackgroundTheme("STUDIO")}
              className={`px-2 py-0.5 rounded-full font-serif transition-colors ${
                backgroundTheme === "STUDIO" ? "bg-[#B58A4D] text-white" : "text-[#7E6359]"
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setBackgroundTheme("BURGUNDY")}
              className={`px-2 py-0.5 rounded-full font-serif transition-colors ${
                backgroundTheme === "BURGUNDY" ? "bg-[#641B24] text-white" : "text-[#7E6359]"
              }`}
            >
              Velvet
            </button>
          </div>

          {/* Reset & Fullscreen */}
          <button
            onClick={handleResetCamera}
            title="Reset Camera Framing"
            className="w-7 h-7 rounded-full bg-[#FAF2E8]/90 backdrop-blur-md border border-[#B58A4D]/30 text-[#3C211B] hover:text-[#641B24] flex items-center justify-center transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="w-7 h-7 rounded-full bg-[#FAF2E8]/90 backdrop-blur-md border border-[#B58A4D]/30 text-[#3C211B] hover:text-[#641B24] flex items-center justify-center transition-all shadow-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. FLOATING 8 CAMERA PRESETS SELECTOR BAR (CLEAN HORIZONTAL) */}
      {/* ============================================================ */}
      <div className="absolute top-[54px] left-1/2 -translate-x-1/2 z-20 max-w-[96%] overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1 bg-[#FAF2E8]/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#B58A4D]/30 shadow-md text-xs font-serif text-[#3C211B] whitespace-nowrap">
          {[
            { id: "Front", label: "Front" },
            { id: "Front Close-Up", label: "Close-Up" },
            { id: "Pendant Macro", label: "Pendant Macro" },
            { id: "Left Perspective", label: "Left 3/4" },
            { id: "Right Perspective", label: "Right 3/4" },
            { id: "Side Profile", label: "Profile" },
            { id: "Rear / Clasp", label: "Clasp" },
            { id: "Exploded", label: "Exploded" },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCameraView(preset.id)}
              className={`px-2 py-0.5 rounded-full transition-all duration-200 text-[10px] ${
                activePreset === preset.id
                  ? "bg-[#641B24] text-[#FFFDF9] font-medium shadow-xs"
                  : "text-[#3C211B] hover:bg-[#F3E2CF] hover:text-[#641B24]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE 3D WEBGL CANVAS OR 2D MASTER BLUEPRINT        */}
      {/* ============================================================ */}
      <div className="w-full flex-1 relative h-full min-h-0">
        {design.viewMode === "3D" ? (
          <Canvas
            camera={{ position: [0, -0.05, 4.4], fov: 38 }}
            shadows
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.18,
            }}
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
            className="cursor-grab active:cursor-grabbing w-full h-full"
          >
            <Suspense fallback={null}>
              {/* Helper hook to expose canvas screenshot export */}
              <CanvasCaptureHelper onCaptureReady={setCaptureFunction} />

              {/* Atelier Jewellery Studio Lighting */}
              <ambientLight intensity={0.95} color="#FFFDF5" />
              <directionalLight
                position={[4, 6, 5]}
                intensity={1.8}
                color="#FFF8EA"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
              />
              <directionalLight
                position={[-4, 3.5, 3]}
                intensity={1.0}
                color="#F2E4D4"
              />
              <pointLight position={[0, 0.4, 3.2]} intensity={1.4} color="#FFFBF2" distance={8} />
              <pointLight position={[0, -0.6, 2.5]} intensity={0.8} color="#FFEFE5" distance={6} />
              <directionalLight
                position={[0, 4.0, -4.5]}
                intensity={1.5}
                color="#FFF4E6"
              />

              {/* Velvet Floor Contact Shadows */}
              <ContactShadows
                position={[0, -0.84, 0]}
                opacity={0.48}
                scale={3.6}
                blur={2.0}
                far={2.5}
                color="#4A281E"
              />

              {/* Assembled Necklace & Bust Scene */}
              <NecklaceScene
                design={design}
                isExploded={isExploded}
                onPendantDiagnostic={setPendantDiagnostic}
              />

              {/* Orbit Controls Centered Exactly on Necklace Center [0, -0.05, 0] */}
              <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.06}
                enablePan={false}
                minDistance={1.2}
                maxDistance={5.2}
                maxPolarAngle={Math.PI / 2 + 0.12}
                minPolarAngle={Math.PI / 6}
                target={[0, -0.05, 0]}
              />
            </Suspense>
          </Canvas>
        ) : (
          // Dynamic 2D Master Blueprint View
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#FAF2E8]/40">
            <div className="relative max-w-lg w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-atelierLg border-2 border-[#B58A4D]/50 bg-[#FFFDF9] flex flex-col items-center justify-center">
              {captured2DImage ? (
                <img
                  src={captured2DImage}
                  alt="Live 2D Calibrated Necklace Capture"
                  className="w-full h-full object-contain object-center"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <Camera className="w-12 h-12 text-[#B58A4D] mb-3 animate-pulse" />
                  <h4 className="font-editorial text-xl text-[#3C211B] mb-1">
                    Orthographic 2D Master Blueprint
                  </h4>
                  <p className="text-xs font-serif text-[#7E6359] max-w-xs mb-4">
                    Rendered in real-time directly from your active 3D assembly.
                  </p>
                  <button
                    onClick={() => onToggleViewMode && onToggleViewMode("3D")}
                    className="px-5 py-2 rounded-full bg-[#641B24] text-[#FFFDF9] text-xs font-serif hover:bg-[#B58A4D] transition-colors"
                  >
                    Return to 3D Atelier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM INTERACTION PROMPTS                                */}
      {/* ============================================================ */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-none select-none flex items-center gap-2.5 text-[#7E6359]/80 font-serif text-xs">
        <div className="w-7 h-7 rounded-full border border-[#B58A4D]/40 bg-[#FAF2E8]/80 backdrop-blur-sm flex items-center justify-center text-[#B58A4D]">
          <Move3d className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div>
          <p className="font-medium text-[#3C211B]/90">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}
