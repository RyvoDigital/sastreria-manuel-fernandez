'use client'

import { useI18n } from '@/lib/i18n'
import { useContent } from '@/lib/content-provider'
import { useSettings } from '@/lib/settings-provider'

/*
 * Everything the homepage directions render, read from the same sources the
 * live homepage uses: messages keys, the two editable_content hero bindings,
 * the settings toggles, and the exact image in each slot.
 */

const DISCOVER: Record<string, string> = { es: 'Descubrir', en: 'Discover', it: 'Scopri', fr: 'Découvrir' }

const SERVICES = [
  { key: 'sastreria', href: '/la-sastreria', image: '/img/manuel-fernandez-toma-medidas-cliente.webp', settingId: null },
  { key: 'bodas', href: '/bodas-y-ceremonia', image: '/img/novia-velo-novio-jardin.webp', settingId: 'bodas' },
  { key: 'servicios', href: '/servicios', image: '/img/evelyn-fernandez-taller-corte.webp', settingId: null },
  { key: 'cursos', href: '/cursos', image: '/img/herramientas-sastre-cinta-metrica.webp', settingId: 'cursos' },
  { key: 'contacto', href: '/contacto', image: '/img/clientes-showroom-sofa.webp', settingId: 'contacto' },
] as const

const PROCESS_IMAGES = [
  '/img/chaqueta-entretela-canvas-maniqui.webp',
  '/img/manuel-fernandez-marcando-patron.webp',
  '/img/novio-padrinos-trajes-azules.webp',
]

const TESTIMONIAL_PHOTOS = [
  '/img/traje-tweed-madrid-calle.webp',
  '/img/curso-sastreria-mesa-corte.webp',
  '/img/americana-verde-menta-madrid.webp',
  '/img/camisas-corbatas-accesorios.webp',
  '/img/puno-camisa-reloj-detalle.webp',
]

/* DetailGallery, in its live order. */
const GALLERY = [
  '/img/prenda-medida-etiqueta.webp',
  '/img/sastre-cortando-tela-mesa-exterior.webp',
  '/img/chaleco-verde-chaqueta-azul-showroom.webp',
  '/img/novios-chaque-coliseo-roma.webp',
  '/img/smoking-azul-forro-detalle.webp',
  '/img/prueba-traje-showroom.webp',
  '/img/cliente-bolsa-sastreria-jorge-juan.webp',
  '/img/americana-verde-menta-calle.webp',
  '/img/showroom-libros-tejidos.webp',
  '/img/herramientas-sastre-cinta-metrica.webp',
  '/img/toma-medidas-cliente.webp',
  '/img/chaqueta-verde-construccion-alfileres.webp',
]

/* ZoomParallaxSection, in its live order; the first is the centre image. */
const ZOOM = [
  '/img/marcado-patron-tela-azul.webp',
  '/img/manuel-fernandez-cinta-metrica-mesa.webp',
  '/img/toma-medidas-cliente.webp',
  '/img/toma-medidas-cinta-metrica.webp',
  '/img/botones-manga-tweed.webp',
  '/img/forro-morado-chaqueta.webp',
  '/img/americana-menta-espejo-showroom.webp',
  '/img/americana-azul-claro-calle.webp',
]

/* SuitShowcaseSection hotspots: same order and the same points on the photo. */
const HOTSPOTS = [
  { id: 'lining', x: 22, y: 55 },
  { id: 'label', x: 30, y: 69 },
  { id: 'waistcoat', x: 46, y: 56 },
  { id: 'pocket', x: 75, y: 49 },
  { id: 'lapel', x: 66, y: 34 },
  { id: 'fabric', x: 82, y: 66 },
] as const

/* FabricsSection items and their photos. */
const FABRICS = [
  { id: 'visual', image: '/img/muestras-tejidos-forbes.webp' },
  { id: 'origins', image: '/img/hilos-telar-origen-tejido.webp' },
  { id: 'grading', image: '/img/traje-gris-medida-puerta-madrid.webp' },
  { id: 'selection', image: '/img/chaqueta-entretela-canvas-maniqui.webp' },
] as const

