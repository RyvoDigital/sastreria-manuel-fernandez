'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function TrajeEmpiezaSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const text = textRef.current
    if (!section || !image || !text) return

    const ctx = gsap.context(() => {
      // Image reveal from left
      gsap.fromTo(
        image,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Text reveal from right
      gsap.fromTo(
        text.querySelectorAll('.reveal-item'),
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Parallax on image
      gsap.to(image.querySelector('.parallax-img'), {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-offwhite)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '90vh',
        overflow: 'hidden',
      }}
    >
      {/* Image side */}
      <div
        ref={imageRef}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div
          className="parallax-img"
          style={{
            position: 'absolute',
            inset: '-10%',
            backgroundImage: `url('/photos/camel-jacket-form.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
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
          padding: 'clamp(4rem, 8vw, 8rem) clamp(3rem, 6vw, 6rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--color-offwhite)',
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
          className="reveal-item"
          style={{
            width: '40px',
            height: '1px',
            background: 'var(--color-gold)',
            marginBottom: '2rem',
          }}
        />

        {/* Title */}
        <h2
          className="reveal-item text-headline"
          style={{ color: 'var(--color-black)', marginBottom: '2rem' }}
        >
          {t.traje_empieza.title}
        </h2>

        {/* Body */}
        <p
          className="reveal-item text-body"
          style={{
            color: 'rgba(8,8,8,0.6)',
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
            color: 'rgba(196,163,90,0.12)',
            userSelect: 'none',
            fontStyle: 'italic',
          }}
        >
          "
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          section[data-section="traje"] {
            grid-template-columns: 1fr;
          }
          section[data-section="traje"] > div:first-child {
            min-height: 50vh;
          }
        }
      `}</style>
    </section>
  )
}
