import type { Metadata } from 'next'
import { CursosPreview } from './_components/CursosPreview'

/*
 * Hidden review route: Cursos in the El hilo system, two variants.
 *   ?v=a  El temario     ?v=b  La lección
 * Not linked, not in the sitemap, noindex. Delete once a variant is chosen.
 */
export const metadata: Metadata = {
  title: 'Cursos · variants',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { v } = await searchParams
  return <CursosPreview variant={v === 'b' ? 'b' : 'a'} />
}
