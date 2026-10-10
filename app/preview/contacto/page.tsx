import type { Metadata } from 'next'
import { ContactoPreview } from './_components/ContactoPreview'

/*
 * Hidden review route: Contacto in the El hilo system, two variants.
 *   ?v=a  La tarjeta     ?v=b  El mostrador
 * Not linked, not in the sitemap, noindex. Delete once a variant is chosen.
 */
export const metadata: Metadata = {
  title: 'Contacto · variants',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { v } = await searchParams
  return <ContactoPreview variant={v === 'b' ? 'b' : 'a'} />
}
