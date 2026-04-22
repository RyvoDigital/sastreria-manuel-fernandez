'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { Send } from 'lucide-react'

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

export function FooterEnhanced() {
  const { t } = useI18n()

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
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
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
      </motion.div>

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
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

          {/* CTA Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2rem',
          }}>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              color: '#FFFFFF',
              margin: 0,
            }}>
              {t.footer.cta_title}
            </h4>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contacto" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: '#C9A84C',
                color: '#000000',
                padding: '1rem 2.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 10px 30px rgba(201,168,76,0.3)',
              }}>
                {t.footer.cta_btn} <Send size={16} />
              </Link>
            </motion.div>
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
            <a href="https://wa.me/34682192944" target="_blank" rel="noopener noreferrer" style={{ 
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
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
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
    </footer>
  )
}
