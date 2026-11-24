# BeadsBliss — Parametric Jewellery Geometry Engine Specification

## 1. Physical Jewellery Principles

In authentic Indian jewellery craftsmanship (e.g. Panchlada or Satlada haars):
1. **Neck Circumference & Collar Line:** Necklaces rest over the clavicle and drape downward under gravity.
2. **Layer Separation & Drop Depth:** Each subsequent layer must be physically longer than the preceding layer (e.g. 17", 18.5", 20", 21.5", 23") to form concentric, non-intersecting catenary curves.
3. **Multi-Strand Connector Bars:** A connector bar (such as the 5-loop Kundan bar in Image 4 & Image 8) bridges all 5 parallel strands at a fixed transverse angle, holding the strands parallel while conforming to the chest curve.
4. **Bead Spacing & Arc Length:** Pearls are strung tightly on resham silk thread with knots or spacer beads. The number of beads along a curve is strictly governed by arc length:
   $$\text{Bead Count} = \left\lfloor \frac{\text{Arc Length}}{\text{Bead Diameter} + \text{Knot Spacing}} \right\rfloor$$
5. **Central Pendant Alignment:** Pendants attach to the lowest coordinate ($t = 0.5$ on a normalized parameter curve) of the central or innermost strand, orienting with gravity.

---

## 2. Mathematical Curve Formulation

The engine generates 3D draping curves using parametric cubic Catmull-Rom splines or elliptical catenary approximations.

For layer $i \in \{0, 1, \dots, L-1\}$ with layer index $i$ and layer spacing constant $\delta$:

### Anchor Points on Mannequin Collar:
- **Left Rear Closure:** $P_{rear, left} = (-R_{neck}, Y_{neck}, -Z_{neck})$
- **Right Rear Closure:** $P_{rear, right} = (R_{neck}, Y_{neck}, -Z_{neck})$
- **Left Shoulder Clavicle:** $P_{sh, left} = (-R_{clavicle} - i \cdot w_s, Y_{clavicle}, 0)$
- **Right Shoulder Clavicle:** $P_{sh, right} = (R_{clavicle} + i \cdot w_s, Y_{clavicle}, 0)$
- **Lowest Center Drop Point:**
  $$P_{center, i} = \left(0,\; Y_{drop0} - i \cdot \Delta y,\; Z_{forward0} + i \cdot \Delta z\right)$$

Where:
- $R_{clavicle} \approx 65\text{ mm}$ (mannequin bust radius)
- $w_s \approx 3.8\text{ mm}$ (strand transverse spacing at shoulder)
- $\Delta y \approx 14\text{ mm}$ (vertical drop separation per layer)
- $\Delta z \approx 4\text{ mm}$ (forward drape offset to prevent inter-layer penetration)

The curve is parameterized by $t \in [0, 1]$ where $t = 0$ is the left rear closure, $t = 0.5$ is the front center, and $t = 1.0$ is the right rear closure.

---

## 3. Instanced Bead Positioning & PBR Shading

To achieve 60 FPS performance on both desktop and mobile devices without sacrificing individual 3D bead geometry:
1. For each strand $i$, compute $N_i$ sample points uniformly spaced along the spline arc length.
2. At each sample point $k$, calculate the tangent vector $\vec{T}(t)$, normal vector $\vec{N}(t)$, and binormal $\vec{B}(t) = \vec{T}(t) \times \vec{N}(t)$.
3. Construct a local transformation matrix $M_k$:
   $$M_k = \begin{bmatrix} \vec{B}_x & \vec{N}_x & \vec{T}_x & P_x \\ \vec{B}_y & \vec{N}_y & \vec{T}_y & P_y \\ \vec{B}_z & \vec{N}_z & \vec{T}_z & P_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Feed $M_k$ into a `THREE.InstancedMesh` with:
   - **Sphere Geometry** (e.g. 16x16 segments) scaled to bead radius $r = d / 2$.
   - **PBR MeshStandardMaterial / MeshPhysicalMaterial:**
     - Natural freshwater pearl: `roughness = 0.22`, `metalness = 0.05`, `clearcoat = 0.8`, `color = #FAF5ED` or `#E8BDB5`.
     - Faceted ruby / emerald: `roughness = 0.12`, `metalness = 0.10`, `transmission = 0.6`.
     - Gold Nakshi beads: `roughness = 0.28`, `metalness = 0.88`, `color = #D4AF37`.

---

## 4. Multi-Strand Connector Bar Alignment Algorithm

A connector bar bridging strands $0$ through $K-1$ at curve parameter $t_{pos} \in [0.15, 0.45]$ (left) and $1 - t_{pos}$ (right):
1. Evaluate positions on all connected strands:
   $$P_0 = \text{Curve}_0(t_{pos}), \quad P_{K-1} = \text{Curve}_{K-1}(t_{pos})$$
2. The connector bar's center position is the midpoint:
   $$C_{connector} = \frac{P_0 + P_{K-1}}{2}$$
3. The bridge vector across the strands:
   $$\vec{V}_{bridge} = \frac{P_{K-1} - P_0}{\|P_{K-1} - P_0\|}$$
4. The tangent along the strand:
   $$\vec{V}_{tangent} = \frac{\vec{T}_0(t_{pos}) + \vec{T}_{K-1}(t_{pos})}{2}$$
5. The surface normal outward from the chest:
   $$\vec{V}_{normal} = \vec{V}_{bridge} \times \vec{V}_{tangent}$$
6. The orientation matrix of the connector bar is constructed from $[\vec{V}_{bridge}, \vec{V}_{tangent}, \vec{V}_{normal}]$.
7. The individual loops of the connector bar coincide exactly with the strand spline paths, preventing visual floating or misaligned stringing!

---

## 5. Collision & Sizing Feasibility Validation

The engine executes continuous geometric validation:
- **Loop Alignment Check:** Verifies that connector loop spacing matches the physical distance $\|P_j - P_{j-1}\|$ within an allowable tolerance ($\pm 1.2\text{ mm}$).
- **Inter-Layer Collision:** Checks minimum Euclidean distance between adjacent layers:
  $$\min_{t} \|\text{Curve}_{i}(t) - \text{Curve}_{i-1}(t)\| \ge \frac{d_i + d_{i-1}}{2} + \epsilon$$
- **Pendant Clearance:** Checks that the pendant bounding box does not intersect the lower strand layers when attached to upper layers.
