# Ejemplo · API Express + MySQL

La API de tareas de la clase (bloques 4 y 5).

```
ejemplo/
├── compose.yaml      # la API y MySQL
├── .env.example      # plantilla de claves (copiar como .env)
├── backend/          # la API con su Dockerfile
└── db/01-tablas.sql  # tablas y datos iniciales
```

## Solo la API (bloque 4)

En la carpeta `ejemplo/backend`:

```bash
docker build -t mi-api .
docker run -d --name mi-api -p 3000:3000 mi-api
```

Abrí <http://localhost:3000> → `API funcionando`.

## API + MySQL (bloque 5)

En la carpeta `ejemplo`:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

- <http://localhost:3000/api/tareas> → la lista de tareas guardadas en MySQL.
- Workbench: host `127.0.0.1`, puerto `3307`, usuario y clave de tu `.env`.

Crear una tarea:

```bash
# macOS / Linux / Git Bash
curl -X POST -H "Content-Type: application/json" -d '{"titulo":"Aprender Compose"}' http://localhost:3000/api/tareas
```

```powershell
# Windows PowerShell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tareas -ContentType 'application/json' -Body '{"titulo":"Aprender Compose"}'
```

Detener y volver a iniciar:

```bash
docker compose stop
docker compose start
docker compose down      # borra los contenedores; los datos quedan
docker compose down -v   # ⚠ borra también los datos
```

Si el puerto 3000 (o el 3307) está ocupado en tu compu, cambiá el número de la **izquierda** en `ports` del `compose.yaml`.
