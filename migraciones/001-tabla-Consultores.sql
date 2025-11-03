
CREATE TABLE IF NOT EXISTS consultores (
    idconsultor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    identificacion VARCHAR(55) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(55),
    especialidad VARCHAR(100),
    nivelexperiencia VARCHAR(20) DEFAULT 'Junior',
    disponibilidad VARCHAR(20) DEFAULT 'disponible',
    estado VARCHAR(20) DEFAULT 'Activo',
    contrasena VARCHAR(255) NOT NULL
);
// migraciones/001-tabla-Consultores.sql