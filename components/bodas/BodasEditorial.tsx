'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function BodasEditorial() {
  const { t } = useI18n()
  const c = t.bodas.editorial
  const blockARef = useRef<HTMLDivElement>(null)
  const blockBRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctxA = blockARef.current ? gsap.context(() => {
      gsap.from('.mf-bodas-ed-a-content > *', {
        y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: blockARef.current, start: 'top 70%', toggleActions: 'play none none none' },
      })
    }, blockARef.current) : null

    const ctxB = blockBRef.current ? gsap.context(() => {
      gsap.from('.mf-bodas-ed-b-content > *', {
        y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: blockBRef.current, start: 'top 70%', toggleActions: 'play none none none' },
      })
    }, blockBRef.current) : null

    return () => { ctxA?.revert(); ctxB?.revert() }
  }, [])

  return (
    <>
      {/* ── Block A: navy background, photo left, text right ── */}
      <div
        ref={blockARef}
        style={{
          position: 'relative',
          background: 'var(--color-navy)',
          minHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        }}
      >
        {/* z=1: Massive background word */}
        <div style={{
          position: 'absolute',
          bottom: '2%',
          right: '-2%',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(8rem, 16vw, 18rem)',
            fontWeight: 400,
            color: 'var(--color-gold)',
            opacity: 0.055,
            lineHeight: 0.9,
            display: 'block',
          }}>
            Promesa
          </span>
        </div>

        {/* z=2: Photo — left side */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          width: '48%',
          height: '80%',
          zIndex: 2,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/wedding-ceremony.jpg"
            alt="La ceremonia — Sastrería Manuel Fernández"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '0 1.5rem 1.5rem 0',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '0 1.5rem 1.5rem 0',
            boxShadow: 'inset 0 0 0 1px rgba(196,163,90,0.15)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* z=3: Content — right side */}
        <div
          className="mf-bodas-ed-a-content"
          style={{
            position: 'relative',
            zIndex: 3,
            marginLeft: 'auto',
            width: 'clamp(280px, 42%, 500px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.65)',
            marginBottom: '1.2rem',
          }}>
            {c.label1}
          </p>
          <div style={{
            width: '2rem', height: '1px',
            background: 'rgba(196,163,90,0.4)',
            marginBottom: '1.8rem',
          }} />
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 2.8vw, 3rem)',
            fontWeight: 400,
            color: 'var(--color-offwhite)',
            lineHeight: 1.2,
            marginBottom: '1.5rem',
          }}>
            {c.title1}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.84rem, 1.1vw, 0.94rem)',
            lineHeight: 1.9,
            color: 'rgba(245,240,234,0.42)',
            maxWidth: '44ch',
          }}>
            {c.body1}
          </p>
        </div>
      </div>

      {/* ── Block B: cream background, photo right, text left ── */}
      <div
        ref={blockBRef}
        style={{
          position: 'relative',
          background: '#EDE8E0',
          minHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        }}
      >
        {/* z=1: Massive background word */}
        <div style={{
          position: 'absolute',
          bottom: '2%',
          left: '-2%',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(8rem, 18vw, 20rem)',
            fontWeight: 400,
            color: 'var(--color-navy)',
            opacity: 0.05,
            lineHeight: 0.9,
            display: 'block',
          }}>
            Detalle
          </span>
        </div>

        {/* z=2: Photo — right side */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: 0,
          width: '46%',
          height: '80%',
          zIndex: 2,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/wedding-groom-detail.jpg"
            alt="El detalle nupcial — Sastrería Manuel Fernández"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '1.5rem 0 0 1.5rem',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '1.5rem 0 0 1.5rem',
            boxShadow: 'inset 0 0 0 1px rgba(5,12,20,0.08)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* z=3: Content — left side */}
        <div
          className="mf-bodas-ed-b-content"
          style={{
            position: 'relative',
            zIndex: 3,
            width: 'clamp(280px, 42%, 500px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(196,163,90,0.8)',
            marginBottom: '1.2rem',
          }}>
            {c.label2}
          </p>
          <div style={{
            width: '2rem', height: '1px',
            background: 'rgba(196,163,90,0.5)',
            marginBottom: '1.8rem',
          }} />
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 2.8vw, 3rem)',
            fontWeight: 400,
            color: 'var(--color-navy)',
            lineHeight: 1.2,
            marginBottom: '1.5rem',
          }}>
            {c.title2}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.84rem, 1.1vw, 0.94rem)',
            lineHeight: 1.9,
            color: 'rgba(5,12,20,0.5)',
            maxWidth: '44ch',
          }}>
            {c.body2}
          </p>
        </div>
      </div>
    </>
  )
}
