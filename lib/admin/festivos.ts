import { query } from '../db'
import { HttpError, type CurrentAdmin } from './server'

// Festivos (Horarios): whole days the shop is closed. The web can't book them (lib/booking/slots.ts).
// Citas already on those days are listed as a warning and never cancelled automatically.

const isoDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T12:00:00Z'))
const MAX_DIAS = 366

export interface CitaEnFestivo {
  id: number
  date: string
  time: string
  name: string
  type: string
  tipo_cita: string
}

// Active citas in [desde, hasta]: name, date and time only (what Empleados already see in Citas)
async function citasEntre(desde: string, hasta: string): Promise<CitaEnFestivo[]> {
  const result = await query(
    `SELECT id, date::text AS date, time, name, type, tipo_cita
       FROM bookings
      WHERE date BETWEEN $1 AND $2 AND status IS DISTINCT FROM 'cancelled'
      ORDER BY date, time`,
    [desde, hasta]
  )
  return result.rows
}

/** Holidays that haven't ended yet (Madrid time), each with the citas already booked on it. */
export async function listFestivos() {
  const result = await query(
    `SELECT f.id, f.fecha_inicio::text AS desde, f.fecha_fin::text AS hasta, f.motivo,
            COALESCE(json_agg(json_build_object('id', b.id, 'date', b.date::text, 'time', b.time, 'name', b.name,
                                                'type', b.type, 'tipo_cita', b.tipo_cita)
                              ORDER BY b.date, b.time) FILTER (WHERE b.id IS NOT NULL), '[]') AS citas
       FROM festivos f
       LEFT JOIN bookings b ON b.date BETWEEN f.fecha_inicio AND f.fecha_fin AND b.status IS DISTINCT FROM 'cancelled'
      WHERE f.fecha_fin >= (now() AT TIME ZONE 'Europe/Madrid')::date
      GROUP BY f.id
      ORDER BY f.fecha_inicio, f.id`
  )
  return result.rows
}

export async function createFestivo(body: Record<string, unknown>, admin: CurrentAdmin) {
  const desde = body.desde
  const hasta = body.hasta === undefined || body.hasta === null || body.hasta === '' ? desde : body.hasta
  if (!isoDate(desde) || !isoDate(hasta)) throw new HttpError(400, 'invalid date')
  if ((hasta as string) < (desde as string)) throw new HttpError(400, 'invalid range')
  const dias = (Date.parse((hasta as string) + 'T12:00:00Z') - Date.parse((desde as string) + 'T12:00:00Z')) / 864e5
  if (dias >= MAX_DIAS) throw new HttpError(400, 'range too long')
  const motivo = String(body.motivo ?? '').trim().slice(0, 200) || null
  const row = (
    await query(
      `INSERT INTO festivos (fecha_inicio, fecha_fin, motivo, admin_id) VALUES ($1, $2, $3, $4)
       RETURNING id, fecha_inicio::text AS desde, fecha_fin::text AS hasta, motivo`,
      [desde, hasta, motivo, admin.id]
    )
  ).rows[0]
  return { festivo: row, citas: await citasEntre(desde as string, hasta as string) }
}

export async function deleteFestivo(id: number) {
  const result = await query(`DELETE FROM festivos WHERE id = $1 RETURNING id`, [id])
  if (!result.rowCount) throw new HttpError(404, 'not found')
  return { id }
}
