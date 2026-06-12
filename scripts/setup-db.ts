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
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`)
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS locale VARCHAR(10) DEFAULT 'es'`)

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
      { id: 'configurador', name: 'Configurador 3D', enabled: true, price: 29 },
      { id: 'cursos', name: 'Cursos de Sastrería (global)', enabled: true, price: 350 },
      { id: 'cursos-intro', name: 'Curso: Introducción', enabled: true, price: 350 },
      { id: 'cursos-canvas', name: 'Curso: Entretelado', enabled: true, price: 350 },
      { id: 'cursos-lapel', name: 'Curso: Solapas', enabled: true, price: 350 },
      { id: 'cursos-pockets', name: 'Curso: Bolsillos', enabled: true, price: 350 },
      { id: 'cursos-buttonholes', name: 'Curso: Ojales', enabled: true, price: 350 },
      { id: 'cursos-finishes', name: 'Curso: Acabados', enabled: true, price: 350 },
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

    // Payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        stripe_session_id VARCHAR(255) UNIQUE,
        stripe_payment_intent_id VARCHAR(255),
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'eur',
        status VARCHAR(50) DEFAULT 'pending',
        type VARCHAR(50),
        customer_email VARCHAR(200),
        customer_name VARCHAR(100),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(50) PRIMARY KEY,
        title_es VARCHAR(200) NOT NULL,
        title_en VARCHAR(200) NOT NULL,
        title_it VARCHAR(200) NOT NULL,
        title_fr VARCHAR(200) NOT NULL,
        desc_es TEXT,
        desc_en TEXT,
        desc_it TEXT,
        desc_fr TEXT,
        duration VARCHAR(50),
        lessons INTEGER DEFAULT 0,
        image VARCHAR(500),
        price INTEGER NOT NULL DEFAULT 0,
        locked BOOLEAN DEFAULT false,
        enabled BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Migrate hardcoded courses if table is empty
    const courseCount = await pool.query(`SELECT COUNT(*) FROM courses`)
    if (parseInt(courseCount.rows[0].count) === 0) {
      const defaultCourses = [
        { id: 'intro', title_es: 'Introducción a la Sastrería Artesanal', title_en: 'Introduction to Artisan Tailoring', title_it: 'Introduzione alla Sartoria Artigianale', title_fr: 'Introduction à la Tailleur Artisanale', desc_es: 'Fundamentos y filosofía del traje a mano.', desc_en: 'Fundamentals and philosophy of handmade tailoring.', desc_it: 'Fondamenti e filosofia dell\'abito fatto a mano.', desc_fr: 'Fondements et philosophie du costume fait main.', duration: '45 min', lessons: 3, image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1779672949/Screenshot_2026-05-25_at_02.34.21_xacsg5.png', price: 350, locked: false, enabled: true, sort_order: 0 },
        { id: 'canvas', title_es: 'Entretelado a Mano', title_en: 'Hand Canvas', title_it: 'Canvas a Mano', title_fr: 'Canvas à la Main', desc_es: 'Técnicas de cosido de la entretela canvas.', desc_en: 'Hand-stitching canvas interlining techniques.', desc_it: 'Tecniche di cucitura della tela canvas.', desc_fr: 'Techniques de couture de la toile canvas.', duration: '2h 30min', lessons: 5, image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1779673071/WhatsApp_Image_2026-05-24_at_00.37.28_ztx6kh.jpg', price: 350, locked: false, enabled: true, sort_order: 1 },
        { id: 'lapel', title_es: 'Construcción de Solapas', title_en: 'Lapel Construction', title_it: 'Costruzione del Revers', title_fr: 'Construction du Revers', desc_es: 'Tipos de solapa y su confección paso a paso.', desc_en: 'Lapel types and step-by-step construction.', desc_it: 'Tipi di rever e costruzione passo dopo passo.', desc_fr: 'Types de revers et construction étape par étape.', duration: '1h 45min', lessons: 4, image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1778765834/fotos-web/01-atelier-canon/atelier-unknown-006-0582.jpg', price: 350, locked: false, enabled: true, sort_order: 2 },
        { id: 'pockets', title_es: 'Bolsillos de Chaqueta', title_en: 'Jacket Pockets', title_it: 'Tasche della Giacca', title_fr: 'Poches de la Veste', desc_es: 'Bolsillos de ojal, de parche y de tapeta.', desc_en: 'Welt, patch and flap pockets.', desc_it: 'Tasche a filo, a toppa e con patta.', desc_fr: 'Poches passepoilées, à patch et à rabat.', duration: '2h 15min', lessons: 6, image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/showroom-jackets_n55sfk', price: 350, locked: false, enabled: true, sort_order: 3 },
        { id: 'buttonholes', title_es: 'Ojales a Mano', title_en: 'Hand-made Buttonholes', title_it: 'Asole a Mano', title_fr: 'Boutonnières à la Main', desc_es: 'Técnica de ojales de ojaladero.', desc_en: 'Buttonhole stitch technique.', desc_it: 'Tecnica del punto a giorno.', desc_fr: 'Technique du point de boutonnière.', duration: '1h 30min', lessons: 3, image: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/v1779672947/Screenshot_2026-05-25_at_02.32.56_yziv1n.png', price: 350, locked: false, enabled: true, sort_order: 4 },
        { id: 'finishes', title_es: 'Acabados Profesionales', title_en: 'Professional Finishes', title_it: 'Finiture Professionali', title_fr: 'Finitions Professionnelles', desc_es: 'Detalles que marcan la diferencia.', desc_en: 'Details that make the difference.', desc_it: 'Dettagli che fanno la differenza.', desc_fr: 'Détails qui font la différence.', duration: '2h', lessons: 4, image: '/photos/anatomia-traje.png', price: 350, locked: false, enabled: true, sort_order: 5 },
      ]
      for (const c of defaultCourses) {
        await pool.query(
          `INSERT INTO courses (id, title_es, title_en, title_it, title_fr, desc_es, desc_en, desc_it, desc_fr, duration, lessons, image, price, locked, enabled, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [c.id, c.title_es, c.title_en, c.title_it, c.title_fr, c.desc_es, c.desc_en, c.desc_it, c.desc_fr, c.duration, c.lessons, c.image, c.price, c.locked, c.enabled, c.sort_order]
        )
      }
      console.log('Default courses seeded')
    }

    // Garments for 3D Models page
    await pool.query(`
      CREATE TABLE IF NOT EXISTS garments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) NOT NULL UNIQUE,
        thumbnail_url VARCHAR(500) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Seed default garments if table is empty
    const garmentCount = await pool.query(`SELECT COUNT(*) FROM garments`)
    if (parseInt(garmentCount.rows[0].count) === 0) {
      const defaultGarments = [
        { name: 'Traje Clásico a Medida', slug: 'traje-clasico', thumbnail_url: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/IMG_7409_orkk1x', description: 'Traje bespoke clásico en lana premium.', sort_order: 0 },
        { name: 'Smoking de Gala', slug: 'smoking-gala', thumbnail_url: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/wedding-tuxedo_rv21ou', description: 'Smoking negro de ceremonia con solapa de satén.', sort_order: 1 },
        { name: 'Chaqué Nupcial', slug: 'chaque-nupcial', thumbnail_url: 'https://res.cloudinary.com/dp3qxlhb4/image/upload/q_auto/f_auto/photos/wedding-morning-coat_ptibah', description: 'Chaqué tradicional para bodas de mañana.', sort_order: 2 },
      ]
      for (const g of defaultGarments) {
        await pool.query(
          `INSERT INTO garments (name, slug, thumbnail_url, description, is_active, sort_order) VALUES ($1, $2, $3, $4, $5, $6)`,
          [g.name, g.slug, g.thumbnail_url, g.description, true, g.sort_order]
        )
      }
      console.log('Default garments seeded')
    }

    // Add reminder_sent_at to bookings if missing
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP`)

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
