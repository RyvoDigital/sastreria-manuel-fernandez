import { query } from '../db'
import { HttpError } from './server'
import { ALERTA_SQL } from './inventario'

// Read-only management reports. Each returns plain rows; the screen renders them and builds the CSV
// in the browser, so column labels stay in the admin i18n file.

const MAX_ROWS = 20000
const DATE = /^\d{4}-\d{2}-\d{2}$/

function rango(desde?: string, hasta?: string) {
  if (!desde || !hasta || !DATE.test(desde) || !DATE.test(hasta)) throw new HttpError(400, 'invalid dates')
  if (desde > hasta) throw new HttpError(400, 'invalid dates')
  return { desde, hasta }
}

// Day boundaries in Madrid time, whatever the server's timezone
const DESDE_SQL = (p: string) => `(${p}::date AT TIME ZONE 'Europe/Madrid')`
const HASTA_SQL = (p: string) => `((${p}::date + 1) AT TIME ZONE 'Europe/Madrid')`

export interface Filtros {
  tipo?: 'terminado' | 'material'
  categoria?: number
  desde?: string
  hasta?: string
  tipoMovimiento?: string
  usuario?: number
  agrupar?: string
  conStock?: boolean
}

// ── Stock actual (one row per active variant) ────────────────────────────────

export async function informeStock(f: Filtros) {
  const params: unknown[] = []
  const where = ['p.activo', 'v.activo']
  if (f.tipo) where.push(`c.tipo = $${params.push(f.tipo)}`)
  if (f.categoria) where.push(`c.id = $${params.push(f.categoria)}`)
  if (f.conStock) where.push('v.stock_actual > 0')
  const result = await query(
    `SELECT p.id AS producto_id, p.nombre AS producto, CASE WHEN v.es_unica THEN NULL ELSE v.etiqueta END AS variante,
            v.sku, c.nombre AS categoria, c.tipo, COALESCE(v.ubicacion, p.ubicacion) AS ubicacion, p.unidad,
            v.stock_actual AS stock, v.stock_reservado AS reservado, v.stock_minimo AS minimo,
            COALESCE(v.coste_medio, v.coste, p.coste) AS coste_unitario,
            ROUND(v.stock_actual * COALESCE(v.coste_medio, v.coste, p.coste, 0), 2) AS valor_coste,
            COALESCE(v.pvp, p.pvp) AS pvp,
            ROUND(v.stock_actual * COALESCE(v.pvp, p.pvp, 0), 2) AS valor_pvp,
            ${ALERTA_SQL} AS alerta
       FROM producto_variantes v
       JOIN productos p ON p.id = v.producto_id
       JOIN categorias_producto c ON c.id = p.categoria_id
      WHERE ${where.join(' AND ')}
      ORDER BY c.tipo DESC, c.orden, lower(p.nombre), v.orden
      LIMIT ${MAX_ROWS}`,
    params
  )
  return result.rows
}

// ── Valoración del inventario (by category) ──────────────────────────────────

export async function informeValoracion(f: Filtros) {
  const params: unknown[] = []
  const where = ['p.activo', 'v.activo']
  if (f.tipo) where.push(`c.tipo = $${params.push(f.tipo)}`)
  const result = await query(
    `SELECT c.id AS categoria_id, c.nombre AS categoria, c.tipo,
            COUNT(DISTINCT p.id)::int AS productos,
            COUNT(*) FILTER (WHERE v.stock_actual > 0)::int AS variantes_con_stock,
            ROUND(SUM(v.stock_actual * COALESCE(v.coste_medio, v.coste, p.coste, 0)), 2) AS valor_coste,
            ROUND(SUM(v.stock_actual * COALESCE(v.pvp, p.pvp, 0)), 2) AS valor_pvp,
            ROUND(SUM(v.stock_actual * COALESCE(v.pvp, p.pvp, 0) / (1 + p.iva / 100)), 2) AS valor_pvp_base,
            COUNT(*) FILTER (WHERE v.stock_actual > 0 AND COALESCE(v.coste_medio, v.coste, p.coste) IS NULL)::int AS sin_coste
       FROM producto_variantes v
       JOIN productos p ON p.id = v.producto_id
       JOIN categorias_producto c ON c.id = p.categoria_id
      WHERE ${where.join(' AND ')}
      GROUP BY c.id
      HAVING SUM(v.stock_actual) > 0
      ORDER BY c.tipo DESC, c.orden, lower(c.nombre)`,
    params
  )
  // Potential margin = what the stock would bring in, net of IVA, minus what it cost
  return result.rows.map((r) => ({ ...r, margen_potencial: (Number(r.valor_pvp_base) - Number(r.valor_coste)).toFixed(2) }))
}

