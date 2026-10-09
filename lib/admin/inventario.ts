import type { PoolClient } from 'pg'
import { query } from '../db'
import { HttpError, pickFields, withTransaction, wordsMatch, type CurrentAdmin } from './server'
import { aplicarMovimientos, MOTIVOS_AJUSTE, UNIDADES, type MotivoAjuste } from './stock'
import { deleteFotos } from './fotos'

// Alert level of one variant (alias v). Materials reserved for encargos don't count as available.
// An agotado variant only alerts if someone cares about it: a minimum is set or it has ever moved.
export const ALERTA_SQL = `
  CASE
    WHEN v.stock_actual - v.stock_reservado <= 0
         AND (v.stock_minimo > 0 OR EXISTS (SELECT 1 FROM movimientos_stock ms WHERE ms.variante_id = v.id))
      THEN 'agotado'
    WHEN v.stock_minimo > 0 AND v.stock_actual - v.stock_reservado <= v.stock_minimo THEN 'bajo'
  END`

const num = (value: unknown, { min = 0, max = 1e9 } = {}) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(',', '.'))
  if (!Number.isFinite(n) || n < min || n > max) throw new HttpError(400, 'invalid number')
  return n
}

// ── Categorías ────────────────────────────────────────────────────────────────

export async function listCategorias() {
  const result = await query(
    `SELECT c.*, (SELECT COUNT(*) FROM productos p WHERE p.categoria_id = c.id AND p.activo)::int AS productos
       FROM categorias_producto c ORDER BY c.tipo DESC, c.orden, lower(c.nombre)`
  )
  return result.rows
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)
}

function categoriaFields(body: Record<string, unknown>) {
  const f = pickFields(body, ['nombre', 'tipo', 'unidad_defecto', 'iva_defecto', 'orden', 'activo', 'subtipos'] as const)
  if ('subtipos' in f) {
    // A list or a comma-separated string, deduplicated
    const raw = Array.isArray(f.subtipos) ? f.subtipos : String(f.subtipos ?? '').split(',')
    f.subtipos = JSON.stringify([...new Set(raw.map((x) => String(x).trim().slice(0, 60)).filter(Boolean))].slice(0, 30))
  }
  if ('nombre' in f && !f.nombre) throw new HttpError(400, 'nombre required')
  if ('tipo' in f && f.tipo !== 'terminado' && f.tipo !== 'material') throw new HttpError(400, 'invalid tipo')
  if ('unidad_defecto' in f && !UNIDADES.includes(f.unidad_defecto as never)) throw new HttpError(400, 'invalid unidad')
  if ('iva_defecto' in f) f.iva_defecto = num(f.iva_defecto, { max: 100 }) ?? 21
  if ('orden' in f) f.orden = num(f.orden, { max: 10000 }) ?? 0
  return f
}

