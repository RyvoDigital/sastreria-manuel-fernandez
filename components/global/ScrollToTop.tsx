'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).lenis) as { scrollTo: (y: number, opts?: { immediate?: boolean }) => void } | undefined
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
