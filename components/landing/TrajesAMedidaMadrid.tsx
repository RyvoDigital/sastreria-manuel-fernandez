import Link from 'next/link'
import { JsonLdBlocks } from './JsonLd'
import { LandingStyles } from './LandingStyles'
import { ParallaxFigure } from './ParallaxFigure'
import {
  Cta, DEEP, Display, Eyebrow, GhostNumeral, NAVY, Prose, Rule, WHITE, linkStyle,
} from './primitives'

/*
  Copy sourcing.

  Sourced and safe to state:
  - the appointment, single fitting and delivery sequence, with minor
    adjustments corrected by hand afterwards (client, 15 Sep 2026)
  - no patterns; cut and built directly on the cloth (client, same date)
  - the repertoire of garments (messages/es.json servicios.services)
  - lapel, shoulder, cloth and colour are chosen per garment
    (messages/es.json proceso.step2_body)
  - the cloth houses, named by the client herself (17 Sep 2026): Loro Piana,
    Holland & Sherry, Scabal, Vitale Barberis Canonico, Drapers, Piacenza and
    Dormeuil. Her list and the twelve-name marquee in
    components/servicios/CredencialesSection.tsx are deliberately NOT
    reconciled: this passage is where the client speaks, so it carries her
    seven, and "entre ellas" keeps it open rather than exhaustive. Her point
    that no house is singled out is stated, because it is the answer.
  - Jorge Juan 41, Barrio de Salamanca; attended in Spanish, English, French

  Deliberately NOT stated: prices, lead times, turnaround, how many fittings
  beyond the confirmed one, and anything implying a partnership, authorised
  dealership or exclusivity with a cloth house. The houses are named as cloth
  the atelier works from, which is what the marquee on /servicios already does.

  No sentence here is reused from /sastreria-artesanal-madrid. The two pages
  target different queries and must not read as duplicates of each other:
  that page is the craft argument, this one is for a visitor ready to order.
*/

const COPY = {
  eyebrow: 'Trajes a Medida',
  h1: 'Trajes a medida en Madrid',
  lede:
    'Trajes bespoke cortados y construidos a mano en Jorge Juan 41, en el Barrio de Salamanca. ' +
    'Todo encargo empieza con una cita en el taller.',

  repertoire: {
    label: 'El encargo',
    h2: 'Qué puede encargar',
    body:
      'Traje artesanal, chaqué, smoking, frac, blazer, abrigo, chaleco, camisa y pantalón. ' +
      'Cada prenda se concibe para una sola persona y se construye a mano, sin partir de ningún ' +
      'patrón previo.',
  },

  process: {
    label: 'Cómo funciona',
    h2: 'Tres encuentros, de la medida a la entrega',
    steps: [
      {
        id: 'cita',
        n: '01',
        title: 'La cita',
        body:
          'Se toman las medidas, se eligen los tejidos y se deciden los detalles de la prenda. ' +
          'Es la conversación que determina todo lo que viene después.',
      },
      {
        id: 'prueba',
        n: '02',
        title: 'La prueba',
        body:
          'El cliente vuelve una sola vez a probar la prenda. Cualquier corrección menor se ' +
          'resuelve a mano antes de la entrega.',
      },
      {
        id: 'entrega',
        n: '03',
        title: 'La entrega',
        body: 'La prenda se entrega en el encuentro siguiente, terminada y ajustada.',
      },
    ],
  },

  fabrics: {
    label: 'Los tejidos',
    h2: 'El tejido se elige con el muestrario delante',
    body:
      'Trabajamos con algunas de las casas textiles más prestigiosas del mundo, entre ellas Loro ' +
      'Piana, Holland & Sherry, Scabal, Vitale Barberis Canonico, Drapers, Piacenza y Dormeuil. ' +
      'Ninguna se destaca por encima de las demás: cada una tiene colecciones, pesos y ' +
      'características extraordinarias.',
    body2:
      'Lo importante es seleccionar el tejido adecuado para cada cliente, teniendo en cuenta la ' +
      'prenda, la ocasión, el clima, el uso y la caída que se quiere conseguir. Esa elección se ' +
      'hace en la primera cita, sobre el muestrario.',
  },

  personalisation: {
    label: 'La prenda',
    h2: 'Qué se decide en cada encargo',
    body:
      'La solapa, el hombro, el tejido y el color se deciden prenda a prenda, en función de quién ' +
      'la va a vestir y del momento para el que se crea. Ninguna de esas decisiones se hereda de ' +
      'un encargo anterior.',
  },

  visit: {
    label: 'Reservar',
    h2: 'Empezar un encargo',
    body:
      'Atendemos en Jorge Juan 41, en el Barrio de Salamanca, en español, inglés y francés. La ' +
      'primera cita es el punto de partida de cualquier prenda.',
  },
}

/**
 * The three photographs.
 *
 * Every image in public/img is already used elsewhere on the site; there are no
 * spare files. Flagged to Manuel, resolves with Evelyn's new photography.
 * Alt text restates what the filenames describe, and those were confirmed
 * against Evelyn's slot map during the self-hosting migration.
 */
