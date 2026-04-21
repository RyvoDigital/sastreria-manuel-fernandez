import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'
import { LenisProvider } from '@/lib/lenis-provider'
import { LoadingScreen } from '@/components/global/LoadingScreen'
import { Navigation } from '@/components/global/Navigation'
import { FooterEnhanced } from '@/components/global/FooterEnhanced'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Manuel Fernández — Sastrería Artesanal en Madrid desde 1978',
  description:
    'Maestros sastres en Madrid expertos en confección artesanal de trajes a medida, chaqués y esmóquines. Alta sastrería tradicional con tejidos exclusivos de las mejores casas europeas.',
  keywords: [
    'sastrería artesanal madrid',
    'trajes a medida madrid',
    'sastre madrid',
    'chaqué a medida',
    'esmoquin a medida',
    'Manuel Fernández sastre',
    'alta sastrería',
    'bespoke tailoring spain'
  ],
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <LanguageProvider>
          <LenisProvider>
            <LoadingScreen />
            <Navigation />
            <main>{children}</main>
            <FooterEnhanced />
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
