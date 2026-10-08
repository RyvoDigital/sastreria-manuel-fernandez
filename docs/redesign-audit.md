# Redesign audit — Step 0

Branch `feat/web-oct` at `16d2bc0`, 8 Oct 2026. Production build (`next build` + `next start`) against the production database, captured with headless Chrome (Playwright) at 390×844 (iPhone UA, touch) and 1440×900, plus a JavaScript-disabled pass at 390. No code was changed.

Screenshots live in [`docs/redesign-audit/`](redesign-audit/):
- `<page>-<w>-fold.jpg` — first viewport, 1.5 s after the loading screen lifts.
- `<page>-<w>-N-sheet.jpg` — the whole page after scrolling through it, cut into side-by-side columns (magenta = past the end of the page).
- `nojs-390-sheet.jpg` — home, Bodas, La Sastrería with JavaScript disabled.

The text-source inventory (messages keys vs `editable_content` vs hard-coded, per page) is in [`redesign-audit-text-sources.md`](redesign-audit-text-sources.md).

Severity: **P0** broken / SEO-damaging / client rule, **P1** visible jank or unprofessional, **P2** polish.

---

## 1. Measured, every route

| Route | h1 (390 / 1440) | CLS 1440 | Loading screen | No-JS text (chars) |
|---|---|---|---|---|
| `/` | 1 | 0.001 | 2.1 s | 5 307 (hero hidden under loader) |
| `/la-sastreria` | **0** | **0.93** | 2.0 s | 3 127 |
| `/servicios` | **0** | 0.001 | 2.1 s | 2 019 |
| `/bodas-y-ceremonia` | 1 | **0.40** | 2.0 s | **466 — spinner + footer only** |
| `/cursos` | 1 | **0.40** | 2.0 s | **466** |
| `/contacto` | 1 | **0.25** | 2.1 s | **466** |
| `/videollamada` | → 307 redirect to `/contacto` | | | |
| `/legal` | 1 | 0.001 | 2.0 s | 1 201 |
| 8 landing pages | 1 each | 0.001 | 2.0 s | 2 100–5 100 |
| 404 | 1 ("404") | 0.001 | 2.0 s | 500 |

No route overflows horizontally (`scrollWidth = clientWidth` everywhere), but see the clipped footer link below. No console errors on any page.

---

## 2. Global (header, footer, loader, infrastructure)

