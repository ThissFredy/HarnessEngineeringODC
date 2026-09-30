/**
 * scorm-pack.mjs — Empaqueta dist/ + public/scorm/ en un .zip SCORM 1.2.
 * Licencia: MIT (ver archivo LICENSE)
 *
 * Uso:
 *   pnpm build
 *   node scripts/scorm-pack.mjs
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, sep } from 'node:path';
import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const JSZip = require('jszip');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SCORM_SRC = join(ROOT, 'public', 'scorm');
const OUT_DIR = join(ROOT, 'export');

function log(...args) {
  process.stdout.write(`[scorm:pack] ${args.join(' ')}\n`);
}

function fail(msg) {
  process.stderr.write(`[scorm:pack][ERROR] ${msg}\n`);
  process.exit(1);
}

async function walk(dir, base = dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, base, acc);
    } else if (e.isFile()) {
      acc.push({ full, rel: relative(base, full).split(sep).join('/') });
    }
  }
  return acc;
}

function readPkgVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function main() {
  if (!existsSync(DIST)) fail('No existe dist/. Ejecuta `pnpm build` primero.');
  if (!existsSync(join(DIST, 'index.html'))) {
    fail('dist/index.html no fue generado. Revisa la config de Vite.');
  }

  const zip = new JSZip();

  // 1) Copiar contenido de dist/ al zip
  const distFiles = await walk(DIST);
  for (const f of distFiles) {
    const buf = await readFile(f.full);
    zip.file(f.rel, buf);
  }
  log(`Añadidos ${distFiles.length} archivos desde dist/`);

  // 2) Copiar contenido de public/scorm/ al ROOT del zip
  if (existsSync(SCORM_SRC)) {
    const scormFiles = await walk(SCORM_SRC);
    for (const f of scormFiles) {
      if (f.rel.toLowerCase() === 'readme.md') continue;
      const buf = await readFile(f.full);
      zip.file(f.rel, buf);
    }
    log(`Añadidos ${scormFiles.length} archivos desde public/scorm/ (a la raíz del zip)`);
  }

  // 3) Verificaciones mínimas antes de escribir
  const names = Object.keys(zip.files);
  if (!names.includes('imsmanifest.xml')) {
    fail('El zip no contiene imsmanifest.xml en la RAÍZ. Revisa public/scorm/.');
  }
  if (!names.includes('index.html')) {
    fail('El zip no contiene index.html en la RAÍZ.');
  }
  if (names.some((n) => n.startsWith('node_modules/'))) {
    fail('Detectado node_modules/ dentro del zip.');
  }
  if (names.some((n) => n.startsWith('src/'))) {
    fail('Detectado src/ dentro del zip (solo debe ir el bundle de dist/).');
  }

  // 4) Escribir el .zip
  await mkdir(OUT_DIR, { recursive: true });
  const version = readPkgVersion();
  const zipName = `ODC-HarnessEngineering-SCORM12-v${version}.zip`;
  const outPath = join(OUT_DIR, zipName);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  await writeFile(outPath, content);

  const kb = (content.length / 1024).toFixed(1);
  const mb = (content.length / (1024 * 1024)).toFixed(2);
  log(`OK  → ${relative(ROOT, outPath)}  (${kb} KB / ${mb} MB)`);
  if (content.length > 50 * 1024 * 1024) {
    log('AVISO: el paquete supera 50 MB; podría rechazarse en Moodle.');
  }
  if (content.length > 20 * 1024 * 1024) {
    log('AVISO: el paquete supera 20 MB; se recomienda optimizar assets.');
  }
  log('Listo para subir a Moodle (Actividad → SCORM → Cargar paquete).');
}

main().catch((err) => {
  fail(err?.stack || String(err));
});
