'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'
import { Phone, MapPin, Calendar } from 'lucide-react'

export function HeroNew() {
  const { t } = useI18n()
  const heroRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Wait for loading screen to finish
    const timer = setTimeout(() => {
      setIsLoaded(true)
      
      // Animate in text elements
      if (textRef.current) {
        const elements = textRef.current.querySelectorAll('.animate-in')
        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.15, 
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
      }}
    >
      {/* Full-screen background video/image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}>
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
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.6) 100%)',
          zIndex: 1,
        }} />
      </div>

      {/* Hero content */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '900px',
          padding: '0 var(--container-padding)',
        }}
      >
        {/* Label */}
        <div 
          className="animate-in"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1.5rem',
            opacity: isLoaded ? 1 : 0,
          }}
        >
          Sastrería Artesanal · Desde 1978
        </div>

        {/* Main headline */}
        <h1 style={{ margin: 0 }}>
          <div 
            className="animate-in"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              marginBottom: '0.5rem',
              opacity: isLoaded ? 1 : 0,
            }}
          >
            {t.hero.tagline}
          </div>
          <div 
            className="animate-in"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              fontStyle: 'italic',
              color: '#C9A84C',
              opacity: isLoaded ? 1 : 0,
            }}
          >
            {t.hero.tagline2}
          </div>
        </h1>

        {/* Gold line */}
        <div 
          className="animate-in"
          style={{
            width: '60px',
            height: '2px',
            background: '#C9A84C',
            margin: '2rem auto',
            opacity: isLoaded ? 1 : 0,
          }}
        />

        {/* Subtext */}
        <p 
          className="animate-in"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: 300,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '3rem',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: isLoaded ? 1 : 0,
          }}
        >
          {t.hero.subtext}
        </p>

        {/* CTA Buttons - Immediately visible */}
        <div 
          className="animate-in"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isLoaded ? 1 : 0,
          }}
        >
          {/* Book Appointment */}
          <Link
            href="/contacto"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: '#C9A84C',
              color: '#000000',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E8D5A3'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#C9A84C'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Calendar size={16} />
            {t.hero.cta_book}
          </Link>

          {/* Call Us */}
          <a
            href="tel:+34000000000"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid #FFFFFF',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = '#C9A84C'
              e.currentTarget.style.color = '#C9A84C'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#FFFFFF'
              e.currentTarget.style.color = '#FFFFFF'
            }}
          >
            <Phone size={16} />
            {t.hero.cta_call}
          </a>

          {/* Contact */}
          <Link
            href="/contacto"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#C9A84C',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid #C9A84C',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C9A84C'
              e.currentTarget.style.color = '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#C9A84C'
            }}
          >
            <MapPin size={16} />
            {t.hero.cta_contact}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
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
          opacity: isLoaded ? 0.6 : 0,
          transition: 'opacity 1s ease 1s',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9A84C',
        }}>
          Descubrir
        </span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, #C9A84C, transparent)',
        }} />
      </div>
    </section>
  )
}
