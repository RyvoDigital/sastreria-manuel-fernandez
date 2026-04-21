'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

export function BodasHero() {
  const { t } = useI18n()
  const c = t.bodas.hero

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
          src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797426/cGhvdG9zL3dlZGRpbmctY2VyZW1vbnlfd2Y3dHli"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.75) 50%, rgba(10,22,40,0.92) 100%)',
        }} />
      </div>

      {/* Layer 1: Massive "Bodas" text — sits BEHIND the garment photo */}
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

      {/* Layer 2: Central garment photo — OVER the huge background text */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        width: 'clamp(220px, 32vw, 420px)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797420/cGhvdG9zL3dlZGRpbmctbW9ybmluZy1jb2F0X3B0aWJhaA=="
          alt="Traje de novio a medida — Bodas & Ceremonia"
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

      {/* Layer 4: Glassmorphism card — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '8%',
          left: 'var(--container-padding)',
          zIndex: 4,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          minWidth: '180px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.52rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
          }}>Est. 1978</span>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-gold)', opacity: 0.7 }} />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.52rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
          }}>Madrid</span>
        </div>
        <div style={{ height: '1px', background: 'rgba(196,163,90,0.15)', marginBottom: '0.75rem' }} />
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          {[{ val: '1978', label: 'Est.' }, { val: '100%', label: 'A Mano' }].map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.3rem',
                color: 'var(--color-offwhite)',
                lineHeight: 1,
              }}>{s.val}</div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.45rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(196,163,90,0.5)',
                marginTop: '0.2rem',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
