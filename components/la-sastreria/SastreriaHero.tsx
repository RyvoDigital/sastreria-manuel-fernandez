'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'

const CSS = `
  @keyframes mf-sas-kb-hero {
    0%   { transform: scale(1.12) translate(1%, 0.5%); }
    100% { transform: scale(1.0)  translate(0%, 0%); }
  }
  .mf-sas-hero-photo {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; object-position: center 30%;
    animation: mf-sas-kb-hero 16s ease-out forwards;
    will-change: transform;
  }
  @keyframes mf-sas-kb-cta {
    0%   { transform: scale(1.0)  translate(0%, 0%); }
    100% { transform: scale(1.1)  translate(-0.5%, -1%); }
  }
  .mf-sas-cta-photo {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; object-position: center 20%;
    animation: mf-sas-kb-cta 22s ease-in-out infinite alternate;
    will-change: transform;
  }
`

export function SastreriaHero() {
  const { t } = useI18n()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Label
      gsap.from('.mf-sh-label', { y: 12, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 })

      // Headline words — split line1 and line2 by spaces
      const line1Words = el.querySelectorAll('.mf-sh-w1')
      const line2Words = el.querySelectorAll('.mf-sh-w2')

      gsap.from(line1Words, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.5 })
      gsap.from(line2Words, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.85 })

      // Subline
      gsap.from('.mf-sh-sub', { y: 8, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 1.4 })

      // Scroll hint
      gsap.from('.mf-sh-hint', { opacity: 0, duration: 0.6, delay: 1.8 })
    }, el)

    return () => ctx.revert()
  }, [])

  const line1 = t.la_sastreria.hero.headline_line1.split(' ')
  const line2 = t.la_sastreria.hero.headline_line2.split(' ')

  return (
    <>
      <style>{CSS}</style>
      <section style={{
        position:   'relative',
        width:      '100%',
        height:     '100vh',
        overflow:   'hidden',
        background: '#0A1628',
      }}>
        {/* Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/w_1920/photos/web_lista_images/sastreria-hero_v6qd4x" alt="" aria-hidden className="mf-sas-hero-photo" />

        {/* Gradient overlay */}
        <div style={{
          position:      'absolute', inset: 0, pointerEvents: 'none',
          background:    'linear-gradient(to bottom, rgba(10,22,40,0.18) 0%, rgba(10,22,40,0.3) 40%, rgba(10,22,40,0.85) 100%)',
        }} />

        {/* Content — anchored bottom-left */}
        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            bottom:   'clamp(3rem, 7vh, 6rem)',
            left:     'var(--container-padding)',
            right:    'var(--container-padding)',
          }}
        >
          {/* Label */}
          <div className="mf-sh-label" style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.72rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         '#C9A84C',
            marginBottom:  '1.5rem',
            opacity:        0.85,
          }}>
            {t.la_sastreria.hero.label}
          </div>

          {/* Headline */}
          <div style={{ lineHeight: 0.9, marginBottom: '2rem' }}>
            {/* Line 1 — offwhite */}
            <div style={{ display: 'block', overflow: 'hidden' }}>
              {line1.map((word, i) => (
                <span key={i} className="mf-sh-w1" style={{
                  display:    'inline-block',
                  fontFamily: 'var(--font-serif)',
                  fontSize:   'clamp(4.5rem, 11vw, 10.5rem)',
                  fontWeight:  400,
                  color:      '#FFFFFF',
                  marginRight: '0.25em',
                }}>
                  {word}
                </span>
              ))}
            </div>
            {/* Line 2 — italic gold */}
            <div style={{ display: 'block', overflow: 'hidden' }}>
              {line2.map((word, i) => (
                <span key={i} className="mf-sh-w2" style={{
                  display:    'inline-block',
                  fontFamily: 'var(--font-serif)',
                  fontSize:   'clamp(4.5rem, 11vw, 10.5rem)',
                  fontWeight:  400,
                  fontStyle:  'italic',
                  color:      '#C9A84C',
                  marginRight: '0.25em',
                }}>
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Subline */}
          <p className="mf-sh-sub" style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      'clamp(0.82rem, 1.4vw, 0.95rem)',
            letterSpacing: '0.06em',
            color:         'rgba(255,255,255,0.6)',
            maxWidth:      '420px',
          }}>
            {t.la_sastreria.hero.subline}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="mf-sh-hint" style={{
          position:      'absolute',
          bottom:        'clamp(2rem, 4vh, 3.5rem)',
          right:         'var(--container-padding)',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '0.5rem',
          opacity:        0,
        }}>
          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.48rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'rgba(201,168,76,0.5)',
          }}>
            Scroll
          </div>
          <div style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, #C9A84C, transparent)',
            opacity: 0.4,
          }} />
        </div>
      </section>
    </>
  )
}
