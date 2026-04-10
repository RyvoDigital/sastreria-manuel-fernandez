'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function BodasProceso() {
  const { t } = useI18n()
  const c = t.bodas.proceso
  const sectionRef = useRef<HTMLElement>(null)

  const steps = [
    { num: c.step1_num, title: c.step1_title, body: c.step1_body },
    { num: c.step2_num, title: c.step2_title, body: c.step2_body },
    { num: c.step3_num, title: c.step3_title, body: c.step3_body },
    { num: c.step4_num, title: c.step4_title, body: c.step4_body },
  ]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('.mf-bodas-step', {
        y: 40, opacity: 0, duration: 0.85, ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A1628',
        padding: 'clamp(5rem, 10vh, 9rem) var(--container-padding)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto clamp(4rem, 8vh, 6rem)',
      }}>
        {/* Gold sweep line */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          viewport={{ once: true }}
          style={{
            height: '1px',
            background: 'linear-gradient(to right, #C9A84C, rgba(201,168,76,0.15))',
            marginBottom: '2rem',
            opacity: 0.45,
          }}
        />

        {/* Label */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.55rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.65)',
            marginBottom: '1rem',
          }}
        >
          {c.label}
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ y: 28, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.55 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.15,
          }}
        >
          {c.title}
        </motion.h2>
      </div>

      {/* Steps */}
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Horizontal connector line */}
        <div style={{
          position: 'absolute',
          top: '1.75rem',
          left: '12.5%',
          right: '12.5%',
          height: '1px',
          background: 'rgba(201,168,76,0.2)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(1.5rem, 3vw, 3rem)',
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="mf-bodas-step"
              style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
            >
              {/* Number circle */}
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                background: 'rgba(201,168,76,0.08)',
                position: 'relative',
                zIndex: 1,
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: '#C9A84C',
                }}>
                  {step.num}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.25,
                marginBottom: '0.75rem',
              }}>
                {step.title}
              </h3>

              {/* Body */}
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.78rem, 0.95vw, 0.88rem)',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.55)',
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
