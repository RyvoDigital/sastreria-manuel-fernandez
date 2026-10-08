import type { Metadata } from 'next'
import { HomePreview } from './_components/HomePreview'

/*
 * Hidden review route for the homepage redesign (Step 1): three design
 * directions on ?d=1, ?d=2, ?d=3. Not linked, not in the sitemap, noindex.
 * Delete once a direction is chosen.
 */
export const metadata: Metadata = {
  title: 'Homepage directions',
  robots: { index: false, follow: false },
}

export default async function HomePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { d } = await searchParams
  const direction = d === '2' || d === '3' ? d : '1'
  return <HomePreview direction={direction} />
}
