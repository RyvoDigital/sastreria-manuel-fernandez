'use client'

import { useI18n } from '@/lib/i18n'

/*
 * Everything La Sastrería renders, from the same sources as the live page:
 * messages keys (t.la_sastreria.*), the hard-coded strings the live
 * components use (kept verbatim), and the exact photo in each section.
 */

/* CraftJourneySection photos. Its labels were Spanish only on the live site;
   they are now la_sastreria.oficio.title1–4 / detail1–4 in all four languages. */
const OFICIO_IMG = [
  '/img/tejido-principe-de-gales-etiqueta.webp',
  '/img/chaque-hilvanado-diseno.webp',
  '/img/corte-a-mano-mesa.webp',
  '/img/cosido-a-mano-detalle.webp',
]

export const IMG = {
  hero: '/img/manos-sastre-tela-gris.webp',
  manuel: '/img/manuel-fernandez-mesa-de-corte.webp',
  evelyn: '/img/evelyn-fernandez-sastreria.webp',
  espacio: '/img/interior-showroom-sastreria-madrid.webp',
  espacio2: '/img/espacio-sastreria-showroom-02.webp',
  espacio1: '/img/espacio-sastreria-showroom-01.webp',
  cta: '/img/consulta-tejidos-showroom.webp',
}

/* Live alts, verbatim. */
export const ALT = {
  hero: 'Mano del sastre marcando a tiza sobre el tejido en la mesa de corte',
  manuel: 'Manuel Fernández trazando a tiza sobre el tejido en la mesa de corte, bajo el escudo de la casa',
  evelyn: 'Evelyn Fernández trazando a tiza sobre un paño en la mesa de corte, con la cinta métrica al cuello',
  espacio: 'Interior del showroom, con los muestrarios de tejidos, la corbatería y los probadores',
  espacioSmall: 'Sastrería Manuel Fernández',
}

export function useSastreriaContent() {
  const { t, locale } = useI18n()
  const s = t.la_sastreria
  return {
    locale,
    hero: s.hero,
    filosofia: { label: s.filosofia.label, lines: [s.filosofia.q1, s.filosofia.q2, s.filosofia.q3], paras: [s.filosofia.p1, s.filosofia.p2] },
    oficio: {
      label: s.oficio.label,
      title: s.oficio.title,
      items: OFICIO_IMG.map((image, i) => {
        const n = i + 1 as 1 | 2 | 3 | 4
        return { image, cat: s.oficio[`cat${n}`], title: s.oficio[`title${n}`], right: s.oficio[`detail${n}`] }
      }),
    },
    historia: { label: s.historia.label, name: 'Manuel Fernández', paras: [s.historia.p1, s.historia.p2, s.historia.p3] },
    evelyn: { label: s.evelyn.label, name: 'Evelyn Fernández', paras: [s.evelyn.p1, s.evelyn.p2, s.evelyn.p3] },
    espacio: s.espacio,
    cta: s.cta,
  }
}

export type SastreriaContent = ReturnType<typeof useSastreriaContent>
