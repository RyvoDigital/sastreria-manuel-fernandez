import { Pool } from 'pg'

async function setup() {
  const rawDatabaseUrl = process.env.DATABASE_URL

  if (!rawDatabaseUrl) {
    console.log('⚠️  DATABASE_URL not set. Skipping database setup.')
    process.exit(0)
  }

  // Strip sslmode to avoid pg v8 warning + let our explicit ssl config handle it
  const databaseUrl = rawDatabaseUrl.replace(/\?sslmode=[^&]*/, '').replace(/&sslmode=[^&]*/, '')

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: rawDatabaseUrl.includes('localhost') || rawDatabaseUrl.includes('127.0.0.1') || rawDatabaseUrl.includes('::1')
      ? false
      : { rejectUnauthorized: false },
  })

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'inperson',
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_date_time
      ON bookings (date, time)
    `)

    console.log('✅ Bookings table ready')
  } catch (err) {
    console.error('❌ Failed to set up database:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setup()
