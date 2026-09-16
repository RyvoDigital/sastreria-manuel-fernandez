import { COPY, IMAGES } from './content'
import { ParallaxFigure } from './ParallaxFigure'
import {
  Cta, DEEP, Display, Eyebrow, GOLD, NAVY, Prose, Rule, Segments, VariantTag, WHITE,
} from './shared'

/**
 * Variant 2 — Índice.
 *
 * Layout logic: a magazine article, not a sequence of blocks. A sticky numbered
 * index sits in the left rail for the whole of the process section while the
 * prose runs in one narrow column on the right. Images are never paired with
 * text: they interrupt as full-bleed bands edge to edge, so the rhythm is a
 * continuous read punctuated by full-width breaks.
 */
export function VariantTwo() {
  const steps = COPY.process.steps

  return (
    <div className="v2">
      <style>{`
        .v2 .band { padding: clamp(4.5rem, 9vh, 8rem) var(--container-padding); }
        .v2 .inner { max-width: var(--container-max); margin: 0 auto; }
        .v2 .col { max-width: 60ch; }
        .v2 .rail { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 4rem); }
        .v2 .index { display: none; }
        .v2 .bleed { width: 100%; }
        .v2 .step { padding-block: clamp(1.75rem, 3.5vh, 2.75rem); border-top: 1px solid rgba(255,255,255,0.1); }
        .v2 .step:first-child { border-top: 0; padding-top: 0; }
        .v2 .stepTitle {
          font-family: var(--font-serif); font-weight: 400; line-height: 1.3; margin: 0 0 0.75rem;
          font-size: clamp(1.25rem, 2vw, 1.6rem);
        }
        .v2 .stepNum {
          font-family: var(--font-sans); font-size: 0.65rem; letter-spacing: 0.28em;
          color: rgba(201,168,76,0.8); margin-bottom: 0.5rem;
        }
        @media (min-width: 1000px) {
          .v2 .rail { grid-template-columns: 16rem 1fr; gap: clamp(3rem, 6vw, 6rem); }
          .v2 .index { display: block; position: sticky; top: 8rem; align-self: start; }
        }
      `}</style>

      {/* Hero: text only, deliberately no image. The first image is a full bleed below. */}
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

      {/* Full-bleed interruption */}
      <div className="bleed">
        <ParallaxFigure {...IMAGES.opening} height="clamp(16rem, 40vw, 30rem)" drift={56} />
      </div>

      {/* Method, light, single narrow column */}
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

      {/* Full-bleed interruption: the claim */}
      <div className="bleed">
        <ParallaxFigure {...IMAGES.marking} height="clamp(18rem, 46vw, 36rem)" drift={64} />
      </div>

      {/* Process: sticky rail index + continuous column */}
      <section className="band" style={{ background: DEEP }}>
        <div className="inner rail">
          <div className="index">
            <Eyebrow onDark>{COPY.process.label}</Eyebrow>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {steps.map((s) => (
                <div
                  key={s.n}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.45)',
                    display: 'flex',
                    gap: '0.75rem',
                  }}
                >
                  <span style={{ color: GOLD }}>{s.n}</span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Display onDark measure="22ch">{COPY.process.h2}</Display>
            {steps.map((s) => (
              <div key={s.n} className="step">
                <div className="stepNum">{s.n}</div>
                <h3 className="stepTitle" style={{ color: WHITE }}>{s.title}</h3>
                <Prose onDark measure="58ch">{s.body}</Prose>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two more full-bleed interruptions, back to back, as a seam */}
      <div className="bleed" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <ParallaxFigure {...IMAGES.basting} height="clamp(12rem, 26vw, 22rem)" drift={40} />
        <ParallaxFigure {...IMAGES.canvas} height="clamp(12rem, 26vw, 22rem)" drift={40} />
      </div>

      {/* Difference, light, narrow column */}
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

      {/* Visit */}
      <section className="band" style={{ background: NAVY }}>
        <div className="inner col">
          <Eyebrow onDark>{COPY.visit.label}</Eyebrow>
          <Rule />
          <Display onDark italic="conversación" measure="20ch">{COPY.visit.h2}</Display>
          <Prose onDark measure="60ch">{COPY.visit.para}</Prose>
          <Cta onDark />
        </div>
      </section>

      <VariantTag n={2} name="Índice" />
    </div>
  )
}
