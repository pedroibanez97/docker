-- Esquema y datos de ejemplo de la biblioteca.
-- Sin Docker: ejecutalo en tu MySQL local (crea la base "biblioteca").
CREATE DATABASE IF NOT EXISTS biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE biblioteca;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS libros (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  titulo     VARCHAR(200) NOT NULL,
  autor      VARCHAR(150) NOT NULL,
  anio       SMALLINT     NULL,
  disponible BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO libros (titulo, autor, anio) VALUES
  ('Ficciones', 'Jorge Luis Borges', 1944),
  ('Rayuela', 'Julio Cortázar', 1963),
  ('El túnel', 'Ernesto Sabato', 1948),
  ('Las aventuras de la China Iron', 'Gabriela Cabezón Cámara', 2017);
