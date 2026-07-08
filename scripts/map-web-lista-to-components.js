#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCAN = [path.join(ROOT, "components"), path.join(ROOT, "app")];
const EXTRACT = path.join(ROOT, "WEB_LISTA_DOCX_EXTRACT.json");
const OUT = path.join(ROOT, "raw/site-image-pack/WEB_LISTA_COMPONENT_MAP.txt");

const RE = /web_lista_images\/([a-z0-9-]+)/g;

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) files.push(full);
  }
  return files;
}

function main() {
  const map = new Map();
  for (const file of SCAN.flatMap((d) => walk(d))) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, "utf8");
    let m;
    while ((m = RE.exec(content))) {
      const name = m[1];
      if (!map.has(name)) map.set(name, new Set());
      map.get(name).add(rel);
    }
  }

  const extract = JSON.parse(fs.readFileSync(EXTRACT, "utf8"));
  const lines = [
    "WEB LISTA → COMPONENT MAP",
    `Generated: ${new Date().toISOString()}`,
    "",
  ];

  for (const item of extract.files) {
    const name = item.web_lista;
    const comps = map.get(name);
    const local = fs.existsSync(path.join(ROOT, item.localFile)) ? item.localFile : "MISSING FILE";
    lines.push(name);
    lines.push(`  docx: ${item.docx_media}`);
    lines.push(`  file: ${local}`);
    if (comps?.size) {
      lines.push(`  used in:`);
      [...comps].sort().forEach((c) => lines.push(`    - ${c}`));
    } else {
      lines.push(`  used in: (not referenced in active components)`);
    }
    lines.push("");
  }

  // web_lista names in code but not in docx
  for (const [name, comps] of [...map.entries()].sort()) {
    if (extract.files.some((f) => f.web_lista === name)) continue;
    lines.push(`${name}  [in code only — not in docx extract]`);
    [...comps].sort().forEach((c) => lines.push(`    - ${c}`));
    lines.push("");
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join("\n"));
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
}

main();