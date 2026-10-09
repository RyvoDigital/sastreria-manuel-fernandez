import type { PoolClient } from 'pg'
import { query } from '../db'
import { HttpError, esPropietario, withTransaction, wordsMatch, type CurrentAdmin } from './server'
import { aplicarMovimientos, siguienteNumero, validarCantidad } from './stock'
import { limpiarCaracteristicas } from './medidas'
import { METODOS_PAGO, toCents } from './ventas-calc'

// Encargos (bespoke orders). See docs/gestion-data-model.md, "Encargos y Taller".
// Three kinds, each with its own list in the ficha del cliente. Money (total, pagos) is Propietario-only;
// the routes blank it for Empleados and never send it to the Taller board.

export const TIPOS_ENCARGO = ['prenda', 'camisa', 'arreglo'] as const
export type TipoEncargo = (typeof TIPOS_ENCARGO)[number]
export const ESTADOS_ENCARGO = ['presupuesto', 'confirmado', 'prueba', 'listo', 'entregado'] as const
export type EstadoEncargo = (typeof ESTADOS_ENCARGO)[number]
export const PRENDAS: Record<TipoEncargo, readonly string[]> = {
  prenda: ['americana', 'pantalon', 'chaleco', 'abrigo', 'otra'],
  camisa: ['camisa'],
  arreglo: [],
}
// Fabric for a talla M, editable on each encargo. Leftovers are not tracked.
export const METROS_DEFECTO: Record<string, number> = { americana: 1.8, pantalon: 1.2, chaleco: 0.7 }

const MATERIALES = ['tejido', 'forro'] as const
const ORIGENES = ['proveedor', 'inventario', 'cliente'] as const

const textOrNull = (v: unknown, max = 2000) => {
  const s = String(v ?? '').trim().slice(0, max)
  return s || null
}
const dateOrNull = (v: unknown) => {
  if (v === null || v === undefined || v === '') return null
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new HttpError(400, 'invalid date')
  return v
}
const money = (v: unknown) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(String(v).replace(',', '.'))
  if (!Number.isFinite(n) || n < 0 || n >= 1e9) throw new HttpError(400, 'invalid number')
  return Math.round(n * 100) / 100
}

function prendasValidas(tipo: TipoEncargo, raw: unknown) {
  const list = Array.isArray(raw) ? raw : []
  const valid = list.filter((p): p is string => PRENDAS[tipo].includes(p as string))
  return tipo === 'camisa' ? ['camisa'] : [...new Set(valid)]
}

// ── Lists ─────────────────────────────────────────────────────────────────────

const RESUMEN = `
  e.id, e.numero, e.tipo, e.prendas, e.pedido, e.estado, e.fecha_encargo::text AS fecha_encargo,
  e.fecha_entrega::text AS fecha_entrega, e.sastre_id, s.nombre AS sastre, e.cliente_id,
  trim(c.nombre || ' ' || coalesce(c.apellidos, '')) AS cliente,
  e.taller_externo, e.taller_enviado::text AS taller_enviado, e.taller_devuelto::text AS taller_devuelto,
  (SELECT min(b.date)::text FROM encargo_pruebas ep JOIN bookings b ON b.id = ep.booking_id
    WHERE ep.encargo_id = e.id AND b.status <> 'cancelled' AND b.date >= (now() AT TIME ZONE 'Europe/Madrid')::date) AS proxima_prueba`

export async function listEncargos(f: { q?: string; estado?: string; tipo?: string; sastre?: number; pendientePago?: boolean; abiertos?: boolean }) {
  const params: unknown[] = []
  const where: string[] = []
  if (f.q) where.push(wordsMatch(f.q, `lower(e.numero || ' ' || c.nombre || ' ' || coalesce(c.apellidos, '') || ' ' || coalesce(e.pedido, ''))`, params))
  if (f.estado && (ESTADOS_ENCARGO as readonly string[]).includes(f.estado)) where.push(`e.estado = $${params.push(f.estado)}`)
  if (f.abiertos) where.push(`e.estado <> 'entregado'`)
  if (f.tipo && (TIPOS_ENCARGO as readonly string[]).includes(f.tipo)) where.push(`e.tipo = $${params.push(f.tipo)}`)
  if (f.sastre) where.push(`e.sastre_id = $${params.push(f.sastre)}`)
  if (f.pendientePago) where.push(`COALESCE(e.total, 0) > pag.pagado`)
  const result = await query(
    `SELECT ${RESUMEN}, e.total, pag.pagado
       FROM encargos e
       JOIN clientes c ON c.id = e.cliente_id
       LEFT JOIN sastres s ON s.id = e.sastre_id
       CROSS JOIN LATERAL (SELECT COALESCE(SUM(p.importe), 0) AS pagado FROM encargo_pagos p WHERE p.encargo_id = e.id) pag
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY e.estado = 'entregado', e.fecha_entrega NULLS LAST, e.id DESC
      LIMIT 300`,
    params
  )
  return result.rows
}

