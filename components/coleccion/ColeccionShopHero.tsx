'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export function ColeccionShopHero() {
  const { t } = useI18n()
  const c = t.coleccion.hero

  return (
    <section style={{
      background: '#F5F0EA',
      padding: 'clamp(8rem, 15vh, 13rem) var(--container-padding) clamp(4rem, 8vh, 7rem)',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '44fr 56fr',
        gap: 'clamp(3rem, 7vw, 10rem)',
        alignItems: 'center',
      }}>

        {/* ── Left: editorial text ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.72)',
            marginBottom: '1.5rem',
          }}>
            {c.label}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
            fontWeight: 400,
            color: 'var(--color-navy)',
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
            marginBottom: '2rem',
          }}>
            {c.title}
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.85rem, 1.1vw, 0.94rem)',
            lineHeight: 1.88,
            color: 'rgba(5,12,20,0.48)',
            maxWidth: '40ch',
            marginBottom: '3rem',
          }}>
            {c.body}
          </p>

          {/* Featured product info strip */}
          <div style={{
            borderTop: '1px solid rgba(5,12,20,0.1)',
            paddingTop: '1.5rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.48rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(196,163,90,0.6)',
              marginBottom: '0.6rem',
            }}>
              {c.featured_label}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 1.8vw, 1.45rem)',
                fontWeight: 400,
                color: 'var(--color-navy)',
                lineHeight: 1.2,
              }}>
                Traje Príncipe de Gales
              </p>
              <Link href="/reservar" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.52rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              >
                Consultar →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Right: featured product placeholder ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          style={{ position: 'relative' }}
        >
          {/* Product card */}
          <div style={{
            aspectRatio: '3/4',
            background: 'var(--color-navy)',
            border: '1px solid rgba(196,163,90,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Crosshatch texture */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: [
                'linear-gradient(rgba(196,163,90,0.05) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(196,163,90,0.05) 1px, transparent 1px)',
              ].join(', '),
              backgroundSize: '44px 44px',
            }} />
            {/* Diagonal accent lines */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              bottom: '1.5rem',
              border: '1px solid rgba(196,163,90,0.08)',
            }} />
            {/* Roman numeral */}
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(7rem, 14vw, 14rem)',
              fontWeight: 400,
              color: 'rgba(196,163,90,0.1)',
              lineHeight: 1,
              position: 'relative',
              userSelect: 'none',
              letterSpacing: '-0.04em',
            }}>
              I
            </span>
            {/* Corner label */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.42rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(196,163,90,0.4)',
              }}>Trajes</span>
              <div style={{ width: '1.5rem', height: '1px', background: 'rgba(196,163,90,0.25)' }} />
            </div>
          </div>

          {/* Pagination counter below card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
            justifyContent: 'flex-end',
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.48rem',
              letterSpacing: '0.15em',
              color: 'rgba(5,12,20,0.4)',
            }}>01</span>
            <div style={{
              flex: 1,
              maxWidth: '3.5rem',
              height: '1px',
              background: 'rgba(5,12,20,0.15)',
            }} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.48rem',
              letterSpacing: '0.15em',
              color: 'rgba(5,12,20,0.25)',
            }}>08</span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              color: 'rgba(196,163,90,0.5)',
            }}>→</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
