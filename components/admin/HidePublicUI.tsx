'use client'

import { useEffect } from 'react'

export default function HidePublicUI() {
  useEffect(() => {
    const hide = () => {
      // Public nav by role + aria-label
      const nav = document.querySelector('nav[role="navigation"][aria-label="Navegación principal"]') as HTMLElement | null
      if (nav) nav.style.display = 'none'

      // Loading screen
      const loader = document.getElementById('loading-screen')
      if (loader) loader.style.display = 'none'
    }
    hide()
    const id = setInterval(hide, 100)
    setTimeout(() => clearInterval(id), 2000)
  }, [])
  return null
}