const IMAGES = {
  suit: {
    src: '/img/traje-tres-piezas-gris-medida.webp',
    alt: 'Traje de tres piezas en franela gris, con chaqueta, chaleco y pantalón, sobre maniquí',
  },
  cloth: {
    // Evelyn's own photograph. The Holland & Sherry swatch book is legible in
    // frame and she is content with that: /servicios already names the house as
    // cloth the atelier works with, which is not a certification claim.
    src: '/img/trazado-cenital-regla-tejido-azul.webp',
    alt: 'Vista cenital del trazado a tiza sobre un paño azul, con regla, tijeras, cinta métrica y un muestrario de tejidos',
  },
  fitting: {
    src: '/img/prueba-traje-showroom.webp',
    alt: 'Prueba de un traje en el showroom de la sastrería',
  },
}

/**
 * Trajes a medida en Madrid.
 *
 * Commercial intent: this visitor is ready to order, so the page moves faster
 * than /sastreria-artesanal-madrid. Short lede, a call to action above the fold
 * and again at the end, three steps rather than six, and no sticky rail. The
 * rail earns its place on a six-step craft page; on three steps it would be
 * scaffolding for its own sake, so the shared template is used without it.
 *
 * Server component: the whole of the prose is in the server HTML. The only
 * client piece is ParallaxFigure, which is a transform-only drift.
 */
export function TrajesAMedidaMadrid() {
  return (
    <div className="lp">
      <LandingStyles />
      <JsonLdBlocks serviceType="Confección de trajes a medida" />

      {/* Hero, with the first call to action above the fold. */}
      <section
        className="band"
        style={{ background: NAVY, paddingTop: 'clamp(9rem, 20vh, 14rem)', paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}
      >
        <div className="inner">
          <Eyebrow onDark>{COPY.eyebrow}</Eyebrow>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 7vw, 5.4rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: WHITE,
              margin: '0 0 clamp(1.5rem, 3vh, 2.5rem)',
              maxWidth: '14ch',
            }}
          >
            {COPY.h1}
          </h1>
          <div className="col">
            <Prose onDark measure="56ch">{COPY.lede}</Prose>
          </div>
          <Cta onDark />
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.suit} height="clamp(16rem, 38vw, 28rem)" drift={56} objectPosition="center 30%" />
      </div>

      {/* What you can order. Links out to the full repertoire. */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner col">
          <Eyebrow>{COPY.repertoire.label}</Eyebrow>
          <Rule />
          <Display measure="20ch">{COPY.repertoire.h2}</Display>
          <Prose measure="60ch">{COPY.repertoire.body}</Prose>
          <Prose measure="60ch">
            El repertorio completo está en{' '}
            <Link href="/servicios" style={linkStyle}>la página de servicios</Link>, las prendas de
            ceremonia en{' '}
            <Link href="/bodas-y-ceremonia" style={linkStyle}>bodas y ceremonia</Link>, y el detalle
            de cómo se construye una prenda en{' '}
            <Link href="/sastreria-artesanal-madrid" style={linkStyle}>
              nuestra página de sastrería artesanal
            </Link>
            .
          </Prose>
        </div>
      </section>

      {/* Three steps. Ghosted numerals, no rail: see the component note. */}
      <section className="band" style={{ background: DEEP }}>
        <div className="inner col">
          <Eyebrow onDark>{COPY.process.label}</Eyebrow>
          <Rule />
          <Display onDark measure="22ch">{COPY.process.h2}</Display>
          {COPY.process.steps.map((s) => (
            <div key={s.id} id={s.id} className="step">
              <GhostNumeral onDark>{s.n}</GhostNumeral>
              <div>
                <h3 className="stepTitle">{s.title}</h3>
                <Prose onDark measure="56ch">{s.body}</Prose>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.cloth} height="clamp(14rem, 32vw, 26rem)" drift={48} />
      </div>

      {/* Cloth. Named exactly as /servicios already names them, no more. */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner col">
          <Eyebrow>{COPY.fabrics.label}</Eyebrow>
          <Rule />
          <Display italic="con el muestrario delante" measure="24ch">{COPY.fabrics.h2}</Display>
          <Prose measure="60ch">{COPY.fabrics.body}</Prose>
          <Prose measure="60ch">{COPY.fabrics.body2}</Prose>
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.fitting} height="clamp(14rem, 32vw, 26rem)" drift={48} />
      </div>

      {/* What is decided per garment. */}
      <section className="band" style={{ background: WHITE, paddingTop: 0 }}>
        <div className="inner col">
          <Eyebrow>{COPY.personalisation.label}</Eyebrow>
          <Rule />
          <Display measure="20ch">{COPY.personalisation.h2}</Display>
          <Prose measure="60ch">{COPY.personalisation.body}</Prose>
          {/* TODO(copy): needs confirmation from Manuel Fernández — the full
              list of what a client actually chooses (linings, buttons, pockets,
              vents, monogram). Only lapel, shoulder, cloth and colour are
              sourced from existing site copy, so only those are named. */}
        </div>
      </section>

      {/* Closing call to action, the second one on the page. */}
      <section className="band" style={{ background: NAVY }}>
        <div className="inner col">
          <Eyebrow onDark>{COPY.visit.label}</Eyebrow>
          <Rule />
          <Display onDark measure="18ch">{COPY.visit.h2}</Display>
          <Prose onDark measure="56ch">{COPY.visit.body}</Prose>
          <Cta onDark />
        </div>
      </section>
    </div>
  )
}
