# ---------- Etapa 1: compilar Angular (esta imagen se descarta al final) ----------
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Etapa 2: servir los archivos estáticos con Nginx ----------
FROM nginx:1.30-alpine

# Nuestra configuración: archivos de Angular + proxy de /api al backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Solo copiamos el resultado compilado (sin Node, sin node_modules, sin código fuente)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
# El comando de inicio (nginx en primer plano) ya viene definido en la imagen base
