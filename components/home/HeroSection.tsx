'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'

export function HeroSection() {
  const { t } = useI18n()
  const barRef    = useRef<HTMLDivElement>(null)
  const labelRef  = useRef<HTMLDivElement>(null)
  const line1Ref  = useRef<HTMLDivElement>(null)
  const line2Ref  = useRef<HTMLDivElement>(null)
  const divRef    = useRef<HTMLDivElement>(null)
  const ctasRef   = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const els = [barRef, labelRef, line1Ref, line2Ref, divRef, ctasRef, scrollRef]
      .map(r => r.current).filter(Boolean)

    // Set initial states
    gsap.set(barRef.current,   { scaleY: 0, transformOrigin: 'top center' })
    gsap.set([labelRef.current, line1Ref.current, line2Ref.current,
              divRef.current, ctasRef.current], { y: 18, opacity: 0 })
    gsap.set(scrollRef.current, { opacity: 0 })
    gsap.set(bgRef.current, { opacity: 0 })

    // Slow-motion playback — 0.35× feels cinematic without stalling
    if (videoRef.current) videoRef.current.playbackRate = 0.85

    const tl = gsap.timeline({ delay: 2.0 })

    tl.to(bgRef.current, {
        opacity: 1, duration: 1.4, ease: 'power2.inOut',
      })
      .to(barRef.current, {
        scaleY: 1, duration: 0.9, ease: 'power3.inOut',
      }, '-=0.6')
      .to(labelRef.current, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
      }, '-=0.4')
      .to(line1Ref.current, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
      }, '-=0.5')
      .to(line2Ref.current, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
      }, '-=0.5')
      .to(divRef.current, {
        y: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
      }, '-=0.35')
      .to(ctasRef.current, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
      }, '-=0.3')
      .to(scrollRef.current, {
        opacity: 1, duration: 0.5,
      }, '-=0.2')

    return () => { tl.kill() }
  }, [])

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100svh',
      minHeight: '600px',
      overflow: 'hidden',
      background: '#050C14',
    }}>

      {/* ── VIDEO / IMAGE BACKGROUND ─────────────────────── */}
      <div ref={bgRef} style={{
        position: 'absolute', inset: 0, opacity: 0,
      }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.45) saturate(0.7)',
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Bottom-left soft vignette so text stays readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 70% 60% at 0% 100%, rgba(5,12,20,0.85) 0%, transparent 70%),
            linear-gradient(to top, rgba(5,12,20,0.5) 0%, transparent 40%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Subtle edge-vignette for cinematic frame */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 0 120px rgba(5,12,20,0.55)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── CORNER BRACKETS ──────────────────────────────── */}
      {[
        { top: 28, left: 28, borderTop: 1, borderLeft: 1 },
        { top: 28, right: 28, borderTop: 1, borderRight: 1 },
        { bottom: 28, left: 28, borderBottom: 1, borderLeft: 1 },
        { bottom: 28, right: 28, borderBottom: 1, borderRight: 1 },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 22, height: 22,
          borderColor: 'rgba(196,163,90,0.25)',
          borderStyle: 'solid',
          borderTopWidth:    s.borderTop    ?? 0,
          borderLeftWidth:   s.borderLeft   ?? 0,
          borderRightWidth:  s.borderRight  ?? 0,
          borderBottomWidth: s.borderBottom ?? 0,
          ...s,
          pointerEvents: 'none',
          zIndex: 3,
        }} />
      ))}

      {/* ── BOTTOM-LEFT TEXT BLOCK ────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(2rem, 5vh, 4rem)',
        left:   'clamp(2rem, 4vw, 4.5rem)',
        zIndex:  4,
        display: 'flex',
        flexDirection: 'row',
        alignItems:    'flex-end',
        gap: '1.4rem',
        maxWidth: 'min(480px, 85vw)',
      }}>

        {/* Gold vertical bar */}
        <div ref={barRef} style={{
          flexShrink: 0,
          width:  '1px',
          height: 'clamp(80px, 14vh, 130px)',
          background: 'linear-gradient(to bottom, transparent, var(--color-gold) 30%, var(--color-gold))',
          alignSelf: 'stretch',
          marginBottom: '0.1rem',
        }} />

        {/* Text content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Label */}
          <div ref={labelRef} style={{
            fontFamily:    'var(--font-sans)',
            fontSize:       '0.6rem',
            letterSpacing:  '0.28em',
            textTransform:  'uppercase',
            color:          'var(--color-gold)',
            opacity:         0.8,
          }}>
            Sastrería · Madrid
          </div>

          {/* Tagline */}
          <div>
            <div ref={line1Ref} style={{
              fontFamily:   'var(--font-serif)',
              fontSize:     'clamp(1.45rem, 3vw, 2rem)',
              fontWeight:    400,
              lineHeight:    1.15,
              letterSpacing: '-0.01em',
              color:         'var(--color-offwhite)',
            }}>
              {t.hero.tagline}
            </div>
            <div ref={line2Ref} style={{
              fontFamily:   'var(--font-serif)',
              fontSize:     'clamp(1.45rem, 3vw, 2rem)',
              fontWeight:    400,
              lineHeight:    1.15,
              letterSpacing: '-0.01em',
              color:         'var(--color-gold-light)',
              fontStyle:     'italic',
            }}>
              {t.hero.tagline2}
            </div>
          </div>

          {/* Thin gold rule */}
          <div ref={divRef} style={{
            width:      '32px',
            height:     '1px',
            background:  'rgba(196,163,90,0.5)',
          }} />

          {/* CTAs */}
          <div ref={ctasRef} style={{
            display:  'flex',
            gap:       '2rem',
            alignItems: 'center',
          }}>
            <Link href="/reservar" style={{
              fontFamily:   'var(--font-sans)',
              fontSize:      '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:          'var(--color-gold)',
              borderBottom:  '1px solid rgba(196,163,90,0.45)',
              paddingBottom:  '3px',
              transition:    'color .25s, border-color .25s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = 'var(--color-gold-light)'
              el.style.borderBottomColor = 'var(--color-gold-light)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = 'var(--color-gold)'
              el.style.borderBottomColor = 'rgba(196,163,90,0.45)'
            }}>
              {t.hero.cta_primary}
            </Link>

            <span style={{ color: 'rgba(196,163,90,0.2)', fontSize: '0.5rem' }}>◆</span>

            <Link href="/experiencia" style={{
              fontFamily:    'var(--font-sans)',
              fontSize:       '0.65rem',
              letterSpacing:  '0.18em',
              textTransform:  'uppercase',
              color:           'rgba(245,240,234,0.45)',
              transition:     'color .25s',
              textDecoration:  'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-offwhite)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,234,0.45)'
            }}>
              {t.hero.cta_secondary}
            </Link>
          </div>

        </div>
      </div>

      {/* ── SCROLL INDICATOR (right edge, rotated) ───────── */}
      <div ref={scrollRef} style={{
        position:  'absolute',
        right:     'clamp(1.5rem, 3vw, 3rem)',
        bottom:    'clamp(2rem, 5vh, 4rem)',
        zIndex:     4,
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap:        '0.8rem',
      }}>
        <span style={{
          fontFamily:   'var(--font-sans)',
          fontSize:      '0.55rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:          'rgba(196,163,90,0.4)',
          writingMode:   'vertical-rl',
          transform:     'rotate(180deg)',
        }}>
          Scroll
        </span>
        <ScrollPulse />
      </div>

    </section>
  )
}

/* Animated gold pulse line */
function ScrollPulse() {
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return
    gsap.fromTo(fill,
      { scaleY: 0, transformOrigin: 'top center', opacity: 1 },
      {
        scaleY: 1, opacity: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        repeat: -1,
        delay: 3.2,
      }
    )
  }, [])

  return (
    <div ref={trackRef} style={{
      width:    '1px',
      height:    '48px',
      background: 'rgba(196,163,90,0.12)',
      position:   'relative',
    }}>
      <div ref={fillRef} style={{
        position:         'absolute',
        inset:             0,
        background:        'var(--color-gold)',
        transformOrigin:  'top center',
      }} />
    </div>
  )
}
