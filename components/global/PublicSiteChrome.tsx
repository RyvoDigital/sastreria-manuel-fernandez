'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'
import { FooterEnhanced } from './FooterEnhanced'
import { ScrollToTop } from './ScrollToTop'
import { ScrollToTopButton } from './ScrollToTopButton'

export default function PublicSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <ScrollToTop />
      <ScrollToTopButton />
      <main>{children}</main>
      <FooterEnhanced />
    </>
  )
}
