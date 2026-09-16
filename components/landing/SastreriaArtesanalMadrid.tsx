import { FAQ_BY_PAGE } from '@/data/faq'
import { FaqSection } from './FaqSection'
import { JsonLdBlocks } from './JsonLd'
import { LandingStyles } from './LandingStyles'
import { ParallaxFigure } from './ParallaxFigure'
import { RailIndex } from './RailIndex'
import {
  Cta, DEEP, Display, Eyebrow, GhostNumeral, NAVY, Prose, Rule, Segments, WHITE,
  type Segment,
} from './primitives'

/*
  Copy sourcing, so the next person can audit it.

  Sourced and safe to state:
  - no patterns at all, cut and built directly on the cloth, nothing reused
    between commissions (client, 15 Sep 2026)
  - a suit is roughly 120 hours of work, much of it by hand (client, same date)
  - one fitting: first appointment for measurements and cloth, one fitting,
    delivery, minor adjustments by hand afterwards (client, same date)
  - Jorge Juan 41, Barrio de Salamanca, Madrid (client, same date)
  - more than forty years of the trade, bespoke, ceremony specialism
    (messages/es.json la_sastreria.maestro.p1)
  - the atelier is attended in Spanish, English and French
    (messages/es.json la_sastreria.evelyn.p3)

  Deliberately NOT stated: prices, lead times, number of fittings beyond the
  confirmed one, fabric-house relationships, who the atelier has dressed.
  Craft steps the sources do not cover are described in general terms only and
  carry a TODO(copy).

  Copy lives in this file rather than messages/*.json. Locale is client-side
  state with no URL that always boots to Spanish, so a Spanish landing page
  reads correctly for everyone arriving from search, and the prose is
  guaranteed to be in the server HTML. Same trade-off section 6.1 of the
  handoff accepts for the English pages, applied in the other direction.
*/

