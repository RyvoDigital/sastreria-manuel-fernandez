# WEB LISTA — CHANGES & CORRECTIONS TRACKER

**Source:** `WEB LISTA - ENGLISH.md` (client feedback round)  
**Date:** May 2026  
**Status Key:** 🔴 Pending | 🟡 In Progress | 🟢 Done | ⚪ Blocked / Awaiting Assets

---

## IMAGES (39 web_lista_images applied across all pages)

| Page | Images Applied | Status |
|------|---------------|--------|
| Homepage | `home-the-result`, `home-sartorial-interpretation`, `home-selection`, `home-the-process`, `home-origin`, `home-visual` | 🟢 Done |
| Sastrería | `sastreria-hero`, `sastreria-overview`, `sastreria-cut-by-hand`, `sastreria-artisan-detail`, `sastreria-manuel-fernandez`, `sastreria-evelyn-fernandez`, `sastreria-next-step`, `sastreria-space-01/02/03` | 🟢 Done |
| Bodas | `bodas-hero`, `bodas-morning-coat`, `bodas-stroller`, `bodas-suit`, `bodas-fabrics`, `bodas-buttons`, `bodas-ceremony`, `bodas-lining` | 🟢 Done |
| Servicios | `servicios-hero`, `servicios-overview` | 🟢 Done |
| Videollamada | `videollamada-overview` | 🟢 Done |
| Contacto | `contacto-page`, `contacto-section` | 🟢 Done |
| Cursos | `cursos-overview` (all 6 thumbnails) | 🟢 Done |
| Configurador | `configurador-overview` | 🟢 Done |

---

## COPY — ALL 4 LANGUAGES (ES / EN / FR / IT)

| ID | Issue | Status |
|----|-------|--------|
| H-09 | Removed fake Josh Nicholas Google review | 🟢 Done |
| S-01 | Deleted "without industrial patterns" from hero, history, services, bodas | 🟢 Done |
| S-07 | Changed "hand-sewn" → "handmade" everywhere | 🟢 Done |
| VC-04 | "Tailoring in your Living Room" → "Tailoring in your Space" | 🟢 Done |
| V-07 | "Years of Craft" → "Years of Experience" | 🟢 Done |
| MF-01 | Removed "he learned from great Spanish master tailors" from history | 🟢 Done |
| V-06 | Added DHL Express mention | 🟢 Done |
| V-08 | Added 6 textile houses: Reda, Luvit, Carnet, Harrison, Fox Brothers, Zegna | 🟢 Done |
| VC-02 | Added correct videollamada schedule hours (Mon–Fri 10:00–14:00 & 17:00–20:00; Sat 10:00–13:00) | 🟢 Done |
| CF-01 | Removed "7 steps" from configurator text | 🟢 Done |
| N-03 | Fixed duplicate "Editorial Inspiration" title | 🟢 Done |

---

## STRUCTURAL CHANGES

| ID | Issue | Status |
|----|-------|--------|
| H-03 | Removed duplicate sartorial interpretation section from homepage | 🟢 Done |
| V-03 | Removed 98% satisfied customers block from servicios | 🟢 Done |
| V-02 | Removed "Ver la Sastrería" button from credenciales | 🟢 Done |
| W-07 | Reordered formal attire: Morning Coat → Stroller → Tuxedo → Bespoke Suit | 🟢 Done |
| S-05 | Fixed book appointment button to go to `/contacto`, not videollamada | 🟢 Done |
| N-01 | Fixed "Dónde Estamos" to open Google Maps | 🟢 Done |
| N-02 | Removed useless Home button from services grid on homepage | 🟢 Done |
| VC-02 | Updated videollamada booking slots to correct hours | 🟢 Done |
| H-05 | Increased font sizes for Manuel and Evelyn names | 🟢 Done |
| L-01 | Created `/legal` page to fix 404 error | 🟢 Done |
| — | Added dynamic `html lang` attribute | 🟢 Done |
| — | Updated favicon to use `/favicon.ico` | 🟢 Done |

