# Práctica integradora · Dockerizar un proyecto propio

**Objetivo:** que tu aplicación se pueda levantar en cualquier computadora con Docker usando un solo comando, sin instalar Node.js ni MySQL a mano, sin exponer secretos y sin perder datos.

**Duración sugerida:** 2 a 4 horas de trabajo (puede continuar fuera de clase).
**Modalidad:** individual o en parejas (cada integrante debe poder explicar todo).

---

## Elegí tu camino

| Camino | Para quién | Punto de partida |
|---|---|---|
| **A · Proyecto propio** (recomendado) | Tenés un proyecto Express + MySQL (con o sin Angular) que funciona en tu compu | Tu repositorio actual, en una rama nueva: `git switch -c docker` |
| **B · Proyecto base** | No tenés un proyecto adecuado o el tuyo tiene problemas que no podés resolver hoy | La API de biblioteca en [`proyecto-base/`](proyecto-base/) |

En los dos caminos se evalúa lo mismo. **No reescribas tu arquitectura**: Docker se agrega alrededor del proyecto; tus capas, rutas y buenas prácticas quedan como están.

---

## Objetivos mínimos

1. Identificar los componentes y dependencias de la aplicación (versión de Node, base de datos, puertos, variables).
2. Crear un `Dockerfile` para el backend.
3. Crear la configuración de Compose (`compose.yaml`).
4. Ejecutar MySQL en un servicio independiente (si el proyecto usa base de datos).
5. Configurar variables de entorno sin exponer secretos (`.env` ignorado + `.env.example` versionado).
6. Garantizar la persistencia de los datos con un volumen.
7. Levantar el sistema completo con **un** comando.
8. Comprobar que la aplicación funciona.
9. Detener y volver a iniciar los servicios sin perder datos.
10. Documentar cómo reproducir el entorno en otra computadora.

El frontend Angular se dockeriza **solo si forma parte del proyecto y el tiempo alcanza**. Primero tiene que funcionar bien el conjunto backend + MySQL.

---

## Paso a paso sugerido (con puntos de control)

1. **Relevamiento.** Completá esta tabla en tu README antes de escribir archivos de Docker:

   | Componente | Tecnología y versión | Puerto | Variables que necesita |
   |---|---|---|---|
   | Backend | Node 24 + Express 5 | 3000 | `DB_HOST`, `DB_USER`, ... |
   | Base de datos | MySQL 8.4 | 3306 | `MYSQL_DATABASE`, ... |

2. **Configuración por variables.** Buscá en el código valores fijos (`localhost`, usuario, contraseña, puerto) y reemplazalos por `process.env.*`. Si usás `dotenv`, podés dejarlo: dentro del contenedor las variables llegan desde Compose.
   ✅ *Control:* la app sigue funcionando sin Docker como antes.

3. **Dockerfile + `.dockerignore`** del backend. Imagen base oficial con versión (`node:24-alpine` o la que pida tu proyecto), `npm ci`, usuario `node`.
   ✅ *Control:* `docker build -t mi-backend:1.0 .` termina sin errores.

4. **`compose.yaml`** con los servicios `db` y `backend`, un volumen con nombre, una red, `healthcheck` en la base y `depends_on` con `condition: service_healthy`. Los scripts SQL van en una carpeta montada en `/docker-entrypoint-initdb.d`.
   ✅ *Control:* `docker compose up -d --build` y `docker compose ps` muestra `db (healthy)` y el backend `Up`.

5. **Variables y secretos.** `.env` con tus valores (en `.gitignore`) y `.env.example` con valores de ejemplo y comentarios.
   ✅ *Control:* `git status` no muestra `.env`.

6. **Prueba funcional.** Probá tus endpoints principales desde el navegador, Postman, Thunder Client o `curl`.

7. **Persistencia.** Creá un dato, ejecutá `docker compose down` y luego `docker compose up -d`. El dato tiene que seguir ahí.

