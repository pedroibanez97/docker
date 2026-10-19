# Ejemplos de la clase

Tres ejemplos progresivos, todos probados con Docker Engine 28 y Docker Compose v2.

| Carpeta | Qué enseña | Módulos | Comando principal |
|---|---|---|---|
| [`01-api-express`](01-api-express/) | Dockerfile para una API Node.js + Express | 5 | `docker build -t api-express:1.0 .` |
| [`02-api-mysql`](02-api-mysql/) | Compose: API + MySQL, volumen, red, variables, healthcheck | 6, 7, 9 | `docker compose up -d --build` |
| [`03-angular-express-mysql`](03-angular-express-mysql/) | Angular servido con Nginx + Express + MySQL; configuración de producción | 8, 9, 10 | `docker compose up -d --build` |

## Antes de empezar

- Docker Desktop iniciado (macOS/Windows) o el servicio `docker` activo (Linux).
- Comprobar con `docker --version` y `docker compose version`.
- Los ejemplos 02 y 03 usan los mismos puertos (3000 y 3307): **bajá uno antes de levantar el otro** con `docker compose down`.

## Puertos usados

| Puerto en tu compu | Qué es | Ejemplos |
|---|---|---|
| `3000` | API Express | 01, 02, 03 |
| `127.0.0.1:3307` | MySQL (para Workbench/DBeaver). Es 3307 y no 3306 para no chocar con un MySQL instalado | 02, 03 |
| `8080` | Aplicación Angular completa (Nginx) | 03 |

Si alguno está ocupado, cambiá **el número de la izquierda** en `ports:` (por ejemplo `"3001:3000"`).

## Nota sobre las contraseñas

Los archivos `.env.example` traen contraseñas de ejemplo **solo para desarrollo local**. Copialos como `.env` y cambiá los valores. Los archivos `.env` están en `.gitignore` y nunca se suben al repositorio.
