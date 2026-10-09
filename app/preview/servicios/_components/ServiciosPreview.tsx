'use client'

import { ServiciosA } from './ServiciosA'
import { ServiciosB } from './ServiciosB'

export function ServiciosPreview({ variant }: { variant: 'a' | 'b' }) {
  return variant === 'b' ? <ServiciosB /> : <ServiciosA />
}
