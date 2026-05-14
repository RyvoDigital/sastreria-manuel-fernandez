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
const DELAY_MS = 120          // 8 uploads/sec — safe for Cloudinary
const MAX_RETRIES = 3
const REPORT_PATH = path.join(__dirname, '..', 'CLOUDINARY_MIGRATION_REPORT.json')
const LOG_PATH = path.join(__dirname, '..', 'CLOUDINARY_MIGRATION_LOG.txt')

/* ─── Utils ──────────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function log(msg) {
  fs.appendFileSync(LOG_PATH, msg + '\n')
  console.log(msg)
}

function uploadToCloudinary(source, publicId, resourceType = 'image') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      source,
      { public_id: publicId, overwrite: true, resource_type: resourceType },
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

/* ─── Parse remote URLs ──────────────────────────────────────── */
function parseRemoteUrls() {
  const linksPath = path.join(__dirname, '..', 'CLOUDINARY_DIRECT_LINKS.txt')
  const content = fs.readFileSync(linksPath, 'utf-8')
  const urls = content
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('https://'))

  return urls.map(url => {
    const match = url.match(/\/upload\/v\d+\/(.+)$/)
    const publicId = match ? match[1] : url.split('/').pop()
    return { url, publicId }
  })
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
          results.push({ fullPath, publicId, filename: entry })
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

  log('🔍 Parsing remote URLs and local files...\n')

  const remoteItems = parseRemoteUrls()
  const localItems = findLocalImages()

  log(`Remote images: ${remoteItems.length}`)
  log(`Local images:  ${localItems.length}`)
  log(`Total:         ${remoteItems.length + localItems.length}\n`)

  const report = {
    timestamp: new Date().toISOString(),
    targetCloud: getEnv('Cloud_name'),
    remote: { total: remoteItems.length, success: 0, failed: [], results: [] },
    local: { total: localItems.length, success: 0, failed: [], results: [] },
  }

  /* ── Upload remote (direct URL, no download) ──────────────── */
  log('☁️  Uploading remote images via direct URL...')
  for (let i = 0; i < remoteItems.length; i++) {
    const { url, publicId } = remoteItems[i]
    process.stdout.write(`  [${i + 1}/${remoteItems.length}] ${publicId} ... `)

    try {
      const result = await uploadWithRetry(url, publicId)
      report.remote.success++
      report.remote.results.push({ publicId, url: result.secure_url })
      console.log('✅')
    } catch (err) {
      report.remote.failed.push({ publicId, url, error: err.message })
      console.log(`❌ ${err.message}`)
    }

    await sleep(DELAY_MS)
  }

  /* ── Upload local (from disk) ─────────────────────────────── */
  log('\n📁 Uploading local images from disk...')
  for (let i = 0; i < localItems.length; i++) {
    const { fullPath, publicId, filename } = localItems[i]
    process.stdout.write(`  [${i + 1}/${localItems.length}] ${filename} ... `)

    try {
      const result = await uploadWithRetry(fullPath, publicId)
      report.local.success++
      report.local.results.push({ publicId, localPath: fullPath, url: result.secure_url })
      console.log('✅')
    } catch (err) {
      report.local.failed.push({ publicId, localPath: fullPath, error: err.message })
      console.log(`❌ ${err.message}`)
    }

    await sleep(DELAY_MS)
  }

  /* ── Save report ──────────────────────────────────────────── */
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log('Done!')
  log(`Remote: ${report.remote.success}/${report.remote.total} uploaded`)
  log(`Local:  ${report.local.success}/${report.local.total} uploaded`)
  log(`Report: ${REPORT_PATH}`)
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
