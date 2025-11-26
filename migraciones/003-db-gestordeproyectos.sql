-- EXTENSIÓN PARA UUID
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- BORRAR TODO (TABLAS + TIPOS)
-- ============================================================
DROP TABLE IF EXISTS tareas CASCADE;
DROP TABLE IF EXISTS equipos_consultores CASCADE;
DROP TABLE IF EXISTS equipos_proyectos CASCADE;
DROP TABLE IF EXISTS proyectos CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS consultores CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS horas_registradas_consultor CASCADE;

DROP TYPE IF EXISTS estado_general CASCADE;
DROP TYPE IF EXISTS estado_proyecto_enum CASCADE;
DROP TYPE IF EXISTS nivel_experiencia_enum CASCADE;
DROP TYPE IF EXISTS estado_tarea_enum CASCADE;
DROP TYPE IF EXISTS prioridad_enum CASCADE;

-- ============================================================
-- EXTENSIÓN UUID
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TIPOS ENUM
-- ============================================================
CREATE TYPE estado_general AS ENUM ('Activo', 'Eliminado');

CREATE TYPE estado_proyecto_enum AS ENUM ('Creado', 'En proceso', 'Finalizado', 'Cancelado');

CREATE TYPE nivel_experiencia_enum AS ENUM ('Junior', 'Semi-Senior', 'Senior', 'Expert');

CREATE TYPE estado_tarea_enum AS ENUM ('Pendiente', 'En progreso', 'Completada', 'Bloqueada');

CREATE TYPE prioridad_enum AS ENUM ('Baja', 'Media', 'Alta');

-- ============================================
-- TABLA: clientes
-- ============================================
CREATE TABLE clientes (
	id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre VARCHAR(100) NOT NULL,
	identificacion VARCHAR(100) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	telefono VARCHAR(50),
	estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Eliminado'))
);

-- ============================================
-- TABLA: consultores
-- ============================================
CREATE TABLE consultores (
	id_consultor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre VARCHAR(100),
	identificacion VARCHAR(100) UNIQUE,
	correo VARCHAR(100) UNIQUE,
	telefono VARCHAR(55),
	especialidad VARCHAR(150),
	nivel_experiencia VARCHAR(20) CHECK (nivel_experiencia IN ('Junior', 'Semi-Senior', 'Senior', 'Expert')),
	estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Eliminado'))
);

-- ============================================
-- TABLA: roles
-- ============================================
CREATE TABLE roles (
	id_rol UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre_rol VARCHAR(50),
	descripcion VARCHAR(55),
	estado VARCHAR(20) CHECK (estado IN ('Eliminado', 'Activo'))
);

-- ============================================
-- TABLA: proyectos
-- ============================================
CREATE TABLE proyectos (
	id_proyecto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255) NOT NULL,
	estado_proyecto VARCHAR(20) DEFAULT 'Creado' CHECK (estado_proyecto IN ('Creado', 'En proceso', 'Finalizado', 'Cancelado')),
	estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Eliminado')),
	id_cliente UUID NOT NULL,
	fecha_inicio DATE NOT NULL,
	fecha_entrega DATE NOT NULL,
	fecha_creacion TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- ============================================
-- TABLA: equipos_proyectos
-- (Corregida: YA NO DEPENDE de equipos_consultores)
-- ============================================
CREATE TABLE equipos_proyectos (
	id_equipo_proyecto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	id_proyecto UUID NOT NULL,
	nombre VARCHAR(255) NOT NULL,
	fecha_inicio DATE NOT NULL,
	fecha_fin DATE NOT NULL,
	estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Eliminado')),
	FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto)
);

-- ============================================
-- TABLA: equipos_consultores
-- ============================================
	CREATE TABLE equipos_consultores (
		id_equipo_consultores UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		id_consultor UUID NOT NULL,
		id_equipo_proyecto UUID NOT NULL,
		id_rol UUID NOT NULL,
		estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Eliminado', 'Activo')),
		porcentaje_dedicacion INT,
		fecha_inicio DATE,
		fecha_fin DATE,
		FOREIGN KEY (id_consultor) REFERENCES consultores(id_consultor),
		FOREIGN KEY (id_equipo_proyecto) REFERENCES equipos_proyectos(id_equipo_proyecto),
		FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
	);

-- ============================================
-- TABLA: tareas
-- ============================================
CREATE TABLE tareas (
	id_tarea UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	titulo VARCHAR(55),
	descripcion VARCHAR(95),
	estado_tarea VARCHAR(20) CHECK (estado_tarea IN ('pendiente', 'en progreso', 'completada', 'bloqueada')),
	fecha_creacion TIMESTAMP DEFAULT NOW(),
	estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Eliminado', 'Activo')),
	fecha_limite DATE,
	prioridad VARCHAR(15) CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
	id_equipos_consultores UUID,
	FOREIGN KEY (id_equipos_consultores) REFERENCES equipos_consultores(id_equipo_consultores)
);

-- TABLA: horas registradas
-- ============================================
CREATE TABLE horas_registradas_consultor (
    id_horas_registradas_consultor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cantidad_horas DECIMAL(5,2) NOT NULL,
    descripcion VARCHAR(55),
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('eliminado', 'Activo')),
    id_equipo_consultores UUID NOT NULL,
    fecha_horas_registradas DATE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_equipo_consultores) REFERENCES equipos_consultores(id_equipo_consultores)
);