// The Taller board: open encargos plus those delivered in the last 7 days. No money, no contact details.
export async function tallerBoard() {
  const result = await query(
    `SELECT ${RESUMEN}
       FROM encargos e
       JOIN clientes c ON c.id = e.cliente_id
       LEFT JOIN sastres s ON s.id = e.sastre_id
      WHERE e.estado <> 'entregado' OR e.entregado_at >= now() - interval '7 days'
      ORDER BY e.fecha_entrega NULLS LAST, e.id`
  )
  const sastres = await query(`SELECT id, nombre FROM sastres WHERE activo ORDER BY orden, lower(nombre)`)
  return { encargos: result.rows, sastres: sastres.rows }
}

// ── One encargo ───────────────────────────────────────────────────────────────

export async function getEncargo(id: number, admin: CurrentAdmin) {
  const encargo = (
    await query(
      `SELECT e.*, e.fecha_encargo::text AS fecha_encargo, e.fecha_entrega::text AS fecha_entrega,
              e.taller_enviado::text AS taller_enviado, e.taller_devuelto::text AS taller_devuelto,
              s.nombre AS sastre,
              c.nombre AS cliente_nombre, c.apellidos AS cliente_apellidos, c.telefono AS cliente_telefono, c.email AS cliente_email,
              eb.date::text AS entrega_cita_fecha, eb.time AS entrega_cita_hora, eb.status AS entrega_cita_estado
         FROM encargos e
         JOIN clientes c ON c.id = e.cliente_id
         LEFT JOIN sastres s ON s.id = e.sastre_id
         LEFT JOIN bookings eb ON eb.id = e.entrega_booking_id
        WHERE e.id = $1`,
      [id]
    )
  ).rows[0]
  if (!encargo) throw new HttpError(404, 'not found')

  const [materiales, pruebas, pagos, medidas] = await Promise.all([
    query(
      `SELECT m.*, pr.nombre AS proveedor, p.nombre AS producto, v.etiqueta AS variante, v.es_unica, v.stock_actual, p.id AS producto_id
         FROM encargo_materiales m
         LEFT JOIN proveedores pr ON pr.id = m.proveedor_id
         LEFT JOIN producto_variantes v ON v.id = m.variante_id
         LEFT JOIN productos p ON p.id = v.producto_id
        WHERE m.encargo_id = $1 ORDER BY m.material DESC, m.id`,
      [id]
    ),
    query(
      `SELECT ep.id, ep.notas, ep.booking_id, b.date::text AS fecha, b.time AS hora, b.status
         FROM encargo_pruebas ep LEFT JOIN bookings b ON b.id = ep.booking_id
        WHERE ep.encargo_id = $1 ORDER BY b.date NULLS LAST, b.time, ep.id`,
      [id]
    ),
    query(`SELECT * FROM encargo_pagos WHERE encargo_id = $1 ORDER BY fecha, id`, [id]),
    // Every measurement version of the client, so the encargo can switch to a newer one
    query(
      `SELECT m.id, m.tipo_prenda, m.medidas, m.observaciones, m.tomada_en::text AS tomada_en, a.name AS tomada_por_nombre
         FROM cliente_medidas m LEFT JOIN admins a ON a.id = m.tomada_por
        WHERE m.cliente_id = $1 ORDER BY m.tomada_en DESC, m.id DESC`,
      [encargo.cliente_id]
    ),
  ])

  const pagado = pagos.rows.reduce((s, p) => s + toCents(p.importe), 0)
  const total = encargo.total === null ? null : toCents(encargo.total)
  const result = {
    encargo,
    materiales: materiales.rows,
    pruebas: pruebas.rows,
    pagos: pagos.rows,
    medidas: medidas.rows,
    totales: { total: encargo.total, pagado: (pagado / 100).toFixed(2), pendiente: total === null ? null : ((total - pagado) / 100).toFixed(2) },
  }
  if (!esPropietario(admin)) {
    // Empleados: no phone or email; money is blanked by the route
    result.encargo = { ...encargo, cliente_telefono: null, cliente_email: null }
  }
  return result
}

