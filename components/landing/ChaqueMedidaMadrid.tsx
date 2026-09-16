import { LandingPage, type LandingContent } from './LandingPage'

/*
  Sourced: the chaqué is already part of the repertoire on /servicios; the
  appointment / single fitting / delivery sequence; ~120 hours; no patterns;
  Jorge Juan 41. Protocol descriptions below are general dress-code facts, not
  claims about this atelier's stock or practice, and anything specific to the
  house carries a TODO(copy).
*/
const content: LandingContent = {
  eyebrow: 'Chaqué',
  h1: 'Chaqué a medida en Madrid',
  lede:
    'El chaqué es la prenda de ceremonia más formal del día y la que menos perdona un mal ' +
    'equilibrio. Se corta y se construye a mano en Jorge Juan 41, para una sola persona.',
  ctaAboveFold: true,
  blocks: [
    {
      kind: 'figure',
      src: '/img/piezas-cortadas-tiza-mesa.webp',
      alt: 'Piezas de una prenda ya cortadas, con las marcas de tiza a la vista, sobre la mesa de corte',
      height: 'clamp(16rem, 38vw, 28rem)',
    },
    {
      kind: 'prose',
      label: 'La prenda',
      h2: 'Qué es un chaqué, y cuándo se lleva',
      italic: 'cuándo se lleva',
      paras: [
        'El chaqué es traje de ceremonia de día. La chaqueta, de faldones largos y corte curvo ' +
          'hacia atrás, se acompaña de pantalón de distinto tejido, chaleco y camisa. Es el ' +
          'registro más formal para una boda de mañana o mediodía.',
        'Al construirse sobre el cuerpo concreto de quien lo va a vestir, el equilibrio de los ' +
          'faldones, la caída de la espalda y la altura del talle se deciden para esa persona y ' +
          'no se heredan de ningún patrón anterior.',
      ],
    },
    {
      kind: 'steps',
      label: 'La construcción',
      h2: 'Dónde se decide un chaqué',
      dark: true,
      steps: [
        {
          id: 'faldones',
          n: '01',
          title: 'Faldones y equilibrio',
          body:
            'La curva de los faldones y su largo definen la silueta de la prenda y son lo primero ' +
            'que delata un chaqué mal resuelto. Se trazan sobre el tejido para la altura y las ' +
            'proporciones de quien lo va a llevar.',
        },
        {
          id: 'chaleco-chaque',
          n: '02',
          title: 'Chaleco y pantalón',
          body:
            'El chaleco, liso o cruzado, y el pantalón de tejido distinto completan el conjunto. ' +
            'Se conciben junto a la chaqueta, en la misma cita, y no como piezas añadidas después.',
        },
        {
          id: 'acabados-chaque',
          n: '03',
          title: 'Acabados',
          body:
            'Ojales, botones y remates cierran la prenda. En una prenda de ceremonia son la parte ' +
            'que más se mira de cerca, en las fotografías y en el saludo.',
        },
      ],
    },
    {
      kind: 'prose',
      label: 'El protocolo',
      h2: 'Lo que pide la etiqueta',
      paras: [
        'El chaqué se lleva de día y pide una camisa y unos complementos acordes. Los detalles ' +
          'concretos, del color del chaleco a la corbata o el plastrón, se acuerdan en la primera ' +
          'cita según la ceremonia y el papel de quien lo viste.',
        // TODO(copy): needs confirmation from Manuel Fernández — the house's own
        // guidance on chaqué protocol (waistcoat colour, plastrón versus tie,
        // what he recommends for a groom against a guest). Only general dress
        // code is described above, nothing specific to this atelier.
      ],
    },
  ],
  closing: {
    label: 'Reservar',
    h2: 'Empezar un chaqué',
    body:
      'Atendemos en Jorge Juan 41, en el Barrio de Salamanca, en español, inglés y francés. La ' +
      'prenda empieza con una cita en la que se toman las medidas y se eligen los tejidos.',
  },
  closingNote: [
    'El chaqué también aparece, junto al resto de prendas de ceremonia, en ',
    { href: '/bodas-y-ceremonia', text: 'bodas y ceremonia' },
    ', y el repertorio completo del taller está en ',
    { href: '/servicios', text: 'la página de servicios' },
    '.',
  ],
}

export function ChaqueMedidaMadrid() {
  return <LandingPage content={content} />
}
