# Nombre del proyecto

Breve descripción: qué hace la aplicación y para quién.

## Arquitectura

| Servicio | Imagen / tecnología | Puerto interno | Puerto publicado | Para qué |
|---|---|---|---|---|
| `db` | `mysql:8.4` | 3306 | `127.0.0.1:3307` | Base de datos |
| `backend` | Dockerfile propio (Node 24 + Express) | 3000 | `3000` | API REST |
| `frontend` *(si aplica)* | Dockerfile propio (Angular + Nginx) | 80 | `8080` | Interfaz web |

Cómo se comunican: *(por ejemplo: el backend se conecta a `db:3306` por la red `red-app`; el navegador entra por `localhost:8080` y Nginx reenvía `/api` al backend).*

Datos persistentes: volumen `datos-mysql` montado en `/var/lib/mysql`.

## Requisitos

- Docker Desktop (macOS/Windows) o Docker Engine + plugin Compose (Linux).
- Verificar: `docker --version` y `docker compose version`.

## Cómo levantar el proyecto

```bash
git clone <url-del-repositorio>
cd <carpeta>
cp .env.example .env      # y editar los valores
docker compose up -d --build
docker compose ps         # esperar db (healthy)
```

## Variables de entorno

| Variable | Ejemplo | Descripción |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | *(generar una)* | Clave del usuario root de MySQL |
| `MYSQL_DATABASE` | `mi_base` | Base que se crea la primera vez |
| `MYSQL_USER` / `MYSQL_PASSWORD` | `mi_app` / *(generar una)* | Usuario que usa el backend |

Para generar una clave: `openssl rand -hex 16` (macOS, Linux, Git Bash) o `[guid]::NewGuid().ToString('N')` (PowerShell).

## Cómo probar

- `GET http://localhost:3000/api/...` → resultado esperado: ...
- *(capturas o salidas de terminal como evidencia)*

## Persistencia

Pasos realizados y resultado: *(dato creado → `docker compose down` → `docker compose up -d` → el dato sigue)*.

## Detener

```bash
docker compose down        # conserva los datos
docker compose down -v     # ⚠ borra también los datos
```

## Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `port is already allocated` | Otro programa usa el puerto | Cambiar el número de la izquierda en `ports:` |
| ... | ... | ... |
