'use client'

import { CursosA } from './CursosA'
import { CursosB } from './CursosB'

export function CursosPreview({ variant }: { variant: 'a' | 'b' }) {
  return variant === 'b' ? <CursosB /> : <CursosA />
}
