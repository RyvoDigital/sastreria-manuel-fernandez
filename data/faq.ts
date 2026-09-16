/**
 * The atelier's FAQ, as supplied by the client on 15 September 2026.
 *
 * Single source of truth: the visible accordion and the FAQPage JSON-LD both
 * read from this array. Google requires FAQ markup to match the visible text,
 * and if the component and the schema were written separately they would drift
 * the first time someone edited one of them. One array, two consumers.
 *
 * The wording is the client's, verbatim. Do not paraphrase it here to make it
 * read better on a page: the schema and the page would stop matching.
 *
 * One deliberate omission, carried over from the brief. The client's original
 * third answer also claimed to be the only tailoring house with an artisan
 * workshop in Madrid capable of any garment in those timeframes. That is an
 * unverifiable exclusivity claim about named competitors on a public
 * commercial site, and it is left out. Do not reinstate it.
 */

export interface FaqEntry {
  id: string
  question: string
  /** Paragraphs, rendered one <p> each. Joined for the schema's answer text. */
  answer: string[]
}

export const FAQ: Record<string, FaqEntry> = {
  duracion: {
    id: 'duracion',
    question: '¿Cuánto tarda en confeccionarse un traje artesanal, de principio a fin?',
    answer: [
      'Un traje artesanal requiere aproximadamente 120 horas de trabajo. Gran parte de este ' +
        'tiempo corresponde a procesos completamente artesanales, realizados a mano. Cada prenda ' +
        'se trabaja individualmente, con especial atención a la construcción, el equilibrio, las ' +
        'proporciones y los acabados, hasta conseguir un traje concebido específicamente para la ' +
        'persona que lo va a vestir.',
    ],
  },
  pruebas: {
    id: 'pruebas',
    question: '¿Cuántas pruebas suele necesitar un cliente?',
    answer: [
      'El proceso consta de una primera cita para la toma de medidas y elección de tejidos, una ' +
        'prueba y la entrega. En la primera visita realizamos la toma de medidas y seleccionamos ' +
        'junto al cliente los tejidos y todos los detalles de la prenda. Posteriormente, el ' +
        'cliente realiza una única prueba y, en nuestro siguiente encuentro, procedemos a la ' +
        'entrega. Si fuese necesario realizar algún ajuste mínimo, se corrige artesanalmente en ' +
        'las horas o días siguientes.',
    ],
  },
  antelacion: {
    id: 'antelacion',
    question: '¿Con cuánta antelación debería encargar un novio su traje?',
    answer: [
      'Lo ideal es encargar el traje de novio con entre 8 y 12 meses de antelación, para poder ' +
        'disfrutar con tranquilidad de toda la experiencia sartorial, de la elección de cada ' +
        'detalle y de vivir el proceso como parte especial de este momento.',
      'No obstante, gracias a nuestros tiempos exprés podemos confeccionar cualquier tipo de ' +
        'traje o prenda incluso con apenas un par de semanas de antelación. En estos casos, ' +
        'naturalmente, el cliente no podrá disfrutar del proceso con la misma tranquilidad y ' +
        'amplitud de tiempo.',
      'Además, si el novio lo desea, puede venir acompañado de familiares, amigos o de su pareja ' +
        'y realizar las visitas que estime oportunas. Podemos organizar cócteles y eventos ' +
        'privados en la sastrería para que pueda compartir y disfrutar de la experiencia con las ' +
        'personas que elija.',
    ],
  },
  patrones: {
    id: 'patrones',
    question:
      '¿Trabajáis patrón individual desde cero para cada cliente, o partís de un patrón base que se adapta?',
    answer: [
      'No utilizamos patrones: diseñamos y construimos directamente sobre el tejido para el ' +
        'cuerpo concreto de cada cliente. Cada prenda se concibe individualmente teniendo en ' +
        'cuenta su anatomía, sus proporciones, sus necesidades y el momento de su vida para el ' +
        'que está siendo creada.',
      'No guardamos ni reutilizamos patrones, ni siquiera del propio cliente. Cada vez que vuelve ' +
        'a nosotros, la prenda se vuelve a concebir específicamente para él.',
    ],
  },
}

/**
 * Which questions appear on which page. A FAQPage block may only describe
 * questions that are actually visible on that same page, so these lists drive
 * both the accordion and the schema.
 */
export const FAQ_BY_PAGE = {
  'sastreria-artesanal-madrid': [FAQ.duracion, FAQ.pruebas, FAQ.patrones],
  'trajes-novio-madrid': [FAQ.antelacion],
} as const
