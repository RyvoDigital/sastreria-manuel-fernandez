'use client'

import { useEffect, useRef, useState } from 'react'
import { GOLD } from './primitives'

/**
 * Sticky contents rail for the process section.
 *
 * Titles only, no digits: the oversized ghosted numeral beside each step is the
 * single place a number is drawn, so this is a contents list rather than a
 * second numbering system.
 *
 * The links are plain anchors rendered server-side, so the rail works with
 * JavaScript disabled. The only thing JS adds is the gold rule marking which
 * entry you are on, via IntersectionObserver. Nothing here animates opacity and
 * nothing is hidden when the observer does not run.
 */
export function RailIndex({ steps }: { steps: { id: string; title: string }[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targets = steps
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // band across the upper middle of the viewport, so "current" changes
      // as a step reaches reading position rather than as it first appears
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [steps])

  return (
    <div ref={ref} style={{ display: 'grid', gap: '0.7rem' }}>
      {steps.map((s) => {
        const active = s.id === activeId
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="railLink"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.75rem 1fr',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.74rem',
              lineHeight: 1.5,
              letterSpacing: '0.06em',
              textDecoration: 'none',
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.42)',
              transition: 'color 0.35s ease',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                height: '1px',
                width: active ? '1.75rem' : '0.85rem',
                background: active ? GOLD : 'rgba(201,168,76,0.35)',
                transition: 'width 0.35s ease, background 0.35s ease',
              }}
            />
            <span>{s.title}</span>
          </a>
        )
      })}
    </div>
  )
}
