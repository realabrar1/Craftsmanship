import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";

// Node.js FileReader shim for Three.js GLTFExporter
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");

function exportGLB(scene, outputPath) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (glb) => {
        fs.writeFileSync(outputPath, Buffer.from(glb));
        console.log(`Exported GLB -> ${outputPath} (${glb.byteLength} bytes)`);
        resolve(glb);
      },
      (err) => reject(err),
      { binary: true, embedImages: true }
    );
  });
}

// =========================================================================
// 1. GENERATE GODDESS LAKSHMI TEMPLE PENDANT (PEN-LAKSHMI-01)
// =========================================================================
function createLakshmiTemplePendant() {
  const root = new THREE.Group();
  root.name = "LakshmiTemplePendant";

  // --- PBR Materials ---
  const goldAntique = new THREE.MeshStandardMaterial({
    name: "22K_Antique_Temple_Gold",
    color: new THREE.Color(0xd4af37),
    metalness: 0.90,
    roughness: 0.25,
  });

  const goldPolished = new THREE.MeshStandardMaterial({
    name: "22K_Polished_Gold",
    color: new THREE.Color(0xe5c158),
    metalness: 0.95,
    roughness: 0.16,
  });

  const kempRuby = new THREE.MeshPhysicalMaterial({
    name: "Natural_Kemp_Ruby",
    color: new THREE.Color(0x9e0b29),
    metalness: 0.08,
    roughness: 0.12,
    transmission: 0.70,
    ior: 1.76,
    thickness: 0.15,
  });

  const kempEmerald = new THREE.MeshPhysicalMaterial({
    name: "Zambian_Kemp_Emerald",
    color: new THREE.Color(0x0c6b3e),
    metalness: 0.08,
    roughness: 0.14,
    transmission: 0.65,
    ior: 1.58,
    thickness: 0.15,
  });

  const pearlMoti = new THREE.MeshStandardMaterial({
    name: "Basra_Pearl_Nacre",
    color: new THREE.Color(0xfcf9f2),
    metalness: 0.12,
    roughness: 0.22,
  });

  const polkiCrystal = new THREE.MeshPhysicalMaterial({
    name: "Polki_Rock_Crystal",
    color: new THREE.Color(0xf5f5f7),
    metalness: 0.18,
    roughness: 0.08,
    transmission: 0.85,
    ior: 1.54,
  });

  // --- A. REVERSE BACKPLATE & CAVITY (Authentic Backside Construction) ---
  const backplateGroup = new THREE.Group();
  backplateGroup.name = "ReverseBackplate_Assembly";

  // Sculpted outer backplate with hollowed relief cavity
  const backplateGeom = new THREE.CylinderGeometry(0.24, 0.27, 0.025, 48);
  const backplateMesh = new THREE.Mesh(backplateGeom, goldAntique);
  backplateMesh.name = "Backplate_Bezel_Base";
  backplateMesh.position.set(0, 0, -0.015);
  backplateMesh.rotation.x = Math.PI / 2;
  backplateGroup.add(backplateMesh);

  // Hollowed inner reverse cavity
  const cavityGeom = new THREE.CylinderGeometry(0.20, 0.23, 0.018, 36);
  const cavityMesh = new THREE.Mesh(cavityGeom, goldAntique);
  cavityMesh.name = "Reverse_Hollow_Cavity";
  cavityMesh.position.set(0, 0, -0.022);
  cavityMesh.rotation.x = Math.PI / 2;
  backplateGroup.add(cavityMesh);

  // Goldsmith hallmark plate (916 BIS Hallmark Stamped Plaque on Reverse)
  const hallmarkGeom = new THREE.BoxGeometry(0.12, 0.04, 0.006);
  const hallmarkMesh = new THREE.Mesh(hallmarkGeom, goldPolished);
  hallmarkMesh.name = "Hallmark_916_Plaque";
  hallmarkMesh.position.set(0, -0.04, -0.026);
  backplateGroup.add(hallmarkMesh);

  // --- B. DUAL TOP BAILS (Physical Loops & Sockets) ---
  const bailGeom = new THREE.TorusGeometry(0.032, 0.009, 16, 32);
  
  // Left bail
  const leftBail = new THREE.Mesh(bailGeom, goldPolished);
  leftBail.name = "Bail_Left_Physical";
  leftBail.position.set(-0.095, 0.285, 0.01);
  leftBail.rotation.y = Math.PI / 2;
  backplateGroup.add(leftBail);

  // Right bail
  const rightBail = new THREE.Mesh(bailGeom, goldPolished);
  rightBail.name = "Bail_Right_Physical";
  rightBail.position.set(0.095, 0.285, 0.01);
  rightBail.rotation.y = Math.PI / 2;
  backplateGroup.add(rightBail);

  // Center top loop
  const centerLoop = new THREE.Mesh(bailGeom, goldPolished);
  centerLoop.name = "Bail_Center_Physical";
  centerLoop.position.set(0, 0.31, 0.005);
  centerLoop.rotation.y = Math.PI / 2;
  backplateGroup.add(centerLoop);

  // Named attachment socket Object3D nodes for procedural stringing
  const socketBailLeft = new THREE.Object3D();
  socketBailLeft.name = "socket_bail_left";
  socketBailLeft.position.set(-0.095, 0.285, 0.01);
  root.add(socketBailLeft);

  const socketBailRight = new THREE.Object3D();
  socketBailRight.name = "socket_bail_right";
  socketBailRight.position.set(0.095, 0.285, 0.01);
  root.add(socketBailRight);

  const socketCenterTop = new THREE.Object3D();
  socketCenterTop.name = "socket_center_top";
  socketCenterTop.position.set(0, 0.31, 0.005);
  root.add(socketCenterTop);

  root.add(backplateGroup);

  // --- C. MAKARA / TEMPLE ARCH CREST (Sculpted Front Relief) ---
  const archGroup = new THREE.Group();
  archGroup.name = "TempleArch_Makara";

  // Stepped Arch Rim
  const archRimGeom = new THREE.TorusGeometry(0.24, 0.022, 16, 48, Math.PI * 1.15);
  const archRim = new THREE.Mesh(archRimGeom, goldAntique);
  archRim.name = "Arch_Moulding_Outer";
  archRim.position.set(0, 0.05, 0.01);
  archRim.rotation.z = -Math.PI * 0.075;
  archGroup.add(archRim);

  // Beaded Granulation Border along arch
  for (let i = 0; i < 28; i++) {
    const angle = (i / 27) * Math.PI * 1.15 - Math.PI * 0.075;
    const r = 0.27;
    const bx = Math.cos(angle) * r;
    const by = Math.sin(angle) * r + 0.05;
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 12), goldPolished);
    bead.name = `Arch_Granule_${i + 1}`;
    bead.position.set(bx, by, 0.012);
    archGroup.add(bead);
  }

  // Crest Finial with Top Teardrop Kemp Ruby
  const finialBase = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.08, 16), goldAntique);
  finialBase.name = "Crest_Finial_Cone";
  finialBase.position.set(0, 0.28, 0.018);
  archGroup.add(finialBase);

  const crestGem = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), kempRuby);
  crestGem.name = "Crest_Gem_Ruby";
  crestGem.position.set(0, 0.26, 0.03);
  crestGem.scale.set(0.85, 1.3, 0.7);
  archGroup.add(crestGem);

  root.add(archGroup);

  // --- D. LOTUS THRONE (PADMA PEEDAM) ---
  const lotusGroup = new THREE.Group();
  lotusGroup.name = "PadmaPeedam_LotusThrone";

  // Tiered base plinth
  const plinthGeom = new THREE.CylinderGeometry(0.18, 0.21, 0.035, 32);
  const plinth = new THREE.Mesh(plinthGeom, goldAntique);
  plinth.name = "Lotus_Plinth_Base";
  plinth.position.set(0, -0.16, 0.018);
  plinth.rotation.x = Math.PI / 2;
  lotusGroup.add(plinth);

  // 14 Sculpted Lotus Petals curving upward
  for (let p = 0; p < 14; p++) {
    const angle = (p / 13) * Math.PI - Math.PI;
    const px = Math.cos(angle) * 0.17;
    const py = -0.16 + Math.sin(angle) * 0.06;
    const petalGeom = new THREE.ConeGeometry(0.022, 0.055, 12);
    const petal = new THREE.Mesh(petalGeom, goldPolished);
    petal.name = `Lotus_Petal_${p + 1}`;
    petal.position.set(px, py + 0.02, 0.028);
    petal.rotation.z = angle + Math.PI / 2;
    petal.rotation.x = -0.25;
    lotusGroup.add(petal);
  }

  root.add(lotusGroup);

  // --- E. SCULPTED GODDESS LAKSHMI (Murti Relief) ---
  const goddessGroup = new THREE.Group();
  goddessGroup.name = "GoddessLakshmi_Sculpture";

  // Seated Torso & Robes (Dhoti and Angavastram)
  const torsoGeom = new THREE.CylinderGeometry(0.065, 0.085, 0.11, 24);
  const torso = new THREE.Mesh(torsoGeom, goldAntique);
  torso.name = "Goddess_Torso";
  torso.position.set(0, -0.04, 0.03);
  goddessGroup.add(torso);

  // Crossed Legs in Padmasana
  const legsGeom = new THREE.TorusGeometry(0.095, 0.032, 16, 32, Math.PI);
  const legs = new THREE.Mesh(legsGeom, goldAntique);
  legs.name = "Goddess_Padmasana_Legs";
  legs.position.set(0, -0.11, 0.035);
  legs.rotation.x = 0.35;
  goddessGroup.add(legs);

  // Divine Head & Facial Contour
  const headGeom = new THREE.SphereGeometry(0.048, 24, 24);
  const head = new THREE.Mesh(headGeom, goldPolished);
  head.name = "Goddess_Head";
  head.position.set(0, 0.05, 0.042);
  head.scale.set(0.9, 1.1, 0.85);
  goddessGroup.add(head);

  // Ornate Temple Crown (Kiritamukuta)
  const crownGeom = new THREE.ConeGeometry(0.042, 0.09, 20);
  const crown = new THREE.Mesh(crownGeom, goldPolished);
  crown.name = "Goddess_Crown_Kiritamukuta";
  crown.position.set(0, 0.12, 0.045);
  crown.rotation.x = -0.1;
  goddessGroup.add(crown);

  // Prabhavali Halo behind head
  const haloGeom = new THREE.TorusGeometry(0.075, 0.012, 16, 32);
  const halo = new THREE.Mesh(haloGeom, goldAntique);
  halo.name = "Goddess_Prabhavali_Halo";
  halo.position.set(0, 0.06, 0.022);
  goddessGroup.add(halo);

  // 4 Arms & Sacred Lotus Blossoms
  // Upper Left Arm holding Lotus
  const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.08, 12), goldAntique);
  upperArmL.name = "Arm_Upper_Left";
  upperArmL.position.set(-0.072, 0.025, 0.028);
  upperArmL.rotation.z = 0.55;
  goddessGroup.add(upperArmL);

  const lotusBudL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), kempRuby);
  lotusBudL.name = "Lotus_Bud_Upper_Left";
  lotusBudL.position.set(-0.095, 0.075, 0.032);
  goddessGroup.add(lotusBudL);

  // Upper Right Arm holding Lotus
  const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.08, 12), goldAntique);
  upperArmR.name = "Arm_Upper_Right";
  upperArmR.position.set(0.072, 0.025, 0.028);
  upperArmR.rotation.z = -0.55;
  goddessGroup.add(upperArmR);

  const lotusBudR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), kempRuby);
  lotusBudR.name = "Lotus_Bud_Upper_Right";
  lotusBudR.position.set(0.095, 0.075, 0.032);
  goddessGroup.add(lotusBudR);

  // Lower Left Arm (Varada Mudra / Boon Blessing)
  const lowerArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.07, 12), goldAntique);
  lowerArmL.name = "Arm_Lower_Left_Varada";
  lowerArmL.position.set(-0.055, -0.05, 0.045);
  lowerArmL.rotation.z = -0.3;
  goddessGroup.add(lowerArmL);

  // Lower Right Arm (Abhaya Mudra / Fearlessness Blessing)
  const lowerArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.07, 12), goldAntique);
  lowerArmR.name = "Arm_Lower_Right_Abhaya";
  lowerArmR.position.set(0.055, -0.04, 0.048);
  lowerArmR.rotation.z = 0.35;
  lowerArmR.rotation.x = -0.25;
  goddessGroup.add(lowerArmR);

  root.add(goddessGroup);

  // --- F. AUTHENTIC GEM BEZEL CUPS (14 Kemp Cabochons) ---
  const bezelsGroup = new THREE.Group();
  bezelsGroup.name = "KempGemstone_Bezels";

  // Halo Border Bezels (6 Rubies, 2 Emeralds)
  const gemPositions = [
    { x: -0.19, y: 0.12, z: 0.025, mat: kempRuby, name: "Gem_Halo_Ruby_L1" },
    { x: -0.15, y: 0.20, z: 0.025, mat: kempEmerald, name: "Gem_Halo_Emerald_L2" },
    { x: -0.08, y: 0.24, z: 0.025, mat: kempRuby, name: "Gem_Halo_Ruby_L3" },
    { x: 0.08, y: 0.24, z: 0.025, mat: kempRuby, name: "Gem_Halo_Ruby_R3" },
    { x: 0.15, y: 0.20, z: 0.025, mat: kempEmerald, name: "Gem_Halo_Emerald_R2" },
    { x: 0.19, y: 0.12, z: 0.025, mat: kempRuby, name: "Gem_Halo_Ruby_R1" },
    // Lotus Base Bezels (4 Rubies, 2 Emeralds)
    { x: -0.14, y: -0.14, z: 0.032, mat: kempRuby, name: "Gem_Base_Ruby_1" },
    { x: -0.07, y: -0.15, z: 0.034, mat: kempEmerald, name: "Gem_Base_Emerald_2" },
    { x: 0.0, y: -0.155, z: 0.035, mat: polkiCrystal, name: "Gem_Base_Polki_Center" },
    { x: 0.07, y: -0.15, z: 0.034, mat: kempEmerald, name: "Gem_Base_Emerald_4" },
    { x: 0.14, y: -0.14, z: 0.032, mat: kempRuby, name: "Gem_Base_Ruby_5" },
    // Arch Accent Bezels
    { x: -0.21, y: 0.0, z: 0.025, mat: kempRuby, name: "Gem_Arch_Ruby_Left" },
    { x: 0.21, y: 0.0, z: 0.025, mat: kempRuby, name: "Gem_Arch_Ruby_Right" },
  ];

  gemPositions.forEach((g) => {
    // Bezel cup
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.025, 0.012, 16), goldPolished);
    cup.position.set(g.x, g.y, g.z);
    cup.rotation.x = Math.PI / 2;
    cup.name = `${g.name}_BezelCup`;
    bezelsGroup.add(cup);

    // Gem cabochon dome
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), g.mat);
    cab.position.set(g.x, g.y, g.z + 0.008);
    cab.scale.set(1.0, 1.0, 0.55);
    cab.name = g.name;
    bezelsGroup.add(cab);
  });

  root.add(bezelsGroup);

  // --- G. 7 DANGLING PEARL JHUMKAS (Moti Drops) ---
  const jhumkaGroup = new THREE.Group();
  jhumkaGroup.name = "DanglingPearl_Jhumkas_7";

  const jhumkaSpacing = 0.052;
  for (let j = 0; j < 7; j++) {
    const x = (j - 3) * jhumkaSpacing;
    const yCurve = -0.19 - Math.cos((j - 3) * 0.45) * 0.025;

    const jGroup = new THREE.Group();
    jGroup.name = `Jhumka_Drop_${j + 1}`;
    jGroup.position.set(x, yCurve, 0.015);

    // Gold Suspension Ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.010, 0.003, 12, 16), goldPolished);
    ring.rotation.y = Math.PI / 2;
    jGroup.add(ring);

    // Gold Bell Cap with Filigree Scallops
    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.022, 16), goldAntique);
    bell.position.set(0, -0.016, 0);
    bell.rotation.x = Math.PI;
    jGroup.add(bell);

    // Lustrous Teardrop Basra Pearl
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.020, 20, 20), pearlMoti);
    pearl.name = `Pearl_Moti_${j + 1}`;
    pearl.position.set(0, -0.038, 0);
    pearl.scale.set(0.9, 1.35, 0.9);
    jGroup.add(pearl);

    // Gold Pin Bottom Granule
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 8), goldPolished);
    pin.position.set(0, -0.058, 0);
    jGroup.add(pin);

    jhumkaGroup.add(jGroup);
  }

  root.add(jhumkaGroup);

  return root;
}

