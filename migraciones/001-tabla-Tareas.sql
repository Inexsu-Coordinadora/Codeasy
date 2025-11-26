CREATE TABLE IF NOT EXISTS Tareas (
  idTarea SERIAL PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion varchar(500),
  estadoTarea VARCHAR(20) DEFAULT 'Creada' ,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechaFinalizacion TIMESTAMP NOT NULL,
  prioridad VARCHAR(10) CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
  asignadoA VARCHAR(100) NOT NULL,
  estatus VARCHAR(15) CHECK (estatus IN ('Eliminado', 'Activo')) NOT NUll
);

-- Estado de la tarea
CREATE IF NOT EXISTS TYPE estadoTarea_enum AS ENUM ('Creada', 'En Proceso', 'Finalizada');
-- Prioridad
CREATE IF NOT EXISTS TYPE prioridad_enum AS ENUM ('Baja', 'Media', 'Alta');
-- Estado lógico de la tarea
CREATE IF NOT EXISTS TYPE estatus_enum AS ENUM ('Eliminado', 'Activo');