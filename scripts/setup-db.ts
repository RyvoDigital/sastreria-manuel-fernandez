import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

async function setup() {
  const rawDatabaseUrl = process.env.DATABASE_URL

  if (!rawDatabaseUrl) {
    console.log('DATABASE_URL not set. Skipping database setup.')
    process.exit(0)
  }

  const databaseUrl = rawDatabaseUrl.replace(/\?sslmode=[^&]*/, '').replace(/&sslmode=[^&]*/, '')

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: rawDatabaseUrl.includes('localhost') || rawDatabaseUrl.includes('127.0.0.1') || rawDatabaseUrl.includes('::1')
      ? false
      : { rejectUnauthorized: false },
  })

  try {
    // Existing bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'inperson',
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_date_time
      ON bookings (date, time)
    `)

    // Add missing columns if table was created before these existed
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'confirmed'`)
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'inperson'`)

    // Admin users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'manager',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Contact form submissions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        type VARCHAR(50) DEFAULT 'contact',
        message TEXT,
        locale VARCHAR(10) DEFAULT 'es',
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Configurator submissions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS configurations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        fabric VARCHAR(100),
        measurements JSONB,
        design_options JSONB,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Customer notes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customer_notes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(200) NOT NULL,
        name VARCHAR(100),
        notes TEXT,
        measurements JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Editable content
    await pool.query(`
      CREATE TABLE IF NOT EXISTS editable_content (
        id VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Service settings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        price INTEGER,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Seed default settings
    const defaultSettings = [
      { id: 'bodas', name: 'Bodas y Ceremonia', enabled: true, price: null },
      { id: 'trajes', name: 'Trajes a Medida', enabled: true, price: 1200 },
      { id: 'configurador', name: 'Configurador 3D', enabled: true, price: null },
      { id: 'cursos', name: 'Cursos de Sastrería', enabled: true, price: 350 },
      { id: 'videollamada', name: 'Videollamada', enabled: true, price: 50 },
      { id: 'modelos3d', name: 'Modelos 3D', enabled: true, price: null },
      { id: 'contacto', name: 'Formulario de Contacto', enabled: true, price: null },
    ]

    for (const s of defaultSettings) {
      await pool.query(
        `INSERT INTO settings (id, name, enabled, price) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.name, s.enabled, s.price]
      )
    }

    // Seed default admin if none exists and ADMIN_PASSWORD is set
    const adminPassword = process.env.ADMIN_PASSWORD
    if (adminPassword) {
      const existing = await pool.query(`SELECT id FROM admins WHERE email = 'admin@sastreria.com'`)
      if (existing.rowCount === 0) {
        const hash = await bcrypt.hash(adminPassword, 12)
        await pool.query(
          `INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
          ['Admin', 'admin@sastreria.com', hash, 'owner']
        )
        console.log('Default admin created: admin@sastreria.com')
      }
    }

    console.log('Database setup complete')
  } catch (err) {
    console.error('Failed to set up database:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setup()
