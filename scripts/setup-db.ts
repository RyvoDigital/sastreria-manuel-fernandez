import { Pool } from 'pg'

async function setup() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.log('⚠️  DATABASE_URL not set. Skipping database setup.')
    process.exit(0)
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') || databaseUrl.includes('::1')
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
