import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'
import { LenisProvider } from '@/lib/lenis-provider'
import { LoadingScreen } from '@/components/global/LoadingScreen'
import { Navigation } from '@/components/global/Navigation'
import { Footer } from '@/components/global/Footer'

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
  title: 'Manuel Fernández — Sastrería',
  description:
    'Sastrería a medida de lujo. No hacemos trajes. Construimos identidad.',
  keywords: ['sastrería', 'trajes a medida', 'lujo', 'Manuel Fernández'],
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
            <Footer />
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
