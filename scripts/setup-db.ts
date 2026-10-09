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
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)

    // Blocked time slots (admin can mark slots unavailable per day)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blocked_slots (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, time)
      )
    `)

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blocked_slots_date
      ON blocked_slots (date)
    `)

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
      { id: 'cursos', name: 'Cursos de Sastrería (global)', enabled: true, price: 350 },
      { id: 'cursos-intro', name: 'Curso: Introducción', enabled: true, price: 350 },
      { id: 'cursos-canvas', name: 'Curso: Entretelado', enabled: true, price: 350 },
      { id: 'cursos-lapel', name: 'Curso: Solapas', enabled: true, price: 350 },
      { id: 'cursos-pockets', name: 'Curso: Bolsillos', enabled: true, price: 350 },
      { id: 'cursos-buttonholes', name: 'Curso: Ojales', enabled: true, price: 350 },
      { id: 'cursos-finishes', name: 'Curso: Acabados', enabled: true, price: 350 },
      { id: 'videollamada', name: 'Videollamada', enabled: true, price: 50 },
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

    // Canonical course thumbnails, self-hosted in public/img (live page reads from DB, not static component)
    const courseImages: Record<string, string> = {
      intro: '/img/curso-manuel-fernandez-mesa-corte.webp',
      canvas: '/img/solapa-chaqueta-cuadros-curso.webp',
      lapel: '/img/chaleco-verde-chaqueta-azul-showroom.webp',
      pockets: '/img/chaquetas-maniquies-showroom.webp',
      buttonholes: '/img/chaqueta-azul-terminada-despues.webp',
      finishes: '/img/anatomia-traje-forro-interior.webp',
    }

    // Migrate hardcoded courses if table is empty
    const courseCount = await pool.query(`SELECT COUNT(*) FROM courses`)
    if (parseInt(courseCount.rows[0].count) === 0) {
      const defaultCourses = [
        { id: 'intro', title_es: 'Introducción a la Sastrería Artesanal', title_en: 'Introduction to Artisan Tailoring', title_it: 'Introduzione alla Sartoria Artigianale', title_fr: 'Introduction à la Tailleur Artisanale', desc_es: 'Fundamentos y filosofía del traje a mano.', desc_en: 'Fundamentals and philosophy of handmade tailoring.', desc_it: 'Fondamenti e filosofia dell\'abito fatto a mano.', desc_fr: 'Fondements et philosophie du costume fait main.', duration: '45 min', lessons: 3, image: courseImages.intro, price: 350, locked: false, enabled: true, sort_order: 0 },
        { id: 'canvas', title_es: 'Entretelado a Mano', title_en: 'Hand Canvas', title_it: 'Canvas a Mano', title_fr: 'Canvas à la Main', desc_es: 'Técnicas de cosido de la entretela canvas.', desc_en: 'Hand-stitching canvas interlining techniques.', desc_it: 'Tecniche di cucitura della tela canvas.', desc_fr: 'Techniques de couture de la toile canvas.', duration: '2h 30min', lessons: 5, image: courseImages.canvas, price: 350, locked: false, enabled: true, sort_order: 1 },
        { id: 'lapel', title_es: 'Construcción de Solapas', title_en: 'Lapel Construction', title_it: 'Costruzione del Revers', title_fr: 'Construction du Revers', desc_es: 'Tipos de solapa y su confección paso a paso.', desc_en: 'Lapel types and step-by-step construction.', desc_it: 'Tipi di rever e costruzione passo dopo passo.', desc_fr: 'Types de revers et construction étape par étape.', duration: '1h 45min', lessons: 4, image: courseImages.lapel, price: 350, locked: false, enabled: true, sort_order: 2 },
        { id: 'pockets', title_es: 'Bolsillos de Chaqueta', title_en: 'Jacket Pockets', title_it: 'Tasche della Giacca', title_fr: 'Poches de la Veste', desc_es: 'Bolsillos de ojal, de parche y de tapeta.', desc_en: 'Welt, patch and flap pockets.', desc_it: 'Tasche a filo, a toppa e con patta.', desc_fr: 'Poches passepoilées, à patch et à rabat.', duration: '2h 15min', lessons: 6, image: courseImages.pockets, price: 350, locked: false, enabled: true, sort_order: 3 },
        { id: 'buttonholes', title_es: 'Ojales a Mano', title_en: 'Hand-made Buttonholes', title_it: 'Asole a Mano', title_fr: 'Boutonnières à la Main', desc_es: 'Técnica de ojales de ojaladero.', desc_en: 'Buttonhole stitch technique.', desc_it: 'Tecnica del punto a giorno.', desc_fr: 'Technique du point de boutonnière.', duration: '1h 30min', lessons: 3, image: courseImages.buttonholes, price: 350, locked: false, enabled: true, sort_order: 4 },
        { id: 'finishes', title_es: 'Acabados Profesionales', title_en: 'Professional Finishes', title_it: 'Finiture Professionali', title_fr: 'Finitions Professionnelles', desc_es: 'Detalles que marcan la diferencia.', desc_en: 'Details that make the difference.', desc_it: 'Dettagli che fanno la differenza.', desc_fr: 'Détails qui font la différence.', duration: '2h', lessons: 4, image: courseImages.finishes, price: 350, locked: false, enabled: true, sort_order: 5 },
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

    // Repair course images that point at dead remote hosts (Cloudinary, ImageKit) or are empty.
    // Relative /img/... paths are the canonical value now and must NOT be treated as broken.
    let courseImagesFixed = 0
    for (const [id, image] of Object.entries(courseImages)) {
      const result = await pool.query(
        `UPDATE courses
         SET image = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
           AND (
             image IS NULL
             OR image = ''
             OR image LIKE '%res.cloudinary.com%'
             OR image LIKE '%ik.imagekit.io%'
           )`,
        [image, id]
      )
      courseImagesFixed += result.rowCount ?? 0
    }
    if (courseImagesFixed > 0) {
      console.log(`Course images repaired to local /img paths: ${courseImagesFixed}`)
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
        { name: 'Traje Clásico a Medida', slug: 'traje-clasico', thumbnail_url: '/img/toma-medidas-cliente.webp', description: 'Traje bespoke clásico en lana premium.', sort_order: 0 },
        { name: 'Smoking de Gala', slug: 'smoking-gala', thumbnail_url: '/img/smoking-novio-gala.webp', description: 'Smoking negro de ceremonia con solapa de satén.', sort_order: 1 },
        { name: 'Chaqué Nupcial', slug: 'chaque-nupcial', thumbnail_url: '/img/novio-chaque-roma.webp', description: 'Chaqué tradicional para bodas de mañana.', sort_order: 2 },
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

    await setupGestion(pool)

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

// Gestión (clientes, proveedores, inventario…). See docs/gestion-data-model.md.
// This runs on every build, preview builds included, so everything here must stay
// additive and idempotent: IF NOT EXISTS, OR REPLACE, ON CONFLICT DO NOTHING. Never DROP.
async function setupGestion(pool: Pool) {
  await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE`)

  // Trigram search is optional: fall back to plain ILIKE if the extension can't be created
  let hasTrgm = false
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`)
    hasTrgm = true
  } catch (err) {
    console.warn('pg_trgm unavailable, search indexes skipped:', (err as Error).message)
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellidos VARCHAR(150),
      email VARCHAR(200),
      telefono VARCHAR(50),
      nif VARCHAR(20),
      direccion VARCHAR(200),
      codigo_postal VARCHAR(10),
      ciudad VARCHAR(100),
      pais VARCHAR(100),
      fecha_nacimiento DATE,
      idioma VARCHAR(5) NOT NULL DEFAULT 'es',
      notas TEXT,
      origen VARCHAR(20) NOT NULL DEFAULT 'tienda',
      acepta_comunicaciones BOOLEAN NOT NULL DEFAULT FALSE,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS clientes_email_key ON clientes (lower(email)) WHERE email IS NOT NULL`)
  await pool.query(`CREATE INDEX IF NOT EXISTS clientes_telefono_idx ON clientes (telefono)`)
  if (hasTrgm) {
    await pool.query(`
      CREATE INDEX IF NOT EXISTS clientes_nombre_trgm ON clientes
      USING gin ((lower(nombre || ' ' || coalesce(apellidos, ''))) gin_trgm_ops)
    `)
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cliente_medidas (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
      tipo_prenda VARCHAR(30) NOT NULL DEFAULT 'general',
      medidas JSONB NOT NULL DEFAULT '{}',
      observaciones TEXT,
      tomada_por INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      tomada_en DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS cliente_medidas_cliente_idx ON cliente_medidas (cliente_id, tipo_prenda, tomada_en DESC)`)

  // Citas: link bookings to clientes. New bookings come from public code (lib/bookings.ts),
  // so a trigger does the linking instead of the insert itself.
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL`)
  await pool.query(`CREATE INDEX IF NOT EXISTS bookings_cliente_idx ON bookings (cliente_id)`)
  await pool.query(`
    CREATE OR REPLACE FUNCTION bookings_link_cliente() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE
      cid INTEGER;
    BEGIN
      IF NEW.cliente_id IS NOT NULL OR NEW.email IS NULL OR btrim(NEW.email) = '' THEN
        RETURN NEW;
      END IF;
      SELECT id INTO cid FROM clientes WHERE lower(email) = lower(btrim(NEW.email));
      IF cid IS NULL THEN
        INSERT INTO clientes (nombre, email, telefono, idioma, origen)
        VALUES (NEW.name, lower(btrim(NEW.email)), NEW.phone, COALESCE(NEW.locale, 'es'), 'web')
        ON CONFLICT ((lower(email))) WHERE email IS NOT NULL DO UPDATE SET email = clientes.email
        RETURNING id INTO cid;
      END IF;
      NEW.cliente_id := cid;
      RETURN NEW;
    EXCEPTION WHEN others THEN
      -- Linking is a convenience: never let it block a booking
      RETURN NEW;
    END
    $$
  `)
  const trigger = await pool.query(
    `SELECT 1 FROM pg_trigger WHERE tgname = 'bookings_link_cliente_trg' AND tgrelid = 'bookings'::regclass`
  )
  if (trigger.rowCount === 0) {
    await pool.query(`
      CREATE TRIGGER bookings_link_cliente_trg BEFORE INSERT ON bookings
      FOR EACH ROW EXECUTE FUNCTION bookings_link_cliente()
    `)
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS proveedores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      razon_social VARCHAR(200),
      nif VARCHAR(20),
      persona_contacto VARCHAR(150),
      email VARCHAR(200),
      telefono VARCHAR(50),
      web VARCHAR(200),
      direccion VARCHAR(200),
      ciudad VARCHAR(100),
      pais VARCHAR(100),
      condiciones TEXT,
      notas TEXT,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  if (hasTrgm) {
    await pool.query(`CREATE INDEX IF NOT EXISTS proveedores_nombre_trgm ON proveedores USING gin (lower(nombre) gin_trgm_ops)`)
  }

  await setupInventario(pool, hasTrgm)
}

async function setupInventario(pool: Pool, hasTrgm: boolean) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categorias_producto (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(80) NOT NULL,
      slug VARCHAR(80) NOT NULL UNIQUE,
      tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('terminado', 'material')),
      unidad_defecto VARCHAR(10) NOT NULL DEFAULT 'ud',
      iva_defecto NUMERIC(5,2) NOT NULL DEFAULT 21,
      orden INTEGER NOT NULL DEFAULT 0,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (nombre, tipo)
    )
  `)
  const SUBTIPOS_SEMILLA: Record<string, string[]> = { 'botones-taller': ['Clásicos', 'Beta', 'Metálicos', 'Especiales'] }
  const categorias: [string, string, 'terminado' | 'material', string][] = [
    ['tirantes', 'Tirantes', 'terminado', 'ud'],
    ['corbatas', 'Corbatas', 'terminado', 'ud'],
    ['pajaritas', 'Pajaritas', 'terminado', 'ud'],
    ['gemelos', 'Gemelos', 'terminado', 'par'],
    ['panuelos', 'Pañuelos', 'terminado', 'ud'],
    ['camisas', 'Camisas', 'terminado', 'ud'],
    ['zapatos', 'Zapatos', 'terminado', 'par'],
    ['cinturones', 'Cinturones', 'terminado', 'ud'],
    ['fajines', 'Fajines', 'terminado', 'ud'],
    ['chalecos', 'Chalecos', 'terminado', 'ud'],
    ['calcetines', 'Calcetines', 'terminado', 'par'],
    ['otros-complementos', 'Otros complementos', 'terminado', 'ud'],
    ['tejidos', 'Tejidos', 'material', 'm'],
    ['forros', 'Forros', 'material', 'm'],
    ['botones-taller', 'Botones', 'material', 'ud'],
    ['hilos', 'Hilos', 'material', 'bobina'],
    ['entretelas', 'Entretelas', 'material', 'm'],
    ['cremalleras', 'Cremalleras', 'material', 'ud'],
  ]
  // Subtypes inside a category (Botones: Clásicos, Beta, Metálicos, Especiales), editable in Categorías
  await pool.query(`ALTER TABLE categorias_producto ADD COLUMN IF NOT EXISTS subtipos JSONB NOT NULL DEFAULT '[]'`)
  for (const [i, [slug, nombre, tipo, unidad]] of categorias.entries()) {
    await pool.query(
      `INSERT INTO categorias_producto (slug, nombre, tipo, unidad_defecto, orden, subtipos) VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [slug, nombre, tipo, unidad, i, JSON.stringify(SUBTIPOS_SEMILLA[slug] ?? [])]
    )
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      categoria_id INTEGER NOT NULL REFERENCES categorias_producto(id),
      nombre VARCHAR(200) NOT NULL,
      referencia VARCHAR(60),
      marca VARCHAR(100),
      proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
      descripcion TEXT,
      color VARCHAR(80),
      material VARCHAR(80),
      talla VARCHAR(80),
      unidad VARCHAR(10) NOT NULL DEFAULT 'ud',
      coste NUMERIC(12,2),
      pvp NUMERIC(12,2),
      iva NUMERIC(5,2) NOT NULL DEFAULT 21,
      stock_minimo_defecto NUMERIC(12,3) NOT NULL DEFAULT 0,
      ubicacion VARCHAR(100),
      foto_url VARCHAR(500),
      foto_thumb_url VARCHAR(500),
      observaciones TEXT,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`ALTER TABLE productos ADD COLUMN IF NOT EXISTS subtipo VARCHAR(60)`)
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS productos_referencia_key ON productos (lower(referencia)) WHERE referencia IS NOT NULL`)
  await pool.query(`CREATE INDEX IF NOT EXISTS productos_categoria_idx ON productos (categoria_id)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS productos_proveedor_idx ON productos (proveedor_id)`)
  if (hasTrgm) {
    await pool.query(`
      CREATE INDEX IF NOT EXISTS productos_busqueda_trgm ON productos
      USING gin ((lower(nombre || ' ' || coalesce(referencia, '') || ' ' || coalesce(marca, ''))) gin_trgm_ops)
    `)
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS producto_variantes (
      id SERIAL PRIMARY KEY,
      producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
      sku VARCHAR(80),
      atributos JSONB NOT NULL DEFAULT '{}',
      etiqueta VARCHAR(150),
      es_unica BOOLEAN NOT NULL DEFAULT FALSE,
      pvp NUMERIC(12,2),
      coste NUMERIC(12,2),
      coste_medio NUMERIC(12,4),
      stock_actual NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
      stock_reservado NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_reservado >= 0),
      stock_minimo NUMERIC(12,3) NOT NULL DEFAULT 0,
      ubicacion VARCHAR(100),
      foto_url VARCHAR(500),
      orden INTEGER NOT NULL DEFAULT 0,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS producto_variantes_sku_key ON producto_variantes (lower(sku)) WHERE sku IS NOT NULL`)
  await pool.query(`CREATE INDEX IF NOT EXISTS producto_variantes_producto_idx ON producto_variantes (producto_id, orden)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS producto_variantes_atributos_idx ON producto_variantes USING gin (atributos)`)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS producto_variantes_alerta_idx ON producto_variantes (producto_id)
    WHERE activo AND stock_actual - stock_reservado <= stock_minimo
  `)

  // Editable list behind the Ubicación dropdowns (productos/variantes keep the name as text)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ubicaciones (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      orden INTEGER NOT NULL DEFAULT 0,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`INSERT INTO ubicaciones (nombre, orden) VALUES ('Taller', 0), ('Sastrería', 1) ON CONFLICT DO NOTHING`)

  // Document numbering (C-2026-0001…), incremented under FOR UPDATE inside each document's transaction
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contadores (
      serie VARCHAR(5) NOT NULL,
      anio INTEGER NOT NULL,
      ultimo INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (serie, anio)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS compras (
      id SERIAL PRIMARY KEY,
      numero VARCHAR(20) NOT NULL UNIQUE,
      proveedor_id INTEGER NOT NULL REFERENCES proveedores(id),
      fecha DATE NOT NULL DEFAULT CURRENT_DATE,
      referencia_proveedor VARCHAR(80),
      estado VARCHAR(12) NOT NULL DEFAULT 'recibida' CHECK (estado IN ('borrador', 'recibida', 'anulada')),
      notas TEXT,
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS compras_proveedor_idx ON compras (proveedor_id, fecha DESC)`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS compra_lineas (
      id SERIAL PRIMARY KEY,
      compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
      variante_id INTEGER NOT NULL REFERENCES producto_variantes(id),
      cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
      coste_unitario NUMERIC(12,4) NOT NULL CHECK (coste_unitario >= 0),
      cantidad_devuelta NUMERIC(12,3) NOT NULL DEFAULT 0
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS compra_lineas_compra_idx ON compra_lineas (compra_id)`)

  // The stock ledger. Append-only; producto_variantes.stock_actual caches SUM(cantidad) per variant.
  // venta/devolución/encargo reference columns get their foreign keys in A3/A4 when those tables exist.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS movimientos_stock (
      id BIGSERIAL PRIMARY KEY,
      variante_id INTEGER NOT NULL REFERENCES producto_variantes(id) ON DELETE RESTRICT,
      tipo VARCHAR(25) NOT NULL CHECK (tipo IN (
        'inicial', 'compra', 'devolucion_proveedor', 'venta', 'devolucion_venta',
        'ajuste', 'consumo_encargo', 'devolucion_encargo'
      )),
      cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad <> 0),
      stock_resultante NUMERIC(12,3) NOT NULL,
      coste_unitario NUMERIC(12,4),
      motivo VARCHAR(30),
      nota TEXT,
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      admin_nombre VARCHAR(100),
      compra_linea_id INTEGER REFERENCES compra_lineas(id),
      venta_linea_id INTEGER,
      devolucion_linea_id INTEGER,
      encargo_material_id INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS movimientos_variante_idx ON movimientos_stock (variante_id, created_at DESC)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS movimientos_tipo_idx ON movimientos_stock (tipo, created_at)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS movimientos_fecha_idx ON movimientos_stock (created_at)`)
  await pool.query(`
    CREATE OR REPLACE FUNCTION movimientos_stock_inmutable() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      RAISE EXCEPTION 'movimientos_stock is append-only: correct with a new ajuste movement';
    END
    $$
  `)
  const trigger = await pool.query(
    `SELECT 1 FROM pg_trigger WHERE tgname = 'movimientos_stock_inmutable_trg' AND tgrelid = 'movimientos_stock'::regclass`
  )
  if (trigger.rowCount === 0) {
    await pool.query(`
      CREATE TRIGGER movimientos_stock_inmutable_trg BEFORE UPDATE OR DELETE ON movimientos_stock
      FOR EACH ROW EXECUTE FUNCTION movimientos_stock_inmutable()
    `)
  }

  await setupVentas(pool)
}

// Sales register. NOT fiscal invoicing: tickets are non-fiscal (VeriFactu is out of scope).
async function setupVentas(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ventas (
      id SERIAL PRIMARY KEY,
      numero VARCHAR(20) NOT NULL UNIQUE,
      fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
      cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      admin_nombre VARCHAR(100),
      metodo_pago VARCHAR(15) NOT NULL CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'bizum', 'transferencia', 'mixto', 'otro')),
      pagos JSONB,
      total_base NUMERIC(12,2) NOT NULL,
      total_iva NUMERIC(12,2) NOT NULL,
      total NUMERIC(12,2) NOT NULL,
      descuento_total NUMERIC(12,2) NOT NULL DEFAULT 0,
      estado VARCHAR(20) NOT NULL DEFAULT 'completada' CHECK (estado IN ('completada', 'devuelta_parcial', 'devuelta')),
      notas TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS ventas_fecha_idx ON ventas (fecha DESC)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS ventas_cliente_idx ON ventas (cliente_id, fecha DESC)`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS venta_lineas (
      id SERIAL PRIMARY KEY,
      venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
      variante_id INTEGER REFERENCES producto_variantes(id),
      descripcion VARCHAR(250) NOT NULL,
      cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
      pvp_unitario NUMERIC(12,2) NOT NULL CHECK (pvp_unitario >= 0),
      descuento_pct NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (descuento_pct BETWEEN 0 AND 100),
      importe_descuento NUMERIC(12,2) NOT NULL DEFAULT 0,
      iva NUMERIC(5,2) NOT NULL,
      base NUMERIC(12,2) NOT NULL,
      cuota_iva NUMERIC(12,2) NOT NULL,
      total NUMERIC(12,2) NOT NULL,
      coste_unitario NUMERIC(12,4),
      cantidad_devuelta NUMERIC(12,3) NOT NULL DEFAULT 0
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS venta_lineas_venta_idx ON venta_lineas (venta_id)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS venta_lineas_variante_idx ON venta_lineas (variante_id)`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS devoluciones (
      id SERIAL PRIMARY KEY,
      numero VARCHAR(20) NOT NULL UNIQUE,
      venta_id INTEGER NOT NULL REFERENCES ventas(id),
      fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      admin_nombre VARCHAR(100),
      motivo TEXT,
      importe_total NUMERIC(12,2) NOT NULL,
      metodo_reembolso VARCHAR(15) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS devoluciones_venta_idx ON devoluciones (venta_id)`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS devolucion_lineas (
      id SERIAL PRIMARY KEY,
      devolucion_id INTEGER NOT NULL REFERENCES devoluciones(id) ON DELETE CASCADE,
      venta_linea_id INTEGER NOT NULL REFERENCES venta_lineas(id),
      cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
      importe NUMERIC(12,2) NOT NULL,
      reponer_stock BOOLEAN NOT NULL DEFAULT TRUE
    )
  `)

  // The ledger columns created in A2 now get their foreign keys
  for (const [name, col, ref] of [
    ['movimientos_venta_linea_fkey', 'venta_linea_id', 'venta_lineas'],
    ['movimientos_devolucion_linea_fkey', 'devolucion_linea_id', 'devolucion_lineas'],
  ]) {
    const exists = await pool.query(`SELECT 1 FROM pg_constraint WHERE conname = $1`, [name])
    if (exists.rowCount === 0) {
      await pool.query(`ALTER TABLE movimientos_stock ADD CONSTRAINT ${name} FOREIGN KEY (${col}) REFERENCES ${ref}(id)`)
    }
  }

  // Products a customer wanted when there was no stock: shown on the Panel until ordered and resolved
  await pool.query(`
    CREATE TABLE IF NOT EXISTS por_pedir (
      id SERIAL PRIMARY KEY,
      variante_id INTEGER REFERENCES producto_variantes(id),
      descripcion VARCHAR(250) NOT NULL,
      cantidad NUMERIC(12,3) NOT NULL DEFAULT 1 CHECK (cantidad > 0),
      cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
      notas TEXT,
      estado VARCHAR(12) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pedido', 'resuelto')),
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      admin_nombre VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS por_pedir_estado_idx ON por_pedir (estado, created_at)`)

  await setupEncargos(pool)
}

// Encargos (bespoke orders) and the workshop. See docs/gestion-data-model.md, "Encargos y Taller".
async function setupEncargos(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sastres (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      orden INTEGER NOT NULL DEFAULT 0,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS encargos (
      id SERIAL PRIMARY KEY,
      numero VARCHAR(20) NOT NULL UNIQUE,
      cliente_id INTEGER NOT NULL REFERENCES clientes(id),
      tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('prenda', 'camisa', 'arreglo')),
      prendas JSONB NOT NULL DEFAULT '[]',
      pedido TEXT,
      estado VARCHAR(12) NOT NULL DEFAULT 'presupuesto'
        CHECK (estado IN ('presupuesto', 'confirmado', 'prueba', 'listo', 'entregado')),
      fecha_encargo DATE NOT NULL DEFAULT CURRENT_DATE,
      fecha_entrega DATE,
      sastre_id INTEGER REFERENCES sastres(id) ON DELETE SET NULL,
      medidas_id INTEGER REFERENCES cliente_medidas(id) ON DELETE RESTRICT,
      caracteristicas JSONB NOT NULL DEFAULT '{}',
      total NUMERIC(12,2) CHECK (total >= 0),
      notas_sastre TEXT,
      comentarios TEXT,
      taller_externo VARCHAR(150),
      taller_enviado DATE,
      taller_devuelto DATE,
      confirmado_at TIMESTAMPTZ,
      entregado_at TIMESTAMPTZ,
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS encargos_cliente_idx ON encargos (cliente_id, fecha_encargo DESC)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS encargos_estado_idx ON encargos (estado, sastre_id)`)

  // Only tejido and forro are tracked per encargo; everything else is general stock adjusted by hand
  await pool.query(`
    CREATE TABLE IF NOT EXISTS encargo_materiales (
      id SERIAL PRIMARY KEY,
      encargo_id INTEGER NOT NULL REFERENCES encargos(id) ON DELETE CASCADE,
      material VARCHAR(10) NOT NULL CHECK (material IN ('tejido', 'forro')),
      origen VARCHAR(12) NOT NULL CHECK (origen IN ('proveedor', 'inventario', 'cliente')),
      proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
      referencia VARCHAR(150),
      metros NUMERIC(12,3) CHECK (metros > 0),
      estado_pedido VARCHAR(10) CHECK (estado_pedido IN ('pedido', 'recibido')),
      variante_id INTEGER REFERENCES producto_variantes(id),
      consumido BOOLEAN NOT NULL DEFAULT FALSE,
      notas TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS encargo_materiales_encargo_idx ON encargo_materiales (encargo_id)`)
  const fk = await pool.query(`SELECT 1 FROM pg_constraint WHERE conname = 'movimientos_encargo_material_fkey'`)
  if (fk.rowCount === 0) {
    await pool.query(`ALTER TABLE movimientos_stock ADD CONSTRAINT movimientos_encargo_material_fkey FOREIGN KEY (encargo_material_id) REFERENCES encargo_materiales(id)`)
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS encargo_pagos (
      id SERIAL PRIMARY KEY,
      encargo_id INTEGER NOT NULL REFERENCES encargos(id),
      fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
      importe NUMERIC(12,2) NOT NULL CHECK (importe > 0),
      metodo VARCHAR(15) NOT NULL CHECK (metodo IN ('efectivo', 'tarjeta', 'bizum', 'transferencia', 'mixto', 'otro')),
      pagos JSONB,
      notas TEXT,
      admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
      admin_nombre VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS encargo_pagos_encargo_idx ON encargo_pagos (encargo_id)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS encargo_pagos_fecha_idx ON encargo_pagos (fecha)`)

  // Citas: appointment type (shown before the client's name) and the encargo a prueba/entrega belongs to.
  // Existing and web bookings are first visits.
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tipo_cita VARCHAR(20) NOT NULL DEFAULT 'primera_visita'`)
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS encargo_id INTEGER REFERENCES encargos(id) ON DELETE SET NULL`)
  await pool.query(`CREATE INDEX IF NOT EXISTS bookings_encargo_idx ON bookings (encargo_id)`)

  // Pruebas are Citas: date, time and status live on the booking
  await pool.query(`
    CREATE TABLE IF NOT EXISTS encargo_pruebas (
      id SERIAL PRIMARY KEY,
      encargo_id INTEGER NOT NULL REFERENCES encargos(id) ON DELETE CASCADE,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
      notas TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS encargo_pruebas_encargo_idx ON encargo_pruebas (encargo_id)`)
  await pool.query(`ALTER TABLE encargos ADD COLUMN IF NOT EXISTS entrega_booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL`)
}

setup()
