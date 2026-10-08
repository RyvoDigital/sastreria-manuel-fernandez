# Text-source inventory (preservation list for the redesign)

Companion to [`redesign-audit.md`](redesign-audit.md). Every text on every public page and where it comes from, so nothing is lost or re-worded. Paths are relative to the repo root. `t.x.y` = `messages/{es,en,fr,it}.json → x.y`. **HC** = hard-coded in JSX or in a component-local dictionary. **CMS** = `editable_content` via `useContent().getValue(id)`.

## 0. Infrastructure

- **i18n** — `lib/i18n.tsx`. Locale is client state only (starts `es`, no URL segment). `en.json` has exactly the es keys; `fr.json`/`it.json` have every es key plus orphan legacy keys (§15). Array lengths match in all four locales (testimonials.items=4, editorial.articles=5, bodas.formal_wear.items=4, bodas.accesorios.items=8, videollamada.gate.features=3, videollamada.how.steps=3, videollamada.value.features=4).
- Empty in all 4 locales but still rendered: `hero.since` (HeroEnhanced:312), `hero.subtext` (:400).
- **CMS** — `lib/content-provider.tsx:36`; `getValue(id)` returns the row value or `''`; **locale-independent** (a DB value replaces the copy in all 4 languages). Data: `app/api/content/route.ts` → `lib/admin/db.ts:206`. Table created at `scripts/setup-db.ts:122`; no rows seeded.
- **Settings** — `lib/settings-provider.tsx`; `isEnabled(id)` defaults to **true** when missing (:45); `getPrice(id)` → `price ?? null`. Seeds `scripts/setup-db.ts:141-155`: bodas, trajes(1200), configurador(29), cursos(350), cursos-intro/-canvas/-lapel/-pockets/-buttonholes/-finishes (350), videollamada(50), modelos3d, contacto.
- **Site constants** — `lib/site.ts`: SITE_NAME, SITE_PHONE_E164 '+34682192944', SITE_PHONE_DISPLAY '+34 682 19 29 44', SITE_STREET 'Calle de Jorge Juan, 41', SITE_POSTAL '28001', SITE_LOCALITY 'Madrid', SITE_INSTAGRAM.
- No `app/not-found.tsx`.

## 1. Global chrome (`app/layout.tsx`)

Order: LoadingScreen → Navigation → ScrollToTop → ScrollToTopButton → `<main>` → FooterEnhanced. HtmlLang sets `<html lang>`.

**layout.tsx (all HC):** metadata title 'Manuel Fernández · Sastrería Artesanal en Madrid' (:41), description (:42-43), 8 keywords (:44-53); JSON-LD description (:80), hours Mon–Fri 10–14 & 17–20, Sat 10–14 (:97-119), priceRange '€€€' (:120).

**Navigation** (`components/global/Navigation.tsx`)
| source | key/id | line |
|---|---|---|
| messages | `t.nav[key]` inicio, sastreria, bodas, servicios, cursos, contacto | :78 (items :23-30) |
| messages | `t.footer.address`, `t.footer.hours` (mobile panel) | :177, :178 |
| HC 4-locale `UI` | menu/close/call/language/nav/home ('Menú','Cerrar','Llámanos','Idioma','Navegación principal','Inicio') | :47-52 |
| HC | LOCALE_NAMES 'Español','English','Italiano','Français' | :34-39 (→ :189, :111) |
| HC | 'Jorge Juan 41 · Madrid' | :97 |
| site | SITE_PHONE_DISPLAY | :100 |
| HC | 'WhatsApp' | :102, :137, :183 |
| HC | locale codes ES/EN/IT/FR | :114 |
| HC | aria-label `Sastrería Manuel Fernández — ${ui.home}` | :124 |
| HC | wa.me/34682192944, Google Maps URL | :43-44 |

**FooterEnhanced** (`components/global/FooterEnhanced.tsx`)
| source | key/id | line |
|---|---|---|
| HC | 'FERNÁNDEZ' watermark | :70 |
| HC | 'Manuel Fernández' | :95 |
| messages | `t.nav.sastreria` (subtitle) | :104 |
| messages | `t.footer.tagline` | :114 |
| messages | `t.nav[key]` col1 inicio/sastreria/servicios/bodas, col2 cursos/contacto | :135, :155 |
| messages | `t.nav.contacto` (heading) | :174 |
| messages | `t.footer.address` / `phone` / `hours` | :191 / :205 / :208 |
| messages | `t.footer.cta_title` / `cta_btn` | :225 / :247 |
| messages | `t.footer.rights` | :268 |
| messages | `t.footer.instagram` | :283 |
| HC | 'Facebook', 'WhatsApp' | :296, :310 |
| messages | `t.footer.legal` | :322 |

