import type { Metadata } from 'next'
import { ServiciosPreview } from './_components/ServiciosPreview'

/*
 * Hidden review route: Servicios in the El hilo system, two variants.
 *   ?v=a  El muestrario     ?v=b  El probador
 * Not linked, not in the sitemap, noindex. Delete once a variant is chosen.
 */
export const metadata: Metadata = {
  title: 'Servicios · variants',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { v } = await searchParams
  return <ServiciosPreview variant={v === 'b' ? 'b' : 'a'} />
}
