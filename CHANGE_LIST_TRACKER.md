# Change List Tracker — Sastrería Manuel Fernández
**Source:** `Change List - Sastreria Manuel Fernandez.pdf` (21 May 2026)

---

## ✅ Text & Structure Changes (No new photos needed)

| # | Item | Status | File(s) | Action |
|---|------|--------|---------|--------|
| 5 | "Detalles Nupciales" → "Bodas Memorables" | 🔲 | `messages/*.json` | Change `bodas.carousel.label` |
| 6 | "Estilos de Ceremonia" — reorder/resize cards | 🔲 | `components/bodas/BodasCategorias.tsx` | small(Frac), big(Chaqué), big(Traje), small(Esmoquin) |
| 9 | "Manuel Fernández" — change 2nd paragraph | 🔲 | `messages/*.json` | Update `la_sastreria.historia.p2` |
| 12 | "Ver el proceso" button — fix 404 | 🔲 | `components/la-sastreria/SastreriaCTA.tsx` | Change `/experiencia` → `/la-sastreria` |
| 14 | Swap Frac / Chaqué thumbnails | 🔲 | `components/servicios/ServiciosHero.tsx` | Swap SERVICE_IMAGES[0] and [1] |

## 📸 Photo Changes (Need new Cloudinary URLs from client)

| # | Item | Status | File(s) | Current URL | Needs |
|---|------|--------|---------|-------------|-------|
| 1 | "Sastrería Artesanal" card | ⏳ | `components/home/ServicesEnhanced.tsx` | `atelier-workshop_n5x6ce` | New photo URL |
| 2 | "Crea tu Traje" card | ⏳ | `components/home/ServicesEnhanced.tsx` | `IMG_3083_pi1nbb` | New photo URL |
| 3 | "La Experiencia" section — crop | ⏳ | `components/la-sastreria/EspacioSection.tsx` | `sastreria-manuel-fernandez_muk5sb` | Tighter crop (CSS) |
| 4 | "Paso 02" — lower crop | ⏳ | `components/home/ProcessCardsEnhanced.tsx` | `home-sartorial-interpretation_sdszvu` | CSS `object-position: bottom` |
| 8 | Before/After slider — add photos | ⏳ | `components/home/BeforeAfterSlider.tsx` | Placeholder PNGs | BEFORE & AFTER photo URLs |
| 10 | Google reviews integration | ⏳ | `components/home/TestimonialsSection.tsx` | Static JSON | Live Google Reviews API |
| 11 | "Entretelado a mano" section | ⏳ | _Section not found in codebase_ | — | May be a planned/unbuilt section |
| 13 | "Detalles Personalizados" section | ⏳ | _Section not found in codebase_ | — | May be a planned/unbuilt section |
| 15 | "Blazer" thumbnail photo | ⏳ | `components/servicios/ServiciosHero.tsx` | `mint-jacket-madrid_igacjj` | New photo URL |
| 16 | "Chalecos" thumbnail photo | ⏳ | `components/servicios/ServiciosHero.tsx` | `tweed-buttons_vse8vw` | New photo URL |

## ⚙️ Infrastructure

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7 | Stripe — production mode | ⏳ | Requires live Stripe keys + bank account details (provided separately) |

---

## Pending (≈5 more changes to be added by client)

TBD
