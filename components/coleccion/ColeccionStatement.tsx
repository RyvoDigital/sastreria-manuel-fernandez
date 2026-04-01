'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

export function ColeccionStatement() {
  const { t } = useI18n()
  const c = t.coleccion.statement

  return (
    <section style={{
      background: '#EDE8E0',
      padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '38fr 62fr',
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
            color: 'rgba(196,163,90,0.7)',
            marginBottom: '1.5rem',
          }}>
            {c.label}
          </p>
          <div style={{
            width: '2.5rem',
            height: '1px',
            background: 'var(--color-gold)',
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
            color: 'var(--color-navy)',
            lineHeight: 1.3,
            marginBottom: '1.5rem',
          }}>
            {c.headline}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
            lineHeight: 1.85,
            color: 'rgba(5,12,20,0.55)',
            maxWidth: '52ch',
          }}>
            {c.body}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
