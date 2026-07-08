#!/usr/bin/env node
/**
 * Copy every local image we have into raw/all-images/
 * Filenames = URL name (last segment, no cloudinary hash) — same as before.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "raw/all-images");
const LINKS = path.join(ROOT, "raw/site-image-pack/links.txt");

const SOURCES = [
  path.join(ROOT, "raw/web_lista_images"),
  path.join(ROOT, "raw/recovered-from-downloads"),
  path.join(ROOT, "public/photos"),
  path.join(ROOT, "public/models"),
  path.join(ROOT, "public"),
  path.join(ROOT, "app"),
];

const MEDIA = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".heic",
  ".mp4", ".mov", ".glb", ".ico", ".svg",
]);

function nameFromUrl(url) {
  const clean = url.split("?")[0].split("#")[0];
  let seg = clean.split("/").filter(Boolean).pop() || clean;
  seg = seg.replace(/\.(jpg|jpeg|png|gif|webp|avif|heic|mp4|mov|glb|ico|svg)$/i, "");
  return seg.replace(/_[a-z0-9]{5,8}$/i, "");
}

function indexByBase() {
  const map = new Map();
  for (const dir of SOURCES) {
    if (!fs.existsSync(dir)) continue;
    function scan(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) scan(full);
        else if (MEDIA.has(path.extname(e.name).toLowerCase())) {
          const base = path.basename(full, path.extname(full)).toLowerCase();
          if (!map.has(base)) map.set(base, []);
          map.get(base).push(full);
        }
      }
    }
    scan(dir);
  }
  return map;
}

function pickBest(files) {
  const rank = (f) => {
    const r = path.relative(ROOT, f);
    if (r.startsWith(`raw${path.sep}web_lista_images`)) return 1;
    if (r.startsWith(`raw${path.sep}recovered-from-downloads`)) return 2;
    if (r.startsWith(`public${path.sep}photos`)) return 3;
    if (r.startsWith(`public${path.sep}models`)) return 4;
    if (r.startsWith(`public${path.sep}`)) return 5;
    if (r.startsWith(`app${path.sep}`)) return 6;
    return 50;
  };
  return [...files].sort((a, b) => rank(a) - rank(b))[0];
}

function main() {
  const byBase = indexByBase();
  const links = fs.existsSync(LINKS)
    ? fs.readFileSync(LINKS, "utf8").trim().split("\n").filter(Boolean)
    : [];

  const siteNames = [...new Set(links.map(nameFromUrl))];

  if (fs.existsSync(OUT)) {
    for (const f of fs.readdirSync(OUT)) {
      fs.unlinkSync(path.join(OUT, f));
    }
  } else {
    fs.mkdirSync(OUT, { recursive: true });
  }

  const copied = [];
  const missing = [];

  for (const name of siteNames.sort()) {
    const key = name.toLowerCase();
    const files = byBase.get(key);
    if (!files?.length) {
      missing.push(name);
      continue;
    }
    const src = pickBest(files);
    const ext = path.extname(src);
    const dest = path.join(OUT, `${name}${ext}`);
    fs.copyFileSync(src, dest);
    copied.push({ name, from: path.relative(ROOT, src), to: path.relative(ROOT, dest) });
  }

  const manifest = {
    generated: new Date().toISOString(),
    naming: "URL basename (no extension, no _hash) — same as links.txt",
    siteNamesChecked: siteNames.length,
    copied: copied.length,
    stillMissing: missing.length,
    files: copied,
    missing,
  };

  // Also copy any other local photos not in site links (same basename naming)
  const copiedNames = new Set(copied.map((c) => c.name.toLowerCase()));
  const extras = [];
  for (const [base, files] of byBase.entries()) {
    if (copiedNames.has(base)) continue;
    const src = pickBest(files);
    const rel = path.relative(ROOT, src);
    if (!rel.startsWith(`public${path.sep}photos`)) continue;
    const name = path.basename(src, path.extname(src));
    const dest = path.join(OUT, path.basename(src));
    fs.copyFileSync(src, dest);
    extras.push({ name, from: rel, to: path.relative(ROOT, dest) });
  }

  manifest.extras = extras.length;
  manifest.extraFiles = extras;
  fs.writeFileSync(path.join(OUT, "MANIFEST.json"), JSON.stringify(manifest, null, 2));

  console.log(`raw/all-images/`);
  console.log(`  ${copied.length} site images (named like links.txt)`);
  console.log(`  ${extras.length} extra public/photos (not on site links)`);
  console.log(`  ${missing.length} site names still without a file`);
}

main();