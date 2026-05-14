const fs = require('fs')
const path = require('path')
const { v2: cloudinary } = require('cloudinary')

/* ─── Load credentials from .env ─────────────────────────────── */
const envPath = path.join(__dirname, '..', '.env')
const env = fs.readFileSync(envPath, 'utf-8')
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.+)$`, 'm'))
  return match ? match[1].trim() : ''
}

cloudinary.config({
  cloud_name: getEnv('Cloud_name'),
  api_key: getEnv('API_Key'),
  api_secret: getEnv('API_Secret'),
})

/* ─── Config ─────────────────────────────────────────────────── */
const DELAY_MS = 120
const MAX_RETRIES = 2
const LOG_PATH = path.join(__dirname, '..', 'CLOUDINARY_RESUME_LOG.txt')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function log(msg) {
  fs.appendFileSync(LOG_PATH, msg + '\n')
  console.log(msg)
}

function uploadToCloudinary(source, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      source,
      { public_id: publicId, overwrite: true },
      (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }
    )
  })
}

async function uploadWithRetry(source, publicId, retries = 0) {
  try {
    return await uploadToCloudinary(source, publicId)
  } catch (err) {
    if (retries < MAX_RETRIES) {
      log(`  ⚠️  Retry ${retries + 1} for ${publicId}...`)
      await sleep(DELAY_MS * 3)
      return uploadWithRetry(source, publicId, retries + 1)
    }
    throw err
  }
}

/* ─── List existing resources in new account ─────────────────── */
async function getExistingPublicIds(prefix = 'fotos-web') {
  const existing = new Set()
  let nextCursor = null
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix,
      max_results: 500,
      next_cursor: nextCursor,
    })
    result.resources.forEach(r => existing.add(r.public_id))
    nextCursor = result.next_cursor
  } while (nextCursor)
  return existing
}

/* ─── Find local images ──────────────────────────────────────── */
function findLocalImages() {
  const fotosPath = path.join(__dirname, '..', 'FOTOS WEB')
  if (!fs.existsSync(fotosPath)) return []

  const results = []
  function walk(dir, relDir) {
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry)
      const relPath = path.join(relDir, entry)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath, relPath)
      } else {
        const ext = path.extname(entry).toLowerCase()
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.mp4', '.mov'].includes(ext)) {
          const publicId = 'fotos-web/' + relPath.replace(/\\/g, '/').replace(/\.[^.]+$/, '')
          results.push({ fullPath, publicId, filename: entry, size: stat.size })
        }
      }
    }
  }
  walk(fotosPath, '')
  return results
}

/* ─── Main ───────────────────────────────────────────────────── */
async function main() {
  if (fs.existsSync(LOG_PATH)) fs.unlinkSync(LOG_PATH)

  log('🔍 Checking what already exists in new Cloudinary account...')
  const existing = await getExistingPublicIds('fotos-web')
  log(`Found ${existing.size} existing fotos-web images.\n`)

  const localItems = findLocalImages()
  const toUpload = localItems.filter(item => {
    if (existing.has(item.publicId)) return false
    if (item.size > 10 * 1024 * 1024) {
      log(`  ⏭️  SKIP (too large: ${(item.size / 1024 / 1024).toFixed(1)}MB) — ${item.filename}`)
      return false
    }
    return true
  })

  log(`Local total:    ${localItems.length}`)
  log(`Already uploaded: ${existing.size}`)
  log(`Too large (>10MB): ${localItems.filter(i => i.size > 10 * 1024 * 1024).length}`)
  log(`Remaining:      ${toUpload.length}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < toUpload.length; i++) {
    const { fullPath, publicId, filename } = toUpload[i]
    process.stdout.write(`  [${i + 1}/${toUpload.length}] ${filename} ... `)

    try {
      await uploadWithRetry(fullPath, publicId)
      success++
      console.log('✅')
    } catch (err) {
      failed++
      console.log(`❌ ${err.message}`)
    }

    await sleep(DELAY_MS)
  }

  log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  log(`Done! ${success} uploaded, ${failed} failed`)
  log(`Total in account: ${existing.size + success}`)
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
