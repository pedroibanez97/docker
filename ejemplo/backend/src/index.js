import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

// Los datos de conexión llegan como variables de entorno (los pone Docker Compose)
const db = mysql.createPool({
  host: process.env.DB_HOST, // en Docker: "db", el nombre del servicio
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/api/tareas', async (req, res) => {
  const [tareas] = await db.query('SELECT * FROM tareas');
  res.json(tareas);
});

app.post('/api/tareas', async (req, res) => {
  const titulo = req.body?.titulo;
  if (!titulo) return res.status(400).json({ error: 'Falta el título' });
  const [resultado] = await db.query('INSERT INTO tareas (titulo) VALUES (?)', [titulo]);
  res.status(201).json({ id: resultado.insertId, titulo });
});

// Si algo falla (por ejemplo, no hay conexión con MySQL), respondemos con el código del error
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: error.code ?? error.message });
});

app.listen(3000, () => console.log('API escuchando en el puerto 3000'));

// Para que "docker stop" cierre la API al instante
process.on('SIGTERM', () => process.exit(0));
