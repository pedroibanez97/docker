import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/libros -> lista de libros
router.get('/', async (req, res) => {
  const [libros] = await pool.query('SELECT id, titulo, autor, anio, disponible FROM libros ORDER BY titulo');
  res.json(libros.map((libro) => ({ ...libro, disponible: Boolean(libro.disponible) })));
});

// GET /api/libros/:id -> un libro
router.get('/:id', async (req, res) => {
  const [libros] = await pool.execute('SELECT id, titulo, autor, anio, disponible FROM libros WHERE id = ?', [req.params.id]);
  if (libros.length === 0) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }
  res.json({ ...libros[0], disponible: Boolean(libros[0].disponible) });
});

// POST /api/libros { titulo, autor, anio } -> alta de un libro
router.post('/', async (req, res) => {
  const { titulo, autor, anio } = req.body ?? {};
  if (!titulo || !autor) {
    return res.status(400).json({ error: 'Título y autor son obligatorios' });
  }
  const [resultado] = await pool.execute(
    'INSERT INTO libros (titulo, autor, anio) VALUES (?, ?, ?)',
    [titulo, autor, anio ?? null],
  );
  res.status(201).json({ id: resultado.insertId, titulo, autor, anio: anio ?? null, disponible: true });
});

export default router;