**LoadingScreen:** HC alt 'Sastrería Manuel Fernández' (:72), 'Manuel Fernández' (:90). **ScrollToTopButton:** HC aria-label 'Scroll to top' (:36). **ServiceGate:** `t.coming_soon.title` (:49), `t.coming_soon.description` (:60), `t.nav.inicio` (:76).

## 2. Home (`app/page.tsx`)

Sections: HeroEnhanced, SeoIntro, ServicesEnhanced, DetailGallery, TrajeEmpiezaSection, ZoomParallaxSection, ProcessCardsEnhanced, EditorialSection, TestimonialsSection, BeforeAfterSlider, SuitShowcaseSection, FabricsSection.

| source | key/id | file:line |
|---|---|---|
| HC metadata | title 'Sastrería Artesanal a Medida en Madrid \| Manuel Fernández', description | app/page.tsx:18-20 |
| **CMS** | `getValue('hero.title') \|\| t.hero.tagline` | HeroEnhanced.tsx:145 (→ :368) |
| **CMS** | `getValue('hero.subtitle') \|\| t.hero.tagline2` | HeroEnhanced.tsx:146 (→ :382) |
| messages | `t.hero.since` (empty), `t.hero.seo_heading`, `t.hero.subtext` (empty) | :312, :352, :400 |
| messages | `t.hero.cta_book` / `cta_call` / `cta_contact` / `discover` | :419 / :427 / :433 / :461 |
| HC | 'tel:+34682192944' | :423 |
| messages | `t.home.seo_intro` | SeoIntro.tsx:44 |
| messages | `t.home_services.section_label` / `section_title` | ServicesEnhanced.tsx:173 / :182 |
| messages | `t.nav[key]` card titles + alts | ServicesEnhanced.tsx:112 (→ :240, :287) |
| HC 4-locale | 'Descubrir'/'Discover'/'Scopri'/'Découvrir', '→' | :115 (→ :300), :301 |
| HC alt | `Detail ${i}` | DetailGallery.tsx:71 |
| messages | `t.traje_empieza.label` / `title` / `body` | TrajeEmpiezaSection.tsx:148 / :168 / :180 |
| HC | '"' decorative | :195 |
| messages | `t.zoom_parallax.alt` (+ n) | ZoomParallaxSection.tsx:84, :160 |
| messages | `t.proceso.step{1,2,3}_num/_title/_body` | ProcessCardsEnhanced.tsx:234-236 |
| HC | 'Paso {num}', '{num} / 03' | :129, :212 |
| messages | `t.editorial.title` / `label`; `articles[].category/.title/.excerpt` | EditorialSection.tsx:69 / :79; :126 / :141 / :153 |
| messages | `t.testimonials.label` / `title`; `items[].name/.occasion/.quote` | TestimonialsSection.tsx:224 / :234 (iPhone :35/:45); :359/:368/:406 (iPhone :89/:98/:110); name as alt :347 |
| HC | '★ 4.9/5', 'Google Reviews' | :266, :271 |
| messages | `t.before_after.label/title/subtitle/before/after/instruction` | BeforeAfterSlider.tsx:109/:119/:126/:208/:226/:283 |
| HC alts | 'Chaqueta azul marino terminada…', 'La misma chaqueta hilvanada…' | :158, :182 |
| messages | `t.suit_showcase.label/title/hint` | SuitShowcaseSection.tsx:50/:59/:323 |
| messages | `t.suit_showcase.hotspots.{lining,label,waistcoat,pocket,lapel,fabric}.title/.desc` | :216/:225 (mobile :297/:306) |
| HC alt | 'Traje azul marino abierto para mostrar el forro de paisley…' | :80 |
| messages | `t.fabrics.label/title/subtitle` | FabricsSection.tsx:75/:85/:95 |
| messages | `t.fabrics.items.{visual,origins,grading,selection}.title/.desc` | :185 (alt :141) / :197 |
| messages | `t.fabrics.values` | :254 |

## 3. La Sastrería (`SastreriaLayout`)

Sections: SastreriaHero, FilosofiaSection, CraftJourneySection, HistoriaSection, EvelynSection, EspacioSection, SastreriaCTA.

