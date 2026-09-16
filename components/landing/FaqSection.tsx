import type { FaqEntry } from '@/data/faq'
import { Eyebrow, GOLD, INK, Rule, WHITE } from './primitives'

/**
 * Visible FAQ.
 *
 * Native <details>/<summary>, so every answer is in the server HTML and the
 * accordion works with JavaScript disabled. Collapsed by default is fine for
 * FAQ markup as long as the text is in the DOM, which it is; nothing here is
 * injected on the client and nothing animates opacity.
 *
 * Reads the same array as the FAQPage schema. Editing an answer here without
 * editing data/faq.ts is not possible, which is the point.
 */
export function FaqSection({
  entries,
  label = 'Preguntas frecuentes',
  heading = 'Preguntas frecuentes',
  dark = false,
}: {
  entries: readonly FaqEntry[]
  label?: string
  heading?: string
  dark?: boolean
}) {
  const text = dark ? 'rgba(255,255,255,0.72)' : INK
  const rule = dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,22,40,0.1)'

  return (
    <section
      className="band"
      style={{ background: dark ? '#050C14' : WHITE }}
    >
      <div className="inner col">
        <Eyebrow onDark={dark}>{label}</Eyebrow>
        <Rule />
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: dark ? WHITE : INK,
            marginTop: 0,
            marginBottom: 'clamp(1.5rem, 3vh, 2.4rem)',
            maxWidth: '20ch',
          }}
        >
          {heading}
        </h2>

        <div style={{ borderTop: `1px solid ${rule}` }}>
          {entries.map((e) => (
            <details
              key={e.id}
              id={`faq-${e.id}`}
              style={{
                borderBottom: `1px solid ${rule}`,
                scrollMarginTop: 'var(--header-offset)',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  listStyle: 'none',
                  padding: 'clamp(1.1rem, 2.2vh, 1.6rem) 2rem clamp(1.1rem, 2.2vh, 1.6rem) 0',
                  position: 'relative',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.05rem, 1.7vw, 1.3rem)',
                  lineHeight: 1.4,
                  color: dark ? WHITE : INK,
                }}
              >
                {e.question}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'clamp(1.1rem, 2.2vh, 1.6rem)',
                    color: GOLD,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    lineHeight: 1.4,
                  }}
                >
                  +
                </span>
              </summary>

              <div style={{ paddingBottom: 'clamp(1.1rem, 2.2vh, 1.6rem)' }}>
                {e.answer.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(0.88rem, 1.3vw, 1.02rem)',
                      lineHeight: 1.88,
                      color: text,
                      margin: i === 0 ? '0 0 1.1rem' : '0 0 1.1rem',
                      maxWidth: '60ch',
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
