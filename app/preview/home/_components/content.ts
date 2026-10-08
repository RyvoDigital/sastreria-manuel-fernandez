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
]

export const HERO_VIDEO = '/video/hero-sastreria-manuel-fernandez.mp4'
export const HERO_POSTER = '/img/hero-manuel-fernandez-corte-patron.webp'
export const TRAJE_IMAGE = '/img/traje-gris-claro-medida-calle.webp'
export const TESTIMONIAL_BG = '/img/corte-tejido-tijeras.webp'
export const PHONE_HREF = 'tel:+34682192944'

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
    process: {
      label: t.proceso.label,
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
  }
}

export type HomeContent = ReturnType<typeof useHomeContent>
