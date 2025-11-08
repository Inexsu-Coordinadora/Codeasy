CREATE TYPE nivel_experiencia AS ENUM ('Junior', 'Semi-Senior', 'Senior', 'Experto');
CREATE TYPE disponibilidad_tipo AS ENUM ('Disponible', 'No disponible');
CREATE TYPE estado_tipo AS ENUM ('Activo', 'Eliminado');

CREATE TABLE IF NOT EXISTS consultores (
    idconsultor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    identificacion VARCHAR(55) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(55),
    especialidad VARCHAR(100),
    nivelexperiencia nivel_experiencia DEFAULT 'Junior',
    disponibilidad disponibilidad_tipo DEFAULT 'Disponible',
    estado estado_tipo DEFAULT 'Activo',
);