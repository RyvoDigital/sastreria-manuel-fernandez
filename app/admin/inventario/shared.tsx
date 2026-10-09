'use client'

import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge, inputClass, intlLocale, useApi } from '../_components/ui'

export interface Categoria {
  id: number
  nombre: string
  tipo: 'terminado' | 'material'
  unidad_defecto: string
  iva_defecto: string
  orden: number
  activo: boolean
  productos: number
  subtipos: string[]
}

// Locations come from Ajustes → Listas; a value saved before the list existed stays selectable
export function UbicacionSelect({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const { data } = useApi<{ items: { id: number; nombre: string; activo: boolean }[] }>('/api/admin/listas/ubicaciones')
  const nombres = (data?.items ?? []).filter((u) => u.activo).map((u) => u.nombre)
  if (value && !nombres.includes(value)) nombres.push(value)
  return (
    <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">—</option>
      {nombres.map((n) => <option key={n} value={n}>{n}</option>)}
    </select>
  )
}

export interface ProveedorOption {
  id: number
  nombre: string
}

export type Alerta = 'agotado' | 'bajo' | null

// NUMERIC columns arrive as strings like "12.500"; show them without trailing zeros
export function formatQty(value: string | number | null | undefined, locale: string) {
  if (value === null || value === undefined || value === '') return '—'
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 3 }).format(Number(value))
}

export function AlertaBadge({ alerta }: { alerta: Alerta }) {
  const { t } = useAdminI18n()
  if (!alerta) return null
  return <Badge tone={alerta === 'agotado' ? 'red' : 'amber'}>{t.inventario.alertas[alerta]}</Badge>
}

export function TipoBadge({ tipo }: { tipo: 'terminado' | 'material' }) {
  const { t } = useAdminI18n()
  return <Badge tone={tipo === 'material' ? 'neutral' : 'gold'}>{t.inventario.tipos[tipo]}</Badge>
}

export function useUnidad() {
  const { t, locale } = useAdminI18n()
  return (cantidad: string | number | null | undefined, unidad: string) =>
    `${formatQty(cantidad, locale)} ${t.inventario.unidades[unidad as keyof typeof t.inventario.unidades] ?? unidad}`
}

export function errorMessage(t: ReturnType<typeof useAdminI18n>['t'], error: unknown) {
  const code = (error as Error).message
  return (t.inventario.errors as Record<string, string>)[code] ?? t.gestionCommon.error
}

// Expands "38-48" into 38…48, otherwise splits a comma list
export function expandValores(input: string): string[] {
  const range = input.trim().match(/^(\d+(?:[.,]5)?)\s*[-–a]\s*(\d+(?:[.,]5)?)$/)
  if (range) {
    const from = Number(range[1].replace(',', '.'))
    const to = Number(range[2].replace(',', '.'))
    const step = range[1].match(/[.,]5$/) || range[2].match(/[.,]5$/) ? 0.5 : 1
    if (to >= from && (to - from) / step <= 100) {
      const out: string[] = []
      for (let v = from; v <= to + 1e-9; v += step) out.push(String(v).replace('.', ','))
      return out
    }
  }
  return [...new Set(input.split(',').map((s) => s.trim()).filter(Boolean))]
}

export function skuFor(referencia: string, valores: string[]) {
  if (!referencia.trim()) return ''
  return [referencia.trim(), ...valores].map((s) => s.toUpperCase().replace(/\s+/g, '')).join('-')
}
