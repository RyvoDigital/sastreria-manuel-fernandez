'use client'

import { useLayoutEffect, useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText)

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
const TOUCH = '(pointer: coarse)'

/** Resolves when the global LoadingScreen has gone (or immediately if absent). */
function whenLoaderGone(cb: () => void) {
  const gone = () => {
    const l = document.getElementById('loading-screen')
    return !l || l.style.display === 'none' || Number(getComputedStyle(l).opacity) < 0.05
  }
  if (gone()) return cb()
  const id = window.setInterval(() => {
    if (gone()) { window.clearInterval(id); cb() }
  }, 80)
  return () => window.clearInterval(id)
}

/*
 * Declarative scroll motion. Markup opts in with data attributes, so the
 * server HTML is the finished, visible page; motion only adds a from-state
 * once JS runs and the user has not asked for reduced motion.
 *
 *   data-reveal="lines"   line-by-line masked rise (SplitText)
 *   data-reveal="words"   word-by-word fade and rise
 *   data-reveal="fade"    single element fade and rise
 *   data-parallax="12"    yPercent drift inside its (overflow:hidden) frame
 *   data-zoom             scale 1.12 -> 1 while scrolling through
 *   data-cut="left|right" a cover panel that slides away (transform-only image reveal)
 *   data-hero             hero intro, played once the loading screen lifts
 */
export function useDirectionMotion(root: RefObject<HTMLElement | null>, deps: unknown[]) {
  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    let stopWaiting: void | (() => void)

    mm.add({ motion: MOTION_OK, touch: TOUCH }, (ctx) => {
      const { motion, touch } = ctx.conditions as { motion: boolean; touch: boolean }
      if (!motion) return

      // Hero: hide now (under the loader), play when the loader lifts.
      const hero = gsap.utils.toArray<HTMLElement>('[data-hero]', el)
      if (hero.length) {
        gsap.set(hero, { autoAlpha: 0, y: 28 })
        stopWaiting = whenLoaderGone(() => {
          gsap.to(hero, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.1 })
        })
      }

      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]', el).forEach((node) => {
        SplitText.create(node, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: node, start: 'top 88%', once: true },
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal="words"]', el).forEach((node) => {
        SplitText.create(node, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              autoAlpha: 0,
              y: '0.35em',
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.035,
              scrollTrigger: { trigger: node, start: 'top 85%', once: true },
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]', el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 32,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]', el).forEach((node) => {
        const amount = Number(node.dataset.parallax || 10) * (touch ? 0.5 : 1)
        gsap.fromTo(
          node,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: node.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-zoom]', el).forEach((node) => {
        gsap.fromTo(
          node,
          { scale: touch ? 1.06 : 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: node.parentElement, start: 'top bottom', end: 'center center', scrub: true },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-cut]', el).forEach((node) => {
        const fromLeft = node.dataset.cut !== 'right'
        gsap.set(node, { transformOrigin: fromLeft ? 'right center' : 'left center' })
        gsap.fromTo(
          node,
          { scaleX: 1 },
          {
            scaleX: 0,
            duration: 1.2,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: node.parentElement, start: 'top 82%', once: true },
          }
        )
      })
    })

    // Image heights settle after load; keep trigger positions honest.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const imgs = Array.from(el.querySelectorAll('img'))
    imgs.forEach((img) => !img.complete && img.addEventListener('load', refresh, { once: true }))

    return () => {
      if (typeof stopWaiting === 'function') stopWaiting()
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, deps)
}
