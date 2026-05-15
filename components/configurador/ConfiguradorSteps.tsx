'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
import {
  Layers,
  Ruler,
  Palette,
} from 'lucide-react'

const STEP_ICONS = [Layers, Ruler, Palette]

export function ConfiguradorSteps() {
  const { t, locale } = useI18n()
  const isMobile = useIsMobile()
  const c = t.configurador.steps
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const stepLabels: Record<string, string[]> = {
    es: ['Selección de tejidos', 'Medidas', 'Diseño y personalización'],
    en: ['Fabric selection', 'Measurements', 'Design and customization'],
    it: ['Selezione dei tessuti', 'Misure', 'Design e personalizzazione'],
    fr: ['Sélection des tissus', 'Mesures', 'Design et personnalisation'],
  }

  const labels = stepLabels[locale] || stepLabels.es

  return (
    <section
      ref={ref}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
        position: 'relative',
      }}
    >
      {/* Top gold line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
        }}
      />

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 4rem)' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1rem',
            }}
          >
            {c.label}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            {c.title}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {c.subtitle}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {labels.map((label, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                style={{
                  padding: '1.75rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C9A84C',
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>

                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0,
                  }}
                >
                  {c.descriptions[i]}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
