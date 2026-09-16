import Link from 'next/link'
import type { Segment } from './content'

export const NAVY = '#0A1628'
export const DEEP = '#050C14'
export const WHITE = '#FFFFFF'
export const GOLD = '#C9A84C'
export const INK = '#0A1628'

export const linkStyle = {
  color: GOLD,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
  textDecorationThickness: '1px',
}

/** Renders a copy segment list, keeping the sentence intact around its links. */
export function Segments({ parts }: { parts: Segment[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          part
        ) : (
          <Link key={i} href={part.href} style={linkStyle}>
            {part.text}
          </Link>
        )
      )}
    </>
  )
}

export function Eyebrow({ children, onDark }: { children: string; onDark?: boolean }) {
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

export function Rule({ width = '36px' }: { width?: string }) {
  return (
    <div
      style={{
        width,
        height: '1px',
        background: 'rgba(201,168,76,0.5)',
        marginBottom: '1.5rem',
      }}
    />
  )
}

export function Prose({
  children,
  onDark,
  measure = '58ch',
}: {
  children: React.ReactNode
  onDark?: boolean
  measure?: string
}) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(0.88rem, 1.3vw, 1.02rem)',
        lineHeight: 1.88,
        color: onDark ? 'rgba(255,255,255,0.72)' : INK,
        marginTop: 0,
        marginBottom: '1.4rem',
        maxWidth: measure,
      }}
    >
      {children}
    </p>
  )
}

/**
 * Display heading. `italic` marks the words set in italic inside the sentence,
 * the emphasis device from the reference direction.
 */
export function Display({
  children,
  italic,
  onDark,
  size = 'clamp(2rem, 4vw, 3.4rem)',
  measure = '20ch',
}: {
  children: string
  italic?: string
  onDark?: boolean
  size?: string
  measure?: string
}) {
  const base = {
    fontFamily: 'var(--font-serif)',
    fontSize: size,
    fontWeight: 400,
    lineHeight: 1.15,
    color: onDark ? WHITE : INK,
    marginTop: 0,
    marginBottom: 'clamp(1.5rem, 3vh, 2.4rem)',
    maxWidth: measure,
  } as const

  if (!italic || !children.includes(italic)) {
    return <h2 style={base}>{children}</h2>
  }
  const [before, after] = children.split(italic)
  return (
    <h2 style={base}>
      {before}
      <em style={{ fontStyle: 'italic' }}>{italic}</em>
      {after}
    </h2>
  )
}

export function StepNumber({ children, onDark }: { children: string; onDark?: boolean }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
        fontWeight: 400,
        lineHeight: 1,
        color: onDark ? 'rgba(201,168,76,0.75)' : 'rgba(10,22,40,0.28)',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Oversized low-contrast numeral, grafted from Variant 3 (Placas).
 *
 * It is the only place a step number is drawn: the rail carries titles without
 * digits, so this is a position marker rather than a second numbering system.
 * `aria-hidden` because the step already has a visible heading and the digit is
 * decoration to a screen reader, not content.
 *
 * Sizing and placement are driven by the consuming variant's CSS (`.ghost`), so
 * it can sit in the left margin at desktop and stack above the title at mobile
 * without this component knowing anything about layout.
 */
export function GhostNumeral({ children, onDark }: { children: string; onDark?: boolean }) {
  return (
    <div
      className="ghost"
      aria-hidden="true"
      style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 400,
        lineHeight: 0.8,
        letterSpacing: '-0.03em',
        color: onDark ? 'rgba(201,168,76,0.22)' : 'rgba(10,22,40,0.14)',
      }}
    >
      {children}
    </div>
  )
}

export function Cta({ onDark }: { onDark?: boolean }) {
  return (
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
        border: onDark ? '1px solid ' + GOLD : undefined,
      }}
    >
      Solicitar cita
    </Link>
  )
}

/** Variant banner. Temporary, so reviewers always know which one they are on. */
export function VariantTag({ n, name }: { n: number; name: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 60,
        background: 'rgba(10,22,40,0.92)',
        border: '1px solid rgba(201,168,76,0.5)',
        color: GOLD,
        fontFamily: 'var(--font-sans)',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        padding: '0.5rem 0.9rem',
        borderRadius: '2px',
      }}
    >
      Variante {n} · {name}
    </div>
  )
}
