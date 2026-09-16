import { LandingPage, type LandingContent } from './LandingPage'

/*
  Sourced: smoking is in the /servicios repertoire; the appointment / single
  fitting / delivery sequence; no patterns; Jorge Juan 41. The dinner-dress
  guidance is the client's own, supplied 17 Sep 2026, adapted to this page's
  voice rather than pasted. Two earlier lines that guessed at the lapel facing
  and at the waist covering were corrected against it.
*/
const content: LandingContent = {
  serviceType: 'Confección de smoking a medida',
  eyebrow: 'Smoking',
  h1: 'Smoking a medida en Madrid',
  lede:
    'El smoking es la prenda de noche, y vive de unas pocas decisiones bien tomadas: la solapa, ' +
    'el raso, la línea del pantalón. Se construye a mano en Jorge Juan 41.',
  ctaAboveFold: true,
  blocks: [
    {
      kind: 'figure',
      src: '/img/picado-entretela-pecho-a-mano.webp',
      alt: 'Entretelas de pecho picadas a mano con hilo blanco, sobre la mesa de corte',
      height: 'clamp(16rem, 38vw, 28rem)',
    },
    {
      kind: 'prose',
      label: 'La prenda',
      h2: 'Un smoking se decide en la solapa',
      italic: 'en la solapa',
      paras: [
        'Solapa de pico o de cuello chal, hecha tradicionalmente en seda: es la decisión que fija ' +
          'el carácter de la prenda antes que ninguna otra. A partir de ahí se resuelven la ' +
          'botonadura, los bolsillos y el galón del pantalón.',
        'Como el resto de prendas del taller, el smoking se traza y se corta directamente sobre ' +
          'el tejido, para el cuerpo de quien lo va a vestir.',
      ],
    },
    {
      kind: 'steps',
      label: 'Las piezas',
      h2: 'El conjunto completo',
      dark: true,
      steps: [
        {
          id: 'solapa-smoking',
          n: '01',
          title: 'Chaqueta y solapa',
          body:
            'De pico o chal, con la solapa forrada en seda. El ancho y el punto de cruce se ' +
            'deciden sobre el cuerpo, porque son lo que hace que la prenda parezca hecha para ' +
            'esa persona y no simplemente de su talla.',
        },
        {
          id: 'pantalon-smoking',
          n: '02',
          title: 'Pantalón',
          body:
            'Con galón de seda en el costado, a juego con la solapa. La línea se traza para la ' +
            'altura y la caída de quien lo lleva.',
        },
        {
          id: 'camisa-smoking',
          n: '03',
          title: 'Camisa y complementos',
          body:
            'Camisa blanca de ceremonia, pajarita negra de seda y zapato negro. Se eligen en la ' +
            'primera cita, junto al tejido de la prenda.',
        },
      ],
    },
    {
      kind: 'prose',
      label: 'El protocolo',
      h2: 'Cuándo se lleva',
      paras: [
        'El smoking es prenda de etiqueta de noche y debe mantener una estética limpia. Las ' +
          'solapas, de pico o de cuello chal, se hacen tradicionalmente en seda, igual que ' +
          'determinados detalles del pantalón.',
        'Se acompaña de camisa blanca de ceremonia, pajarita preferiblemente negra y de seda, y ' +
          'zapato negro elegante. Ahí son fundamentales las proporciones y los detalles pequeños: ' +
          'un smoking bien hecho resulta sofisticado sin parecer excesivo.',
      ],
    },
  ],
  closing: {
    label: 'Reservar',
    h2: 'Empezar un smoking',
    body:
      'Atendemos en Jorge Juan 41, en el Barrio de Salamanca, en español, inglés y francés. Toda ' +
      'prenda comienza con una cita en la que se toman las medidas y se eligen los tejidos.',
  },
  closingNote: [
    'El repertorio completo está en ',
    { href: '/servicios', text: 'la página de servicios' },
    ', y el detalle de cómo se construye una prenda en ',
    { href: '/sastreria-artesanal-madrid', text: 'sastrería artesanal a medida en Madrid' },
    '.',
  ],
}

export function SmokingMedidaMadrid() {
  return <LandingPage content={content} />
}
