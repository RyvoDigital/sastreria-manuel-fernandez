import { LandingPage, type LandingContent } from './LandingPage'

/*
  English page, per handoff 6.1. Copy is written directly here rather than
  sourced from messages/en.json, because locale is client-side state with no URL
  and always boots to Spanish. Accepted trade-off: the nav and footer render in
  whatever locale the switcher is on while this body stays English.

  Sourced: no patterns, cut on the cloth, nothing reused; ~120 hours; the
  appointment / single fitting / delivery sequence; Jorge Juan 41; attended in
  Spanish, English and French; clients dressed worldwide from Madrid
  (messages/en.json servicios.tejidos.p1) and DHL shipping (tejidos.p2).

  NOT stated: the handoff mentions Miami, Paris, London, Rome, Dubai and Lisbon
  as cities the site already claims. They appear nowhere in messages/en.json,
  so they are not written here. No prices, no lead times, no partnerships.
*/
const content: LandingContent = {
  eyebrow: 'Bespoke Tailoring',
  h1: 'Bespoke Tailor in Madrid',
  lede:
    'A working bespoke tailoring house at Jorge Juan 41, in the Barrio de Salamanca. Every ' +
    'garment is cut and built by hand for one person, and for one body.',
  ctaAboveFold: true,
  blocks: [
    {
      kind: 'figure',
      src: '/img/marcado-tiza-sobre-tejido.webp',
      alt: 'Chalk lines drawn straight onto the cloth on the cutting table, with no paper pattern',
      height: 'clamp(16rem, 38vw, 28rem)',
    },
    {
      kind: 'prose',
      label: 'The method',
      h2: 'No patterns. The cut begins on the cloth',
      italic: 'on the cloth',
      paras: [
        'There are no patterns here. Not a block adapted to your measurements, and not an ' +
          'individual pattern filed away for next time. The design and the construction happen ' +
          'directly on the cloth, for the particular body that will wear the garment.',
        'Nothing is reused between commissions. When a client returns, the garment is conceived ' +
          'again from the beginning.',
      ],
    },
    {
      kind: 'steps',
      label: 'The process',
      h2: 'From the first appointment to delivery',
      dark: true,
      steps: [
        {
          id: 'appointment',
          n: '01',
          title: 'Measurements and cloth',
          body:
            'The first visit is where measurements are taken, cloth is chosen and every detail of ' +
            'the garment is decided. It is a conversation as much as a fitting.',
        },
        {
          id: 'construction',
          n: '02',
          title: 'Construction by hand',
          body:
            'A handmade suit represents roughly 120 hours of work, a large part of it done ' +
            'entirely by hand. That is where the balance, the proportions and the structure of ' +
            'the garment are decided.',
        },
        {
          id: 'fitting',
          n: '03',
          title: 'One fitting, then delivery',
          body:
            'The client returns once to try the garment. Delivery follows at the next meeting, ' +
            'and any minor correction is resolved by hand before then.',
        },
      ],
    },
    {
      kind: 'figure',
      src: '/img/entretela-cosida-a-mano-rodilla.webp',
      alt: 'Canvas being pad-stitched by hand onto the cloth, thimble in place',
    },
    {
      kind: 'prose',
      label: 'International clients',
      h2: 'From Madrid, for clients anywhere',
      paras: [
        'From Madrid the house dresses gentlemen and ladies from all over the world. Artisan ' +
          'tailoring knows no borders: every client, wherever they are, receives the same ' +
          'attention, and finished garments are shipped by DHL Express.',
        'The atelier is attended in English, Spanish and French.',
      ],
    },
  ],
  closing: {
    label: 'Appointments',
    h2: 'Begin with a conversation',
    body:
      'Calle de Jorge Juan, 41, Barrio de Salamanca, Madrid. Every commission starts with an ' +
      'appointment, where measurements are taken and cloth is chosen.',
  },
  closingNote: [
    'The full repertoire is on ',
    { href: '/servicios', text: 'the services page' },
    ', and women’s commissions have their own page at ',
    { href: '/womens-bespoke-tailoring-madrid', text: 'women’s bespoke tailoring in Madrid' },
    '.',
  ],
}

export function BespokeTailorMadrid() {
  return <LandingPage content={content} />
}
