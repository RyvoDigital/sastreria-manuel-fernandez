'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { gsap } from 'gsap'
import { useI18n } from '@/lib/i18n'
import { Phone, MapPin, MessageCircle, Home, Scissors, Heart, Briefcase, Box, Settings, GraduationCap, Video, Mail } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'inicio'        as const, href: '/',               icon: Home },
  { key: 'sastreria'     as const, href: '/la-sastreria',   icon: Scissors },
  { key: 'bodas'         as const, href: '/bodas-y-ceremonia', icon: Heart },
  { key: 'servicios'     as const, href: '/servicios',      icon: Briefcase },
  { key: 'modelos3d'     as const, href: '/modelos-3d',     icon: Box },
  { key: 'configurador'  as const, href: '/configurador',   icon: Settings },
  { key: 'cursos'        as const, href: '/cursos',         icon: GraduationCap },
  { key: 'videollamada'  as const, href: '/videollamada',   icon: Video },
  { key: 'contacto'      as const, href: '/contacto',       icon: Mail },
]

// Persistent contact buttons data — labels resolved inside component for i18n
const CONTACT_BUTTONS_DATA = {
  call: { href: 'tel:+34682192944', icon: Phone },
  location: { href: 'https://www.google.com/maps/search/?api=1&query=Sastrería+Manuel+Fernández,+C.+de+Jorge+Juan,+41,+Salamanca,+28001+Madrid', icon: MapPin },
}

