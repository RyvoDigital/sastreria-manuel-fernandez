'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const CARD_IMAGES = [
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797462/cGhvdG9zL2ZhYnJpYy1zZWxlY3Rpb25fc3RrYmNm',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797423/cGhvdG9zL2N1dHRpbmctdHdlZWRfc2drZmlm',
  'https://res.cloudinary.com/dwruvre6o/image/upload/v1776797435/cGhvdG9zL3dlZGRpbmctcm9tZV9xbHFjeHo=',
]

// Animated counter component
function AnimatedNumber({ value, isActive }: { value: string; isActive: boolean }) {
  const [displayValue, setDisplayValue] = useState('00')
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isActive) return
    
    const targetNum = parseInt(value)
    let currentNum = 0
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      currentNum = Math.floor(easeProgress * targetNum)
      
      setDisplayValue(currentNum.toString().padStart(2, '0'))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [isActive, value])

  return <span ref={numberRef}>{displayValue}</span>
}

interface CardProps {
  num: string
  title: string
  body: string
  image: string
  index: number
  isActive: boolean
}

function ProcessCard({ num, title, body, image, index, isActive }: CardProps) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!imageRef.current) return

    // Ken Burns effect - slow zoom and pan
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1, x: 0 },
        {
          scale: 1.15,
          x: '5%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )

      // Exit animation: fade and shrink as the next card comes up
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!textRef.current || !isActive) return

    // Text reveal animation when card becomes active
    const lines = textRef.current.querySelectorAll('.reveal-line')
    gsap.fromTo(
      lines,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      }
    )
  }, [isActive])

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        zIndex: index + 1,
        overflow: 'hidden',
      }}
    >
      {/* Background image with Ken Burns - Lightened for better clarity */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          ref={imageRef}
          style={{
            position: 'absolute',
            inset: '-10%',
            width: '120%',
            height: '120%',
          }}
        >
          <Image
            src={image}
            alt={title}
            fill
            style={{
              objectFit: 'cover',
              filter: 'brightness(0.6) saturate(0.8)',
            }}
          />
        </div>
      </div>

      {/* Dark overlay with gradient - Reduced opacity */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.5) 100%)',
      }} />

      {/* Animated number watermark */}
      <div style={{
        position: 'absolute',
        bottom: '-0.05em',
        right: '-0.02em',
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(14rem, 28vw, 30rem)',
        lineHeight: 1,
        fontWeight: 400,
        letterSpacing: '-0.04em',
        color: 'rgba(201,168,76,0.08)',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        <AnimatedNumber value={num} isActive={isActive} />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
      >
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: 'min(600px, 85vw)',
          }}
        >
        {/* Step label */}
        <div className="reveal-line" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: '1.4rem',
          opacity: 0.8,
        }}>
          {t.proceso.step_label} <AnimatedNumber value={num} isActive={isActive} />
        </div>

        {/* Gold rule */}
        <div className="reveal-line" style={{
          width: '40px',
          height: '1px',
          background: 'rgba(196,163,90,0.4)',
          marginBottom: '2rem',
        }} />

        {/* Title with split animation */}
        <h2 className="reveal-line" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(3rem, 6vw, 5.5rem)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          fontStyle: 'italic',
          marginBottom: '2rem',
        }}>
          {title}
        </h2>

        {/* Body text */}
        <p className="reveal-line" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
          fontWeight: 300,
          lineHeight: 1.9,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '450px',
        }}>
          {body}
        </p>

        {/* Step indicator dots */}
        <div className="reveal-line" style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '3rem',
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                width: step === parseInt(num) ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: step === parseInt(num) ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                transition: 'all 0.5s ease',
              }}
            />
          ))}
        </div>
      </div>
      </div>

      {/* Bottom edge gold accent */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
        zIndex: 2,
      }} />

      {/* Step counter */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        right: 'clamp(2rem, 4vw, 4rem)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.52rem',
        letterSpacing: '0.25em',
        color: 'rgba(201,168,76,0.5)',
        zIndex: 3,
        textTransform: 'uppercase',
      }}>
        <AnimatedNumber value={num} isActive={isActive} /> / 03
      </div>

      {/* Progress bar at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        background: '#C9A84C',
        width: `${(parseInt(num) / 3) * 100}%`,
        zIndex: 4,
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

export function ProcessCardsEnhanced() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  const steps = [
    { num: t.proceso.step1_num, title: t.proceso.step1_title, body: t.proceso.step1_body },
    { num: t.proceso.step2_num, title: t.proceso.step2_title, body: t.proceso.step2_body },
    { num: t.proceso.step3_num, title: t.proceso.step3_title, body: t.proceso.step3_body },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Track which card is currently sticky
      steps.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: sectionRef.current?.children[index] as Element,
          start: 'top top',
          end: 'bottom top',
          onEnter: () => setActiveCard(index),
          onEnterBack: () => setActiveCard(index),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#0A1628' }}>
      {steps.map((step, i) => (
        <ProcessCard
          key={i}
          num={step.num}
          title={step.title}
          body={step.body}
          image={CARD_IMAGES[i]}
          index={i}
          isActive={activeCard === i}
        />
      ))}
    </section>
  )
}
