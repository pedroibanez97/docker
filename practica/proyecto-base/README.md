# Proyecto base · Biblioteca API

API REST de una biblioteca hecha con **Node.js + Express 5 + MySQL**. Funciona sin Docker: tu tarea es dockerizarla siguiendo la [consigna de la práctica](../README.md) (camino B).

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/salud` | Estado de la API y de la conexión a MySQL |
| GET | `/api/libros` | Lista de libros |
| GET | `/api/libros/:id` | Un libro |
| POST | `/api/libros` | Alta de un libro: `{ "titulo": "...", "autor": "...", "anio": 1956 }` |

## Variables de entorno que lee

| Variable | Valor por defecto | Uso |
|---|---|---|
| `PORT` | `3000` | Puerto donde escucha Express |
| `DB_HOST` | `localhost` | Servidor MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_USER` | *(sin valor)* | Usuario de MySQL |
| `DB_PASSWORD` | *(sin valor)* | Contraseña |
| `DB_NAME` | `biblioteca` | Base de datos |

## Correr SIN Docker (opcional, para conocer el proyecto)

Requiere Node.js 20.6 o superior y MySQL instalado.

1. Ejecutar `db/esquema.sql` en tu MySQL (crea la base `biblioteca` con datos de ejemplo).
2. `cp .env.example .env` y completar usuario y contraseña.
3. `npm install`
4. `npm run dev` y abrir <http://localhost:3000/api/libros>.

## Lo que tenés que agregar

- `Dockerfile` y `.dockerignore`.
- `compose.yaml` con los servicios de la API y de MySQL, volumen, red y healthcheck.
- Variables de entorno para Docker (`.env` ignorado y `.env.example` sin secretos reales).
- Tu README con las instrucciones (podés partir de la [plantilla](../PLANTILLA-README.md)).

### Pistas

- ¿Qué valor tiene que tener `DB_HOST` dentro de Compose? ¿Por qué el valor por defecto `localhost` no sirve ahí?
- `db/esquema.sql` puede usarse como script de inicialización. ¿En qué carpeta del contenedor de MySQL tiene que estar?
- El script crea la base `biblioteca`. Usá ese mismo nombre en `MYSQL_DATABASE` para que tu usuario tenga permisos sobre ella.
- `npm run dev` usa `--env-file=.env`. Dentro del contenedor, ¿de dónde salen las variables? ¿Qué script conviene usar en el `CMD`?
