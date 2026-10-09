import type { Metadata } from 'next'
import { ContactPage } from '@/components/contacto/ContactPage'
import { ServiceGate } from '@/components/global/ServiceGate'
import { isSettingEnabled } from '@/lib/settings-server'

/* Re-read the admin show/hide setting at most once a minute. */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contacto · Sastrería Manuel Fernández',
  description: 'Cada encargo comienza con una conversación. Póngase en contacto con la sastrería de Sastrería Manuel Fernández en Madrid.',
  alternates: { canonical: '/contacto' },
}

export default async function ContactoPage() {
  const enabled = await isSettingEnabled('contacto')
  return (
    <ServiceGate settingId="contacto" initialEnabled={enabled}>
      <ContactPage />
    </ServiceGate>
  )
}
