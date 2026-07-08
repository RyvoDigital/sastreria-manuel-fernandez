#!/usr/bin/env node
/**
 * Build raw/site-image-pack/
 *   links.txt  — every image/media URL used on active site pages
 *   images/    — local files whose basename matches the URL name
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "raw/site-image-pack");
const IMAGES = path.join(OUT, "images");
const MAP = path.join(ROOT, "MIGRATION_MAP_1TO1.json");

const MEDIA_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".heic",
  ".mp4", ".mov", ".glb", ".ico", ".svg",
]);

const SKIP_DIRS = new Set([
  "node_modules", ".next", ".git", "site-image-pack",
]);

function nameFromUrl(url) {
  const clean = url.split("?")[0].split("#")[0];
  let seg = clean.split("/").filter(Boolean).pop() || clean;
  seg = seg.replace(/\.(jpg|jpeg|png|gif|webp|avif|heic|mp4|mov|glb|ico|svg)$/i, "");
  seg = seg.replace(/_[a-z0-9]{5,8}$/i, "");
  return seg;
}

function walk(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (MEDIA_EXT.has(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

function indexByBase(files) {
  const map = new Map();
  for (const f of files) {
    const base = path.basename(f, path.extname(f)).toLowerCase();
    if (!map.has(base)) map.set(base, []);
    map.get(base).push(f);
  }
  return map;
}

function pickBest(candidates) {
  const score = (f) => {
    const rel = path.relative(ROOT, f);
    if (rel.startsWith(`raw${path.sep}migration-ready${path.sep}from-downloads`)) return 1;
    if (rel.startsWith(`raw${path.sep}migration-ready`)) return 2;
    if (rel.startsWith(`public${path.sep}photos`)) return 3;
    if (rel.startsWith(`public${path.sep}`)) return 4;
    if (rel.startsWith(`raw${path.sep}web_lista_images`)) return 5;
    if (rel.includes("salvaged-local")) return 99;
    return 50;
  };
  return [...candidates].sort((a, b) => score(a) - score(b))[0];
}

function main() {
  const data = JSON.parse(fs.readFileSync(MAP, "utf8"));
  const assets = data.assets;

  fs.mkdirSync(IMAGES, { recursive: true });

  const localFiles = walk(ROOT);
  const byBase = indexByBase(localFiles);

  const links = [];
  const copied = [];
  const missing = [];

  for (const asset of assets) {
    const url = asset.url;
    const name = asset.name || nameFromUrl(url);
    links.push(url);

    const key = name.toLowerCase();
    const candidates = byBase.get(key) || [];

    if (!candidates.length) {
      missing.push({ name, url });
      continue;
    }

    const src = pickBest(candidates);
    const ext = path.extname(src);
    const dest = path.join(IMAGES, `${name}${ext}`);

    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
    copied.push({ name, url, from: path.relative(ROOT, src), to: path.relative(ROOT, dest) });
  }

  fs.writeFileSync(path.join(OUT, "links.txt"), links.join("\n") + "\n");

  console.log(`Created ${path.relative(ROOT, OUT)}/`);
  console.log(`  links.txt: ${links.length} URLs`);
  console.log(`  images/:   ${copied.length} files`);
  console.log(`  missing:   ${missing.length}`);
}

main();