async function lockEncargo(client: PoolClient, id: number) {
  const encargo = (await client.query(`SELECT * FROM encargos WHERE id = $1 FOR UPDATE`, [id])).rows[0]
  if (!encargo) throw new HttpError(404, 'not found')
  return encargo
}

async function checkMedidas(client: PoolClient, medidasId: unknown, clienteId: number) {
  if (medidasId === null || medidasId === undefined || medidasId === '') return null
  const row = (await client.query(`SELECT id FROM cliente_medidas WHERE id = $1 AND cliente_id = $2`, [Number(medidasId), clienteId])).rows[0]
  if (!row) throw new HttpError(400, 'invalid medidas')
  return row.id as number
}

async function checkSastre(client: PoolClient, sastreId: unknown) {
  if (sastreId === null || sastreId === undefined || sastreId === '') return null
  const row = (await client.query(`SELECT id FROM sastres WHERE id = $1`, [Number(sastreId)])).rows[0]
  if (!row) throw new HttpError(400, 'invalid sastre')
  return row.id as number
}

export async function createEncargo(body: Record<string, unknown>, admin: CurrentAdmin) {
  const tipo = body.tipo as TipoEncargo
  if (!TIPOS_ENCARGO.includes(tipo)) throw new HttpError(400, 'invalid tipo')
  const clienteId = Number(body.cliente_id)
  if (!Number.isInteger(clienteId) || clienteId <= 0) throw new HttpError(400, 'invalid cliente')

  return withTransaction(async (client) => {
    const cliente = (await client.query(`SELECT id FROM clientes WHERE id = $1`, [clienteId])).rows[0]
    if (!cliente) throw new HttpError(400, 'invalid cliente')
    // New encargos start from the client's latest measurement set (arreglos don't need one)
    let medidasId = await checkMedidas(client, body.medidas_id, clienteId)
    if (!medidasId && tipo !== 'arreglo') {
      medidasId = (await client.query(
        `SELECT id FROM cliente_medidas WHERE cliente_id = $1 ORDER BY tomada_en DESC, id DESC LIMIT 1`, [clienteId]
      )).rows[0]?.id ?? null
    }
    const numero = await siguienteNumero(client, 'E')
    const result = await client.query(
      `INSERT INTO encargos (numero, cliente_id, tipo, prendas, pedido, fecha_encargo, fecha_entrega, sastre_id, medidas_id, total, admin_id)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, (now() AT TIME ZONE 'Europe/Madrid')::date), $7, $8, $9, $10, $11)
       RETURNING id, numero`,
      [
        numero, clienteId, tipo, JSON.stringify(prendasValidas(tipo, body.prendas)), textOrNull(body.pedido),
        dateOrNull(body.fecha_encargo), dateOrNull(body.fecha_entrega), await checkSastre(client, body.sastre_id),
        medidasId, esPropietario(admin) ? money(body.total) : null, admin.id,
      ]
    )
    return result.rows[0]
  })
}

const EDITABLE = [
  'prendas', 'pedido', 'fecha_encargo', 'fecha_entrega', 'sastre_id', 'medidas_id', 'caracteristicas', 'total',
  'notas_sastre', 'comentarios', 'taller_externo', 'taller_enviado', 'taller_devuelto', 'estado',
] as const

export async function updateEncargo(id: number, body: Record<string, unknown>, admin: CurrentAdmin) {
  return withTransaction(async (client) => {
    const encargo = await lockEncargo(client, id)
    const sets: string[] = []
    const params: unknown[] = []
    const set = (col: string, value: unknown) => sets.push(`${col} = $${params.push(value)}`)

    for (const key of EDITABLE) {
      if (!(key in body)) continue
      const v = body[key]
      switch (key) {
        case 'prendas': set(key, JSON.stringify(prendasValidas(encargo.tipo, v))); break
        case 'caracteristicas': set(key, JSON.stringify(limpiarCaracteristicas(v))); break
        case 'fecha_encargo': {
          const d = dateOrNull(v)
          if (!d) throw new HttpError(400, 'invalid date')
          set(key, d)
          break
        }
        case 'fecha_entrega': case 'taller_enviado': case 'taller_devuelto': set(key, dateOrNull(v)); break
        case 'sastre_id': set(key, await checkSastre(client, v)); break
        case 'medidas_id': set(key, await checkMedidas(client, v, encargo.cliente_id)); break
        case 'total': if (esPropietario(admin)) set(key, money(v)); break
        case 'taller_externo': set(key, textOrNull(v, 150)); break
        case 'estado': {
          if (!(ESTADOS_ENCARGO as readonly unknown[]).includes(v)) throw new HttpError(400, 'invalid estado')
          set(key, v)
          const idx = ESTADOS_ENCARGO.indexOf(v as EstadoEncargo)
          if (idx >= 1 && !encargo.confirmado_at) sets.push('confirmado_at = now()')
          if (v === 'entregado' && !encargo.entregado_at) sets.push('entregado_at = now()')
          if (v !== 'entregado' && encargo.entregado_at) sets.push('entregado_at = NULL')
          // Fabric and lining taken from inventory leave stock when the encargo is confirmed
          if (idx >= 1) await consumirMateriales(client, encargo, admin)
          break
        }
        default: set(key, textOrNull(v))
      }
    }
    if (sets.length === 0) throw new HttpError(400, 'nothing to update')
    sets.push('updated_at = now()')
    params.push(id)
    await client.query(`UPDATE encargos SET ${sets.join(', ')} WHERE id = $${params.length}`, params)
    return { id }
  })
}

