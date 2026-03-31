'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import { SastreriaHero }    from './SastreriaHero'
import { HistoriaSection }  from './HistoriaSection'
import { MaestroSection }   from './MaestroSection'
import { OficioGrid }       from './OficioGrid'
import { CifrasSection }    from './CifrasSection'
import { EspacioSection }   from './EspacioSection'
import { FilosofiaSection } from './FilosofiaSection'
import { SastreriaCTA }     from './SastreriaCTA'

export function SastreriaLayout() {
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    /* CRITICAL: no transform/filter/perspective on this wrapper — would break position:fixed thread */
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Gold narrative thread — grows as you scroll ── */}
      <motion.div
        style={{
          position:        'fixed',
          left:            'calc(var(--container-padding) / 2)',
          top:             '76px',
          bottom:           0,
          width:           '1px',
          background:      'linear-gradient(to bottom, transparent 0%, var(--color-gold) 5%, var(--color-gold) 95%, transparent 100%)',
          transformOrigin: 'top center',
          scaleY,
          zIndex:           10,
          pointerEvents:   'none',
          opacity:          0.4,
        }}
      />

      <SastreriaHero />
      <HistoriaSection />
      <MaestroSection />
      <OficioGrid />
      <CifrasSection />
      <EspacioSection />
      <FilosofiaSection />
      <SastreriaCTA />
    </div>
  )
}
