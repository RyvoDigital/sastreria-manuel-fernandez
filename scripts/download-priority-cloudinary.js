/**
 * Download priority Cloudinary assets before account limits kick in.
 * Saves to raw/cloudinary-backup/ preserving folder structure.
 *
 * Usage: node scripts/download-priority-cloudinary.js
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'raw', 'cloudinary-backup')
const LOG_PATH = path.join(ROOT, 'PRIORITY_DOWNLOAD_LOG.txt')
const REPORT_PATH = path.join(ROOT, 'PRIORITY_DOWNLOAD_REPORT.json')

function log(msg) {
  fs.appendFileSync(LOG_PATH, msg + '\n')
  console.log(msg)
}

function collectUrls() {
  const urls = new Set()

  const scan = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', '.next'].includes(e.name)) continue
      const full = path.join(dir, e.name)
      if (e.isDirectory()) scan(full)
      else if (/\.(tsx|ts|js)$/.test(e.name)) {
        const c = fs.readFileSync(full, 'utf8')
        for (const u of c.match(/https:\/\/res\.cloudinary\.com\/[^'"`\s)]+/g) || []) {
          urls.add(u.replace(/['"`]$/, '').split('?')[0])
        }
      }
    }
  }

  scan(path.join(ROOT, 'app'))
  scan(path.join(ROOT, 'components'))
  scan(path.join(ROOT, 'scripts'))

  const linksPath = path.join(ROOT, 'CLOUDINARY_NEW_LINKS.txt')
  if (fs.existsSync(linksPath)) {
    fs.readFileSync(linksPath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('http'))
      .forEach((u) => urls.add(u.split('?')[0]))
  }

  return [...urls]
}

function extractPath(url) {
  const m = url.match(/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/(.+)$/)
  if (!m) return null
  let p = m[1] + '/' + m[2]
  p = p.replace(/^(?:q_auto(?::best)?\/|f_auto\/|w_\d+\/)+/g, '')
  return p
}

function isPriority(pathAfterUpload) {
  if (!pathAfterUpload) return false
  if (pathAfterUpload.startsWith('video/')) return true
  if (pathAfterUpload.includes('web_lista_images/')) return true
  if (pathAfterUpload.includes('fotos-web/03-screenshots/')) return true
  if (pathAfterUpload.includes('fotos-web/02-ai-promo/')) return true
  if (/screenshot/i.test(pathAfterUpload)) return true
  if (/WhatsApp_Image_2026/i.test(pathAfterUpload)) return true
  if (/ChatGPT_Image/i.test(pathAfterUpload)) return true
  if (pathAfterUpload.includes('photos/fabrics/')) return true
  if (pathAfterUpload.includes('25ED7BDA')) return true
  return false
}

function canonicalKey(pathAfterUpload) {
  let p = pathAfterUpload.replace(/^image\//, '').replace(/^video\//, 'video/')
  p = p.replace(/^v\d+\//, '')
  p = p.replace(/\.(jpe?g|png|webp|gif|mp4)\.(jpe?g|png|webp|gif|mp4)$/i, '.$1')
  p = p.replace(/_[a-z0-9]{6}$/i, '')
  if (!/\.(jpe?g|png|webp|gif|mp4)$/i.test(p)) {
    if (pathAfterUpload.startsWith('video/')) p += '.mp4'
    else p += '.jpg'
  }
  return p
}

function pickBestUrl(urlsForKey) {
  // Prefer URLs with version + file extension (highest quality originals)
  const scored = urlsForKey.map((url) => {
    const p = extractPath(url) || ''
    let score = 0
    if (/^v\d+\//.test(p.replace(/^image\//, '').replace(/^video\//, ''))) score += 10
    if (/\.(jpe?g|png|webp|gif|mp4)/i.test(p)) score += 10
    if (p.includes('q_auto')) score -= 2
    if (p.includes('w_')) score -= 5
    if (url.includes('dp3qxlhb4')) score += 1
    return { url, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0].url
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => {
        fs.writeFileSync(dest, Buffer.concat(chunks))
        resolve(dest)
      })
    })
    req.on('error', reject)
    req.setTimeout(60000, () => {
      req.destroy(new Error('Timeout'))
    })
  })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(LOG_PATH, `Priority download started ${new Date().toISOString()}\n`)

  const allUrls = collectUrls()
  const grouped = new Map()

  for (const url of allUrls) {
    const extracted = extractPath(url)
    if (!isPriority(extracted)) continue
    const key = canonicalKey(extracted)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(url)
  }

  log(`Priority unique assets: ${grouped.size}`)

  let report = { downloaded: [], failed: [], skipped: [] }
  if (fs.existsSync(REPORT_PATH)) {
    report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'))
  }
  const done = new Set(report.downloaded.map((d) => d.key))

  for (const [key, urls] of grouped.entries()) {
    const dest = path.join(OUT_DIR, key)
    if (done.has(key) && fs.existsSync(dest)) {
      log(`Skip: ${key}`)
      continue
    }

    const url = pickBestUrl(urls)
    log(`Downloading: ${key}`)
    try {
      await download(url, dest)
      report.downloaded.push({ key, url, dest: path.relative(ROOT, dest), bytes: fs.statSync(dest).size })
      fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
      log(`  OK (${report.downloaded[report.downloaded.length - 1].bytes} bytes)`)
    } catch (err) {
      report.failed.push({ key, url, error: err.message })
      fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
      log(`  FAIL: ${err.message}`)
    }

    await new Promise((r) => setTimeout(r, 150))
  }

  log(`\nFinished. Downloaded: ${report.downloaded.length}, Failed: ${report.failed.length}`)
  log(`Files in: ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})