| # | Sev | Finding | Where |
|---|---|---|---|
| G1 | P0 | **LoadingScreen covers every page for ~2.1 s on every hard load** (first visit, reload, arrival from Google). It is in the server HTML, so with JS off or a JS failure the first viewport stays black forever (`nojs-390-sheet.jpg`). It hides the hero's own reveal and is the main reason for the 24.7 s LCP baseline. | `components/global/LoadingScreen.tsx` |
| G2 | P0 | Hooks called after an early return (`if (pathname.startsWith('/admin')) return null` before `useEffect`) — React throws when client-navigating between admin and public. | `LoadingScreen.tsx:15`, `ScrollToTopButton.tsx:12` |
| G3 | P0 | **`ServiceGate` renders a spinner on the server** (`loading` starts `true`), so `/bodas-y-ceremonia`, `/cursos`, `/contacto` ship no content to crawlers or no-JS users, and the footer jumps when content arrives (the 0.25–0.40 CLS). Contacto/Cursos then add a second 100vh `Suspense` spinner (`useSearchParams`). | `components/global/ServiceGate.tsx:17`, `ContactPage.tsx:776`, `CursosLayout.tsx:248` |
| G4 | P0 | `robots.ts` disallows `/_next/` — Googlebot cannot fetch JS/CSS, so it renders client-only pages as a bare spinner. | `app/robots.ts:9` |
| G5 | P1 | Settings arrive after mount: nav items and home service cards render all, then disabled ones disappear, reflowing the centred split nav and the card grid. | `Navigation.tsx:75`, `ServicesEnhanced.tsx:70` |
| G6 | P1 | `editable_content` arrives after mount: home h1 text and contact phone/address/hours swap from the dictionary value to the DB value (flash + shift; never in server HTML). | `lib/content-provider.tsx:26`, `HeroEnhanced.tsx:145`, `ContactPage.tsx:247` |
| G7 | P1 | `useIsMobile` / `useIsIPhone` start `false`, so 27 components render desktop first and swap to mobile after hydration (BodasHero swaps its whole tree; ZoomParallax renders a 300vh section then collapses). | `lib/use-mobile.ts:5`, `lib/use-iphone.ts:9` |
| G8 | P1 | Tiny repeated layout shifts on `.mf-nav-row` ~3.7 s after load on every desktop page (nav entrance animates a layout property). | `components/global/Navigation.tsx` |
| G9 | P1 | Lenis runs its own rAF (not on `gsap.ticker`, no `ScrollTrigger.update` on scroll), `duration: 1.4` heavy smoothing, never disabled for reduced motion, rAF leaks on unmount, `ScrollTrigger.refresh()` never called after images load. | `lib/lenis-provider.tsx` |
| G10 | P1 | Footer bottom row: "Aviso legal" is clipped off the right edge at 390 (only "A / L" visible). | `FooterEnhanced.tsx` (bottom row), see `legal-390-0-sheet.jpg` |
| G11 | P1 | Footer giant "FERNÁNDEZ" watermark is cut to "FERN"/"FE" and sits behind the contact column, reading as a rendering error. | `FooterEnhanced.tsx:70` |
| G12 | P1 | Footer column links wrap awkwardly ("SASTRERÍA / ARTESANAL", "BODAS Y / CEREMONIA") at 1440 because columns are too narrow; footer CTA uses a 4px radius and a glow no other button has. | `FooterEnhanced.tsx` |
| G13 | P1 | ScrollToTopButton (z 9999) floats over the open mobile menu panel (z 1000); payment-success banner on Contacto (z 100) sits under the nav (z 1001), hiding the paid-videocall confirmation. | `ScrollToTopButton.tsx:41`, `ContactPage.tsx:321` |
| G14 | P1 | Fonts: Inter 600/700 and weight 900 are used but not loaded (faux bold); LoadingScreen hard-codes `"Cormorant Garamond"`, which next/font renames, so the loader text renders in Georgia. Cormorant loads 8 faces. | `app/layout.tsx:25-38`, `LoadingScreen.tsx:82` |
| G15 | P1 | `/favicon.ico` is the 522 KB 2704×1780 logo PNG renamed; the real 26 KB ICO is the typo file `app/favicoin.ico`. `icons.icon` points at a 142 KB PNG. | `app/favicon.ico`, `app/favicoin.ico` |
| G16 | P1 | No Open Graph / Twitter image anywhere — shares have no picture. `/legal` has no title of its own. Title separators mix "·" and "\|". | route `metadata` |
| G17 | P1 | Contrast: `rgba(255,255,255,0.3–0.45)` on navy (≈2.4–3.9:1) for footer, form labels, captions; 7.7–8.8 px text in several eyebrows (`BodasHero:241`, `Credenciales:307`). | many, see §6 |
| G18 | P2 | `--header-offset` (88 px) ≠ real desktop header (108 px); 3 px webkit scrollbar; `sitemap.ts` stamps `lastModified: new Date()` on every build. | `globals.css`, `app/sitemap.ts:35` |
| G19 | P2 | Three `<nav>` elements share one aria-label. | `Navigation.tsx:122,129,158` |

## 3. Home `/`

Screens: `home-390-fold.jpg`, `home-390-0/1-sheet.jpg`, `home-1440-fold.jpg`, `home-1440-0/1-sheet.jpg`.

