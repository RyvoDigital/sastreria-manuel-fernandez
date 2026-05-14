'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-setup'
import { useI18n } from '@/lib/i18n'
import { useIsMobile } from '@/lib/use-mobile'


export function TrajeEmpiezaSection() {
  const { t } = useI18n()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const text = textRef.current
    if (!section || !image || !text) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
        }
      })

      // 1. Curtain wipe reveal
      tl.to(curtainRef.current, {
        xPercent: 105,
        duration: 1.4,
        ease: 'power3.inOut'
      })

      // 2. Parallax zoom on image during reveal
      gsap.fromTo(image.querySelector('.parallax-img'), 
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom top',
            scrub: true,
          }
        }
      )

      // 3. Gold line drawing from center
      tl.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'center' },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.6"
      )

      // 4. Text reveal (simulated typewriter / fade-in)
      const items = text.querySelectorAll('.reveal-item')
      tl.fromTo(items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
        "-=0.4"
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-section="traje"
      style={{
        background: '#FFFFFF',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '45fr 55fr',
        minHeight: isMobile ? 'auto' : '90vh',
        overflow: 'hidden',
      }}
    >
      {/* Image side */}
      <div
        ref={imageRef}
        style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? '45vh' : 'auto', order: isMobile ? 1 : 0 }}
      >
        <div
          className="parallax-img"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://res.cloudinary.com/dwruvre6o/image/upload/v1778242094/photos/web_lista_images/home-the-result_l9d5tm')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* Cinematic Curtain */}
        <div
          ref={curtainRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#0A1628',
            zIndex: 2,
          }}
        />
        {/* Gold border accent */}
        <div
          style={{
            position: 'absolute',
            top: '3rem',
            right: 0,
            bottom: '3rem',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, var(--color-gold), transparent)',
          }}
        />
      </div>

      {/* Text side */}
      <div
        ref={textRef}
        style={{
          padding: isMobile ? 'clamp(2.5rem, 6vw, 4rem) var(--container-padding)' : 'clamp(4rem, 8vw, 8rem) clamp(3rem, 6vw, 6rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#FFFFFF',
          order: isMobile ? 2 : 0,
        }}
      >
        {/* Label */}
        <div
          className="reveal-item"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            marginBottom: '1.5rem',
          }}
        >
          {t.traje_empieza.label}
        </div>

        {/* Gold line */}
        <div
          ref={lineRef}
          className="reveal-item"
          style={{
            width: '80px',
            height: '1px',
            background: 'var(--color-gold)',
            marginBottom: '2rem',
          }}
        />

        {/* Title */}
        <h2
          className="reveal-item text-headline"
          style={{ color: '#0A1628', marginBottom: '2rem' }}
        >
          {t.traje_empieza.title}
        </h2>

        {/* Body */}
        <p
          className="reveal-item text-body"
          style={{
            color: 'rgba(10,22,40,0.7)',
            maxWidth: '480px',
            marginBottom: '3rem',
          }}
        >
          {t.traje_empieza.body}
        </p>

        {/* Decorative quote mark */}
        <div
          className="reveal-item"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '6rem',
            lineHeight: 0.8,
            color: 'rgba(201,168,76,0.15)',
            userSelect: 'none',
            fontStyle: 'italic',
          }}
        >
          "
        </div>
      </div>


    </section>
  )
}
