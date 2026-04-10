'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

const NAV_COL1 = [
  { key: 'inicio' as const, href: '/' },
  { key: 'sastreria' as const, href: '/la-sastreria' },
  { key: 'servicios' as const, href: '/servicios' },
  { key: 'bodas' as const, href: '/bodas-y-ceremonia' },
]

const NAV_COL2 = [
  { key: 'configurador' as const, href: '/configurador' },
  { key: 'cursos' as const, href: '/cursos' },
  { key: 'videollamada' as const, href: '/videollamada' },
  { key: 'contacto' as const, href: '/contacto' },
]

export function Footer() {
  const { t } = useI18n()

  return (
    <footer
      style={{
        background: 'var(--color-black)',
        borderTop: '1px solid var(--color-gold)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        paddingLeft: 'var(--container-padding)',
        paddingRight: 'var(--container-padding)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: 'var(--color-offwhite)',
              marginBottom: '0.5rem',
            }}
          >
            Manuel Fernández
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
            }}
          >
            Sastrería
          </div>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: 1.7,
              maxWidth: '220px',
            }}
          >
            {t.footer.tagline}
          </p>
        </div>

        {/* Nav col 1 */}
        <div>
          <ul style={{ listStyle: 'none' }}>
            {NAV_COL1.map(({ key, href }) => (
              <li key={key} style={{ marginBottom: '0.85rem' }}>
                <Link
                  href={href}
                  className="nav-link"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {t.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Nav col 2 */}
        <div>
          <ul style={{ listStyle: 'none' }}>
            {NAV_COL2.map(({ key, href }) => (
              <li key={key} style={{ marginBottom: '0.85rem' }}>
                <Link
                  href={href}
                  className="nav-link"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {t.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <ul style={{ listStyle: 'none' }}>
            {[
              { label: t.footer.address },
              { label: t.footer.phone, href: `tel:${t.footer.phone.replace(/\s/g, '')}` },
              { label: t.footer.hours },
            ].map(({ label, href }, i) => (
              <li
                key={i}
                style={{
                  marginBottom: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  lineHeight: 1.6,
                }}
              >
                {href ? (
                  <a href={href} style={{ color: 'inherit', cursor: 'pointer' }}>
                    {label}
                  </a>
                ) : (
                  label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(196, 163, 90, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.35)',
            letterSpacing: '0.05em',
          }}
        >
          {t.footer.rights}
        </span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Instagram', 'WhatsApp'].map((social) => (
            <a
              key={social}
              href="#"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                color: 'rgba(201, 168, 76, 0.6)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-gold)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'rgba(196, 163, 90, 0.5)')
              }
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
