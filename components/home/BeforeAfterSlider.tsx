'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { MoveHorizontal } from 'lucide-react'

export function BeforeAfterSlider() {
  const { t } = useI18n()
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const xPercent = useMotionValue(50)
  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.01 }
  const smoothX = useSpring(xPercent, springConfig)

  /* Pre-compute the clipPath transform so it's not recreated every render */
  const clipPathValue = useTransform(smoothX, (v: number) => `inset(0 ${100 - v}% 0 0)`)
  const leftPercent = useTransform(smoothX, (v: number) => `${v}%`)

  const lastInteractTime = useRef(Date.now())

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    xPercent.set(percentage)
    lastInteractTime.current = Date.now()
  }, [xPercent])

  const handleMouseDown = useCallback(() => setIsDragging(true), [])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  /* Global mouse + touch handlers */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault()
        handleMove(e.touches[0].clientX)
      }
    }
    const onEnd = () => setIsDragging(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [isDragging, handleMove])

  /* Auto-sliding effect when idle */
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastInteractTime.current
      if (idleTime > 5000 && !isDragging) {
        const time = Date.now() / 2000
        const autoPos = 50 + Math.sin(time) * 15
        xPercent.set(autoPos)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isDragging, xPercent])

  return (
    <section style={{
      background: '#0A1628',
      padding: 'clamp(5rem, 10vw, 8rem) var(--container-padding)',
      position: 'relative',
    }}>
      {/* Top gold line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
      }} />

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(3rem, 6vw, 4rem)',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
          }}>
            {t.before_after.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: '0 0 0.5rem 0',
          }}>
            {t.before_after.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {t.before_after.subtitle}
          </p>
        </div>

        {/* Slider Container */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            height: 'clamp(400px, 60vh, 600px)',
            cursor: isDragging ? 'grabbing' : 'grab',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(201,168,76,0.2)',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            handleMouseDown()
            if (e.touches[0]) handleMove(e.touches[0].clientX)
          }}
        >
          {/* Background Images */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* After Image (Right side) */}
            <img
              src="https://res.cloudinary.com/dwruvre6o/image/upload/v1777930487/photos/IMG_1254_maeygo.jpg"
              alt="After fitting"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>

          {/* Before Image with Clipping (Left side) */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              overflow: 'hidden',
              clipPath: clipPathValue,
              willChange: 'clip-path',
            }}
          >
            <img
              src="https://res.cloudinary.com/dwruvre6o/image/upload/v1777930484/photos/25ED7BDA-ADA8-4DC8-9F11-D47C9C4173E0_iek31k.png"
              alt="Before fitting"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </motion.div>

          {/* Before Label */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(0,0,0,0.6)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            {t.before_after.before}
          </div>

          {/* After Label */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(201,168,76,0.8)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#000000',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            {t.before_after.after}
          </div>

          {/* Slider Line */}
          <motion.div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: leftPercent,
            width: '2px',
            background: '#C9A84C',
            x: '-50%',
            zIndex: 3,
            boxShadow: '0 0 15px rgba(201,168,76,0.6)',
            pointerEvents: 'none',
            willChange: 'left',
          }}>
            {/* Slider Handle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#C9A84C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown()
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
              handleMouseDown()
              if (e.touches[0]) handleMove(e.touches[0].clientX)
            }}
            >
              <MoveHorizontal size={20} color="#000000" />
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {t.before_after.instruction}
        </p>
      </div>
    </section>
  )
}
