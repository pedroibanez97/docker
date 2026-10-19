# Docker desde cero · Versión completa (referencia)

> Esta carpeta conserva la **versión completa** original de la clase (190 diapositivas, tres ejemplos, guía de estudio y guía docente). La versión simplificada para dar clase está en la [raíz del repositorio](../). Este material también quedó guardado en la etiqueta `v1.0-completa`.

Clase completa para aprender Docker desde cero, pensada para la Tecnicatura Universitaria en Programación: de “en mi computadora funciona” a una aplicación **Angular + Express + MySQL** que se levanta con un comando.

- **Presentación interactiva:** <https://pedroibanez97.github.io/docker/version-completa/>
- **Guía de estudio (PDF):** [`guia/docker-desde-cero-guia-de-estudio.pdf`](guia/docker-desde-cero-guia-de-estudio.pdf)
- **Guía del docente con notas (PDF):** [`guia/docker-desde-cero-guia-docente.pdf`](guia/docker-desde-cero-guia-docente.pdf)
- **Ejemplos probados:** [`ejemplos/`](ejemplos/)
- **Práctica integradora con rúbrica:** [`practica/`](practica/)

## Contenido

| Módulo | Tema | Tiempo orientativo |
|---|---|---|
| 1 | El problema que resuelve Docker | 20 min |
| 2 | Conceptos fundamentales | 40 min |
| 3 | Instalación desde cero (macOS, Windows con WSL 2, Linux) | 30 min + instalación |
| 4 | Primeros comandos | 45 min |
| 5 | Crear una imagen propia con Dockerfile | 50 min |
| 6 | Docker Compose | 50 min |
| 7 | MySQL: datos, conexión y persistencia | 35 min |
| 8 | Dockerizar Angular + Express + MySQL | 55 min |
| 9 | Variables de entorno y buenas prácticas | 25 min |
| 10 | Deploy: llevar la aplicación a un servidor | 40 min |
| 11 | Errores frecuentes y diagnóstico | 30 min |
| 12 | Repaso y cierre (cuestionario y guía de decisión) | 30 min |
| P | Práctica integradora | 2 a 4 h |

## Estructura del repositorio

```
.
├── index.html                  # la presentación completa (todas las diapositivas)
├── assets/
│   ├── css/estilos.css         # diseño, temas claro/oscuro, versión impresa
│   ├── js/presentacion.js      # navegación, notas, vista docente, código, quiz
│   ├── img/resultado-tareas.png
│   └── favicon.svg
├── guia/                       # PDF generados (no editar a mano)
├── ejemplos/
│   ├── 01-api-express/         # Dockerfile (módulo 5)
│   ├── 02-api-mysql/           # Compose + MySQL (módulos 6, 7 y 9)
│   └── 03-angular-express-mysql/  # app completa + compose.prod.yaml (módulos 8 y 10)
├── practica/
│   ├── README.md               # consigna, entregables y rúbrica
│   ├── PLANTILLA-README.md     # plantilla de README para los alumnos
│   └── proyecto-base/          # API sin dockerizar (camino B de la práctica)
├── scripts/
│   ├── sincronizar-codigo.mjs  # copia el código de ejemplos/ a las diapositivas
│   ├── verificar.mjs           # verificaciones (código, enlaces, ids, .env, PDF)
│   └── generar-pdf.sh          # genera los dos PDF con Chrome headless
└── .github/workflows/pages.yml # publicación en GitHub Pages
```

No hay dependencias, frameworks ni pasos de compilación: la presentación es HTML, CSS y JavaScript, y funciona abriendo `index.html` directamente, sin conexión a Internet.

## Cómo presentar la clase

1. Abrí `index.html` en el navegador (o la URL pública).
2. Apretá **D** para abrir la **vista del docente** en otra ventana: muestra las notas de la diapositiva actual, la siguiente y un cronómetro. Llevá la ventana principal al proyector; las dos se mantienen sincronizadas.
3. Navegá con las flechas, **Av Pág/Re Pág** (sirve con presentadores inalámbricos) o la barra inferior.

| Tecla | Acción |
|---|---|
| `→` `Espacio` `Av Pág` | Siguiente diapositiva |
| `←` `Re Pág` | Anterior |
| `I` | Índice de módulos |
| `N` | Mostrar u ocultar notas del docente en la misma ventana |
| `D` | Vista del docente (segunda ventana) |
| `T` | Tema claro / oscuro |
| `F` | Pantalla completa |
| `?` | Ayuda |

