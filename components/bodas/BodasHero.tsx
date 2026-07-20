'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

export function BodasHero() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const c = t.bodas.hero

  if (isMobile) {
    return (
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0A1628',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-010-0677.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.8) 50%, rgba(10,22,40,0.95) 100%)',
          }} />
        </div>

        {/* Stacked content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(5rem, 15vh, 7rem) var(--container-padding) clamp(2rem, 5vh, 3rem)',
          gap: '1.5rem',
        }}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.7)',
              marginBottom: '0.75rem',
            }}>
              {c.label}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}>
              {c.title}
            </h1>
          </motion.div>

          {/* Garment photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{
              width: '100%',
              margin: '0 auto',
              height: '72vh',
              minHeight: '320px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-010-0677.jpg"
              alt="Traje de novio a medida · Bodas y Ceremonia"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: '1.5rem 1.5rem 0.5rem 0.5rem',
                boxShadow: '0 30px 60px rgba(10,22,40,0.6), 0 0 0 1px rgba(201,168,76,0.15)',
                display: 'block',
              }}
            />
          </motion.div>

        </div>
      </section>
    )
  }

  /* ─── Desktop — keep absolute positioning ─── */
  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      background: '#0A1628',
      overflow: 'hidden',
    }}>
      {/* Layer 0: Background photo + overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-010-0677.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.75) 50%, rgba(10,22,40,0.92) 100%)',
        }} />
      </div>

      {/* Layer 1: Massive "Bodas" text */}
      <div style={{
        position: 'absolute',
        bottom: '2%',
        left: 0,
        right: 0,
        zIndex: 1,
        textAlign: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(8rem, 22vw, 26rem)',
          fontWeight: 400,
          color: '#C9A84C',
          opacity: 0.07,
          lineHeight: 0.85,
          letterSpacing: '-0.02em',
          display: 'block',
          whiteSpace: 'nowrap',
        }}>
          Bodas
        </span>
      </div>

      {/* Layer 2: Central garment photo */}
      <div style={{
        position: 'absolute',
        top: 'clamp(100px, 14vh, 160px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        width: 'clamp(220px, 32vw, 420px)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ik.imagekit.io/hvzm7siir/all-images/atelier-2026-04-24-010-0677.jpg"
          alt="Traje de novio a medida · Bodas y Ceremonia"
          style={{
            width: '100%',
            height: 'clamp(340px, 72vh, 680px)',
            objectFit: 'cover',
            objectPosition: 'top center',
            borderRadius: '1.5rem 1.5rem 0.5rem 0.5rem',
            boxShadow: '0 40px 100px rgba(10,22,40,0.8), 0 0 0 1px rgba(201,168,76,0.18)',
            display: 'block',
          }}
        />
      </div>

      {/* Layer 3: Top-left editorial text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        style={{
          position: 'absolute',
          top: 'clamp(5rem, 12vh, 10rem)',
          left: 'var(--container-padding)',
          zIndex: 3,
          maxWidth: '420px',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.7)',
          marginBottom: '1.2rem',
        }}>
          {c.label}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2.4rem, 4vw, 4rem)',
          fontWeight: 400,
          color: '#FFFFFF',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}>
          {c.title}
        </h1>
      </motion.div>

      {/* Layer 3: Bottom-right scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '6%',
          right: 'var(--container-padding)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div style={{
          width: '1px',
          height: '3rem',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.55))',
        }} />
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.48rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.5)',
          writingMode: 'vertical-rl',
        }}>
          Desplazar
        </p>
      </motion.div>


    </section>
  )
}