// ── Tejido y forro ────────────────────────────────────────────────────────────

const yaConfirmado = (encargo: { estado: string }) => encargo.estado !== 'presupuesto'

async function consumirMateriales(client: PoolClient, encargo: { id: number; numero: string }, admin: CurrentAdmin, soloId?: number) {
  const pendientes = (
    await client.query(
      `SELECT id, variante_id, metros FROM encargo_materiales
        WHERE encargo_id = $1 AND origen = 'inventario' AND NOT consumido ${soloId ? 'AND id = $2' : ''}
        ORDER BY id FOR UPDATE`,
      soloId ? [encargo.id, soloId] : [encargo.id]
    )
  ).rows
  if (pendientes.length === 0) return
  await aplicarMovimientos(
    client,
    pendientes.map((m) => ({
      varianteId: m.variante_id,
      tipo: 'consumo_encargo' as const,
      cantidad: -Number(m.metros),
      nota: encargo.numero,
      encargoMaterialId: m.id,
    })),
    admin
  )
  await client.query(`UPDATE encargo_materiales SET consumido = TRUE WHERE id = ANY($1)`, [pendientes.map((m) => m.id)])
}

async function materialFields(client: PoolClient, body: Record<string, unknown>, origen: string) {
  const metros = body.metros === '' || body.metros === null || body.metros === undefined ? null : Number(String(body.metros).replace(',', '.'))
  if (metros !== null) {
    if (!(metros > 0)) throw new HttpError(400, 'invalid quantity')
    validarCantidad(metros, 'm')
  }
  const fields: Record<string, unknown> = {
    referencia: textOrNull(body.referencia, 150),
    metros,
    notas: textOrNull(body.notas, 500),
    proveedor_id: null,
    estado_pedido: null,
    variante_id: null,
  }
  if (origen === 'proveedor') {
    if (body.proveedor_id) {
      const p = (await client.query(`SELECT id FROM proveedores WHERE id = $1`, [Number(body.proveedor_id)])).rows[0]
      if (!p) throw new HttpError(400, 'invalid proveedor')
      fields.proveedor_id = p.id
    }
    fields.estado_pedido = body.estado_pedido === 'recibido' ? 'recibido' : 'pedido'
  }
  if (origen === 'inventario') {
    const v = (await client.query(
      `SELECT v.id, p.unidad FROM producto_variantes v JOIN productos p ON p.id = v.producto_id WHERE v.id = $1 AND v.activo`,
      [Number(body.variante_id)]
    )).rows[0]
    if (!v) throw new HttpError(400, 'invalid variante')
    if (v.unidad !== 'm') throw new HttpError(400, 'not metres')
    if (metros === null) throw new HttpError(400, 'invalid quantity')
    fields.variante_id = v.id
  }
  return fields
}

