'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { FlipGallery } from '@/components/ui/flip-gallery'

gsap.registerPlugin(ScrollTrigger)

const ROMAN = ['I', 'II', 'III', 'IV']

const CSS = `
  @keyframes mf-ghost-fade {
    from { opacity: 0; transform: translateY(-50%) scale(0.95); }
    to   { opacity: 1; transform: translateY(-50%) scale(1);    }
  }
  .mf-ghost-numeral { animation: mf-ghost-fade 0.55s ease forwards; }
`

export function OficioFlipSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const disciplines = [
    { label: t.la_sastreria.oficio.cat1, url: '/photos/cutting-table.jpg'  },
    { label: t.la_sastreria.oficio.cat2, url: '/photos/cutting-tweed.jpg'  },
    { label: t.la_sastreria.oficio.cat3, url: '/photos/sleeve-buttons.jpg' },
    { label: t.la_sastreria.oficio.cat4, url: '/photos/velvet-lining.jpg'  },
  ]

  const images = disciplines.map((d) => ({ title: d.label, url: d.url }))

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 72%', toggleActions: 'play none none none' }

      // Left column children stagger
      gsap.from('.mf-of-lhs > *', {
        y: 22, opacity: 0, duration: 0.9, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: trigger,
      })

      // Gallery slides in from right
      gsap.from('.mf-of-gallery', {
        x: 48, opacity: 0, duration: 1.1, ease: 'power3.out',
        delay: 0.1,
        scrollTrigger: trigger,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding:    'clamp(6rem, 12vh, 10rem) var(--container-padding)',
        overflow:   'hidden',
        position:   'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Warm gold radial glow toward gallery side */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 70% at 78% 50%, rgba(201,168,76,0.06) 0%, transparent 100%)',
      }} />

      <div style={{
        maxWidth:            'var(--container-max)',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: '42fr 58fr',
        gap:                 'clamp(3rem, 6vw, 7rem)',
        alignItems:          'center',
        position:            'relative',
        zIndex:               1,
      }}>

        {/* ── LEFT: label · title · discipline list · body ── */}
        <div className="mf-of-lhs">

          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(201,168,76,0.6)',
            marginBottom:  '1.2rem',
          }}>
            {t.la_sastreria.oficio.label}
          </div>

          <div style={{
            width: '36px', height: '1px',
            background:   'rgba(201,168,76,0.4)',
            marginBottom: '1.6rem',
          }} />

          <h2 style={{
            fontFamily:   'var(--font-serif)',
            fontStyle:    'italic',
            fontSize:     'clamp(2.2rem, 4vw, 3.8rem)',
            fontWeight:    400,
            lineHeight:    1.1,
            color:        '#FFFFFF',
            marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)',
            margin:        '0 0 clamp(2.5rem, 5vh, 3.5rem) 0',
          }}>
            {t.la_sastreria.oficio.title}
          </h2>

          {/* Discipline list — active one glows gold */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '1.1rem',
            marginBottom:  'clamp(2.5rem, 5vh, 3.5rem)',
          }}>
            {disciplines.map((d, i) => (
              <div
                key={i}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '1.1rem',
                  opacity:     i === activeIdx ? 1 : 0.28,
                  transition: 'opacity 0.55s ease',
                  cursor:     'default',
                }}
              >
                {/* Roman numeral */}
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle:  'italic',
                  fontSize:   '0.72rem',
                  color:      '#C9A84C',
                  minWidth:   '1.6rem',
                  opacity:     0.75,
                }}>
                  {ROMAN[i]}
                </span>

                {/* Label */}
                <span style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '0.63rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:         i === activeIdx ? '#E8D5A3' : 'rgba(255,255,255,0.75)',
                  transition:    'color 0.55s ease',
                }}>
                  {d.label}
                </span>

                {/* Extending gold rule on active */}
                {i === activeIdx && (
                  <div style={{
                    flex:       1,
                    height:     '1px',
                    background: 'linear-gradient(to right, rgba(201,168,76,0.45), transparent)',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Body copy */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'clamp(0.82rem, 1.1vw, 0.94rem)',
            lineHeight:  1.85,
            color:      'rgba(255,255,255,0.5)',
            maxWidth:   '36ch',
            margin:      0,
          }}>
            Cuatro disciplinas que se superponen con precisión milimétrica.
            Ninguna es más importante que las demás.
          </p>
        </div>

        {/* ── RIGHT: ghost numeral + flip gallery ── */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>

          {/* Ghost Roman numeral — re-mounts on index change for fade animation */}
          <div
            key={activeIdx}
            className="mf-ghost-numeral"
            style={{
              position:      'absolute',
              top:           '50%',
              right:         '-1rem',
              fontFamily:    'var(--font-serif)',
              fontStyle:     'italic',
              fontSize:      'clamp(9rem, 17vw, 17rem)',
              fontWeight:     700,
              color:         'rgba(201,168,76,0.05)',
              lineHeight:     1,
              pointerEvents: 'none',
              userSelect:    'none',
              zIndex:         0,
            }}
          >
            {ROMAN[activeIdx]}
          </div>

          {/* Flip gallery */}
          <div className="mf-of-gallery" style={{ position: 'relative', zIndex: 1 }}>
            <FlipGallery
              images={images}
              id="mf-oficio-flip"
              width={440}
              height={680}
              onIndexChange={setActiveIdx}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
