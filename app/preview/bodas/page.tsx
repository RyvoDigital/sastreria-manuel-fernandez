import type { Metadata } from 'next'
import { BodasPreview } from './_components/BodasPreview'

/*
 * Hidden review route: Bodas y Ceremonia in the El hilo system, two variants.
 *   ?v=a  El álbum     ?v=b  El pasillo
 * Not linked, not in the sitemap, noindex. Delete once a variant is chosen.
 */
export const metadata: Metadata = {
  title: 'Bodas · variants',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { v } = await searchParams
  return <BodasPreview variant={v === 'b' ? 'b' : 'a'} />
}
