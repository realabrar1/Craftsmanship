import os
from PIL import Image

USER_UPLOAD_DIR = r"C:\Users\admin\.gemini\antigravity\brain\126e87a5-d6d4-4ddb-8fa8-3d3122a6a4ae\.user_uploaded"
PUBLIC_DIR = r"c:\xampp\htdocs\Craftsmanship\public\assets"

os.makedirs(os.path.join(PUBLIC_DIR, "pendant"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "strands"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "connectors"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "accents"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "finishing"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "reference"), exist_ok=True)

# Map filenames
f_mockup = os.path.join(USER_UPLOAD_DIR, "media_1795109356293_08bc3175.jpg")
f_lakshmi = os.path.join(USER_UPLOAD_DIR, "media_1795109458827_65a6ebeb.jpg")
f_strands = os.path.join(USER_UPLOAD_DIR, "media_1795109575069_8071eaae.jpg")
f_connector_rect = os.path.join(USER_UPLOAD_DIR, "media_1795109750591_77b2f657.jpg")
f_brooches = os.path.join(USER_UPLOAD_DIR, "media_1795109931162_6366af6c.jpg")
f_finishing = os.path.join(USER_UPLOAD_DIR, "media_1795110057616_e107cfaa.jpg")
f_accents = os.path.join(USER_UPLOAD_DIR, "media_1795110057624_cc5d71d6.jpg")
f_connector_assembly = os.path.join(USER_UPLOAD_DIR, "media_1795110174629_5463733f.jpg")
f_three_necklaces = os.path.join(USER_UPLOAD_DIR, "media_1795110237247_e3a8d51e.jpg")
f_assembled_bust = os.path.join(USER_UPLOAD_DIR, "media_1795110311447_198edc0c.jpg")

# 1. Save reference mockup
if os.path.exists(f_mockup):
    im = Image.open(f_mockup)
    im.save(os.path.join(PUBLIC_DIR, "reference", "customizer-mockup-full.jpg"), quality=95)

