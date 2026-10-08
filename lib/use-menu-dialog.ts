'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { usePathname } from 'next/navigation'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function isUsable(el: HTMLElement) {
  return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]')
}

/**
 * Everything a full-screen menu needs beyond its looks:
 * - locks page scroll (native and Lenis) while open, without a layout jump
 * - Esc closes; focus returns to the toggle
 * - Tab is trapped inside `rootRef` (the header bar plus the panel)
 * - ArrowUp/ArrowDown/Home/End move between `[data-menu-item]` links
 * - closes on navigation, and when the viewport reaches `closeAbove` px
 */
export function useMenuDialog(
  rootRef: RefObject<HTMLElement | null>,
  toggleRef: RefObject<HTMLElement | null>,
  closeAbove?: number,
) {
  // The menu remembers the page it was opened on, so navigating closes it
  // without an effect.
  const pathname = usePathname()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname
  const wasOpen = useRef(false)

  const close = useCallback(() => setOpenOn(null), [])
  const toggle = useCallback(() => setOpenOn((v) => (v === pathname ? null : pathname)), [pathname])

  // Close when the viewport grows past the point where the menu is needed.
  useEffect(() => {
    if (!closeAbove) return
    const mq = window.matchMedia(`(min-width: ${closeAbove}px)`)
    const onChange = () => { if (mq.matches) setOpenOn(null) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [closeAbove])

  // Scroll lock
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const body = document.body
    const gap = window.innerWidth - html.clientWidth
    const lenis = (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis
    const prev = { html: html.style.overflow, body: body.style.overflow, pad: body.style.paddingRight }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    lenis?.stop()
    return () => {
      html.style.overflow = prev.html
      body.style.overflow = prev.body
      body.style.paddingRight = prev.pad
      lenis?.start()
    }
  }, [open])

  // Keyboard: Esc, focus trap, arrow keys
  useEffect(() => {
    if (!open) return
    const root = rootRef.current
    if (!root) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpenOn(null)
        return
      }
      if (e.key === 'Tab') {
        const els = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isUsable)
        if (els.length === 0) return
        const first = els[0]
        const last = els[els.length - 1]
        const current = document.activeElement as HTMLElement | null
        if (e.shiftKey && (current === first || !root.contains(current))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (current === last || !root.contains(current))) {
          e.preventDefault()
          first.focus()
        }
        return
      }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        const links = Array.from(root.querySelectorAll<HTMLElement>('[data-menu-item]')).filter(isUsable)
        const i = links.indexOf(document.activeElement as HTMLElement)
        if (i === -1 || links.length === 0) return
        e.preventDefault()
        const next =
          e.key === 'Home' ? 0
          : e.key === 'End' ? links.length - 1
          : e.key === 'ArrowDown' ? (i + 1) % links.length
          : (i - 1 + links.length) % links.length
        links[next].focus()
      }
    }

    document.addEventListener('keydown', onKey)
    // Move focus into the panel once it is no longer inert.
    const id = requestAnimationFrame(() => {
      Array.from(root.querySelectorAll<HTMLElement>('[data-menu-item]')).find(isUsable)?.focus({ preventScroll: true })
    })
    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(id)
    }
  }, [open, rootRef])

  // Return focus to the toggle after closing
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open, toggleRef])

  return { open, toggle, close }
}

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}
