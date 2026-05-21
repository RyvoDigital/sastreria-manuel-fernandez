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
| 1 | **"Sastrería Artesanal" card — change photo** | `components/home/ServicesEnhanced.tsx` | `atelier-workshop_n5x6ce` | Replace with new photo URL |
| 2 | **"Crea tu Traje" card — change photo** | `components/home/ServicesEnhanced.tsx` | `IMG_3083_pi1nbb` (modelos3d card) | Replace with new photo URL (cut pattern pieces on table) |
| 8 | **Before / After slider — add photos** | `components/home/BeforeAfterSlider.tsx` | Placeholder PNGs | Needs BEFORE (half-made jacket, white basting threads) and AFTER (finished grey herringbone jacket on mannequin) URLs |
| 15 | **"Blazer" thumbnail photo** | `components/servicios/ServiciosHero.tsx` | `mint-jacket-madrid_igacjj` (index 6) | Replace with navy blazer + gold buttons on mannequin |
| 16 | **"Chalecos" thumbnail photo** | `components/servicios/ServiciosHero.tsx` | `tweed-buttons_vse8vw` (index 8) | Replace with man adjusting navy tie, light grey waistcoat |

---

## 🔧 CSS-ONLY CHANGES (No new assets needed)

| # | Item | File(s) | Action Needed |
|---|------|---------|---------------|
| 3 | **"La Experiencia" section — crop photo tighter** | `components/la-sastreria/EspacioSection.tsx` | Adjust `backgroundPosition` or add `object-fit: cover` with tighter cropping on the main photo (`sastreria-manuel-fernandez_muk5sb`) |
| 4 | **"Paso 02 — Interpretación Sartorial" — lower crop** | `components/home/ProcessCardsEnhanced.tsx` | Change `objectPosition` on `CARD_IMAGES[1]` (`home-sartorial-interpretation_sdszvu`) from default to `bottom` so hands/fabric are visible, not face |

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
