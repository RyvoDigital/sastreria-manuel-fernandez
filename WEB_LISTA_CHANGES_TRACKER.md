# WEB LISTA — CHANGES & CORRECTIONS TRACKER

**Source:** `WEB LISTA - ENGLISH.md` (client feedback round)  
**Date:** May 2026  
**Status Key:** 🔴 Pending | 🟡 In Progress | 🟢 Done | ⚪ Blocked / Awaiting Assets

---

## IMAGES RENAMED FOR CLOUDINARY UPLOAD

| Old Name | New Name | Section / Usage |
|----------|----------|-----------------|
| `image1.png` | `home-the-result.png` | Homepage — "The Result" |
| `image2.jpg` | `cursos-overview.jpg` | Online Courses — hero/overview |
| `image3.png` | `producto-blazer.png` | Product — Blazer |
| `image4.jpg` | `servicios-overview.jpg` | Services — overview image |
| `image5.png` | `bodas-lining.png` | Weddings — Lining |
| `image6.png` | `producto-artisan-coat.png` | Product — Artisan Coat |
| `image7.png` | `bodas-stroller.png` | Weddings — Stroller (Chaqué) section |
| `image8.png` | `home-sartorial-interpretation.png` | Homepage — Sartorial Interpretation |
| `image9.png` | `sastreria-space-01.png` | Artisan Tailoring — The Space (1/3) |
| `image10.png` | `configurador-overview.png` | Configurator — overview |
| `image11.png` | `producto-artisan-suit.png` | Product — Artisan Suit |
| `image12.png` | `producto-tuxedo.png` | Product — Tuxedo |
| `image13.png` | `bodas-ceremony.png` | Weddings — Ceremony |
| `image14.jpg` | `create-your-suit.jpg` | Create Your Suit — image |
| `image15.png` | `bodas-morning-coat.png` | Weddings — Morning Coat (Frac) section |
| `image16.png` | `contacto-section.png` | Contact — section image |
| `image17.png` | `sastreria-hero.png` | Artisan Tailoring — first/hero photo |
| `image18.png` | `servicios-hero.png` | Services — first/hero photo |
| `image19.png` | `sastreria-overview.png` | Artisan Tailoring — overview |
| `image20.png` | `sastreria-artisan-detail.png` | Artisan Tailoring — Artisan Process / The Detail |
| `image21.png` | `producto-morning-coat.png` | Product — Morning Coat (Frac) |
| `image22.png` | `sastreria-cut-by-hand.png` | Artisan Tailoring — The Cut / By Hand |
| `image23.png` | `home-selection.png` | Homepage — Selection |
| `image24.png` | `bodas-hero.png` | Weddings — first/hero photo |
| `image25.png` | `producto-stroller.png` | Product — Stroller (Chaqué) |
| `image26.png` | `sastreria-manuel-fernandez.png` | Artisan Tailoring — Manuel Fernández photo |
| `image27.png` | `bodas-suit.png` | Weddings — Suit (new section) |
| `image28.png` | `home-origin.png` | Homepage — Origin |
| `image29.png` | `videollamada-overview.png` | Video Call — overview |
| `image30.png` | `sastreria-space-02.png` | Artisan Tailoring — The Space (2/3) |
| `image31.png` | `home-visual.png` | Homepage — Visual |
| `image32.png` | `home-the-process.png` | Homepage — "The Process" (Your suit begins with you) |
| `image33.png` | `bodas-fabrics.png` | Weddings — Fabrics |
| `image34.png` | `contacto-page.png` | Contact Page — image |
| `image35.png` | `sastreria-evelyn-fernandez.png` | Artisan Tailoring — Evelyn Fernández photo |
| `image36.png` | `sastreria-next-step.png` | Artisan Tailoring — The Next Step |
| `image37.png` | `producto-shirts.png` | Product — Shirts |
| `image38.png` | `bodas-buttons.png` | Weddings — Buttons |
| `image39.png` | `sastreria-space-03.png` | Artisan Tailoring — The Space (3/3) |

---