export async function createCategoria(body: Record<string, unknown>) {
  const f = categoriaFields(body)
  if (!f.nombre || !f.tipo) throw new HttpError(400, 'nombre and tipo required')
  const slug = `${slugify(String(f.nombre))}${f.tipo === 'material' ? '-taller' : ''}-${Date.now().toString(36)}`
  const cols = ['slug', ...Object.keys(f)]
  const result = await query(
    `INSERT INTO categorias_producto (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
    [slug, ...Object.values(f)]
  )
  return result.rows[0]
}

export async function updateCategoria(id: number, body: Record<string, unknown>) {
  const f = categoriaFields(body)
  const cols = Object.keys(f)
  if (cols.length === 0) throw new HttpError(400, 'nothing to update')
  const result = await query(
    `UPDATE categorias_producto SET ${cols.map((c, i) => `${c} = $${i + 1}`).join(', ')}, updated_at = now()
     WHERE id = $${cols.length + 1} RETURNING *`,
    [...Object.values(f), id]
  )
  if (!result.rows[0]) throw new HttpError(404, 'not found')
  return result.rows[0]
}

// ── Productos ─────────────────────────────────────────────────────────────────

export interface ProductoFilters {
  q?: string
  categoria?: number
  proveedor?: number
  tipo?: 'terminado' | 'material'
  alerta?: 'bajo' | 'agotado' | 'cualquiera'
  archivados?: boolean
  offset?: number
}

export async function listProductos(f: ProductoFilters) {
  const params: unknown[] = []
  const p = (value: unknown) => (params.push(value), `$${params.length}`)
  const where = [f.archivados ? 'NOT p.activo' : 'p.activo']
  if (f.q) {
    // Product fields plus all its variants' SKUs and labels, so "oxford 42" finds the product
    where.push(wordsMatch(
      f.q,
      `lower(p.nombre || ' ' || coalesce(p.referencia, '') || ' ' || coalesce(p.marca, '') || ' ' || coalesce(p.subtipo, '') || ' ' ||
        coalesce((SELECT string_agg(coalesce(sv.sku, '') || ' ' || coalesce(sv.etiqueta, ''), ' ') FROM producto_variantes sv WHERE sv.producto_id = p.id), ''))`,
      params
    ))
  }
  if (f.categoria) where.push(`p.categoria_id = ${p(f.categoria)}`)
  if (f.proveedor) where.push(`p.proveedor_id = ${p(f.proveedor)}`)
  if (f.tipo) where.push(`c.tipo = ${p(f.tipo)}`)
  if (f.alerta === 'agotado') where.push('agg.agotados > 0')
  if (f.alerta === 'bajo') where.push('agg.bajos > 0')
  if (f.alerta === 'cualquiera') where.push('(agg.agotados > 0 OR agg.bajos > 0)')

  const result = await query(
    `SELECT p.id, p.nombre, p.referencia, p.marca, p.subtipo, p.unidad, p.pvp, p.foto_thumb_url,
            c.nombre AS categoria, c.tipo, pr.nombre AS proveedor,
            agg.variantes, agg.stock_total, agg.agotados, agg.bajos
       FROM productos p
       JOIN categorias_producto c ON c.id = p.categoria_id
       LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
       CROSS JOIN LATERAL (
         SELECT COUNT(*)::int AS variantes,
                COALESCE(SUM(v.stock_actual), 0) AS stock_total,
                COUNT(*) FILTER (WHERE v.alerta = 'agotado')::int AS agotados,
                COUNT(*) FILTER (WHERE v.alerta = 'bajo')::int AS bajos
           FROM (SELECT v.stock_actual, ${ALERTA_SQL} AS alerta
                   FROM producto_variantes v WHERE v.producto_id = p.id AND v.activo) v
       ) agg
      WHERE ${where.join(' AND ')}
      ORDER BY lower(p.nombre), p.id
      LIMIT 50 OFFSET ${p(f.offset ?? 0)}`,
    params
  )
  return result.rows
}

const PRODUCTO_FIELDS = [
  'categoria_id', 'nombre', 'referencia', 'marca', 'proveedor_id', 'descripcion', 'color', 'material', 'talla',
  'unidad', 'coste', 'pvp', 'iva', 'stock_minimo_defecto', 'ubicacion', 'foto_url', 'foto_thumb_url', 'observaciones', 'activo',
  'subtipo',
] as const

function productoFields(body: Record<string, unknown>) {
  const f = pickFields(body, PRODUCTO_FIELDS)
  if ('nombre' in f && !f.nombre) throw new HttpError(400, 'nombre required')
  if ('unidad' in f && !UNIDADES.includes(f.unidad as never)) throw new HttpError(400, 'invalid unidad')
  for (const key of ['coste', 'pvp', 'stock_minimo_defecto'] as const) if (key in f) f[key] = num(f[key])
  if ('iva' in f) f.iva = num(f.iva, { max: 100 }) ?? 21
  if ('categoria_id' in f) f.categoria_id = num(f.categoria_id, { min: 1 })
  if ('proveedor_id' in f) f.proveedor_id = num(f.proveedor_id, { min: 1 })
  return f
}

export interface VarianteInput {
  atributos?: Record<string, string>
  etiqueta?: string
  sku?: string
  stock_inicial?: number | string
  stock_minimo?: number | string
  pvp?: number | string | null
  coste?: number | string | null
  ubicacion?: string
}

function varianteRow(v: VarianteInput, defaults: { stock_minimo: unknown; ubicacion: unknown }, orden: number) {
  const atributos: Record<string, string> = {}
  for (const [k, val] of Object.entries(v.atributos ?? {})) {
    if (k.trim() && String(val).trim()) atributos[k.trim().toLowerCase().slice(0, 30)] = String(val).trim().slice(0, 60)
  }
  return {
    atributos,
    etiqueta: v.etiqueta?.trim() || Object.values(atributos).join(' · ') || null,
    sku: v.sku?.trim() || null,
    stock_minimo: num(v.stock_minimo) ?? defaults.stock_minimo ?? 0,
    pvp: num(v.pvp),
    coste: num(v.coste),
    ubicacion: v.ubicacion?.trim() || defaults.ubicacion || null,
    orden,
    stockInicial: num(v.stock_inicial) ?? 0,
  }
}

async function insertVariantes(
  client: PoolClient,
  producto: { id: number; coste: string | null; stock_minimo_defecto: unknown; ubicacion: unknown },
  variantes: VarianteInput[],
  admin: CurrentAdmin,
  opts: { esUnica: boolean; ordenBase: number }
) {
  const rows = variantes.map((v, i) =>
    varianteRow(v, { stock_minimo: producto.stock_minimo_defecto, ubicacion: producto.ubicacion }, opts.ordenBase + i)
  )
  const inserted: { id: number; stockInicial: number; coste: number | null }[] = []
  for (const r of rows) {
    const res = await client.query(
      `INSERT INTO producto_variantes (producto_id, atributos, etiqueta, sku, es_unica, stock_minimo, pvp, coste, ubicacion, orden)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [producto.id, JSON.stringify(r.atributos), r.etiqueta, r.sku, opts.esUnica, r.stock_minimo, r.pvp, r.coste, r.ubicacion, r.orden]
    )
    inserted.push({ id: res.rows[0].id, stockInicial: r.stockInicial, coste: r.coste })
  }
  const iniciales = inserted.filter((v) => v.stockInicial > 0)
  await aplicarMovimientos(
    client,
    iniciales.map((v) => ({
      varianteId: v.id,
      tipo: 'inicial' as const,
      cantidad: v.stockInicial,
      costeUnitario: v.coste ?? (producto.coste === null ? null : Number(producto.coste)),
    })),
    admin
  )
  return inserted
}

