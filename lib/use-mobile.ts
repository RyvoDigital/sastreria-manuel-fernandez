import { useState, useEffect } from 'react'
import { breakpoints } from './breakpoints'

export function useIsMobile(breakpoint: number = breakpoints.md): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}