| source | key/id | file:line |
|---|---|---|
| HC metadata | 'La Sastrería · Sastrería Manuel Fernández' + description | app/la-sastreria/page.tsx:5-6 |
| messages | `t.la_sastreria.hero.headline_line1/headline_line2/label/subline` | SastreriaHero.tsx:61/:62/:104/:150 |
| HC | 'Scroll'; alt 'Mano del sastre marcando a tiza…' | :172; :76 |
| messages | `t.la_sastreria.filosofia.q1/q2/q3/label/p1/p2` | FilosofiaSection.tsx:51-53/:83/:120 |
| messages | `t.la_sastreria.oficio.cat1..cat4` | CraftJourneySection.tsx:54,61,68,75 |
| HC (es only) | 'Carácter','Precisión','Paciencia','Perfección'; 'Lana & Seda','Tradición','A Mano','El Detalle' | :55-77 |
| messages | `t.la_sastreria.oficio.label` · `.title` | :92/:94, :114/:116, :242/:244 |
| HC | counter `NN / NN`; ariaLabel 'El Oficio — journey through the craft' | :222; :257 |
| messages | `t.la_sastreria.historia.label`, `p1/p2/p3` | HistoriaSection.tsx:121, :147-149 |
| HC | 'Manuel Fernández' (h2; `historia.title` unused); alt | :142; :179 |
| HC | alt 'Evelyn Fernández trazando…'; 'E' watermark; 'Evelyn Fernández' (h2) | EvelynSection.tsx:103; :140; :175 |
| messages | `t.la_sastreria.evelyn.label/p1/p2/p3` | :154/:187/:199/:211 |
| messages | `t.la_sastreria.espacio.label/title/description/subtitle/body` | EspacioSection.tsx:80/:90/:186/:197/:207 |
| HC alts | 'Interior del showroom…'; 'Sastrería Manuel Fernández' ×2 | :120; :144-145 |
| messages | `t.la_sastreria.cta.label/headline/btn_primary/btn_secondary` | SastreriaCTA.tsx:88/:101/:133/:162 |

## 4. Servicios (`ServiciosLayout`)

| source | key/id | file:line |
|---|---|---|
| HC metadata | 'Servicios · Sastrería Manuel Fernández' + description | app/servicios/page.tsx:5-6 |
| HC | 'Sastrería Manuel Fernández' overlay; 'Pure Bespoke' | ServiciosHero.tsx:56; :66 |
| HC alts | frac, smoking, tres piezas, blazer | :112, :119, :126, :133 |
| messages | `t.servicios.services.s1_title … s10_title`; `t.servicios.hero.label` | :231-232; :266 |
| messages (`t.servicios.credenciales`) | badge :127, headline1 :143, headline2 :154, body :165, artesanal_lead :178, artesanal_link :185, medida_lead :188, medida_link :195, btn_primary :225, stat1–3 val/label :275-279 | CredencialesSection.tsx |
| HC | '.' between link sentences; alt 'Muestrarios de tejidos…' | :187/:197; :246 |
| HC es/en | 'Maestro Sastre'/'Master Tailor'; 'Casas de tejido con las que trabajamos'/'Fabric houses we work with' | :307; :332 |
| HC | FABRIC_HOUSES (Reda, Luvit, Carnet, Harrison, Fox Brothers, Zegna, Loro Piana, Scabal, Holland & Sherry, Fratelli Tallia di Delfino, Dugdale Bros, Dormeuil) | :21-34 |
| messages (`t.servicios.tejidos`) | label :116, title :134, p1 :145, p2 :156 | TejidosMundoSection.tsx |
| HC (es) | city list Miami·USA … Perú·Sudamérica | :161-171 |

## 5. Bodas y ceremonia (inside `ServiceGate settingId="bodas"`)

