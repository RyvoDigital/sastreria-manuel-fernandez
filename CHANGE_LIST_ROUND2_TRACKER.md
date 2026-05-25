# Change List Round 2 Tracker — Sastrería Manuel Fernández
**Source:** `Change List Round 2 - Sastreria Manuel Fernandez.pdf` (24 May 2026)

---

## Item 1: Move "Crea tu Traje" bg → "Diseña el Traje que Eres"

**Current location (to move FROM):**
- File: `app/modelos-3d/page.tsx`
- Line: ~line 26
- Current asset: `https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/madrid-suit-street_slsine`
- Description: Man buttoning jacket, Madrid building behind him

**New location (to move TO):**
- File: `components/configurador/ConfiguradorHero.tsx`
- Line: ~line 25
- Current asset: `https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/w_1920/photos/web_lista_images/configurador-overview_e9k0ap`
- Action: Replace configurador hero bg with the modelos-3d bg

---

## Item 2: "Crea tu Traje" — new background behind 3D model

**Location:**
- File: `app/modelos-3d/page.tsx`
- Line: ~line 26
- Current asset: `https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/madrid-suit-street_slsine`
- Action: Replace with new photo (from PDF)
- ⚠️ **NEEDS:** New photo URL from client

---

## Item 3+4: Sastrería section — swap photos

**Current layout:**
- File: `components/la-sastreria/EspacioSection.tsx`
- Lines: ~107-155

**Large left slot (70% width):**
- Current: `sastreria-space-01_ucman9` (shop interior — this is the accessories/ties photo)
- Action: Replace with new shop interior photo (change 4)

**Right stack (30% width, 2 photos):**
- Top: `sastreria-space-02_wvinrk`
- Bottom: `sastreria-space-03_eh5jl3` (Luis on sofa — **REMOVE THIS**)
- Action: Move accessories photo (`sastreria-space-01_ucman9`) to right slot, remove Luis

**Structural change needed:**
```tsx
// Current: big left (space-01), small right (space-02, space-03)
// New:     big left (NEW PHOTO), small right (space-02, space-01)
```

⚠️ **NEEDS:** New large left photo URL (shop interior — blue curtains, gold chandelier, Chesterfield sofa, Manuel Fernández banner)

---

## Item 5: Courses — cover photos for each course

**Location:**
- File: `components/cursos/CursosList.tsx`
- Lines: ~40-125

**Current course images (all the same):**
```
Course 1 (intro):     atelier-workshop_n5x6ce
Course 2 (canvas):    purple-lining-interior_krylkv
Course 3 (lapel):     gray-check-mannequin_gaf1fp
Course 4 (pockets):   showroom-jackets_n55sfk
Course 5 (buttonholes): scissors-cutting_vyt9my
Course 6 (finishes):  IMG_9436_uyetr0
```

Wait — there are 6 courses, but the PDF says 5. Let me check the PDF again... The PDF mentions:
- Construcción de solapas
- Ojales a mano
- Introducción a la sastrería artesanal
- Acabados profesionales
- Entretelado a mano

That's 5 courses. But the CursosList.tsx has 6 courses. The 6th one might be "Introducción a la Sastrería Artesanal" and then the other 5. Let me re-check.

Actually looking at CursosList.tsx:
1. intro - "Introducción a la Sastrería Artesanal"
2. canvas - "Entretelado a Mano"
3. lapel - "Construcción de Solapas"
4. pockets - "Bolsillos de Chaqueta"
5. buttonholes - "Ojales a Mano"
6. finishes - "Acabados Profesionales"

That's 6 courses. The PDF mentions 5. Let me check the PDF text again... The PDF lists:
1. Construcción de solapas
2. Ojales a mano
3. Introducción a la sastrería artesanal
4. Acabado profesionales
5. Entretelado a mano

