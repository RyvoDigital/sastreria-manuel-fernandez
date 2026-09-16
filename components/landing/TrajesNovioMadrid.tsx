import { LandingPage, type LandingContent } from './LandingPage'

/*
  Sourced: the appointment / single fitting / delivery sequence, no patterns,
  ~120 hours, the ceremony repertoire (messages/es.json servicios.services),
  Jorge Juan 41, attention in Spanish, English and French.

  NOT stated, deliberately: how far in advance a groom should order. That is
  exactly the kind of fact the client wants to be authoritative on and it is
  not confirmed, so it is a TODO(copy) rather than a guess. No prices, no
  turnaround, no lead times anywhere on this page.

  Cannibalisation: /bodas-y-ceremonia already exists and stays the brand and
  inspiration page. This one targets the transactional query. They link both
  ways and share no sentences.
*/
const content: LandingContent = {
  eyebrow: 'Trajes de Novio',
  h1: 'Trajes de novio a medida en Madrid',
  lede:
    'El traje del novio, el del padrino y el de quien le acompañe, cortados y construidos a ' +
    'mano en Jorge Juan 41. Chaqué, smoking, frac o traje oscuro, según lo que pida la ceremonia.',
  ctaAboveFold: true,
  blocks: [
    {
      kind: 'figure',
      src: '/img/primera-prueba-marcado-hombro.webp',
      alt: 'Marcado del hombro sobre una chaqueta hilvanada durante la primera prueba',
      height: 'clamp(16rem, 38vw, 28rem)',
      drift: 56,
    },
    {
      kind: 'prose',
      label: 'La prenda',
      h2: 'Qué se confecciona para una boda',
      italic: 'una boda',
      paras: [
        'Traje de novio, chaqué, smoking, frac y traje oscuro. Chalecos, incluidos los cruzados, ' +
          'camisa y los complementos que pida el protocolo de la ceremonia. El mismo taller viste ' +
          'también al padrino y a los acompañantes que lo deseen, de forma que el conjunto se ' +
          'piense como un todo y no como prendas sueltas.',
        'Cada prenda se concibe para una sola persona y se construye directamente sobre el ' +
          'tejido. No se parte de ningún patrón, ni se reutiliza nada de un encargo anterior.',
      ],
    },
    {
      kind: 'steps',
      label: 'El proceso',
      h2: 'De la primera cita al día de la boda',
      dark: true,
      steps: [
        {
          id: 'medidas',
          n: '01',
          title: 'Medidas y tejidos',
          body:
            'En la primera visita se toman las medidas y se eligen los tejidos y todos los ' +
            'detalles de la prenda. Es también la conversación sobre la ceremonia: la hora, el ' +
            'lugar y lo que el protocolo pide.',
        },
        {
          id: 'construccion',
          n: '02',
          title: 'Construcción',
          body:
            'Un traje artesanal reúne alrededor de 120 horas de trabajo, buena parte de ellas ' +
            'completamente a mano. Ahí se deciden la construcción, el equilibrio y las ' +
            'proporciones de la prenda.',
        },
        {
          id: 'prueba-novio',
          n: '03',
          title: 'Prueba y entrega',
          body:
            'El novio vuelve una sola vez a probar. La entrega llega en el encuentro siguiente, y ' +
            'cualquier corrección menor se resuelve a mano antes de esa fecha.',
        },
      ],
    },
    {
      kind: 'prose',
      label: 'Cuándo encargarlo',
      h2: 'Con cuánta antelación conviene empezar',
      paras: [
        // TODO(copy): needs confirmation from Manuel Fernández — how far in
        // advance a groom should place the order, and what the express option
        // actually allows. The client has answered this for the FAQ; until that
        // answer is placed on the page verbatim, no timeframe is stated here.
        'Conviene empezar con tiempo: la elección del tejido, las pruebas y los ajustes finales ' +
          'forman parte de la experiencia y se disfrutan más sin prisa. Lo concreto se acuerda en ' +
          'la primera cita, en función de la fecha de la boda y de la prenda elegida.',
      ],
    },
    {
      kind: 'figure',
      src: '/img/entretela-cosida-a-mano-rodilla.webp',
      alt: 'Entretela cosida a mano sobre el tejido, con dedal, durante la construcción de una chaqueta',
    },
  ],
  closing: {
    label: 'Reservar',
    h2: 'Empezar por una conversación',
    body:
      'Atendemos en Jorge Juan 41, en el Barrio de Salamanca, en español, inglés y francés. La ' +
      'primera cita es el punto de partida, y conviene pedirla en cuanto haya fecha.',
  },
  closingNote: [
    'La página de ',
    { href: '/bodas-y-ceremonia', text: 'bodas y ceremonia' },
    ' reúne el trabajo de ceremonia del taller, y el detalle de cómo se construye una prenda ' +
      'está en ',
    { href: '/sastreria-artesanal-madrid', text: 'sastrería artesanal a medida en Madrid' },
    '.',
  ],
}

export function TrajesNovioMadrid() {
  return <LandingPage content={content} />
}
