import express from 'express';
import os from 'node:os';

const app = express();

// La configuración llega por variables de entorno (con valores por defecto).
const PORT = Number(process.env.PORT ?? 3000);
const MENSAJE = process.env.MENSAJE ?? 'Hola desde un contenedor';

app.get('/', (req, res) => {
  res.send(`<h1>${MENSAJE}</h1><p>Probá también <a href="/api/saludo">/api/saludo</a></p>`);
});

app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: MENSAJE,
    // Dentro de un contenedor, el hostname es el ID corto del contenedor.
    servidor: os.hostname(),
    hora: new Date().toISOString(),
  });
});

const server = app.listen(PORT, () => {
  console.log(`API escuchando en el puerto ${PORT}`);
});

// `docker stop` envía la señal SIGTERM: cerramos el servidor de forma ordenada.
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido: cerrando el servidor...');
  server.close(() => process.exit(0));
});
