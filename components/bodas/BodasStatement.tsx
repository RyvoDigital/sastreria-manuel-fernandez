'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

export function BodasStatement() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const c = t.bodas.statement

  return (
    <section style={{
      background: '#FFFFFF',
      padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '38fr 62fr',
        gap: 'clamp(3rem, 6vw, 8rem)',
        alignItems: 'center',
      }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.75)',
            marginBottom: '1.5rem',
          }}>
            {c.label}
          </p>
          <div style={{
            width: '2.5rem',
            height: '1px',
            background: '#C9A84C',
            opacity: 0.5,
          }} />
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          viewport={{ once: true }}
        >
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 2.5vw, 2.4rem)',
            fontWeight: 400,
            color: '#0A1628',
            lineHeight: 1.3,
            marginBottom: '1.5rem',
          }}>
            {c.headline}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
            lineHeight: 1.85,
            color: 'rgba(10,22,40,0.65)',
            maxWidth: '52ch',
          }}>
            {c.body}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
