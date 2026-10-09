'use client'

import { BodasA } from './BodasA'
import { BodasB } from './BodasB'

export function BodasPreview({ variant }: { variant: 'a' | 'b' }) {
  return variant === 'b' ? <BodasB /> : <BodasA />
}
