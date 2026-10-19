import mysql from 'mysql2/promise';
import { config } from './config.js';

// Pool de conexiones: se conecta a MySQL cuando hace falta y reutiliza conexiones.
export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
});
