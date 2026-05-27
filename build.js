'use strict';
/**
 * build.js — Demo Sales Inc.
 * Assembles dist/ from source pages + _partials/header.html + _partials/footer.html
 * Each inner page → dist/<slug>/index.html (clean URLs)
 * Run: node build.js
 * Deploy from: dist/
 */

const fs   = require('fs');
const path = require('path');

const SRC  = __dirname;
const DIST = path.join(__dirname, 'dist');

// Strip BOM from Buffer
function read(p) {
  const buf = fs.readFileSync(p);
  const start = (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) ? 3 : 0;
  return buf.slice(start).toString('utf8');
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

// PAGE MAP: { src, dest }
const PAGES = [
  { src: 'index.html',    dest: 'index.html' },
  { src: 'about.html',    dest: 'about/index.html' },
  { src: 'services.html', dest: 'services/index.html' },
  { src: 'contact.html',  dest: 'contact/index.html' },
  { src: '404.html',      dest: '404.html' },
];

// Asset folders to copy as-is
const ASSET_DIRS = ['assets', 'images'];

// Root files to copy to dist/
const ROOT_FILES = ['_redirects', 'robots.txt', 'sitemap.xml', '_worker.js', '_routes.json', '_headers'];

// Read partials
const PARTS    = path.join(SRC, '_partials');
const header   = read(path.join(PARTS, 'header.html'));
const footer   = read(path.join(PARTS, 'footer.html'));

function injectPartials(html) {
  return html
    .replace('<!-- HEADER -->', header)
    .replace('<!-- FOOTER -->', footer);
}

// Wipe and rebuild dist/
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Copy root support files
for (const f of ROOT_FILES) {
  const srcPath = path.join(SRC, f);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(DIST, f));
    console.log(`  [copy]  ${f}`);
  }
}

// Copy asset directories
for (const dir of ASSET_DIRS) {
  const srcDir = path.join(SRC, dir);
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, path.join(DIST, dir));
    console.log(`  [copy]  ${dir}/`);
  }
}

// Build pages
for (const page of PAGES) {
  const srcFile = path.join(SRC, page.src);
  if (!fs.existsSync(srcFile)) {
    console.warn(`  [skip]  ${page.src} (not found)`);
    continue;
  }
  const raw  = read(srcFile);
  const html = injectPartials(raw);
  const dest = path.join(DIST, page.dest);
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, html, 'utf8');
  console.log(`  [built] ${page.dest}`);
}

console.log('\n✓ Demo Sales build complete → dist/');
