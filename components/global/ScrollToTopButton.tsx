'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function ScrollToTopButton() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  if (pathname?.startsWith('/admin')) return null

  const checkScroll = useCallback(() => {
    setVisible(window.scrollY > 500)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
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
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.35)'
          }}
        >
          <ArrowUp size={20} color="#000000" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