export function Navigation() {
  const { t, locale, toggleLocale, setLocale } = useI18n()
  const pathname   = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const mobileItemRefs = useRef<HTMLAnchorElement[]>([])

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
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.15 }
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
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, lineHeight: 1, maxWidth: 'min(40vw, 140px)' }}>
          <img 
            src="/logo.png" 
            alt="Sastrería Manuel Fernández"
            style={{
              height: 'clamp(28px, 5vh, 56px)',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Link>

        {/* ── RIGHT CLUSTER ────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 1.25rem)', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>

          {/* CALL US BUTTON — Desktop only, persistent on all pages */}
          <a
            href={CONTACT_BUTTONS_DATA.call.href}
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
            {locale === 'es' ? 'Llámanos' : locale === 'it' ? 'Chiamaci' : locale === 'fr' ? 'Appelez-nous' : 'Call Us'}
          </a>

          {/* WHERE WE ARE BUTTON — Desktop only, persistent on all pages */}
          <a
            href={CONTACT_BUTTONS_DATA.location.href}
            target="_blank"
            rel="noopener noreferrer"
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
            {locale === 'es' ? 'Dónde Estamos' : locale === 'it' ? 'Dove Siamo' : locale === 'fr' ? 'Où Nous Sommes' : 'Find Us'}
          </a>

          {/* Language selector */}
          <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
            {(['es', 'en', 'it', 'fr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                aria-label={`Switch to ${l}`}
                style={{
                  background:    'none',
                  border:        'none',
                  padding:       '2px 4px',
                  fontFamily:    'var(--font-sans)',
                  fontSize:      '0.45rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color:          locale === l ? 'var(--color-gold)' : 'rgba(201,168,76,0.4)',
                  cursor:         'pointer',
                  transition:    'color .25s',
                  borderBottom:  locale === l ? '1px solid var(--color-gold)' : '1px solid transparent',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/34682192944"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#25D366',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'opacity .25s',
              opacity: 0.85,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.opacity = '1'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.opacity = '0.85'
            }}
          >
            <MessageCircle size={18} strokeWidth={1.5} />
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            className="mf-hamburger"
            style={{
              background:    'none',
              border:        'none',
              cursor:         'pointer',
              padding:       '6px',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              justifyContent: 'center',
              gap:           '4px',
              width:         '32px',
              height:        '32px',
            }}
          >
            <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.65)', borderRadius: '1px' }} />
            <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.65)', borderRadius: '1px' }} />
            <span style={{ display: 'block', width: '14px', height: '1.5px', background: 'rgba(255,255,255,0.65)', borderRadius: '1px' }} />
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
          overflowY:      'auto',
          overflowX:      'hidden',
        }}
      >
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem var(--container-padding)',
          flexShrink: 0,
        }}>
          <img 
            src="/logo.png" 
            alt="Sastrería Manuel Fernández"
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain',
              opacity: 0.9,
            }}
          />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            style={{
              background: 'none',
              border:     'none',
              color:       'rgba(196,163,90,0.6)',
              fontSize:    '1.2rem',
              lineHeight:   1,
              cursor:      'pointer',
              padding: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Main content - grid of tiles */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1rem var(--container-padding) 2rem',
        }}>
          {/* Grid of square nav tiles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(0.4rem, 1.5vw, 0.75rem)',
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto',
          }}>
            {NAV_ITEMS.map(({ key, href, icon: Icon }, i) => {
              const active = isActive(href)
              return (
                <Link
                  key={key}
                  href={href}
                  ref={el => { if (el) mobileItemRefs.current[i] = el as HTMLAnchorElement }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    aspectRatio: '1',
                    background: active 
                      ? 'rgba(201,168,76,0.12)' 
                      : 'rgba(255,255,255,0.03)',
                    border: active 
                      ? '1px solid rgba(201,168,76,0.35)' 
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    padding: '0.4rem',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(201,168,76,0.1)'
                    el.style.borderColor = 'rgba(201,168,76,0.3)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = active 
                      ? 'rgba(201,168,76,0.12)' 
                      : 'rgba(255,255,255,0.03)'
                    el.style.borderColor = active 
                      ? 'rgba(201,168,76,0.35)' 
                      : 'rgba(255,255,255,0.06)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <Icon 
                    size={18} 
                    strokeWidth={1.5}
                    style={{ 
                      color: active ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                      transition: 'color 0.3s',
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.48rem, 1.4vw, 0.65rem)',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--color-gold)' : 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                    lineHeight: 1.25,
                    transition: 'color 0.3s',
                    wordBreak: 'break-word',
                  }}>
                    {t.nav[key]}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Contact buttons row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '0.75rem', 
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}>
            <a
              href={CONTACT_BUTTONS_DATA.call.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                textDecoration: 'none',
                padding: '0.65rem 1.25rem',
                border: '1px solid var(--color-gold)',
                borderRadius: '4px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--color-gold)'
                el.style.color = '#0A1628'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.color = 'var(--color-gold)'
              }}
            >
              <Phone size={15} strokeWidth={1.5} />
              {locale === 'es' ? 'Llámanos' : locale === 'it' ? 'Chiamaci' : locale === 'fr' ? 'Appelez-nous' : 'Call Us'}
            </a>
            <a
              href={CONTACT_BUTTONS_DATA.location.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                padding: '0.65rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '4px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.5)'
                el.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.25)'
                el.style.background = 'transparent'
              }}
            >
              <MapPin size={15} strokeWidth={1.5} />
              {locale === 'es' ? 'Dónde Estamos' : locale === 'it' ? 'Dove Siamo' : locale === 'fr' ? 'Où Nous Sommes' : 'Find Us'}
            </a>
          </div>

          {/* Language selector */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem', 
            marginTop: '2rem',
          }}>
            {(['es', 'en', 'it', 'fr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                style={{
                  background: locale === l ? 'rgba(201,168,76,0.15)' : 'none',
                  border:     '1px solid rgba(201,168,76,0.25)',
                  color:       locale === l ? 'var(--color-gold)' : 'rgba(201,168,76,0.6)',
                  fontFamily: 'var(--font-sans)',
                  fontSize:   '0.65rem',
                  letterSpacing: '0.22em',
                  padding:    '0.6rem 1.25rem',
                  cursor:      'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.25s',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
