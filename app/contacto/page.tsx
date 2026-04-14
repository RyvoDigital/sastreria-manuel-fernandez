import type { Metadata } from 'next'
import { ContactPage } from '@/components/contacto/ContactPage'

export const metadata: Metadata = {
  title: 'Contacto — Sastrería Manuel Fernández',
  description: 'Cada encargo comienza con una conversación. Póngase en contacto con el taller de Sastrería Manuel Fernández en Madrid.',
}

export default function ContactoPage() {
  return <ContactPage />
}