| # | Sev | Finding | Where |
|---|---|---|---|
| H1 | P1 | Hero: h1 parts, subtext and CTAs start at inline `opacity: 0` and only appear via GSAP (hidden without JS). | `HeroEnhanced.tsx:309–450` |
| H2 | P1 | Hero mouse parallax calls `setState` on every mousemove and writes `transform` on the same node GSAP scrubs → jitter when scrolling with the mouse moving. | `HeroEnhanced.tsx:149-165, 292` |
| H3 | P1 | Hero at 390: three stacked CTAs of three different widths; the "DESCUBRIR" scroll hint sits half-hidden under "CONTACTAR"; eyebrow-h1 wraps with an orphan "MADRID". At 1440 the CTAs float mid-right, unaligned with the copy on the left. | `HeroEnhanced.tsx`, `home-390-fold.jpg` |
| H4 | P1 | `100vh` + `minHeight: 700px` hero (taller than an iPhone SE); bottom-anchored copy lands under the Safari toolbar. | `HeroEnhanced.tsx:213` |
| H5 | P1 | 3.4 MB hero video autoplays on mobile too (autoplay overrides `preload="metadata"`), no reduced-motion / save-data branch. | `HeroEnhanced.tsx:233` |
| H6 | P1 | Scroll indicator animated twice (GSAP + CSS `fadeIn` restarting at 1.5 s) → flicker; "since" label also double-animated (and empty in all locales). | `HeroEnhanced.tsx:300-451` |
| H7 | P1 | DetailGallery marquee: `x: [0,-4650]` assumes 15 images but there are 12 → visible jump each loop; all 24 images eager; `alt="Detail N"`. | `DetailGallery.tsx:44,71` |
| H8 | P1 | "Tu traje empieza en ti": a stray decorative `"` glyph floats below the body, plus a large empty white block under it at 390. | `TrajeEmpiezaSection.tsx:195` |
| H9 | P1 | ZoomParallax (1440): the pinned photo cluster leaves ~1 000 px of empty navy beneath it; on iPhone it renders 300vh then collapses (G7). | `ZoomParallaxSection.tsx:65,114` |
| H10 | P1 | Process cards: giant ghost numerals "01/02/03" clipped at the card edge; "PASO 03" eyebrow sits on top of faces in the photo. | `ProcessCardsEnhanced.tsx` |
| H11 | P1 | Editorial cards (1440): random card sizes with 11 px excerpts and lots of empty card area; alternating cream/white backgrounds look unintentional. | `EditorialSection.tsx` |
| H12 | P1 | Testimonials: auto-rotate every 3 s (too fast to read a long quote), pause only on mouse hover, card has large empty lower half at 1440. | `TestimonialsSection.tsx:18` |
| H13 | P1 | Before/after: `touchAction: none` on a 400–600 px block — vertical swipes over it don't scroll the page on phones; idle wobble never stops; handle not keyboard-operable. | `BeforeAfterSlider.tsx:65,144` |
| H14 | P2 | Section rhythm: navy → navy → white → navy → white → navy → white → navy footer, with different paddings each time (18 distinct paddings site-wide). | §6 |
| H15 | P2 | Suit showcase hotspots: icon-only buttons without accessible names. | `SuitShowcaseSection.tsx:143` |
| H16 | note | Copy that reads like brief notes rather than final copy (we keep it — text is frozen — but flagging for you/Evelyn): Fabrics "Fotografías macro de texturas de tejidos; procesos naturales (ovejas, cabras, fibra cruda, hilado)." and "Valores de marca: Sostenibilidad, selección artesanal, exclusividad material". | `messages/*.json → fabrics.*` |

## 4. La Sastrería `/la-sastreria`

Screens: `la-sastreria-390-0/1-sheet.jpg`, `la-sastreria-1440-0/1-sheet.jpg`.

| # | Sev | Finding | Where |
|---|---|---|---|
| S1 | P0 | **No h1** — "El Arte de Vestir Bien" is `<div>/<span>`. | `SastreriaHero.tsx:108-140` |
| S2 | **P0 client rule** | **"Donde Nace el Traje" main photo `interior-showroom-sastreria-madrid.webp` is a wide shot of the shop interior** (chandelier, full room). Constraint 1 says keep every photo in its slot *and* never show a wide interior. Proposed resolution: keep the slot, crop it hard (object-position + aspect ratio) to a detail (e.g. the shelving/cloth). **Needs your call.** `espacio-sastreria-showroom-01/02.webp` and `prueba-traje-showroom.webp` (landing) are medium shots with people — I read them as acceptable; tell me if not. | `EspacioSection.tsx:120` |
| S3 | P0 | CLS 0.93 at 1440: the pinned "El oficio" section's background (`.mf-fx-bg`) jumps when the pin engages; CSS `sticky` and a ScrollTrigger `pin` are applied to the same element; snapping via `setTimeout`; component mutates global `ScrollTrigger.config`. | `components/ui/full-screen-scroll-fx.tsx:36,404,412` |
| S4 | P1 | The CraftJourney section is client-only (server renders an `aria-hidden` 100vh placeholder); at 1440 the full-page view shows ~2 000 px of empty navy while the section pins. | `CraftJourneySection.tsx:81,101` |
| S5 | P1 | "Scroll" hint starts at `opacity: 0` outside the GSAP context — it never appears. | `SastreriaHero.tsx:155` |
| S6 | P1 | Hero image has a descriptive `alt` and `aria-hidden` at once. | `SastreriaHero.tsx:76` |
| S7 | P1 | CTA "Ver el proceso" links to the page you are on. | `SastreriaCTA.tsx:162` |
| S8 | P1 | Body copy at 1440 is ~11 px in Historia/Evelyn columns; the white Historia band butts against navy sections with no transition. Fixed gold thread starts at 76 px (header is 108 px). | `HistoriaSection.tsx`, `SastreriaLayout.tsx:25` |
| S9 | P2 | CraftJourney titles/labels ("Carácter", "Lana & Seda"…) are hard-coded Spanish — show in Spanish in EN/FR/IT. | `CraftJourneySection.tsx:55-77` |

