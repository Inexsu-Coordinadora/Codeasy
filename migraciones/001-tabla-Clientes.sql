CREATE TABLE clientes (
	idcliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    identificacion VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    estatus VARCHAR(20) DEFAULT 'Activo' CHECK (estatus IN ('Activo', 'Eliminado'))
)