---

## NEW CHANGES FROM THIS SESSION (May 11)

| ID | Issue | What Was Done | Status |
|----|-------|---------------|--------|
| CF-02 | Configurator step order wrong | Restructured from 7 steps → 3 steps: **Fabric Selection → Measurements → Design & Customization**. Added measurement inputs (height, chest, waist, sleeve). All 6 design categories (jacket, waistcoat, trousers, occasion, colour, season) now grouped in step 3. | 🟢 Done |
| V-09 | Service gallery layout | Replaced complex GSAP scroll-driven morph animation with clean **responsive grouped photo grid** by service category (Traje a Medida, Blazer, Pantalón, Abrigo, Traje de Novio, Arreglos) | 🟢 Done |
| M-01 | Mobile map visibility | Globe in "Where we work" section now hidden on **all mobile devices** (was only hidden on iPhone) | 🟢 Done |
| V-04 | Service dates in THE REPERTOIRE | Removed duration/date text from all 10 services | 🟢 Done |
| N-04 | Editorial "Read more" buttons | Buttons now link to `/contacto` instead of being non-functional | 🟢 Done |
| VC-06 | Videollamada emails not arriving | Replaced fake `setTimeout` confirmation with real `mailto:` link that opens user's email client with **pre-filled booking details** (date, time, platform, duration). Body text is locale-aware in all 4 languages. | 🟢 Done |
| H-02 | Blank screens / crashes | Added **ErrorBoundary** component to catch JS errors and prevent blank screens. Wrapped `Modelo3DViewer` with it. | 🟢 Done |
| H-02 | Slow loading | **Lazy-loaded Globe component** via `next/dynamic` with SSR disabled. Globe now loads on demand with a spinner fallback. | 🟢 Done |
| H-09 | Google Reviews badge | Made badge **clickable** — links directly to Google Maps business profile | 🟢 Done |
| — | Unused component cleanup | Deleted `ServiciosSimple.tsx` — contained hardcoded Spanish text, outdated "sin patrones industriales" copy, no Italian/French support, and was not imported anywhere | 🟢 Done |
| — | Navigation i18n | "Llámanos" / "Dónde Estamos" contact buttons now fully locale-aware (es/en/it/fr) | 🟢 Done |
| — | Videollamada mailto i18n | Email body text now switches language based on user's selected locale | 🟢 Done |
| — | Bodas fallback i18n | `BodasFormalWear` hardcoded Spanish/English fallback removed; now uses translation keys for all 4 languages | 🟢 Done |

---

## ⚪ BLOCKED — NEEDS ASSETS FROM CLIENT

| ID | Page | What We Need |
|----|------|-------------|
| H-08 | Homepage | Varied photos for carousel (different locations, people, angles) |
| N-05 | Homepage | Actual before/after photo pair (different photos, not same with basting stitches) |
| V-05 | Servicios | 1 photo per service (10 total) for THE REPERTOIRE grid |
| W-08 | Bodas | Full wedding photo folder / additional ceremony shots |

---

## 🔴 PENDING — NOT BLOCKED, REQUIRES WORK

| ID | Issue | What's Needed |
|----|-------|---------------|
| H-01 | Mobile version top priority | Dedicated mobile-first CSS audit across all breakpoints |
| H-02 | Full speed audit | Bundle analysis, image optimisation, font loading, code splitting beyond Globe |
| C-01 | Book Appointment form backend | Current form uses `mailto:` (requires email client). Real form submission needs email service API (Resend/SendGrid/Nodemailer) + API route |
| — | i18n hardcoded labels (non-critical) | `ServicesEnhanced`, `ServicesOverview`, `CredencialesSection`, `BodasFormalWear` section header still use inline locale conditionals instead of translation keys |

---

*Last updated: May 11, 2026*  
*Active branch: `dev`*  
*Commits: `eadf7e2`*
