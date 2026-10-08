'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { usePathname } from 'next/navigation'
import { useI18n, type Locale } from '@/lib/i18n'
import { useSettings } from '@/lib/settings-provider'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164 } from '@/lib/site'

/*
 * Behaviour shared by the three menu directions on /preview/menu. Only the
 * presentation differs between them; items, contact details, scroll lock,
 * focus handling and keyboard support live here so the comparison is about
 * design, not about which one happens to work better.
 */

const ITEMS = [
  { key: 'inicio', href: '/', settingId: null },
  { key: 'sastreria', href: '/la-sastreria', settingId: null },
  { key: 'bodas', href: '/bodas-y-ceremonia', settingId: 'bodas' },
  { key: 'servicios', href: '/servicios', settingId: null },
  { key: 'cursos', href: '/cursos', settingId: 'cursos' },
  { key: 'contacto', href: '/contacto', settingId: 'contacto' },
] as const

export type MenuItemKey = (typeof ITEMS)[number]['key']

export interface MenuItem {
  key: MenuItemKey
  href: string
  label: string
  active: boolean
}

export const LOCALES: Locale[] = ['es', 'en', 'it', 'fr']

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
}

export const CONTACT = {
  tel: `tel:${SITE_PHONE_E164}`,
  phoneDisplay: SITE_PHONE_DISPLAY,
  whatsapp: 'https://wa.me/34682192944',
  maps:
    'https://www.google.com/maps/search/?api=1&query=Sastrería+Manuel+Fernández,+C.+de+Jorge+Juan,+41,+Salamanca,+28001+Madrid',
}

const UI: Record<Locale, { menu: string; close: string; call: string; find: string; language: string; nav: string }> = {
  es: { menu: 'Menú', close: 'Cerrar', call: 'Llámanos', find: 'Dónde estamos', language: 'Idioma', nav: 'Navegación principal' },
  en: { menu: 'Menu', close: 'Close', call: 'Call us', find: 'Find us', language: 'Language', nav: 'Main navigation' },
  it: { menu: 'Menu', close: 'Chiudi', call: 'Chiamaci', find: 'Dove siamo', language: 'Lingua', nav: 'Navigazione principale' },
  fr: { menu: 'Menu', close: 'Fermer', call: 'Appelez-nous', find: 'Nous trouver', language: 'Langue', nav: 'Navigation principale' },
}

export function useMenuContent() {
  const { t, locale, setLocale } = useI18n()
  const { isEnabled } = useSettings()
  const pathname = usePathname() ?? '/'

  const items: MenuItem[] = ITEMS.filter((i) => !i.settingId || isEnabled(i.settingId)).map((i) => ({
    key: i.key,
    href: i.href,
    label: t.nav[i.key],
    active: i.href === '/' ? pathname === '/' || pathname.startsWith('/preview') : pathname.startsWith(i.href),
  }))

  return {
    items,
    locale,
    setLocale,
    ui: UI[locale],
    address: t.footer.address,
    hours: t.footer.hours,
    book: t.footer.cta_btn,
  }
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

/** Closes the menu when the viewport grows past the point where it is needed. */
export function useCloseAbove(minWidth: number, close: () => void) {
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
    const onChange = () => { if (mq.matches) close() }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [minWidth, close])
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function visible(el: HTMLElement) {
  return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
}

/**
 * Everything a modal menu needs beyond its looks:
 * - locks page scroll (native and Lenis) while open, without a layout jump
 * - Esc closes; focus returns to the toggle
 * - Tab is trapped inside `rootRef` (the header bar plus the panel)
 * - ArrowUp/ArrowDown/Home/End move between `[data-menu-item]` links
 * - the menu closes on navigation
 */
export function useMenuDialog(rootRef: RefObject<HTMLElement | null>, toggleRef: RefObject<HTMLElement | null>) {
  // The menu remembers the page it was opened on, so navigating closes it
  // without an effect.
  const pathname = usePathname()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname
  const wasOpen = useRef(false)

  const setOpen = useCallback((v: boolean) => setOpenOn(v ? pathname : null), [pathname])
  const close = useCallback(() => setOpenOn(null), [])
  const toggle = useCallback(() => setOpenOn((v) => (v === pathname ? null : pathname)), [pathname])

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
    html.style.setProperty('--menu-scrollbar-gap', `${gap}px`)
    lenis?.stop()
    return () => {
      html.style.overflow = prev.html
      body.style.overflow = prev.body
      body.style.paddingRight = prev.pad
      html.style.removeProperty('--menu-scrollbar-gap')
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
        setOpen(false)
        return
      }
      if (e.key === 'Tab') {
        const els = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => visible(el) && !el.closest('[inert]'),
        )
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
        const links = Array.from(root.querySelectorAll<HTMLElement>('[data-menu-item]')).filter(
          (el) => visible(el) && !el.closest('[inert]'),
        )
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
      const firstItem = Array.from(root.querySelectorAll<HTMLElement>('[data-menu-item]')).find(
        (el) => visible(el) && !el.closest('[inert]'),
      )
      firstItem?.focus({ preventScroll: true })
    })
    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(id)
    }
  }, [open, rootRef, setOpen])

  // Return focus to the toggle after closing
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open, toggleRef])

  return { open, toggle, close }
}

/** 0..1 scroll progress through the document, for direction C. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      ref.current?.style.setProperty('--progress', p.toFixed(4))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}

/** Inline WhatsApp glyph, so the brand mark is right rather than a speech bubble. */
export function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  )
}

export function Crest({ height, className }: { height: number | string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/img/logo-manuel-fernandez.png"
      alt="Sastrería Manuel Fernández"
      width={2000}
      height={1317}
      className={className}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}
