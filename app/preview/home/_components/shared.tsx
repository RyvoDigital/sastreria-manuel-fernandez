'use client'

import { useEffect, useRef } from 'react'
import { HERO_POSTER, HERO_VIDEO } from './content'

/** The hero film. Poster first; no autoplay for reduced motion. */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (mq.matches) v.pause()
      else v.play().catch(() => {})
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return (
    <video
      ref={ref}
      className={className}
      src={HERO_VIDEO}
      poster={HERO_POSTER}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}
