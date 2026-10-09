import type { Metadata } from 'next'
import { HeroEnhanced } from '@/components/home/HeroEnhanced'
import { Home } from './_components/Home'

/*
 * Hidden review route for the homepage redesign: the live hero, untouched,
 * followed by one of two continuous versions of everything below it.
 *   ?d=4  El hilo     ?d=5  Las capas
 * Not linked, not in the sitemap, noindex. Delete once a version is chosen.
 */
export const metadata: Metadata = {
  title: 'Homepage versions',
  robots: { index: false, follow: false },
}

export default async function HomePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { d } = await searchParams
  return (
    <>
      <HeroEnhanced />
      <Home variant={d === '5' ? 'capas' : 'hilo'} />
    </>
  )
}
