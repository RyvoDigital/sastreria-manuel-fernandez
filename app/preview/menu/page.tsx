import type { Metadata } from 'next'
import HomePage from '@/app/page'
import { MenuPreview } from './_components/MenuPreview'

/*
 * Hidden review route for the menu redesign (B2). Not linked from anywhere,
 * not in the sitemap, noindex. The real homepage renders underneath so each
 * header can be judged over the hero and on scroll. Delete with B3.
 */
export const metadata: Metadata = {
  title: 'Menu preview',
  robots: { index: false, follow: false },
}

export default async function MenuPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { d } = await searchParams
  const direction = d === 'b' || d === 'c' ? d : 'a'
  return (
    <>
      <MenuPreview direction={direction} />
      <HomePage />
    </>
  )
}
