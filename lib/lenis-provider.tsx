'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

    const lenis = new Lenis({
      duration: isMobile ? 0.6 : 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: isMobile,
      touchMultiplier: isMobile ? 0.8 : 1,
      lerp: isMobile ? 0.05 : 0.1,
    })

    // Make lenis available globally for GSAP ScrollTrigger integration
    ;(window as unknown as Record<string, unknown>).lenis = lenis

    // Sync Lenis with GSAP ScrollTrigger instead of raw RAF loop
    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerFn)
      gsap.ticker.lagSmoothing(500, 33) // restore defaults
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
