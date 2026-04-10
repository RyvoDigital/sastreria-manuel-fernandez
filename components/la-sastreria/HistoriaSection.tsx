'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function HistoriaSection() {
  const { t } = useI18n()
  const sectionRef  = useRef<HTMLElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const photoImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el    = sectionRef.current
    const photo = photoRef.current
    const img   = photoImgRef.current
    if (!el || !photo || !img) return

    const ctx = gsap.context(() => {
      // Photo clip-path curtain from bottom
      gsap.from(photo, {
        clipPath:      'inset(0 0 100% 0)',
        duration:       1.5,
        ease:          'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' },
      })

      // Photo parallax drift
      gsap.to(img, {
        y:             -50,
        ease:          'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.8 },
      })

      // Ghost watermark
      gsap.from('.mf-hist-wm', {
        y:             30,
        opacity:       0,
        duration:      1.4,
        ease:          'power2.out',
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Title
      gsap.from('.mf-hist-title', {
        y:             28,
        opacity:       0,
        duration:      0.9,
        ease:          'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Paragraphs stagger
      gsap.from('.mf-hist-p', {
        y:             20,
        opacity:       0,
        duration:      0.9,
        ease:          'power3.out',
        stagger:       0.18,
        delay:         0.2,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#FFFFFF',
        padding:    'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow:   'hidden',
      }}
    >
      <div style={{
        maxWidth:            'var(--container-max)',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: '65fr 35fr',
        gap:                 'clamp(3rem, 6vw, 7rem)',
        alignItems:          'start',
      }}>

        {/* ── TEXT COLUMN ── */}
        <div style={{ position: 'relative' }}>

          {/* Ghost watermark */}
          <div className="mf-hist-wm" style={{
            position:      'absolute',
            top:           '-2rem',
            left:          '-1rem',
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(8rem, 18vw, 20rem)',
            fontWeight:     700,
            color:         '#0A1628',
            opacity:        0.06,
            lineHeight:     1,
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:         0,
          }}>
            1978
          </div>

          {/* Label */}
          <div style={{
            position:      'relative', zIndex: 1,
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.65rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         '#C9A84C',
            marginBottom:  '1.2rem',
            opacity:        0.85,
          }}>
            {t.la_sastreria.historia.label}
          </div>

          {/* Gold rule */}
          <div style={{
            position:   'relative', zIndex: 1,
            width:      '36px', height: '1px',
            background: 'rgba(201,168,76,0.5)',
            marginBottom: '1.5rem',
          }} />

          {/* Title */}
          <h2 className="mf-hist-title" style={{
            position:      'relative', zIndex: 1,
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(2.4rem, 4.5vw, 4.2rem)',
            fontWeight:     400,
            lineHeight:     1.1,
            color:         '#0A1628',
            marginBottom:  'clamp(2rem, 4vh, 3rem)',
          }}>
            {t.la_sastreria.historia.title}
          </h2>

          {/* Paragraphs */}
          {[
            t.la_sastreria.historia.p1,
            t.la_sastreria.historia.p2,
            t.la_sastreria.historia.p3,
          ].map((p, i) => (
            <p key={i} className="mf-hist-p" style={{
              position:   'relative', zIndex: 1,
              fontFamily: 'var(--font-sans)',
              fontSize:   'clamp(0.88rem, 1.3vw, 1.02rem)',
              lineHeight:  1.88,
              color:      '#0A1628',
              marginBottom: '1.4rem',
              maxWidth:   '58ch',
            }}>
              {p}
            </p>
          ))}
        </div>

        {/* ── PHOTO COLUMN ── */}
        <div
          ref={photoRef}
          style={{
            position:   'relative',
            height:     'clamp(28rem, 55vw, 52rem)',
            overflow:   'hidden',
            clipPath:   'inset(0 0 0% 0)', // initial state — GSAP animates from 100% bottom
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={photoImgRef}
            src="/photos/maestro-cutting-table.jpg"
            alt="Manuel Fernández en la mesa de corte"
            style={{
              position:   'absolute',
              inset:      '-10%',
              width:      '120%',
              height:     '120%',
              objectFit:  'cover',
              objectPosition: 'center',
              willChange: 'transform',
            }}
          />

          {/* Subtle left-side gold gradient */}
          <div style={{
            position:      'absolute', inset: 0, pointerEvents: 'none',
            background:    'linear-gradient(to right, rgba(255,255,255,0.3), transparent 30%)',
          }} />
        </div>
      </div>
    </section>
  )
}