// ── Movimientos in a date range ──────────────────────────────────────────────

export async function informeMovimientos(f: Filtros) {
  const { desde, hasta } = rango(f.desde, f.hasta)
  const params: unknown[] = [desde, hasta]
  const where = [`m.created_at >= ${DESDE_SQL('$1')}`, `m.created_at < ${HASTA_SQL('$2')}`]
  if (f.tipo) where.push(`c.tipo = $${params.push(f.tipo)}`)
  if (f.categoria) where.push(`c.id = $${params.push(f.categoria)}`)
  if (f.tipoMovimiento) where.push(`m.tipo = $${params.push(f.tipoMovimiento)}`)
  if (f.usuario) where.push(`m.admin_id = $${params.push(f.usuario)}`)
  const result = await query(
    `SELECT m.id, m.created_at AS fecha, p.id AS producto_id, p.nombre AS producto,
            CASE WHEN v.es_unica THEN NULL ELSE v.etiqueta END AS variante, v.sku, c.nombre AS categoria,
            m.tipo, m.cantidad, p.unidad, m.stock_resultante, m.coste_unitario,
            ROUND(m.cantidad * COALESCE(m.coste_unitario, 0), 2) AS valor_coste,
            m.admin_nombre AS usuario, m.motivo, m.nota,
            COALESCE(co.numero, ve.numero, de.numero) AS documento,
            COALESCE(co.id, ve.id, dv.id) AS documento_id,
            CASE WHEN co.id IS NOT NULL THEN 'compra' WHEN ve.id IS NOT NULL OR de.id IS NOT NULL THEN 'venta' END AS documento_tipo
       FROM movimientos_stock m
       JOIN producto_variantes v ON v.id = m.variante_id
       JOIN productos p ON p.id = v.producto_id
       JOIN categorias_producto c ON c.id = p.categoria_id
       LEFT JOIN compra_lineas cl ON cl.id = m.compra_linea_id
       LEFT JOIN compras co ON co.id = cl.compra_id
       LEFT JOIN venta_lineas vl ON vl.id = m.venta_linea_id
       LEFT JOIN ventas ve ON ve.id = vl.venta_id
       LEFT JOIN devolucion_lineas dl ON dl.id = m.devolucion_linea_id
       LEFT JOIN devoluciones de ON de.id = dl.devolucion_id
       LEFT JOIN ventas dv ON dv.id = de.venta_id
      WHERE ${where.join(' AND ')}
      ORDER BY m.created_at DESC, m.id DESC
      LIMIT ${MAX_ROWS}`,
    params
  )
  return result.rows
}

// ── Ventas, net of returns, grouped ──────────────────────────────────────────

export const AGRUPACIONES = ['dia', 'mes', 'producto', 'categoria', 'cliente', 'metodo', 'vendedor'] as const

