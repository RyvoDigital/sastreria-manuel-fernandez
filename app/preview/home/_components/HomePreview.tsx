'use client'

import { D1Hilvan } from './D1Hilvan'
import { D2Medida } from './D2Medida'
import { D3Probador } from './D3Probador'
import { Switcher } from './Switcher'
import { TransitionProvider, type TransitionKind } from './Transition'

const KIND: Record<string, TransitionKind> = { '1': 'hilvan', '2': 'medida', '3': 'probador' }

export function HomePreview({ direction }: { direction: '1' | '2' | '3' }) {
  return (
    <TransitionProvider kind={KIND[direction]}>
      {direction === '1' && <D1Hilvan />}
      {direction === '2' && <D2Medida />}
      {direction === '3' && <D3Probador />}
      <Switcher current={direction} />
    </TransitionProvider>
  )
}
