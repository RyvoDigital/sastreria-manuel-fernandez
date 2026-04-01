'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import { ServiciosHero }         from './ServiciosHero'
import { ServiciosMorphGallery } from './ServiciosMorphGallery'
import { CredencialesSection }   from './CredencialesSection'
import { TejidosMundoSection }   from './TejidosMundoSection'
export function ServiciosLayout() {
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    /* CRITICAL: no transform/filter/perspective on this wrapper — breaks position:fixed */
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Gold narrative thread */}
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

      <ServiciosHero />
      <ServiciosMorphGallery />
      <CredencialesSection />
      <TejidosMundoSection />
    </div>
  )
}
