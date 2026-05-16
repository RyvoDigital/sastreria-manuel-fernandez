import { pool } from '../lib/db'

async function setup() {
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