So the PDF has 5, but the code has 6. The course "Bolsillos de Chaqueta" (pockets) is not mentioned in the PDF. Perhaps the PDF is just showing 5 examples, or the client only wants 5 courses. Either way, I should note this discrepancy.

⚠️ **NEEDS:** 5 (or 6) new course cover photo URLs from client

---

## Item 6: Contact page carousel — replace 4 photos + captions

**Location:**
- File: `components/contacto/ContactPage.tsx`
- Lines: ~19-27

**Current 8 carousel photos:**
```
0: contacto-page_s9mfnn      → quote1
1: contacto-section_kj0rgk   → quote2
2: IMG_9503_wwqizp           → quote3
3: IMG_1729_a7o3ej           → quote4
4: IMG_0078_fcvvhk           → quote5
5: IMG_1477_bx8bwn           → quote6
6: IMG_1701_ojirsx           → quote7
7: IMG_0734_ug3baf           → quote8
```

The PDF says "replace the 4 photos" — which 4? Looking at the PDF reference, it shows 4 confirmed photos. I believe the first 4 photos (indices 0-3) are the main carousel ones, and 4-7 are secondary/background images.

Looking at the component more carefully, all 8 photos rotate in the same carousel. The PDF says to replace 4 photos with 4 new confirmed ones. Without seeing which 4 are the "current" ones being replaced, I'll need the client to specify.

Actually, looking at the code again:
```tsx
const PHOTOS: { src: string; quoteKey: QuoteKey }[] = [
  { src: '...contacto-page_s9mfnn', quoteKey: 'quote1' },
  { src: '...contacto-section_kj0rgk', quoteKey: 'quote2' },
  { src: '...IMG_9503_wwqizp', quoteKey: 'quote3' },
  { src: '...IMG_1729_a7o3ej', quoteKey: 'quote4' },
  { src: '...IMG_0078_fcvvhk', quoteKey: 'quote5' },
  { src: '...IMG_1477_bx8bwn', quoteKey: 'quote6' },
  { src: '...IMG_1701_ojirsx', quoteKey: 'quote7' },
  { src: '...IMG_0734_ug3baf', quoteKey: 'quote8' },
]
```

There are 8 photos in a rotating carousel. The PDF says "delete the 4 photos currently there and replace them with the 4 new photos confirmed with the client". This likely means reduce from 8 to 4 photos, replacing all of them.

⚠️ **NEEDS:** 4 new photo URLs + updated captions for each

**Caption locations:**
- File: `messages/es.json` (and en/it/fr)
- Path: `contacto.quote1` through `contacto.quote8`

---

## Item 7: "Paso 03 — Resultado" — change background

**Location:**
- File: `components/home/ProcessCardsEnhanced.tsx`
- Line: 11
- Current asset: `https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/web_lista_images/home-the-result_l9d5tm`
- Action: Replace with new photo (5 men in blue suits outdoors)
- ⚠️ **NEEDS:** New photo URL from client

---

## Item 8: "El Proceso — Tu traje empieza en ti" — change photo

**Location:**
- File: `components/home/TrajeEmpiezaSection.tsx`
- Line: 96
- Current asset: `https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/Traje_a_medida_con_corbata_roja_h4s5oq`
- Description: Grey checked three-piece suit with red tie
- Action: Replace with new photo (man in light grey suit, blue tie, buttoning jacket outside wrought-iron storefront)
- ⚠️ **NEEDS:** New photo URL from client

---

## Summary: What We Need From the Client

| Item | What We Need |
|------|-------------|
| 1+2 | 2 photo URLs (modelos-3d new bg + confirm which one moves to configurador) |
| 3+4 | 1 photo URL (new large left sastrería photo) + confirm which is Luis vs accessories |
| 5 | 5-6 course cover photo URLs |
| 6 | 4 contact carousel photo URLs + caption text for each |
| 7 | 1 photo URL (Paso 03 background — 5 men in blue suits) |
| 8 | 1 photo URL (Traje empieza — man in light grey suit, blue tie) |
