#!/usr/bin/env node
/**
 * Scan site code for image/media URLs, test which still return HTTP 200,
 * write reachable ones to raw/site-image-pack/live-urls.txt
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "raw/site-image-pack");
const OUT_FILE = path.join(OUT_DIR, "live-urls.txt");
const ALL_FILE = path.join(OUT_DIR, "links.txt");
const SITE_BASE = process.env.SITE_BASE || "https://sastreria-five.vercel.app";

const SCAN_DIRS = [
  path.join(ROOT, "components"),
  path.join(ROOT, "app"),
];

const SKIP_FILES = new Set([
  "HeroNew.tsx",
  "ServicesOverview.tsx",
  "ProcesoSection.tsx",
]);

const URL_RE =
  /(?:https?:\/\/[^\s"'`\)]+|\/(?:photos|models|images|logo\.png|hero-bg\.avif|favicon\.ico)[^\s"'`\)]+)/g;

function walkTs(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkTs(full, files);
    else if (/\.(tsx?|jsx?)$/.test(e.name) && !SKIP_FILES.has(e.name)) files.push(full);
  }
  return files;
}

function extractUrls(content) {
  const found = new Set();
  const matches = content.match(URL_RE) || [];
  for (let m of matches) {
    m = m.replace(/[),;]+$/, "");
    if (
      m.includes("cloudinary.com") ||
      m.startsWith("/photos") ||
      m.startsWith("/models") ||
      m.startsWith("/images") ||
      m.includes("imagekit.io") ||
      m === "https://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/favicon.ico" ||
      m === "https://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/logo.png" ||
      m === "https://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/hero-bg.avif"
    ) {
      found.add(m);
    }
  }
  return found;
}

function fetchStatus(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(url, { method: "HEAD", timeout: 12000 }, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });
    req.on("error", () => resolve(0));
    req.on("timeout", () => {
      req.destroy();
      resolve(0);
    });
    req.end();
  });
}

async function isReachable(url) {
  let status = await fetchStatus(url);
  if (status === 200 || status === 206) return true;
  if ((status === 405 || status === 403) && url.startsWith("http")) {
    status = await new Promise((resolve) => {
      const lib = url.startsWith("https") ? https : http;
      const req = lib.get(url, { timeout: 15000 }, (res) => {
        res.resume();
        resolve(res.statusCode || 0);
      });
      req.on("error", () => resolve(0));
      req.on("timeout", () => {
        req.destroy();
        resolve(0);
      });
    });
    return status === 200 || status === 206;
  }
  return false;
}

function toAbsolute(url) {
  if (url.startsWith("http")) return url;
  return `${SITE_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}

async function main() {
  const files = SCAN_DIRS.flatMap((d) => walkTs(d));
  const urls = new Set();
  for (const f of files) {
    const content = fs.readFileSync(f, "utf8");
    for (const u of extractUrls(content)) urls.add(u);
  }

  const sorted = [...urls].sort();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(ALL_FILE, sorted.join("\n") + "\n");

  const liveSet = new Set();

  for (const url of sorted) {
    const absolute = toAbsolute(url);
    process.stdout.write(`Checking ${absolute.slice(0, 72)}...\r`);
    if (await isReachable(absolute)) liveSet.add(absolute);
  }

  const live = [...liveSet].sort();
  fs.writeFileSync(OUT_FILE, live.join("\n") + "\n");

  console.log(`\nTotal URLs in code:  ${sorted.length}`);
  console.log(`Still reachable:     ${live.length}  → ${path.relative(ROOT, OUT_FILE)}`);
  console.log(`Not reachable:       ${sorted.length - live.length}`);
  console.log(`(Tested on ${SITE_BASE} for local paths)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});