'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'
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

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const particleCount = 25
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.1, // Slight upward drift
      opacity: Math.random() * 0.5 + 0.2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(201, 168, 76, ${particle.opacity})`)
        gradient.addColorStop(0.5, `rgba(201, 168, 76, ${particle.opacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)')

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
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
  const isMobile = useIsMobile()
  const heroRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20
    const y = (e.clientY / window.innerHeight - 0.5) * 20
    setMousePosition({ x, y })
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    if (!heroRef.current || !textRef.current) return

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
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      
      if (textRef.current) {
        const elements = textRef.current.querySelectorAll('.animate-in')
        gsap.fromTo(
          elements,
          { y: 60, opacity: 0, rotateX: 15 },
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0,
            duration: 1.2, 
            stagger: 0.12, 
            ease: 'power3.out',
            delay: 0.3
          }
        )
      }
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

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
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5) saturate(0.7)',
          }}
        >
          <source 
            src="https://res.cloudinary.com/dpljev9ap/video/upload/v1774996821/hero-section-background-manuel-fernandez_1_dfbmep.mp4" 
            type="video/mp4" 
          />
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

      {/* Gold particles */}
      <GoldParticles />


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
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
          transition: 'transform 0.3s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Left Side: Text Content */}
        <div style={{ textAlign: 'left', maxWidth: '600px', marginBottom: isMobile ? '1.5rem' : 0 }}>
          {/* Label with character animation */}
          <div 
            className="animate-in"
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
                  animation: isLoaded ? `fadeInUp 0.6s ease forwards ${0.5 + i * 0.03}s` : 'none',
                  opacity: 0,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Main headline with split text */}
          <h1 style={{ margin: 0, perspective: '500px' }}>
            <div 
              className="animate-in"
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
              {t.hero.tagline}
            </div>
            <div 
              className="animate-in"
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
              {t.hero.tagline2}
            </div>
          </h1>

          {/* Subtext */}
          <p 
            className="animate-in"
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
            <MagneticButton href="/contacto" primary>
              <Calendar size={16} />
              {t.hero.cta_book}
            </MagneticButton>

            <MagneticButton href="tel:+34000000000">
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
          animation: isLoaded ? 'fadeIn 1s ease forwards 1.5s, bounce 2s ease-in-out infinite 2s' : 'none',
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

// Magnetic button component
function MagneticButton({ 
  href, 
  children, 
  primary = false,
  outline = false 
}: { 
  href: string
  children: React.ReactNode
  primary?: boolean
  outline?: boolean
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current
    if (!button) return
    
    const rect = button.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

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
    transform: `translate(${position.x}px, ${position.y}px)`,
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
      ref={buttonRef}
      href={href}
      style={{ ...baseStyles, ...primaryStyles }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `translate(${position.x}px, ${position.y}px) scale(1.05)`
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
    >
      {children}
    </Link>
  )
}
