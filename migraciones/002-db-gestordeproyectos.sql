- 🔹 EXTENSIÓN UUID
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 🔹 ENUMS
-- ============================================================
CREATE TYPE estado_general AS ENUM ('Activo', 'Eliminado');
CREATE TYPE estado_proyecto AS ENUM ('Creado', 'En proceso', 'Finalizado');
CREATE TYPE disponibilidad_consultor AS ENUM ('Disponible', 'No disponible');
CREATE TYPE nivel_experiencia AS ENUM ('Junior', 'Semi-Senior', 'Senior', 'Experto');
CREATE TYPE estado_tarea AS ENUM ('pendiente', 'en proceso', 'bloqueada', 'completada');
CREATE TYPE prioridad_tarea AS ENUM ('Baja', 'Media', 'Alta');
-- 🔹 CLIENTES
-- ============================================================
CREATE TABLE clientes (
id_cliente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
nombre VARCHAR(100) NOT NULL,
identificacion VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
telefono VARCHAR(20),
estado estado_general DEFAULT 'Activo'
);
-- 🔹 CONSULTORES
-- ============================================================
CREATE TABLE consultores (
id_consultor UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
nombre VARCHAR(100) NOT NULL,
identificacion VARCHAR(50) UNIQUE NOT NULL,
correo VARCHAR(100) UNIQUE NOT NULL,
telefono VARCHAR(55),
especialidad VARCHAR(100),
nivel_experiencia nivel_experiencia NOT NULL DEFAULT 'Junior',
disponibilidad disponibilidad_consultor NOT NULL DEFAULT 'Disponible',
estado estado_general DEFAULT 'Activo'
);
-- 🔹 ROLES
-- ============================================================
CREATE TABLE roles (
id_rol UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
nombre VARCHAR(55) UNIQUE NOT NULL,
descripcion VARCHAR(100),
estado estado_general DEFAULT 'Activo'
);
- -- 🔹 HORAS
- -- ============================================================
CREATE TABLE partes_hora (
id_parte_hora UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
id_staff_proyecto UUID NOT NULL REFERENCES staff_proyecto(id_staff_proyecto),
fecha DATE NOT NULL,
cantidad_horas DECIMAL(3,1) NOT NULL ,
descripcion VARCHAR(255) NOT NULL,
estado estado_general DEFAULT 'Activo',
UNIQUE (id_staff_proyecto, fecha, descripcion)
);
- 
- - 🔹 PROYECTOS
-- ============================================================
    
    CREATE TABLE IF NOT EXISTS proyectos (
    id_proyecto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado_proyecto VARCHAR(20) DEFAULT 'Creado' CHECK (estado_proyecto IN ('Creado', 'En proceso', 'Finalizado')),
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Eliminado')),
    id_cliente UUID NOT NULL REFERENCES clientes(id_cliente),
    fecha_inicio DATE NOT NULL,
    fecha_entrega DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    CONSTRAINT proyectos_unico_cliente_nombre UNIQUE (id_cliente, nombre)
    );
    
- - 🔹 STAFF_PROYECTO (relación N:N entre consultores y proyectos)
-- ============================================================
CREATE TABLE staff_proyecto (
id_staff_proyecto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
id_consultor UUID NOT NULL REFERENCES consultores(id_consultor),
id_proyecto UUID NOT NULL REFERENCES proyectos(id_proyecto),
id_rol UUID REFERENCES roles(id_rol),
porcentaje_dedicacion DECIMAL(5,2) NOT NULL,
fecha_inicio DATE,
fecha_fin DATE,
UNIQUE (id_consultor, id_proyecto)
);
-- 🔹 TAREAS (solo relacionadas al staff_proyecto)
-- ============================================================
CREATE TABLE tareas (
id_tarea UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
titulo VARCHAR(100) NOT NULL,
descripcion VARCHAR(255),
estado_tarea estado_tarea DEFAULT 'pendiente',
prioridad prioridad_tarea DEFAULT 'Media',
fecha_creacion DATE DEFAULT CURRENT_DATE,
fecha_limite DATE,
id_staff_proyecto UUID NOT NULL REFERENCES staff_proyecto(id_staff_proyecto),
estado estado_general DEFAULT 'Activo'
);

INSERT INTO roles (id_rol, nombre_rol, descripcion, estado)
VALUES
(uuid_generate_v4(), 'Líder de Proyecto', 'Encargado general del proyecto', 'Activo'),
(uuid_generate_v4(), 'Desarrollador Backend', 'Responsable de la lógica del servidor', 'Activo'),
(uuid_generate_v4(), 'Desarrollador Frontend', 'Responsable de la interfaz de usuario', 'Activo'),
(uuid_generate_v4(), 'QA Tester', 'Encargado de las pruebas y control de calidad', 'Activo'),
(uuid_generate_v4(), 'Analista Funcional', 'Define requerimientos y comunica con el cliente', 'Activo');