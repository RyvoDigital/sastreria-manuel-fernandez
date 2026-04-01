'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'

const NAV_ITEMS = [
  { key: 'inicio'      as const, href: '/' },
  { key: 'sastreria'   as const, href: '/la-sastreria' },
  { key: 'experiencia' as const, href: '/experiencia' },
  { key: 'servicios'   as const, href: '/servicios' },
  { key: 'bodas'       as const, href: '/bodas-y-ceremonia' },
  { key: 'coleccion'   as const, href: '/coleccion' },
  { key: 'contacto'    as const, href: '/contacto' },
]

export function Navigation() {
  const { t, locale, toggleLocale } = useI18n()
  const pathname   = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [hovered,  setHovered]    = useState<string | null>(null)
  const [menuOpen, setMenuOpen]   = useState(false)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const mobileItemRefs = useRef<HTMLLIElement[]>([])
  const hoverTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Pages with light hero backgrounds need the nav to always be opaque
  const lightBgPages = ['/coleccion']
  const forceOpaque = lightBgPages.some(r => pathname.startsWith(r))
  const isOpaque = scrolled || forceOpaque

  /* scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* mobile overlay */
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      gsap.fromTo(
        mobileItemRefs.current.filter(Boolean),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.055, ease: 'power3.out', delay: 0.12 }
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(overlay, {
        opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => { gsap.set(overlay, { display: 'none' }) },
      })
    }
  }, [menuOpen])

  /* which item should show the indicator */
  const indicatorOn = hovered ?? NAV_ITEMS.find(i => isActive(i.href))?.key ?? null

  return (
    <>
      {/* ─── NAVBAR ──────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Navegación principal"
        style={{
          position:       'fixed',
          inset:          '0 0 auto 0',
          zIndex:          1000,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        `${isOpaque ? '1rem' : '1.6rem'} var(--container-padding)`,
          background:      isOpaque ? 'rgba(5,12,20,0.97)' : 'transparent',
          backdropFilter:  isOpaque ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: isOpaque ? 'blur(18px)' : 'none',
          borderBottom:    isOpaque ? '1px solid rgba(196,163,90,0.07)' : 'none',
          transition:     'padding .45s ease, background .45s ease, border-color .45s ease',
        }}
      >

        {/* ── LOGO ─────────────────────────────────────────── */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, lineHeight: 1 }}>
          <div style={{
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(0.9rem, 1.5vw, 1.05rem)',
            fontWeight:     400,
            letterSpacing: '0.07em',
            color:          'var(--color-offwhite)',
          }}>
            Manuel Fernández
          </div>
          <div style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      '0.48rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color:          'var(--color-gold)',
            marginTop:     '4px',
            opacity:        0.65,
          }}>
            Sastrería
          </div>
        </Link>

        {/* ── DESKTOP LINKS ────────────────────────────────── */}
        <ul
          onMouseLeave={() => {
            hoverTimer.current = setTimeout(() => setHovered(null), 80)
          }}
          style={{
            display:     'none',
            listStyle:   'none',
            margin:       0,
            padding:      0,
            gap:         'clamp(1.4rem, 2.2vw, 2.8rem)',
            alignItems:  'center',
          }}
          className="mf-desktop-nav"
        >
          {NAV_ITEMS.map(({ key, href }) => {
            const lit = indicatorOn === key

            return (
              <li
                key={key}
                style={{ position: 'relative' }}
                onMouseEnter={() => {
                  if (hoverTimer.current) clearTimeout(hoverTimer.current)
                  setHovered(key)
                }}
              >
                <Link
                  href={href}
                  style={{
                    display:       'block',
                    fontFamily:    'var(--font-sans)',
                    fontSize:      '0.59rem',
                    fontWeight:     300,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color:          lit
                      ? 'var(--color-offwhite)'
                      : 'rgba(245,240,234,0.38)',
                    textDecoration: 'none',
                    paddingBottom:  '7px',
                    transition:    'color .3s ease',
                  }}
                >
                  {t.nav[key]}
                </Link>

                {/* shared sliding gold underline */}
                {lit && (
                  <motion.div
                    layoutId="mf-nav-indicator"
                    style={{
                      position:   'absolute',
                      bottom:      0,
                      left:        0,
                      right:       0,
                      height:     '1px',
                      background:  'var(--color-gold)',
                    }}
                    transition={{
                      type:      'spring',
                      stiffness:  420,
                      damping:     36,
                    }}
                  />
                )}
              </li>
            )
          })}
        </ul>

        {/* ── RIGHT CLUSTER ────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>

          {/* Reservar Cita — desktop only */}
          <Link
            href="/reservar"
            className="mf-reservar"
            style={{
              display:        'none',
              fontFamily:     'var(--font-sans)',
              fontSize:       '0.57rem',
              fontWeight:      400,
              letterSpacing:  '0.2em',
              textTransform:  'uppercase',
              textDecoration:  'none',
              padding:        '0.6rem 1.6rem',
              color:           '#080808',
              background:     'var(--color-gold)',
              transition:     'background .25s, transform .2s',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold-light)'
              el.style.transform  = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold)'
              el.style.transform  = 'translateY(0)'
            }}
          >
            {t.nav.reservar}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            aria-label="Toggle language"
            style={{
              background:    'none',
              border:        'none',
              padding:       '2px 0',
              fontFamily:    'var(--font-sans)',
              fontSize:      '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:          'rgba(196,163,90,0.45)',
              cursor:         'pointer',
              transition:    'color .25s',
              borderBottom:  '1px solid transparent',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color            = 'var(--color-gold)'
              el.style.borderBottomColor = 'rgba(196,163,90,0.35)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color            = 'rgba(196,163,90,0.45)'
              el.style.borderBottomColor = 'transparent'
            }}
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Abrir menú"
            className="mf-hamburger"
            style={{
              background:    'none',
              border:        'none',
              cursor:         'pointer',
              padding:       '4px 0',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'flex-end',
              gap:           '5px',
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '1px', background: 'rgba(245,240,234,0.65)' }} />
            <span style={{ display: 'block', width: '14px', height: '1px', background: 'var(--color-gold)' }} />
          </button>

        </div>
      </nav>

      {/* ─── BREAKPOINT HELPERS ─────────────────────────────── */}
      <style>{`
        @media (min-width: 1024px) {
          .mf-desktop-nav { display: flex !important; }
          .mf-reservar    { display: inline-flex !important; }
          .mf-hamburger   { display: none !important; }
        }
      `}</style>

      {/* ─── MOBILE OVERLAY ─────────────────────────────────── */}
      <div
        ref={overlayRef}
        style={{
          display:        'none',
          position:       'fixed',
          inset:           0,
          zIndex:          990,
          background:     '#050C14',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* close */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
          style={{
            position:   'absolute',
            top:        '1.6rem',
            right:      'var(--container-padding)',
            background: 'none',
            border:     'none',
            color:       'rgba(196,163,90,0.45)',
            fontSize:    '1.1rem',
            lineHeight:   1,
            cursor:      'pointer',
          }}
        >
          ✕
        </button>

        {/* logo */}
        <div style={{
          position:   'absolute',
          top:        '1.5rem',
          left:       'var(--container-padding)',
          fontFamily: 'var(--font-serif)',
          fontSize:    '0.95rem',
          letterSpacing: '0.06em',
          color:       'var(--color-offwhite)',
          opacity:      0.6,
        }}>
          Manuel Fernández
        </div>

        {/* decorative line */}
        <div style={{
          width:     '1px',
          height:    '36px',
          background: 'linear-gradient(to bottom, transparent, rgba(196,163,90,0.25))',
          marginBottom: '2rem',
        }} />

        {/* links */}
        <ul style={{ listStyle: 'none', textAlign: 'center', padding: 0, margin: 0 }}>
          {[...NAV_ITEMS, { key: 'reservar' as const, href: '/reservar' }].map(({ key, href }, i) => (
            <li
              key={key}
              ref={el => { if (el) mobileItemRefs.current[i] = el as HTMLLIElement }}
              style={{ marginBottom: '1.1rem' }}
            >
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'clamp(0.7rem, 2.8vw, 0.85rem)',
                  fontWeight:     300,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color:          isActive(href)
                    ? 'var(--color-gold)'
                    : 'rgba(245,240,234,0.55)',
                  textDecoration: 'none',
                  display:       'block',
                  transition:    'color .2s',
                }}
              >
                {t.nav[key]}
              </Link>
            </li>
          ))}
        </ul>

        {/* bottom accent */}
        <div style={{
          width:     '1px',
          height:    '36px',
          background: 'linear-gradient(to top, transparent, rgba(196,163,90,0.25))',
          marginTop:  '2rem',
          marginBottom: '1.5rem',
        }} />

        <button
          onClick={toggleLocale}
          style={{
            background: 'none',
            border:     '1px solid rgba(196,163,90,0.18)',
            color:       'rgba(196,163,90,0.5)',
            fontFamily: 'var(--font-sans)',
            fontSize:   '0.55rem',
            letterSpacing: '0.22em',
            padding:    '0.45rem 1rem',
            cursor:      'pointer',
          }}
        >
          {locale === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
    </>
  )
}
