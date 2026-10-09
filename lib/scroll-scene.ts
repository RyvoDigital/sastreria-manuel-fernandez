'use client'

import { useEffect, useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  touch: '(pointer: coarse)',
  wide: '(min-width: 900px)',
}

export type SceneEnv = {
  root: HTMLElement
  touch: boolean
  wide: boolean
  /** Viewport height in px, measured once per scene (svh-stable on iOS). */
  vh: number
  q: <T extends Element = HTMLElement>(sel: string, scope?: Element) => T[]
}

/*
 * The server HTML is the finished, static page: every chapter stacked, every
 * word at full colour, every list a list. A scene only runs when JS is on and
 * the reader has not asked for reduced motion. It marks the root
 * `data-staged`, which switches the CSS to the pinned/stacked layouts, and
 * builds the scrubbed timelines. Reverting (resize across a breakpoint,
 * reduced motion switched on, unmount) puts the static page back.
 */
export function useScene(root: RefObject<HTMLElement | null>, build: (env: SceneEnv) => void | (() => void), deps: unknown[]) {
  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ, (ctx) => {
      const { motion, touch, wide } = ctx.conditions as Record<keyof typeof MQ, boolean>
      if (!motion) return
      el.dataset.staged = ''
      const vh = window.innerHeight
      const undo = build({ root: el, touch, wide, vh, q: (sel, scope = el) => gsap.utils.toArray(scope.querySelectorAll(sel)) })
      const settle = () => ScrollTrigger.refresh()
      const imgs = Array.from(el.querySelectorAll('img')).filter((i) => !i.complete)
      imgs.forEach((i) => i.addEventListener('load', settle, { once: true }))
      requestAnimationFrame(settle)
      return () => {
        imgs.forEach((i) => i.removeEventListener('load', settle))
        if (typeof undo === 'function') undo()
        delete el.dataset.staged
      }
    })
    return () => mm.revert()
  }, deps)
}

/* ── Shared scrubbed behaviours ─────────────────────────────────────────── */

/**
 * Scroll-linked highlight. Words start at `from` opacity and fill to 1 as the
 * paragraph crosses the viewport; scrubbed, so it reverses on the way up.
 * Pass a timeline + position to drive it from a pinned stage instead.
 */
export function highlight(node: Element, opts: { from?: number; tl?: gsap.core.Timeline; at?: number; span?: number } = {}) {
  const words = node.querySelectorAll('.w')
  if (!words.length) return
  const from = opts.from ?? 0.22
  if (opts.tl) {
    opts.tl.fromTo(words, { opacity: from }, { opacity: 1, ease: 'none', stagger: { amount: opts.span ?? 1 }, duration: 0.02 }, opts.at ?? 0)
    return
  }
  gsap.fromTo(
    words,
    { opacity: from },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: node, start: 'top 82%', end: 'bottom 48%', scrub: true },
    }
  )
}

/**
 * Masked-frame parallax: the element (an oversized inner layer, see .depth in
 * CSS) travels against its clipping frame. `amount` is yPercent each way.
 */
export function depth(nodes: HTMLElement[], touch: boolean) {
  nodes.forEach((node) => {
    const amount = Number(node.dataset.depth || 8) * (touch ? 0.6 : 1)
    const scale = node.dataset.scale ? Number(node.dataset.scale) : 1
    gsap.fromTo(
      node,
      { yPercent: -amount, scale },
      {
        yPercent: amount,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: node.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    )
  })
}

/** Layers moving at different speeds: data-speed="0.2" travels 20% of the viewport faster than the page. */
export function speeds(nodes: HTMLElement[], vh: number, touch: boolean, trigger?: Element) {
  nodes.forEach((node) => {
    const s = Number(node.dataset.speed || 0) * (touch ? 0.55 : 1)
    gsap.fromTo(
      node,
      { y: s * vh * 0.5 },
      {
        y: -s * vh * 0.5,
        ease: 'none',
        scrollTrigger: { trigger: trigger ?? node, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    )
  })
}

/** A dashed thread that draws itself (scaleY) as it scrolls through. */
export function thread(nodes: HTMLElement[], opts: { start?: string; end?: string } = {}) {
  nodes.forEach((node) => {
    gsap.fromTo(
      node,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: node, start: opts.start ?? 'top 92%', end: opts.end ?? 'bottom 55%', scrub: true },
      }
    )
  })
}

/**
 * Continuous colour change between two chapters: both backgrounds move from
 * the outgoing colour to the incoming one together, so there is never a seam.
 */
export function blend(from: HTMLElement, to: HTMLElement, colors: { bgA: string; bgB: string; inkA?: string; inkB?: string }) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: to, start: 'top 95%', end: 'top 30%', scrub: true },
  })
  // Only the incoming chapter is painted up front; the outgoing one keeps its own
  // colour until the blend runs (a chapter can sit in two blends).
  tl.fromTo(from, { backgroundColor: colors.bgA }, { backgroundColor: colors.bgB, ease: 'none', immediateRender: false }, 0)
  tl.fromTo(to, { backgroundColor: colors.bgA }, { backgroundColor: colors.bgB, ease: 'none' }, 0)
  if (colors.inkA && colors.inkB) {
    tl.fromTo(from, { color: colors.inkA }, { color: colors.inkB, ease: 'none', immediateRender: false }, 0)
    tl.fromTo(to, { color: colors.inkA }, { color: colors.inkB, ease: 'none' }, 0)
  }
  return tl
}

/**
 * The next chapter rises over this one: during the section's last `cover`
 * stretch (its stage is still sticky) a shade darkens the stage beneath the
 * incoming layer.
 */
export function coverShade(section: HTMLElement, shade: HTMLElement | null, coverPx: number) {
  if (!shade) return
  gsap.fromTo(
    shade,
    { opacity: 0 },
    {
      opacity: 0.65,
      ease: 'none',
      scrollTrigger: { trigger: section, start: () => `bottom-=${coverPx + window.innerHeight} top`, end: () => `bottom-=${window.innerHeight} top`, scrub: true },
    }
  )
}

/** Scroll the page so a staged sequence shows step `i` of `n` (keyboard focus, faces, hotspots). */
export function scrollToStep(section: HTMLElement, i: number, n: number, runPx: number) {
  const top = section.getBoundingClientRect().top + window.scrollY
  const y = top + (n > 1 ? (i / (n - 1)) * runPx : 0)
  const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void } }).lenis
  if (lenis) lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

/**
 * The quiet entrance: a short fade and a 10px rise, once, under 600ms. For
 * everything that is not a page's one moment. (Only runs inside a scene, so
 * never without JS or with reduced motion.)
 */
export function enter(nodes: Element[]) {
  nodes.forEach((node) =>
    gsap.from(node, { autoAlpha: 0, y: 10, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } })
  )
}
