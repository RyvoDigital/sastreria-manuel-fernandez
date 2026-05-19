'use client'

import { useEffect } from 'react'

export default function HidePublicUI() {
  useEffect(() => {
    const hide = () => {
      document.querySelectorAll('.nav-bar, #loading-screen, .nav-overlay').forEach((el) => {
        ;(el as HTMLElement).style.display = 'none'
      })
    }
    hide()
    const id = setInterval(hide, 100)
    setTimeout(() => clearInterval(id), 2000)
  }, [])
  return null
}
