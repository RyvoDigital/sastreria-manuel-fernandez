'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function LoadingScreen() {
  const screenRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathMRef = useRef<SVGPathElement>(null)
  const pathFRef = useRef<SVGPathElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const screen = screenRef.current
    const pathM = pathMRef.current
    const pathF = pathFRef.current
    const name = nameRef.current
    if (!screen || !pathM || !pathF || !name) return

    // Get total lengths for stroke animation
    const mLen = pathM.getTotalLength()
    const fLen = pathF.getTotalLength()

    gsap.set(pathM, { strokeDasharray: mLen, strokeDashoffset: mLen })
    gsap.set(pathF, { strokeDasharray: fLen, strokeDashoffset: fLen })
    gsap.set(name, { opacity: 0, y: 10 })

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the loading screen
        gsap.to(screen, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => setHidden(true),
        })
      },
    })

    tl.to(pathM, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power3.inOut',
    })
      .to(
        pathF,
        {
          strokeDashoffset: 0,
          duration: 0.7,
          ease: 'power3.inOut',
        },
        '-=0.3'
      )
      .to(name, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
      .to({}, { duration: 0.8 }) // Hold
  }, [])

  if (hidden) return null

  return (
    <div
      ref={screenRef}
      id="loading-screen"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
    >
      {/* Brand mark: SMF Logo */}
      <img
        src="/logo.png"
        alt="Sastrería Manuel Fernández"
        style={{
          width: '80px',
          height: 'auto',
          opacity: 0,
          animation: 'fadeIn 0.5s ease forwards 0.3s',
        }}
      />

      <div
        ref={nameRef}
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(196, 163, 90, 0.7)',
          fontWeight: 300,
        }}
      >
        Manuel Fernández
      </div>
    </div>
  )
}
