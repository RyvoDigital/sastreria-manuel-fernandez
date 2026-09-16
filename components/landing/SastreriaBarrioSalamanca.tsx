import { LandingPage, type LandingContent } from './LandingPage'

/*
  Sourced: the address, the neighbourhood and the surrounding streets are
  verifiable geography; the method, the ~120 hours and the appointment sequence
  come from the client; the languages from messages/es.json la_sastreria.evelyn.

  Client constraint, 16 Sep 2026: the workshop interior is not to be published.
  No wide atelier photography anywhere, close detail only. That rules out the
  private-appointment angle the brief suggested for this page, which would have
  meant showing the room, so the page is built from the street, the address and
  the work itself instead. The page opens on the shopfront: that photograph
  already existed in the library, unused on a feature-flagged page.
*/
const content: LandingContent = {
  serviceType: 'Sastrería artesanal a medida',
  eyebrow: 'Barrio de Salamanca',
  h1: 'Sastrería artesanal en el Barrio de Salamanca, Madrid',
  lede:
    'El taller está en Jorge Juan 41, a unos pasos de Serrano, Velázquez y Príncipe de Vergara. ' +
    'Desde ahí se corta y se construye a mano cada prenda, para una sola persona.',
  blocks: [
    {
      // The shopfront on Jorge Juan. Previously sat unused on /modelos-3d,
      // which is feature-flagged off on this deployment.
      kind: 'figure',
      src: '/img/americana-blanca-fachada-sastreria.webp',
      alt: 'Americana blanca de lino y pantalón azul frente al escaparate de la sastrería en Jorge Juan',
      height: 'clamp(18rem, 42vw, 32rem)',
    },
    {
      kind: 'prose',
      label: 'Dónde',
      h2: 'Jorge Juan 41',
      paras: [
        'La calle de Jorge Juan cruza el Barrio de Salamanca de oeste a este, entre Serrano y ' +
          'Príncipe de Vergara, cortando Claudio Coello, Lagasca y Velázquez. El número 41 queda ' +
          'en ese tramo, a pie desde cualquiera de ellas.',
        'Es un barrio de oficios y de comercio de proximidad, y la sastrería trabaja como parte ' +
          'de él: por cita, prenda a prenda, sin catálogo ni tallas.',
      ],
    },
    {
      kind: 'prose',
      label: 'El trabajo',
      h2: 'Lo que se hace aquí',
      italic: 'aquí',
      dark: true,
      paras: [
        'Se diseña y se construye directamente sobre el tejido, para el cuerpo concreto de cada ' +
          'cliente. No se utilizan patrones, ni se guarda ninguno entre encargos: cuando un ' +
          'cliente vuelve, su prenda se vuelve a concebir desde el principio.',
        'Un traje artesanal reúne alrededor de 120 horas de trabajo, buena parte de ellas ' +
          'completamente a mano. El repertorio va del traje y el abrigo al chaqué, el smoking y ' +
          'el frac.',
      ],
    },
    {
      kind: 'figure',
      src: '/img/hilvanado-aguja-hilo-a-mano.webp',
      alt: 'Hilo tirado a mano con la aguja sobre una pieza de entretela, con la cinta métrica al cuello',
    },
    {
      kind: 'prose',
      label: 'La visita',
      h2: 'Cómo se concierta una cita',
      paras: [
        'Se atiende por cita, en español, inglés y francés. En la primera visita se toman las ' +
          'medidas, se eligen los tejidos y se deciden los detalles de la prenda; después hay una ' +
          'sola prueba, y la entrega llega en el encuentro siguiente.',
      ],
    },
  ],
  closing: {
    label: 'Reservar',
    h2: 'Venir al taller',
    body:
      'Calle de Jorge Juan, 41, 28001 Madrid. Barrio de Salamanca. Pida cita y le atenderemos en ' +
      'el horario acordado.',
  },
  closingNote: [
    'Si prefiere leer antes cómo se construye una prenda, está en ',
    { href: '/sastreria-artesanal-madrid', text: 'sastrería artesanal a medida en Madrid' },
    ', y el repertorio completo en ',
    { href: '/servicios', text: 'la página de servicios' },
    '.',
  ],
}

export function SastreriaBarrioSalamanca() {
  return <LandingPage content={content} />
}
