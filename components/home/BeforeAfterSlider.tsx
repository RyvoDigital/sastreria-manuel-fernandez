'use client'

import { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { MoveHorizontal } from 'lucide-react'

export function BeforeAfterSlider() {
  const { locale } = useI18n()
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const t = {
    es: {
      label: 'Antes y Después',
      title: 'La diferencia de un traje a medida',
      subtitle: 'Desliza para ver la transformación',
      before: 'Antes',
      after: 'Después',
      placeholder: 'Imágenes pendientes del cliente',
    },
    en: {
      label: 'Before & After',
      title: 'The difference of a bespoke suit',
      subtitle: 'Drag to see the transformation',
      before: 'Before',
      after: 'After',
      placeholder: 'Images pending from client',
    },
  }

  const currentT = t[locale as 'es' | 'en'] || t.es

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

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
            {currentT.label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#FFFFFF',
            margin: '0 0 0.5rem 0',
          }}>
            {currentT.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {currentT.subtitle}
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
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {/* Placeholder message */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              border: '2px dashed rgba(201,168,76,0.3)',
            }}>
              <MoveHorizontal size={48} color="rgba(201,168,76,0.5)" style={{ marginBottom: '1rem' }} />
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.4)',
                margin: 0,
              }}>
                {currentT.placeholder}
              </p>
            </div>
          </div>

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
          }}>
            {currentT.before}
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
          }}>
            {currentT.after}
          </div>

          {/* Slider Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '2px',
            background: '#C9A84C',
            transform: 'translateX(-50%)',
            zIndex: 3,
            boxShadow: '0 0 10px rgba(201,168,76,0.5)',
          }}>
            {/* Slider Handle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#C9A84C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              <MoveHorizontal size={20} color="#000000" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {locale === 'es' ? 'Arrastra el control deslizante para comparar' : 'Drag the slider to compare'}
        </p>
      </div>
    </section>
  )
}