const COPY = {
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
        id: 'paso-01',
        title: 'Trazado y corte sobre el tejido',
        body:
          'El trazado se hace sobre la propia pieza de tejido, sin patrón intermedio. Es el momento ' +
          'que define la prenda: una vez cortado el tejido no hay vuelta atrás, y toda la ' +
          'construcción posterior depende de esa decisión.',
        image: 'marking' as const,
      },
      {
        n: '02',
        id: 'paso-02',
        title: 'Hilvanado',
        body:
          'El hilvanado une las piezas cortadas con puntadas provisionales, de modo que la prenda ' +
          'pueda probarse y corregirse antes de coserse en firme.',
        image: 'basting' as const,
      },
      {
        n: '03',
        id: 'paso-03',
        title: 'Entretelas y estructura interna',
        body:
          'La entretela es la estructura interna que da forma al pecho y a la solapa y sostiene la ' +
          'caída de la chaqueta. Es la parte que no se ve y la que decide cómo envejece una prenda.',
        image: 'canvas' as const,
      },
      {
        n: '04',
        id: 'paso-04',
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
        id: 'paso-05',
        title: 'Confección a mano',
        body:
          'Un traje artesanal reúne alrededor de 120 horas de trabajo. Buena parte de ese tiempo ' +
          'corresponde a procesos completamente artesanales, realizados a mano, y es ahí donde se ' +
          'deciden la construcción, el equilibrio y las proporciones de la prenda.',
        image: null,
      },
      {
        n: '06',
        id: 'paso-06',
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
 * The five process photographs.
 *
 * All four are Evelyn's own process photography, delivered 16 Sep 2026, and
 * are used only here: they replaced the images this page previously borrowed
 * from other pages. Every one was checked by eye before being placed. None
 * shows the workshop interior, per the client's standing constraint, and none
 * carries legible third-party branding.
 */
const IMAGES = {
  opening: {
    src: '/img/trazado-tiza-tejido-azul.webp',
    alt: 'Trazado a tiza sobre un paño azul, con cinta métrica y regla, en la mesa de corte',
  },
  marking: {
    src: '/img/marcado-tiza-sobre-tejido.webp',
    alt: 'Marcado a tiza directamente sobre el tejido en la mesa de corte, sin patrón de papel',
  },
  canvas: {
    src: '/img/prenda-hilvanada-maniqui.webp',
    alt: 'Chaqueta hilvanada sobre maniquí, con las puntadas provisionales blancas y el forro a la vista',
  },
  finishing: {
    src: '/img/picado-entretela-pecho-a-mano.webp',
    alt: 'Entretelas de pecho picadas a mano con hilo blanco, sobre la mesa de corte',
  },
} as const

/**
 * Sastrería artesanal a medida en Madrid.
 *
 * Structure: one continuous reading column, a sticky contents rail beside the
 * numbered process steps, and images that interrupt as full-bleed bands rather
 * than pairing with text. The oversized ghosted numeral beside each step is the
 * only place a step number is drawn, which is why the rail carries titles
 * without digits.
 *
 * Server component: no hooks, so the whole of the prose is in the server HTML.
 * The only client pieces are RailIndex (active-entry marker) and
 * ParallaxFigure (transform-only drift), both of which degrade to plain
 * content with JavaScript disabled.
 */
export function SastreriaArtesanalMadrid() {
  const steps = COPY.process.steps

  return (
    <div className="lp">
      <LandingStyles />
      <JsonLdBlocks
        serviceType="Sastrería artesanal a medida"
        faq={FAQ_BY_PAGE['sastreria-artesanal-madrid']}
      />

      {/* Hero. Text only; the first image arrives below as a full bleed. */}
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
            <Prose onDark measure="60ch">{COPY.lede}</Prose>
          </div>
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.opening} height="clamp(16rem, 40vw, 30rem)" drift={56} />
      </div>

      {/* Method. Italic emphasis kept: this heading carries an argument. */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner col">
          <Eyebrow>{COPY.method.label}</Eyebrow>
          <Rule />
          <Display italic="sobre el tejido" measure="24ch">{COPY.method.h2}</Display>
          {COPY.method.paras.map((p, i) => (
            <Prose key={i} measure="60ch">{p}</Prose>
          ))}
          <Prose measure="60ch">
            <Segments parts={COPY.method.linkPara as Segment[]} />
          </Prose>
        </div>
      </section>

      {/* The claim, full bleed: chalk straight onto cloth, no paper in frame. */}
      <div className="bleed">
        <ParallaxFigure {...IMAGES.marking} height="clamp(18rem, 46vw, 36rem)" drift={64} />
      </div>

      {/* Process: sticky contents rail, numeral in the left margin. */}
      <section className="band" style={{ background: DEEP }}>
        <div className="inner rail">
          <div className="index">
            <Eyebrow onDark>{COPY.process.label}</Eyebrow>
            <RailIndex steps={steps.map((s) => ({ id: s.id, title: s.title }))} />
          </div>

          <div>
            <Display onDark measure="22ch">{COPY.process.h2}</Display>
            {steps.map((s) => (
              <div key={s.id} id={s.id} className="step">
                <GhostNumeral onDark>{s.n}</GhostNumeral>
                <div>
                  <h3 className="stepTitle">{s.title}</h3>
                  <Prose onDark measure="58ch">{s.body}</Prose>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.canvas} height="clamp(16rem, 38vw, 30rem)" drift={56} />
      </div>

      {/* Difference. The second heading that carries an argument. */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner col">
          <Eyebrow>{COPY.difference.label}</Eyebrow>
          <Rule />
          <Display italic="artesanal" measure="22ch">{COPY.difference.h2}</Display>
          {COPY.difference.paras.map((p, i) => (
            <Prose key={i} measure="60ch">{p}</Prose>
          ))}
          <Prose measure="60ch">
            <Segments parts={COPY.difference.linkPara as Segment[]} />
          </Prose>
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.finishing} height="clamp(14rem, 32vw, 26rem)" drift={56} />
      </div>

      <FaqSection entries={FAQ_BY_PAGE['sastreria-artesanal-madrid']} />

      {/* Visit. Italic deliberately dropped, so the device stays rare. */}
      <section className="band" style={{ background: NAVY }}>
        <div className="inner col">
          <Eyebrow onDark>{COPY.visit.label}</Eyebrow>
          <Rule />
          <Display onDark measure="20ch">{COPY.visit.h2}</Display>
          <Prose onDark measure="60ch">{COPY.visit.para}</Prose>
          <Cta onDark />
        </div>
      </section>
    </div>
  )
}
