// Shared by the server (authoritative) and the sale form (live preview), so both always agree.
// All amounts in integer cents; PVP is IVA-inclusive.

export const METODOS_PAGO = ['efectivo', 'tarjeta', 'bizum', 'transferencia', 'otro'] as const
export type MetodoPago = (typeof METODOS_PAGO)[number]

export const toCents = (value: unknown) => Math.round(Number(String(value ?? '').replace(',', '.')) * 100)

export interface LineaCalc {
  total: number
  base: number
  cuota: number
  descuento: number
}

export function calcularLinea(cantidad: number, pvpCents: number, descuentoPct: number, iva: number): LineaCalc {
  const bruto = Math.round(cantidad * pvpCents)
  const descuento = Math.round((bruto * descuentoPct) / 100)
  const total = bruto - descuento
  const base = Math.round(total / (1 + iva / 100))
  return { total, base, cuota: total - base, descuento }
}

// Base and IVA grouped by rate, as printed on the ticket
export function desgloseIva(lineas: { iva: number; base: number; cuota: number }[]) {
  const map = new Map<number, { base: number; cuota: number }>()
  for (const l of lineas) {
    const row = map.get(l.iva) ?? { base: 0, cuota: 0 }
    row.base += l.base
    row.cuota += l.cuota
    map.set(l.iva, row)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([iva, v]) => ({ iva, ...v }))
}