export async function informeVentas(f: Filtros) {
  const { desde, hasta } = rango(f.desde, f.hasta)
  const agrupar = (AGRUPACIONES as readonly string[]).includes(f.agrupar ?? '') ? f.agrupar! : 'dia'
  const grupo: Record<string, { key: string; label: string; order: string }> = {
    dia: { key: `to_char(ve.fecha AT TIME ZONE 'Europe/Madrid', 'YYYY-MM-DD')`, label: `to_char(ve.fecha AT TIME ZONE 'Europe/Madrid', 'YYYY-MM-DD')`, order: 'grupo DESC' },
    mes: { key: `to_char(ve.fecha AT TIME ZONE 'Europe/Madrid', 'YYYY-MM')`, label: `to_char(ve.fecha AT TIME ZONE 'Europe/Madrid', 'YYYY-MM')`, order: 'grupo DESC' },
    producto: { key: `COALESCE(p.id::text, 'libre:' || l.descripcion)`, label: `COALESCE(p.nombre, l.descripcion)`, order: 'total DESC' },
    categoria: { key: `COALESCE(c.id::text, '-')`, label: `c.nombre`, order: 'total DESC' },
    cliente: { key: `COALESCE(cl.id::text, '-')`, label: `trim(cl.nombre || ' ' || coalesce(cl.apellidos, ''))`, order: 'total DESC' },
    metodo: { key: `ve.metodo_pago`, label: `ve.metodo_pago`, order: 'total DESC' },
    vendedor: { key: `COALESCE(ve.admin_nombre, '-')`, label: `ve.admin_nombre`, order: 'total DESC' },
  }
  const g = grupo[agrupar]
  const params: unknown[] = [desde, hasta]
  const where = [`ve.fecha >= ${DESDE_SQL('$1')}`, `ve.fecha < ${HASTA_SQL('$2')}`]
  if (f.tipo) where.push(`c.tipo = $${params.push(f.tipo)}`)
  if (f.categoria) where.push(`c.id = $${params.push(f.categoria)}`)

  // Line level first: returns are netted against the sale they belong to (by sale date)
  const result = await query(
    `WITH lineas AS (
       SELECT ${g.key} AS grupo_key, ${g.label} AS grupo, ve.id AS venta_id,
              l.cantidad - l.cantidad_devuelta AS unidades,
              l.total AS bruto,
              COALESCE((SELECT SUM(dl.importe) FROM devolucion_lineas dl WHERE dl.venta_linea_id = l.id), 0) AS devuelto,
              l.iva, l.coste_unitario,
              p.id AS producto_id, cl.id AS cliente_id, c.id AS categoria_id
         FROM venta_lineas l
         JOIN ventas ve ON ve.id = l.venta_id
         LEFT JOIN producto_variantes v ON v.id = l.variante_id
         LEFT JOIN productos p ON p.id = v.producto_id
         LEFT JOIN categorias_producto c ON c.id = p.categoria_id
         LEFT JOIN clientes cl ON cl.id = ve.cliente_id
        WHERE ${where.join(' AND ')}
     ), netas AS (
       SELECT *, bruto - devuelto AS total_neto,
              ROUND((bruto - devuelto) / (1 + iva / 100), 2) AS base_neta,
              ROUND(unidades * coste_unitario, 2) AS coste
         FROM lineas
     )
     SELECT grupo_key, grupo,
            MAX(producto_id) AS producto_id, MAX(cliente_id) AS cliente_id, MAX(categoria_id) AS categoria_id,
            COUNT(DISTINCT venta_id)::int AS ventas,
            SUM(unidades) AS unidades,
            SUM(bruto) AS bruto,
            SUM(devuelto) AS devuelto,
            SUM(total_neto) AS total,
            SUM(base_neta) AS base,
            SUM(total_neto) - SUM(base_neta) AS iva,
            SUM(coste) AS coste,
            SUM(base_neta) - COALESCE(SUM(coste), 0) AS margen,
            BOOL_OR(coste_unitario IS NULL AND producto_id IS NOT NULL) AS coste_incompleto
       FROM netas
      GROUP BY grupo_key, grupo
      ORDER BY ${g.order}
      LIMIT ${MAX_ROWS}`,
    params
  )
  return { agrupar, rows: result.rows }
}

// ── Panel key numbers ────────────────────────────────────────────────────────

export async function panelKpis() {
  const result = await query(`
    WITH hoy AS (SELECT (now() AT TIME ZONE 'Europe/Madrid')::date AS d),
    netas AS (
      SELECT ve.fecha, ve.total - COALESCE((SELECT SUM(d.importe_total) FROM devoluciones d WHERE d.venta_id = ve.id), 0) AS neto
        FROM ventas ve
       WHERE ve.fecha >= (date_trunc('month', (SELECT d FROM hoy)) AT TIME ZONE 'Europe/Madrid')
    )
    SELECT
      (SELECT COALESCE(SUM(neto), 0) FROM netas WHERE fecha >= ((SELECT d FROM hoy) AT TIME ZONE 'Europe/Madrid')) AS ventas_hoy,
      (SELECT COUNT(*) FROM netas WHERE fecha >= ((SELECT d FROM hoy) AT TIME ZONE 'Europe/Madrid'))::int AS tickets_hoy,
      (SELECT COALESCE(SUM(neto), 0) FROM netas) AS ventas_mes,
      (SELECT COUNT(*) FROM netas)::int AS tickets_mes,
      (SELECT COALESCE(ROUND(SUM(v.stock_actual * COALESCE(v.coste_medio, v.coste, p.coste, 0)), 2), 0)
         FROM producto_variantes v JOIN productos p ON p.id = v.producto_id WHERE v.activo AND p.activo) AS valor_inventario,
      (SELECT COUNT(*) FROM clientes WHERE created_at >= (date_trunc('month', (SELECT d FROM hoy)) AT TIME ZONE 'Europe/Madrid'))::int AS clientes_nuevos_mes,
      (SELECT COUNT(*) FROM bookings WHERE date >= (SELECT d FROM hoy) AND date < (SELECT d FROM hoy) + 7 AND status = 'confirmed')::int AS citas_7_dias
  `)
  return result.rows[0]
}