## 5. Servicios `/servicios`

Screens: `servicios-390-0-sheet.jpg`, `servicios-1440-0-sheet.jpg`.

| # | Sev | Finding | Where |
|---|---|---|---|
| V1 | P0 | **No h1** — "Pure Bespoke" is a `<div>` (and hard-coded English). | `ServiciosHero.tsx:58,66` |
| V2 | P0 | Hero is `sticky` inside `overflow: hidden` parents, so it never pins: the 1 500 px clip-path reveal just scrolls past, leaving huge empty navy areas with a few floating photos (both widths). | `ServiciosHero.tsx:29,282`, `ServiciosLayout.tsx:9` |
| V3 | P0 | "SERVICIOS · EL REPERTORIO" list renders empty after scrolling (4 elements still `opacity: 0`); rows use `whileInView` without `once`, so they fade out and back in on every pass. | `ServiciosHero.tsx:151,231` |
| V4 | P1 | "Un Legado de" heading is set in Inter while every other heading is Cormorant; "EN EL MUNDO" is uppercase italic; a green "online" dot and a "Maestro Sastre" pill feel like app UI. | `CredencialesSection.tsx`, `TejidosMundoSection.tsx` |
| V5 | P1 | Fabric-house marquee is clipped mid-word at both ends ("llera"); caption and "Maestro Sastre" only switch es/en (FR/IT get English). | `CredencialesSection.tsx:307,332` |
| V6 | P1 | "En el mundo" section at 1440: text column left, an empty radial glow where a globe used to render on the right. | `TejidosMundoSection.tsx` |
| V7 | P2 | City list is hard-coded Spanish. | `TejidosMundoSection.tsx:161-171` |

## 6. Bodas y ceremonia `/bodas-y-ceremonia`

Screens: `bodas-y-ceremonia-390-0-sheet.jpg`, `bodas-y-ceremonia-1440-0-sheet.jpg`.

| # | Sev | Finding | Where |
|---|---|---|---|
| B1 | P0 | Whole page client-only (G3); CLS 0.40. | `app/bodas-y-ceremonia/page.tsx:13` |
| B2 | P1 | Hero h1 is small and crammed against a narrow portrait at 1440, with a ghost "Bodas" watermark under the photo; mobile and desktop are two different component trees swapped after hydration. | `BodasHero.tsx:12,153` |
| B3 | P1 | "ESTILOS DE CEREMONIA" eyebrow with no heading under it, then 4 cards of different heights at 1440 (staggered on purpose, but captions at 9 px are unreadable). | `BodasCategorias.tsx` |
| B4 | P1 | Carousel captions are hard-coded English ("Precision", "Atelier"…) on a Spanish page; 8 px captions. | `BodasCarrusel.tsx:7-19,148` |
| B5 | P1 | Heading casing inconsistent: "¿TE CASAS?" all caps, "ENTREGA FINAL" caps among title-case steps (copy is frozen; casing can be normalised in CSS only if the source is not caps — to check per string). | `BodasTeCasas.tsx`, `BodasProceso.tsx` |
| B6 | P1 | Proceso H3s follow an eyebrow with no H2 in Statement/Categorias; "Desde la primera cita" is used as two different section titles (copy — flag only). | `BodasProceso.tsx`, `BodasFormalWear.tsx` |
| B7 | P2 | "Vestimenta & Accesorios" heading only switches es/en. | `BodasFormalWear.tsx:71` |

## 7. Cursos `/cursos`

Screens: `cursos-390-0-sheet.jpg`, `cursos-1440-0-sheet.jpg`.

