'use client'

import { useI18n } from '@/lib/i18n'

/*
 * Everything Servicios renders, from the same sources as the live page:
 * messages keys (t.servicios.*), the strings the live components hard-code
 * (kept verbatim), and the exact photo in each slot.
 */

/* ServiciosHero: the pinned centre photo (a CSS background on live, so no alt). */
export const HERO_IMG = '/img/patron-cortado-tela-raya.webp'

/* ServiciosHero: the four floating photographs, in live order, live alts. */
export const GARMENTS = [
  { src: '/img/frac-chaleco-blanco.webp', alt: 'Frac negro con chaleco blanco sobre maniquí en el showroom de la sastrería' },
  { src: '/img/smoking-negro-pajarita.webp', alt: 'Smoking negro con solapa de raso y pajarita, sobre camisa blanca con pañuelo de bolsillo' },
  { src: '/img/traje-tres-piezas-gris-medida.webp', alt: 'Traje de tres piezas en franela gris, con chaqueta, chaleco y pantalón, sobre maniquí' },
  { src: '/img/blazer-cuadros-azul-medida.webp', alt: 'Blazer de cuadros en azul y tostado sobre maniquí de sastre, con las solapas sin rematar' },
]

/* ServiciosList: one photo per service, same order (decorative on live: alt ""). */
export const SERVICE_IMAGES = [
  '/img/frac-chaleco-blanco.webp',
  '/img/chaque-gris-hilvanado-showroom.webp',
  '/img/smoking-negro-pajarita.webp',
  '/img/traje-tres-piezas-gris-medida.webp',
  '/img/abrigo-medida-rojo-forro.webp',
  '/img/americana-verde-menta-madrid.webp',
  '/img/camisas-medida-corbatas.webp',
  '/img/americana-marron-medida-madrid.webp',
  '/img/chaque-chaleco-corbata-detalle.webp',
  '/img/tijeras-cortando-tejido.webp',
]

/* CredencialesSection */
export const OVERVIEW = { src: '/img/showroom-muestrario-tejidos.webp', alt: 'Muestrarios de tejidos en el showroom de la sastrería' }
export const HOUSES = [
  'Reda', 'Luvit', 'Carnet', 'Harrison', 'Fox Brothers', 'Zegna',
  'Loro Piana', 'Scabal', 'Holland & Sherry', 'Fratelli Tallia di Delfino', 'Dugdale Bros', 'Dormeuil',
]

/*
 * Strings live shows in one or two languages only (es, with en for every
 * other locale). Spanish and English are the live wording; fr and it are
 * proposed translations, pending approval before this goes live.
 */
type L = 'es' | 'en' | 'fr' | 'it'
const MASTER: Record<L, string> = { es: 'Maestro Sastre', en: 'Master Tailor', fr: 'Maître Tailleur', it: 'Maestro Sarto' }
const HOUSES_LABEL: Record<L, string> = {
  es: 'Casas de tejido con las que trabajamos',
  en: 'Fabric houses we work with',
  fr: 'Maisons de tissus avec lesquelles nous travaillons',
  it: 'Case tessili con cui lavoriamo',
}
/* TejidosMundoSection's list, Spanish only on live; en/fr/it proposed. */
const CITIES: Record<L, [string, string][]> = {
  es: [['Miami', 'USA'], ['Oporto', 'Portugal'], ['Lisboa', 'Portugal'], ['París', 'Francia'], ['Londres', 'UK'], ['Roma', 'Italia'], ['Dubái', 'UAE'], ['Rep. Dominicana', 'Caribe'], ['Perú', 'Sudamérica']],
  en: [['Miami', 'USA'], ['Porto', 'Portugal'], ['Lisbon', 'Portugal'], ['Paris', 'France'], ['London', 'UK'], ['Rome', 'Italy'], ['Dubai', 'UAE'], ['Dominican Rep.', 'Caribbean'], ['Peru', 'South America']],
  fr: [['Miami', 'USA'], ['Porto', 'Portugal'], ['Lisbonne', 'Portugal'], ['Paris', 'France'], ['Londres', 'UK'], ['Rome', 'Italie'], ['Dubaï', 'UAE'], ['Rép. dominicaine', 'Caraïbes'], ['Pérou', 'Amérique du Sud']],
  it: [['Miami', 'USA'], ['Porto', 'Portogallo'], ['Lisbona', 'Portogallo'], ['Parigi', 'Francia'], ['Londra', 'UK'], ['Roma', 'Italia'], ['Dubai', 'UAE'], ['Rep. Dominicana', 'Caraibi'], ['Perù', 'Sudamerica']],
}

export function useServiciosContent() {
  const { t, locale } = useI18n()
  const sv = t.servicios
  const s = sv.services
  const l = (['es', 'en', 'fr', 'it'].includes(locale) ? locale : 'es') as L
  return {
    locale,
    label: sv.hero.label,
    services: [s.s1_title, s.s2_title, s.s3_title, s.s4_title, s.s5_title, s.s6_title, s.s7_title, s.s8_title, s.s9_title, s.s10_title].map((title, i) => ({
      title,
      image: SERVICE_IMAGES[i],
    })),
    cred: sv.credenciales,
    master: MASTER[l],
    housesLabel: HOUSES_LABEL[l],
    mundo: sv.tejidos,
    cities: CITIES[l],
  }
}

export type ServiciosContent = ReturnType<typeof useServiciosContent>
