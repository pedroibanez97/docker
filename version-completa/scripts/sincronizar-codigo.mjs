#!/usr/bin/env node
// Mantiene el código de las diapositivas igual al de los archivos de ejemplo.
//
//   node scripts/sincronizar-codigo.mjs              -> actualiza index.html
//   node scripts/sincronizar-codigo.mjs --verificar  -> solo comprueba (termina con error si hay diferencias)
//
// En index.html:
//   <pre data-lang="yaml" data-fuente="ejemplos/02-api-mysql/compose.yaml"><code></code></pre>
//     -> el script copia el archivo COMPLETO dentro del bloque.
//   <pre data-lang="yaml" data-extracto="ejemplos/02-api-mysql/compose.yaml"><code>...</code></pre>
//     -> el fragmento se escribe a mano; el script comprueba que exista tal cual en el archivo.
//        Una línea que solo contiene "..." o "# ..." separa partes no consecutivas.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const escapar = (texto) => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const desescapar = (texto) => texto.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const leerArchivo = (ruta) => readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');

export function sincronizar({ verificar = false } = {}) {
  const archivoHtml = resolve(raiz, 'index.html');
  const html = readFileSync(archivoHtml, 'utf8');
  const problemas = [];
  let completos = 0;
  let extractos = 0;

  const conFuentes = html.replace(
    /(<pre\b[^>]*\bdata-fuente="([^"]+)"[^>]*><code>)([\s\S]*?)(<\/code><\/pre>)/g,
    (todo, apertura, ruta, contenido, cierre) => {
      completos += 1;
      const destino = resolve(raiz, ruta);
      if (!existsSync(destino)) {
        problemas.push(`No existe el archivo: ${ruta}`);
        return todo;
      }
      const esperado = escapar(leerArchivo(destino));
      if (esperado !== contenido) problemas.push(`Desactualizado: ${ruta}`);
      return apertura + esperado + cierre;
    },
  );

  for (const [, ruta, contenido] of html.matchAll(/<pre\b[^>]*\bdata-extracto="([^"]+)"[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)) {
    extractos += 1;
    const destino = resolve(raiz, ruta);
    if (!existsSync(destino)) {
      problemas.push(`No existe el archivo del extracto: ${ruta}`);
      continue;
    }
    const archivo = leerArchivo(destino);
    const partes = desescapar(contenido)
      .split(/\n[ \t]*(?:#\s*)?\.\.\.[ \t]*(?:\n|$)/)
      .map((parte) => parte.replace(/^\n+|\n+$/g, ''))
      .filter(Boolean);
    for (const parte of partes) {
      if (!archivo.includes(parte)) {
        problemas.push(`Extracto que no coincide con ${ruta}:\n    ${parte.split('\n')[0].trim()} ...`);
      }
    }
  }

  const desactualizado = conFuentes !== html;
  if (!verificar && desactualizado) writeFileSync(archivoHtml, conFuentes);

  return { completos, extractos, problemas, desactualizado };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const verificar = process.argv.includes('--verificar');
  const { completos, extractos, problemas, desactualizado } = sincronizar({ verificar });
  const errores = verificar ? problemas : problemas.filter((p) => !p.startsWith('Desactualizado'));
  console.log(`Bloques completos: ${completos} · extractos verificados: ${extractos}`);
  if (!verificar && desactualizado) console.log('index.html actualizado con el contenido de los archivos.');
  if (errores.length) {
    console.error(`\n${errores.length} problema(s):\n- ${errores.join('\n- ')}`);
    if (verificar) console.error('\nEjecutá: node scripts/sincronizar-codigo.mjs');
    process.exit(1);
  }
  console.log('Código de las diapositivas: OK');
}
