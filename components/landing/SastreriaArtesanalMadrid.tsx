import Link from 'next/link'
import { SITE_LOCALITY, SITE_STREET } from '@/lib/site'

/*
  Copy sourcing for this page, so the next person can audit it.

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
  Every craft step the sources do not cover is described in general terms only
  and carries a TODO(copy).

  Copy is written directly in this component rather than in messages/*.json.
  Locale is client-side state with no URL and always boots to Spanish, so a
  Spanish landing page reads correctly for every visitor arriving from search.
  This is the same trade-off section 6.1 of the handoff accepts for the English
  pages, applied in the other direction.
*/

const NAVY = '#0A1628'
const WHITE = '#FFFFFF'
const GOLD = '#C9A84C'

function Label({ children, onDark = false }: { children: string; onDark?: boolean }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: GOLD,
        opacity: onDark ? 1 : 0.85,
        marginBottom: '1.2rem',
      }}
    >
      {children}
    </div>
  )
}

function Rule() {
  return (
    <div
      style={{
        width: '36px',
        height: '1px',
        background: 'rgba(201,168,76,0.5)',
        marginBottom: '1.5rem',
      }}
    />
  )
}

/**
 * Centred reading column. The page is prose with no imagery yet, so a
 * container-width layout would strand every paragraph against the left edge
 * and leave half the viewport empty at desktop. When Evelyn's process
 * photography lands (see the TODO(image) markers below) this is the piece to
 * revisit: the sections that gain a photo want the two-column treatment used
 * in components/la-sastreria/HistoriaSection.tsx instead.
 */
function Measure({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: '64ch', marginLeft: 'auto', marginRight: 'auto' }}>
      {children}
    </div>
  )
}

function Prose({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(0.88rem, 1.3vw, 1.02rem)',
        lineHeight: 1.88,
        color: onDark ? 'rgba(255,255,255,0.72)' : NAVY,
        marginBottom: '1.4rem',
        maxWidth: '58ch',
      }}
    >
      {children}
    </p>
  )
}

function H2({ children, onDark = false }: { children: string; onDark?: boolean }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 4vw, 3.4rem)',
        fontWeight: 400,
        lineHeight: 1.15,
        color: onDark ? WHITE : NAVY,
        marginTop: 0,
        marginBottom: 'clamp(1.5rem, 3vh, 2.4rem)',
        maxWidth: '20ch',
      }}
    >
      {children}
    </h2>
  )
}

function H3({ children }: { children: string }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
        fontWeight: 400,
        lineHeight: 1.3,
        color: NAVY,
        marginTop: 0,
        marginBottom: '0.9rem',
      }}
    >
      {children}
    </h3>
  )
}

const linkStyle = {
  color: GOLD,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
  textDecorationThickness: '1px',
}

