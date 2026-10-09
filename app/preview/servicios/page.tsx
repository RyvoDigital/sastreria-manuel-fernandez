import type { Metadata } from 'next'
import { ServiciosA } from './_components/ServiciosA'

/*
 * Hidden review route: Servicios, version A (El muestrario) rebuilt to the
 * motion budget. Not linked, not in the sitemap, noindex. Delete once applied.
 */
export const metadata: Metadata = {
  title: 'Servicios · preview',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <ServiciosA />
}