/* The "Visual" description was a production note, not copy (client decision, Oct 2026). */
const FABRIC_DESC_REMOVED = new Set(['visual'])

export const HERO_VIDEO = '/video/hero-sastreria-manuel-fernandez.mp4'
export const HERO_POSTER = '/img/hero-manuel-fernandez-corte-patron.webp'
export const TRAJE_IMAGE = '/img/traje-gris-claro-medida-calle.webp'
export const TESTIMONIAL_BG = '/img/corte-tejido-tijeras.webp'
export const PHONE_HREF = 'tel:+34682192944'
export const ANATOMY_IMAGE = '/img/anatomia-traje-forro-interior.webp'
export const BEFORE_IMAGE = '/img/chaqueta-hilvanada-antes-prueba.webp'
export const AFTER_IMAGE = '/img/chaqueta-azul-terminada-despues.webp'
/* The live before/after alts are Spanish-only strings; kept verbatim. */
export const BEFORE_ALT = 'La misma chaqueta hilvanada, cubierta de puntadas provisionales blancas, antes de la prueba'
export const AFTER_ALT = 'Chaqueta azul marino terminada, con botonadura dorada, sobre maniquí'
export const ANATOMY_ALT = 'Traje azul marino abierto para mostrar el forro de paisley y el chaleco celeste'

export function useHomeContent() {
  const { t, locale } = useI18n()
  const { getValue } = useContent()
  const { isEnabled } = useSettings()

  return {
    locale,
    hero: {
      seoHeading: t.hero.seo_heading,
      title: getValue('hero.title') || t.hero.tagline,
      subtitle: getValue('hero.subtitle') || t.hero.tagline2,
      ctaBook: t.hero.cta_book,
      ctaCall: t.hero.cta_call,
      ctaContact: t.hero.cta_contact,
      discover: t.hero.discover,
    },
    seoIntro: t.home.seo_intro,
    services: {
      label: t.home_services.section_label,
      title: t.home_services.section_title,
      discover: DISCOVER[locale] || DISCOVER.es,
      items: SERVICES.filter((s) => !s.settingId || isEnabled(s.settingId)).map((s) => ({
        key: s.key,
        href: s.href,
        image: s.image,
        title: t.nav[s.key],
      })),
    },
    traje: { ...t.traje_empieza, image: TRAJE_IMAGE },
    gallery: GALLERY,
    zoom: { images: ZOOM, alt: t.zoom_parallax.alt },
    process: {
      label: t.proceso.label,
      stepLabel: t.proceso.step_label,
      steps: [1, 2, 3].map((n, i) => ({
        num: t.proceso[`step${n}_num` as 'step1_num'],
        title: t.proceso[`step${n}_title` as 'step1_title'],
        body: t.proceso[`step${n}_body` as 'step1_body'],
        image: PROCESS_IMAGES[i],
      })),
    },
    testimonials: {
      label: t.testimonials.label,
      title: t.testimonials.title,
      items: t.testimonials.items.map((item, i) => ({ ...item, photo: TESTIMONIAL_PHOTOS[i] })),
    },
    editorial: { label: t.editorial.label, title: t.editorial.title, articles: t.editorial.articles },
    beforeAfter: t.before_after,
    anatomy: {
      label: t.suit_showcase.label,
      title: t.suit_showcase.title,
      hint: t.suit_showcase.hint,
      spots: HOTSPOTS.map((h) => ({ ...h, ...t.suit_showcase.hotspots[h.id] })),
    },
    fabrics: {
      label: t.fabrics.label,
      title: t.fabrics.title,
      subtitle: t.fabrics.subtitle,
      values: t.fabrics.values,
      items: FABRICS.map((f) => ({
        ...f,
        title: t.fabrics.items[f.id].title,
        desc: FABRIC_DESC_REMOVED.has(f.id) ? '' : t.fabrics.items[f.id].desc,
      })),
    },
  }
}

export type HomeContent = ReturnType<typeof useHomeContent>
