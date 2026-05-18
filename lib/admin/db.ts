import { query } from '../db'

// Bookings
export async function getBookings(filters?: { type?: string; dateFrom?: string; dateTo?: string; status?: string }) {
  let sql = `SELECT * FROM bookings WHERE 1=1`
  const params: unknown[] = []
  let i = 1

  if (filters?.type) {
    sql += ` AND type = $${i++}`
    params.push(filters.type)
  }
  if (filters?.dateFrom) {
    sql += ` AND date >= $${i++}`
    params.push(filters.dateFrom)
  }
  if (filters?.dateTo) {
    sql += ` AND date <= $${i++}`
    params.push(filters.dateTo)
  }
  if (filters?.status) {
    sql += ` AND status = $${i++}`
    params.push(filters.status)
  }

  sql += ` ORDER BY date DESC, time ASC`
  const result = await query(sql, params)
  return result.rows
}

export async function updateBooking(id: number, data: { status?: string; notes?: string }) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  if (data.status !== undefined) {
    fields.push(`status = $${i++}`)
    params.push(data.status)
  }
  if (data.notes !== undefined) {
    fields.push(`notes = $${i++}`)
    params.push(data.notes)
  }

  if (fields.length === 0) return null
  params.push(id)
  const sql = `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`
  const result = await query(sql, params)
  return result.rows[0]
}

// Contact submissions
export async function getContacts(filters?: { read?: boolean; type?: string }) {
  let sql = `SELECT * FROM contact_submissions WHERE 1=1`
  const params: unknown[] = []
  let i = 1

  if (filters?.read !== undefined) {
    sql += ` AND read = $${i++}`
    params.push(filters.read)
  }
  if (filters?.type) {
    sql += ` AND type = $${i++}`
    params.push(filters.type)
  }

  sql += ` ORDER BY created_at DESC`
  const result = await query(sql, params)
  return result.rows
}

export async function markContactRead(id: number) {
  const result = await query(
    `UPDATE contact_submissions SET read = TRUE WHERE id = $1 RETURNING *`,
    [id]
  )
  return result.rows[0]
}

export async function createContact(data: { name: string; email: string; type?: string; message?: string; locale?: string }) {
  const result = await query(
    `INSERT INTO contact_submissions (name, email, type, message, locale) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.name, data.email, data.type || 'contact', data.message || '', data.locale || 'es']
  )
  return result.rows[0]
}

// Configurations
export async function getConfigurations() {
  const result = await query(`SELECT * FROM configurations ORDER BY created_at DESC`)
  return result.rows
}

export async function updateConfiguration(id: number, data: { status?: string; notes?: string }) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  if (data.status !== undefined) {
    fields.push(`status = $${i++}`)
    params.push(data.status)
  }
  if (data.notes !== undefined) {
    fields.push(`notes = $${i++}`)
    params.push(data.notes)
  }

  if (fields.length === 0) return null
  params.push(id)
  const sql = `UPDATE configurations SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`
  const result = await query(sql, params)
  return result.rows[0]
}

export async function createConfiguration(data: {
  name: string
  email: string
  fabric?: string
  measurements?: Record<string, unknown>
  designOptions?: Record<string, unknown>
}) {
  const result = await query(
    `INSERT INTO configurations (name, email, fabric, measurements, design_options) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.name, data.email, data.fabric || null, JSON.stringify(data.measurements || {}), JSON.stringify(data.designOptions || {})]
  )
  return result.rows[0]
}

// Customer notes
export async function getCustomers() {
  const result = await query(`
    SELECT 
      COALESCE(cn.email, b.email) as email,
      COALESCE(cn.name, b.name) as name,
      cn.notes,
      cn.measurements,
      cn.updated_at,
      COUNT(DISTINCT b.id) as booking_count,
      MAX(b.created_at) as last_booking
    FROM bookings b
    LEFT JOIN customer_notes cn ON b.email = cn.email
    GROUP BY COALESCE(cn.email, b.email), COALESCE(cn.name, b.name), cn.notes, cn.measurements, cn.updated_at
    ORDER BY last_booking DESC
  `)
  return result.rows
}

export async function upsertCustomerNote(data: {
  email: string
  name?: string
  notes?: string
  measurements?: Record<string, unknown>
}) {
  const existing = await query(`SELECT id FROM customer_notes WHERE email = $1`, [data.email])

  if (existing.rowCount && existing.rowCount > 0) {
    const result = await query(
      `UPDATE customer_notes SET name = COALESCE($1, name), notes = COALESCE($2, notes), measurements = COALESCE($3, measurements), updated_at = CURRENT_TIMESTAMP WHERE email = $4 RETURNING *`,
      [data.name || null, data.notes || null, data.measurements ? JSON.stringify(data.measurements) : null, data.email]
    )
    return result.rows[0]
  } else {
    const result = await query(
      `INSERT INTO customer_notes (email, name, notes, measurements) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.email, data.name || '', data.notes || '', data.measurements ? JSON.stringify(data.measurements) : null]
    )
    return result.rows[0]
  }
}

// Editable content
export async function getContent(id: string) {
  const result = await query(`SELECT * FROM editable_content WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function setContent(id: string, value: string) {
  const result = await query(
    `INSERT INTO editable_content (id, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [id, value]
  )
  return result.rows[0]
}

export async function getAllContent() {
  const result = await query(`SELECT * FROM editable_content ORDER BY id`)
  return result.rows
}

// Stats
export async function getDashboardStats() {
  const bookingsResult = await query(`SELECT COUNT(*) as total FROM bookings`)
  const bookingsThisMonth = await query(`
    SELECT COUNT(*) as total FROM bookings 
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
  `)
  const contactsResult = await query(`SELECT COUNT(*) as total FROM contact_submissions WHERE read = FALSE`)
  const configsResult = await query(`SELECT COUNT(*) as total FROM configurations WHERE status = 'new'`)
  const upcomingResult = await query(`
    SELECT COUNT(*) as total FROM bookings 
    WHERE date >= CURRENT_DATE AND status = 'confirmed'
  `)

  return {
    totalBookings: parseInt(bookingsResult.rows[0].total, 10),
    bookingsThisMonth: parseInt(bookingsThisMonth.rows[0].total, 10),
    unreadContacts: parseInt(contactsResult.rows[0].total, 10),
    newConfigurations: parseInt(configsResult.rows[0].total, 10),
    upcomingAppointments: parseInt(upcomingResult.rows[0].total, 10),
  }
}

// Admin users
export async function getAdminByEmail(email: string) {
  const result = await query(`SELECT * FROM admins WHERE email = $1`, [email])
  return result.rows[0] || null
}

export async function updateAdminPassword(email: string, passwordHash: string) {
  const result = await query(
    `UPDATE admins SET password_hash = $1 WHERE email = $2 RETURNING *`,
    [passwordHash, email]
  )
  return result.rows[0] || null
}
