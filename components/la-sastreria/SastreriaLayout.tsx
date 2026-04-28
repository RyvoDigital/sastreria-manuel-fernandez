'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import { SastreriaHero }    from './SastreriaHero'
import { FilosofiaSection } from './FilosofiaSection'
import { CraftJourneySection } from './CraftJourneySection'
import { HistoriaSection }  from './HistoriaSection'
import { EspacioSection }   from './EspacioSection'
import { EvelynSection }    from './EvelynSection'
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
          background:      'linear-gradient(to bottom, transparent 0%, #C9A84C 5%, #C9A84C 95%, transparent 100%)',
          transformOrigin: 'top center',
          scaleY,
          zIndex:           10,
          pointerEvents:   'none',
          opacity:          0.4,
        }}
      />

      <SastreriaHero />
      <FilosofiaSection />
      <CraftJourneySection />
      <HistoriaSection />
      <EvelynSection />
      <EspacioSection />
      <SastreriaCTA />
    </div>
  )
}