export async function addMaterial(encargoId: number, body: Record<string, unknown>, admin: CurrentAdmin) {
  const material = body.material as string
  const origen = body.origen as string
  if (!(MATERIALES as readonly string[]).includes(material)) throw new HttpError(400, 'invalid material')
  if (!(ORIGENES as readonly string[]).includes(origen)) throw new HttpError(400, 'invalid origen')
  return withTransaction(async (client) => {
    const encargo = await lockEncargo(client, encargoId)
    const f = await materialFields(client, body, origen)
    const row = (
      await client.query(
        `INSERT INTO encargo_materiales (encargo_id, material, origen, proveedor_id, referencia, metros, estado_pedido, variante_id, notas)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [encargoId, material, origen, f.proveedor_id, f.referencia, f.metros, f.estado_pedido, f.variante_id, f.notas]
      )
    ).rows[0]
    // Already confirmed: stock leaves now
    if (origen === 'inventario' && yaConfirmado(encargo)) await consumirMateriales(client, encargo, admin, row.id)
    return row
  })
}

// Once stock was taken, a material line is fixed (fix stock with an ajuste); only the order status can change
export async function updateMaterial(encargoId: number, materialId: number, body: Record<string, unknown>) {
  return withTransaction(async (client) => {
    const m = (await client.query(`SELECT * FROM encargo_materiales WHERE id = $1 AND encargo_id = $2 FOR UPDATE`, [materialId, encargoId])).rows[0]
    if (!m) throw new HttpError(404, 'not found')
    if (Object.keys(body).length === 1 && 'estado_pedido' in body) {
      if (m.origen !== 'proveedor' || !['pedido', 'recibido'].includes(body.estado_pedido as string)) throw new HttpError(400, 'invalid estado')
      await client.query(`UPDATE encargo_materiales SET estado_pedido = $1 WHERE id = $2`, [body.estado_pedido, materialId])
      return { id: materialId }
    }
    if (m.consumido) throw new HttpError(409, 'material consumed')
    const f = await materialFields(client, { ...m, ...body }, m.origen)
    await client.query(
      `UPDATE encargo_materiales SET proveedor_id = $1, referencia = $2, metros = $3, estado_pedido = $4, variante_id = $5, notas = $6 WHERE id = $7`,
      [f.proveedor_id, f.referencia, f.metros, f.estado_pedido, f.variante_id, f.notas, materialId]
    )
    return { id: materialId }
  })
}

export async function deleteMaterial(encargoId: number, materialId: number) {
  const result = await query(
    `DELETE FROM encargo_materiales WHERE id = $1 AND encargo_id = $2 AND NOT consumido RETURNING id`,
    [materialId, encargoId]
  )
  if (!result.rows[0]) throw new HttpError(409, 'material consumed')
}

// ── Pruebas y entrega: they are Citas ─────────────────────────────────────────

function horaValida(v: unknown) {
  if (typeof v !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) throw new HttpError(400, 'invalid time')
  return v
}

async function crearCita(client: PoolClient, encargo: { id: number; cliente_id: number }, tipoCita: 'prueba' | 'entrega', fecha: string, hora: string, notas: string | null) {
  const c = (await client.query(`SELECT nombre, apellidos, email, telefono, idioma FROM clientes WHERE id = $1`, [encargo.cliente_id])).rows[0]
  // One appointment per slot, like the web bookings
  const taken = await client.query(`SELECT 1 FROM bookings WHERE date = $1 AND time = $2`, [fecha, hora])
  if (taken.rowCount) throw new HttpError(409, 'slot taken')
  const booking = (
    await client.query(
      `INSERT INTO bookings (date, time, type, name, email, phone, locale, status, notes, tipo_cita, encargo_id, cliente_id)
       VALUES ($1, $2, 'inperson', $3, $4, $5, $6, 'confirmed', $7, $8, $9, $10) RETURNING id`,
      [fecha, hora, [c.nombre, c.apellidos].filter(Boolean).join(' ').slice(0, 100), c.email ?? '', c.telefono, c.idioma ?? 'es',
        notas, tipoCita, encargo.id, encargo.cliente_id]
    )
  ).rows[0]
  return booking.id as number
}

export async function addPrueba(encargoId: number, body: Record<string, unknown>) {
  const fecha = dateOrNull(body.fecha)
  if (!fecha) throw new HttpError(400, 'invalid date')
  const hora = horaValida(body.hora)
  return withTransaction(async (client) => {
    const encargo = await lockEncargo(client, encargoId)
    const notas = textOrNull(body.notas, 1000)
    const bookingId = await crearCita(client, encargo, 'prueba', fecha, hora, notas)
    const row = (await client.query(
      `INSERT INTO encargo_pruebas (encargo_id, booking_id, notas) VALUES ($1, $2, $3) RETURNING id`,
      [encargoId, bookingId, notas]
    )).rows[0]
    return row
  })
}

// Notes after the fitting, or cancelling it (the Cita stays in Citas as cancelled)
export async function updatePrueba(encargoId: number, pruebaId: number, body: Record<string, unknown>) {
  return withTransaction(async (client) => {
    const p = (await client.query(`SELECT * FROM encargo_pruebas WHERE id = $1 AND encargo_id = $2 FOR UPDATE`, [pruebaId, encargoId])).rows[0]
    if (!p) throw new HttpError(404, 'not found')
    if ('notas' in body) await client.query(`UPDATE encargo_pruebas SET notas = $1 WHERE id = $2`, [textOrNull(body.notas, 1000), pruebaId])
    if (body.cancelar === true && p.booking_id) {
      await client.query(`UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [p.booking_id])
    }
    return { id: pruebaId }
  })
}