export async function createProducto(body: Record<string, unknown>, admin: CurrentAdmin) {
  const f = productoFields(body)
  if (!f.nombre || !f.categoria_id) throw new HttpError(400, 'nombre and categoria required')
  const variantes = Array.isArray(body.variantes) ? (body.variantes as VarianteInput[]) : []
  if (variantes.length > 200) throw new HttpError(400, 'too many variants')

  return withTransaction(async (client) => {
    const cat = (await client.query(`SELECT unidad_defecto, iva_defecto FROM categorias_producto WHERE id = $1`, [f.categoria_id])).rows[0]
    if (!cat) throw new HttpError(400, 'invalid categoria')
    const fields: Record<string, unknown> = { unidad: cat.unidad_defecto, iva: cat.iva_defecto, ...f, created_by: admin.id }
    const cols = Object.keys(fields)
    const producto = (
      await client.query(
        `INSERT INTO productos (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
        Object.values(fields)
      )
    ).rows[0]

    if (variantes.length === 0) {
      await insertVariantes(client, producto, [{ sku: producto.referencia ?? undefined, stock_inicial: body.stock_inicial as number }], admin, { esUnica: true, ordenBase: 0 })
    } else {
      await insertVariantes(client, producto, variantes, admin, { esUnica: false, ordenBase: 0 })
    }
    return producto
  })
}

export async function getProducto(id: number) {
  const producto = (
    await query(
      `SELECT p.*, c.nombre AS categoria, c.tipo, pr.nombre AS proveedor,
              EXISTS (SELECT 1 FROM movimientos_stock m JOIN producto_variantes v ON v.id = m.variante_id WHERE v.producto_id = p.id) AS tiene_movimientos
         FROM productos p JOIN categorias_producto c ON c.id = p.categoria_id
         LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
        WHERE p.id = $1`,
      [id]
    )
  ).rows[0]
  if (!producto) throw new HttpError(404, 'not found')
  const variantes = await query(
    `SELECT v.*, ${ALERTA_SQL} AS alerta FROM producto_variantes v WHERE v.producto_id = $1 ORDER BY v.activo DESC, v.orden, v.id`,
    [id]
  )
  return { producto, variantes: variantes.rows }
}

export async function updateProducto(id: number, body: Record<string, unknown>) {
  const f = productoFields(body)
  const cols = Object.keys(f)
  if (cols.length === 0) throw new HttpError(400, 'nothing to update')

  const { producto, oldFotos } = await withTransaction(async (client) => {
    const before = (await client.query(`SELECT * FROM productos WHERE id = $1 FOR UPDATE`, [id])).rows[0]
    if (!before) throw new HttpError(404, 'not found')
    if ('unidad' in f && f.unidad !== before.unidad) {
      const moved = await client.query(
        `SELECT 1 FROM movimientos_stock m JOIN producto_variantes v ON v.id = m.variante_id WHERE v.producto_id = $1 LIMIT 1`,
        [id]
      )
      if (moved.rowCount) throw new HttpError(409, 'unidad locked')
    }
    const updated = (
      await client.query(
        `UPDATE productos SET ${cols.map((c, i) => `${c} = $${i + 1}`).join(', ')}, updated_at = now() WHERE id = $${cols.length + 1} RETURNING *`,
        [...Object.values(f), id]
      )
    ).rows[0]
    // A single-variant product keeps its variant's SKU in step with the reference
    if ('referencia' in f) {
      await client.query(`UPDATE producto_variantes SET sku = $2, updated_at = now() WHERE producto_id = $1 AND es_unica`, [id, f.referencia])
    }
    const replaced = [before.foto_url, before.foto_thumb_url].filter((u) => u && u !== updated.foto_url && u !== updated.foto_thumb_url)
    return { producto: updated, oldFotos: replaced }
  })

  await deleteFotos(oldFotos)
  return producto
}

// ── Variantes ─────────────────────────────────────────────────────────────────

export async function addVariantes(productoId: number, variantes: VarianteInput[], admin: CurrentAdmin) {
  if (!Array.isArray(variantes) || variantes.length === 0 || variantes.length > 200) throw new HttpError(400, 'invalid variantes')
  return withTransaction(async (client) => {
    const producto = (await client.query(`SELECT * FROM productos WHERE id = $1 FOR UPDATE`, [productoId])).rows[0]
    if (!producto) throw new HttpError(404, 'not found')

    // Going from "no variants" to real ones: drop the placeholder if it never moved, else keep it as a normal variant
    const unica = (await client.query(`SELECT id FROM producto_variantes WHERE producto_id = $1 AND es_unica`, [productoId])).rows[0]
    if (unica) {
      const moved = await client.query(`SELECT 1 FROM movimientos_stock WHERE variante_id = $1 LIMIT 1`, [unica.id])
      if (moved.rowCount) {
        await client.query(`UPDATE producto_variantes SET es_unica = FALSE, updated_at = now() WHERE id = $1`, [unica.id])
      } else {
        await client.query(`DELETE FROM producto_variantes WHERE id = $1`, [unica.id])
      }
    }

    const maxOrden = (await client.query(`SELECT COALESCE(MAX(orden), -1) AS m FROM producto_variantes WHERE producto_id = $1`, [productoId])).rows[0].m
    return insertVariantes(client, producto, variantes, admin, { esUnica: false, ordenBase: maxOrden + 1 })
  })
}

export async function updateVariante(id: number, body: Record<string, unknown>) {
  const f = pickFields(body, ['sku', 'etiqueta', 'atributos', 'pvp', 'coste', 'stock_minimo', 'ubicacion', 'orden', 'activo'] as const)
  for (const key of ['pvp', 'coste'] as const) if (key in f) f[key] = num(f[key])
  if ('stock_minimo' in f) f.stock_minimo = num(f.stock_minimo) ?? 0
  if ('orden' in f) f.orden = num(f.orden, { max: 10000 }) ?? 0
  if ('atributos' in f) f.atributos = JSON.stringify(f.atributos ?? {})
  const cols = Object.keys(f)
  if (cols.length === 0) throw new HttpError(400, 'nothing to update')
  const result = await query(
    `UPDATE producto_variantes SET ${cols.map((c, i) => `${c} = $${i + 1}`).join(', ')}, updated_at = now() WHERE id = $${cols.length + 1} RETURNING *`,
    [...Object.values(f), id]
  )
  if (!result.rows[0]) throw new HttpError(404, 'not found')
  return result.rows[0]
}

// For pickers (entradas now, ventas and encargos later)
export async function buscarVariantes(q: string, opts: { tipo?: 'terminado' | 'material' } = {}) {
  const params: unknown[] = []
  const match = wordsMatch(
    q,
    `lower(p.nombre || ' ' || coalesce(p.referencia, '') || ' ' || coalesce(p.marca, '') || ' ' || coalesce(v.sku, '') || ' ' || coalesce(v.etiqueta, ''))`,
    params
  )
  const tipoFilter = opts.tipo ? `AND c.tipo = $${params.push(opts.tipo)}` : ''
  const result = await query(
    `SELECT v.id, v.etiqueta, v.sku, v.stock_actual, v.stock_reservado, v.es_unica,
            COALESCE(v.pvp, p.pvp) AS pvp, COALESCE(v.coste, p.coste) AS coste, v.coste_medio,
            p.id AS producto_id, p.nombre AS producto, p.referencia, p.unidad, p.iva, p.proveedor_id, p.foto_thumb_url,
            c.tipo
       FROM producto_variantes v
       JOIN productos p ON p.id = v.producto_id
       JOIN categorias_producto c ON c.id = p.categoria_id
      WHERE v.activo AND p.activo ${tipoFilter}
        AND ${match}
      ORDER BY lower(p.nombre), v.orden
      LIMIT 30`,
    params
  )
  return result.rows
}

// ── Ajustes, historial, alertas ───────────────────────────────────────────────

export async function ajustarStock(body: Record<string, unknown>, admin: CurrentAdmin) {
  const varianteId = num(body.varianteId, { min: 1 })
  const cantidad = num(body.cantidad, { min: -1e9 })
  const motivo = body.motivo as MotivoAjuste
  if (!varianteId || cantidad === null) throw new HttpError(400, 'invalid ajuste')
  if (!MOTIVOS_AJUSTE.includes(motivo)) throw new HttpError(400, 'motivo required')
  const modo = body.modo === 'recuento' ? 'recuento' : 'delta'
  if (modo === 'recuento' && cantidad < 0) throw new HttpError(400, 'invalid quantity')

  return withTransaction(async (client) => {
    const v = (await client.query(`SELECT stock_actual FROM producto_variantes WHERE id = $1 FOR UPDATE`, [varianteId])).rows[0]
    if (!v) throw new HttpError(404, 'variant not found')
    // A count is entered as "what's on the shelf"; the ledger stores the difference
    const delta = modo === 'recuento' ? Math.round((cantidad - Number(v.stock_actual)) * 1000) / 1000 : cantidad
    if (delta === 0) return { movimiento: null, sinCambios: true }
    const [movimiento] = await aplicarMovimientos(
      client,
      [{ varianteId, tipo: 'ajuste', cantidad: delta, motivo, nota: (body.nota as string) ?? null }],
      admin
    )
    return { movimiento, sinCambios: false }
  })
}

export async function getMovimientos(productoId: number, opts: { varianteId?: number; offset?: number }) {
  const params: unknown[] = [productoId]
  const varFilter = opts.varianteId ? `AND m.variante_id = $${params.push(opts.varianteId)}` : ''
  params.push(opts.offset ?? 0)
  const result = await query(
    `SELECT m.id, m.variante_id, m.tipo, m.cantidad, m.stock_resultante, m.coste_unitario, m.motivo, m.nota,
            m.admin_nombre, m.created_at, v.etiqueta, v.es_unica,
            co.id AS compra_id, co.numero AS compra_numero
       FROM movimientos_stock m
       JOIN producto_variantes v ON v.id = m.variante_id
       LEFT JOIN compra_lineas cl ON cl.id = m.compra_linea_id
       LEFT JOIN compras co ON co.id = cl.compra_id
      WHERE v.producto_id = $1 ${varFilter}
      ORDER BY m.created_at DESC, m.id DESC
      LIMIT 100 OFFSET $${params.length}`,
    params
  )
  return result.rows
}

export async function getAlertas(limit = 100) {
  const result = await query(
    `SELECT * FROM (
       SELECT v.id AS variante_id, v.etiqueta, v.es_unica, v.stock_actual, v.stock_reservado, v.stock_minimo,
              p.id AS producto_id, p.nombre AS producto, p.unidad, c.tipo, c.nombre AS categoria, v.sku, ${ALERTA_SQL} AS alerta
         FROM producto_variantes v
         JOIN productos p ON p.id = v.producto_id
         JOIN categorias_producto c ON c.id = p.categoria_id
        WHERE v.activo AND p.activo AND v.stock_actual - v.stock_reservado <= v.stock_minimo
     ) a
     WHERE a.alerta IS NOT NULL
     ORDER BY a.alerta = 'agotado' DESC, lower(a.producto), a.variante_id`
  )
  const rows = result.rows
  return {
    agotados: rows.filter((r) => r.alerta === 'agotado').length,
    bajos: rows.filter((r) => r.alerta === 'bajo').length,
    items: rows.slice(0, limit),
  }
}
