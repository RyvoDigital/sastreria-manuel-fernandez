# 3D Suit Configurator - Technical Requirements Document
## Sastreria Manuel Fernández - Atelier Website

---

## PROJECT OVERVIEW

Build a web-based 3D suit configurator that allows clients to:
- View suits in 360° interactive 3D
- Change fabric colors and materials in real-time
- Select different sizes/fits
- Customize design elements (buttons, lapels, pockets, etc.)
- Request quotes or book appointments based on their configuration

---

## 1. 3D MODEL STRUCTURE REQUIREMENTS

### 1.1 Separated Mesh Components

The suit model MUST be divided into individual parts that can be manipulated independently:

```
Male_Character_Suit.glb (or female equivalent)
├── Character_Body (base human mesh - skin only)
├── Suit_Jacket
│   ├── Jacket_Fabric_Mesh (main body)
│   ├── Lapel_Mesh (notch/peak/shawl variants)
│   ├── Buttons_Mesh (1-btn, 2-btn, DB variants)
│   ├── Lining_Mesh (interior view)
│   ├── Pocket_Left_Mesh
│   ├── Pocket_Right_Mesh
│   └── Breast_Pocket_Mesh
├── Suit_Pants
│   ├── Pants_Fabric_Mesh (main body)
│   ├── Waistband_Mesh
│   ├── Cuffs_Mesh (with/without variants)
│   └── Pocket_Mesh
├── Shirt
│   ├── Shirt_Fabric_Mesh
│   ├── Collar_Mesh
│   └── Cuffs_Mesh
├── Accessories (optional/toggleable)
│   ├── Tie_Mesh
│   ├── Vest_Mesh
│   └── Pocket_Square_Mesh
└── Shoes
    └── Shoe_Mesh
```

**Why This Matters:**
- Each mesh needs unique material assignments for color changes
- Individual parts can be shown/hidden for design options
- Separated components allow for independent texture mapping

---

## 2. MATERIAL & TEXTURE REQUIREMENTS

### 2.1 PBR Material Setup

Each fabric component needs standard PBR (Physically Based Rendering) materials with these texture maps:

| Map Type | Purpose | Example |
|----------|---------|---------|
| **Albedo/Diffuse** | Base fabric color | Solid navy, charcoal, black |
| **Normal Map** | Fabric weave texture | Twill, herringbone, plain weave |
| **Roughness** | How shiny/matte | Silk = white (shiny), Wool = dark (matte) |
| **Metallic** | Metal parts only | Buttons, cufflinks = white, Fabric = black |
| **AO (Ambient Occlusion)** | Shadow details | Seams, folds, creases |

### 2.2 Fabric Library

Provide 3D materials for these fabric types:

**WOOLS:**
- Prince of Wales check
- Houndstooth
- Birdseye
- Plain weave
- Flannel
- Worsted

**SPECIALTY:**
- Seersucker (summer)
- Mohair blend
- Cashmere blend
- Silk blend

**COLORS per fabric:**
- Navy (3 shades: light, medium, dark)
- Charcoal (2 shades)
- Black
- Grey (3 shades)
- Brown (2 shades)
- Optional: Burgundy, Forest Green

### 2.3 Material Naming Convention

Use consistent names so code can identify parts:

```
MAT_Jacket_Fabric
MAT_Jacket_Buttons
MAT_Jacket_Lining
MAT_Pants_Fabric
MAT_Shirt_Fabric
MAT_Tie_Fabric
```

---

## 3. SIZE & FIT VARIATIONS

### 3.1 Three Implementation Options (Choose One)

#### OPTION A: Morph Targets (RECOMMENDED)

Single base model with "shape keys" or "blend shapes":

```
Male_Character_Suit.glb
├── Base Mesh
├── Morph: Slim_Fit (chest -5%, waist -8%)
├── Morph: Regular_Fit (base proportions)
└── Morph: Relaxed_Fit (chest +5%, waist +5%)
```

**Pros:** Single file, smooth transitions, smaller download
**Cons:** Requires skilled 3D rigging

#### OPTION B: Separate Model Files

Three complete model files:

```
/models/
├── suit_slim_fit.glb
├── suit_regular_fit.glb
└── suit_relaxed_fit.glb
```

**Pros:** Simple implementation, maximum detail control
**Cons:** Larger total file size, harder to maintain consistency

#### OPTION C: Procedural Scaling (NOT RECOMMENDED)

Scale specific bone groups:
- Chest bone: scale 0.9 - 1.1
- Waist bone: scale 0.9 - 1.1
- Shoulder bone: scale 0.95 - 1.05

**Pros:** Single model, dynamic sizing
**Cons:** Can distort proportions unnaturally

### 3.2 Fit Specifications