8. **README** siguiendo la [plantilla](PLANTILLA-README.md).
   ✅ *Control final:* cloná tu repo en otra carpeta (o pedile a otra persona del curso que lo haga), seguí tu README al pie de la letra y verificá que funciona.

---

## Entregables

- Enlace al repositorio (rama `docker` o `main`) con el código actualizado.
- `Dockerfile` del backend (y del frontend, si corresponde) y `compose.yaml`.
- `.dockerignore` y `.env.example`.
- `README.md` con instrucciones de ejecución (ver plantilla).
- **Evidencia de funcionamiento:** captura o salida de terminal de `docker compose ps` y de una respuesta de la API (o de la app en el navegador).
- **Breve explicación de la arquitectura:** qué servicios hay, cómo se comunican, qué puertos se publican y por qué.
- **Demostración de persistencia:** evidencia de un dato creado antes de `docker compose down` que sigue existiendo después de `docker compose up -d`.

---

## Rúbrica de evaluación (100 puntos)

| Criterio | Puntos | Insuficiente | Suficiente | Muy bueno |
|---|---|---|---|---|
| **Comprensión y arquitectura** | 20 | No puede explicar qué hace cada servicio ni la diferencia entre imagen y contenedor. | Explica los servicios, la red y los puertos con ayuda. | Explica con precisión la arquitectura, por qué el backend usa el nombre del servicio y qué pasaría con `down -v`. |
| **Funcionamiento** | 25 | No levanta, o levanta pero la API no conecta con la base. | Levanta con un comando y los endpoints principales responden. | Además maneja la espera a la base (healthcheck), muestra errores claros y el frontend funciona si existe. |
| **Configuración Docker** | 20 | Dockerfile copia `node_modules`, usa `latest` o no hay `.dockerignore`. | Imagen oficial con versión, `npm ci`, `.dockerignore`, Compose con red y volumen. | Además aprovecha la caché (dependencias antes que el código), usuario no root, nombres claros y sin configuración innecesaria. |
| **Persistencia** | 10 | Los datos se pierden al recrear los contenedores. | Volumen con nombre y demostración de persistencia. | Además incluye scripts de inicialización y una copia de seguridad probada. |
| **Seguridad básica** | 15 | Hay contraseñas reales o `.env` en el repositorio. | `.env` ignorado, `.env.example` sin secretos reales, la app no usa el usuario `root`. | Además la base no se publica o se publica solo en `127.0.0.1`, y el README explica cómo generar claves. |
| **Documentación** | 10 | No hay README o no permite reproducir el entorno. | README con requisitos, pasos para levantar, puertos y variables. | Además incluye la evidencia, la explicación de la arquitectura y problemas frecuentes con su solución. |

### Criterios de aprobación

- **60 puntos o más**, y
- al menos **Suficiente** en *Funcionamiento*, *Persistencia* y *Seguridad básica*, y
- ningún error bloqueante.

### Errores que impiden considerar terminada la actividad

- El sistema **no levanta** siguiendo el README en una copia limpia del repositorio.
- Hay **secretos reales** (contraseñas, tokens, claves) o el archivo **`.env`** subido al repositorio, en cualquier commit.
- El backend **no se conecta** a MySQL (por ejemplo, porque usa `localhost` dentro de Compose).
- Los **datos se pierden** al ejecutar `docker compose down` seguido de `docker compose up -d`.
- No hay README o falta la **evidencia** pedida.
- La persona que entrega **no puede explicar** su `Dockerfile` ni su `compose.yaml`.

> Si subiste un secreto por error: cambiá esa contraseña de inmediato. Borrar el archivo en un commit nuevo no alcanza, porque sigue en el historial.

---

## Para quienes terminan antes (opcional)

- Dockerizar el frontend Angular con Nginx y proxy de `/api` (ver ejemplo 03).
- Agregar un `compose.prod.yaml` que use imágenes con etiqueta de versión y no publique la base.
- Documentar y probar una copia de seguridad y su restauración.
