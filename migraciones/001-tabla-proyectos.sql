-- ================================================================
-- Migración: Crear tabla proyectos
-- Fecha: 2024-11-01
-- Descripción: Crea la tabla "proyectos" para el sistema CODEASY
-- ================================================================

CREATE TABLE IF NOT EXISTS proyectos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Creado' CHECK (estado IN ('Creado', 'En proceso', 'Finalizado')),
  estatus VARCHAR(20) DEFAULT 'Activo' CHECK (estatus IN ('Activo', 'Eliminado')),
  id_cliente INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_entrega DATE NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Índice para mejorar las búsquedas por cliente
CREATE INDEX IF NOT EXISTS idx_proyectos_id_cliente ON proyectos (id_cliente);
