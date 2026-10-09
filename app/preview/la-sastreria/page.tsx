import type { Metadata } from 'next'
import { SastreriaPreview } from './_components/SastreriaPreview'

/*
 * Hidden review route: La Sastrería in the El hilo system, two variants.
 *   ?v=a  La costura     ?v=b  El relevo
 * Not linked, not in the sitemap, noindex. Delete once a variant is chosen.
 */
export const metadata: Metadata = {
  title: 'La Sastrería · variants',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { v } = await searchParams
  return <SastreriaPreview variant={v === 'b' ? 'b' : 'a'} />
}
