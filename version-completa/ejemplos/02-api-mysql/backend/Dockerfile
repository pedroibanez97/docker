FROM node:24-alpine

WORKDIR /app

# Dependencias primero: si solo cambia el código, esta capa sale de la caché
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", "src/index.js"]
