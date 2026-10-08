import { query } from '../db'
import { HttpError, buildUpdate, pickFields, type CurrentAdmin } from './server'
import { isTipoPrenda } from './medidas'

// DATE columns come back as text: pg would turn them into midnight-UTC Date objects
// that shift a day in Madrid. node-pg keeps the last of duplicate column names.
const RETURNING = `*, fecha_nacimiento::text AS fecha_nacimiento`

export const CLIENTE_FIELDS = [
  'nombre', 'apellidos', 'email', 'telefono', 'nif', 'direccion', 'codigo_postal', 'ciudad', 'pais',
  'fecha_nacimiento', 'idioma', 'notas', 'acepta_comunicaciones', 'activo',
] as const

function normalise(body: Record<string, unknown>) {
  const fields = pickFields(body, CLIENTE_FIELDS)
  if (typeof fields.email === 'string') {
    const email = fields.email.toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'invalid email')
    fields.email = email
  }
  if ('nombre' in fields && !fields.nombre) throw new HttpError(400, 'nombre required')
  return fields
}

export async function listClientes(opts: { q?: string; archivados?: boolean; limit?: number; offset?: number }) {
  const params: unknown[] = []
  const where: string[] = [opts.archivados ? 'c.activo = FALSE' : 'c.activo = TRUE']
  if (opts.q) {
    params.push(`%${opts.q.toLowerCase()}%`)
    const p = `$${params.length}`
    where.push(`(lower(c.nombre || ' ' || coalesce(c.apellidos, '')) LIKE ${p} OR lower(c.email) LIKE ${p} OR c.telefono LIKE ${p})`)
  }
  params.push(Math.min(opts.limit ?? 50, 200), opts.offset ?? 0)
  const result = await query(
    `SELECT c.id, c.nombre, c.apellidos, c.email, c.telefono, c.origen, c.created_at,
            (SELECT COUNT(*) FROM bookings b WHERE b.cliente_id = c.id)::int AS citas,
            (SELECT MAX(b.date)::text FROM bookings b WHERE b.cliente_id = c.id) AS ultima_cita
       FROM clientes c
      WHERE ${where.join(' AND ')}
      ORDER BY c.updated_at DESC, c.id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )
  return result.rows
}

export async function getCliente(id: number) {
  const cliente = (await query(`SELECT ${RETURNING} FROM clientes WHERE id = $1`, [id])).rows[0]
  if (!cliente) throw new HttpError(404, 'not found')

  const [medidas, citas, pagos] = await Promise.all([
    query(
      `SELECT m.*, m.tomada_en::text AS tomada_en, a.name AS tomada_por_nombre
         FROM cliente_medidas m LEFT JOIN admins a ON a.id = m.tomada_por
        WHERE m.cliente_id = $1
        ORDER BY m.tomada_en DESC, m.id DESC`,
      [id]
    ),
    // Bookings not yet backfilled still match by email
    query(
      `SELECT id, date::text AS date, time, type, status, notes
         FROM bookings
        WHERE cliente_id = $1 OR (cliente_id IS NULL AND $2::text IS NOT NULL AND lower(email) = $2)
        ORDER BY date DESC, time DESC`,
      [id, cliente.email]
    ),
    cliente.email
      ? query(
          `SELECT id, amount, currency, status, type, created_at
             FROM payments WHERE lower(customer_email) = $1 ORDER BY created_at DESC`,
          [cliente.email]
        )
      : Promise.resolve({ rows: [] }),
  ])

  return { cliente, medidas: medidas.rows, citas: citas.rows, pagos: pagos.rows }
}

export async function createCliente(body: Record<string, unknown>, admin: CurrentAdmin) {
  const fields: Record<string, unknown> = { ...normalise(body), origen: 'tienda', created_by: admin.id }
  if (!fields.nombre) throw new HttpError(400, 'nombre required')
  const cols = Object.keys(fields)
  const result = await query(
    `INSERT INTO clientes (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING ${RETURNING}`,
    Object.values(fields)
  )
  return result.rows[0]
}

export async function updateCliente(id: number, body: Record<string, unknown>) {
  const update = buildUpdate('clientes', id, normalise(body), RETURNING)
  if (!update) throw new HttpError(400, 'nothing to update')
  const result = await query(update.sql, update.params)
  if (!result.rows[0]) throw new HttpError(404, 'not found')
  return result.rows[0]
}

export async function addMedidas(clienteId: number, body: Record<string, unknown>, admin: CurrentAdmin) {
  const tipo = body.tipo_prenda
  if (!isTipoPrenda(tipo)) throw new HttpError(400, 'invalid tipo_prenda')
  const raw = (body.medidas ?? {}) as Record<string, unknown>
  const medidas: Record<string, number | string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value === '' || value === null || value === undefined) continue
    const num = Number(String(value).replace(',', '.'))
    medidas[key.trim().slice(0, 40)] = Number.isFinite(num) ? num : String(value).slice(0, 100)
  }
  if (Object.keys(medidas).length === 0) throw new HttpError(400, 'medidas required')

  const result = await query(
    `INSERT INTO cliente_medidas (cliente_id, tipo_prenda, medidas, observaciones, tomada_por, tomada_en)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6::date, CURRENT_DATE)) RETURNING *, tomada_en::text AS tomada_en`,
    [clienteId, tipo, JSON.stringify(medidas), (body.observaciones as string)?.trim() || null, admin.id, body.tomada_en || null]
  )
  return result.rows[0]
}

export async function deleteMedidas(clienteId: number, medidasId: number) {
  await query(`DELETE FROM cliente_medidas WHERE id = $1 AND cliente_id = $2`, [medidasId, clienteId])
}
