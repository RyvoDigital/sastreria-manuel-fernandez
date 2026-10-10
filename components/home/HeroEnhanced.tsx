'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'
import { useContent } from '@/lib/content-provider'
import { BOOKING_HREF } from '@/lib/booking'
import { useIsMobile } from '@/lib/use-mobile'
import { useIsIPhone } from '@/lib/use-iphone'
import { Phone, MapPin, Calendar } from 'lucide-react'

// Floating gold particles
function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
  }>>([])
  const animationRef = useRef<number>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles — reduced count for performance
    const particleCount = 12
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.1,
      opacity: Math.random() * 0.4 + 0.2,
    }))

    // Pause when off-screen
    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(canvas)

    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Simple arc draw — much faster than radial gradients
        ctx.globalAlpha = particle.opacity
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = '#C9A84C'
        ctx.fill()
      })
      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      observer.disconnect()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}

// Animated gold line that draws itself
function AnimatedGoldLine({ isVisible }: { isVisible: boolean }) {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible || !lineRef.current) return
    
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: 'center' },
      { scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 }
    )
  }, [isVisible])

  return (
    <div
      ref={lineRef}
      style={{
        width: '80px',
        height: '1px',
        background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
        margin: '2rem auto',
      }}
    />
  )
}

export function HeroEnhanced() {
  const { t } = useI18n()
  const { getValue } = useContent()
  const isMobile = useIsMobile()
  const isIPhone = useIsIPhone()
  const heroRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroTitle = getValue('hero.title') || t.hero.tagline
  const heroSubtitle = getValue('hero.subtitle') || t.hero.tagline2

  // Mouse parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20
    const y = (e.clientY / window.innerHeight - 0.5) * 20
    setMousePosition({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    if (isIPhone || !heroRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      // Fade and shrink on scroll
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [isIPhone])

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
        background: '#0A1628',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
      }}
    >
      {/* Video background with parallax */}
      <div 
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 0,
          transform: isIPhone ? 'scale(1.1)' : `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`,
          transition: isIPhone ? undefined : 'transform 0.3s ease-out',
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/img/hero-manuel-fernandez-corte-patron.webp"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5) saturate(0.7)',
          }}
        >
          {/*
            Self-hosted. This used to load from res.cloudinary.com/dpljev9ap, a
            separate Cloudinary account from the images one, which is why the
            self-hosting migration missed it. That account is disabled and the
            URL returns 401, so the video silently fell back to its poster and
            the hero looked frozen. There is no CDN left to fall back to, so the
            file is version-controlled: 1920x1080 H.264, no audio, faststart,
            re-encoded from the 73.8 MB original down to 3.3 MB. It plays muted
            and dimmed behind the hero text, which is why that holds up.
          */}
          {/*
            Portrait phones only ever show a centre strip about 500px wide of
            the 1920px frame (cover crop, measured up to 555px at 360x640). This
            is that strip, 640x1080 from the same file at the same height, so
            the visible pixels match: 1.4 MB instead of 3.4 MB (x264 crf 27,
            SSIM 0.991 against the same crop of the original).
          */}
          <source src="/video/hero-sastreria-manuel-fernandez-portrait.mp4" type="video/mp4" media="(max-aspect-ratio: 9/16)" />
          <source src="/video/hero-sastreria-manuel-fernandez.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Subtle bottom gradient only */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, rgba(10,22,40,0.8) 0%, transparent 100%)',
        zIndex: 1,
      }} />

      {/* Gold particles — disabled on iPhone (Canvas RAF loop crashes iOS WebKit) */}
      {!isIPhone && <GoldParticles />}


      {/* Hero content - repositioned to bottom layout */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          bottom: '10vh',
          left: 0,
          right: 0,
          zIndex: 3,
          padding: '0 var(--container-padding)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: isMobile ? 'flex-end' : 'space-between',
          transform: isIPhone ? undefined : `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
          transition: isIPhone ? undefined : 'transform 0.3s ease-out',
          transformStyle: isIPhone ? undefined : 'preserve-3d',
        }}
      >
        {/* Left Side: Text Content */}
        <div style={{ textAlign: 'left', maxWidth: '600px', marginBottom: isMobile ? '1.5rem' : 0 }}>
          {/* Label with character animation */}
          <div 
            className="animate-in"
            data-i={0}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '1rem',
              opacity: 0,
            }}
          >
            {t.hero.since.split('').map((char, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  animation: `fadeInUp 0.6s ease forwards ${0.6 + i * 0.03}s`,
                  opacity: 0,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Main headline with split text */}
          <h1 style={{ margin: 0, perspective: '500px' }}>
            {/*
              SEO descriptor. Leads the H1 text content so the heading says what
              the business is, while the brand tagline below stays the dominant
              visual element. Reuses the type treatment of the t.hero.since
              eyebrow above rather than introducing a new one.

              MUST keep className="animate-in" and data-i: the CSS entrance
              at the bottom selects .animate-in[data-i] and animates it from
              opacity 0 to 1. An element with the inline opacity: 0 below but
              without them would never be animated and would stay invisible.
            */}
            <div
              className="animate-in"
              data-i={1}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                lineHeight: 1.5,
                color: '#C9A84C',
                marginBottom: '0.75rem',
                opacity: 0,
              }}
            >
              {t.hero.seo_heading}
            </div>
            <div 
              className="animate-in"
              data-i={2}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                opacity: 0,
                transformStyle: 'preserve-3d',
              }}
            >
              {heroTitle}
            </div>
            <div 
              className="animate-in"
              data-i={3}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                fontStyle: 'italic',
                color: '#C9A84C',
                opacity: 0,
              }}
            >
              {heroSubtitle}
            </div>
          </h1>

          {/* Subtext */}
          <p 
            className="animate-in"
            data-i={4}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
              marginTop: '1.5rem',
              maxWidth: '500px',
              opacity: 0,
            }}
          >
            {t.hero.subtext}
          </p>
        </div>

        {/* Right Side: CTA Buttons */}
        <div 
          className="animate-in"
          data-i={5}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            opacity: 0,
            paddingBottom: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <MagneticButton href={BOOKING_HREF} primary>
              <Calendar size={16} />
              {t.hero.cta_book}
            </MagneticButton>

            <MagneticButton
              href="tel:+34682192944"
              track="phone_click:hero"
            >
              <Phone size={16} />
              {t.hero.cta_call}
            </MagneticButton>
          </div>

          <MagneticButton href="/contacto" outline>
            <MapPin size={16} />
            {t.hero.cta_contact}
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator with bounce */}
      <div 
        className="animate-in"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0,
          animation: 'fadeIn 1s ease forwards 1.6s, bounce 2s ease-in-out infinite 2.1s',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9A84C',
        }}>
          {t.hero.discover}
        </span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, #C9A84C, transparent)',
        }} />
      </div>

      <style jsx>{`
        /* The entrance GSAP used to run once the page had hydrated (a 100ms
           timer, then 0.3s delay, 1.2s, power3.out, 0.12s stagger, from 60px
           down, rotateX 15deg). Same values in CSS, timed from first paint, so
           the hero text no longer waits for JavaScript on a slow phone and is
           readable without it. Animations override the inline opacity: 0. */
        .animate-in[data-i] {
          animation: heroIn 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) both;
        }
        .animate-in[data-i='0'] { animation-delay: 0.40s; }
        .animate-in[data-i='1'] { animation-delay: 0.52s; }
        .animate-in[data-i='2'] { animation-delay: 0.64s; }
        .animate-in[data-i='3'] { animation-delay: 0.76s; }
        .animate-in[data-i='4'] { animation-delay: 0.88s; }
        .animate-in[data-i='5'] { animation-delay: 1.00s; }
        @keyframes heroIn {
          from { opacity: 0; transform: translate(0, 60px) rotateX(15deg); }
          to { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.6; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
      `}</style>
    </section>
  )
}

// Hero CTA button — color change only, no movement
function MagneticButton({ 
  href, 
  children, 
  primary = false,
  outline = false,
  track,
}: { 
  href: string
  children: React.ReactNode
  primary?: boolean
  outline?: boolean
  /** "event:location" for the early tap listener in app/layout.tsx. */
  track?: string
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
  }

  const primaryStyles = primary ? {
    background: '#C9A84C',
    color: '#000000',
    border: '1px solid #C9A84C',
  } : outline ? {
    background: 'transparent',
    color: '#C9A84C',
    border: '1px solid #C9A84C',
  } : {
    background: 'transparent',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
  }

  return (
    <Link
      href={href}
      data-track={track}
      style={{ ...baseStyles, ...primaryStyles }}
      onMouseEnter={(e) => {
        if (primary) e.currentTarget.style.background = '#E8D5A3'
        if (outline) {
          e.currentTarget.style.background = '#C9A84C'
          e.currentTarget.style.color = '#000'
        }
        if (!primary && !outline) {
          e.currentTarget.style.borderColor = '#C9A84C'
          e.currentTarget.style.color = '#C9A84C'
        }
      }}
      onMouseLeave={(e) => {
        if (primary) e.currentTarget.style.background = '#C9A84C'
        if (outline) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#C9A84C'
        }
        if (!primary && !outline) {
          e.currentTarget.style.borderColor = '#FFFFFF'
          e.currentTarget.style.color = '#FFFFFF'
        }
      }}
    >
      {children}
    </Link>
  )
}
