'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'

gsap.registerPlugin(ScrollTrigger)

export function EvelynSection() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
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
      gsap.from('.mf-ev-wm', {
        y:             30,
        opacity:       0,
        duration:      1.4,
        ease:          'power2.out',
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Title
      gsap.from('.mf-ev-title', {
        y:             28,
        opacity:       0,
        duration:      0.9,
        ease:          'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Paragraphs stagger
      gsap.from('.mf-ev-p', {
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
        background: '#0A1628',
        padding:    'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow:   'hidden',
      }}
    >
      <div style={{
        maxWidth:            'var(--container-max)',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '45fr 55fr',
        gap:                 'clamp(3rem, 6vw, 7rem)',
        alignItems:          'start',
      }}>

        {/* ── PHOTO COLUMN (left, mirrored from Manuel) ── */}
        <div
          ref={photoRef}
          style={{
            position:   'relative',
            height:     isMobile ? '50vh' : 'clamp(28rem, 55vw, 52rem)',
            overflow:   'hidden',
            clipPath:   'inset(0 0 0% 0)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={photoImgRef}
            src="https://res.cloudinary.com/dwruvre6o/image/upload/v1776797341/photos/wedding-couple_hk4ppu.jpg"
            alt="Evelyn — Sastrería Manuel Fernández"
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

          {/* Subtle right-side gold gradient */}
          <div style={{
            position:      'absolute', inset: 0, pointerEvents: 'none',
            background:    'linear-gradient(to left, rgba(10,22,40,0.4), transparent 30%)',
          }} />
        </div>

        {/* ── TEXT COLUMN (right) ── */}
        <div style={{ position: 'relative' }}>

          {/* Ghost watermark */}
          <div className="mf-ev-wm" style={{
            position:      'absolute',
            top:           '-2rem',
            left:          '-1rem',
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(8rem, 18vw, 20rem)',
            fontWeight:     700,
            color:         '#FFFFFF',
            opacity:        0.04,
            lineHeight:     1,
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:         0,
          }}>
            E
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
            {t.la_sastreria.evelyn.label}
          </div>

          {/* Gold rule */}
          <div style={{
            position:   'relative', zIndex: 1,
            width:      '36px', height: '1px',
            background: 'rgba(201,168,76,0.5)',
            marginBottom: '1.5rem',
          }} />

          {/* Title */}
          <h2 className="mf-ev-title" style={{
            position:      'relative', zIndex: 1,
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(2.4rem, 4.5vw, 4.2rem)',
            fontWeight:     400,
            lineHeight:     1.1,
            color:         '#FFFFFF',
            marginBottom:  'clamp(2rem, 4vh, 3rem)',
          }}>
            Evelyn
          </h2>

          <p className="mf-ev-p" style={{
            position:   'relative', zIndex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize:   'clamp(0.88rem, 1.3vw, 1.02rem)',
            lineHeight:  1.88,
            color:      'rgba(255,255,255,0.75)',
            marginBottom: '1.4rem',
            maxWidth:   '58ch',
          }}>
            {t.la_sastreria.evelyn.p1}
          </p>

          <p className="mf-ev-p" style={{
            position:   'relative', zIndex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize:   'clamp(0.88rem, 1.3vw, 1.02rem)',
            lineHeight:  1.88,
            color:      'rgba(255,255,255,0.75)',
            marginBottom: '1.4rem',
            maxWidth:   '58ch',
          }}>
            {t.la_sastreria.evelyn.p2}
          </p>

          <p className="mf-ev-p" style={{
            position:   'relative', zIndex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize:   'clamp(0.88rem, 1.3vw, 1.02rem)',
            lineHeight:  1.88,
            color:      'rgba(255,255,255,0.75)',
            marginBottom: '1.4rem',
            maxWidth:   '58ch',
          }}>
            {t.la_sastreria.evelyn.p3}
          </p>
        </div>
      </div>
    </section>
  )
}
