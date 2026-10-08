'use client'

import Link from 'next/link'
import { DirectionA } from './DirectionA'
import { DirectionB } from './DirectionB'
import { DirectionC } from './DirectionC'

const DIRECTIONS = [
  { id: 'a', name: 'A · Escaparate' },
  { id: 'b', name: 'B · Libro de pedidos' },
  { id: 'c', name: 'C · Cinta' },
] as const

export function MenuPreview({ direction }: { direction: 'a' | 'b' | 'c' }) {
  return (
    <>
      {direction === 'a' && <DirectionA />}
      {direction === 'b' && <DirectionB />}
      {direction === 'c' && <DirectionC />}

      {/* Review control, not part of any design */}
      <div
        role="group"
        aria-label="Menu direction"
        className="menu-preview-switcher"
        style={{
          position: 'fixed', left: 12, bottom: 12, zIndex: 9000,
          display: 'flex', gap: 2, padding: 3,
          background: '#fff', borderRadius: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          fontFamily: 'system-ui, sans-serif', fontSize: 12,
        }}
      >
        {DIRECTIONS.map((d) => (
          <Link
            key={d.id}
            href={`/preview/menu?d=${d.id}`}
            scroll={false}
            aria-current={direction === d.id ? 'true' : undefined}
            style={{
              padding: '6px 10px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap',
              background: direction === d.id ? '#0A1628' : 'transparent',
              color: direction === d.id ? '#fff' : '#0A1628',
            }}
          >
            {d.name}
          </Link>
        ))}
      </div>
      <style>{`[data-open] ~ .menu-preview-switcher { display: none !important; }`}</style>
    </>
  )
}
