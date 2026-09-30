/**
 * validate-scorm.mjs — Checklist automático del paquete SCORM 1.2.
 * Licencia: MIT (ver archivo LICENSE)
 *
 * Uso:
 *   node scripts/validate-scorm.mjs              # valida el .zip más reciente en export/
 *   node scripts/validate-scorm.mjs path/zip.zip # valida un .zip concreto
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const require = createRequire(import.meta.url);
const JSZip = require('jszip');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const OUT_DIR = join(ROOT, 'export');

const results = [];
function check(area, ok, message, severity = 'BLOQUEANTE') {
  results.push({ area, ok, message, severity });
  const icon = ok ? '✅' : severity === 'BLOQUEANTE' ? '❌' : '⚠️';
  process.stdout.write(`${icon} [${area}] ${message}\n`);
}

function parseXML(xml) {
  // Chequeos sintácticos simples sin parser XML externo.
  const checks = {
    hasXMLDecl: /^\s*<\?xml[^>]*\?>/.test(xml),
    hasManifest: /<manifest\b/.test(xml),
    hasSchemaADL: /<schema>\s*ADL SCORM\s*<\/schema>/.test(xml),
    hasVersion12: /<schemaversion>\s*1\.2\s*<\/schemaversion>/.test(xml),
    hasOrganization: /<organizations\b/.test(xml),
    hasOrganizationDefault: /<organizations[^>]*default="/.test(xml),
    hasItem: /<item\b/.test(xml),
    hasResource: /<resource\b/.test(xml),
    isSco: /adlcp:scormtype\s*=\s*"sco"/.test(xml),
    hasHref: /href="[^"]+"/.test(xml),
    hasFileEntry: /<file\b[^>]*href="index\.html"/.test(xml),
    hasHrefIndex: /href="index\.html"/.test(xml),
    hasIMSCPRoot: /xmlns="http:\/\/www\.imsproject\.org\/xsd\/imscp_rootv1p1p2"/.test(xml),
    hasADLCP: /xmlns:adlcp="http:\/\/www\.adlnet\.org\/xsd\/adlcp_rootv1p2"/.test(xml),
    wellFormed: (xml.match(/</g) || []).length === (xml.match(/>/g) || []).length
  };
  return checks;
}

function hasAbsolutePaths(html) {
  // Detecta src="/algo" o href="/algo" (absolutos) que rompen en Moodle.
  const matches = html.match(/(src|href)="\/(?!\/)[^"]*"/g) || [];
  return matches;
}

async function findLatestZip() {
  if (!existsSync(OUT_DIR)) return null;
  const files = await readdir(OUT_DIR);
  const zips = files.filter((f) => f.endsWith('.zip')).map((f) => join(OUT_DIR, f));
  if (zips.length === 0) return null;
  const stats = await Promise.all(zips.map(async (p) => ({ p, m: (await stat(p)).mtimeMs })));
  stats.sort((a, b) => b.m - a.m);
  return stats[0].p;
}

async function main() {
  let zipPath = process.argv[2] ? resolve(process.argv[2]) : await findLatestZip();
  if (!zipPath || !existsSync(zipPath)) {
    check('ENTRADA', false, 'No se encontró un .zip en export/. Ejecuta `pnpm scorm:pack`.');
    summarize();
    process.exit(1);
  }

  process.stdout.write(`\n=== Validando ${relative(ROOT, zipPath)} ===\n\n`);

  const buf = await readFile(zipPath);
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir);

  // ---------- A. Estructura del paquete ----------
  check('A. Estructura', names.includes('imsmanifest.xml'), 'imsmanifest.xml presente en la RAÍZ del zip');
  check('A. Estructura', names.includes('index.html'), 'index.html presente en la RAÍZ del zip');
  check('A. Estructura', !names.some((n) => n.startsWith('node_modules/')), 'No contiene node_modules/');
  check('A. Estructura', !names.some((n) => n.startsWith('src/')), 'No contiene src/');
  check('A. Estructura', !names.some((n) => n.includes('.git/')), 'No contiene .git/');
  check('A. Estructura', !names.some((n) => n.endsWith('.map')), 'No contiene sourcemaps .map', 'MEDIO');
  check('A. Estructura', !names.some((n) => n === 'package.json' || n === 'vite.config.js'), 'No contiene package.json ni vite.config.js', 'MEDIO');

  const mb = buf.length / (1024 * 1024);
  check('A. Estructura', mb < 50, `Peso ${mb.toFixed(2)} MB (< 50 MB)`);
  if (mb > 20) {
    check('A. Estructura', true, `Peso ${mb.toFixed(2)} MB — por encima del objetivo de 20 MB`, 'MEDIO');
  }

  // ---------- B. imsmanifest.xml ----------
  const manifest = await zip.files['imsmanifest.xml'].async('string');
  const c = parseXML(manifest);
  check('B. Manifest', c.hasXMLDecl, 'Declara <?xml version="1.0" encoding="UTF-8"?>');
  check('B. Manifest', c.hasManifest, 'Contiene elemento <manifest>');
  check('B. Manifest', c.hasIMSCPRoot, 'Namespace imscp_rootv1p1p2 correcto');
  check('B. Manifest', c.hasADLCP, 'Namespace adlcp_rootv1p2 correcto');
  check('B. Manifest', c.hasSchemaADL, '<schema>ADL SCORM</schema> presente');
  check('B. Manifest', c.hasVersion12, '<schemaversion>1.2</schemaversion> presente');
  check('B. Manifest', c.hasOrganizationDefault, '<organizations default="..."> presente');
  check('B. Manifest', c.hasOrganization, 'Contiene <organization>');
  check('B. Manifest', c.hasItem, 'Contiene <item>');
  check('B. Manifest', c.hasResource, 'Contiene <resource>');
  check('B. Manifest', c.isSco, 'Recurso marcado como adlcp:scormtype="sco"');
  check('B. Manifest', c.hasHrefIndex, 'href="index.html" presente');
  check('B. Manifest', c.hasFileEntry, 'Entrada <file href="index.html"/> presente');
  check('B. Manifest', c.wellFormed, 'XML bien formado (balance de tags)');

  // ---------- C. Paths relativos ----------
  const html = await zip.files['index.html'].async('string');
  const abs = hasAbsolutePaths(html);
  check('C. Paths', abs.length === 0, `index.html usa paths relativos (absolutos detectados: ${abs.length})`);

  // ---------- D. Llamadas a la API SCORM ----------
  const jsFiles = names.filter((n) => n.endsWith('.js'));
  let bundle = '';
  for (const f of jsFiles) {
    bundle += await zip.files[f].async('string') + '\n';
  }
  const apiChecks = {
    LMSInitialize: /LMSInitialize/.test(bundle),
    LMSFinish: /LMSFinish/.test(bundle),
    LMSSetValue: /LMSSetValue/.test(bundle),
    LMSCommit: /LMSCommit/.test(bundle),
    lessonStatus: /cmi\.core\.lesson_status/.test(bundle),
    scoreRaw: /cmi\.core\.score\.raw/.test(bundle),
    lessonLocation: /cmi\.core\.lesson_location/.test(bundle),
    suspendData: /cmi\.suspend_data/.test(bundle),
    sessionTime: /cmi\.core\.session_time/.test(bundle)
  };
  check('D. API SCORM', apiChecks.LMSInitialize, 'Bundle llama LMSInitialize');
  check('D. API SCORM', apiChecks.LMSFinish, 'Bundle llama LMSFinish');
  check('D. API SCORM', apiChecks.LMSSetValue, 'Bundle llama LMSSetValue');
  check('D. API SCORM', apiChecks.LMSCommit, 'Bundle llama LMSCommit');
  check('D. API SCORM', apiChecks.lessonStatus, 'Usa cmi.core.lesson_status');
  check('D. API SCORM', apiChecks.scoreRaw, 'Usa cmi.core.score.raw');
  check('D. API SCORM', apiChecks.lessonLocation, 'Usa cmi.core.lesson_location');
  check('D. API SCORM', apiChecks.suspendData, 'Usa cmi.suspend_data');
  check('D. API SCORM', apiChecks.sessionTime, 'Usa cmi.core.session_time');

  // ---------- E. Referencias de assets ----------
  const referenced = [...manifest.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of referenced) {
    if (ref.startsWith('http')) continue;
    const exists = names.includes(ref) || names.includes(ref.replace(/^\.\//, ''));
    check('E. Referencias', exists, `Manifest referencia "${ref}" y existe en el zip`, 'MEDIO');
  }

  summarize();
}

function summarize() {
  const bloqueantes = results.filter((r) => !r.ok && r.severity === 'BLOQUEANTE');
  const medios = results.filter((r) => !r.ok && r.severity === 'MEDIO');
  const total = results.length;
  const okCount = results.filter((r) => r.ok).length;

  process.stdout.write('\n=== Resumen ===\n');
  process.stdout.write(`Checks: ${okCount}/${total} OK\n`);
  process.stdout.write(`BLOQUEANTES fallando: ${bloqueantes.length}\n`);
  process.stdout.write(`MEDIOS fallando: ${medios.length}\n`);

  if (bloqueantes.length === 0) {
    process.stdout.write('\n✅ APTO PARA MOODLE (SCORM 1.2)\n');
    process.exit(0);
  } else {
    process.stdout.write('\n❌ REQUIERE FIX antes de subir a Moodle\n');
    for (const b of bloqueantes) {
      process.stdout.write(`   - [${b.area}] ${b.message}\n`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`[scorm:validate][ERROR] ${err?.stack || err}\n`);
  process.exit(1);
});
