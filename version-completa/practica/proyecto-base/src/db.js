import mysql from 'mysql2/promise';

// Configuración leída de variables de entorno.
// Ojo: los valores por defecto sirven para correr la API SIN Docker, con MySQL instalado.
export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'biblioteca',
  waitForConnections: true,
  connectionLimit: 10,
});
