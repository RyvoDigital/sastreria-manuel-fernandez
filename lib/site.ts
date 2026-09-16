/**
 * Single source of truth for the canonical site URL and the public NAP
 * (name, address, phone) details.
 *
 * NEXT_PUBLIC_SITE_URL is already read in next.config.ts. Respect it if it is
 * set, but never fall back to a preview hostname: the sitemap, robots.txt and
 * every canonical resolve against this value, and a preview host there tells
 * Google the live site lives on a throwaway deployment.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sastreriamanuelfernandez.com'

export const SITE_NAME = 'Sastrería Manuel Fernández'
export const SITE_PHONE_E164 = '+34682192944'
export const SITE_PHONE_DISPLAY = '+34 682 19 29 44'
export const SITE_STREET = 'Calle de Jorge Juan, 41'
export const SITE_POSTAL = '28001'
export const SITE_LOCALITY = 'Madrid'
export const SITE_INSTAGRAM = 'https://www.instagram.com/sastreriamanuelfernandez/'
