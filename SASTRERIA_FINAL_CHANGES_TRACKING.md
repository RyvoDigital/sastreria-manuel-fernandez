# SASTRERÍA MANUEL FERNÁNDEZ — FINAL CHANGES TRACKING
## Website Change Log & Revision Brief
**Source:** Sastreria Final Changes.pdf  
**Prepared by:** Ryvo Digital  
**Date:** April 2026  
**Version:** 2.0 — Updated Status

---

## TABLE OF CONTENTS
1. [Quick Fixes (Priority 1)](#priority-1-quick-fixes--1-2-days)
2. [Bugs & QA](#bugs--quality-assurance)
3. [Longer Deadlines (Priority 2)](#priority-2-longer-deadlines)
4. [Items Pending from Client](#items-pending-from-client)
5. [Project-Wide Deadline Request](#project-wide-deadline-request)

---

## PRIORITY 1: QUICK FIXES · 1–2 DAYS

### GLOBAL · SITE-WIDE

| # | Item | Description | Status | Notes |
|---|------|-------------|--------|-------|
| 1.01 | Remove "1978" | Remove "1978" from every instance across the site | 🟢 DONE | All instances removed from components and JSON files |
| 1.02 | Remove em/en dashes | Remove all — and – used between inline text fragments | 🟢 DONE | Replaced with commas/spaces in all copy |
| 1.03 | "El Corte como Lenguaje" audit | Keep in one canonical location only | 🟢 DONE | Kept on Servicios page; renamed to "Pure Bespoke" |
| 1.04 | WhatsApp button in navbar | Add small WhatsApp button to top navigation bar | 🟢 DONE | MessageCircle icon, links to wa.me/34682192944 |
| 1.05 | Prominent "Reservar Cita" | Make primary CTA everywhere | 🟢 DONE | Links to /videollamada, prominent on all pages |
| 1.06 | Replace hamburger icon | Replace with word "menu" | 🟢 DONE | "Menu" text label in nav |
| 1.07 | Add Italian & French | Add IT/FR to language switcher | 🟢 DONE | Full 4-language support (ES/EN/IT/FR) |
| 1.08 | Loading screen logo | Replace placeholder with SMF logo | 🟢 DONE | Uses /logo.png with GSAP animation |

### LANDING PAGE · HOME

| # | Item | Current → New | Status | Notes |
|---|------|---------------|--------|-------|
| 1.09 | Hero title | "Sastrería de hoy..." → TBD | 🔴 PENDING | **AWAITING CLIENT COPY** |
| 1.10 | Hero subtitle | "Arquitectura en tela..." → TBD | 🔴 PENDING | **AWAITING CLIENT COPY** |
| 1.11 | Re-adjustment concept | Make highly visible and prominent | 🔴 PENDING | **NEEDS DESIGN DIRECTION** |
| 1.12 | Remove line | Remove "Cada prenda construida desde cero, sin pruebas previas." | 🟢 DONE | Removed from hero.subtext and la_sastreria.hero.subline |
| 1.13 | Services section title | "Todo lo que ofrecemos" → "Experiencia Sartorial" | 🟢 DONE | Applied to all 4 languages |
| 1.14 | Remove section | Remove section under "El Arte del Sastre" | 🟢 DONE | Removed as part of Sastrería page restructure |
| 1.15 | Remove "La disciplina del detalle" | Remove static section. Keep scroll-animated version | 🟢 DONE | OficioFlipSection removed; CraftJourneySection stays |

### "DESDE LA PRIMERA CITA" SECTION · REORDERING

| # | Item | Description | Status | Notes |
|---|------|-------------|--------|-------|
| 1.16 | Step order | Mirror 01–10 services list | 🟢 DONE | Order updated in all 4 languages |
| 1.17 | Rename step | "El Corte" → "El Diseño" | 🟢 DONE | cat2 renamed across all languages |
| 1.18 | Remove step | Remove "El Forro" | 🟢 DONE | Replaced with "El Proceso Artesanal" |
| 1.19 | Final order | El Tejido · El Diseño · El Corte · El Proceso Artesanal | 🟢 DONE | CraftJourneySection updated with new order |

### COPY EDITS · INDIVIDUAL STRINGS

| # | Item | Current → New | Status |
|---|------|---------------|--------|
| 1.20 | Title | "El Repertorio" → "Pure Bespoke" | 🟢 DONE |
| 1.21 | Title | "Cursos Disponibles" → "Cursos Artesanales" | 🟢 DONE |
| 1.22 | CTA | "Conocer el Taller" → "Conocer la Sastrería" | 🟢 DONE |
| 1.23 | Service name | "Chaqueta Deportiva" → "Blazer" | 🟢 DONE |
| 1.24 | Service name | "Arreglos & Renovación" → "Arreglos" | 🟢 DONE |
| 1.25 | Fabrics copy | Insert "cashmere, vicuña" before Mohair | 🟢 DONE |
| 1.26 | Contact page font | Slightly increase font size | 🟢 DONE |

### HISTORY / ABOUT · TEXT REPLACEMENT

| # | Item | Description | Status |
|---|------|-------------|--------|
| 1.27 | History paragraph | Replace with approved copy about royalty, politicians, athletes, film/theatre | 🟢 DONE |

### SERVICES · NUMBERED LIST (01–10)

| # | Service Name | Status |
|---|-------------|--------|
| 01 | Frac | 🟢 DONE |
| 02 | Chaqué | 🟢 DONE |
| 03 | Smoking | 🟢 DONE |
| 04 | Traje Artesanal | 🟢 DONE |
| 05 | Abrigo Artesanal | 🟢 DONE |
| 06 | Blazer | 🟢 DONE |
| 07 | Camisas | 🟢 DONE |
| 08 | Pantalones Sport | 🟢 DONE |
| 09 | Chalecos | 🟢 DONE |
| 10 | Arreglos a Medida | 🟢 DONE |

### CONFIGURATOR · COPY & STRUCTURE

| # | Item | Description | Status |
|---|------|-------------|--------|
| 1.28 | Apply 01–10 list | Each numeric index matches label | 🟢 DONE |
| 1.29 | Colour/Seasons split | Split into two sections, add colour picker | 🟢 DONE | 8 colour swatches, visual picker UI |

### SOCIAL PROOF

| # | Item | Description | Status |
|---|------|-------------|--------|
| 1.30 | Google review rating | Add 4.9/5 in testimonials | 🟢 DONE |

### COURSES & PAYMENTS · TEMPORARY STATES

| # | Item | Description | Status |
|---|------|-------------|--------|
| 1.31 | Courses "Coming Soon" | Display until videos delivered | 🟢 DONE |
| 1.32 | Stripe payment integration | Implement Stripe for courses | 🔴 PENDING | **NEEDS DECISION / SCOPE** |

---

## "SASTRERÍA ARTESANAL" PAGE · SECTION REORDERING

| Position | Section | Status |
|----------|---------|--------|
| 01 | Hero · "El Arte de Vestir Bien" | 🟢 DONE |
| 02 | La Filosofía · "No medimos el cuerpo..." | 🟢 DONE |
| 03 | El Oficio · "Precisión" (scroll-animation) | 🟢 DONE |
| 04 | La Historia · "Una Vocación de por Vida" | 🟢 DONE |
| 05 | **NEW** · Evelyn section | 🔴 PENDING | **AWAITING CLIENT ASSETS** |
| 06 | Final CTA | 🟢 DONE |

### SECTIONS REMOVED

| Section | Status |
|---------|--------|
| "El Corte como Lenguaje" image fan / scroll reveal | 🟢 DONE |
| "La Disciplina del Detalle" static (OficioFlipSection) | 🟢 DONE |
| MaestroSection | 🟢 DONE |
| ServiciosMorphGallery | 🟢 DONE |

---

## BUGS & QUALITY ASSURANCE

| # | Bug | Status |
|---|-----|--------|
| B.01 | Menu/Navigation error | 🟢 DONE | Added 'use client' to SuitShowcaseSection |
| B.02 | General "error load" | 🟢 DONE | Same root cause as B.01 |

### ★ MANDATORY QA PASS

| Task | Status |
|------|--------|
| Click every button | 🟡 PARTIAL |
| Hover every state | 🟡 PARTIAL |
| Trigger every transition | 🟡 PARTIAL |
| Test every form field | 🟡 PARTIAL |
| Switch between all 4 languages | 🟢 DONE |
| Resize across breakpoints | 🟡 PARTIAL |
| Reload from cold on every route | 🟡 PARTIAL |

---

## PRIORITY 2: LONGER DEADLINES

| # | Item | Status | Blocker |
|---|------|--------|---------|
| 2.01 | 3D Model title → "Crea tu traje aquí" | 🔴 PENDING | |
| 2.02 | Loro Piana eFabrics integration | 🔴 PENDING | **NEEDS CLIENT CREDENTIALS** |
| 2.03 | eFabrics audit & feasibility | 🔴 PENDING | **NEEDS CLIENT CREDENTIALS** |
| 2.04 | Add "Tienda" to navigation | 🔴 PENDING | |
| 2.05 | Tienda categories | 🔴 PENDING | |
| 2.06 | Shipping research | 🔴 PENDING | |

---

## ITEMS PENDING FROM CLIENT

| # | Item | Blocking |
|---|------|----------|
| P.01 | Hero title & subtitle (1.09–1.10) | Home page hero |
| P.02 | Re-adjustment concept direction (1.11) | Home page differentiator |
| P.03 | Evelyn bio, headline, photo | Sastrería page section 05 |
| P.04 | Loro Piana eFabrics access | Priority 2 configurator |
| P.05 | Stripe integration decision | Courses payment |

---

## SUMMARY

| Category | Done | Pending | Blocked by Client |
|----------|------|---------|-------------------|
| Priority 1 | 28/32 | 1 | 3 (1.09, 1.10, 1.11) |
| Bugs/QA | 2/2 | 0 | 0 |
| Priority 2 | 0/6 | 6 | 2 (Loro Piana, Stripe) |
| **TOTAL** | **30/40** | **7** | **5** |

**~75% complete** on items that don't need client input.

---

*Last updated: April 23, 2026*
