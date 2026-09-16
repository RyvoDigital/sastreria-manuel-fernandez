import { LandingStyles } from './LandingStyles'
import { ParallaxFigure } from './ParallaxFigure'
import { RailIndex } from './RailIndex'
import {
  Cta, DEEP, Display, Eyebrow, GhostNumeral, NAVY, Prose, Rule, Segments, WHITE,
  type Segment,
} from './primitives'

/**
 * Shared renderer for the landing pages.
 *
 * Extracted once three pages existed and the shape had actually settled, rather
 * than guessed at in advance: hero, then an alternating sequence of prose
 * sections, numbered step lists and full-bleed figures, then a closing call to
 * action. Page-specific copy, imagery and section order stay in each page's own
 * component, which is the only thing that should differ between them.
 *
 * Server component throughout. RailIndex and ParallaxFigure are the only client
 * pieces and both degrade to plain content with JavaScript disabled.
 */

export type Para = string | Segment[]

export type Block =
  | { kind: 'prose'; label: string; h2: string; italic?: string; dark?: boolean; paras: Para[] }
  | {
      kind: 'steps'
      label: string
      h2: string
      dark?: boolean
      rail?: boolean
      steps: { id: string; n: string; title: string; body: string }[]
    }
  | { kind: 'figure'; src: string; alt: string; height?: string; drift?: number }

export interface LandingContent {
  eyebrow: string
  h1: string
  /** Optional italic fragment inside the h1, the emphasis device from the template. */
  h1Italic?: string
  lede: string
  /** Commercial pages put a call to action above the fold. */
  ctaAboveFold?: boolean
  blocks: Block[]
  closing: { label: string; h2: string; italic?: string; body: string }
  /** Rendered after the closing prose, before the call to action. */
  closingNote?: Para
}

function ProseBody({ paras, dark }: { paras: Para[]; dark?: boolean }) {
  return (
    <>
      {paras.map((p, i) => (
        <Prose key={i} onDark={dark} measure="60ch">
          {typeof p === 'string' ? p : <Segments parts={p} />}
        </Prose>
      ))}
    </>
  )
}

export function LandingPage({ content }: { content: LandingContent }) {
  return (
    <div className="lp">
      <LandingStyles />

      <section
        className="band"
        style={{
          background: NAVY,
          paddingTop: 'clamp(9rem, 20vh, 14rem)',
          paddingBottom: 'clamp(3rem, 6vh, 5rem)',
        }}
      >
        <div className="inner">
          <Eyebrow onDark>{content.eyebrow}</Eyebrow>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 6.4vw, 5rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: WHITE,
              margin: '0 0 clamp(1.5rem, 3vh, 2.5rem)',
              maxWidth: '15ch',
            }}
          >
            {content.h1Italic && content.h1.includes(content.h1Italic) ? (
              <>
                {content.h1.split(content.h1Italic)[0]}
                <em style={{ fontStyle: 'italic' }}>{content.h1Italic}</em>
                {content.h1.split(content.h1Italic)[1]}
              </>
            ) : (
              content.h1
            )}
          </h1>
          <div className="col">
            <Prose onDark measure="58ch">{content.lede}</Prose>
          </div>
          {content.ctaAboveFold && <Cta onDark />}
        </div>
      </section>

      {content.blocks.map((block, i) => {
        if (block.kind === 'figure') {
          return (
            <div className="bleed" key={i}>
              <ParallaxFigure
                src={block.src}
                alt={block.alt}
                height={block.height ?? 'clamp(15rem, 36vw, 28rem)'}
                drift={block.drift ?? 52}
              />
            </div>
          )
        }

        const dark = block.dark
        return (
          <section
            className="band"
            key={i}
            style={{ background: dark ? DEEP : WHITE }}
          >
            <div className={block.kind === 'steps' && block.rail ? 'inner rail' : 'inner col'}>
              {block.kind === 'steps' && block.rail && (
                <div className="index">
                  <Eyebrow onDark={dark}>{block.label}</Eyebrow>
                  <RailIndex steps={block.steps.map((s) => ({ id: s.id, title: s.title }))} />
                </div>
              )}

              <div>
                {!(block.kind === 'steps' && block.rail) && (
                  <>
                    <Eyebrow onDark={dark}>{block.label}</Eyebrow>
                    <Rule />
                  </>
                )}
                <Display
                  onDark={dark}
                  italic={block.kind === 'prose' ? block.italic : undefined}
                  measure="22ch"
                >
                  {block.h2}
                </Display>

                {block.kind === 'prose' ? (
                  <ProseBody paras={block.paras} dark={dark} />
                ) : (
                  block.steps.map((s) => (
                    <div key={s.id} id={s.id} className="step">
                      <GhostNumeral onDark={dark}>{s.n}</GhostNumeral>
                      <div>
                        <h3
                          className="stepTitle"
                          style={dark ? undefined : { color: '#0A1628' }}
                        >
                          {s.title}
                        </h3>
                        <Prose onDark={dark} measure="56ch">{s.body}</Prose>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )
      })}

      <section className="band" style={{ background: NAVY }}>
        <div className="inner col">
          <Eyebrow onDark>{content.closing.label}</Eyebrow>
          <Rule />
          <Display onDark italic={content.closing.italic} measure="20ch">
            {content.closing.h2}
          </Display>
          <Prose onDark measure="58ch">{content.closing.body}</Prose>
          {content.closingNote && (
            <Prose onDark measure="58ch">
              {typeof content.closingNote === 'string'
                ? content.closingNote
                : <Segments parts={content.closingNote} />}
            </Prose>
          )}
          <Cta onDark />
        </div>
      </section>
    </div>
  )
}
