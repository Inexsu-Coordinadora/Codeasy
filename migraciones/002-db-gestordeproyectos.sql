CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 🔹 ENUMS
-- ============================================================
CREATE TYPE estado_general AS ENUM ('Activo', 'Eliminado');
CREATE TYPE estado_proyecto AS ENUM ('Creado', 'En proceso', 'Finalizado');
CREATE TYPE disponibilidad_consultor AS ENUM ('Disponible', 'No disponible');
CREATE TYPE nivel_experiencia AS ENUM ('Junior', 'Semi-Senior', 'Senior', 'Experto');
CREATE TYPE estado_tarea AS ENUM ('Creada', 'En Proceso', 'Finalizada');
CREATE TYPE prioridad_tarea AS ENUM ('Baja', 'Media', 'Alta');

-- ============================================================
-- 🔹 CLIENTES
-- ============================================================
CREATE TABLE clientes (
    idcliente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    identificacion VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    estado estado_general DEFAULT 'Activo'
);

-- ============================================================
-- 🔹 CONSULTORES
-- ============================================================
CREATE TABLE consultores (
idConsultor UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
nombre VARCHAR(100) NOT NULL,
identificacion VARCHAR(50) UNIQUE NOT NULL,
correo VARCHAR(100) UNIQUE NOT NULL,
telefono VARCHAR(55),
especialidad VARCHAR(100),
nivelexperiencia nivel_experiencia NOT NULL DEFAULT 'Junior',
disponibilidad disponibilidad_consultor NOT NULL DEFAULT 'Disponible',
estado estado_general DEFAULT 'Activo'
);

-- ============================================================
-- 🔹 ROLES
-- ============================================================
CREATE TABLE roles (
    idrol UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_rol VARCHAR(55) UNIQUE NOT NULL,
    descripcion VARCHAR(100),
    estado estado_general DEFAULT 'Activo'
);

-- ============================================================
-- 🔹 PROYECTOS
-- ============================================================
CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    estado estado_proyecto DEFAULT 'Creado',
    idcliente UUID NOT NULL REFERENCES clientes(idcliente),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado_general estado_general DEFAULT 'Activo'
);

-- ============================================================
-- 🔹 STAFF_PROYECTO (relación N:N entre consultores y proyectos)
-- ============================================================
CREATE TABLE staff_proyecto (
    id_staff_proyecto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idconsultor UUID NOT NULL REFERENCES consultores(idconsultor),
    id UUID NOT NULL REFERENCES proyectos(id),
    idrol UUID REFERENCES roles(idrol),
    porcentaje_dedicacion DECIMAL(5,2) CHECK (porcentaje_dedicacion >= 0 AND porcentaje_dedicacion <= 100),
    fecha_inicio DATE,
    fecha_fin DATE,
    UNIQUE (idconsultor, id, idrol)
);

-- ============================================================
-- 🔹 PARTES_HORA (Registro y control de horas)
-- ============================================================
CREATE TABLE partes_hora (
    id_parte_hora UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id UUID NOT NULL REFERENCES proyectos(id),
    idconsultor UUID NOT NULL REFERENCES consultores(idconsultor),
    fecha DATE NOT NULL,
    cantidad_horas DECIMAL(3,1) NOT NULL CHECK (cantidad_horas > 0 AND cantidad_horas <= 24),
    descripcion VARCHAR(255) NOT NULL,
    estado estado_general DEFAULT 'Activo',
    UNIQUE (id, idconsultor, fecha, descripcion)
);

-- ============================================================
-- 🔹 TAREAS (solo relacionadas al staff_proyecto)
-- ============================================================
CREATE TABLE tareas (
    idTarea UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    estadoTarea estado_tarea DEFAULT 'Creada',
    prioridad prioridad_tarea DEFAULT 'Media',
    fechaCreacion DATE DEFAULT CURRENT_DATE,
    fechaFinalizacion DATE,
    id_staff_proyecto UUID NOT NULL REFERENCES staff_proyecto(id_staff_proyecto),
    estado estado_general DEFAULT 'Activo'
);