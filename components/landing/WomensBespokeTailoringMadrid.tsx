import { LandingPage, type LandingContent } from './LandingPage'

/*
  English page, per handoff 6.1. Positioned independently rather than as an
  annexe to the menswear page, which is what the brief asks for.

  Sourced: the house dresses "gentlemen and ladies" (messages/en.json
  servicios.tejidos.p1) and Manuel's work covers "all types of bespoke
  garments" (la_sastreria.maestro.p1), so women's commissions are an existing
  claim rather than a new one. Method, hours and sequence as elsewhere.

  The repertoire and the passage about working from a reference are the
  client's own answer, supplied 17 Sep 2026, adapted to this page's voice.

  That passage is deliberately framed as inspiration interpreted in this
  house's own construction. It does not say, and must not be edited to say,
  that the atelier recreates or reproduces a design from another house, and it
  names no brand. Same reasoning as the Loro Piana removal: the atelier's work
  should not borrow another name's authority.

  NOT stated: prices, lead times, or any separate women's process.
*/
const content: LandingContent = {
  serviceType: "Women's bespoke tailoring",
  eyebrow: "Women's Bespoke",
  h1: "Women's Bespoke Tailoring in Madrid",
  lede:
    'Bespoke tailoring for women at Jorge Juan 41, cut and built by hand. The same method, the ' +
    'same hours of handwork, and a garment conceived for one body.',
  ctaAboveFold: true,
  blocks: [
    {
      kind: 'figure',
      src: '/img/piezas-cortadas-tiza-mesa.webp',
      alt: 'Cut cloth pieces on the cutting table, chalk marks still visible',
      height: 'clamp(16rem, 38vw, 28rem)',
    },
    {
      kind: 'prose',
      label: 'The approach',
      h2: 'Cut for one body, not adapted to a block',
      italic: 'not adapted to a block',
      paras: [
        'The house works without patterns. A garment is designed and constructed directly on the ' +
          'cloth, for a particular anatomy and particular proportions, and nothing is carried ' +
          'over from a previous commission.',
        'That matters more, not less, in women’s tailoring, where a block adapted to ' +
          'measurements tends to show its origins first at the shoulder and through the waist.',
      ],
    },
    {
      kind: 'steps',
      label: 'The process',
      h2: 'Three meetings',
      dark: true,
      steps: [
        {
          id: 'w-appointment',
          n: '01',
          title: 'Measurements and cloth',
          body:
            'Measurements are taken, cloth is chosen and the details of the garment are decided ' +
            'together, in the first visit.',
        },
        {
          id: 'w-construction',
          n: '02',
          title: 'Construction by hand',
          body:
            'Roughly 120 hours of work go into a handmade suit, a large part of it entirely by ' +
            'hand: the structure, the balance and the proportions of the finished garment.',
        },
        {
          id: 'w-fitting',
          n: '03',
          title: 'One fitting, then delivery',
          body:
            'A single fitting, then delivery at the following meeting. Minor corrections are ' +
            'made by hand in the hours or days that follow.',
        },
      ],
    },
    {
      kind: 'prose',
      label: 'The garments',
      h2: 'What can be commissioned',
      paras: [
        'Suits with jacket and trousers, jackets, blazers, trousers, waistcoats, skirts, coats ' +
          'and ceremony pieces, all cut and built by hand. Every garment begins from a design ' +
          'made for one woman, worked to her anatomy, her proportions and her own style.',
        'A client may arrive with a reference that inspires her. That reference is a starting ' +
          'point, never a template: the garment is then drawn and constructed here, in this ' +
          'house\u2019s own hand, in cloth chosen for her and made entirely to measure. What she ' +
          'leaves with is a piece created for her alone, its fit, its finishing and its ' +
          'materials all decided for her.',
        'The aim is to flatter the figure while keeping the codes, the construction and the ' +
          'standards of genuine artisan tailoring.',
      ],
    },
    {
      kind: 'figure',
      src: '/img/hilvanado-aguja-hilo-a-mano.webp',
      alt: 'Thread drawn by hand through canvas, tape measure around the neck',
    },
  ],
  closing: {
    label: 'Appointments',
    h2: 'Begin with a conversation',
    body:
      'Calle de Jorge Juan, 41, Barrio de Salamanca, Madrid. The atelier is attended in English, ' +
      'Spanish and French, by appointment.',
  },
  closingNote: [
    'The house’s approach to bespoke is set out on ',
    { href: '/bespoke-tailor-madrid', text: 'bespoke tailor in Madrid' },
    ', and the full repertoire on ',
    { href: '/servicios', text: 'the services page' },
    '.',
  ],
}

export function WomensBespokeTailoringMadrid() {
  return <LandingPage content={content} />
}