// =========================================================================
// 2. GENERATE KUNDAN 5-STRAND CONNECTOR SPACER BAR (CON-RECT-01)
// =========================================================================
function createKundanConnector() {
  const root = new THREE.Group();
  root.name = "KundanConnectorBar_5Loop";

  const goldKundan = new THREE.MeshStandardMaterial({
    name: "24K_Kundan_Gold_Leaf",
    color: new THREE.Color(0xdab042),
    metalness: 0.92,
    roughness: 0.20,
  });

  const goldPolished = new THREE.MeshStandardMaterial({
    name: "22K_Polished_Gold",
    color: new THREE.Color(0xe5c158),
    metalness: 0.95,
    roughness: 0.16,
  });

  const polkiCrystal = new THREE.MeshPhysicalMaterial({
    name: "Polki_Crystal",
    color: new THREE.Color(0xf6f6f9),
    metalness: 0.2,
    roughness: 0.08,
    transmission: 0.85,
    ior: 1.54,
  });

  const kempEmerald = new THREE.MeshPhysicalMaterial({
    name: "Kemp_Emerald",
    color: new THREE.Color(0x0c6b3e),
    metalness: 0.08,
    roughness: 0.14,
    transmission: 0.65,
    ior: 1.58,
  });

  // Main Rectangular Bar Chassis (48mm x 12mm x 6.5mm calibrated)
  const chassisGeom = new THREE.BoxGeometry(0.24, 0.065, 0.024);
  const chassis = new THREE.Mesh(chassisGeom, goldKundan);
  chassis.name = "Connector_Chassis";
  root.add(chassis);

  // Beaded Filigree Border Frame
  for (let i = 0; i < 18; i++) {
    const x = -0.115 + (i / 17) * 0.23;
    const topBead = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 8), goldPolished);
    topBead.position.set(x, 0.034, 0.012);
    root.add(topBead);

    const btmBead = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 8), goldPolished);
    btmBead.position.set(x, -0.034, 0.012);
    root.add(btmBead);
  }

  // 5 Central Kundan Gemstone Bezels (3 Polki, 2 Emerald Teardrops)
  const gems = [
    { x: -0.08, mat: polkiCrystal, scale: [1, 1, 0.6], name: "Polki_Left_Outer" },
    { x: -0.04, mat: kempEmerald, scale: [0.8, 1.2, 0.6], name: "Emerald_Left" },
    { x: 0.0, mat: polkiCrystal, scale: [1.3, 1.3, 0.6], name: "Polki_Center" },
    { x: 0.04, mat: kempEmerald, scale: [0.8, 1.2, 0.6], name: "Emerald_Right" },
    { x: 0.08, mat: polkiCrystal, scale: [1, 1, 0.6], name: "Polki_Right_Outer" },
  ];

  gems.forEach((g) => {
    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.021, 0.012, 16), goldPolished);
    bezel.position.set(g.x, 0, 0.012);
    bezel.rotation.x = Math.PI / 2;
    root.add(bezel);

    const stone = new THREE.Mesh(new THREE.SphereGeometry(0.016, 16, 16), g.mat);
    stone.position.set(g.x, 0, 0.018);
    stone.scale.set(g.scale[0], g.scale[1], g.scale[2]);
    stone.name = g.name;
    root.add(stone);
  });

  // 5 Stringing Loops (named sockets loop_01 to loop_05)
  const loopGeom = new THREE.TorusGeometry(0.012, 0.0035, 12, 16);
  for (let l = 0; l < 5; l++) {
    const lx = -0.08 + l * 0.04;

    // Top loop
    const topLoop = new THREE.Mesh(loopGeom, goldPolished);
    topLoop.position.set(lx, 0.042, 0);
    topLoop.rotation.y = Math.PI / 2;
    topLoop.name = `Physical_Loop_Top_${l + 1}`;
    root.add(topLoop);

    // Bottom loop
    const btmLoop = new THREE.Mesh(loopGeom, goldPolished);
    btmLoop.position.set(lx, -0.042, 0);
    btmLoop.rotation.y = Math.PI / 2;
    btmLoop.name = `Physical_Loop_Btm_${l + 1}`;
    root.add(btmLoop);

    // Named socket node
    const socket = new THREE.Object3D();
    socket.name = `loop_0${l + 1}`;
    socket.position.set(lx, 0, 0);
    root.add(socket);
  }

  return root;
}