# 2. Process Lakshmi Pendant (8-grid image: 2 cols x 4 rows)
if os.path.exists(f_lakshmi):
    im = Image.open(f_lakshmi)
    w, h = im.size
    # row 1: front, back
    im.crop((0, 0, w // 2, h // 4)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-front.jpg"), quality=95)
    im.crop((w // 2, 0, w, h // 4)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-back.jpg"), quality=95)
    # row 2: side profiles
    im.crop((0, h // 4, w // 2, h // 2)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-side-left.jpg"), quality=95)
    im.crop((w // 2, h // 4, w, h // 2)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-side-right.jpg"), quality=95)
    # row 3: 3/4 angle, top view
    im.crop((0, h // 2, w // 2, 3 * h // 4)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-angle.jpg"), quality=95)
    im.crop((w // 2, h // 2, w, 3 * h // 4)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-top.jpg"), quality=95)
    # row 4: closeups
    im.crop((0, 3 * h // 4, w // 2, h)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-detail.jpg"), quality=95)
    im.crop((w // 2, 3 * h // 4, w, h)).save(os.path.join(PUBLIC_DIR, "pendant", "lakshmi-temple-pendant-loop.jpg"), quality=95)

# 3. Process Strands image
if os.path.exists(f_strands):
    im = Image.open(f_strands)
    w, h = im.size
    im.save(os.path.join(PUBLIC_DIR, "strands", "hanging-rack-full.jpg"), quality=95)
    
    # The right strip shows 8 closeups of the 8 strands
    # Let's crop the 8 closeups on the right ~18% width
    strip_x = int(w * 0.82)
    names = [
        "white-freshwater-pearls",
        "pink-freshwater-pearls",
        "rice-pearls",
        "champagne-pearls",
        "faceted-ruby",
        "faceted-emerald",
        "oval-jade",
        "gold-nakshi-pearl"
    ]
    step_y = h / 8.0
    for idx, name in enumerate(names):
        y0 = int(idx * step_y)
        y1 = int((idx + 1) * step_y)
        crop_bead = im.crop((strip_x, y0, w, y1))
        crop_bead.save(os.path.join(PUBLIC_DIR, "strands", f"{name}.jpg"), quality=95)

# 4. Process Kundan Rectangle Connector Bar (6 views)
if os.path.exists(f_connector_rect):
    im = Image.open(f_connector_rect)
    w, h = im.size
    # row 1: Front, Back
    im.crop((0, 0, w // 2, h // 4)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-front.jpg"), quality=95)
    im.crop((w // 2, 0, w, h // 4)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-back.jpg"), quality=95)
    # row 2: Side top/bottom
    im.crop((0, h // 4, w // 2, h // 2)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-side1.jpg"), quality=95)
    im.crop((w // 2, h // 4, w, h // 2)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-side2.jpg"), quality=95)
    # row 3: Perspective, Macro Stones
    im.crop((0, h // 2, w // 2, 3 * h // 4)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-angle.jpg"), quality=95)
    im.crop((w // 2, h // 2, w, 3 * h // 4)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-stones.jpg"), quality=95)
    # row 4: Loops detail
    im.crop((0, 3 * h // 4, w // 2, h)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-loops-back.jpg"), quality=95)
    im.crop((w // 2, 3 * h // 4, w, h)).save(os.path.join(PUBLIC_DIR, "connectors", "kundan-5loop-bar-loops-front.jpg"), quality=95)

# 5. Process Brooches & Motifs
if os.path.exists(f_brooches):
    im = Image.open(f_brooches)
    w, h = im.size
    # 6 rows of motifs!
    # row 0: Floral Ruby Kundan Brooch
    # row 1: Round Lakshmi Brooch
    # row 2: Peacock Enamel Brooch
    # row 3: Teardrop Lakshmi Brooch
    # row 4: Emerald Center Floral Brooch
    # row 5: Pearl-edged Kundan Bar
    motif_names = [
        "floral-ruby-brooch",
        "round-lakshmi-brooch",
        "peacock-enamel-brooch",
        "teardrop-lakshmi-brooch",
        "emerald-center-floral-brooch",
        "pearl-edged-kundan-bar"
    ]
    rh = h / 6.0
    cw = w / 6.0
    for idx, name in enumerate(motif_names):
        ry0 = int(idx * rh)
        ry1 = int((idx + 1) * rh)
        # Front view is col 0
        im.crop((0, ry0, int(cw), ry1)).save(os.path.join(PUBLIC_DIR, "connectors", f"{name}.jpg"), quality=95)
        # Back view is col 1
        im.crop((int(cw), ry0, int(2 * cw), ry1)).save(os.path.join(PUBLIC_DIR, "connectors", f"{name}-back.jpg"), quality=95)

# 6. Process Finishing & Closures
if os.path.exists(f_finishing):
    im = Image.open(f_finishing)
    w, h = im.size
    # Row 1: S-hook clasp, screw cylinder, extension chain
    cw = w / 3.0
    rh = h / 4.0
    im.crop((0, 0, int(cw), int(rh))).save(os.path.join(PUBLIC_DIR, "finishing", "s-hook-clasp.jpg"), quality=95)
    im.crop((int(cw), 0, int(2 * cw), int(rh))).save(os.path.join(PUBLIC_DIR, "finishing", "screw-cylinder-clasp.jpg"), quality=95)
    im.crop((int(2 * cw), 0, w, int(rh))).save(os.path.join(PUBLIC_DIR, "finishing", "extension-chain-clasp.jpg"), quality=95)
    # Row 2 left: silk thread skeins
    im.crop((0, int(rh), int(w * 0.35), int(3 * rh))).save(os.path.join(PUBLIC_DIR, "finishing", "silk-threads.jpg"), quality=95)
    # Row 4 right: pearl tassel
    im.crop((int(w * 0.7), int(2.5 * rh), w, h)).save(os.path.join(PUBLIC_DIR, "finishing", "tassel-pearl-cord.jpg"), quality=95)

# 7. Process Accent Beads Tray
if os.path.exists(f_accents):
    im = Image.open(f_accents)
    w, h = im.size
    # 4 cols x 2 main rows (top row, bottom row)
    cw = w / 4.0
    rh = h / 2.0
    acc_names_row1 = ["gold-nakshi-ball", "round-pearl-accent", "faceted-ruby-accent", "faceted-emerald-accent"]
    acc_names_row2 = ["carved-gold-cylinder", "gold-flower-spacer", "round-kundan-bead", "corrugated-melon-gold"]
    for idx, name in enumerate(acc_names_row1):
        im.crop((int(idx * cw), 0, int((idx + 1) * cw), int(rh))).save(os.path.join(PUBLIC_DIR, "accents", f"{name}.jpg"), quality=95)
    for idx, name in enumerate(acc_names_row2):
        im.crop((int(idx * cw), int(rh), int((idx + 1) * cw), h)).save(os.path.join(PUBLIC_DIR, "accents", f"{name}.jpg"), quality=95)

# 8. Assembled Necklaces & 5-strand Connector Assembly
if os.path.exists(f_connector_assembly):
    im = Image.open(f_connector_assembly)
    im.save(os.path.join(PUBLIC_DIR, "connectors", "connector-5strand-assembly.jpg"), quality=95)

if os.path.exists(f_three_necklaces):
    im = Image.open(f_three_necklaces)
    im.save(os.path.join(PUBLIC_DIR, "reference", "three-necklaces-comparison.jpg"), quality=95)

if os.path.exists(f_assembled_bust):
    im = Image.open(f_assembled_bust)
    w, h = im.size
    # 4 angles (2x2 grid)
    im.crop((0, 0, w // 2, h // 2)).save(os.path.join(PUBLIC_DIR, "reference", "assembled-necklace-front.jpg"), quality=95)
    im.crop((w // 2, 0, w, h // 2)).save(os.path.join(PUBLIC_DIR, "reference", "assembled-necklace-angle-left.jpg"), quality=95)
    im.crop((0, h // 2, w // 2, h)).save(os.path.join(PUBLIC_DIR, "reference", "assembled-necklace-angle-right.jpg"), quality=95)
    im.crop((w // 2, h // 2, w, h)).save(os.path.join(PUBLIC_DIR, "reference", "assembled-necklace-side.jpg"), quality=95)

print("Successfully processed all authentic jewellery assets into public/assets!")
