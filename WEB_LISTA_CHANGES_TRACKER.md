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
| H-01 | Mobile version is top priority | Ensure all fixes are mobile-first | 🔴 Pending | |
| H-02 | Website very slow + random blank screens | Audit bundle size, memory leaks, lazy loading, error boundaries | 🔴 Pending | Critical |
| H-03 | "Sartorial interpretation" section is duplicated | Remove the second repeated block | 🔴 Pending | |
| H-04 | Hyphens everywhere make text look artificial | Remove ALL hyphens across the site (already mentioned in prior meetings) | 🔴 Pending | Global copy sweep needed |
| H-05 | Manuel & Evelyn Fernández section is disorganized | Fix names: "Evelyn" → "Evelyn Fernández", add "Manuel Fernández". Move section to proper placement, increase font size. | 🔴 Pending | |
| H-06 | Workshop section has 4 disconnected images (precision, details, wool, cashmere) | Remove those 4 images — they have no connecting thread | 🔴 Pending | |
| H-07 | No photos of the actual premises/workshop | Add photos of the premises (`sastreria-space-01/02/03.png`) | 🔴 Pending | Assets ready |
| H-08 | Homepage photo carousel has 3 identical photos | Replace with varied photos: different locations, people in background, etc. | 🔴 Pending | Needs new assets |
| H-09 | Google Reviews not rotating; only Josh Nicolás fake review shows | Remove fake Josh Nicolás review. Connect directly to real Google reviews API/embed. | 🔴 Pending | Remove fabricated review immediately |
| H-10 | "Wool and silk" section has no wool/silk images and is disconnected | Remove the entire "wool and silk" section | 🔴 Pending | |

---

## ARTISAN TAILORING (SASTRERÍA ARTESANAL)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| S-01 | "Without industrial patterns" still present | Delete this phrase/section | 🔴 Pending | |
| S-02 | Manuel photo in history section is wrong | Replace with `sastreria-manuel-fernandez.png` | 🔴 Pending | Asset ready |
| S-03 | Evelyn photo is wrong | Replace with `sastreria-evelyn-fernandez.png` | 🔴 Pending | Asset ready |
| S-04 | "Where the suit is born" shows people, not the space | Replace with actual workshop/premises photos (`sastreria-space-01/02/03.png`) | 🔴 Pending | Assets ready |
| S-05 | "Book appointment" button redirects to "Book video call" | Fix CTA target: appointment booking ≠ video call booking | 🔴 Pending | Route fix |
| S-06 | First photo of the tab needs changing | Replace with `sastreria-hero.png` | 🔴 Pending | Asset ready |
| S-07 | Copy: "hand-sewn" should be "handmade" | Replace globally: **HAND-SEWN → HANDMADE** | 🔴 Pending | All 4 languages |
| S-08 | Hero/overview image | Use `sastreria-overview.png` | 🔴 Pending | Asset ready |
| S-09 | Cut / By Hand section image | Use `sastreria-cut-by-hand.png` | 🔴 Pending | Asset ready |
| S-10 | Artisan Process / The Detail image | Use `sastreria-artisan-detail.png` | 🔴 Pending | Asset ready |
| S-11 | Next Step section image | Use `sastreria-next-step.png` | 🔴 Pending | Asset ready |

---

## WEDDINGS AND CEREMONIES (BODAS Y CEREMONIAS)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| W-01 | First photo is of a shirt, not a wedding | Replace with `bodas-hero.png` | 🔴 Pending | Asset ready |
| W-02 | "Exclusive one" ("uno exclusivo") section is unclear | Remove this section entirely | 🔴 Pending | |
| W-03 | Morning coat (frac) photo shows smiling guy in blazer, not a morning coat | Replace with actual morning coat image (`bodas-morning-coat.png` / `producto-morning-coat.png`) | 🔴 Pending | Asset ready |
| W-04 | Bridal details shows beige summer suit (unrelated) | Remove that photo | 🔴 Pending | |
| W-05 | Lining photo shows a suit, not a lining | Replace with actual lining image (`bodas-lining.png`) | 🔴 Pending | Asset ready |
| W-06 | Missing a dedicated Suits section | **Create new Suits section** | 🔴 Pending | New component |
| W-07 | Formal attire order is wrong | Follow exact order: **Morning Coat (Frac) → Stroller (Chaqué) → Tuxedo (Esmoquin) → Bespoke Suit (Traje a medida)** | 🔴 Pending | Reorder tabs/sections |
| W-08 | Add all wedding photos from shared folder | Populate weddings tab with full photo set | 🔴 Pending | Awaiting full folder |
| W-09 | Stroller (Chaqué) section image | Use `bodas-stroller.png` | 🔴 Pending | Asset ready |
| W-10 | Suit (new section) image | Use `bodas-suit.png` | 🔴 Pending | Asset ready |
| W-11 | Buttons section image | Use `bodas-buttons.png` | 🔴 Pending | Asset ready |
| W-12 | Fabrics section image | Use `bodas-fabrics.png` | 🔴 Pending | Asset ready |
| W-13 | Ceremony section image | Use `bodas-ceremony.png` | 🔴 Pending | Asset ready |

---

