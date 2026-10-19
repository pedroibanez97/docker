#!/usr/bin/env node
// Verificaciones del material, sin dependencias:
//   1. El código de las diapositivas coincide con los archivos de ejemplos/.
//   2. Los enlaces y recursos relativos de index.html existen.
//   3. Los anclajes internos (#id, data-ir) existen y no hay ids duplicados.
//   4. No hay archivos .env con valores reales versionados en Git.
//   5. Existen los PDF de la guía.
//
//   node scripts/verificar.mjs              -> verificaciones locales (las usa GitHub Actions)
//   node scripts/verificar.mjs --externos   -> además comprueba que respondan los enlaces http(s)

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sincronizar } from './sincronizar-codigo.mjs';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(raiz, 'index.html'), 'utf8');
// Para buscar enlaces se ignora el contenido de los bloques de código
// (version-completa/ tiene su propia verificación: version-completa/scripts/verificar.mjs)
const sinCodigo = html.replace(/<pre\b[\s\S]*?<\/pre>/g, '');
const errores = [];
const ok = (mensaje) => console.log(`✓ ${mensaje}`);

// 1. Código sincronizado
const codigo = sincronizar({ verificar: true });
if (codigo.problemas.length) errores.push(...codigo.problemas);
else ok(`Código de las diapositivas (${codigo.completos} archivos completos, ${codigo.extractos} extractos)`);

// 2. Recursos relativos
const relativos = [...sinCodigo.matchAll(/\b(?:href|src)="([^"#][^"]*)"/g)]
  .map((m) => m[1])
  .filter((url) => !/^(?:https?:|mailto:|data:)/.test(url));
const faltantes = [...new Set(relativos)].filter((ruta) => !existsSync(resolve(raiz, ruta.split(/[?#]/)[0])));
if (faltantes.length) errores.push(...faltantes.map((r) => `Recurso inexistente: ${r}`));
else ok(`Recursos relativos (${new Set(relativos).size})`);

// 3. Ids y anclajes internos
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicados.length) errores.push(...[...new Set(duplicados)].map((id) => `Id duplicado: ${id}`));
const destinos = [
  ...[...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/data-ir="([^"]+)"/g)].map((m) => m[1]),
];
const rotos = [...new Set(destinos)].filter((id) => !ids.includes(id));
if (rotos.length) errores.push(...rotos.map((id) => `Ancla sin destino: #${id}`));
else ok(`Ids únicos (${ids.length}) y anclas internas (${new Set(destinos).size})`);

const slidesSinId = (html.match(/<section class="slide(?![^"]*solo-impresion)[^"]*"(?![^>]*\sid=)/g) || []).length;
if (slidesSinId) errores.push(`Hay ${slidesSinId} diapositiva(s) sin id fijo (los enlaces compartidos podrían cambiar)`);

// 4. Archivos .env versionados
try {
  const versionados = execSync('git ls-files', { cwd: raiz, encoding: 'utf8' }).split('\n');
  const envs = versionados.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !/\.env(\.prod)?\.example$/.test(f));
  if (envs.length) errores.push(...envs.map((f) => `Archivo de entorno versionado (no debería): ${f}`));
  else ok('Ningún archivo .env real versionado');
} catch {
  console.log('· Git no disponible: se omite la revisión de archivos .env versionados');
}

// 5. PDF
for (const pdf of ['guia/docker-desde-cero-guia-de-estudio.pdf']) {
  if (!existsSync(resolve(raiz, pdf))) errores.push(`Falta el PDF: ${pdf} (ejecutá scripts/generar-pdf.sh)`);
}
if (!errores.some((e) => e.startsWith('Falta el PDF'))) ok('PDF de la guía presentes');

// Opcional: enlaces externos
if (process.argv.includes('--externos')) {
  // Los enlaces a localhost son para las demos locales: no se comprueban
  const externos = [...new Set([...sinCodigo.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]))]
    .filter((url) => !/^https?:\/\/(localhost|127\.0\.0\.1)\b/.test(url));
  for (const url of externos) {
    try {
      const respuesta = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (respuesta.status >= 400) errores.push(`Enlace externo con error ${respuesta.status}: ${url}`);
      else console.log(`  ${respuesta.status} ${url}`);
    } catch (error) {
      errores.push(`Enlace externo sin respuesta: ${url} (${error.cause?.code ?? error.name})`);
    }
  }
  ok(`Enlaces externos revisados (${externos.length})`);
}

if (errores.length) {
  console.error(`\n✗ ${errores.length} problema(s):\n- ${errores.join('\n- ')}`);
  process.exit(1);
}
console.log('\nTodo en orden.');
