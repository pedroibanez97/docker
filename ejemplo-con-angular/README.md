# Ejemplo · Angular + Express + MySQL

El mismo ejemplo de la clase, con un frontend Angular servido por Nginx (bloque 6).

```
ejemplo-con-angular/
├── compose.yaml        # db + backend + frontend
├── .env.example
├── backend/            # igual que en ejemplo/
├── db/01-tablas.sql
└── frontend/           # proyecto Angular
    ├── Dockerfile      # compila Angular y lo sirve con Nginx
    └── nginx.conf      # sirve Angular y pasa /api al backend
```

## Levantarlo

Si tenés levantado el otro ejemplo, bajalo primero (`docker compose down` en la carpeta `ejemplo`): usan los mismos puertos.

En la carpeta `ejemplo-con-angular`:

```bash
cp .env.example .env
docker compose up -d --build
```

Abrí <http://localhost:8080>. La primera vez tarda un poco más: descarga las dependencias de Angular.

## Cómo se comunica

```
Navegador → localhost:8080 → frontend (Nginx)
                               ├── /        → Angular compilado
                               └── /api/... → backend:3000 → db:3306 → volumen
```

Angular llama a la API con la URL relativa `/api/tareas` (ver `frontend/src/app/tareas.service.ts`): el navegador se la pide a Nginx y Nginx se la pasa al backend.
