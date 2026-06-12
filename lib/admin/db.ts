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

export async function updateBooking(id: number, data: {
  status?: string
  notes?: string
  name?: string
  email?: string
  phone?: string
  date?: string
  time?: string
  type?: string
}) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  const mappings: Record<string, string> = {
    status: 'status',
    notes: 'notes',
    name: 'name',
    email: 'email',
    phone: 'phone',
    date: 'date',
    time: 'time',
    type: 'type',
  }

  for (const [key, col] of Object.entries(mappings)) {
    if (data[key as keyof typeof data] !== undefined) {
      fields.push(`${col} = $${i++}`)
      params.push(data[key as keyof typeof data])
    }
  }

  if (fields.length === 0) return null
  fields.push(`updated_at = CURRENT_TIMESTAMP`)
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

  // Chart data: bookings by type
  const bookingsByType = await query(`
    SELECT type, COUNT(*) as total FROM bookings GROUP BY type
  `)

  // Chart data: bookings last 6 months
  const bookingsByMonth = await query(`
    SELECT TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') as month, COUNT(*) as total
    FROM bookings
    WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  `)

  // Chart data: contacts by type
  const contactsByType = await query(`
    SELECT type, COUNT(*) as total FROM contact_submissions GROUP BY type
  `)

  // Chart data: configurations by status
  const configsByStatus = await query(`
    SELECT status, COUNT(*) as total FROM configurations GROUP BY status
  `)

  return {
    totalBookings: parseInt(bookingsResult.rows[0].total, 10),
    bookingsThisMonth: parseInt(bookingsThisMonth.rows[0].total, 10),
    unreadContacts: parseInt(contactsResult.rows[0].total, 10),
    newConfigurations: parseInt(configsResult.rows[0].total, 10),
    upcomingAppointments: parseInt(upcomingResult.rows[0].total, 10),
    bookingsByType: bookingsByType.rows,
    bookingsByMonth: bookingsByMonth.rows,
    contactsByType: contactsByType.rows,
    configsByStatus: configsByStatus.rows,
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

// Settings
export async function getSettings() {
  const result = await query(`SELECT id, name, enabled, price FROM settings ORDER BY name`)
  return result.rows
}

export async function updateSetting(id: string, data: { enabled?: boolean; price?: number | null }) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  if (data.enabled !== undefined) {
    fields.push(`enabled = $${i++}`)
    params.push(data.enabled)
  }
  if (data.price !== undefined) {
    fields.push(`price = $${i++}`)
    params.push(data.price)
  }

  if (fields.length === 0) return null
  params.push(id)
  const sql = `UPDATE settings SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${i} RETURNING *`
  const result = await query(sql, params)
  return result.rows[0] || null
}

// Payments
export async function createPayment(data: {
  stripeSessionId: string
  amount: number
  currency?: string
  status?: string
  type?: string
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, unknown>
}) {
  const result = await query(
    `INSERT INTO payments (stripe_session_id, amount, currency, status, type, customer_email, customer_name, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (stripe_session_id) DO NOTHING
     RETURNING *`,
    [
      data.stripeSessionId,
      data.amount,
      data.currency || 'eur',
      data.status || 'pending',
      data.type || null,
      data.customerEmail || null,
      data.customerName || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ]
  )
  return result.rows[0] || null
}

export async function updatePaymentBySessionId(
  stripeSessionId: string,
  data: { status?: string; stripePaymentIntentId?: string }
) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  if (data.status !== undefined) {
    fields.push(`status = $${i++}`)
    params.push(data.status)
  }
  if (data.stripePaymentIntentId !== undefined) {
    fields.push(`stripe_payment_intent_id = $${i++}`)
    params.push(data.stripePaymentIntentId)
  }

  if (fields.length === 0) return null
  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  params.push(stripeSessionId)
  const sql = `UPDATE payments SET ${fields.join(', ')} WHERE stripe_session_id = $${i} RETURNING *`
  const result = await query(sql, params)
  return result.rows[0] || null
}

export async function getPayments() {
  const result = await query(
    `SELECT * FROM payments ORDER BY created_at DESC`
  )
  return result.rows
}

// Courses
export async function getCourses() {
  const result = await query(
    `SELECT * FROM courses ORDER BY sort_order, created_at`
  )
  return result.rows
}