| # | Sev | Finding | Where |
|---|---|---|---|
| C1 | P0 | Client-only (G3); CLS 0.40. | `app/cursos/page.tsx:13` |
| C2 | P1 | Copy contradiction: section subtitle "PRÓXIMAMENTE" / "Estamos preparando…" above six cards all badged "DISPONIBLE" with "VER CURSO" buttons (copy frozen — flag for you). | `CursosList.tsx:160-205` |
| C3 | P1 | Hero photo is a medium-wide shop shot with shelving (`curso-sastreria-mesa-corte.webp`); fine under the rule as I read it (subject is Manuel at the table), but darkened to near-illegible. | `CursosLayout.tsx:118` |
| C4 | P1 | Large empty band (~250 px) between cards and footer; play-button overlays on thumbnails that aren't videos; pill badges and full-width gold buttons on every card make six identical loud CTAs. | `CursosList.tsx` |
| C5 | P2 | Typo in the payment gate ES copy: "Aprende desde anywhere". | `CursosPaymentGate.tsx:40` |

## 8. Contacto `/contacto` (and `/videollamada`)

Screens: `contacto-390-0-sheet.jpg`, `contacto-1440-0-sheet.jpg`.

| # | Sev | Finding | Where |
|---|---|---|---|
| K1 | P0 | Client-only (G3); CLS 0.25; CMS phone/address/hours never in the HTML (G6). | `app/contacto/page.tsx:13` |
| K2 | P1 | At 390 the first screen is entirely a dark photo with a rotating quote and "02 / 03" counter — the h1 "Hablemos" and the contact details are below the fold. Stray corner-bracket ornament top-left. | `ContactPage.tsx:317-432` |
| K3 | P1 | At 1440 "CONTACTO · MADRID" starts right under the nav (tight), the form section is cramped against the right edge, ghost "ENVIAR" button is lower-contrast than the four booking cards above it. | `ContactPage.tsx` |
| K4 | P1 | Booking calendar month arrows have no accessible name; weekdays hard-coded Spanish in all locales. | `BookingCalendar.tsx:25,540,555` |
| K5 | P1 | The `videollamada` enabled flag's ternary has the same value in both branches. | `ContactPage.tsx:544` |
| K6 | note | `/videollamada` is a server redirect to `/contacto`; `components/videollamada/*` (6 files, ~1 650 lines) is unreachable. Videollamada now lives as a booking option on Contacto. I'll treat "Videollamada" in Step 3 as that option + the redirect, unless you want the page back. | `app/videollamada/page.tsx:10` |

## 9. Landing pages (8, shared template)

Screens: `trajes-a-medida-madrid-390/1440-0-sheet.jpg`, `*-fold.jpg` for all eight.

| # | Sev | Finding | Where |
|---|---|---|---|
| L1 | P1 | Process numerals "01 02 03" are almost invisible (≈1.3:1 on near-black). | `components/landing/primitives.tsx` (Steps) |
| L2 | P1 | Hero crop on Trajes a medida shows only a waistcoat torso band; on 390 "LA PRENDA" eyebrow collides with the bottom of the preceding photo. | `TrajesAMedidaMadrid.tsx:133-144` |
| L3 | P1 | Two templates co-exist: `LandingPage.tsx` (6 pages) and custom layouts for `trajes-a-medida-madrid` and `sastreria-artesanal-madrid` — spacing and image treatment differ between them. | `components/landing/*` |
| L4 | P2 | 1440: text column sits in a narrow left-offset column with very small body text (≈13 px) and lots of dead space right. | `LandingPage.tsx` |
| L5 | ok | Server-rendered, one h1, Service + FAQPage JSON-LD, canonical. These are the healthiest pages. | |

## 10. Legal, error, 404

| # | Sev | Finding | Where |
|---|---|---|---|
| X1 | P0 | **No `app/not-found.tsx`** — 404 is Next's default English "This page could not be found." on white, with the transparent nav unreadable white-on-white. | `esta-pagina-no-existe-1440-0-sheet.jpg` |
| X2 | P1 | `error.tsx` is Spanish-only hard-coded, button uses a different style (4 px radius, Inter 600). | `app/error.tsx` |
| X3 | P2 | Legal H2s are styled as 12 px gold eyebrows; the page is a plain list with a fixed 120 px top. | `app/legal/page.tsx` |

---

## 11. Motion, design system, dead code

