-- Se ejecuta SOLO la primera vez que MySQL arranca con el volumen de datos vacío.
-- La imagen lo aplica sobre la base indicada en MYSQL_DATABASE.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS tareas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  titulo     VARCHAR(200) NOT NULL,
  completada BOOLEAN      NOT NULL DEFAULT FALSE,
  creada_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tareas (titulo, completada) VALUES
  ('Instalar Docker', TRUE),
  ('Entender la diferencia entre imagen y contenedor', FALSE),
  ('Levantar MySQL con Compose', FALSE);