// Books (or moves) the delivery appointment and sets the encargo's delivery date to it
export async function programarEntrega(encargoId: number, body: Record<string, unknown>) {
  const fecha = dateOrNull(body.fecha)
  if (!fecha) throw new HttpError(400, 'invalid date')
  const hora = horaValida(body.hora)
  return withTransaction(async (client) => {
    const encargo = await lockEncargo(client, encargoId)
    if (encargo.entrega_booking_id) {
      const taken = await client.query(`SELECT 1 FROM bookings WHERE date = $1 AND time = $2 AND id <> $3`, [fecha, hora, encargo.entrega_booking_id])
      if (taken.rowCount) throw new HttpError(409, 'slot taken')
      const moved = await client.query(
        `UPDATE bookings SET date = $1, time = $2, status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id`,
        [fecha, hora, encargo.entrega_booking_id]
      )
      if (moved.rowCount) {
        await client.query(`UPDATE encargos SET fecha_entrega = $1, updated_at = now() WHERE id = $2`, [fecha, encargoId])
        return { id: encargo.entrega_booking_id }
      }
    }
    const bookingId = await crearCita(client, encargo, 'entrega', fecha, hora, null)
    await client.query(`UPDATE encargos SET entrega_booking_id = $1, fecha_entrega = $2, updated_at = now() WHERE id = $3`, [bookingId, fecha, encargoId])
    return { id: bookingId }
  })
}

// ── Pagos (Propietarios only; they show up in Cobros) ─────────────────────────

export async function addPago(encargoId: number, body: Record<string, unknown>, admin: CurrentAdmin) {
  const importe = money(body.importe)
  if (!importe || importe <= 0) throw new HttpError(400, 'invalid number')
  const metodo = body.metodo as string
  if (metodo !== 'mixto' && !(METODOS_PAGO as readonly string[]).includes(metodo)) throw new HttpError(400, 'invalid metodo')
  let pagos: { metodo: string; importe: string }[] | null = null
  if (metodo === 'mixto') {
    const parts = (Array.isArray(body.pagos) ? body.pagos : []) as { metodo: string; importe: unknown }[]
    pagos = parts
      .filter((p) => money(p.importe))
      .map((p) => {
        if (!(METODOS_PAGO as readonly string[]).includes(p.metodo)) throw new HttpError(400, 'invalid pagos')
        return { metodo: p.metodo, importe: (money(p.importe) as number).toFixed(2) }
      })
    if (pagos.length < 2) throw new HttpError(400, 'invalid pagos')
    if (pagos.reduce((s, p) => s + toCents(p.importe), 0) !== Math.round(importe * 100)) throw new HttpError(400, 'pagos mismatch')
  }
  return withTransaction(async (client) => {
    await lockEncargo(client, encargoId)
    const row = (
      await client.query(
        `INSERT INTO encargo_pagos (encargo_id, fecha, importe, metodo, pagos, notas, admin_id, admin_nombre)
         VALUES ($1,
                 -- Today (Madrid) keeps the real time; an earlier day is recorded at noon Madrid so Cobros shows it on that day
                 CASE WHEN $2::date IS NULL OR $2::date = (now() AT TIME ZONE 'Europe/Madrid')::date THEN now()
                      ELSE ($2::date + time '12:00') AT TIME ZONE 'Europe/Madrid' END,
                 $3, $4, $5, $6, $7, $8) RETURNING *`,
        [encargoId, dateOrNull(body.fecha), importe, metodo, pagos ? JSON.stringify(pagos) : null, textOrNull(body.notas, 500), admin.id, admin.name]
      )
    ).rows[0]
    return row
  })
}

export async function deletePago(encargoId: number, pagoId: number) {
  const result = await query(`DELETE FROM encargo_pagos WHERE id = $1 AND encargo_id = $2 RETURNING id`, [pagoId, encargoId])
  if (!result.rows[0]) throw new HttpError(404, 'not found')
}
