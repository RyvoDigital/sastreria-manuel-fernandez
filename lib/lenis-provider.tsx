'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
 * One scroll clock for the whole site. On desktop Lenis smooths the wheel and
 * is driven by GSAP's ticker, and every Lenis scroll updates ScrollTrigger, so
 * scrubbed animations and pins read the same position Lenis paints. Touch
 * screens keep native scrolling (smoother on iOS); ScrollTrigger reads it
 * directly. ignoreMobileResize stops the iOS address bar from re-measuring.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      autoRaf: false,
    })

    ;(window as unknown as Record<string, unknown>).lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
