// One-off, run by hand after feat/gestion is merged and deployed (setup-db must have created `clientes`).
//
//   DATABASE_URL=… npx tsx scripts/backfill-clientes.ts            # dry run: prints what it would do
//   DATABASE_URL=… npx tsx scripts/backfill-clientes.ts --apply    # writes, in one transaction
//
// Idempotent: re-running changes nothing. Never overwrites a non-empty field on an existing cliente,
// and leaves bookings / customer_notes rows untouched apart from setting bookings.cliente_id.
import { Pool } from 'pg'

const apply = process.argv.includes('--apply')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const IMPORT_MARK = 'Importado de notas antiguas'

async function main() {
  const raw = process.env.DATABASE_URL
  if (!raw) throw new Error('DATABASE_URL not set')
  const local = /localhost|127\.0\.0\.1|::1/.test(raw)
  const pool = new Pool({
    connectionString: raw.replace(/[?&]sslmode=[^&]*/, ''),
    ssl: local ? false : { rejectUnauthorized: false },
  })
  const client = await pool.connect()
  const counts = { emails: 0, invalid: 0, created: 0, existing: 0, filled: 0, bookingsLinked: 0, notesMigrated: 0, medidasMigrated: 0 }

  try {
    await client.query('BEGIN')

    // One row per distinct email, with the freshest name / phone / locale from bookings and notes
    const { rows: people } = await client.query(`
      WITH emails AS (
        SELECT lower(btrim(email)) AS email FROM bookings WHERE email IS NOT NULL AND btrim(email) <> ''
        UNION
        SELECT lower(btrim(email)) FROM customer_notes WHERE email IS NOT NULL AND btrim(email) <> ''
      )
      SELECT e.email,
        (SELECT NULLIF(btrim(n.name), '') FROM customer_notes n WHERE lower(btrim(n.email)) = e.email AND NULLIF(btrim(n.name), '') IS NOT NULL ORDER BY n.updated_at DESC NULLS LAST, n.id DESC LIMIT 1) AS note_name,
        (SELECT NULLIF(btrim(b.name), '') FROM bookings b WHERE lower(btrim(b.email)) = e.email ORDER BY b.created_at DESC NULLS LAST, b.id DESC LIMIT 1) AS booking_name,
        (SELECT NULLIF(btrim(b.phone), '') FROM bookings b WHERE lower(btrim(b.email)) = e.email AND NULLIF(btrim(b.phone), '') IS NOT NULL ORDER BY b.created_at DESC NULLS LAST, b.id DESC LIMIT 1) AS phone,
        (SELECT b.locale FROM bookings b WHERE lower(btrim(b.email)) = e.email AND b.locale IS NOT NULL ORDER BY b.created_at DESC NULLS LAST, b.id DESC LIMIT 1) AS locale,
        (SELECT string_agg(NULLIF(btrim(n.notes), ''), E'\\n\\n' ORDER BY n.id) FROM customer_notes n WHERE lower(btrim(n.email)) = e.email) AS notes,
        (SELECT n.measurements FROM customer_notes n WHERE lower(btrim(n.email)) = e.email AND n.measurements IS NOT NULL AND n.measurements <> '{}'::jsonb ORDER BY n.updated_at DESC NULLS LAST, n.id DESC LIMIT 1) AS measurements
      FROM emails e
      ORDER BY e.email
    `)
    counts.emails = people.length

    for (const p of people) {
      if (!EMAIL_RE.test(p.email)) {
        counts.invalid++
        continue
      }
      const name = p.note_name || p.booking_name || p.email.split('@')[0]
      const existing = (await client.query(`SELECT * FROM clientes WHERE lower(email) = $1`, [p.email])).rows[0]
      let clienteId: number

      if (existing) {
        counts.existing++
        clienteId = existing.id
        // Fill only empty fields
        const fill = await client.query(
          `UPDATE clientes SET
             telefono = COALESCE(NULLIF(telefono, ''), $2),
             notas = CASE WHEN NULLIF(btrim(notas), '') IS NULL THEN $3 ELSE notas END
           WHERE id = $1
             AND ((NULLIF(telefono, '') IS NULL AND $2::text IS NOT NULL) OR (NULLIF(btrim(notas), '') IS NULL AND $3::text IS NOT NULL))`,
          [clienteId, p.phone, p.notes]
        )
        counts.filled += fill.rowCount ?? 0
        if (p.notes && !existing.notas?.trim()) counts.notesMigrated++
      } else {
        const ins = await client.query(
          `INSERT INTO clientes (nombre, email, telefono, idioma, notas, origen)
           VALUES ($1, $2, $3, $4, $5, 'backfill') RETURNING id`,
          [name.slice(0, 100), p.email, p.phone, (p.locale || 'es').slice(0, 5), p.notes]
        )
        counts.created++
        clienteId = ins.rows[0].id
        if (p.notes) counts.notesMigrated++
      }

      if (p.measurements && Object.keys(p.measurements).length > 0) {
        const already = await client.query(
          `SELECT 1 FROM cliente_medidas WHERE cliente_id = $1 AND observaciones = $2`,
          [clienteId, IMPORT_MARK]
        )
        if (already.rowCount === 0) {
          await client.query(
            `INSERT INTO cliente_medidas (cliente_id, tipo_prenda, medidas, observaciones) VALUES ($1, 'general', $2, $3)`,
            [clienteId, JSON.stringify(p.measurements), IMPORT_MARK]
          )
          counts.medidasMigrated++
        }
      }
    }

    const linked = await client.query(`
      UPDATE bookings b SET cliente_id = c.id
        FROM clientes c
       WHERE b.cliente_id IS NULL AND b.email IS NOT NULL AND lower(btrim(b.email)) = lower(c.email)
    `)
    counts.bookingsLinked = linked.rowCount ?? 0

    const unlinked = (await client.query(`SELECT COUNT(*)::int AS n FROM bookings WHERE cliente_id IS NULL`)).rows[0].n

    if (apply) {
      await client.query('COMMIT')
    } else {
      await client.query('ROLLBACK')
    }

    console.log(apply ? 'APPLIED' : 'DRY RUN (nothing written; pass --apply to write)')
    console.table({
      'distinct emails found': counts.emails,
      'skipped (invalid email)': counts.invalid,
      'clientes created': counts.created,
      'clientes already existing': counts.existing,
      'existing clientes with empty fields filled': counts.filled,
      'notes migrated': counts.notesMigrated,
      'measurement sets migrated': counts.medidasMigrated,
      'bookings linked': counts.bookingsLinked,
      'bookings still unlinked (no/invalid email)': unlinked,
    })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((error) => {
  console.error('Backfill failed:', error)
  process.exit(1)
})
