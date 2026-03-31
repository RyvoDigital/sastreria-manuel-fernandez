'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const onEnterLink = () => ring.classList.add('hovering')
    const onLeaveLink = () => ring.classList.remove('hovering')

    const animate = () => {
      // Dot: instant follow
      dot.style.left = `${posRef.current.x}px`
      dot.style.top = `${posRef.current.y}px`

      // Ring: lerp follow (lag effect)
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12
      ring.style.left = `${ringPosRef.current.x}px`
      ring.style.top = `${ringPosRef.current.y}px`

      rafRef.current = requestAnimationFrame(animate)
    }

    const addListeners = () => {
      const links = document.querySelectorAll('a, button, [data-cursor]')
      links.forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    // Add hover listeners after slight delay for DOM to settle
    const timer = setTimeout(addListeners, 500)

    // Observe DOM mutations to add listeners to new elements
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
