# Proyecto base · Biblioteca API

Una API chica de biblioteca hecha con **Node.js + Express + MySQL**, todavía **sin Docker**. Es la alternativa para la [práctica final](../README.md) si no podés usar tu propio proyecto.

## Qué tiene

```
proyecto-base/
├── package.json · package-lock.json
├── db/esquema.sql      # crea la base "biblioteca" con 4 libros
└── src/
    ├── index.js        # servidor Express (puerto 3000)
    ├── db.js           # conexión a MySQL (lee process.env)
    └── rutas/libros.js
```

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/salud` | Dice si la API llega a MySQL |
| GET | `/api/libros` | Lista los libros |
| GET | `/api/libros/:id` | Un libro |
| POST | `/api/libros` | Agrega un libro: `{ "titulo": "...", "autor": "...", "anio": 1956 }` |

## Lo que tenés que agregar

Seguí los mismos pasos que en la clase con la carpeta [`ejemplo`](../../ejemplo/):

- `Dockerfile` y `.dockerignore` (en esta carpeta).
- `compose.yaml` con la API y MySQL.
- `.env.example` (y tu `.env`, que no se sube).

## Pistas

- La conexión usa `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`. ¿Qué valor va en `DB_HOST` dentro de Compose?
- El script `db/esquema.sql` crea la base `biblioteca`: usá `DB_NAME=biblioteca` en tu `.env`.
- El script ya está en una carpeta `db/`, igual que en el ejemplo.
- Acá el backend es esta misma carpeta: en `compose.yaml` cambiá `build: ./backend` por `build: .`
- Si todo anda, `GET /api/libros` devuelve 4 libros.
