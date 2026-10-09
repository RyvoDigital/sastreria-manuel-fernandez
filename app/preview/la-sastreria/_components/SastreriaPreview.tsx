'use client'

import { SastreriaA } from './SastreriaA'
import { SastreriaB } from './SastreriaB'

export function SastreriaPreview({ variant }: { variant: 'a' | 'b' }) {
  return variant === 'b' ? <SastreriaB /> : <SastreriaA />
}