**Motion libraries.** framer-motion only: 13 live components (ZoomParallax, BeforeAfter, DetailGallery, Testimonials, SuitShowcase, ScrollToTop, Footer, SastreriaLayout thread, ServiciosHero, BodasHero, BodasStatement, CursosList, BookingCalendar). GSAP + framer in the same file: BodasProceso, BodasSuitSection, Editorial, Fabrics, ContactPage. GSAP only: ~20. Plus Lenis and CSS keyframes (Ken Burns ×2, marquee, 4 copies of an inline `@keyframes spin`). framer usages that are just ScrollTrigger scrubs or reveal fades: ZoomParallax, SastreriaLayout thread, ServiciosHero, every `whileInView`, DetailGallery marquee. Legitimate framer uses to keep: AnimatePresence step transitions in Contact/Booking, SuitShowcase popovers. **prefers-reduced-motion** is honoured in only 5 places; missing for Lenis, loader, hero video/particles/parallax, marquees, Ken Burns, every GSAP reveal and every `whileInView`.

**Design-system drift.** 97 distinct font sizes (28 fixed rem values from 0.48 to 1.8 rem; eyebrows alone use six sizes and seven letter-spacings). `#C9A84C` hard-coded 147× vs `var(--color-gold)` 44×, and two other golds in use (`#C4A35A` ×27, `#C9A96E` ×7). Six off-token near-blacks. At least seven unrelated CTA styles (padding, size, tracking, 0 vs 4 px radius, glow), hover via JS `onMouseEnter`, no `:focus-visible`. 18 distinct section paddings, `--section-padding` never used, vh- and vw-based paddings mixed. Card radius 2/4/8/12 px. Unused global classes: `.btn-*`, `.section`, `.container`, `.gsap-reveal*`, `.text-*`.

**Dead code / assets** (to delete in Step 4).
- Unimported components: `global/{CustomCursor,Footer,PublicSiteChrome}`, `home/{HeroNew,ProcessCardsSection,ServicesOverview,ProcesoSection}`, `la-sastreria/{CifrasSection,MaestroSection,OficioGrid,OficioFlipSection}`, `ui/{flip-gallery,error-boundary}`, `servicios/{ServiciosCTA,ServiciosMorphGallery}`, all of `components/videollamada/`.
- Unreferenced: `public/logo.png` (522 KB), `public/hero-bg.avif`, create-next-app SVGs, `img/ajuste-cintura-pantalon.webp`, `img/chaqueta-gris-raya-diplomatica-maniqui.webp`, `img/patron-chaqueta-piezas-cortadas.webp`.
- Byte-identical duplicates: `botones-tweed-detalle` = `botones-manga-tweed` (511 KB each), `traje-tweed-madrid-calle` = `americana-marron-medida-madrid` (276 KB each). They occupy different slots, so both stay; Step 4 can point both slots at one file.
- Only 5 files use `next/image`; ~40 raw `<img>` without dimensions or `sizes`. `public/img` is 16 MB / 120 files; 21 files > 200 KB.
- The `wip/b4-speed` branch already removes the logo PNG, hero-bg, Next SVGs, adds a 1.4 MB portrait hero video, crest WebPs and `scripts/image-variants.mjs` — Step 4 starts from there.

**editable_content.** Admin defines 8 ids; 5 are consumed (`hero.title`, `hero.subtitle`, `contact.phone`, `contact.address`, `business.hours`); `videocall.price`, `configurator.price`, `courses.price` are consumed nowhere (prices come from settings). Values are locale-independent and fetched client-side. Every binding must survive; I'll also move the fetch server-side so they reach the HTML (no admin code touched).

---

## 12. Decisions I need from you

1. **S2 — the wide showroom photo on La Sastrería.** Keep it in its slot cropped to a detail (my proposal), or treat it as acceptable?
2. **Videollamada (K6).** Step 3 lists it as a page; today it's a redirect to Contacto's booking option. Keep it that way (I redesign the booking option) or restore a page?
3. **Hard-coded strings in only one or two languages** (CraftJourney titles, "Pure Bespoke", Bodas carousel captions, "Maestro Sastre", error page…). "Not one word changes" — I will leave them exactly as they are unless you want them moved into the four message files with translations.
4. **Copy flags** H16 and C2 (brief-like fabrics text, "Próximamente" above available courses) — left untouched; flagging only.
