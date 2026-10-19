# 01 · API Express con Dockerfile

API mínima para aprender a construir una imagen propia (Módulo 5).

```
01-api-express/
├── Dockerfile          # receta de la imagen
├── .dockerignore       # qué NO se envía al build
├── package.json
├── package-lock.json   # versiones exactas para npm ci
└── src/
    └── index.js
```

## Construir y ejecutar

Ejecutar desde esta carpeta:

```bash
docker build -t api-express:1.0 .
docker run -d --name api -p 3000:3000 api-express:1.0
```

Abrir <http://localhost:3000> o <http://localhost:3000/api/saludo>.

Resultado esperado de `/api/saludo`:

```json
{"mensaje":"Hola desde un contenedor","servidor":"c44758e12261","hora":"2026-10-19T18:16:40.679Z"}
```

`servidor` es el ID corto del contenedor: cambia en cada contenedor nuevo.

## Ver registros, cambiar configuración y limpiar

```bash
docker logs api
docker run -d --name api2 -p 3001:3000 -e MENSAJE="Hola desde otra configuración" api-express:1.0
docker stop api api2
docker rm api api2
```

## Cambiar el código

Una imagen no se actualiza sola. Después de editar `src/index.js`:

```bash
docker build -t api-express:1.1 .
docker rm -f api
docker run -d --name api -p 3000:3000 api-express:1.1
```

Si el puerto 3000 está ocupado, usá otro a la izquierda: `-p 3005:3000`.
