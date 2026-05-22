# Change List Tracker — Sastrería Manuel Fernández
**Source:** `Change List - Sastreria Manuel Fernandez.pdf` (21 May 2026)  
**Last Updated:** 21 May 2026

---

## ✅ COMPLETED (Implemented & Pushed)

| # | Item | File(s) | What Was Done |
|---|------|---------|---------------|
| 5 | **"Detalles Nupciales" → "Bodas Memorables"** | `messages/es.json`, `messages/en.json`, `messages/it.json`, `messages/fr.json` | Changed `bodas.carousel.label` in all 4 languages |
| 6 | **"Estilos de Ceremonia" — reorder & resize cards** | `components/bodas/BodasCategorias.tsx` | Reordered to: small(Frac), big(Chaqué), big(Traje), small(Esmoquin). Updated flex logic so both Chaqué and Traje are big. |
| 9 | **"Manuel Fernández" — change 2nd paragraph** | `messages/es.json`, `messages/en.json`, `messages/it.json`, `messages/fr.json` | Replaced `la_sastreria.historia.p2` with new text in all 4 languages |
| 12 | **"Ver el proceso" button — fix broken link** | `components/la-sastreria/SastreriaCTA.tsx` | Changed `href="/experiencia"` → `href="/la-sastreria"` |
| 14 | **Swap Frac / Chaqué thumbnail photos** | `components/servicios/ServiciosHero.tsx` | Swapped `SERVICE_IMAGES[0]` and `SERVICE_IMAGES[1]` |

---

## 📸 NEEDS NEW PHOTO URLs FROM CLIENT

These items require new Cloudinary image URLs. The PDF shows current + new photos but they cannot be extracted as text.

| # | Item | File(s) | Current Photo | Action Needed |
|---|------|---------|---------------|---------------|
| 1 | **"Sastrería Artesanal" card — change photo** | ✅ Done | `components/home/ServicesEnhanced.tsx` + `ServicesOverview.tsx` | `atelier-workshop_n5x6ce` → `atelier-2026-04-24-005-0682.jpg` |
| 2 | **"Crea tu Traje" card — change photo** | ✅ Done | `components/home/ServicesEnhanced.tsx` + `ServicesOverview.tsx` | `IMG_3083_pi1nbb` → `IMG_0067_hlr9ym.jpg` |
| 8 | **Before / After slider — add photos** | ✅ Done | `components/home/BeforeAfterSlider.tsx` | BEFORE: `25ED7BDA..._wsfocs.png` (half-made jacket) / AFTER: `screenshot-11.png` (grey herringbone) |
| 16 | **"Chalecos" thumbnail photo** | ✅ Done | `components/servicios/ServiciosHero.tsx` | `tweed-buttons_vse8vw` → `atelier-2012-09-15-007-1325.jpg` |

---

## 🔧 CSS-ONLY CHANGES (No new assets needed)

| # | Item | File(s) | Action Needed |
|---|------|---------|---------------|
| 3 | **"La Experiencia" section — crop photo tighter** | ✅ Done | `components/la-sastreria/EspacioSection.tsx` | Added `transform: 'scale(1.15)'` to zoom in and crop top blue curtain + bottom empty space |
| 4 | **"Paso 02 — Interpretación Sartorial" — lower crop** | ✅ Done | `components/home/ProcessCardsEnhanced.tsx` | Added `objectPosition: 'bottom'` to CARD_IMAGES[1] so hands/fabric are visible instead of face |

---

## 🔍 NOT FOUND IN CODEBASE (May be planned/unbuilt)

| # | Item | Notes |
|---|------|-------|
| 11 | **"Entretelado a mano" section — change photo** | No section with this title exists in the current codebase. PDF says "The team will know which one it is because the placeholder title states it explicitly." — may be a planned section not yet built. |
| 13 | **"Detalles Personalizados" section — change photo** | No section with this title exists. PDF describes "guy sitting on the sofa" → may refer to a photo in `DetailGallery` or another component. |

---

## ⚙️ INFRASTRUCTURE / COMPLEX FEATURES

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7 | **Stripe — move to production** | ⏳ Pending | Requires live `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Bank details to be provided separately by client. |
| 10 | **"Experiencias Reales" — Google reviews** | ⏳ Pending | Three sub-tasks: (1) Live Google Reviews API integration, (2) Fix review card design (truncate long text / uniform height), (3) Decide how many reviews to show. This is a significant feature, not a quick fix. |

---

## 📋 PENDING (≈5 more changes to be added by client)

TBD — client will provide additional items later.

---

## How to Add a New Photo URL

When the client provides new Cloudinary URLs, update the relevant file:

```tsx
// Example: Item 1 — Sastrería Artesanal card
// In components/home/ServicesEnhanced.tsx:
const SERVICES = [
  {
    key: 'sastreria' as const,
    icon: Scissors,
    href: '/la-sastreria',
    image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/NEW_PHOTO_ID_HERE', // <-- replace this
  },
  // ...
]
```
