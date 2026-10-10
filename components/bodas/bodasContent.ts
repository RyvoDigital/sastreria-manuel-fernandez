'use client'

import { useI18n } from '@/lib/i18n'

/*
 * Everything Bodas y Ceremonia renders, from the same sources as the live
 * page: messages keys (t.bodas.*), the strings the live components hard-code
 * (kept verbatim), and the exact photo in each slot, in live order.
 */

/* BodasHero: the framed photo, and the same photo faint behind it (alt ""). */
export const HERO = { src: '/img/novio-celebracion-boda-noche.webp', alt: 'Novio con traje azul marino de tres piezas, en volandas durante la celebración de su boda' }

/* BodasCategorias: live card order is cat1, cat2, cat4, cat3; alt = the style's name. */
const CATS = [
  { src: '/img/frac-novio-balcon.webp', key: 'cat1' },
  { src: '/img/chaque-hilvanado-medida.webp', key: 'cat2' },
  { src: '/img/novio-traje-azul-sentado.webp', key: 'cat4' },
  { src: '/img/smoking-novio-gala.webp', key: 'cat3' },
] as const

/* BodasSuitSection */
export const SUIT = { src: '/img/traje-novio-beige-showroom.webp', alt: 'Traje de novio en tono beige, con camisa blanca de cuello abierto, en el showroom' }

/* BodasFinal */
export const FINAL = { src: '/img/forro-chaqueta-boda.webp', alt: 'Chaqueta de lino beige abierta sobre maniquí, con el forro de paisley verde y dorado a la vista' }

/* BodasCarrusel: thirteen photos, live order; each caption is also its alt. */
const CAROUSEL = [
  '/img/botones-manga-chaqueta-boda.webp',
  '/img/forro-chaqueta-tejido-boda.webp',
  '/img/novio-chaque-corbata-ceremonia.webp',
  '/img/novio-traje-gris-boutonniere.webp',
  '/img/novio-traje-verde-bosque.webp',
  '/img/novios-escalera-jardin.webp',
  '/img/novios-petalos-salida-boda.webp',
  '/img/novia-velo-novio-jardin.webp',
  '/img/novios-tarta-boda.webp',
  '/img/novios-baile-boda-jardin.webp',
  '/img/novios-ramo-boda.webp',
  '/img/boda-novios-ceremonia.webp',
  '/img/novio-chaque-roma.webp',
]

type L = 'es' | 'en' | 'fr' | 'it'

/* The old page showed these captions in English for every language; es/fr/it approved (Oct 2026). */
const CAPTIONS: Record<L, string[]> = {
  en: ['Detail', 'Fabric', 'Precision', 'Atelier', 'Handwork', 'Craft', 'Process', 'Tailor Shop', 'Studio', 'Fitting', 'Pattern', 'Groom Detail', 'Morning Coat'],
  es: ['Detalle', 'Tejido', 'Precisión', 'Taller', 'Hecho a mano', 'Oficio', 'Proceso', 'Sastrería', 'Estudio', 'Prueba', 'Patrón', 'Detalle del novio', 'Chaqué'],
  fr: ['Détail', 'Tissu', 'Précision', 'Atelier', 'Fait main', 'Savoir-faire', 'Processus', 'Tailleur', 'Studio', 'Essayage', 'Patron', 'Détail du marié', 'Jaquette'],
  it: ['Dettaglio', 'Tessuto', 'Precisione', 'Atelier', 'Fatto a mano', 'Mestiere', 'Processo', 'Sartoria', 'Studio', 'Prova', 'Cartamodello', "Dettaglio dello sposo", 'Tight'],
}

/* BodasFormalWear's heading: es/en before; fr/it approved (Oct 2026). */
const WEAR_HEADING: Record<L, string> = {
  es: 'Vestimenta & Accesorios',
  en: 'Formal Wear & Accessories',
  fr: 'Tenue de Cérémonie & Accessoires',
  it: 'Abiti da Cerimonia & Accessori',
}

/* BodasSuitSection: hard-coded on live in all four languages (verbatim). */
const SUIT_TEXT: Record<L, { label: string; title: string; body: string }> = {
  es: {
    label: 'Traje a Medida',
    title: 'El traje que nace de ti',
    body: 'Para el novio que busca algo más que un traje. Cada detalle, solapa, botonadura, tejido, se decide contigo. Sin prisas, sin catálogos. Solo tú, tu historia y nuestras manos.',
  },
  en: {
    label: 'Bespoke Suit',
    title: 'The suit born from you',
    body: 'For the groom seeking more than a suit. Every detail — lapel, buttoning, fabric — is decided with you. No rush, no catalogues. Just you, your story, and our hands.',
  },
  fr: {
    label: 'Costume Sur Mesure',
    title: 'Le costume né de vous',
    body: "Pour le marié qui cherche plus qu'un costume. Chaque détail — revers, boutonnage, tissu — se décide avec vous. Sans hâte, sans catalogues. Juste vous, votre histoire et nos mains.",
  },
  it: {
    label: 'Abito Su Misura',
    title: "L'abito nato da te",
    body: 'Per lo sposo che cerca qualcosa di più di un abito. Ogni dettaglio — rever, bottonatura, tessuto — si decide con te. Senza fretta, senza cataloghi. Solo tu, la tua storia e le nostre mani.',
  },
}

export function useBodasContent() {
  const { t, locale } = useI18n()
  const b = t.bodas
  const l = (['es', 'en', 'fr', 'it'].includes(locale) ? locale : 'es') as L
  const cat = b.categorias
  const p = b.proceso
  return {
    locale,
    hero: b.hero,
    teCasas: b.te_casas,
    statement: b.statement,
    catLabel: cat.label,
    cats: CATS.map(({ src, key }) => ({ src, title: cat[key], desc: cat[`${key}_desc`] })),
    wearHeading: WEAR_HEADING[l],
    wear: b.formal_wear,
    acc: b.accesorios,
    keyMessage: b.key_message,
    suit: SUIT_TEXT[l],
    proceso: {
      label: p.label,
      title: p.title,
      steps: [
        { num: p.step1_num, title: p.step1_title, body: p.step1_body },
        { num: p.step2_num, title: p.step2_title, body: p.step2_body },
        { num: p.step3_num, title: p.step3_title, body: p.step3_body },
        { num: p.step4_num, title: p.step4_title, body: p.step4_body },
      ],
    },
    carouselLabel: b.carousel.label,
    carousel: CAROUSEL.map((src, i) => ({ src, caption: CAPTIONS[l][i] })),
    cta: b.cta,
  }
}

export type BodasContent = ReturnType<typeof useBodasContent>
