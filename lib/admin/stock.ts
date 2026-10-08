import type { PoolClient } from 'pg'
import { HttpError, type CurrentAdmin } from './server'

// The only code path that changes stock. Always call inside withTransaction(), together
// with the business rows (compra, venta…) the movements belong to. See docs/gestion-data-model.md §4.3.

export type TipoMovimiento =
  | 'inicial' | 'compra' | 'devolucion_proveedor' | 'venta' | 'devolucion_venta'
  | 'ajuste' | 'consumo_encargo' | 'devolucion_encargo'

export const MOTIVOS_AJUSTE = ['recuento', 'rotura', 'merma', 'regalo', 'uso_interno', 'error', 'otro'] as const
export type MotivoAjuste = (typeof MOTIVOS_AJUSTE)[number]

// Units that may hold fractional quantities (tejidos and forros sold by the metre)
export const UNIDADES = ['ud', 'par', 'm', 'bobina', 'caja', 'juego'] as const
export const UNIDADES_DECIMALES: readonly string[] = ['m']

export interface MovimientoInput {
  varianteId: number
  tipo: TipoMovimiento
  cantidad: number // signed: + in, − out
  costeUnitario?: number | null
  motivo?: MotivoAjuste | null
  nota?: string | null
  compraLineaId?: number
  ventaLineaId?: number
  devolucionLineaId?: number
  encargoMaterialId?: number
}

export interface MovimientoAplicado {
  id: number
  varianteId: number
  cantidad: string
  stockResultante: string
}

// NUMERIC(12,3) values compared as integer thousandths, so 0.1 + 0.2 never matters
const milli = (value: string | number) => Math.round(Number(value) * 1000)

export function validarCantidad(cantidad: number, unidad: string) {
  if (!Number.isFinite(cantidad) || cantidad === 0) throw new HttpError(400, 'invalid quantity')
  if (Math.abs(cantidad) >= 1e9) throw new HttpError(400, 'invalid quantity')
  if (Math.abs(cantidad * 1000 - milli(cantidad)) > 1e-6) throw new HttpError(400, 'too many decimals')
  if (!UNIDADES_DECIMALES.includes(unidad) && !Number.isInteger(cantidad)) {
    throw new HttpError(400, 'whole units only')
  }
}

export async function aplicarMovimientos(
  client: PoolClient,
  movimientos: MovimientoInput[],
  admin: CurrentAdmin
): Promise<MovimientoAplicado[]> {
  if (movimientos.length === 0) return []

  // Lock every touched variant in id order, so two concurrent documents can't deadlock
  const ids = [...new Set(movimientos.map((m) => m.varianteId))].sort((a, b) => a - b)
  const locked = await client.query(
    `SELECT v.id, v.stock_actual, v.stock_reservado, v.activo, p.unidad, p.nombre, v.etiqueta
       FROM producto_variantes v JOIN productos p ON p.id = v.producto_id
      WHERE v.id = ANY($1::int[])
      ORDER BY v.id
      FOR UPDATE OF v`,
    [ids]
  )
  const variantes = new Map(locked.rows.map((r) => [r.id as number, r]))

  // Check the whole document before writing anything
  const stock = new Map(locked.rows.map((r) => [r.id as number, milli(r.stock_actual)]))
  for (const m of movimientos) {
    const v = variantes.get(m.varianteId)
    if (!v) throw new HttpError(404, 'variant not found', { varianteId: m.varianteId })
    validarCantidad(m.cantidad, v.unidad)
    if (m.tipo === 'ajuste' && !m.motivo) throw new HttpError(400, 'motivo required')
    const next = stock.get(m.varianteId)! + milli(m.cantidad)
    if (next < 0) {
      throw new HttpError(409, 'insufficient stock', {
        varianteId: m.varianteId,
        producto: v.nombre,
        variante: v.etiqueta,
        disponible: stock.get(m.varianteId)! / 1000,
        unidad: v.unidad,
      })
    }
    stock.set(m.varianteId, next)
  }

  const applied: MovimientoAplicado[] = []
  for (const m of movimientos) {
    // Exact decimal math in SQL. Purchases fold into the weighted average cost.
    const updated = await client.query(
      `UPDATE producto_variantes SET
         coste_medio = CASE
           WHEN $3::numeric IS NOT NULL AND $4 IN ('compra', 'inicial') THEN
             CASE WHEN stock_actual <= 0 OR coste_medio IS NULL THEN $3::numeric
                  ELSE (stock_actual * coste_medio + $2::numeric * $3::numeric) / (stock_actual + $2::numeric) END
           ELSE coste_medio END,
         stock_actual = stock_actual + $2::numeric,
         updated_at = now()
       WHERE id = $1
       RETURNING stock_actual, coste_medio`,
      [m.varianteId, m.cantidad, m.costeUnitario ?? null, m.tipo]
    )
    const row = updated.rows[0]
    const inserted = await client.query(
      `INSERT INTO movimientos_stock
         (variante_id, tipo, cantidad, stock_resultante, coste_unitario, motivo, nota, admin_id, admin_nombre,
          compra_linea_id, venta_linea_id, devolucion_linea_id, encargo_material_id)
       VALUES ($1, $2, $3, $4, COALESCE($5::numeric, $6::numeric), $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        m.varianteId, m.tipo, m.cantidad, row.stock_actual, m.costeUnitario ?? null, row.coste_medio,
        m.motivo ?? null, m.nota?.trim() || null, admin.id, admin.name,
        m.compraLineaId ?? null, m.ventaLineaId ?? null, m.devolucionLineaId ?? null, m.encargoMaterialId ?? null,
      ]
    )
    applied.push({ id: inserted.rows[0].id, varianteId: m.varianteId, cantidad: String(m.cantidad), stockResultante: row.stock_actual })
  }
  return applied
}

export async function siguienteNumero(client: PoolClient, serie: string, fecha = new Date()) {
  const anio = Number(new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Europe/Madrid' }).format(fecha))
  const result = await client.query(
    `INSERT INTO contadores (serie, anio, ultimo) VALUES ($1, $2, 1)
     ON CONFLICT (serie, anio) DO UPDATE SET ultimo = contadores.ultimo + 1
     RETURNING ultimo`,
    [serie, anio]
  )
  return `${serie}-${anio}-${String(result.rows[0].ultimo).padStart(4, '0')}`
}
