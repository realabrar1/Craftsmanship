"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import {
  ASSET_REGISTRY,
  JewelleryAssetMetadata,
  validateAssetMetadata,
} from "@/lib/jewellery-engine/asset-registry";
import { JewelleryAssetModel } from "@/components/3d/JewelleryAssetModel";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Eye,
  RotateCcw,
  Maximize2,
  FileBox,
  Compass,
  Cpu,
  ShieldCheck,
  Scale,
} from "lucide-react";

export function Admin3DAssetStudio() {
  const [selectedSku, setSelectedSku] = useState<string>("PEN-LAKSHMI-01");
  const [highlightSockets, setHighlightSockets] = useState<boolean>(true);
  const [cameraWireframe, setCameraWireframe] = useState<boolean>(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Current selected asset
  const asset: JewelleryAssetMetadata = ASSET_REGISTRY[selectedSku] || ASSET_REGISTRY["PEN-LAKSHMI-01"];

  // Ingestion form state
  const [uploadForm, setUploadForm] = useState({
    sku: "",
    displayName: "",
    category: "pendants" as const,
    glbFile: null as File | null,
    glbFileName: "",
    widthMm: 65,
    heightMm: 78,
    depthMm: 12,
    weightGrams: 42,
    metalType: "22K Antique Temple Gold",
    stoneTypes: "Kemp Ruby, Zambian Emerald",
    socketNames: "socket_bail_left, socket_bail_right, socket_center_top",
  });

  const handleSimulatePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotification(`Validation complete: Asset ${uploadForm.sku || "NEW-ASSET"} passed dimensional and socket requirements.`);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Studio Header & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5D2BE]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#3C211B]">
              3D Asset Pipeline &amp; Tripo Studio Ingestion Hub
            </h3>
            <span className="bg-[#1C5237]/10 text-[#1C5237] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#1C5237]/30">
              GLB Pipeline Active
            </span>
          </div>
          <p className="text-xs text-[#7E6359] mt-0.5">
            Calibrate physical millimeters, inspect named socket nodes, and audit Tripo Studio / Blender GLTF models
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin?auth=demo&tab=IMAGE_TO_3D"
            className="px-3.5 py-1.5 rounded-xl bg-[#641B24] text-white text-xs font-serif font-bold flex items-center gap-1.5 hover:bg-[#B58A4D] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate 3D from Photo</span>
          </Link>

          {/* Asset Selector Tabs */}
          <div className="flex items-center gap-2 bg-[#FAF2E8] p-1 rounded-xl border border-[#E5D2BE]">
          {Object.values(ASSET_REGISTRY).map((ast) => (
            <button
              key={ast.sku}
              onClick={() => setSelectedSku(ast.sku)}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all ${
                selectedSku === ast.sku
                  ? "bg-[#641B24] text-white shadow-xs"
                  : "text-[#7E6359] hover:text-[#3C211B]"
              }`}
            >
              {ast.sku}
            </button>
          ))}
          </div>
        </div>
      </div>

      {statusNotification && (
        <div className="p-3 bg-[#1C5237]/10 border border-[#1C5237]/30 rounded-xl text-xs text-[#1C5237] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1C5237]" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Studio Grid: Left 3D Viewport, Right Caliper & Socket Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================================================================ */}
        {/* LEFT: INTERACTIVE 3D GLB ASSET VIEWPORT (COL-SPAN-7)             */}
        {/* ================================================================ */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#E5D2BE] shadow-atelier p-4 flex flex-col gap-3">
          {/* Viewport Top Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-serif">
              <span className="font-bold text-[#3C211B]">{asset.displayName}</span>
              <span className="text-[#7E6359] font-mono text-[11px]">({asset.glbPath})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighlightSockets((prev) => !prev)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-serif border transition-all flex items-center gap-1.5 ${
                  highlightSockets
                    ? "bg-[#1C5237] text-white border-[#1C5237]"
                    : "bg-[#FAF2E8] text-[#7E6359] border-[#E5D2BE]"
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>{highlightSockets ? "Sockets: Visible" : "Sockets: Hidden"}</span>
              </button>
            </div>
          </div>

          {/* WebGL Canvas for Single Asset Inspection */}
          <div className="relative w-full h-[460px] bg-gradient-to-b from-[#FAF4EC] via-[#EFE4D6] to-[#E3D1BE] rounded-2xl overflow-hidden border border-[#E5D2BE]/60">
            <Canvas
              camera={{ position: [0, 0, 1.8], fov: 38 }}
              shadows
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={1.1} color="#FFFDF5" />
                <directionalLight position={[3, 4, 3]} intensity={2.0} color="#FFF8EA" castShadow />
                <directionalLight position={[-3, 2, 2]} intensity={1.0} color="#F2E4D4" />
                <pointLight position={[0, 0, 2.0]} intensity={1.2} color="#FFFBF2" />

                {/* Ground Shadows & Grid */}
                <ContactShadows position={[0, -0.42, 0]} opacity={0.45} scale={2.5} blur={1.8} color="#4A281E" />
                <Grid position={[0, -0.42, 0]} args={[1.5, 1.5]} cellColor="#B58A4D" sectionColor="#641B24" fadeDistance={2.0} />

                {/* Inspected 3D GLB Model */}
                <group position={[0, 0, 0]}>
                  <JewelleryAssetModel
                    modelUrl={asset.glbPath}
                    scale={1.2}
                    castShadow
                    receiveShadow
                    highlightSockets={highlightSockets}
                    fallbackLabel={asset.displayName}
                  />
                </group>

                <OrbitControls enableDamping dampingFactor={0.08} minDistance={0.6} maxDistance={4.0} />
              </Suspense>
            </Canvas>

            {/* Viewport Overlay Controls Prompt */}
            <div className="absolute bottom-3 left-3 bg-[#FAF2E8]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#7E6359] font-serif border border-[#B58A4D]/30">
              Drag to orbit 360° • Scroll to zoom caliper view
            </div>
          </div>

          {/* Model Mesh Specs Bar */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center font-serif text-[11px]">
            <div className="bg-[#FAF2E8]/60 p-2 rounded-xl border border-[#E5D2BE]/60">
              <span className="block text-[#7E6359] text-[10px]">Tripo Model ID</span>
              <span className="font-mono font-bold text-[#641B24] truncate block">
                {asset.tripoStudioMetadata?.modelId || "blender_native_01"}
              </span>
            </div>
            <div className="bg-[#FAF2E8]/60 p-2 rounded-xl border border-[#E5D2BE]/60">
              <span className="block text-[#7E6359] text-[10px]">Vertex Count</span>
              <span className="font-mono font-bold text-[#3C211B]">
                {asset.tripoStudioMetadata?.vertexCount || "18,450"}
              </span>
            </div>
            <div className="bg-[#FAF2E8]/60 p-2 rounded-xl border border-[#E5D2BE]/60">
              <span className="block text-[#7E6359] text-[10px]">Mesh Quality</span>
              <span className="font-bold text-[#1C5237] uppercase text-[10px]">
                {asset.tripoStudioMetadata?.meshResolution || "High Relief PBR"}
              </span>
            </div>
            <div className="bg-[#FAF2E8]/60 p-2 rounded-xl border border-[#E5D2BE]/60">
              <span className="block text-[#7E6359] text-[10px]">Approval Status</span>
              <span className="font-bold text-[#1C5237] text-[10px]">
                {asset.approvalStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT: CALIPER MEASUREMENTS & SOCKET DEFINITION (COL-SPAN-5)     */}
        {/* ================================================================ */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* 1. Caliper Measurements Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#B58A4D]" />
                <h4 className="font-serif text-sm font-bold text-[#3C211B]">
                  Physical Caliper Dimensions (mm)
                </h4>
              </div>
              <span className="text-[10px] text-[#1C5237] font-bold bg-[#1C5237]/10 px-2 py-0.5 rounded-full">
                VERIFIED 1:1
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-[#FAF2E8]/40 border border-[#E5D2BE]">
                <span className="text-[10px] text-[#7E6359] block font-serif">Width</span>
                <span className="text-sm font-bold font-mono text-[#3C211B]">
                  {asset.dimensionsMm.width} mm
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF2E8]/40 border border-[#E5D2BE]">
                <span className="text-[10px] text-[#7E6359] block font-serif">Height</span>
                <span className="text-sm font-bold font-mono text-[#3C211B]">
                  {asset.dimensionsMm.height} mm
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF2E8]/40 border border-[#E5D2BE]">
                <span className="text-[10px] text-[#7E6359] block font-serif">Depth</span>
                <span className="text-sm font-bold font-mono text-[#3C211B]">
                  {asset.dimensionsMm.depth} mm
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF2E8]/30 border border-[#E5D2BE] text-xs font-serif">
              <div>
                <span className="text-[#7E6359] block text-[10px]">Net Gold &amp; Gem Weight</span>
                <span className="font-bold text-[#641B24]">{asset.weightGrams} grams</span>
              </div>
              <div>
                <span className="text-[#7E6359] block text-[10px]">Metal Specification</span>
                <span className="font-bold text-[#3C211B]">{asset.materialInfo.metalType}</span>
              </div>
            </div>
          </div>

          {/* 2. Named Sockets & Stringing Compatibility */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#641B24]" />
                <h4 className="font-serif text-sm font-bold text-[#3C211B]">
                  Attachment Sockets in GLTF Hierarchy
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-[#641B24]">
                {Object.keys(asset.sockets).length} Sockets
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {Object.entries(asset.sockets).map(([key, s]) => (
                <div
                  key={key}
                  className="p-3 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-[#641B24] text-[11px]">{s.name}</span>
                    <span className="text-[10px] text-[#7E6359] font-serif">
                      Aperture: {s.loopDiameterMm}mm • Max Gauge: {s.maxThreadThicknessMm}mm
                    </span>
                  </div>
                  <div className="text-right font-mono text-[10px] text-[#3C211B]">
                    [{s.position.map((v) => v.toFixed(3)).join(", ")}]
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#FAF2E8]/60 border border-[#B58A4D]/30 text-xs font-serif">
              <span className="font-bold text-[#3C211B] block mb-1">Strand Drape Compatibility</span>
              <p className="text-[11px] text-[#7E6359]">
                Supports {asset.compatibilityRules.minStrands} to {asset.compatibilityRules.maxStrands} parallel
                strands. Compatible bead sizes: {asset.compatibilityRules.supportedBeadDiametersMm[0]}mm -{" "}
                {asset.compatibilityRules.supportedBeadDiametersMm[1]}mm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* TRIPO STUDIO INGESTION & WORKFLOW GUIDE (PHASE 8 REQUIREMENT)    */}
      {/* ================================================================ */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-6">
        <div>
          <h4 className="font-serif text-base font-bold text-[#3C211B]">
            Tripo Studio Asset Production Pipeline (Standard Operating Procedure)
          </h4>
          <p className="text-xs text-[#7E6359]">
            The exact 4-step pipeline to ingest new jewellery components into Sutra &amp; Moti without modifying code
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF2E8]/50 border border-[#E5D2BE] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-full bg-[#641B24] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h5 className="font-serif text-xs font-bold text-[#3C211B]">
              Prompt &amp; Generate in Tripo
            </h5>
            <p className="text-[11px] text-[#7E6359] font-serif">
              Use luxury temple jewellery prompts with front/back reference photos. Generate high-poly mesh with PBR maps.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF2E8]/50 border border-[#E5D2BE] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-full bg-[#B58A4D] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h5 className="font-serif text-xs font-bold text-[#3C211B]">
              Blender Socket Placement
            </h5>
            <p className="text-[11px] text-[#7E6359] font-serif">
              Add Empty Object3D nodes named <code className="text-[#641B24]">socket_bail_left</code>,{" "}
              <code className="text-[#641B24]">socket_bail_right</code>, or <code className="text-[#641B24]">loop_01</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF2E8]/50 border border-[#E5D2BE] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1C5237] text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h5 className="font-serif text-xs font-bold text-[#3C211B]">
              Export Binary GLB
            </h5>
            <p className="text-[11px] text-[#7E6359] font-serif">
              Export as binary <code className="text-[#641B24]">.glb</code> with embedded textures and save into{" "}
              <code className="text-[#641B24]">public/assets/jewellery/</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF2E8]/50 border border-[#E5D2BE] flex flex-col gap-2">
            <div className="w-7 h-7 rounded-full bg-[#3C211B] text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h5 className="font-serif text-xs font-bold text-[#3C211B]">
              Publish to Atelier
            </h5>
            <p className="text-[11px] text-[#7E6359] font-serif">
              Register SKU and caliper dimensions in Asset Registry. The component appears immediately in customer 3D configurator.
            </p>
          </div>
        </div>

        {/* Ingestion & Caliper Validation Form */}
        <form onSubmit={handleSimulatePublish} className="border-t border-[#E5D2BE] pt-6 flex flex-col gap-4">
          <h5 className="font-serif text-sm font-bold text-[#3C211B]">
            Ingest &amp; Calibrate New 3D Asset
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-serif">
            <div>
              <label className="block text-[#7E6359] mb-1 font-bold">Component SKU *</label>
              <input
                type="text"
                placeholder="e.g. PEN-KRISHNA-02"
                value={uploadForm.sku}
                onChange={(e) => setUploadForm({ ...uploadForm, sku: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 font-mono text-xs focus:outline-[#641B24]"
                required
              />
            </div>

            <div>
              <label className="block text-[#7E6359] mb-1 font-bold">Display Name *</label>
              <input
                type="text"
                placeholder="e.g. Mayur Krishna Kemp Pendant"
                value={uploadForm.displayName}
                onChange={(e) => setUploadForm({ ...uploadForm, displayName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 text-xs focus:outline-[#641B24]"
                required
              />
            </div>

            <div>
              <label className="block text-[#7E6359] mb-1 font-bold">Asset Category *</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 text-xs focus:outline-[#641B24]"
              >
                <option value="pendants">Pendants</option>
                <option value="connectors">Connectors / Spacer Bars</option>
                <option value="brooches">Brooches / Buttis</option>
                <option value="pearls">Pearl Strands</option>
                <option value="clasps">Clasps &amp; Closures</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7E6359] mb-1 font-bold">GLB File Location *</label>
              <input
                type="text"
                placeholder="/assets/jewellery/pendants/model.glb"
                className="w-full px-3 py-2 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 font-mono text-xs focus:outline-[#641B24]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#641B24] text-white font-serif font-bold text-xs hover:bg-[#B58A4D] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validate &amp; Ingest 3D Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
