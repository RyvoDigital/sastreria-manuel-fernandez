import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

async function fix() {
  const rawDatabaseUrl = process.env.DATABASE_URL
  if (!rawDatabaseUrl) {
    console.log('DATABASE_URL not set')
    process.exit(1)
  }

  const databaseUrl = rawDatabaseUrl.replace(/\?sslmode=[^&]*/, '').replace(/&sslmode=[^&]*/, '')

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: rawDatabaseUrl.includes('localhost') || rawDatabaseUrl.includes('127.0.0.1') || rawDatabaseUrl.includes('::1')
      ? false
      : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })

  try {
    const password = process.env.ADMIN_PASSWORD
    if (!password) {
      console.log('ADMIN_PASSWORD not set')
      process.exit(1)
    }
    
    const hash = await bcrypt.hash(password, 12)
    
    // Upsert: update if exists, insert if not
    const existing = await pool.query(`SELECT id FROM admins WHERE email = 'admin@sastreria.com'`)
    if (existing.rowCount === 0) {
      await pool.query(
        `INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        ['Admin', 'admin@sastreria.com', hash, 'owner']
      )
      console.log('Admin CREATED with password')
    } else {
      await pool.query(
        `UPDATE admins SET password_hash = $1 WHERE email = $2`,
        [hash, 'admin@sastreria.com']
      )
      console.log('Admin password UPDATED')
    }
    
    // Verify
    const result = await pool.query(`SELECT * FROM admins WHERE email = 'admin@sastreria.com'`)
    const admin = result.rows[0]
    const valid = await bcrypt.compare(password, admin.password_hash)
    console.log('Verification:', valid)
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

fix()
