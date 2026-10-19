# 03 · Angular + Express + MySQL

Aplicación completa con tres servicios en una red compartida (Módulos 8, 9 y 10).

```
Navegador ──► localhost:8080 ──► frontend (Nginx)
                                   ├── /        → archivos compilados de Angular
                                   └── /api/... → backend:3000 (Express) ──► db:3306 (MySQL) ──► volumen
```

```
03-angular-express-mysql/
├── compose.yaml          # DESARROLLO local: construye las imágenes
├── compose.prod.yaml     # PRODUCCIÓN (didáctico): usa imágenes publicadas
├── .env.example          # plantilla para desarrollo
├── .env.prod.example     # plantilla para el servidor
├── backend/              # igual que el ejemplo 02
├── db/init/01-esquema.sql
└── frontend/             # proyecto Angular 22
    ├── Dockerfile        # 2 etapas: compilar con Node, servir con Nginx
    ├── nginx.conf        # archivos estáticos + proxy de /api
    ├── proxy.conf.json   # proxy de /api para `ng serve` (desarrollo)
    └── src/app/          # app.ts y tareas.service.ts
```

## Opción A · Todo en Docker (como en producción)

```bash
cp .env.example .env
docker compose up -d --build
```

Abrir <http://localhost:8080>. La primera construcción del frontend tarda más (descarga dependencias de Angular).

## Opción B · Angular en modo desarrollo (`ng serve`)

Backend y base en Docker; Angular con recarga automática en tu compu:

```bash
docker compose up -d db backend
cd frontend
npm install
npm start          # ng serve con proxy.conf.json → http://localhost:4200
```

Requiere una versión de Node compatible con Angular 22 (`^22.22.3 || ^24.15.0 || >=26`). El proxy reenvía `/api` a `http://localhost:3000`, el puerto publicado del backend.

## Simular el deploy en tu compu

```bash
docker compose down                       # libera el puerto 8080
docker build -t tareas-backend:1.0.0 ./backend
docker build -t tareas-frontend:1.0.0 ./frontend
cp .env.prod.example .env.prod            # completar: IMAGEN_* = tareas-backend:1.0.0 / tareas-frontend:1.0.0 y claves
docker compose -f compose.prod.yaml --env-file .env.prod up -d
```

En producción la base **no** publica puertos y la web queda en `127.0.0.1:8080`, detrás de un proxy inverso con HTTPS.

Para bajar la simulación: `docker compose -f compose.prod.yaml --env-file .env.prod down` (agregar `-v` borra sus datos).
