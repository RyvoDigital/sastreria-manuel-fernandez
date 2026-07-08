/**
 * Migrate images from Cloudinary URLs to ImageKit.
 *
 * Required .env vars:
 *   IMAGEKIT_PUBLIC_KEY
 *   IMAGEKIT_PRIVATE_KEY
 *   IMAGEKIT_URL_ENDPOINT   e.g. https://ik.imagekit.io/your_imagekit_id
 *
 * Usage:
 *   node scripts/migrate-to-imagekit.js
 *
 * Reads CLOUDINARY_NEW_LINKS.txt, uploads each image to ImageKit,
 * writes IMAGEKIT_MIGRATION_REPORT.json with old → new URL mapping.
 */

const fs = require('fs')
const path = require('path')
const ImageKit = require('imagekit')

const envPath = path.join(__dirname, '..', '.env')
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : ''
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.+)$`, 'm'))
  return match ? match[1].trim() : ''
}

const publicKey = getEnv('IMAGEKIT_PUBLIC_KEY')
const privateKey = getEnv('IMAGEKIT_PRIVATE_KEY')
const urlEndpoint = getEnv('IMAGEKIT_URL_ENDPOINT')

if (!publicKey || !privateKey || !urlEndpoint) {
  console.error(`
Missing ImageKit credentials in .env

Add these from https://imagekit.io/dashboard/developer/api-keys :

  IMAGEKIT_PUBLIC_KEY=public_...
  IMAGEKIT_PRIVATE_KEY=private_...
  IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID

Also add to Vercel env vars after migration.
`)
  process.exit(1)
}

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint })

const DELAY_MS = 200
const MAX_RETRIES = 3
const LINKS_PATH = path.join(__dirname, '..', 'CLOUDINARY_NEW_LINKS.txt')
const REPORT_PATH = path.join(__dirname, '..', 'IMAGEKIT_MIGRATION_REPORT.json')
const LOG_PATH = path.join(__dirname, '..', 'IMAGEKIT_MIGRATION_LOG.txt')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function log(msg) {
  fs.appendFileSync(LOG_PATH, msg + '\n')
  console.log(msg)
}

function parseCloudinaryUrls() {
  const content = fs.readFileSync(LINKS_PATH, 'utf-8')
  return content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('https://res.cloudinary.com'))
    .map((url) => {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/)
      const filePath = match ? match[1] : url.split('/').pop()
      const fileName = filePath.split('/').pop()
      const folder = filePath.includes('/') ? '/' + filePath.split('/').slice(0, -1).join('/') : '/photos'
      return { url, filePath, fileName, folder }
    })
}

async function uploadFromUrl(item, retries = 0) {
  try {
    const result = await imagekit.upload({
      file: item.url,
      fileName: item.fileName,
      folder: item.folder,
      useUniqueFileName: false,
      overwriteFile: true,
      overwriteAITags: false,
    })
    return result.url
  } catch (err) {
    if (retries < MAX_RETRIES) {
      log(`  Retry ${retries + 1} for ${item.filePath}...`)
      await sleep(DELAY_MS * 3)
      return uploadFromUrl(item, retries + 1)
    }
    throw err
  }
}

async function main() {
  fs.writeFileSync(LOG_PATH, `ImageKit migration started ${new Date().toISOString()}\n`)

  let report = { migrated: [], failed: [], skipped: [] }
  if (fs.existsSync(REPORT_PATH)) {
    report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'))
  }

  const done = new Set(report.migrated.map((r) => r.oldUrl))
  const items = parseCloudinaryUrls()

  log(`Found ${items.length} Cloudinary URLs`)
  log(`Already migrated: ${done.size}`)

  for (const item of items) {
    if (done.has(item.url)) {
      log(`Skip (done): ${item.filePath}`)
      continue
    }

    log(`Uploading: ${item.filePath}`)
    try {
      const newUrl = await uploadFromUrl(item)
      report.migrated.push({ oldUrl: item.url, newUrl, filePath: item.filePath })
      fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
      log(`  OK → ${newUrl}`)
    } catch (err) {
      const msg = err.message || String(err)
      report.failed.push({ oldUrl: item.url, filePath: item.filePath, error: msg })
      fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
      log(`  FAIL: ${msg}`)
    }

    await sleep(DELAY_MS)
  }

  log(`\nDone. Migrated: ${report.migrated.length}, Failed: ${report.failed.length}`)
  log(`Report: ${REPORT_PATH}`)
  log(`\nNext: run  node scripts/replace-imagekit-urls.js  to update codebase URLs`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})