| source | key/id | file:line |
|---|---|---|
| HC metadata | 'Bodas y Ceremonia \| Sastrería Manuel Fernández' + description | page.tsx:6-7 |
| messages | `t.bodas.hero.label` / `title` | BodasHero.tsx:60/:71 (mobile), :203/:214 (desktop) |
| HC | 'Bodas', 'Desplazar', alt | :153, :247, :90/:169 |
| messages | `t.bodas.te_casas.label/p1/p2` | BodasTeCasas.tsx:59/:78/:89 |
| messages | `t.bodas.statement.label/headline/body` | BodasStatement.tsx:40/:66/:75 |
| messages | `t.bodas.categorias.label`, `cat1..4`, `cat1_desc..cat4_desc` | BodasCategorias.tsx:61, :35-36 (→ :102 alt, :123, :132) |
| HC es/en | 'Vestimenta & Accesorios'/'Formal Wear & Accessories' | BodasFormalWear.tsx:71 |
| messages | `t.bodas.formal_wear.title/label/items[]`; `t.bodas.accesorios.label/items[]`; `t.bodas.key_message` | :81/:106/:116-126; :146/:156-166; :188 |
| HC 4-locale | 'Traje a Medida' label, 'El traje que nace de ti' title, body; alt | BodasSuitSection.tsx:14, :15, :16-22; :69 |
| messages | `t.bodas.proceso.label/title`, `step{1..4}_num/_title/_body` | BodasProceso.tsx:79/:97; :152/:166/:176 |
| messages | `t.bodas.carousel.label` | BodasCarrusel.tsx:84 |
| HC (English) | captions/alts 'Detail','Fabric','Precision','Atelier','Handwork','Craft','Process','Tailor Shop','Studio','Fitting','Pattern','Groom Detail','Morning Coat' | :7-19 |
| messages | `t.bodas.cta.label/headline/btn_primary/btn_secondary`; HC alt | BodasFinal.tsx:79/:98/:125/:152; :43 |

## 6. Cursos (inside `ServiceGate settingId="cursos"`) — no messages keys

| source | key/id | file:line |
|---|---|---|
| HC metadata | 'Curso Artesanal · Sastrería Manuel Fernández' + description | page.tsx:6-7 |
| HC dict es/en/it/fr | title, desc, back, successTitle, successMsg | CursosLayout.tsx:26-55 |
| HC | 'Online Academy'; alt; fallback price 35000 | :174; :118; :229 |
| HC dict es/en/it/fr | title 'Cursos Artesanales', subtitle 'Próximamente', description, locked, available 'Disponible', watch 'Ver curso', duration, lessons | CursosList.tsx:160-205 |
| **DB `courses`** via `/api/courses` | `title_{locale}`, `desc_{locale}`, duration, lessons, image, price, locked | CursosList.tsx:143-152, :290-295, :436-489 |
| HC fallback courses (6, 4 locales) | intro, canvas, lapel, pockets, buttonholes, finishes | CursosList.tsx:27-130 |
| HC dict es/en/it/fr | payment gate: badge, description, features[6], price, cta, secure, note, duration | CursosPaymentGate.tsx:37-106 |
| HC | default courseName 'Curso de Sastrería Artesanal' (sent to Stripe); '...' | :25; :316 |

## 7. Contacto (inside `ServiceGate settingId="contacto"`)

| source | key/id | file:line |
|---|---|---|
| HC metadata | 'Contacto · Sastrería Manuel Fernández' + description | page.tsx:6-7 |
| **CMS** | `getValue('contact.address') \|\| t.contacto.address` | ContactPage.tsx:248, :252 |
| **CMS** | `getValue('contact.phone') \|\| t.contacto.phone` (+ tel: href) | :247, :253 |
| **CMS** | `getValue('business.hours') \|\| t.contacto.hours` | :249, :254 |
| messages | `t.contacto.address_label/phone_label/hours_label/email_label`, `t.contacto.email` | :252-255 |
| messages | `t.contacto.quote1/2/3` | :22-27 → :417 |
| messages | `t.contacto.section_label` + HC ' · Madrid'; `headline`; `subheadline` | :464; :474; :489 |
| messages | `t.contacto.form_title/form_success/form_name/form_email/form_phone/form_message/form_sending/form_submit/form_error` | :694/:707/:730/:734/:740/:745/:762/:199,:204 |
| HC dict es/en/it/fr `bookingHubLabels` | hubTitle '¿Cómo prefieres contactarnos?', inpersonMeasure(+Desc) 'Tomar Medidas', inpersonStyle(+Desc) 'Consulta de Estilo', videocall(+Desc) 'Videollamada', message(+Desc) 'Enviar Mensaje', videocallPaidSuccess (hubSubtitle defined, not rendered) | :258-311 |
| HC | honeypot 'Website'; 'Error'; counter `NN / NN` | :716; :218/:243; :428-432 |

**BookingCalendar** (no messages keys): HC Spanish weekdays (:25), time slots (:27-32), 4-locale month names (:91-96), 4-locale `labels` dict (es :99-135, en :136-172, it :173-209, fr :210-246), price `getPrice('videollamada') || 50` (:89, :133), 'No disponible'/'Reservado' (:661), 'Zoom / Google Meet' (:736), error strings (:383, :450, :453).