## GLOBAL & HOMEPAGE

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| H-01 | Mobile version is top priority | Ensure all fixes are mobile-first | 🔴 Pending | Requires dedicated mobile audit |
| H-02 | Website very slow + random blank screens | Added ErrorBoundary + lazy-loaded Globe. Full audit needed for bundle size, memory leaks | 🟡 Partial | Critical — ErrorBoundary prevents crashes; Globe now lazy-loaded |
| H-03 | "Sartorial interpretation" section is duplicated | Remove the second repeated block | 🟢 Done | |
| H-04 | Hyphens everywhere make text look artificial | Removed ALL artificial em-dashes. Time-range dashes (Mon–Fri) preserved as standard typography | 🟢 Done | |
| H-05 | Manuel & Evelyn Fernández section is disorganized | Fix names, font size, placement | 🟢 Done | |
| H-06 | Workshop section has 4 disconnected images | Remove those 4 images | 🟢 Done | |
| H-07 | No photos of the actual premises/workshop | Add photos of the premises (`sastreria-space-01/02/03.png`) | 🟢 Done | Assets applied |
| H-08 | Homepage photo carousel has 3 identical photos | Replace with varied photos | ⚪ Blocked | Needs new assets from client |
| H-09 | Google Reviews not rotating; only Josh Nicolás fake review shows | Removed fake review. Made Google Reviews badge clickable (links to Maps). Real embed/API needs integration | 🟡 Partial | Badge links to profile; full embed needs API key |
| H-10 | "Wool and silk" section has no wool/silk images | Remove the entire section | 🟢 Done | |

---

## ARTISAN TAILORING (SASTRERÍA ARTESANAL)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| S-01 | "Without industrial patterns" still present | Deleted phrase from all copy | 🟢 Done | |
| S-02 | Manuel photo in history section is wrong | Replace with `sastreria-manuel-fernandez.png` | 🟢 Done | Asset applied |
| S-03 | Evelyn photo is wrong | Replace with `sastreria-evelyn-fernandez.png` | 🟢 Done | Asset applied |
| S-04 | "Where the suit is born" shows people, not the space | Replace with workshop/premises photos | 🟢 Done | Assets applied |
| S-05 | "Book appointment" button redirects to "Book video call" | Fix CTA target to `/contacto` | 🟢 Done | |
| S-06 | First photo of the tab needs changing | Replace with `sastreria-hero.png` | 🟢 Done | Asset applied |
| S-07 | Copy: "hand-sewn" should be "handmade" | Replaced globally in all 4 languages | 🟢 Done | |
| S-08 | Hero/overview image | Use `sastreria-overview.png` | 🟢 Done | Asset applied |
| S-09 | Cut / By Hand section image | Use `sastreria-cut-by-hand.png` | 🟢 Done | Asset applied |
| S-10 | Artisan Process / The Detail image | Use `sastreria-artisan-detail.png` | 🟢 Done | Asset applied |
| S-11 | Next Step section image | Use `sastreria-next-step.png` | 🟢 Done | Asset applied |

---

## WEDDINGS AND CEREMONIES (BODAS Y CEREMONIAS)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| W-01 | First photo is of a shirt, not a wedding | Replace with `bodas-hero.png` | 🟢 Done | Asset applied |
| W-02 | "Exclusive one" ("uno exclusivo") section is unclear | Remove this section entirely | 🟢 Done | Already removed |
| W-03 | Morning coat photo shows smiling guy in blazer | Replace with actual morning coat image | 🟢 Done | Asset applied |
| W-04 | Bridal details shows beige summer suit | Remove that photo | 🟢 Done | Already removed |
| W-05 | Lining photo shows a suit, not a lining | Replace with actual lining image | 🟢 Done | Asset applied |
| W-06 | Missing a dedicated Suits section | Suits category exists in 4-card grid (`bodas-suit.png`) | 🟢 Done | |
| W-07 | Formal attire order is wrong | Reordered: Morning Coat → Stroller → Tuxedo → Bespoke Suit | 🟢 Done | |
| W-08 | Add all wedding photos from shared folder | Populate weddings tab with full photo set | ⚪ Blocked | Awaiting full folder from client |
| W-09 | Stroller section image | Use `bodas-stroller.png` | 🟢 Done | Asset applied |
| W-10 | Suit section image | Use `bodas-suit.png` | 🟢 Done | Asset applied |
| W-11 | Buttons section image | Use `bodas-buttons.png` | 🟢 Done | Asset applied |
| W-12 | Fabrics section image | Use `bodas-fabrics.png` | 🟢 Done | Asset applied |
| W-13 | Ceremony section image | Use `bodas-ceremony.png` | 🟢 Done | Asset applied |

---

## SERVICES (SERVICIOS)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| V-01 | First and second photos need changing | Hero + overview images updated | 🟢 Done | Assets applied |
| V-02 | "See the tailoring" button appears in all tabs | Removed from tabs where it doesn't belong | 🟢 Done | |
| V-03 | "98% satisfied customers" section | Removed entirely | 🟢 Done | |
| V-04 | "THE REPERTOIRE" section has dates on all services | Removed dates from every service | 🟢 Done | |
| V-05 | "THE REPERTOIRE" services have no photos | Add a photo to each of the 10 services | ⚪ Blocked | Needs asset mapping from client |
| V-06 | "Where we work with clients" missing DHL Express | Added DHL EXPRESS service mention | 🟢 Done | |
| V-07 | "40 years of trade" → "40 years of experience" | Updated in all 4 languages | 🟢 Done | |
| V-08 | Missing textile houses list | Added Reda, Luvit, Carnet, Harrison, Fox Brothers, Zegna | 🟢 Done | |
| V-09 | Other service photos should be seen together | Replaced morph gallery with grouped photo grid | 🟢 Done | |

