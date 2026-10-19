import express from 'express';
import { config } from './config.js';
import { pool } from './db.js';
import tareasRouter from './rutas/tareas.js';

const app = express();
app.use(express.json());

// Salud: confirma que la API responde y que llega a MySQL
app.get('/api/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'ok', db: 'ok' });
  } catch (error) {
    res.status(503).json({ api: 'ok', db: 'error', detalle: error.code });
  }
});

app.use('/api/tareas', tareasRouter);

// Express 5 envía acá los errores de las rutas async
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor', codigo: error.code });
});

const server = app.listen(config.port, () => {
  console.log(`API escuchando en el puerto ${config.port}`);
  console.log(`Base de datos: ${config.db.host}:${config.db.port}/${config.db.database}`);
});

// `docker stop` y `docker compose down` envían SIGTERM: cerramos en orden
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido: cerrando el servidor...');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