Cada diapositiva está etiquetada como **Explicación**, **Demo del docente**, **Actividad**, **Solución** o **Repaso**. Las portadas de módulo incluyen objetivo, tiempo estimado y guion. La dirección cambia con cada diapositiva (por ejemplo `#modulo-6`), así que se puede compartir un enlace directo.

Antes de la clase, conviene descargar las imágenes (ver la diapositiva “Antes de empezar”) y probar los ejemplos en la compu que se va a proyectar.

## Cómo actualizar la presentación

Todo el contenido está en `index.html`, una sección por diapositiva:

```html
<section class="slide" id="m5-ejemplo" data-tipo="explicacion">  <!-- explicacion | demo | actividad | solucion | repaso -->
  <h2>Título</h2>
  <div class="caja analogia"><p>…</p></div>          <!-- también: problema, limite, ejemplo, resultado, error, cuidado, clave, dato, pregunta, donde -->
  <div class="caja pregunta"><p>¿Pregunta?</p><div class="respuesta"><p>Respuesta</p></div></div>
  <aside class="notas"><p>Nota para el docente (no sale en la guía de estudio).</p></aside>
</section>
```

- Una portada de módulo lleva `class="slide slide--modulo"` y los atributos `data-modulo`, `data-modulo-titulo` y `data-tiempo`. El índice, la barra de progreso y la versión impresa se generan solos.
- Dale a cada diapositiva un `id` fijo (los enlaces compartidos dependen de él).
- **Código de los ejemplos:** no lo copies a mano. Usá `<pre data-lang="yaml" data-fuente="ejemplos/…/compose.yaml"><code></code></pre>` y ejecutá `node scripts/sincronizar-codigo.mjs`. Para fragmentos, `data-extracto="ruta"` con el texto copiado tal cual: la verificación comprueba que exista en el archivo.
- Para comandos sueltos: `<pre data-lang="bash"><code>…</code></pre>` (lenguajes: `bash`, `powershell`, `dockerfile`, `yaml`, `js`, `ts`, `json`, `sql`, `nginx`, `env`). Escapá `<`, `>` y `&` como `&lt;`, `&gt;` y `&amp;`.
- Los diagramas son SVG dentro del HTML y usan las clases `d-caja`, `d-acento`, `d-exito`, etc., que se adaptan al tema y a la impresión.

Después de cualquier cambio:

```bash
node scripts/sincronizar-codigo.mjs   # si cambiaste ejemplos/
node scripts/verificar.mjs            # todo tiene que dar ✓
./scripts/generar-pdf.sh              # regenerar los PDF
```

## Cómo regenerar el PDF

```bash
./scripts/generar-pdf.sh
```

Requiere Node.js 18 o superior y Google Chrome, Chromium o Microsoft Edge. El script busca el navegador en las rutas habituales de macOS y Linux; si no lo encuentra, indicá la ruta:

```bash
CHROME="/ruta/al/navegador" ./scripts/generar-pdf.sh
```

Genera `guia/docker-desde-cero-guia-de-estudio.pdf` (sin notas) y `guia/docker-desde-cero-guia-docente.pdf` (con notas, a partir de `index.html?notas=1`). En Windows se puede ejecutar desde Git Bash indicando `CHROME`, o generar el PDF a mano: abrir `index.html` en Chrome, **Imprimir → Guardar como PDF**, tamaño A4, márgenes predeterminados y sin encabezados ni pies de página del navegador. La versión impresa (portada, índice, fondos claros y código sin cortes) la arma la hoja de estilos.

## Publicación

El workflow `.github/workflows/pages.yml` verifica el material y publica `index.html`, `assets/` y `guia/` en GitHub Pages en cada push a `main`. Si alguna vez hay que habilitarlo a mano: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Verificación de los ejemplos

Los tres ejemplos y el proyecto base se probaron con Docker Engine 28.5 y Docker Compose 2.40 (Docker Desktop, macOS, Apple silicon), Node 24, MySQL 8.4, Nginx 1.30 y Angular 22: construcción, ejecución, persistencia, copia de seguridad y restauración, simulación de producción con actualización y vuelta atrás, y los mensajes de error que se muestran en el módulo 11. Los comandos específicos de Windows (PowerShell) y de Linux se tomaron de la documentación oficial, pero no se ejecutaron en esos sistemas.
