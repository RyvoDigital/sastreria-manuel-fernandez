import { COPY, IMAGES } from './content'
import { ParallaxFigure } from './ParallaxFigure'
import {
  Cta, DEEP, Display, Eyebrow, NAVY, Prose, Rule, Segments, StepNumber, VariantTag, WHITE,
} from './shared'

/**
 * Variant 1 — Pliego.
 *
 * Layout logic: the editorial spread. Full-bleed bands alternate dark and
 * light, and every section is a two-column spread whose image side flips left
 * to right down the page. Rhythm is regular and predictable: the reader is
 * carried by a steady beat of image, text, image, text.
 */
export function VariantOne() {
  const steps = COPY.process.steps

  return (
    <div className="v1">
      <style>{`
        .v1 .band { padding: clamp(4.5rem, 9vh, 8rem) var(--container-padding); }
        .v1 .inner { max-width: var(--container-max); margin: 0 auto; }
        .v1 .spread {
          display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 4rem);
          align-items: center;
        }
        .v1 .steps { display: grid; gap: clamp(3rem, 6vh, 5rem); }
        .v1 .textonly { max-width: 58ch; }
        .v1 .stephead { display: flex; align-items: baseline; gap: 1.25rem; margin-bottom: 0.9rem; }
        .v1 .stepTitle {
          font-family: var(--font-serif); font-weight: 400; line-height: 1.3; margin: 0;
          font-size: clamp(1.25rem, 2vw, 1.6rem);
        }
        @media (min-width: 900px) {
          .v1 .spread { grid-template-columns: 50fr 50fr; gap: clamp(2.5rem, 5vw, 5rem); }
          .v1 .spread.flip > :first-child { order: 2; }
        }
      `}</style>

      {/* Hero, full-bleed dark */}
      <section className="band" style={{ background: NAVY, paddingTop: 'clamp(9rem, 18vh, 13rem)' }}>
        <div className="inner spread">
          <div>
            <Eyebrow onDark>{COPY.eyebrow}</Eyebrow>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: WHITE,
                margin: '0 0 clamp(1.5rem, 3vh, 2.5rem)',
                maxWidth: '16ch',
              }}
            >
              {COPY.h1}
            </h1>
            <Prose onDark>{COPY.lede}</Prose>
          </div>
          <ParallaxFigure {...IMAGES.opening} height="clamp(22rem, 46vw, 36rem)" />
        </div>
      </section>

      {/* Method, light, image on the right */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner spread">
          <div>
            <Eyebrow>{COPY.method.label}</Eyebrow>
            <Rule />
            <Display italic="sobre el tejido">{COPY.method.h2}</Display>
            {COPY.method.paras.map((p, i) => (
              <Prose key={i}>{p}</Prose>
            ))}
            <Prose>
              <Segments parts={COPY.method.linkPara} />
            </Prose>
          </div>
          <ParallaxFigure {...IMAGES.marking} height="clamp(22rem, 44vw, 34rem)" />
        </div>
      </section>

      {/* Process, dark, alternating spreads */}
      <section className="band" style={{ background: DEEP }}>
        <div className="inner">
          <Eyebrow onDark>{COPY.process.label}</Eyebrow>
          <Rule />
          <Display onDark measure="24ch">{COPY.process.h2}</Display>

          <div className="steps">
            {steps.map((step, i) => {
              const img = step.image ? IMAGES[step.image] : null
              const text = (
                <div className={img ? undefined : 'textonly'}>
                  <div className="stephead">
                    <StepNumber onDark>{step.n}</StepNumber>
                    <h3 className="stepTitle" style={{ color: WHITE }}>{step.title}</h3>
                  </div>
                  <Prose onDark>{step.body}</Prose>
                </div>
              )
              if (!img) return <div key={step.n}>{text}</div>
              return (
                <div key={step.n} className={`spread${i % 2 === 1 ? ' flip' : ''}`}>
                  {text}
                  <ParallaxFigure {...img} height="clamp(18rem, 34vw, 28rem)" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Difference, light */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner">
          <Eyebrow>{COPY.difference.label}</Eyebrow>
          <Rule />
          <Display italic="artesanal" measure="22ch">{COPY.difference.h2}</Display>
          {COPY.difference.paras.map((p, i) => (
            <Prose key={i}>{p}</Prose>
          ))}
          <Prose>
            <Segments parts={COPY.difference.linkPara} />
          </Prose>
        </div>
      </section>

      {/* Visit, dark */}
      <section className="band" style={{ background: NAVY }}>
        <div className="inner">
          <Eyebrow onDark>{COPY.visit.label}</Eyebrow>
          <Rule />
          <Display onDark italic="conversación">{COPY.visit.h2}</Display>
          <Prose onDark>{COPY.visit.para}</Prose>
          <Cta onDark />
        </div>
      </section>

      <VariantTag n={1} name="Pliego" />
    </div>
  )
}
