import express from 'express';
import { pool } from './db.js';
import librosRouter from './rutas/libros.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/api/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'ok', db: 'ok' });
  } catch (error) {
    res.status(503).json({ api: 'ok', db: 'error', detalle: error.code });
  }
});

app.use('/api/libros', librosRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor', codigo: error.code });
});

app.listen(PORT, () => {
  console.log(`Biblioteca API escuchando en http://localhost:${PORT}`);
});
