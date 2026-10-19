# Docker desde cero · Versión práctica

Clase práctica de Docker para la Tecnicatura Universitaria en Programación: lo esencial para que un proyecto **Express + MySQL** (y Angular) funcione en cualquier compu con un solo comando.

- **Presentación:** <https://pedroibanez97.github.io/docker/>
- **Guía de estudio (PDF):** [`guia/docker-desde-cero-guia-de-estudio.pdf`](guia/docker-desde-cero-guia-de-estudio.pdf)
- **Ejemplos:** [`ejemplo/`](ejemplo/) (API + MySQL) y [`ejemplo-con-angular/`](ejemplo-con-angular/) (más Angular)
- **Práctica final:** [`practica/`](practica/)

## La clase

68 diapositivas, una idea por diapositiva. Unas 2 h 40 min más la práctica final.

| Bloque | Tema | Tiempo |
|---|---|---|
| 1 | ¿Qué es Docker? | 15 min |
| 2 | Instalar y probar | 10 min |
| 3 | Imágenes y contenedores (puertos, `ps`, `logs`, `stop`, `start`, `rm`) | 25 min |
| 4 | Tu propia imagen: Dockerfile | 25 min |
| 5 | Compose: tu API + MySQL (variables de entorno y datos que no se pierden) | 40 min |
| 6 | Sumar Angular | 15 min |
| 7 | Llevarlo a otra compu o a un servidor | 10 min |
| 8 | Si algo falla | 10 min |
| 9 | Repaso y cuestionario | 10 min |
| ★ | Práctica final: dockerizar el proyecto propio | 1 h 30 min a 3 h |

## Cómo presentarla

Abrí `index.html` (o la URL de arriba). Funciona sin Internet.

| Tecla | Acción |
|---|---|
| `→` `Espacio` `Av Pág` | Siguiente |
| `←` `Re Pág` | Anterior |
| `I` | Índice |
| `D` | Vista del docente en otra ventana (notas, siguiente diapositiva y cronómetro) |
| `N` | Notas del docente en la misma ventana |
| `T` | Tema claro / oscuro |
| `F` | Pantalla completa |

Las diapositivas están marcadas como **Idea**, **Demo**, **Hacelo vos** o **Repaso**. Cada comando indica **dónde** se ejecuta, **qué hace** y **qué resultado** esperar.

Antes de la clase, descargá las imágenes y probá los dos ejemplos en la compu que vas a proyectar (diapositiva “Antes de empezar”).

## Estructura

```
.
├── index.html               # la presentación
├── assets/                  # estilos, script de la presentación e imágenes
├── guia/                    # guía de estudio en PDF (generada)
├── ejemplo/                 # API Express + MySQL
├── ejemplo-con-angular/     # lo mismo + Angular con Nginx
├── practica/                # consigna de la práctica final y proyecto base
├── scripts/                 # sincronizar código, verificar y generar el PDF
└── version-completa/        # la versión completa original (referencia)
```

## Actualizar la presentación

Todo el contenido está en `index.html`, una `<section class="slide">` por diapositiva. El código de los ejemplos no se copia a mano: los bloques con `data-fuente="ejemplo/…"` se completan con

```bash
node scripts/sincronizar-codigo.mjs
```

Después de cualquier cambio:

```bash
node scripts/verificar.mjs     # código, enlaces, ids, .env y PDF
./scripts/generar-pdf.sh       # regenera la guía de estudio
```

`generar-pdf.sh` usa Chrome, Chromium o Edge en modo headless (Node.js 18 o superior). Si no encuentra el navegador: `CHROME="/ruta/al/navegador" ./scripts/generar-pdf.sh`. También se puede imprimir `index.html` desde Chrome como PDF (A4, sin encabezados ni pies del navegador).

## Publicación

Cada push a `main` ejecuta `.github/workflows/pages.yml`: verifica el material y publica la presentación en GitHub Pages, junto con la versión completa en `/version-completa/`.

## Versión completa

La primera versión de la clase (190 diapositivas, tres ejemplos, guía de estudio y guía docente, rúbrica detallada, deploy y diagnóstico en profundidad) está en [`version-completa/`](version-completa/), publicada en <https://pedroibanez97.github.io/docker/version-completa/> y guardada en la etiqueta `v1.0-completa`.

## Probado con

Docker Engine 28.5 y Docker Compose 2.40 (Docker Desktop, macOS, Apple silicon), Node 24, MySQL 8.4, Nginx 1.30 y Angular 22. Los comandos de Windows (PowerShell) y Linux siguen la documentación oficial, pero no se ejecutaron en esos sistemas.
