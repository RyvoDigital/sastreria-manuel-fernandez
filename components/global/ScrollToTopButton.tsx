'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'

/*
 * Appears after 500px of scroll. The enter/exit motion (fade, 20px rise,
 * scale from 0.8, 0.3s ease-out) used to come from framer-motion, which put
 * that library on every page of the site; it is the same motion in CSS.
 */
export function ScrollToTopButton() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="mf-to-top"
        data-visible={visible || undefined}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#C9A84C',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#D4B55A'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#C9A84C'
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.35)'
        }}
      >
        <ArrowUp size={20} color="#000000" strokeWidth={2.5} />
      </button>
      <style>{`
        .mf-to-top {
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          visibility: hidden;
          pointer-events: none;
          transition: opacity .3s cubic-bezier(0, 0, 0.58, 1), transform .3s cubic-bezier(0, 0, 0.58, 1), visibility 0s linear .3s;
        }
        .mf-to-top[data-visible] {
          opacity: 1;
          transform: none;
          visibility: visible;
          pointer-events: auto;
          transition: opacity .3s cubic-bezier(0, 0, 0.58, 1), transform .3s cubic-bezier(0, 0, 0.58, 1), visibility 0s;
        }
        @media (prefers-reduced-motion: reduce) {
          .mf-to-top, .mf-to-top[data-visible] { transition: none; }
        }
      `}</style>
    </>
  )
}