## SERVICES (SERVICIOS)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| V-01 | First and second photos need changing | Replace hero with `servicios-hero.png`; replace overview with `servicios-overview.jpg` | 🔴 Pending | Assets ready |
| V-02 | "See the tailoring" ("Ver la sastrería") button appears in all tabs | Remove this button from tabs where it doesn't belong | 🔴 Pending | |
| V-03 | "98% satisfied customers" section | Remove entirely | 🔴 Pending | |
| V-04 | "THE REPERTOIRE" section has dates on all services | Remove dates from every service | 🔴 Pending | |
| V-05 | "THE REPERTOIRE" services have no photos | Add a photo to each of the 10 services | 🔴 Pending | Needs asset mapping |
| V-06 | "Where we work with clients" missing DHL Express | Add: "We offer DHL EXPRESS service" | 🔴 Pending | Copy update |
| V-07 | "40 years of trade" → "40 years of experience" | Update copy in all 4 languages | 🔴 Pending | |
| V-08 | Missing textile houses list | Add: **Reda, Luvit, Carnet, Harrison, Fox Brothers, Zegna** | 🔴 Pending | Copy update |
| V-09 | Other service photos should be seen together, not one-by-one | Change gallery/layout to group view; remove photo of Manuel with the suits | 🔴 Pending | Layout change |

---

## VIDEO CALL (VIDEOLLAMADA)

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| VC-01 | First photo has Diego Carlos in it | Replace with `videollamada-overview.png` (photo without Diego Carlos) | 🔴 Pending | Asset ready |
| VC-02 | Schedule hours are wrong | Correct to: **Mon–Fri 10:00–14:00 & 17:00–20:00; Sat 10:00–13:00** | 🔴 Pending | All 4 languages |
| VC-03 | Video call photo needs changing | Replace with new image (to be provided or use `videollamada-overview.png`) | 🔴 Pending | Asset ready |
| VC-04 | "The Tailoring in your Living Room" → "your space" | Update heading: **"The Tailoring in your Space"** | 🔴 Pending | All 4 languages |
| VC-05 | Bank details section is not ready | Remove/hide bank details until ready | 🔴 Pending | |
| VC-06 | Video call request emails are not arriving | Fix email integration / notification pipeline | 🔴 Pending | Backend/API fix |

---

## MENU / NAVIGATION

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| N-01 | "Where we are" ("Dónde estamos") shows plain text address | Redirect to Google Maps or embed a map directly on the page | 🔴 Pending | |
| N-02 | Homepage shows useless "Home" button in "Our services" | Remove "Home" button when already on homepage | 🔴 Pending | |
| N-03 | "Editorial Inspiration" appears twice | Remove duplicate; fix so only one instance remains | 🔴 Pending | |
| N-04 | "Read more" buttons in Editorial Inspiration don't work | Fix links or remove broken buttons | 🔴 Pending | |
| N-05 | Before/After shows same photo with basting stitches | Replace with actual before/after pair (different photos) | 🔴 Pending | Needs assets |

---

## MOBILE VERSION

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| M-01 | "Where we work" map does not appear on mobile | Fix map visibility/responsiveness on mobile breakpoints | 🔴 Pending | |

---

## MANUEL SECTION

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| MF-01 | "He has learned from great Spanish master tailors" | Remove this phrase | 🔴 Pending | Copy update |

---

## CONTACT

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| C-01 | **BOOK APPOINTMENT BUTTON DOES NOT WORK** | Fix button action / route / form | 🔴 Pending | Critical |
| C-02 | Contact page image | Use `contacto-page.png` | 🔴 Pending | Asset ready |
| C-03 | Contact section image (if separate) | Use `contacto-section.png` | 🔴 Pending | Asset ready |

---

## ONLINE COURSES

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| CU-01 | Change all photos | Replace course images with `cursos-overview.jpg` and any additional course assets | 🔴 Pending | Asset ready (overview) |

---

## CONFIGURATOR

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| CF-01 | Remove "7 steps" number | Remove the numbered step indicator | 🔴 Pending | |
| CF-02 | Step order wrong | Reorder to: **1. Fabric Selection → 2. Measurements → 3. Design & Customization** | 🔴 Pending | |
| CF-03 | Configurator overview image | Use `configurador-overview.png` | 🔴 Pending | Asset ready |

---

## FOOTER / LEGAL

| ID | Issue | Correction / Action | Status | Notes |
|----|-------|---------------------|--------|-------|
| L-01 | "Legal Notice" link goes to 404 | Create/fix the Legal Notice page or correct the link target | 🔴 Pending | |

---

## PRODUCT IMAGES (TO BE USED IN SERVICES / CONFIGURATOR)

| Product | File | Status |
|---------|------|--------|
| Morning Coat (Frac) | `producto-morning-coat.png` | ⚪ Ready for upload |
| Stroller (Chaqué) | `producto-stroller.png` | ⚪ Ready for upload |
| Tuxedo | `producto-tuxedo.png` | ⚪ Ready for upload |
| Artisan Suit | `producto-artisan-suit.png` | ⚪ Ready for upload |
| Artisan Coat | `producto-artisan-coat.png` | ⚪ Ready for upload |
| Blazer | `producto-blazer.png` | ⚪ Ready for upload |
| Shirts | `producto-shirts.png` | ⚪ Ready for upload |

---

## QUICK WINS (DO FIRST)

1. **Remove fake Josh Nicolás Google Review** (H-09)
2. **Fix Contact "Book Appointment" button** (C-01)
3. **Fix Legal Notice 404** (L-01)
4. **Change "hand-sewn" → "handmade"** globally (S-07)
5. **Remove "without industrial patterns"** (S-01)
6. **Remove "98% satisfied customers"** (V-03)
7. **Remove wool & silk section** (H-10)
8. **Fix videollamada schedule hours** (VC-02)

---

*Last updated: May 8, 2026*
