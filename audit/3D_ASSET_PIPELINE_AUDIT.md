# SUTRA & MOTI — 3D JEWELLERY ASSET PIPELINE AUDIT REPORT
## Architectural Evaluation: Procedural Geometry vs. Authentic 3D Asset Pipeline

**Atelier:** Sutra & Moti (beadsBliss Bespoke Pearl & Temple Jewellery Atelier)  
**Engineering Domain:** WebGL / Three.js Asset Ingestion, GLTF/GLB Pipeline & Parametric Assembly  
**Date of Audit:** November 20, 2026  
**Status:** **PHASE 1 COMPLETE — 0% REAL 3D ASSETS IDENTIFIED (REMEDIATION REQUIRED)**

---

## 1. EXECUTIVE AUDIT SUMMARY

An exhaustive technical inspection was performed on the Sutra & Moti 3D jewellery rendering engine and asset repository.

While the mathematical catenary draping algorithms, pricing breakdown, and responsive viewport framing operate reliably, **the entire visual presentation of jewellery components currently relies 100% on procedural JavaScript geometry composed of elementary Three.js primitives**.

No genuine external 3D assets (`.glb` or `.gltf`) currently exist in the repository. Intricate handcrafted temple jewellery—most notably the Goddess Lakshmi Temple Pendant and Kundan Jadau connector bars—is currently represented by stacked cylinders, toruses, cones, and spheres with basic materials.

---

## 2. COMPONENT-BY-COMPONENT IMPLEMENTATION BREAKDOWN

| Component File | Role in Customizer | Current Implementation Method | Actual 3D Asset or Procedural? | Tripo / 3D Asset Compatibility |
|---|---|---|---|---|
| `src/components/3d/PendantMesh.tsx` | Central focal hero pendant (`PEN-LAKSHMI-01`) | 1 cylinder backplate + 1 torus arch + 16 cone rays + 1 textured cylinder + 14 stone cylinders + 7 pearl drop groups | **100% Procedural Primitives** with 1 flat 2D image mapped to a disc | **NON-COMPLIANT:** Lacks sculpted 3D mesh, reverse cavity, true relief geometry |
| `src/components/3d/ConnectorMesh.tsx` | 5-loop Kundan connector bars & side brooches | `boxGeometry` + 10 `torusGeometry` eyelets + 3 `cylinderGeometry` stone bezels | **100% Procedural Primitives** | **NON-COMPLIANT:** Rigid geometric boxes rather than sculpted Kundan Jadau castings |
| `src/components/3d/BustMannequin.tsx` | Atelier display mannequin | 5 `cylinderGeometry` + 2 `sphereGeometry` + 2 `torusGeometry` | **100% Procedural Primitives** | **NON-COMPLIANT:** Approximate mannequin shape without sculpted velvet curvature |
| `src/components/3d/ProceduralStrand.tsx` | Multi-strand pearl & gemstone layers | Catenary spline calculation + `THREE.InstancedMesh` with `SphereGeometry` | **Procedural Instanced Geometry** | **COMPLIANT WITH PHASE 5:** High-performance instancing is appropriate for pearls along spline paths |
| `src/lib/jewellery-engine/curve-generator.ts` | 3D catenary draping curves | Cubic Catmull-Rom spline formulation with gravity drop | **Mathematical Spline Engine** | **COMPLIANT:** Necessary for continuous parameterization and dynamic layer spacing |
| `src/lib/jewellery-engine/attachment-math.ts` | Connector and pendant alignment | Orthonormal matrix basis `[binormal, tangent, normal]` | **Mathematical Attachment Engine** | **NEEDS UPGRADE:** Must support named 3D model sockets instead of arbitrary offsets |

---

## 3. ANSWERS TO SPECIFIC AUDIT QUESTIONS

### Question 1: Which jewellery components are generated using JavaScript geometry?
- **Pendant:** The Goddess Lakshmi pendant is generated entirely in code using 42 individual Three.js primitive meshes (`cylinderGeometry`, `torusGeometry`, `coneGeometry`, `sphereGeometry`).
- **Connector Bars:** The 5-strand Kundan bars are generated in code using boxes, cylinders, and toruses.
- **Side Brooches:** The floral Kundan brooches are generated using a central cylinder with 8 radial petal cylinders.
- **Mannequin Bust:** The mannequin is constructed from 7 geometric cylinders and spheres.
- **Strands:** Pearls are instanced spheres along procedural Catmull-Rom curves.

### Question 2: Which components load actual external 3D models?
- **None.** There is currently zero code in the entire repository that loads `.glb` or `.gltf` model files.

### Question 3: Whether any valid GLB/GLTF assets already exist?
- **None.** A global file system scan of `public/` and the root repository confirmed that zero `.glb` or `.gltf` files exist. The asset folders under `public/assets/` contain only 2D JPEG images cropped from reference photography.

### Question 4: Whether the existing model loader supports textures and material maps?
- **No model loader exists.** No GLTFLoader, DracoLoader, or `useGLTF` hook is currently instantiated. The only texture loading is a basic `THREE.TextureLoader` call in `PendantMesh.tsx` applying a diffuse texture to a flat cylinder. Normal maps, roughness maps, metallic maps, and ambient occlusion maps are not loaded.

### Question 5: Whether the current component architecture supports interchangeable 3D assets?
- **No.** The component architecture is tightly coupled to specific procedural meshes. There is no dynamic Asset Registry mapping SKU codes (`PEN-LAKSHMI-01`, `CON-RECT-01`, etc.) to asset metadata or external 3D file paths.

---

## 4. ARCHITECTURAL GAP ANALYSIS

```
CURRENT STATE (PROCEDURAL PRIMITIVES):
[User Selects SKU] ──► [Hardcoded React Component] ──► [Builds 40+ Three.js Primitives] ──► [Flat/Unrealistic 3D]

TARGET STATE (PROFESSIONAL 3D ASSET PIPELINE):
[User Selects SKU] ──► [Asset Registry Metadata] ──► [GLTF/GLB Model Loader (useGLTF)]
                                                              │
                                                              ▼
                                                   [Named Attachment Sockets]
                                                   (pendant_top_left, etc.)
                                                              │
                                                              ▼
                                                   [PBR Material Preservation]
                                                   (BaseColor, Normal, Roughness, Metalness)
                                                              │
                                                              ▼
                                                   [Parametric Spline Assembly]
```

---

## 5. RECONSTRUCTION ROADMAP

1. **Phase 2:** Establish structured asset directory (`public/assets/jewellery/`) and TypeScript `AssetRegistry` with socket metadata, physical dimensions, and SKU resolution.
2. **Phase 3:** Integrate a genuine, high-detail, fully sculpted Goddess Lakshmi Temple Pendant GLB model with true relief geometry, Makara arch, lotus throne, bezel settings, backside construction, and dual bail loops.
3. **Phase 4:** Upgrade attachment math to locate and snap to named 3D model sockets (`socket_bail_left`, `socket_bail_right`, `loop_01`..`05`).
4. **Phase 5:** Preserve high-performance instanced geometry exclusively for pearl stringing along catenary curves.
5. **Phase 6:** Configure professional PBR rendering with environment reflections and studio lighting.
6. **Phase 7 & 8:** Build an interactive Admin 3D Asset Studio (`/admin/assets`) supporting manual Tripo Studio GLB model ingestion, socket inspection, and asset approval.
7. **Phase 9:** Execute automated validation test suites and capture photographic verification evidence.
