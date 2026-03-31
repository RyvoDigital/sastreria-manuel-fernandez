'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'

/* ── Animated gold pulse line ───────────────────────────── */
function ScrollPulse() {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return
    const anim = gsap.fromTo(fill,
      { scaleY: 0, transformOrigin: 'top center', opacity: 1 },
      {
        scaleY: 1, opacity: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        repeat: -1,
        delay: 3.4,
      }
    )
    return () => { anim.kill() }
  }, [])

  return (
    <div style={{
      width: '1px', height: '48px',
      background: 'rgba(196,163,90,0.12)',
      position: 'relative',
    }}>
      <div ref={fillRef} style={{
        position: 'absolute', inset: 0,
        background: 'var(--color-gold)',
        transformOrigin: 'top center',
      }} />
    </div>
  )
}

/* ── Identity card — rendered inside both curtain halves ── */
function IdentityCard() {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      textAlign:      'center',
      gap:            '0',
      pointerEvents:  'none',
      userSelect:     'none',
    }}>
      {/* Top label */}
      <div style={{
        fontFamily:    'var(--font-sans)',
        fontSize:      '0.48rem',
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        color:         'rgba(196,163,90,0.5)',
        marginBottom:  '1.4rem',
      }}>
        Sastrería · Madrid
      </div>

      {/* Monogram */}
      <div style={{
        fontFamily:    'var(--font-serif)',
        fontSize:      'clamp(3.8rem, 9vw, 5.5rem)',
        fontWeight:     400,
        fontStyle:     'italic',
        letterSpacing: '0.06em',
        color:         'var(--color-offwhite)',
        lineHeight:     1,
        marginBottom:  '1.2rem',
      }}>
        M·F
      </div>

      {/* Gold rule */}
      <div style={{
        width:        '36px',
        height:       '1px',
        background:   'rgba(196,163,90,0.45)',
        marginBottom: '1.2rem',
      }} />

      {/* Full name */}
      <div style={{
        fontFamily:    'var(--font-sans)',
        fontSize:      '0.52rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color:         'rgba(245,240,234,0.6)',
        marginBottom:  '0.6rem',
      }}>
        Manuel Fernández
      </div>

      {/* Est. */}
      <div style={{
        fontFamily:    'var(--font-sans)',
        fontSize:      '0.42rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color:         'rgba(196,163,90,0.35)',
      }}>
        Est. 1978
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────── */
export function ScrollExpandHero() {
  const { t } = useI18n()

  const [scrollProgress, setScrollProgress] = useState(0)
  const [fullyExpanded, setFullyExpanded]   = useState(false)
  const [ready, setReady]                   = useState(false)
  const [isMobile, setIsMobile]             = useState(false)
  const [vw, setVw]                         = useState(0)
  const [vh, setVh]                         = useState(0)

  const videoRef        = useRef<HTMLVideoElement>(null)
  const textRef         = useRef<HTMLDivElement>(null)
  const barRef          = useRef<HTMLDivElement>(null)
  const touchStartY     = useRef(0)
  const snapListenerRef = useRef<(() => void) | null>(null)

  /* ── Viewport size & mobile detection ───────────────── */
  useEffect(() => {
    const measure = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
      setIsMobile(window.innerWidth < 768)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  /* ── Timing guard — wait for loading screen ──────────── */
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 3300)
    return () => clearTimeout(timer)
  }, [])

  /* ── Mount video paused at frame 0 ───────────────────── */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    v.pause()
  }, [])

  /* ── Video playback driven by scrollProgress ─────────── */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (scrollProgress > 0.05) {
      v.play().catch(() => {})
      v.playbackRate = 0.85
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [scrollProgress])

  /* ── Lock ALL scroll while expansion is in progress ──── */
  useEffect(() => {
    type Lenis = { stop?: () => void; start?: () => void }
    const getLenis = () =>
      (window as unknown as Record<string, unknown>).lenis as Lenis | undefined

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    getLenis()?.stop?.()
    const retryStop = setTimeout(() => getLenis()?.stop?.(), 50)

    const onScroll = () => { if (window.scrollY > 0) window.scrollTo(0, 0) }
    snapListenerRef.current = onScroll
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(retryStop)
      window.removeEventListener('scroll', onScroll)
      snapListenerRef.current = null
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      getLenis()?.start?.()
    }
  }, [])

  /* ── Release scroll once video is fully expanded ─────── */
  useEffect(() => {
    if (!fullyExpanded) return
    type Lenis = { stop?: () => void; start?: () => void }
    const getLenis = () =>
      (window as unknown as Record<string, unknown>).lenis as Lenis | undefined

    if (snapListenerRef.current) {
      window.removeEventListener('scroll', snapListenerRef.current)
      snapListenerRef.current = null
    }

    window.scrollTo(0, 0)
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''

    const timer = setTimeout(() => getLenis()?.start?.(), 600)
    return () => clearTimeout(timer)
  }, [fullyExpanded])

  /* ── GSAP text entrance when fully expanded ──────────── */
  useEffect(() => {
    const text = textRef.current
    const bar  = barRef.current
    if (!fullyExpanded || !text || !bar) return

    gsap.set(bar, { scaleY: 0, transformOrigin: 'top center' })
    gsap.to(bar, { scaleY: 1, duration: 0.9, ease: 'power3.inOut', delay: 0.1 })

    gsap.fromTo(
      text.querySelectorAll('.te'),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.2 }
    )
  }, [fullyExpanded])

  /* ── Wheel + touch handlers ──────────────────────────── */
  const handleWheel = useCallback((e: Event) => {
    if (fullyExpanded) return
    const we = e as WheelEvent
    we.preventDefault()
    if (!ready) return

    const delta = we.deltaY * 0.0012
    setScrollProgress(prev => {
      const next = Math.min(Math.max(prev + delta, 0), 1)
      if (next >= 1) setFullyExpanded(true)
      return next
    })
  }, [ready, fullyExpanded])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (fullyExpanded) return
    e.preventDefault()
    if (!ready) return

    const deltaY = touchStartY.current - e.touches[0].clientY
    const delta = deltaY * 0.003
    setScrollProgress(prev => {
      const next = Math.min(Math.max(prev + delta, 0), 1)
      if (next >= 1) setFullyExpanded(true)
      return next
    })
    touchStartY.current = e.touches[0].clientY
  }, [ready, fullyExpanded])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove])

  /* ── Derived dimensions ──────────────────────────────── */
  const startW = isMobile ? 260 : 380
  const startH = isMobile ? 340 : 480
  const w = vw ? startW + scrollProgress * (vw - startW) : startW
  const h = vh ? startH + scrollProgress * (vh - startH) : startH

  const borderOpacity  = Math.max(0, 0.35 * (1 - scrollProgress * 2))
  const overlayOpacity = 0.3 * (1 - scrollProgress)
  const bgOpacity      = 1 - scrollProgress
  const scrollHintOp   = Math.max(0, 1 - scrollProgress * 3.5)
  const textBlockOp    = fullyExpanded ? 1 : Math.max(0, (scrollProgress - 0.65) / 0.35)

  // Curtains open in the first 42% of scroll, fully retracted at 42%
  const curtainProgress = Math.min(scrollProgress / 0.42, 1)

  return (
    <section style={{
      position:       'relative',
      width:          '100%',
      height:         '100svh',
      minHeight:      '600px',
      overflow:       'hidden',
      background:     '#050C14',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    }}>

      {/* ── TYPOGRAPHIC BACKGROUND ELEMENTS ─────────────── */}
      <div style={{
        position:      'absolute',
        inset:          0,
        opacity:        bgOpacity,
        pointerEvents: 'none',
        transition:    'opacity 0.05s linear',
      }}>
        {/* EST. 1978 — left vertical */}
        <div style={{
          position:      'absolute',
          left:          'clamp(1.8rem, 3vw, 3rem)',
          top:           '50%',
          transform:     'translateY(-50%) rotate(-90deg)',
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.65)',
          whiteSpace:    'nowrap',
        }}>
          Est. 1978
        </div>

        {/* MADRID · ESPAÑA — right vertical */}
        <div style={{
          position:      'absolute',
          right:         'clamp(1.8rem, 3vw, 3rem)',
          top:           '50%',
          transform:     'translateY(-50%) rotate(90deg)',
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.72rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.65)',
          whiteSpace:    'nowrap',
        }}>
          Madrid · España
        </div>

        {/* Motto — bottom center */}
        <div style={{
          position:      'absolute',
          bottom:        'clamp(1.5rem, 3vh, 2.5rem)',
          left:          '50%',
          transform:     'translateX(-50%)',
          fontFamily:    'var(--font-serif)',
          fontSize:      '1rem',
          fontStyle:     'italic',
          letterSpacing: '0.06em',
          color:         'rgba(196,163,90,0.45)',
          whiteSpace:    'nowrap',
        }}>
          La medida exacta de lo extraordinario
        </div>

        {/* Top center — hairline gold rule */}
        <div style={{
          position:   'absolute',
          top:         'clamp(1.5rem, 3vh, 2.5rem)',
          left:        '50%',
          transform:  'translateX(-50%)',
          width:       '40px',
          height:      '1px',
          background: 'rgba(196,163,90,0.2)',
        }} />
      </div>

      {/* ── CORNER BRACKETS (fade with bg) ───────────────── */}
      {[
        { top: 28, left: 28, borderTop: 1, borderLeft: 1 },
        { top: 28, right: 28, borderTop: 1, borderRight: 1 },
        { bottom: 28, left: 28, borderBottom: 1, borderLeft: 1 },
        { bottom: 28, right: 28, borderBottom: 1, borderRight: 1 },
      ].map((s, i) => (
        <div key={i} style={{
          position:          'absolute',
          width: 22, height: 22,
          borderColor:       'rgba(196,163,90,0.25)',
          borderStyle:       'solid',
          borderTopWidth:    s.borderTop    ?? 0,
          borderLeftWidth:   s.borderLeft   ?? 0,
          borderRightWidth:  s.borderRight  ?? 0,
          borderBottomWidth: s.borderBottom ?? 0,
          opacity:           bgOpacity * 0.8,
          ...s,
          pointerEvents: 'none',
          zIndex:         3,
          transition:    'opacity 0.05s linear',
        }} />
      ))}

      {/* ── INVITATION TEXT (above rectangle) ───────────── */}
      <div style={{
        position:      'absolute',
        top:           `calc(50% - ${h / 2}px - 3.2rem)`,
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:         4,
        display:       'flex',
        alignItems:    'center',
        gap:           '0.8rem',
        opacity:       scrollHintOp,
        pointerEvents: 'none',
        whiteSpace:    'nowrap',
        transition:    'none',
      }}>
        <div style={{ width: '20px', height: '1px', background: 'rgba(196,163,90,0.35)' }} />
        <span style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.48rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.5)',
        }}>
          Descubra el Atelier
        </span>
        <div style={{ width: '20px', height: '1px', background: 'rgba(196,163,90,0.35)' }} />
      </div>

      {/* ── VIDEO RECTANGLE (expands to full-screen) ─────── */}
      <div style={{
        position:   'relative',
        width:      `${w}px`,
        height:     `${h}px`,
        maxWidth:   '100vw',
        maxHeight:  '100vh',
        zIndex:      1,
        flexShrink:  0,
        border:     `1px solid rgba(196,163,90,${borderOpacity})`,
        overflow:   'hidden',
        transition: 'none',
      }}>
        {/* Video — behind everything */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position:  'absolute',
            inset:      0,
            width:     '100%',
            height:    '100%',
            objectFit: 'cover',
            filter:    'brightness(0.65) saturate(0.6)',
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay — fades out as video expands */}
        <div style={{
          position:      'absolute',
          inset:          0,
          background:    `rgba(5,12,20,${overlayOpacity})`,
          zIndex:         1,
          pointerEvents: 'none',
          transition:    'none',
        }} />

        {/* ── LEFT CURTAIN ──────────────────────────────── */}
        <div style={{
          position:   'absolute',
          left:        0,
          top:         0,
          width:      '50%',
          height:     '100%',
          overflow:   'hidden',
          transform:  `translateX(${-curtainProgress * 100}%)`,
          zIndex:      4,
          transition: 'none',
        }}>
          {/* Inner panel = full rectangle width, content centered */}
          <div style={{
            position:       'absolute',
            left:            0,
            top:             0,
            width:          '200%',
            height:         '100%',
            background:     '#050C14',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <IdentityCard />
          </div>
        </div>

        {/* ── RIGHT CURTAIN ─────────────────────────────── */}
        <div style={{
          position:   'absolute',
          right:       0,
          top:         0,
          width:      '50%',
          height:     '100%',
          overflow:   'hidden',
          transform:  `translateX(${curtainProgress * 100}%)`,
          zIndex:      4,
          transition: 'none',
        }}>
          {/* Inner panel = full rectangle width, content centered */}
          <div style={{
            position:       'absolute',
            right:           0,
            top:             0,
            width:          '200%',
            height:         '100%',
            background:     '#050C14',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <IdentityCard />
          </div>
        </div>

      </div>

      {/* ── SCROLL HINT (below rectangle) ────────────────── */}
      <div style={{
        position:      'absolute',
        bottom:        `calc(50% - ${h / 2}px - 5rem)`,
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:         4,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '0.6rem',
        opacity:        scrollHintOp,
        pointerEvents: 'none',
        transition:    'none',
      }}>
        <span style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      '0.52rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color:         'rgba(196,163,90,0.5)',
        }}>
          Scroll
        </span>
        <ScrollPulse />
      </div>

      {/* ── BOTTOM-LEFT TEXT (GSAP animates in after expand) */}
      <div
        ref={textRef}
        style={{
          position:      'absolute',
          bottom:        'clamp(2rem, 5vh, 4rem)',
          left:          'clamp(2rem, 4vw, 4.5rem)',
          zIndex:         5,
          display:       'flex',
          flexDirection: 'row',
          alignItems:    'flex-end',
          gap:           '1.4rem',
          maxWidth:      'min(480px, 85vw)',
          opacity:        textBlockOp,
          pointerEvents: fullyExpanded ? 'auto' : 'none',
        }}
      >
        {/* Gold vertical bar */}
        <div ref={barRef} style={{
          flexShrink:   0,
          width:        '1px',
          height:       'clamp(80px, 14vh, 130px)',
          background:   'linear-gradient(to bottom, transparent, var(--color-gold) 30%, var(--color-gold))',
          alignSelf:    'stretch',
          marginBottom: '0.1rem',
        }} />

        {/* Text content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="te" style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.6rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'var(--color-gold)',
            opacity:        0.8,
          }}>
            Sastrería · Madrid
          </div>

          <div>
            <div className="te" style={{
              fontFamily:    'var(--font-serif)',
              fontSize:      'clamp(2.2rem, 4.4vw, 3.4rem)',
              fontWeight:     400,
              lineHeight:     1.15,
              letterSpacing: '-0.01em',
              color:         'var(--color-offwhite)',
            }}>
              {t.hero.tagline}
            </div>
            <div className="te" style={{
              fontFamily:    'var(--font-serif)',
              fontSize:      'clamp(2.2rem, 4.4vw, 3.4rem)',
              fontWeight:     400,
              lineHeight:     1.15,
              letterSpacing: '-0.01em',
              color:         'var(--color-gold-light)',
              fontStyle:     'italic',
            }}>
              {t.hero.tagline2}
            </div>
          </div>

          <div className="te" style={{
            width:      '32px',
            height:     '1px',
            background: 'rgba(196,163,90,0.5)',
          }} />

          <div className="te" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/reservar" style={{
              fontFamily:     'var(--font-sans)',
              fontSize:       '0.65rem',
              letterSpacing:  '0.18em',
              textTransform:  'uppercase',
              color:          'var(--color-gold)',
              borderBottom:   '1px solid rgba(196,163,90,0.45)',
              paddingBottom:  '3px',
              transition:     'color .25s, border-color .25s',
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
              fontFamily:     'var(--font-sans)',
              fontSize:       '0.65rem',
              letterSpacing:  '0.18em',
              textTransform:  'uppercase',
              color:          'rgba(245,240,234,0.45)',
              transition:     'color .25s',
              textDecoration: 'none',
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

    </section>
  )
}
