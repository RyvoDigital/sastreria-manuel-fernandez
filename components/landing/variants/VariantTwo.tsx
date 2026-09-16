import { COPY, IMAGES } from './content'
import { ParallaxFigure } from './ParallaxFigure'
import { RailIndex } from './RailIndex'
import {
  Cta, DEEP, Display, Eyebrow, GhostNumeral, NAVY, Prose, Rule, Segments, VariantTag, WHITE,
} from './shared'

/**
 * Variant 2 — Índice.
 *
 * Layout logic: a magazine article, not a sequence of blocks. A sticky contents
 * rail sits in the left margin for the whole of the process section while the
 * prose runs in one narrow column on the right. Images never pair with text:
 * they interrupt as full-bleed bands edge to edge. The rhythm is a continuous
 * read punctuated by full-width breaks.
 *
 * Grafted from Variant 3: the oversized ghosted numeral. It is the only place a
 * step number is drawn. The rail carries titles without digits, so the two read
 * as a contents page and a chapter number rather than two competing systems.
 * It sits in the left margin at desktop and stacks above the step title below
 * 900px, where there is no margin to sit in.
 */
export function VariantTwo() {
  const steps = COPY.process.steps

  return (
    <div className="v2">
      <style>{`
        /*
          Fixed header clearance. Navigation is position:fixed and runs roughly
          60-88px tall depending on viewport; this clears it plus the eyebrow
          above each heading, so a targeted step does not slide underneath.
          scroll-padding-top has to sit on the scrolling element, so it is
          global while this page is mounted. On promotion it moves to
          app/globals.css so every page gets it.
        */
        :root { --header-offset: clamp(5.5rem, 9vh, 7.5rem); }
        html { scroll-padding-top: var(--header-offset); }

        .v2 .band { padding: clamp(4.5rem, 9vh, 8rem) var(--container-padding); }
        .v2 .inner { max-width: var(--container-max); margin: 0 auto; }
        .v2 .col { max-width: 60ch; }
        .v2 .rail { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 4rem); }
        .v2 .index { display: none; }
        .v2 .bleed { width: 100%; }

        .v2 .step {
          scroll-margin-top: var(--header-offset);
          padding-block: clamp(2rem, 4vh, 3rem);
        }
        .v2 .step:first-child { padding-top: 0; }
        .v2 .stepTitle {
          font-family: var(--font-serif); font-weight: 400; line-height: 1.28; margin: 0 0 0.85rem;
          font-size: clamp(1.3rem, 2.1vw, 1.7rem); color: #FFFFFF;
        }

        /* Mobile: the numeral stacks above the title and becomes the divider
           between steps, so no hairline rule is needed as well. */
        .v2 .ghost { font-size: clamp(2.2rem, 9vw, 3rem); margin-bottom: 0.4rem; }

        .v2 .railLink:hover { color: #FFFFFF; }

        @media (min-width: 1000px) {
          .v2 .rail { grid-template-columns: 17rem 1fr; gap: clamp(3rem, 6vw, 6rem); }
          .v2 .index { display: block; position: sticky; top: var(--header-offset); align-self: start; }
          /* Desktop: the numeral moves out into the left margin beside the
             heading, which is the graft from Placas. */
          .v2 .step { display: grid; grid-template-columns: 6.5rem 1fr; gap: clamp(1.5rem, 3vw, 2.5rem); }
          .v2 .ghost { font-size: clamp(3rem, 5vw, 4.6rem); margin-bottom: 0; text-align: right; }
        }
      `}</style>

      {/* Hero: text only. The first image arrives below as a full bleed. */}
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

      {/* Method. Italic emphasis kept here: the heading carries an argument. */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner col">
          <Eyebrow>{COPY.method.label}</Eyebrow>
          <Rule />
          <Display italic="sobre el tejido" measure="24ch">{COPY.method.h2}</Display>
          {COPY.method.paras.map((p, i) => (
            <Prose key={i} measure="60ch">{p}</Prose>
          ))}
          <Prose measure="60ch">
            <Segments parts={COPY.method.linkPara} />
          </Prose>
        </div>
      </section>

      {/* The claim, full bleed: chalk straight onto cloth, no paper in frame. */}
      <div className="bleed">
        <ParallaxFigure {...IMAGES.marking} height="clamp(18rem, 46vw, 36rem)" drift={64} />
      </div>

      {/* Process: sticky contents rail + continuous column, numeral in margin */}
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

      {/* Difference. Italic kept: the second heading that carries an argument. */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner col">
          <Eyebrow>{COPY.difference.label}</Eyebrow>
          <Rule />
          <Display italic="artesanal" measure="22ch">{COPY.difference.h2}</Display>
          {COPY.difference.paras.map((p, i) => (
            <Prose key={i} measure="60ch">{p}</Prose>
          ))}
          <Prose measure="60ch">
            <Segments parts={COPY.difference.linkPara} />
          </Prose>
        </div>
      </section>

      <div className="bleed">
        <ParallaxFigure {...IMAGES.finishing} height="clamp(14rem, 32vw, 26rem)" drift={56} />
      </div>

      {/* Visit. Italic deliberately dropped here, so the device stays scarce. */}
      <section className="band" style={{ background: NAVY }}>
        <div className="inner col">
          <Eyebrow onDark>{COPY.visit.label}</Eyebrow>
          <Rule />
          <Display onDark measure="20ch">{COPY.visit.h2}</Display>
          <Prose onDark measure="60ch">{COPY.visit.para}</Prose>
          <Cta onDark />
        </div>
      </section>

      <VariantTag n={2} name="Índice" />
    </div>
  )
}
