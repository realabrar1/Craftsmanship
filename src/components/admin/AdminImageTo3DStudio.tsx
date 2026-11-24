"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import { JewelleryAssetModel } from "@/components/3d/JewelleryAssetModel";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Compass,
  Scale,
  Download,
  Key,
  ShieldCheck,
  RefreshCw,
  Eye,
  Camera,
  Layers,
  ArrowRight,
  FileBox,
  Cpu,
} from "lucide-react";

export function AdminImageTo3DStudio() {
  // Input State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("/assets/pendant/lakshmi-temple-pendant-front.jpg");
  const [selectedGlbFile, setSelectedGlbFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<"TRIPO" | "TRELLIS.2" | "TRELLIS" | "MANUAL_UPLOAD">("TRIPO");
  const [tripoModel, setTripoModel] = useState<"v3.1-20260211" | "v3.0-20250812" | "P1-20260311">("v3.1-20260211");
  const [hfToken, setHfToken] = useState<string>("");
  const [sku, setSku] = useState<string>(`PEN-AI-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState<string>("Goddess Lakshmi Kemp Temple Padakkam");
  const [category, setCategory] = useState<string>("pendants");

  // Caliper & Metadata State
  const [widthMm, setWidthMm] = useState<number>(68.0);
  const [heightMm, setHeightMm] = useState<number>(82.0);
  const [depthMm, setDepthMm] = useState<number>(14.5);
  const [weightGrams, setWeightGrams] = useState<number>(46.5);
  const [metalType, setMetalType] = useState<string>("22K Antique Temple Gold");
  const [stoneTypes, setStoneTypes] = useState<string>("Kemp Ruby, Zambian Emerald, Basra Pearls");
  const [basePrice, setBasePrice] = useState<number>(16500);
  const [makingCharges, setMakingCharges] = useState<number>(3400);

  // Generation Pipeline State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreditShortage, setIsCreditShortage] = useState<boolean>(false);
  const [generatedGlbUrl, setGeneratedGlbUrl] = useState<string | null>("/assets/jewellery/pendants/lakshmi-temple-pendant.glb");
  const [isSavedToAtelier, setIsSavedToAtelier] = useState<boolean>(false);

  // 3D Viewport Controls
  const [cameraPreset, setCameraPreset] = useState<"front" | "back" | "side" | "macro">("front");
  const [highlightSockets, setHighlightSockets] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);

  // Handle local image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
      setIsCreditShortage(false);
    }
  };

  // Handle manual GLB file selection
  const handleGlbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedGlbFile(file);
      setProvider("MANUAL_UPLOAD");
      setErrorMessage(null);
      setIsCreditShortage(false);
    }
  };

  // Trigger 3D Generation / Upload Job
  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    setIsCreditShortage(false);
    setProgressPercent(10);
    setStatusMessage(
      provider === "TRIPO"
        ? "Uploading photograph to Tripo Studio v3 API..."
        : "Uploading asset and queuing inference pipeline..."
    );
    setIsSavedToAtelier(false);

    try {
      const formData = new FormData();
      formData.append("sku", sku);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("provider", provider);
      formData.append("tripoModel", tripoModel);

      if (hfToken.trim()) {
        formData.append("hfToken", hfToken.trim());
      }

      if (selectedGlbFile) {
        formData.append("glbFile", selectedGlbFile);
      }

      if (selectedImage) {
        formData.append("image", selectedImage);
      } else {
        // Fetch default reference image
        const defaultImgRes = await fetch(imagePreviewUrl);
        const defaultBlob = await defaultImgRes.blob();
        formData.append("image", defaultBlob, "reference-pendant.jpg");
      }

      const res = await fetch("/api/image-to-3d/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to initiate generation.");
      }

      setActiveJobId(data.jobId);

      // If manual GLB upload, job completes immediately
      if (data.status === "COMPLETED" && data.generatedGlbPath) {
        setProgressPercent(100);
        setStatusMessage("3D Model uploaded, geometry verified, and ready for caliper inspection.");
        setGeneratedGlbUrl(data.generatedGlbPath);
        setIsGenerating(false);
        return;
      }

      // Otherwise, poll for hosted inference job completion
      pollJobStatus(data.jobId);
    } catch (err: any) {
      setIsGenerating(false);
      const msg = err.message || "Failed to generate 3D model.";
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("credit")) {
        setIsCreditShortage(true);
      }
      setProgressPercent(0);
    }
  };

  // Polling helper for background generation status
  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/image-to-3d/status?jobId=${jobId}`);
        const data = await res.json();

        if (data.progressPercent) {
          setProgressPercent(data.progressPercent);
        }
        if (data.statusMessage) {
          setStatusMessage(data.statusMessage);
        }

        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setIsGenerating(false);
          setProgressPercent(100);
          setStatusMessage("Generation complete! Inspect geometry below.");
          if (data.generatedGlbPath) {
            setGeneratedGlbUrl(data.generatedGlbPath);
          }
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setIsGenerating(false);
          const errText = data.errorMessage || "Generation failed on hosted service.";
          setErrorMessage(errText);
          if (errText.toLowerCase().includes("credit")) {
            setIsCreditShortage(true);
          }
          setProgressPercent(0);
        }
      } catch (err: any) {
        clearInterval(interval);
        setIsGenerating(false);
        setErrorMessage("Network error checking job status.");
      }
    }, 2500);
  };

  // Camera presets for 3D inspection
  const setCameraView = (view: "front" | "back" | "side" | "macro") => {
    setCameraPreset(view);
    if (!controlsRef.current) return;

    if (view === "front") {
      controlsRef.current.object.position.set(0, 0, 1.8);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === "back") {
      controlsRef.current.object.position.set(0, 0, -1.8);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === "side") {
      controlsRef.current.object.position.set(1.8, 0, 0.2);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === "macro") {
      controlsRef.current.object.position.set(0, 0.05, 0.75);
      controlsRef.current.target.set(0, 0.02, 0);
    }
    controlsRef.current.update();
  };

  // Save approved asset to Database & Asset Registry
  const handleSaveToAtelier = async () => {
    if (!generatedGlbUrl) return;

    try {
      const res = await fetch("/api/image-to-3d/save-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          name,
          category,
          glbPath: generatedGlbUrl,
          originalImagePath: imagePreviewUrl,
          dimensionsMm: { width: widthMm, height: heightMm, depth: depthMm },
          weightGrams,
          metalType,
          stoneTypes: stoneTypes.split(",").map((s) => s.trim()),
          basePrice,
          makingCharges,
          approvalStatus: "APPROVED",
          jobId: activeJobId,
          provider,
          sockets: {
            socket_bail_left: {
              name: "socket_bail_left",
              position: [-0.095, 0.285, 0.02],
              normal: [-0.2, 0.95, 0.15],
              loopDiameterMm: 3.2,
              maxThreadThicknessMm: 1.8,
            },
            socket_bail_right: {
              name: "socket_bail_right",
              position: [0.095, 0.285, 0.02],
              normal: [0.2, 0.95, 0.15],
              loopDiameterMm: 3.2,
              maxThreadThicknessMm: 1.8,
            },
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSavedToAtelier(true);
        setStatusMessage("Asset successfully published to Sutra & Moti 3D Atelier catalog!");
      } else {
        throw new Error(data.error || "Failed to save asset.");
      }
    } catch (err: any) {
      alert(`Error saving asset: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5D2BE]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#3C211B]">
              AI Image-to-3D Model Generation Studio
            </h3>
            <span className="bg-[#1C5237]/10 text-[#1C5237] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#1C5237]/30 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#1C5237]" />
              <span>Tripo Studio Official API v3.1</span>
            </span>
          </div>
          <p className="text-xs text-[#7E6359] mt-0.5">
            Transform single reference photographs of temple pendants &amp; buttis into high-poly 3D GLB assets with PBR textures.
          </p>
        </div>

        {/* Provider Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAF2E8] p-1 rounded-xl border border-[#E5D2BE] text-xs font-serif font-bold">
          <button
            onClick={() => {
              setProvider("TRIPO");
              setErrorMessage(null);
              setIsCreditShortage(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              provider === "TRIPO"
                ? "bg-[#641B24] text-white shadow-xs"
                : "text-[#7E6359] hover:text-[#3C211B]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tripo Studio (Official API)</span>
          </button>
          <button
            onClick={() => {
              setProvider("TRELLIS.2");
              setErrorMessage(null);
              setIsCreditShortage(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              provider === "TRELLIS.2"
                ? "bg-[#641B24] text-white shadow-xs"
                : "text-[#7E6359] hover:text-[#3C211B]"
            }`}
          >
            TRELLIS.2 (Hosted)
          </button>
          <button
            onClick={() => {
              setProvider("MANUAL_UPLOAD");
              setErrorMessage(null);
              setIsCreditShortage(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              provider === "MANUAL_UPLOAD"
                ? "bg-[#641B24] text-white shadow-xs"
                : "text-[#7E6359] hover:text-[#3C211B]"
            }`}
          >
            Direct GLB Upload
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Upload & Parameters, Right 3D Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================================================================ */}
        {/* LEFT COLUMN: PHOTOGRAPH UPLOAD & CALIBRATION (COL-SPAN-5)        */}
        {/* ================================================================ */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* 1. Upload Photograph Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <h4 className="font-serif text-sm font-bold text-[#3C211B] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#B58A4D]" />
              <span>1. Reference Photograph &amp; Source</span>
            </h4>

            {/* Image Preview & Upload Dropzone */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-[#B58A4D]/40 bg-[#FAF2E8]/40 flex flex-col items-center justify-center p-2 group">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Reference Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <Upload className="w-8 h-8 text-[#B58A4D] mb-2" />
                  <span className="text-xs font-serif font-bold text-[#3C211B]">Upload Pendant Photograph</span>
                  <span className="text-[10px] text-[#7E6359]">JPG, PNG, WEBP (Max 20MB)</span>
                </div>
              )}

              <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-serif font-bold">
                <Upload className="w-6 h-6 mb-1" />
                <span>Replace Photograph</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Provider Options / Model Selector */}
            {provider === "TRIPO" ? (
              <div className="p-3 rounded-xl bg-[#FAF2E8]/60 border border-[#E5D2BE] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-serif font-bold text-[#3C211B] flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-[#1C5237]" />
                    <span>Tripo v3 AI Architecture</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#1C5237] font-bold bg-[#1C5237]/10 px-2 py-0.5 rounded-full border border-[#1C5237]/20">
                    API Key Active (Server-Side)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                  <div>
                    <label className="text-[10px] text-[#7E6359] block mb-1">Model Version</label>
                    <select
                      value={tripoModel}
                      onChange={(e) => setTripoModel(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5D2BE] bg-white text-xs font-mono"
                    >
                      <option value="v3.1-20260211">v3.1 (Flagship H-Series)</option>
                      <option value="v3.0-20250812">v3.0 (High-Precision)</option>
                      <option value="P1-20260311">P1 (Clean Topology)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#7E6359] block mb-1">PBR Geometry</label>
                    <div className="px-2.5 py-1.5 rounded-lg border border-[#E5D2BE] bg-white text-xs font-mono text-[#3C211B]">
                      Detailed + PBR
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#7E6359] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#1C5237]" />
                  <span>Watertight mesh, high-poly micro-filigree &amp; automatic image pre-cleaning enabled.</span>
                </div>
              </div>
            ) : provider === "TRELLIS.2" ? (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-serif font-bold text-[#7E6359] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-[#B58A4D]" />
                    <span>Hugging Face Access Token (Optional)</span>
                  </span>
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#641B24] hover:underline"
                  >
                    Get free token →
                  </a>
                </label>
                <input
                  type="password"
                  placeholder="hf_..."
                  value={hfToken}
                  onChange={(e) => setHfToken(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 font-mono text-xs focus:outline-[#641B24]"
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FAF2E8]/60 border border-[#E5D2BE] flex flex-col gap-1.5">
                <span className="text-[11px] font-serif font-bold text-[#3C211B] flex items-center gap-1">
                  <FileBox className="w-3.5 h-3.5 text-[#641B24]" />
                  <span>Direct 3D Model Upload (.glb / .gltf)</span>
                </span>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleGlbFileChange}
                  className="text-xs font-serif file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-[#641B24] file:text-white hover:file:bg-[#B58A4D] cursor-pointer"
                />
                {selectedGlbFile && (
                  <span className="text-[10px] font-mono text-[#1C5237] font-bold">
                    ✔ Selected: {selectedGlbFile.name} ({(selectedGlbFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. Physical Caliper Dimensions & Metadata */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5D2BE] shadow-atelier flex flex-col gap-4">
            <h4 className="font-serif text-sm font-bold text-[#3C211B] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#641B24]" />
              <span>2. Caliper Dimensions &amp; Specifications</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs font-serif">
              <div>
                <label className="block text-[#7E6359] mb-1 font-bold">Component SKU *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 font-mono text-xs focus:outline-[#641B24]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#7E6359] mb-1 font-bold">Asset Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 text-xs focus:outline-[#641B24]"
                  required
                />
              </div>
            </div>

            {/* Caliper 3-Axis Measurement */}
            <div className="grid grid-cols-3 gap-2 text-center font-serif">
              <div className="p-2 rounded-xl bg-[#FAF2E8]/50 border border-[#E5D2BE]">
                <label className="text-[10px] text-[#7E6359] block">Width (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={widthMm}
                  onChange={(e) => setWidthMm(parseFloat(e.target.value) || 0)}
                  className="w-full text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-2 rounded-xl bg-[#FAF2E8]/50 border border-[#E5D2BE]">
                <label className="text-[10px] text-[#7E6359] block">Height (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={heightMm}
                  onChange={(e) => setHeightMm(parseFloat(e.target.value) || 0)}
                  className="w-full text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-2 rounded-xl bg-[#FAF2E8]/50 border border-[#E5D2BE]">
                <label className="text-[10px] text-[#7E6359] block">Depth (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={depthMm}
                  onChange={(e) => setDepthMm(parseFloat(e.target.value) || 0)}
                  className="w-full text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-serif">
              <div>
                <label className="block text-[#7E6359] mb-1">Net Weight (grams)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[#7E6359] mb-1">Base Price (INR ₹)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5D2BE] bg-[#FAF2E8]/30 font-mono text-xs"
                />
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-full mt-2 py-3 rounded-full bg-[#641B24] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#B58A4D] disabled:opacity-50 transition-colors shadow-md"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing 3D Model ({progressPercent}%)...</span>
                </>
              ) : selectedGlbFile ? (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Validate &amp; Ingest Uploaded GLB</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 3D Model with {provider === "TRIPO" ? "Tripo Studio" : provider}</span>
                </>
              )}
            </button>

            {/* Progress Status Bar */}
            {isGenerating && (
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="w-full bg-[#FAF2E8] rounded-full h-2 overflow-hidden border border-[#E5D2BE]">
                  <div
                    className="bg-[#641B24] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#7E6359] font-serif">{statusMessage}</span>
              </div>
            )}

            {/* Credit Shortage Action Banner */}
            {isCreditShortage && (
              <div className="p-3 bg-[#FAF2E8] border border-[#B58A4D] rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#3C211B]">
                  <AlertTriangle className="w-4 h-4 text-[#B58A4D]" />
                  <span>Tripo Studio Credits Required</span>
                </div>
                <p className="text-[11px] text-[#7E6359] leading-relaxed">
                  Your Tripo API key is verified, but the account has 0 remaining generation credits. You can recharge at Tripo Studio or seamlessly switch to Direct GLB Upload or TRELLIS.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://platform.tripo3d.ai/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full bg-[#B58A4D] text-white text-[10px] font-serif font-bold hover:bg-[#641B24] transition-colors"
                  >
                    Recharge Tripo Credits ↗
                  </a>
                  <button
                    onClick={() => {
                      setProvider("MANUAL_UPLOAD");
                      setErrorMessage(null);
                      setIsCreditShortage(false);
                    }}
                    className="px-3 py-1 rounded-full border border-[#B58A4D] text-[#3C211B] text-[10px] font-serif hover:bg-[#FAF2E8] transition-colors"
                  >
                    Switch to Direct Upload
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && !isCreditShortage && (
              <div className="p-3 bg-[#641B24]/10 border border-[#641B24]/30 rounded-xl text-xs text-[#641B24] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Generation Notice:</span>
                  <span className="text-[11px] leading-relaxed">{errorMessage}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: INTERACTIVE 3D INSPECTION VIEWPORT (COL-SPAN-7)   */}
        {/* ================================================================ */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#E5D2BE] shadow-atelier p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-base font-bold text-[#3C211B]">
                3D Model Inspection &amp; Caliper Verification
              </h4>
              <p className="text-xs text-[#7E6359]">
                Inspect high-poly geometry, watertight surface, PBR textures, and dual attachment bails
              </p>
            </div>

            {/* Camera Presets */}
            <div className="flex items-center gap-1 bg-[#FAF2E8] p-1 rounded-xl border border-[#E5D2BE] text-[11px] font-serif">
              {(["front", "back", "side", "macro"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCameraView(view)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    cameraPreset === view ? "bg-[#641B24] text-white shadow-xs" : "text-[#7E6359] hover:text-[#3C211B]"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive WebGL 3D Canvas */}
          <div className="relative w-full h-[480px] bg-gradient-to-b from-[#FAF4EC] via-[#EFE4D6] to-[#E3D1BE] rounded-2xl overflow-hidden border border-[#E5D2BE]/60">
            {generatedGlbUrl ? (
              <Canvas
                camera={{ position: [0, 0, 1.8], fov: 38 }}
                shadows
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={1.1} color="#FFFDF5" />
                  <directionalLight position={[3, 4, 3]} intensity={2.0} color="#FFF8EA" castShadow />
                  <directionalLight position={[-3, 2, 2]} intensity={1.0} color="#F2E4D4" />
                  <pointLight position={[0, 0, 2.0]} intensity={1.2} color="#FFFBF2" />

                  {/* Floor Shadow & Grid */}
                  <ContactShadows position={[0, -0.42, 0]} opacity={0.45} scale={2.5} blur={1.8} color="#4A281E" />
                  <Grid position={[0, -0.42, 0]} args={[1.5, 1.5]} cellColor="#B58A4D" sectionColor="#641B24" fadeDistance={2.0} />

                  {/* Rendered GLB Model */}
                  <group position={[0, 0, 0]}>
                    <JewelleryAssetModel
                      modelUrl={generatedGlbUrl}
                      scale={1.2}
                      castShadow
                      receiveShadow
                      highlightSockets={highlightSockets}
                      fallbackLabel={name}
                    />
                  </group>

                  <OrbitControls
                    ref={controlsRef}
                    enableDamping
                    dampingFactor={0.08}
                    enablePan={false}
                    minDistance={0.5}
                    maxDistance={4.0}
                  />
                </Suspense>
              </Canvas>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#7E6359]">
                <Layers className="w-12 h-12 text-[#B58A4D] mb-2 animate-pulse" />
                <span className="font-serif font-bold text-sm text-[#3C211B]">No 3D Model Loaded</span>
                <span className="text-xs max-w-xs mt-1">Upload an image or GLB file to generate and inspect geometry.</span>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-3 left-3 bg-[#FAF2E8]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#3C211B] font-serif border border-[#B58A4D]/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1C5237]" />
              <span>Model: {generatedGlbUrl ? generatedGlbUrl.split("/").pop() : "None"}</span>
            </div>

            <div className="absolute bottom-3 left-3 bg-[#FAF2E8]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#7E6359] font-serif border border-[#B58A4D]/30">
              Drag to orbit 360° • Scroll to zoom
            </div>

            {/* Socket Toggle */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setHighlightSockets((prev) => !prev)}
                className={`px-3 py-1 rounded-full text-[10px] font-serif border transition-all flex items-center gap-1.5 ${
                  highlightSockets
                    ? "bg-[#1C5237] text-white border-[#1C5237]"
                    : "bg-[#FAF2E8] text-[#7E6359] border-[#E5D2BE]"
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>{highlightSockets ? "Sockets: ON" : "Sockets: OFF"}</span>
              </button>
            </div>
          </div>

          {/* Caliper Verification & Approval Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF2E8]/50 border border-[#E5D2BE]">
            <div className="flex items-center gap-4">
              <div>
                <span className="block text-[10px] text-[#7E6359] font-serif">Calibrated Dimensions</span>
                <span className="font-mono text-xs font-bold text-[#3C211B]">
                  {widthMm} × {heightMm} × {depthMm} mm
                </span>
              </div>
              <div className="h-6 w-px bg-[#E5D2BE]" />
              <div>
                <span className="block text-[10px] text-[#7E6359] font-serif">Gold &amp; Gems</span>
                <span className="font-mono text-xs font-bold text-[#641B24]">
                  {weightGrams}g ({metalType})
                </span>
              </div>
              <div className="h-6 w-px bg-[#E5D2BE]" />
              <div>
                <span className="block text-[10px] text-[#7E6359] font-serif">Dual Top Bails</span>
                <span className="font-mono text-xs font-bold text-[#1C5237]">
                  socket_bail_left / right
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {generatedGlbUrl && (
                <a
                  href={generatedGlbUrl}
                  download={`${sku}.glb`}
                  className="px-4 py-2 rounded-full border border-[#B58A4D] bg-white text-[#3C211B] text-xs font-serif font-bold flex items-center gap-1.5 hover:bg-[#FAF2E8] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#B58A4D]" />
                  <span>Download GLB</span>
                </a>
              )}

              <button
                onClick={handleSaveToAtelier}
                disabled={!generatedGlbUrl || isSavedToAtelier}
                className={`px-5 py-2 rounded-full text-xs font-serif font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
                  isSavedToAtelier
                    ? "bg-[#1C5237] text-white"
                    : "bg-[#641B24] text-white hover:bg-[#B58A4D]"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSavedToAtelier ? "Published to Atelier ✔" : "Approve & Save Asset"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
