/**
 * Single source of copy and imagery for the three /_v/sastreria-* design
 * variants. All three import this, so the writing is provably identical and
 * the only variable under review is layout.
 *
 * Copy is the approved text already live on /sastreria-artesanal-madrid.
 * Temporary: once a variant is chosen, this folds back into the real page and
 * the /_v routes are deleted.
 */

export type Segment = string | { href: string; text: string }

export const COPY = {
  eyebrow: 'Sastrería Artesanal',
  h1: 'Sastrería artesanal a medida en Madrid',
  lede:
    'Sastrería Manuel Fernández es un taller de sastrería artesanal en el Barrio de Salamanca. ' +
    'Cada prenda se concibe para una sola persona y se construye a mano en Jorge Juan 41, con más ' +
    'de cuarenta años de oficio detrás de cada corte.',

  method: {
    label: 'El método',
    h2: 'Sin patrones. El corte nace sobre el tejido',
    // The page's central claim, and the reason the marking photograph belongs here.
    paras: [
      'Aquí no hay patrones. Ni un patrón base que se adapte, ni un patrón individual que se ' +
        'archive para la próxima vez. El diseño y la construcción ocurren directamente sobre el ' +
        'tejido, para el cuerpo concreto de la persona que va a vestir la prenda: su anatomía, sus ' +
        'proporciones, sus necesidades y el momento de su vida para el que se crea.',
      'Nada se reutiliza entre encargos. Cuando un cliente vuelve al taller, su prenda se vuelve a ' +
        'concebir desde el principio.',
    ] as string[],
    linkPara: [
      'Si quiere conocer el taller y la trayectoria de Manuel Fernández antes de encargar, puede ',
      { href: '/la-sastreria', text: 'leer la historia de la sastrería' },
      '.',
    ] as Segment[],
  },

  process: {
    label: 'El proceso',
    h2: 'Cómo se construye una prenda',
    steps: [
      {
        n: '01',
        title: 'Trazado y corte sobre el tejido',
        body:
          'El trazado se hace sobre la propia pieza de tejido, sin patrón intermedio. Es el momento ' +
          'que define la prenda: una vez cortado el tejido no hay vuelta atrás, y toda la ' +
          'construcción posterior depende de esa decisión.',
        image: 'marking' as const,
      },
      {
        n: '02',
        title: 'Hilvanado',
        body:
          'El hilvanado une las piezas cortadas con puntadas provisionales, de modo que la prenda ' +
          'pueda probarse y corregirse antes de coserse en firme.',
        image: 'basting' as const,
      },
      {
        n: '03',
        title: 'Entretelas y estructura interna',
        body:
          'La entretela es la estructura interna que da forma al pecho y a la solapa y sostiene la ' +
          'caída de la chaqueta. Es la parte que no se ve y la que decide cómo envejece una prenda.',
        image: 'canvas' as const,
      },
      {
        n: '04',
        title: 'La prueba',
        body:
          'Tras la primera cita, en la que se toman las medidas y se eligen los tejidos y los ' +
          'detalles de la prenda, el cliente vuelve una sola vez a probar. La entrega llega en el ' +
          'encuentro siguiente. Si aparece algún ajuste mínimo, se corrige artesanalmente en las ' +
          'horas o días posteriores.',
        image: null,
      },
      {
        n: '05',
        title: 'Confección a mano',
        body:
          'Un traje artesanal reúne alrededor de 120 horas de trabajo. Buena parte de ese tiempo ' +
          'corresponde a procesos completamente artesanales, realizados a mano, y es ahí donde se ' +
          'deciden la construcción, el equilibrio y las proporciones de la prenda.',
        image: null,
      },
      {
        n: '06',
        title: 'Acabados',
        body:
          'Los acabados son el último tramo del trabajo: ojales, botones, forros y remates que ' +
          'cierran la prenda y son, con frecuencia, lo primero que delata cómo ha sido hecha.',
        image: 'finishing' as const,
      },
    ],
  },

  difference: {
    label: 'La diferencia',
    h2: 'Qué distingue a la sastrería artesanal',
    paras: [
      'En la confección a medida industrial o semiindustrial se parte de un patrón base ya ' +
        'existente, que se ajusta a las medidas del cliente y se produce en buena parte de forma ' +
        'mecanizada. Es un sistema legítimo y da buenos resultados dentro de lo que promete.',
      'La sastrería artesanal trabaja de otra manera: la prenda se construye desde cero para una ' +
        'sola persona y el trabajo manual sustituye a la mayor parte del proceso mecánico. Aquí esa ' +
        'distinción llega un paso más lejos, porque no hay ni siquiera un patrón base del que partir.',
    ] as string[],
    linkPara: [
      'El repertorio completo, del traje al chaqué, está en ',
      { href: '/servicios', text: 'la página de servicios' },
      ', y las prendas de ceremonia tienen su propio espacio en ',
      { href: '/bodas-y-ceremonia', text: 'bodas y ceremonia' },
      '.',
    ] as Segment[],
  },

  visit: {
    label: 'El siguiente paso',
    h2: 'Empieza con una conversación',
    para:
      'El taller está en Calle de Jorge Juan, 41, en el Barrio de Salamanca, Madrid. Se atiende en ' +
      'español, inglés y francés. Toda prenda comienza con una primera cita, en la que se toman las ' +
      'medidas y se eligen los tejidos.',
    cta: 'Solicitar cita',
  },
}

/**
 * The five process photographs. Every one of these already appears elsewhere on
 * the site: there are no unused images in public/img. Flagged to Manuel; this
 * resolves when Evelyn's new photography lands.
 *
 * Alt text follows the filenames, which were confirmed against Evelyn's slot
 * map during the self-hosting migration. `marking` was additionally checked by
 * eye, because it carries the page's central claim: it shows a hand chalking
 * lines straight onto cloth with no paper pattern anywhere in frame.
 */
export const IMAGES = {
  opening: {
    src: '/img/corte-a-mano-mesa.webp',
    alt: 'Corte a mano sobre la mesa de corte del taller',
  },
  marking: {
    src: '/img/marcado-tiza-tela-gris.webp',
    alt: 'Marcado a tiza directamente sobre el tejido en la mesa de corte, sin patrón de papel',
  },
  basting: {
    src: '/img/manuel-fernandez-hilvanando.webp',
    alt: 'Manuel Fernández hilvanando una prenda a mano',
  },
  canvas: {
    src: '/img/chaqueta-entretela-canvas-maniqui.webp',
    alt: 'Chaqueta sobre maniquí con la entretela de canvas a la vista antes del forrado',
  },
  finishing: {
    src: '/img/cosido-a-mano-detalle.webp',
    alt: 'Detalle de cosido a mano en el acabado de una prenda',
  },
} as const

export type ImageKey = keyof typeof IMAGES
