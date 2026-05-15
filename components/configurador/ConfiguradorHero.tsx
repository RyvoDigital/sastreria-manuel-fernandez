'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

export function ConfiguradorHero() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const c = t.configurador.hero

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        background: '#0A1628',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/w_1920/photos/web_lista_images/configurador-overview_e9k0ap"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.35,
            filter: 'saturate(0.6)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.7) 40%, rgba(10,22,40,0.85) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: `clamp(6rem, 12vh, 10rem) var(--container-padding) clamp(3rem, 6vh, 5rem)`,
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1.25rem',
            }}
          >
            {c.label}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: '800px',
              marginBottom: '1.25rem',
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '2.5rem',
            }}
          >
            {c.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Scroll hint */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '6%',
            right: 'var(--container-padding)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '3rem',
              background:
                'linear-gradient(to bottom, transparent, rgba(201,168,76,0.55))',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.48rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.5)',
              writingMode: 'vertical-rl',
            }}
          >
            {c.scroll}
          </p>
        </motion.div>
      )}
    </section>
  )
}
