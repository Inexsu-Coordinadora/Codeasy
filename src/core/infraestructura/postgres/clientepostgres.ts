import { Pool } from 'pg';
import { configuration } from '../../../common/configuracion';

const pool = new Pool({
  host: configuration.baseDatos.host,
  user: configuration.baseDatos.usuario,
  database: configuration.baseDatos.nombreDb,
  port: configuration.baseDatos.puerto,
  password: configuration.baseDatos.contrasena,
});

export async function ejecutarConsulta(
  consulta: string,
  parametros?: Array<number | string | Date>
) {
  const resultado = await pool.query(consulta, parametros);
  return resultado;
}

export async function probarConexion() {
  try {
    const client = await pool.connect();
    console.log('Conectado correctamente a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error);
    process.exit(1);
  }
}