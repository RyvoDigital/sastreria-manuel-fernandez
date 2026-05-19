'use client'

import { useEffect } from 'react'

export default function HidePublicUI() {
  useEffect(() => {
    const hide = () => {
      const ids = ['public-navigation', 'public-nav-overlay', 'loading-screen']
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) el.style.display = 'none'
      })
    }
    hide()
    const id = setInterval(hide, 100)
    setTimeout(() => clearInterval(id), 2000)
  }, [])
  return null
}
