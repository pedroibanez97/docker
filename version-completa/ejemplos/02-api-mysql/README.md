# 02 · API Express + MySQL con Docker Compose

Backend de tareas con base de datos MySQL, volumen persistente, red propia, variables de entorno y healthcheck (Módulos 6, 7 y 9).

```
02-api-mysql/
├── compose.yaml        # servicios db + backend, volumen y red
├── .env.example        # plantilla de configuración (copiar como .env)
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json / package-lock.json
│   └── src/
│       ├── config.js   # lee y valida las variables de entorno
│       ├── db.js       # pool de conexiones a MySQL
│       ├── index.js    # servidor Express
│       └── rutas/tareas.js
└── db/init/
    └── 01-esquema.sql  # se ejecuta solo la primera vez (volumen vacío)
```

## Levantar

```bash
cp .env.example .env           # en Windows PowerShell también funciona "cp"
docker compose up -d --build
docker compose ps              # esperar a ver db "(healthy)"
```

## Probar

| Qué | Cómo |
|---|---|
| Salud de API y base | <http://localhost:3000/api/salud> → `{"api":"ok","db":"ok"}` |
| Listar tareas | <http://localhost:3000/api/tareas> |
| Crear tarea (macOS/Linux/Git Bash) | `curl -X POST -H "Content-Type: application/json" -d '{"titulo":"Aprender volúmenes"}' http://localhost:3000/api/tareas` |
| Crear tarea (Windows PowerShell) | `Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tareas -ContentType 'application/json' -Body '{"titulo":"Aprender volúmenes"}'` |
| Cliente MySQL externo | Host `127.0.0.1`, puerto `3307`, usuario y clave de tu `.env` |
| Consola MySQL dentro del contenedor | `docker compose exec db mysql -u tareas_app -p tareas_db` |

## Registros, detener y borrar

```bash
docker compose logs -f backend   # Ctrl+C deja de seguir los logs (no detiene nada)
docker compose down              # borra contenedores y red; el volumen (datos) queda
docker compose down -v           # ⚠ además borra el volumen: SE PIERDEN LOS DATOS
```

## Copia de seguridad y restauración

Funciona igual en bash, zsh y PowerShell:

```bash
docker compose exec db sh -c 'mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > /tmp/backup.sql'
docker compose cp db:/tmp/backup.sql ./backup.sql

docker compose cp ./backup.sql db:/tmp/backup.sql
docker compose exec db sh -c 'mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /tmp/backup.sql'
```

## Importante

- Las variables `MYSQL_*` y los scripts de `db/init/` **solo se aplican la primera vez**, cuando el volumen está vacío. Si cambiás la contraseña en `.env` después, MySQL sigue con la anterior. En desarrollo, la forma más simple de reiniciar es `docker compose down -v` (borra los datos).
- El backend se conecta a `db:3306` (nombre del servicio y puerto interno). Desde tu compu se usa `127.0.0.1:3307`.
