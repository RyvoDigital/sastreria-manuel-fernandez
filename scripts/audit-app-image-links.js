#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "raw/site-image-pack");
const SCAN = [path.join(ROOT, "components"), path.join(ROOT, "app")];
const URL_RE =
  /(?:https?:\/\/[^\s"'`\)]+|\/(?:photos|models|images)\/[^\s"'`\)]+|\/(?:logo\.png|hero-bg\.avif|favicon\.ico))/g;
const MEDIA = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".heic",
  ".mp4", ".mov", ".glb", ".ico", ".svg",
]);

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) files.push(full);
  }
  return files;
}

function extract(content) {
  const out = new Set();
  for (let m of content.match(URL_RE) || []) {
    m = m.replace(/[),;]+$/, "");
    if (
      m.includes("cloudinary.com") ||
      m.includes("imagekit.io") ||
      m.startsWith("/photos") ||
      m.startsWith("/models") ||
      m.startsWith("/images") ||
      m === "https://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/favicon.ico" ||
      m === "https://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/logo.png" ||
      m === "https://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/hero-bg.avif"
    ) {
      out.add(m);
    }
  }
  return out;
}

function nameFrom(url) {
  let seg = url.split("?")[0].split("#")[0].split("/").pop();
  seg = seg.replace(/\.(jpg|jpeg|png|gif|webp|avif|heic|mp4|mov|glb|ico|svg)$/i, "");
  return seg.replace(/_[a-z0-9]{5,8}$/i, "");
}

function indexLocal() {
  const map = new Map();
  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) scan(full);
      else if (MEDIA.has(path.extname(e.name).toLowerCase())) {
        const base = path.basename(full, path.extname(full)).toLowerCase();
        if (!map.has(base)) map.set(base, []);
        map.get(base).push(full);
      }
    }
  }
  scan(path.join(ROOT, "public"));
  scan(path.join(ROOT, "raw/images"));
  return map;
}

function localFor(url) {
  if (!url.startsWith("/")) return null;
  const rel = url.split("?")[0].replace(/^\//, "");
  const appFav = path.join(ROOT, "apphttps://ik.imagekit.io/hvzm7siir/all-imageshttps://ik.imagekit.io/hvzm7siir/all-images/favicon.ico");
  if (rel === "favicon.ico" && fs.existsSync(appFav)) return appFav;
  return path.join(ROOT, "public", rel);
}

function head(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD" }, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });
    req.setTimeout(6000, () => {
      req.destroy();
      resolve(0);
    });
    req.on("error", () => resolve(0));
    req.end();
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const urls = new Set();
  for (const file of SCAN.flatMap((d) => walk(d))) {
    for (const u of extract(fs.readFileSync(file, "utf8"))) urls.add(u);
  }
  const links = [...urls].sort();
  fs.writeFileSync(path.join(OUT, "links.txt"), links.join("\n") + "\n");
  console.log("1) links.txt:", links.length, "URLs used in the app");

  const byName = indexLocal();
  const ok = [];
  const have = [];
  const missing = [];

  for (const url of links) {
    if (!url.startsWith("/")) continue;
    const p = localFor(url);
    if (p && fs.existsSync(p)) ok.push(url);
    else {
      const files = byName.get(nameFrom(url).toLowerCase());
      if (files?.length) {
        have.push(`${url}\n  local: ${path.relative(ROOT, files[0])}`);
      } else {
        missing.push(url);
      }
    }
  }

  const remote = links.filter((u) => u.startsWith("http"));
  console.log("2) checking", remote.length, "remote URLs...");
  let n = 0;
  await Promise.all(
    remote.map(async (url) => {
      const code = await head(url);
      if (code === 200 || code === 206) ok.push(url);
      else {
        const files = byName.get(nameFrom(url).toLowerCase());
        if (files?.length) {
          have.push(`${url}\n  local: ${path.relative(ROOT, files[0])}`);
        } else {
          missing.push(url);
        }
      }
      n++;
      if (n % 25 === 0) console.log("   ...", n, "/", remote.length);
    })
  );

  ok.sort();
  missing.sort();
  fs.writeFileSync(path.join(OUT, "reachable-links.txt"), ok.join("\n") + "\n");
  fs.writeFileSync(path.join(OUT, "unreachable-we-have.txt"), have.join("\n\n") + "\n");
  fs.writeFileSync(path.join(OUT, "unreachable-we-dont-have.txt"), missing.join("\n") + "\n");

  console.log("3) reachable-links.txt:", ok.length);
  console.log("   unreachable-we-have.txt:", have.length);
  console.log("   unreachable-we-dont-have.txt:", missing.length);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});