'use client'

import { ContactoA } from './ContactoA'
import { ContactoB } from './ContactoB'

export function ContactoPreview({ variant }: { variant: 'a' | 'b' }) {
  return variant === 'b' ? <ContactoB /> : <ContactoA />
}