| Fit Type | Chest | Waist | Shoulder | Target Body Type |
|----------|-------|-------|----------|------------------|
| **Slim** | Close to body | Tapered | Narrow | Athletic/thin build |
| **Regular** | Standard ease | Moderate | Standard | Average build |
| **Relaxed** | Generous ease | Straight | Extended | Larger/comfort fit |

---

## 4. DESIGN CUSTOMIZATION OPTIONS

### 4.1 Toggleable Design Elements

Each option needs to be a separate mesh that can be shown/hidden:

**JACKET STYLE:**
- Button count: 1-button, 2-button, 3-button, Double-breasted (6x2)
- Lapel type: Notch, Peak, Shawl
- Lapel width: Slim (2.5"), Standard (3"), Wide (3.5")

**JACKET DETAILS:**
- Vents: None, Single center, Double side vents
- Pockets: Flap, Patch, Jetted (besom)
- Breast pocket: With/without welt
- Ticket pocket: With/without
- Button stance: Low, Standard, High

**PANTS STYLE:**
- Rise: Low, Mid, High
- Pleats: Flat front, Single, Double
- Cuffs: No cuff, 1.5" cuff
- Waistband: Standard, Side-adjusters, Belt loops

**POCKETS:**
- Slanted (frogmouth) vs. Straight
- With/without button closure

### 4.2 Implementation Method

Each design variant should be a separate mesh group:

```
Jacket_Variants/
├── Button_1_Notch_Lapel
├── Button_2_Notch_Lapel
├── Button_2_Peak_Lapel
├── Button_2_Shawl_Lapel
└── Double_Breasted_Peak

Pants_Variants/
├── Flat_Front_No_Cuff
├── Flat_Front_With_Cuff
├── Single_Pleat_No_Cuff
└── Double_Pleat_With_Cuff
```

**Visibility Logic:**
- Only ONE jacket variant visible at a time
- Only ONE pants variant visible at a time
- Smooth crossfade transition preferred

---

## 5. FILE FORMAT & OPTIMIZATION

### 5.1 Required Format: GLB (Binary GLTF)

**Specifications:**
- Format: .glb (self-contained, single file)
- Coordinate system: Y-up (Three.js standard)
- Units: Meters (1.0 = 1 meter, character ~1.75m)
- Origin: Character feet at (0,0,0)

### 5.2 Performance Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| File size (single model) | < 5MB | 8MB |
| Triangle count | < 50,000 | 80,000 |
| Texture resolution | 1K (1024x1024) | 2K (2048x2048) |
| Materials count | < 10 | 15 |
| Load time (4G) | < 3 seconds | 5 seconds |

### 5.3 Optimization Requirements

**MUST apply:**
- Draco compression enabled
- Unused vertices/edges removed
- Duplicate materials merged
- Texture atlasing where possible
- Instanced meshes for repeated elements

---

## 6. ANIMATION & INTERACTION

### 6.1 Idle Animation

Subtle breathing/standing animation loop:
- Duration: 4-6 seconds
- Chest expansion: 2-3mm
- Shoulder subtle rise/fall
- Weight shift between feet

**Purpose:** Makes the model feel alive, not static

### 6.2 Transition Animations

When changing design options:
- Crossfade duration: 300-500ms
- No "pop" - smooth material/mesh blending

### 6.3 Camera Positions

Preset viewpoints for common angles:
- Default: 3/4 view showing jacket cut
- Front: Straight-on for button stance
- Back: Showing vents and trousers
- Side: Profile view
- Detail: Close-up of lapel/fabric texture

---

## 7. UI COMPONENT REQUIREMENTS

### 7.1 Color Picker Interface

```
Jacket Color:
[🟫 Dark Brown] [⬛ Black] [🟦 Navy] [⬜ Light Grey]
[🟫 Chocolate] [🟥 Burgundy] [🟩 Forest Green]

Pants Color:
[Match Jacket] [⬛ Black] [🟦 Navy] [⬜ Grey]

Shirt Color:
[⬜ White] [🔲 Light Blue] [📋 Cream]

Buttons:
[🟨 Gold Horn] [🐚 Mother of Pearl] [⚫ Black Horn]
```

### 7.2 Design Selector

Dropdown or card-based selection:

```
Jacket Style
┌────────────────────────────────────┐
│ [ ] 1-Button Notch                 │
│ [●] 2-Button Notch    <- Selected  │
│ [ ] 2-Button Peak                  │
│ [ ] 2-Button Shawl                 │
│ [ ] Double-Breasted Peak           │
└────────────────────────────────────┘

Pants Style
┌────────────────────────────────────┐
│ [●] Flat Front, No Cuff            │
│ [ ] Flat Front, With Cuff          │
│ [ ] Single Pleat, No Cuff          │
│ [ ] Double Pleat, With Cuff        │
└────────────────────────────────────┘
```

### 7.3 Size Selector

```
Fit Preference:
[ SLIM ]  [ REGULAR ● ]  [ RELAXED ]

< For athletic builds    < Classic fit    < Comfort fit >
```

---

## 8. TECHNICAL STACK

### 8.1 Frontend Technologies

- **Framework:** Next.js 16+ (React)
- **3D Engine:** Three.js with React Three Fiber
- **3D Helpers:** React Three Drei
- **State Management:** React useState/useContext
- **Animations:** Framer Motion (UI), GSAP (complex sequences)

### 8.2 Backend Integration

- **Quote Generation:** API endpoint receiving configuration JSON
- **Booking:** Calendar integration with configuration reference
- **Analytics:** Track most popular configurations

### 8.3 Configuration Data Structure

```json
{
  "configuration_id": "uuid",
  "timestamp": "2026-04-13T10:00:00Z",
  "client_info": {
    "name": "",
    "email": "",
    "phone": ""
  },
  "suit_configuration": {
    "gender": "male",
    "fit_type": "regular",
    "jacket": {
      "fabric": "wool_navy",
      "color": "#1a2744",
      "button_count": 2,
      "lapel_type": "notch",
      "lapel_width": "standard",
      "vents": "double",
      "pocket_style": "flap",
      "ticket_pocket": false
    },
    "pants": {
      "fabric": "wool_navy",
      "color": "#1a2744",
      "pleats": "flat_front",
      "cuffs": false,
      "rise": "mid"
    },
    "shirt": {
      "color": "#ffffff",
      "collar": "spread"
    },
    "buttons": "gold_horn",
    "lining": "burgundy_art_deco"
  },
  "estimated_price": {
    "currency": "EUR",
    "base": 2500,
    "extras": 300,
    "total": 2800
  },
  "production_time_weeks": 8
}
```

---

## 9. ACCESSIBILITY & FALLBACKS

### 9.1 Progressive Enhancement

**If 3D fails to load:**
- Show high-quality renders (6 angles)
- Maintain configuration options
- Display "3D unavailable" message

**Mobile considerations:**
- Simplified 3D (reduced polygons)
- Touch-optimized controls
- Option to disable 3D for low-end devices

### 9.2 Performance Budget

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- 3D Model Load: < 5s
- Total Page Weight: < 10MB

---

## 10. DELIVERABLES CHECKLIST

### From 3D Designer/Agency:

- [ ] Male base character model (neutral pose)
- [ ] Female base character model (neutral pose)
- [ ] Suit jacket mesh (separated components)
- [ ] Suit pants mesh (separated components)
- [ ] Shirt mesh
- [ ] All jacket style variants (1-btn, 2-btn, DB, etc.)
- [ ] All pants style variants (flat front, pleated, etc.)
- [ ] PBR texture set for each fabric type (8-12 fabrics)
- [ ] Button variations (gold, MOP, black)
- [ ] Lining patterns (2-3 options)
- [ ] Environment/Showroom 3D space
- [ ] Draco-compressed GLB files
- [ ] Source files (Blender/Maya/3DS Max)

### From Web Developer:

- [ ] 3D viewer component
- [ ] Material switching system
- [ ] Configuration state management
- [ ] Price calculator integration
- [ ] Quote request form
- [ ] Booking calendar integration
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Analytics tracking

---

## 11. TIMELINE ESTIMATE

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 3D Asset Creation | 4-6 weeks | Designer availability |
| Web Development | 3-4 weeks | After 3D assets ready |
| Integration & Testing | 1-2 weeks | Both complete |
| Content & Copy | 1 week | Parallel |
| **Total** | **9-13 weeks** | |

---

## 12. BUDGET CONSIDERATIONS

### 3D Asset Costs:
- Character modeling: $2,000-4,000
- Suit modeling (all variants): $5,000-8,000
- Texturing (PBR): $3,000-5,000
- Rigging & morph targets: $2,000-3,000
- **Total 3D: $12,000-20,000**

### Development Costs:
- 3D viewer component: $5,000-8,000
- Configurator UI: $4,000-6,000
- Backend integration: $3,000-5,000
- Testing & optimization: $2,000-3,000
- **Total Dev: $14,000-22,000**

---

## 13. REFERENCES & INSPIRATION

Similar configurators to benchmark:
- **Hockerty** (hockerty.com) - Online suit builder
- **Indochino** - 3D suit preview
- **Suitsupply** - Style selector
- **Knot Standard** - Made-to-measure configurator

---

## 14. APPROVAL SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Owner | | | |
| 3D Designer | | | |
| Web Developer | | | |
| Creative Director | | | |

---

## QUESTIONS?

Contact: [Your contact information]
Document Version: 1.0
Last Updated: April 2026