export function SastreriaArtesanalMadrid() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          background: NAVY,
          padding: 'clamp(9rem, 18vh, 14rem) var(--container-padding) clamp(5rem, 10vh, 8rem)',
        }}
      >
        <Measure>
          <Label onDark>Sastrería Artesanal</Label>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: WHITE,
              margin: '0 0 clamp(1.5rem, 3vh, 2.5rem)',
              maxWidth: '16ch',
            }}
          >
            Sastrería artesanal a medida en Madrid
          </h1>
          <Prose onDark>
            Sastrería Manuel Fernández es un taller de sastrería artesanal en el Barrio de
            Salamanca. Cada prenda se concibe para una sola persona y se construye a mano en
            Jorge Juan 41, con más de cuarenta años de oficio detrás de cada corte.
          </Prose>
        </Measure>
      </section>

      {/* ── No patterns. The spine of the page. ──────────── */}
      <section
        style={{
          background: WHITE,
          padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        }}
      >
        <Measure>
          {/* TODO(image): Evelyn's process photography. This section is the
              one that most needs a picture: Manuel tracing or cutting directly
              on the cloth, no paper in frame. It is the page's central claim
              and the image has to show it. Deliberately left empty rather than
              filled with a substitute from public/img, several of which are
              named *-patron-* and would contradict the copy. */}
          <Label>El método</Label>
          <Rule />
          <H2>Sin patrones. El corte nace sobre el tejido</H2>
          <Prose>
            Aquí no hay patrones. Ni un patrón base que se adapte, ni un patrón individual que se
            archive para la próxima vez. El diseño y la construcción ocurren directamente sobre el
            tejido, para el cuerpo concreto de la persona que va a vestir la prenda: su anatomía,
            sus proporciones, sus necesidades y el momento de su vida para el que se crea.
          </Prose>
          <Prose>
            Nada se reutiliza entre encargos. Cuando un cliente vuelve al taller, su prenda se
            vuelve a concebir desde el principio.
          </Prose>
          <Prose>
            Si quiere conocer el taller y la trayectoria de Manuel Fernández antes de encargar,
            puede{' '}
            <Link href="/la-sastreria" style={linkStyle}>
              leer la historia de la sastrería
            </Link>
            .
          </Prose>
        </Measure>
      </section>

      {/* ── The process ──────────────────────────────────── */}
      <section
        style={{
          background: WHITE,
          padding: '0 var(--container-padding) clamp(5rem, 10vh, 9rem)',
        }}
      >
        <Measure>
          <Label>El proceso</Label>
          <Rule />
          <H2>Cómo se construye una prenda</H2>

          <div
            style={{
              display: 'grid',
              gap: 'clamp(2.5rem, 5vh, 4rem)',
              borderTop: '1px solid rgba(10,22,40,0.08)',
              paddingTop: 'clamp(2.5rem, 5vh, 4rem)',
            }}
          >
            <div>
              <H3>Trazado y corte sobre el tejido</H3>
              <Prose>
                El trazado se hace sobre la propia pieza de tejido, sin patrón intermedio. Es el
                momento que define la prenda: una vez cortado el tejido no hay vuelta atrás, y toda
                la construcción posterior depende de esa decisión.
              </Prose>
            </div>

            <div>
              {/* TODO(image): basting in progress, hand and needle in frame.
                  Pairs with the copy confirmation asked for just below. */}
              <H3>Hilvanado</H3>
              <Prose>
                El hilvanado une las piezas cortadas con puntadas provisionales, de modo que la
                prenda pueda probarse y corregirse antes de coserse en firme.
              </Prose>
              {/* TODO(copy): needs confirmation from Manuel Fernández — whether the
                  basting is done entirely by hand here, and at what point in the
                  process the garment is first assembled for the fitting. The
                  paragraph above describes the craft step in general terms only. */}
            </div>

            <div>
              {/* TODO(image): the inner construction, canvas visible before
                  the lining goes in. Nothing in public/img covers this today. */}
              <H3>Entretelas y estructura interna</H3>
              <Prose>
                La entretela es la estructura interna que da forma al pecho y a la solapa y sostiene
                la caída de la chaqueta. Es la parte que no se ve y la que decide cómo envejece una
                prenda.
              </Prose>
              {/* TODO(copy): needs confirmation from Manuel Fernández — the
                  construction actually used in this atelier (full canvas, half
                  canvas, materials, whether the chest piece is padded by hand).
                  Nothing specific is claimed above. */}
            </div>

            <div>
              <H3>La prueba</H3>
              <Prose>
                Tras la primera cita, en la que se toman las medidas y se eligen los tejidos y los
                detalles de la prenda, el cliente vuelve una sola vez a probar. La entrega llega en
                el encuentro siguiente. Si aparece algún ajuste mínimo, se corrige artesanalmente en
                las horas o días posteriores.
              </Prose>
            </div>

            <div>
              <H3>Confección a mano</H3>
              <Prose>
                Un traje artesanal reúne alrededor de 120 horas de trabajo. Buena parte de ese
                tiempo corresponde a procesos completamente artesanales, realizados a mano, y es ahí
                donde se deciden la construcción, el equilibrio y las proporciones de la prenda.
              </Prose>
            </div>

            <div>
              {/* TODO(image): a hand-worked finishing detail, buttonhole or
                  lapel, shot close. */}
              <H3>Acabados</H3>
              <Prose>
                Los acabados son el último tramo del trabajo: ojales, botones, forros y remates que
                cierran la prenda y son, con frecuencia, lo primero que delata cómo ha sido hecha.
              </Prose>
              {/* TODO(copy): needs confirmation from Manuel Fernández — which
                  finishings are hand-worked here (buttonholes, pick stitching,
                  linings, buttons) so this can name the atelier's own practice
                  instead of describing the step generically. */}
            </div>
          </div>
        </Measure>
      </section>

      {/* ── Artisan tailoring vs other systems ───────────── */}
      <section
        style={{
          background: NAVY,
          padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        }}
      >
        <Measure>
          <Label onDark>La diferencia</Label>
          <Rule />
          <H2 onDark>Qué distingue a la sastrería artesanal</H2>
          <Prose onDark>
            En la confección a medida industrial o semiindustrial se parte de un patrón base ya
            existente, que se ajusta a las medidas del cliente y se produce en buena parte de forma
            mecanizada. Es un sistema legítimo y da buenos resultados dentro de lo que promete.
          </Prose>
          <Prose onDark>
            La sastrería artesanal trabaja de otra manera: la prenda se construye desde cero para
            una sola persona y el trabajo manual sustituye a la mayor parte del proceso mecánico.
            Aquí esa distinción llega un paso más lejos, porque no hay ni siquiera un patrón base
            del que partir.
          </Prose>
          <Prose onDark>
            El repertorio completo, del traje al chaqué, está en{' '}
            <Link href="/servicios" style={linkStyle}>
              la página de servicios
            </Link>
            , y las prendas de ceremonia tienen su propio espacio en{' '}
            <Link href="/bodas-y-ceremonia" style={linkStyle}>
              bodas y ceremonia
            </Link>
            .
          </Prose>
        </Measure>
      </section>

      {/* ── Visit / CTA ──────────────────────────────────── */}
      <section
        style={{
          background: WHITE,
          padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        }}
      >
        <Measure>
          <Label>El siguiente paso</Label>
          <Rule />
          <H2>Empieza con una conversación</H2>
          <Prose>
            El taller está en {SITE_STREET}, en el Barrio de Salamanca, {SITE_LOCALITY}. Se atiende
            en español, inglés y francés. Toda prenda comienza con una primera cita, en la que se
            toman las medidas y se eligen los tejidos.
          </Prose>
          <Link
            href="/contacto"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '1rem',
              background: GOLD,
              color: '#000000',
              padding: '1rem 2.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Solicitar cita
          </Link>
        </Measure>
      </section>
    </>
  )
}
