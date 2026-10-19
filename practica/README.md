# Práctica final · Dockerizá tu proyecto

**Objetivo:** que tu proyecto se levante en cualquier compu con:

```bash
cp .env.example .env
docker compose up -d --build
```

Tenés que poder **levantarlo**, **mostrar que funciona** y **explicar cómo se comunican sus partes**.

- **Con qué:** tu proyecto Express + MySQL (con o sin Angular). Si no podés usarlo, el [proyecto base](proyecto-base/).
- **Tiempo:** 1 h 30 min a 3 h. Individual o en parejas.
- **Prioridad:** primero backend + MySQL funcionando. Angular, si llegás.

## Paso a paso

1. Creá una rama: `git switch -c docker`.
2. Copiá `Dockerfile` y `.dockerignore` de [`ejemplo/backend`](../ejemplo/backend/) a la carpeta de tu backend.
3. Copiá `compose.yaml` y `.env.example` de [`ejemplo`](../ejemplo/) a la raíz de tu proyecto.
4. Poné tu script de tablas (`.sql`) en una carpeta `db/`.
5. Adaptá tu código (ver abajo).
6. `cp .env.example .env` y `docker compose up -d --build`.
7. Probá tus endpoints y comprobá que los datos siguen después de `docker compose down` y `docker compose up -d`.

## Adaptá tu código

- **Conexión a MySQL:** reemplazá `'localhost'`, `'root'` y tu contraseña escritos a mano por `process.env.DB_HOST`, `process.env.DB_USER`, `process.env.DB_PASSWORD` y `process.env.DB_NAME`.
- **Arranque:** en el `CMD` del Dockerfile poné tu archivo de entrada (por ejemplo `src/app.js`). El puerto de `app.listen` tiene que ser el de la **derecha** en `ports` del `compose.yaml`.
- **compose.yaml:** revisá la carpeta de `build` (por ejemplo `./backend` o `./server`).
- **Angular (opcional):** copiá `Dockerfile` y `nginx.conf` de [`ejemplo-con-angular/frontend`](../ejemplo-con-angular/frontend/), sumá el servicio `frontend` al compose y usá `/api` como URL de la API. Cambiá `dist/frontend/browser` por el nombre de tu proyecto Angular.

## Explicá cómo se comunica

En tu README (o en papel), dibujá tu proyecto y respondé:

1. ¿Qué dirección se abre en el navegador?
2. ¿Cómo llega una petición al backend?
3. ¿Con qué host y puerto se conecta el backend a MySQL? ¿Por qué no `localhost`?
4. ¿Dónde se guardan los datos y qué pasa con ellos si hacés `docker compose down`?

## Entregables

- Enlace al repositorio con `Dockerfile`, `compose.yaml`, `.dockerignore` y `.env.example`.
- README con los comandos para levantarlo y la explicación de cómo se comunica.
- Evidencia: captura o salida de `docker compose ps` y de una respuesta de tu API (sin contraseñas a la vista).

## Antes de entregar

- [ ] Se levanta con `docker compose up -d --build`.
- [ ] Los endpoints principales responden.
- [ ] Un dato creado sigue después de `docker compose down` y `docker compose up -d`.
- [ ] El `.env` **no** está en GitHub; `.env.example` sí.
- [ ] El README dice cómo levantarlo.
- [ ] Podés explicar cómo se comunican las partes.

## Qué se evalúa

| Criterio | Qué se mira |
|---|---|
| **Funciona** | Levanta con un comando y responde. |
| **Datos** | No se pierden al recrear los contenedores. |
| **Claves** | Están en `.env`, fuera de GitHub. |
| **Explicación** | Cómo se comunican navegador, backend y base (y frontend si hay). |

La prueba final: que otra persona clone tu repositorio y lo levante siguiendo solo tu README.

## Plantilla de README

````markdown
# Nombre del proyecto

## Cómo levantarlo

Requisito: Docker Desktop (o Docker Engine en Linux).

```bash
cp .env.example .env
docker compose up -d --build
```

- API: http://localhost:3000
- Base de datos (Workbench): 127.0.0.1:3307

## Cómo se comunica

Navegador → backend (puerto 3000) → MySQL (`db:3306`, por la red de Docker).
Los datos se guardan en el volumen `datos-mysql`.

## Cómo detenerlo

```bash
docker compose down
```
````
