'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'
import { Phone, MapPin } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'inicio'        as const, href: '/' },
  { key: 'sastreria'     as const, href: '/la-sastreria' },
  { key: 'bodas'         as const, href: '/bodas-y-ceremonia' },
  { key: 'servicios'     as const, href: '/servicios' },
  { key: 'modelos3d'     as const, href: '/modelos-3d' },
  { key: 'configurador'  as const, href: '/configurador' },
  { key: 'cursos'        as const, href: '/cursos' },
  { key: 'videollamada'  as const, href: '/videollamada' },
  { key: 'contacto'      as const, href: '/contacto' },
]

// Persistent contact buttons data
const CONTACT_BUTTONS = {
  call: { label: 'Llámanos', href: 'tel:+34000000000', icon: Phone },
  location: { label: 'Dónde Estamos', href: '/contacto', icon: MapPin },
}

export function Navigation() {
  const { t, locale, toggleLocale } = useI18n()
  const pathname   = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const mobileItemRefs = useRef<HTMLLIElement[]>([])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Pages with light hero backgrounds need the nav to always be opaque
  const lightBgPages: string[] = []
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
          <img 
            src="/logo.png" 
            alt="Sastrería Manuel Fernández"
            style={{
              height: 'clamp(40px, 5vh, 56px)',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Link>

        {/* ── RIGHT CLUSTER ────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>

          {/* CALL US BUTTON — Desktop only, persistent on all pages */}
          <a
            href={CONTACT_BUTTONS.call.href}
            className="mf-contact-btn"
            style={{
              display:        'none',
              alignItems:     'center',
              gap:            '0.5rem',
              fontFamily:     'var(--font-sans)',
              fontSize:       '0.65rem',
              fontWeight:      500,
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              textDecoration:  'none',
              padding:        '0.55rem 1.1rem',
              color:           'var(--color-gold)',
              border:          '1px solid var(--color-gold)',
              background:      'transparent',
              transition:     'all .25s ease',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--color-gold)'
              el.style.color = 'var(--color-black)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = 'var(--color-gold)'
            }}
          >
            <Phone size={14} strokeWidth={1.5} />
            {CONTACT_BUTTONS.call.label}
          </a>

          {/* WHERE WE ARE BUTTON — Desktop only, persistent on all pages */}
          <Link
            href={CONTACT_BUTTONS.location.href}
            className="mf-contact-btn"
            style={{
              display:        'none',
              alignItems:     'center',
              gap:            '0.5rem',
              fontFamily:     'var(--font-sans)',
              fontSize:       '0.65rem',
              fontWeight:      500,
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              textDecoration:  'none',
              padding:        '0.55rem 1.1rem',
              color:           'var(--color-white)',
              border:          '1px solid rgba(255,255,255,0.3)',
              background:      'transparent',
              transition:     'all .25s ease',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--color-white)'
              el.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.3)'
              el.style.background = 'transparent'
            }}
          >
            <MapPin size={14} strokeWidth={1.5} />
            {CONTACT_BUTTONS.location.label}
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
              fontSize:      '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:          'rgba(201,168,76,0.5)',
              cursor:         'pointer',
              transition:    'color .25s',
              borderBottom:  '1px solid transparent',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color            = 'var(--color-gold)'
              el.style.borderBottomColor = 'rgba(201,168,76,0.35)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color            = 'rgba(201,168,76,0.5)'
              el.style.borderBottomColor = 'transparent'
            }}
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Hamburger */}
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
            <span style={{ display: 'block', width: '22px', height: '1px', background: 'rgba(255,255,255,0.65)' }} />
            <span style={{ display: 'block', width: '14px', height: '1px', background: 'var(--color-gold)' }} />
          </button>

        </div>
      </nav>

      {/* ─── BREAKPOINT HELPERS ─────────────────────────────── */}
      <style>{`
        @media (min-width: 1024px) {
          .mf-contact-btn { display: inline-flex !important; }
        }
        @media (max-width: 1200px) {
          .mf-contact-btn span { display: none !important; }
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
          background:     '#0A1628',
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
          top:        '1.2rem',
          left:       'var(--container-padding)',
        }}>
          <img 
            src="/logo.png" 
            alt="Sastrería Manuel Fernández"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              opacity: 0.9,
            }}
          />
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
          {NAV_ITEMS.map(({ key, href }, i) => (
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
                  fontSize:      'clamp(0.85rem, 3vw, 1rem)',
                  fontWeight:     400,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color:          isActive(href)
                    ? 'var(--color-gold)'
                    : 'rgba(255,255,255,0.7)',
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

        {/* Mobile contact buttons */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          marginTop: '2rem',
          alignItems: 'center' 
        }}>
          <a
            href={CONTACT_BUTTONS.call.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              border: '1px solid var(--color-gold)',
            }}
          >
            <Phone size={16} />
            {CONTACT_BUTTONS.call.label}
          </a>
          <Link
            href={CONTACT_BUTTONS.location.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <MapPin size={16} />
            {CONTACT_BUTTONS.location.label}
          </Link>
        </div>

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
            border:     '1px solid rgba(201,168,76,0.25)',
            color:       'rgba(201,168,76,0.6)',
            fontFamily: 'var(--font-sans)',
            fontSize:   '0.6rem',
            letterSpacing: '0.22em',
            padding:    '0.5rem 1.25rem',
            cursor:      'pointer',
            marginTop:   '1rem',
          }}
        >
          {locale === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
    </>
  )
}
