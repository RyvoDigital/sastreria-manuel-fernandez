'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { BookingLink } from '@/components/global/BookingLink'
import { useI18n } from '@/lib/i18n'
import { useSettings } from '@/lib/settings-provider'
import { usePathname } from 'next/navigation'
import { Send, MessageCircle } from 'lucide-react'
import { SITE_PHONE_E164 } from '@/lib/site'

const ALL_NAV_COL1 = [
  { key: 'inicio' as const, href: '/', settingId: null },
  { key: 'sastreria' as const, href: '/la-sastreria', settingId: null },
  { key: 'servicios' as const, href: '/servicios', settingId: null },
  { key: 'bodas' as const, href: '/bodas-y-ceremonia', settingId: 'bodas' },
]

const ALL_NAV_COL2 = [
  { key: 'cursos' as const, href: '/cursos', settingId: 'cursos' },
  { key: 'contacto' as const, href: '/contacto', settingId: 'contacto' },
]

export function FooterEnhanced() {
  const { t } = useI18n()
  const { isEnabled } = useSettings()
  const pathname = usePathname()
  const watermarkRef = useRef<HTMLDivElement>(null)

  // The watermark scales in once, the first time any of it scrolls into view.
  useEffect(() => {
    const el = watermarkRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.dataset.inview = ''
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const NAV_COL1 = ALL_NAV_COL1.filter((item) => {
    if (!item.settingId) return true
    return isEnabled(item.settingId)
  })
  const NAV_COL2 = ALL_NAV_COL2.filter((item) => {
    if (!item.settingId) return true
    return isEnabled(item.settingId)
  })

  if (pathname?.startsWith('/admin')) return null

  return (
    <footer style={{
      background: '#070C15',
      paddingTop: 'clamp(6rem, 12vw, 10rem)',
      paddingBottom: '3rem',
      paddingLeft: 'var(--container-padding)',
      paddingRight: 'var(--container-padding)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background scaling text */}
      <div
        ref={watermarkRef}
        className="mf-footer-watermark"
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(10rem, 25vw, 30rem)',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        FERNÁNDEZ
      </div>

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Booking band: the end of every page leads straight to booking
            (left out where the page already closes with its own booking button). */}
        <div className="mf-foot-book">
          <h4 className="mf-foot-book-title">{t.footer.cta_title}</h4>
          <BookingLink className="mf-foot-book-btn">
            {t.footer.cta_btn} <Send size={16} aria-hidden="true" />
          </BookingLink>
        </div>

        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '4rem',
          marginBottom: '5rem',
        }}>
          {/* Brand and Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                color: '#FFFFFF',
                marginBottom: '0.2rem',
              }}>
                Manuel Fernández
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}>
                {t.nav.sastreria}
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '300px',
            }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {NAV_COL1.map((item) => (
                <li key={item.key} style={{ marginBottom: '1rem' }}>
                  <Link href={item.href} style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {NAV_COL2.map((item) => (
                <li key={item.key} style={{ marginBottom: '1rem' }}>
                  <Link href={item.href} style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / NAP. The address, phone and hours keys have always
              existed in messages/*.json but were never rendered. Name, address
              and phone need to be on the page and consistent with the
              LocalBusiness schema in app/layout.tsx. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A84C',
            }}>
              {t.nav.contacto}
            </div>

            <address style={{
              // <address> defaults to italic in every browser; the site has no
              // italic sans anywhere, so reset it.
              fontStyle: 'normal',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
              maxWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <span>{t.footer.address}</span>

              <a
                href={`tel:${SITE_PHONE_E164}`}
                data-track="phone_click:footer"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  width: 'fit-content',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              >
                {t.footer.phone}
              </a>

              <span>{t.footer.hours}</span>
            </address>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.3)',
          }}>
            {t.footer.rights}
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="https://www.instagram.com/sastreriamanuelfernandez/" target="_blank" rel="noopener noreferrer" style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)', 
              transition: 'color 0.3s',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }} 
               onMouseEnter={(e) => e.currentTarget.style.color = '#C9A84C'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
              {t.footer.instagram}
            </a>
            <a href="https://www.facebook.com/p/Sastreria-Manuel-Fernandez-100051593358323/" target="_blank" rel="noopener noreferrer" style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)', 
              transition: 'color 0.3s',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }} 
               onMouseEnter={(e) => e.currentTarget.style.color = '#C9A84C'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
              Facebook
            </a>
            <a href="https://wa.me/34682192944" target="_blank" rel="noopener noreferrer"
              data-track="whatsapp_click:footer" style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)', 
              transition: 'color 0.3s',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }} 
               onMouseEnter={(e) => e.currentTarget.style.color = '#C9A84C'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
              WhatsApp
            </a>
            {/* Added subtle separator */}
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
            <Link href="/legal" style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {t.footer.legal}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative pulse at the bottom */}
      <div
        className="mf-footer-pulse"
        style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '20rem',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <style>{FOOT_CSS + MOTION_CSS}</style>
    </footer>
  )
}

const FOOT_CSS = `
.mf-foot-book {
  display: flex; flex-direction: column; align-items: flex-start; gap: 1.75rem;
  padding-bottom: clamp(3rem, 7vw, 5rem); margin-bottom: clamp(3rem, 7vw, 5rem);
  border-bottom: 1px solid rgba(201,168,76,0.18);
}
.mf-foot-book-title {
  margin: 0; max-width: 18ch;
  font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.1rem, 1.4rem + 3vw, 4rem); line-height: 1.05;
  color: #FFFFFF; text-wrap: balance;
}
.mf-foot-book-btn {
  display: inline-flex; align-items: center; gap: 1rem;
  min-height: 52px; padding: 0 2.25rem;
  background: #C9A84C; color: #0A1628; text-decoration: none;
  font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  transition: background .25s ease;
}
.mf-foot-book-btn:hover { background: #E8D5A3; }
.mf-foot-book-btn:focus-visible { outline: 2px solid #E8D5A3; outline-offset: 4px; }
/* A page that closes with its own booking button does not get the band too. */
body:has([data-booking-end]) .mf-foot-book { display: none; }
@media (min-width: 900px) {
  .mf-foot-book { flex-direction: row; align-items: flex-end; justify-content: space-between; }
}
`

/*
 * The watermark and the pulse used framer-motion, which put that library on
 * every page. Same values in CSS. framer composed the watermark's transform
 * from its scale alone, dropping the inline translateX(-50%), so it settles
 * at transform: none; kept that way to stay identical.
 */
const MOTION_CSS = `
.mf-footer-watermark { opacity: 0; transform: scale(0.8); transition: opacity 2s cubic-bezier(0, 0, 0.58, 1), transform 2s cubic-bezier(0, 0, 0.58, 1); }
.mf-footer-watermark[data-inview] { opacity: 0.03; transform: none; }
.mf-footer-pulse { opacity: 0.1; animation: mf-footer-pulse 4s cubic-bezier(0.42, 0, 0.58, 1) infinite; }
@keyframes mf-footer-pulse { 0%, 100% { opacity: 0.1 } 50% { opacity: 0.2 } }
@media (prefers-reduced-motion: reduce) {
  .mf-footer-watermark { transition: none; }
  .mf-footer-pulse { animation: none; }
}
`
