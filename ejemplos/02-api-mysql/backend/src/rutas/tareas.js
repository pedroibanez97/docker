import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/tareas -> lista todas las tareas
router.get('/', async (req, res) => {
  const [filas] = await pool.query(
    'SELECT id, titulo, completada, creada_en FROM tareas ORDER BY id',
  );
  // MySQL guarda BOOLEAN como 0/1: lo convertimos a true/false para el frontend
  res.json(filas.map((fila) => ({ ...fila, completada: Boolean(fila.completada) })));
});

// POST /api/tareas  { "titulo": "..." } -> crea una tarea
router.post('/', async (req, res) => {
  const titulo = String(req.body?.titulo ?? '').trim();
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const [resultado] = await pool.execute('INSERT INTO tareas (titulo) VALUES (?)', [titulo]);
  res.status(201).json({ id: resultado.insertId, titulo, completada: false });
});

// DELETE /api/tareas/:id -> elimina una tarea
router.delete('/:id', async (req, res) => {
  const [resultado] = await pool.execute('DELETE FROM tareas WHERE id = ?', [req.params.id]);
  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'No existe una tarea con ese id' });
  }
  res.status(204).end();
});

export default router;
