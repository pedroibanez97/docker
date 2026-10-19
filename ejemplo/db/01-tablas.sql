-- Se ejecuta solo la primera vez que se crea la base
CREATE TABLE tareas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL
);

INSERT INTO tareas (titulo) VALUES ('Instalar Docker'), ('Levantar mi primer contenedor');
