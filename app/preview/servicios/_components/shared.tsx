'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { GlobeArc, GlobeMarker } from '@/components/ui/globe'
import type { ServiciosContent } from './content'
import s from './servicios.module.css'

/* ServiciosHero's centre caption, hard-coded on live ("Pure Bespoke" stays untranslated). */
export const HERO_EYEBROW = 'Sastrería Manuel Fernández'
export const HERO_TITLE = 'Pure Bespoke'

/* Credenciales: the two contextual links, live wording and targets. */
export function CredLinks({ c }: { c: ServiciosContent['cred'] }) {
  return (
    <p className={s.body} style={{ marginTop: '1.5rem' }}>
      {c.artesanal_lead}{' '}
      <Link href="/sastreria-artesanal-madrid" className={s.inlineLink}>
        {c.artesanal_link}
      </Link>
      .{' '}
      {c.medida_lead}{' '}
      <Link href="/trajes-a-medida-madrid" className={s.inlineLink}>
        {c.medida_link}
      </Link>
      .
    </p>
  )
}

/* Credenciales: the three figures, value over label as on live. */
export function Stats({ c, className }: { c: ServiciosContent['cred']; className?: string }) {
  return (
    <ul className={`${s.stats} ${className ?? ''}`}>
      {[
        [c.stat1_val, c.stat1_label],
        [c.stat2_val, c.stat2_label],
        [c.stat3_val, c.stat3_label],
      ].map(([v, l]) => (
        <li key={l} className={s.stat} data-stat>
          <span className={s.statVal}>{v}</span>
          <span className={s.statLabel}>{l}</span>
        </li>
      ))}
    </ul>
  )
}

/* TejidosMundoSection's globe, same markers, arcs and settings as live. */
const Globe = dynamic(() => import('@/components/ui/globe').then((m) => m.Globe), {
  ssr: false,
  loading: () => <div style={{ width: '100%', aspectRatio: '1' }} />,
})

const MARKERS: GlobeMarker[] = [
  { id: 'madrid', location: [40.4168, -3.7038], label: 'Madrid — Nuestra Sastrería' },
  { id: 'miami', location: [25.7617, -80.1918], label: 'Miami · USA' },
  { id: 'oporto', location: [41.1579, -8.6291], label: 'Oporto · Portugal' },
  { id: 'lisbon', location: [38.7223, -9.1393], label: 'Lisboa · Portugal' },
  { id: 'canarias', location: [28.2916, -16.6291], label: 'Islas Canarias · España' },
  { id: 'paris', location: [48.8566, 2.3522], label: 'París · Francia' },
  { id: 'london', location: [51.5074, -0.1278], label: 'Londres · UK' },
  { id: 'rome', location: [41.9028, 12.4964], label: 'Roma · Italia' },
  { id: 'birmingham', location: [52.4862, -1.8904], label: 'Birmingham · UK' },
  { id: 'dominican', location: [18.7357, -70.1627], label: 'República Dominicana' },
  { id: 'peru', location: [-9.19, -75.0152], label: 'Perú' },
  { id: 'dubai', location: [25.2048, 55.2708], label: 'Dubái · UAE' },
  { id: 'germany', location: [51.1657, 10.4515], label: 'Alemania' },
  { id: 'belgium', location: [50.8503, 4.3517], label: 'Bélgica' },
]
const ARCS: GlobeArc[] = MARKERS.filter((m) => m.id !== 'madrid').map((m) => ({ id: `madrid-${m.id}`, from: [40.4168, -3.7038], to: m.location }))

export function MundoGlobe() {
  return (
    <div className={s.globe}>
      <Globe
        markers={MARKERS}
        arcs={ARCS}
        dark={1}
        markerColor={[0.77, 0.64, 0.35]}
        arcColor={[0.77, 0.64, 0.35]}
        baseColor={[0.2, 0.15, 0.07]}
        glowColor={[0.77, 0.64, 0.35]}
        mapBrightness={5}
        mapSamples={20000}
        speed={0.004}
        theta={0.38}
        diffuse={1.8}
        markerSize={0.05}
        markerElevation={0.015}
        arcWidth={0.5}
        arcHeight={0.35}
        className="w-full"
      />
    </div>
  )
}