## 8. Videollamada

`redirect('/contacto')` (page.tsx:10); metadata only. `components/videollamada/*` (whole `videollamada.*` namespace) unreachable.

## 9. Legal

`t.legal.title` :34, `owner_title/owner_name` :54/:64, `address_title/address` :79/:89, `email_title/email` :104/:114, `phone_title/phone` :129/:139, `disclaimer_title/disclaimer` :154/:164, `copyright_title/copyright` :179/:189 (`app/legal/page.tsx`). Canonical in `app/legal/layout.tsx`; no own title.

## 10. app/error.tsx (HC Spanish)

'Algo salió mal' :31, 'Ha ocurrido un error inesperado. Por favor, recarga la página o vuelve a intentarlo.' :40, 'Recargar página' :58.

## 11. SEO landing pages (server components, HC copy; Spanish, EN for two)

Shared: Cta 'Solicitar cita' (`components/landing/primitives.tsx:195`), FAQ label/heading 'Preguntas frecuentes' (`FaqSection.tsx:17-18`, `LandingPage.tsx:185`), FAQ data `data/faq.ts` (duracion :27-37, pruebas :38-49, antelacion :50-66, patrones :67-79, FAQ_BY_PAGE :87-90), JSON-LD Service `serviceType` + areaServed 'Madrid' (`JsonLd.tsx:29,37`). Renderer `LandingPage.tsx`: eyebrow :85, h1/h1Italic :97-105, lede :108, blocks :114-180, faq :182-187, closing :191-196, closingNote :197-203.

| page | component | content lines |
|---|---|---|
| bespoke-tailor-madrid (EN) | `BespokeTailorMadrid.tsx` | metadata page.tsx:5-12 (og en_GB); serviceType/eyebrow/h1/lede :19-25; alt :30; 'The method' prose :35-44; steps :48-76; alt :82; 'International clients' :86-93; closing :97-101; closingNote :103-109 |
| chaque-medida-madrid | `ChaqueMedidaMadrid.tsx` | metadata :5-7; hero :11-16; alt :22; 'La prenda' :27-36; steps :41-69; 'El protocolo' :74-84; closing :88-92; closingNote :94-100 |
| sastreria-artesanal-madrid | `SastreriaArtesanalMadrid.tsx` (custom, `COPY`) | metadata :5-7; hero :52-57; method :59-75 (italic :279); process 6 steps :78-153; difference :156-177 (italic :327); visit :180-186; `visit.cta` unused :187; alts :202-215; serviceType/FAQ :240-241, :341 |
| sastreria-barrio-salamanca | `SastreriaBarrioSalamanca.tsx` | metadata :5-7; hero :16-21; alt :27; 'Dónde' :32-40; 'El trabajo' :44-55; alt :60; 'La visita' :64-70; closing :74-78; closingNote :80-86 |
| smoking-medida-madrid | `SmokingMedidaMadrid.tsx` | metadata :5-7; hero :11-16; alt :22; 'La prenda' :27-36; steps :40-68; 'El protocolo' :73-82; closing :86-90; closingNote :92-98 |
| trajes-a-medida-madrid | `TrajesAMedidaMadrid.tsx` (custom, `COPY`) | metadata :5-7; hero :43-47; repertoire :49-55; inline links paragraph :205-213; process :58-82; fabrics :87-98 (italic :245); personalisation :101-110; visit :113-118; alts :133,:140,:144; serviceType :164 |
| trajes-novio-madrid | `TrajesNovioMadrid.tsx` | metadata :5-7; serviceType/faq/hero :19-25; alt :31; 'La prenda' :37-46; steps :51-79; 'Cuándo encargarlo' :85-93; alt :99; closing :103-107; closingNote :109-116 |
| womens-bespoke-tailoring-madrid (EN) | `WomensBespokeTailoringMadrid.tsx` | metadata :5-12 (og en_GB); hero :24-29; alt :35; 'The approach' :40-48; steps :53-79; 'The garments' :85-97; alt :103; closing :107-111; closingNote :113-119 |

## 12. Settings flags (show/hide, price)