---

## VIDEO CALL (VIDEOLLAMADA)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| VC-01 | First photo has Diego Carlos in it | Replaced with `videollamada-overview.png` | 🟢 Done | Asset applied |
| VC-02 | Schedule hours are wrong | Corrected to Mon–Fri 10:00–14:00 & 17:00–20:00; Sat 10:00–13:00 | 🟢 Done | All 4 languages |
| VC-03 | Video call photo needs changing | Replaced with new image | 🟢 Done | Asset applied |
| VC-04 | "The Tailoring in your Living Room" → "your space" | Updated heading in all 4 languages | 🟢 Done | |
| VC-05 | Bank details section is not ready | Removed/hidden until ready | 🟢 Done | |
| VC-06 | Video call request emails are not arriving | Replaced fake confirmation with locale-aware `mailto:` link that opens user's email client with pre-filled booking details | 🟢 Done | |

---

## MENU / NAVIGATION

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| N-01 | "Where we are" shows plain text address | Redirect to Google Maps | 🟢 Done | |
| N-02 | Homepage shows useless "Home" button | Removed when already on homepage | 🟢 Done | |
| N-03 | "Editorial Inspiration" appears twice | Removed duplicate | 🟢 Done | |
| N-04 | "Read more" buttons in Editorial Inspiration don't work | Linked to `/contacto` | 🟢 Done | |
| N-05 | Before/After shows same photo with basting stitches | Replace with actual before/after pair | ⚪ Blocked | Needs assets from client |

---

## MOBILE VERSION

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| M-01 | "Where we work" map does not appear on mobile | Globe now hidden on ALL mobile (was only iPhone) | 🟢 Done | |

---

## MANUEL SECTION

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| MF-01 | "He has learned from great Spanish master tailors" | Removed this phrase | 🟢 Done | |

---

## CONTACT

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| C-01 | **BOOK APPOINTMENT BUTTON DOES NOT WORK** | Hero CTA links to `/contacto`. Contact form uses `mailto:` (requires email client). Proper form submission needs backend/API | 🟡 Partial | `mailto:` works; full form submission needs email service |
| C-02 | Contact page image | Use `contacto-page.png` | 🟢 Done | Asset applied |
| C-03 | Contact section image | Use `contacto-section.png` | 🟢 Done | Asset applied |

---

## ONLINE COURSES

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| CU-01 | Change all photos | Replace course images with `cursos-overview.jpg` | 🟢 Done | Asset applied |

---

## CONFIGURATOR

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| CF-01 | Remove "7 steps" number | Removed numbered step indicator | 🟢 Done | |
| CF-02 | Step order wrong | Restructured to 3 steps: Fabric Selection → Measurements → Design & Customization | 🟢 Done | |
| CF-03 | Configurator overview image | Use `configurador-overview.png` | 🟢 Done | Asset applied |

---

## FOOTER / LEGAL

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| L-01 | "Legal Notice" link goes to 404 | Created `/legal` page with translations | 🟢 Done | |

---

## ADDITIONAL FIXES APPLIED (NOT IN ORIGINAL TRACKER)

- **Deleted unused `ServiciosSimple.tsx`** — contained hardcoded Spanish text, outdated "sin patrones industriales" copy, and no Italian/French support
- **Navigation contact buttons** — "Llámanos" / "Dónde Estamos" now locale-aware (es/en/it/fr)
- **Videollamada booking mailto** — email body now locale-aware in all 4 languages
- **ErrorBoundary component** — added to prevent blank screens from 3D viewer crashes
- **Globe lazy loading** — `next/dynamic` with SSR disabled for better initial load
- **Google Reviews badge** — now clickable, links to Google Maps profile

---

## STILL BLOCKED / AWAITING ASSETS

| ID | Issue | Why Blocked |
|----|-------|-------------|
| H-08 | Homepage carousel varied photos | Needs new/different photos from client |
| N-05 | Before/After slider different photos | Needs actual before/after pair from client |
| V-05 | 10 individual service photos | Only overview image provided; need per-service photos |
| W-08 | Full wedding photo set | Awaiting full folder from client |

---

## STILL PENDING (NON-BLOCKED)

| ID | Issue | Notes |
|----|-------|-------|
| H-01 | Mobile version is top priority | Requires dedicated mobile-first CSS audit |
| H-02 | Full speed audit | ErrorBoundary + lazy loading applied; full bundle audit still needed |
| C-01 | Full form submission backend | Current `mailto:` approach works but requires user to have email client configured |

---

*Last updated: May 11, 2026*
