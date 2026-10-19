#!/usr/bin/env bash
# Genera las guías en PDF a partir de index.html con Chrome/Chromium/Edge en modo headless.
#
#   ./scripts/generar-pdf.sh
#   CHROME="/ruta/al/navegador" ./scripts/generar-pdf.sh   # si no lo encuentra solo
#
# Resultado:
#   guia/docker-desde-cero-guia-de-estudio.pdf   (sin notas del docente)
#   guia/docker-desde-cero-guia-docente.pdf      (con notas del docente: index.html?notas=1)
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for candidato in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
    if [ -x "$candidato" ] || command -v "$candidato" >/dev/null 2>&1; then
      CHROME="$candidato"
      break
    fi
  done
fi
if [ -z "$CHROME" ]; then
  echo "No encontré Chrome, Chromium ni Edge. Indicá la ruta: CHROME=/ruta/al/navegador $0" >&2
  exit 1
fi

# Antes de generar, el código de las diapositivas tiene que coincidir con los ejemplos
node scripts/sincronizar-codigo.mjs --verificar

mkdir -p guia
URL="file://$PWD/index.html"

generar() { # $1 = archivo de salida · $2 = parámetros de la URL
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --generate-pdf-document-outline --run-all-compositor-stages-before-draw \
    --virtual-time-budget=15000 \
    --print-to-pdf="$1" "$URL$2" 2>/dev/null
  if [ ! -s "$1" ]; then
    echo "No se pudo generar $1" >&2
    exit 1
  fi
  echo "Generado: $1 ($(du -h "$1" | cut -f1))"
}

generar guia/docker-desde-cero-guia-de-estudio.pdf ""
generar guia/docker-desde-cero-guia-docente.pdf "?notas=1"
