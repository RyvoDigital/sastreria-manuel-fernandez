'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function ColeccionCTA() {
  const { t } = useI18n()
  const c = t.coleccion.cta

  return (
    <section style={{
      background: 'var(--color-navy)',
      padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Gold sweep line */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          viewport={{ once: true }}
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)',
            marginBottom: '3rem',
            opacity: 0.4,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.55)',
            marginBottom: '1.2rem',
          }}
        >
          El Siguiente Paso
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: 'easeOut', delay: 0.28 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 4vw, 3.8rem)',
            fontWeight: 400,
            color: 'var(--color-offwhite)',
            lineHeight: 1.12,
            marginBottom: '1.5rem',
          }}
        >
          {c.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
            lineHeight: 1.82,
            color: 'rgba(245,240,234,0.42)',
            maxWidth: '46ch',
            margin: '0 auto 2.8rem',
          }}
        >
          {c.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.46 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/reservar"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2.2rem',
              background: 'var(--color-gold)',
              color: '#080808',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-gold)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold-light, #d4b36a)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold)'
              el.style.transform = 'translateY(0)'
            }}
          >
            {c.btn_primary}
            <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </Link>

          <Link
            href="/contacto"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.85rem 2.2rem',
              background: 'transparent',
              color: 'rgba(245,240,234,0.75)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(245,240,234,0.22)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(245,240,234,0.55)'
              el.style.color = 'var(--color-offwhite)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(245,240,234,0.22)'
              el.style.color = 'rgba(245,240,234,0.75)'
            }}
          >
            {c.btn_secondary}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