export async function getCourseById(id: string) {
  const result = await query(`SELECT * FROM courses WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function createCourse(data: {
  id: string
  title_es: string
  title_en: string
  title_it: string
  title_fr: string
  desc_es?: string
  desc_en?: string
  desc_it?: string
  desc_fr?: string
  duration?: string
  lessons?: number
  image?: string
  price?: number
  locked?: boolean
  enabled?: boolean
  sort_order?: number
}) {
  const result = await query(
    `INSERT INTO courses (id, title_es, title_en, title_it, title_fr, desc_es, desc_en, desc_it, desc_fr, duration, lessons, image, price, locked, enabled, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING *`,
    [data.id, data.title_es, data.title_en, data.title_it, data.title_fr, data.desc_es || '', data.desc_en || '', data.desc_it || '', data.desc_fr || '', data.duration || '', data.lessons || 0, data.image || '', data.price || 0, data.locked ?? false, data.enabled ?? true, data.sort_order ?? 0]
  )
  return result.rows[0]
}

export async function updateCourse(id: string, data: Partial<{
  title_es: string
  title_en: string
  title_it: string
  title_fr: string
  desc_es: string
  desc_en: string
  desc_it: string
  desc_fr: string
  duration: string
  lessons: number
  image: string
  price: number
  locked: boolean
  enabled: boolean
  sort_order: number
}>) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  const mappings: Record<string, string> = {
    title_es: 'title_es', title_en: 'title_en', title_it: 'title_it', title_fr: 'title_fr',
    desc_es: 'desc_es', desc_en: 'desc_en', desc_it: 'desc_it', desc_fr: 'desc_fr',
    duration: 'duration', lessons: 'lessons', image: 'image', price: 'price',
    locked: 'locked', enabled: 'enabled', sort_order: 'sort_order',
  }

  for (const [key, col] of Object.entries(mappings)) {
    if (data[key as keyof typeof data] !== undefined) {
      fields.push(`${col} = $${i++}`)
      params.push(data[key as keyof typeof data])
    }
  }

  if (fields.length === 0) return null
  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  params.push(id)
  const sql = `UPDATE courses SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`
  const result = await query(sql, params)
  return result.rows[0] || null
}

export async function deleteCourse(id: string) {
  await query(`DELETE FROM courses WHERE id = $1`, [id])
}

// Garments
export async function getGarments() {
  const result = await query(
    `SELECT * FROM garments ORDER BY sort_order, created_at`
  )
  return result.rows
}

export async function getGarmentBySlug(slug: string) {
  const result = await query(`SELECT * FROM garments WHERE slug = $1`, [slug])
  return result.rows[0] || null
}

export async function getGarmentById(id: number) {
  const result = await query(`SELECT * FROM garments WHERE id = $1`, [id])
  return result.rows[0] || null
}

export async function createGarment(data: {
  name: string
  slug: string
  thumbnail_url: string
  description?: string
  is_active?: boolean
  sort_order?: number
}) {
  const result = await query(
    `INSERT INTO garments (name, slug, thumbnail_url, description, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.name, data.slug, data.thumbnail_url, data.description || '', data.is_active ?? true, data.sort_order ?? 0]
  )
  return result.rows[0]
}

export async function updateGarment(id: number, data: Partial<{
  name: string
  slug: string
  thumbnail_url: string
  description: string
  is_active: boolean
  sort_order: number
}>) {
  const fields: string[] = []
  const params: unknown[] = []
  let i = 1

  const mappings: Record<string, string> = {
    name: 'name', slug: 'slug', thumbnail_url: 'thumbnail_url',
    description: 'description', is_active: 'is_active', sort_order: 'sort_order',
  }

  for (const [key, col] of Object.entries(mappings)) {
    if (data[key as keyof typeof data] !== undefined) {
      fields.push(`${col} = $${i++}`)
      params.push(data[key as keyof typeof data])
    }
  }

  if (fields.length === 0) return null
  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  params.push(id)
  const sql = `UPDATE garments SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`
  const result = await query(sql, params)
  return result.rows[0] || null
}

export async function deleteGarment(id: number) {
  await query(`DELETE FROM garments WHERE id = $1`, [id])
}

// Booking reminders
export async function updateBookingReminder(id: number) {
  const result = await query(
    `UPDATE bookings SET reminder_sent_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id]
  )
  return result.rows[0] || null
}
