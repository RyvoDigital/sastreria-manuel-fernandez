'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function LoadingScreen() {
  const screenRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const screen = screenRef.current
    const logo = logoRef.current
    const name = nameRef.current
    if (!screen || !logo || !name) return

    gsap.set(logo, { opacity: 0, scale: 0.9 })
    gsap.set(name, { opacity: 0, y: 10 })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(screen, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => setHidden(true),
        })
      },
    })

    tl.to(logo, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
      .to(name, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2')
      .to({}, { duration: 1.2 }) // Hold
  }, [])

  if (hidden) return null

  return (
    <div
      ref={screenRef}
      id="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <img
        ref={logoRef}
        src="/logo.png"
        alt="Sastrería Manuel Fernández"
        style={{
          width: '80px',
          height: 'auto',
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
