# 1. Imagen base oficial, con versión explícita (Node 24 LTS sobre Alpine Linux)
FROM node:24-alpine

# 2. Carpeta de trabajo dentro de la imagen: los comandos siguientes se ejecutan acá
WORKDIR /app

# 3. Primero copiamos SOLO los archivos de dependencias (aprovecha la caché)
COPY package.json package-lock.json ./

# 4. Instalamos las versiones exactas del lockfile, sin dependencias de desarrollo
RUN npm ci --omit=dev

# 5. Recién ahora copiamos el resto del código (.dockerignore filtra lo que no va)
COPY . .

# 6. Valores por defecto de configuración (se pueden cambiar al ejecutar)
ENV NODE_ENV=production
ENV PORT=3000
ENV MENSAJE="Hola desde un contenedor"

# 7. Documentamos el puerto en el que escucha la app (NO lo publica)
EXPOSE 3000

# 8. No ejecutamos como root: la imagen oficial trae el usuario "node"
USER node

# 9. Comando que se ejecuta al iniciar cada contenedor
CMD ["node", "src/index.js"]
