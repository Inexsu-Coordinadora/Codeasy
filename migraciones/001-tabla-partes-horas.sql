CREATE TABLE partes_hora (
id_parte_hora UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
id_proyecto UUID NOT NULL REFERENCES proyectos(id_proyecto),
id_consultores UUID NOT NULL REFERENCES consultores(id_consultores), 
fecha DATE NOT NULL,
cantidad_horas DECIMAL(3,1) NOT NULL ,
descripcion VARCHAR(255) NOT NULL,
estado estado_general DEFAULT 'Activo',
UNIQUE (id_proyecto, id_consultores, fecha, descripcion)
);
