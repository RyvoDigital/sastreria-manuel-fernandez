import { COPY, IMAGES } from './content'
import { ParallaxFigure } from './ParallaxFigure'
import {
  Cta, DEEP, Display, Eyebrow, GOLD, NAVY, Prose, Rule, Segments, VariantTag, WHITE,
} from './shared'

/**
 * Variant 3 — Placas.
 *
 * Layout logic: asymmetric plates driven by scale contrast. Oversized numerals
 * anchor each step, images run off one edge of the band rather than sitting in
 * a column, and the text is a narrow measure held against deliberate negative
 * space. A single full-bleed statement band carries the difference argument at
 * display size. Rhythm is irregular on purpose: it lands hard, then breathes.
 *
 * The statement band is the one structural idea taken from the creator-brand
 * references. None of their decoration comes with it.
 */
export function VariantThree() {
  const steps = COPY.process.steps

  return (
    <div className="v3">
      <style>{`
        .v3 .band { padding: clamp(4.5rem, 9vh, 8rem) var(--container-padding); }
        .v3 .inner { max-width: var(--container-max); margin: 0 auto; }
        .v3 .plate { display: grid; grid-template-columns: 1fr; gap: clamp(1.5rem, 3vw, 2.5rem); align-items: start; }
        .v3 .plates { display: grid; gap: clamp(3.5rem, 7vh, 6rem); }
        .v3 .numeral {
          font-family: var(--font-serif); font-weight: 400; line-height: 0.8;
          font-size: clamp(3.5rem, 11vw, 9rem);
          color: rgba(201,168,76,0.22);
          letter-spacing: -0.03em;
        }
        .v3 .numeral.ink { color: rgba(10,22,40,0.14); }
        .v3 .stepTitle {
          font-family: var(--font-serif); font-weight: 400; line-height: 1.25; margin: 0 0 0.9rem;
          font-size: clamp(1.4rem, 2.4vw, 2rem);
        }
        .v3 .edge { margin-inline: calc(var(--container-padding) * -1); }
        .v3 .statement { padding: clamp(5rem, 12vh, 10rem) var(--container-padding); text-align: center; }
        .v3 .statement h2 { margin-left: auto; margin-right: auto; }
        @media (min-width: 900px) {
          .v3 .plate { grid-template-columns: 7rem minmax(0, 46ch) 1fr; gap: clamp(2rem, 4vw, 3.5rem); }
          .v3 .plate.right > :last-child { order: -1; }
          .v3 .edge { margin-inline: 0; }
          .v3 .edge.bleedR { margin-right: calc(var(--container-padding) * -1); }
          .v3 .edge.bleedL { margin-left: calc(var(--container-padding) * -1); }
        }
      `}</style>

      {/* Hero: oversized type, image bleeding off the right edge */}
      <section className="band" style={{ background: NAVY, paddingTop: 'clamp(9rem, 18vh, 13rem)' }}>
        <div className="inner">
          <Eyebrow onDark>{COPY.eyebrow}</Eyebrow>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 8vw, 6rem)',
              fontWeight: 400,
              lineHeight: 1.02,
              color: WHITE,
              margin: '0 0 clamp(2rem, 4vh, 3rem)',
              maxWidth: '13ch',
            }}
          >
            Sastrería artesanal <em style={{ fontStyle: 'italic', color: GOLD }}>a medida</em> en Madrid
          </h1>
          <div style={{ maxWidth: '52ch' }}>
            <Prose onDark measure="52ch">{COPY.lede}</Prose>
          </div>
        </div>
        <div className="inner" style={{ marginTop: 'clamp(2.5rem, 5vh, 4rem)' }}>
          <div className="edge bleedR">
            <ParallaxFigure {...IMAGES.opening} height="clamp(18rem, 40vw, 32rem)" drift={56} />
          </div>
        </div>
      </section>

      {/* Method: text held left, image bleeding off the right */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner plate">
          <div className="numeral ink" aria-hidden="true">—</div>
          <div>
            <Eyebrow>{COPY.method.label}</Eyebrow>
            <Rule />
            <Display italic="sobre el tejido" size="clamp(2rem, 4.4vw, 3.6rem)" measure="18ch">
              {COPY.method.h2}
            </Display>
            {COPY.method.paras.map((p, i) => (
              <Prose key={i} measure="46ch">{p}</Prose>
            ))}
            <Prose measure="46ch">
              <Segments parts={COPY.method.linkPara} />
            </Prose>
          </div>
          <div className="edge bleedR">
            <ParallaxFigure {...IMAGES.marking} height="clamp(20rem, 46vw, 38rem)" drift={56} />
          </div>
        </div>
      </section>

      {/* Full-bleed statement band. The only idea borrowed from the loud references. */}
      <section className="statement" style={{ background: DEEP }}>
        <Display
          onDark
          italic="artesanal"
          size="clamp(2.2rem, 6vw, 4.6rem)"
          measure="18ch"
        >
          {COPY.difference.h2}
        </Display>
        <div style={{ maxWidth: '58ch', margin: '0 auto', textAlign: 'left' }}>
          {COPY.difference.paras.map((p, i) => (
            <Prose key={i} onDark measure="58ch">{p}</Prose>
          ))}
          <Prose onDark measure="58ch">
            <Segments parts={COPY.difference.linkPara} />
          </Prose>
        </div>
      </section>

      {/* Process: asymmetric plates, image side alternating off opposite edges */}
      <section className="band" style={{ background: WHITE }}>
        <div className="inner">
          <Eyebrow>{COPY.process.label}</Eyebrow>
          <Rule />
          <Display measure="20ch" size="clamp(2rem, 4.4vw, 3.6rem)">{COPY.process.h2}</Display>

          <div className="plates" style={{ marginTop: 'clamp(2.5rem, 5vh, 4rem)' }}>
            {steps.map((step, i) => {
              const img = step.image ? IMAGES[step.image] : null
              return (
                <div key={step.n} className={`plate${i % 2 === 1 ? ' right' : ''}`}>
                  <div className="numeral ink" aria-hidden="true">{step.n}</div>
                  <div>
                    <h3 className="stepTitle" style={{ color: '#0A1628' }}>{step.title}</h3>
                    <Prose measure="46ch">{step.body}</Prose>
                  </div>
                  {img ? (
                    <div className={`edge ${i % 2 === 1 ? 'bleedL' : 'bleedR'}`}>
                      <ParallaxFigure {...img} height="clamp(16rem, 32vw, 26rem)" drift={44} />
                    </div>
                  ) : (
                    <div aria-hidden="true" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="band" style={{ background: NAVY }}>
        <div className="inner">
          <Eyebrow onDark>{COPY.visit.label}</Eyebrow>
          <Rule />
          <Display onDark italic="conversación" size="clamp(2rem, 4.4vw, 3.6rem)" measure="18ch">
            {COPY.visit.h2}
          </Display>
          <Prose onDark measure="52ch">{COPY.visit.para}</Prose>
          <Cta onDark />
        </div>
      </section>

      <VariantTag n={3} name="Placas" />
    </div>
  )
}