// =========================================================================
// 3. GENERATE FLORAL RUBY SIDE BROOCH (BRC-FLORAL-RUBY-02)
// =========================================================================
function createFloralRubyBrooch() {
  const root = new THREE.Group();
  root.name = "FloralRubyBrooch_32mm";

  const goldAntique = new THREE.MeshStandardMaterial({
    name: "22K_Antique_Gold",
    color: new THREE.Color(0xd4af37),
    metalness: 0.90,
    roughness: 0.25,
  });

  const goldPolished = new THREE.MeshStandardMaterial({
    name: "22K_Polished_Gold",
    color: new THREE.Color(0xe5c158),
    metalness: 0.95,
    roughness: 0.16,
  });

  const kempRuby = new THREE.MeshPhysicalMaterial({
    name: "Pigeon_Blood_Ruby",
    color: new THREE.Color(0x9e0b29),
    metalness: 0.08,
    roughness: 0.12,
    transmission: 0.70,
    ior: 1.76,
  });

  const kempEmerald = new THREE.MeshPhysicalMaterial({
    name: "Central_Emerald",
    color: new THREE.Color(0x0c6b3e),
    metalness: 0.08,
    roughness: 0.14,
    transmission: 0.65,
    ior: 1.58,
  });

  const seedPearl = new THREE.MeshStandardMaterial({
    name: "Seed_Pearl",
    color: new THREE.Color(0xfbf7ed),
    metalness: 0.10,
    roughness: 0.25,
  });

  // Central Gem Bezel & Dome
  const centerBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.052, 0.022, 24), goldPolished);
  centerBezel.position.set(0, 0, 0.01);
  centerBezel.rotation.x = Math.PI / 2;
  root.add(centerBezel);

  const centerGem = new THREE.Mesh(new THREE.SphereGeometry(0.042, 20, 20), kempEmerald);
  centerGem.name = "Central_Emerald_Cabochon";
  centerGem.position.set(0, 0, 0.022);
  centerGem.scale.set(1, 1, 0.65);
  root.add(centerGem);

  // 8 Surrounding Ruby Petals
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const px = Math.cos(angle) * 0.075;
    const py = Math.sin(angle) * 0.075;

    const petalCup = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.016, 16), goldPolished);
    petalCup.position.set(px, py, 0.008);
    petalCup.rotation.x = Math.PI / 2;
    root.add(petalCup);

    const petalRuby = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), kempRuby);
    petalRuby.position.set(px, py, 0.018);
    petalRuby.scale.set(1.2, 0.8, 0.6);
    petalRuby.rotation.z = angle;
    petalRuby.name = `Petal_Ruby_${i + 1}`;
    root.add(petalRuby);
  }

  // 16 Halo Seed Pearls
  for (let s = 0; s < 16; s++) {
    const angle = (s / 16) * Math.PI * 2;
    const sx = Math.cos(angle) * 0.115;
    const sy = Math.sin(angle) * 0.115;

    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.010, 12, 12), seedPearl);
    pearl.position.set(sx, sy, 0.006);
    pearl.name = `SeedPearl_${s + 1}`;
    root.add(pearl);
  }

  // Rear Tube Mounts & Named Sockets
  const tubeGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.08, 16);
  const leftTube = new THREE.Mesh(tubeGeom, goldAntique);
  leftTube.position.set(-0.04, 0, -0.018);
  root.add(leftTube);

  const rightTube = new THREE.Mesh(tubeGeom, goldAntique);
  rightTube.position.set(0.04, 0, -0.018);
  root.add(rightTube);

  const socketRearLeft = new THREE.Object3D();
  socketRearLeft.name = "rear_tube_left";
  socketRearLeft.position.set(-0.04, 0, -0.018);
  root.add(socketRearLeft);

  const socketRearRight = new THREE.Object3D();
  socketRearRight.name = "rear_tube_right";
  socketRearRight.position.set(0.04, 0, -0.018);
  root.add(socketRearRight);

  return root;
}

// =========================================================================
// RUN EXPORTS
// =========================================================================
async function run() {
  console.log("Generating Authentic Sutra & Moti 3D GLB Assets...");

  // 1. Lakshmi Temple Pendant
  const pendantScene = new THREE.Scene();
  pendantScene.add(createLakshmiTemplePendant());
  await exportGLB(pendantScene, path.join("public", "assets", "jewellery", "pendants", "lakshmi-temple-pendant.glb"));

  // 2. Kundan 5-Loop Connector Bar
  const connectorScene = new THREE.Scene();
  connectorScene.add(createKundanConnector());
  await exportGLB(connectorScene, path.join("public", "assets", "jewellery", "connectors", "kundan-5loop-connector.glb"));

  // 3. Floral Ruby Brooch
  const broochScene = new THREE.Scene();
  broochScene.add(createFloralRubyBrooch());
  await exportGLB(broochScene, path.join("public", "assets", "jewellery", "brooches", "floral-ruby-brooch.glb"));

  console.log("All 3D GLB assets successfully generated and saved!");
}

run().catch((err) => {
  console.error("Asset generation error:", err);
  process.exit(1);
});
