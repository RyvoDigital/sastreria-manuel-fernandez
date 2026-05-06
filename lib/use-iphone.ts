import { useState, useEffect } from 'react'

/**
 * Detects iPhone / iPod Touch specifically.
 * On iOS, ALL browsers (Chrome, Firefox, Brave, Edge) use WebKit,
 * so they all share the same GPU/memory limitations.
 */
export function useIsIPhone(): boolean {
  const [isIPhone, setIsIPhone] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    const platform = navigator.platform

    const isIphoneDevice = /iPhone/.test(ua) || platform === 'iPhone'
    const isIPod = /iPod/.test(ua) || platform === 'iPod'

    setIsIPhone(isIphoneDevice || isIPod)
  }, [])

  return isIPhone
}

/**
 * Detects any iOS device (iPhone, iPad, iPod).
 * iPads on iOS 13+ in desktop mode report as "Macintosh" + touch support.
 */
export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    const platform = navigator.platform

    const isIphone = /iPhone/.test(ua) || platform === 'iPhone'
    const isIPod = /iPod/.test(ua) || platform === 'iPod'
    const isIPad = /iPad/.test(ua) || platform === 'iPad' ||
      (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !(window as unknown as { MSStream?: unknown }).MSStream)

    setIsIOS(isIphone || isIPod || isIPad)
  }, [])

  return isIOS
}
