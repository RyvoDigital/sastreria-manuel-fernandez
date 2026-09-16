import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'
import { LenisProvider } from '@/lib/lenis-provider'
import { SettingsProvider } from '@/lib/settings-provider'
import { ContentProvider } from '@/lib/content-provider'
import { LoadingScreen } from '@/components/global/LoadingScreen'
import { Navigation } from '@/components/global/Navigation'
import { FooterEnhanced } from '@/components/global/FooterEnhanced'
import { ScrollToTop } from '@/components/global/ScrollToTop'
import { ScrollToTopButton } from '@/components/global/ScrollToTopButton'
import { HtmlLang } from '@/components/global/HtmlLang'
import { GoogleTagManager, GoogleTagManagerNoscript } from '@/components/global/GoogleTagManager'
import {
  SITE_INSTAGRAM,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_PHONE_E164,
  SITE_POSTAL,
  SITE_STREET,
  SITE_URL,
} from '@/lib/site'

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
  title: 'Manuel Fernández · Sastrería Artesanal en Madrid',
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
    icon: '/img/favicon-manuel-fernandez.png',
  },
  // Resolves every relative canonical and Open Graph URL below to the live
  // domain. Without it those URLs resolve against the deployment hostname.
  metadataBase: new URL(SITE_URL),
  // No `alternates` and no `openGraph.url` here on purpose. Metadata fields
  // are inherited by any page that does not set its own, so either one at the
  // root would make every page declare itself a duplicate of the homepage.
  // Each page sets its own self-referencing canonical instead; omitting
  // og:url lets social platforms use the URL actually being shared.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_ES',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  // ClothingStore is a valid schema.org subtype of LocalBusiness and is more
  // specific than the bare type. Declaring both keeps the general type for
  // consumers that do not know the subtype.
  '@type': ['LocalBusiness', 'ClothingStore'],
  name: SITE_NAME,
  description: 'Maestros sastres en Madrid expertos en confección artesanal de trajes a medida, chaqués y esmóquines.',
  url: SITE_URL,
  // E.164, so the number is machine readable.
  telephone: SITE_PHONE_E164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_STREET,
    addressLocality: SITE_LOCALITY,
    postalCode: SITE_POSTAL,
    addressCountry: 'ES',
  },
  // TODO(data): these coordinates are unverified against Jorge Juan 41. The
  // street address itself is confirmed; the lat/long predate this work and
  // could not be checked from anything in the repo. Confirm against Google
  // Maps and correct if they do not land on the door.
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.4258,
    longitude: -3.6868,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '14:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '17:00',
      closes: '20:00',
    },
    {
      // Was 13:00, which contradicted the footer dictionary in every locale.
      // The client confirmed on 15 Sep 2026 that Saturday closes at 14:00 and
      // that the dictionary is the correct source.
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '14:00',
    },
  ],
  priceRange: '€€€',
  // Absolute. A relative path here is not resolvable by a consumer reading the
  // JSON-LD on its own, and metadataBase does not apply to hand-built schema.
  image: `${SITE_URL}/img/taller-sastreria-mesa-corte.webp`,
  // Only profiles that are verified. The site also links a Facebook page from
  // the footer; it is left out until Manuel confirms it is current.
  sameAs: [SITE_INSTAGRAM],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoscript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <HtmlLang />
          <SettingsProvider>
            <ContentProvider>
              <LenisProvider>
                <LoadingScreen />
                <Navigation />
                <ScrollToTop />
                <ScrollToTopButton />
                <main>{children}</main>
                <FooterEnhanced />
              </LenisProvider>
            </ContentProvider>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
