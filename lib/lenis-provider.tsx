'use client'

import { useEffect, type ReactNode } from 'react'

/*
 * One scroll clock for the whole site. With a mouse or trackpad Lenis smooths
 * the wheel and is driven by GSAP's ticker, and every Lenis scroll updates
 * ScrollTrigger, so scrubbed animations and pins read the same position Lenis
 * paints. Touch screens (phones and tablets, including iPads wider than
 * 768px) keep native scrolling, which Lenis would fight on iOS, and so do
 * visitors who ask for reduced motion; ScrollTrigger reads it directly.
 * Lenis and GSAP are imported on demand, so a page that needs neither (legal,
 * 404) never downloads them on those devices. ScrollTrigger's own settings
 * live in lib/scroll-scene.ts and lib/gsap-setup.ts, where pages load it.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const skip =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

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

      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.off('scroll', ScrollTrigger.update)
        lenis.destroy()
        delete (window as unknown as Record<string, unknown>).lenis
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