| setting | effect | file:line |
|---|---|---|
| `bodas` | nav item, footer link, home card, page gate | Navigation.tsx:26 (filter :75); FooterEnhanced.tsx:16 (:29-32); ServicesEnhanced.tsx:26 (:70-72); app/bodas-y-ceremonia/page.tsx:13 |
| `cursos` | nav, footer, home card, page gate | Navigation.tsx:28; FooterEnhanced.tsx:20; ServicesEnhanced.tsx:40; app/cursos/page.tsx:13 |
| `contacto` | nav, footer, home card, page gate | Navigation.tsx:29; FooterEnhanced.tsx:21; ServicesEnhanced.tsx:48; app/contacto/page.tsx:13 |
| `videollamada` enabled | hides the Videollamada booking option | ContactPage.tsx:613 (ternary :544 is a no-op) |
| `videollamada` price | Stripe amount + displayed price | ContactPage.tsx:224; BookingCalendar.tsx:89 |
| `cursos` price | course price fallback | CursosList.tsx:157; CursosPaymentGate.tsx:30 |
| `cursos-{id}` price | per-course price when DB course has none | CursosList.tsx:156 |
| DB `courses.enabled` / `.locked` | hidden by API / lock + 'Próximamente' | app/api/courses/route.ts:7; CursosList.tsx:345, :385, :489 |
| not consumed | `trajes`, `configurador`, `modelos3d`, enabled flags of `cursos-*` | — |

Caveat: disabling `contacto` does not hide the many `/contacto` CTAs (hero, footer, landing Cta, SastreriaCTA, BodasFinal, Credenciales) — they lead to the coming-soon screen.

## 13. editable_content — admin vs consumed

Admin definitions `app/admin/content/page.tsx:42-51` (plus any other DB rows).

| id | admin label | public consumer |
|---|---|---|
| `hero.title` | Homepage Hero Title | HeroEnhanced.tsx:145 (fallback `t.hero.tagline`) |
| `hero.subtitle` | Homepage Hero Subtitle | HeroEnhanced.tsx:146 (fallback `t.hero.tagline2`) |
| `contact.phone` | Contact Phone Number | ContactPage.tsx:247 |
| `contact.address` | Business Address | ContactPage.tsx:248 |
| `business.hours` | Business Hours | ContactPage.tsx:249 |
| `videocall.price` | Videocall Price | **not consumed** (price from settings) |
| `configurator.price` | Configurator Price | **not consumed** |
| `courses.price` | Course Price | **not consumed** |

CMS phone/address/hours only affect /contacto; nav, footer, legal and JSON-LD use `t.footer.*`, `t.legal.*`, `lib/site.ts`.

## 14. Message keys not consumed by any rendered component

`nav.videollamada`; `home_services.discover`, `home_services.items.*`; `proceso.label`, `proceso.step_label`; `editorial.read_more`; `before_after.placeholder`; `fabrics.pending`; `la_sastreria.historia.title`; `la_sastreria.cifras.*`, `la_sastreria.maestro.*`; `servicios.hero.headline`, `servicios.services.s*_num`, `servicios.credenciales.btn_secondary`, `servicios.credenciales.satisfaction_label`, `servicios.cta.*`; `bodas.accesorios.title`; `contacto.cta_reservar`, `contacto.quote4…quote8`; all of `coleccion.*`; all of `videollamada.*`. (Kept as-is: "keep every key".)

## 15. Orphan keys in fr.json / it.json only

`bodas.{categories_title, final_cta, final_title, formal_desc, formal_title, hero_label, hero_subtitle, hero_title, process_step1..4, process_title}`, top-level `cta_book`, `cta_call`, `cta_contact`, `since`, `tagline`, `cursos.{lessons, locked, subtitle, title}`, `hero.{label, subtitle, title}`, `process.*`, `services.{cta, label, title}`, `servicios.{cta_primary, cta_secondary, hero_label, hero_subtitle, hero_title}`. None consumed.

## 16. Strings in only one or two languages

CraftJourney titles/labels; ProcessCards 'Paso'; SastreriaHero 'Scroll'; BodasHero 'Bodas'/'Desplazar'; BodasCarrusel captions (EN); BodasFormalWear heading (es/en); Credenciales 'Maestro Sastre' + fabric-houses caption (es/en); Tejidos city list; Footer 'Facebook'/'WhatsApp'; BookingCalendar weekdays + slot titles (es); error.tsx (es); Testimonials 'Google Reviews'/'★ 4.9/5'; landing pages by design. Components holding their own 4-locale dictionaries: Navigation `UI`, CursosLayout, CursosList, CursosPaymentGate, ContactPage `bookingHubLabels`, BookingCalendar `labels`, BodasSuitSection.
