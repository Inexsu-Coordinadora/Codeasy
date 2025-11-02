import dotenv from 'dotenv';
dotenv.config();

export const configuration = {
  httpPuerto: Number(process.env.PUERTO) || 3000,
  baseDatos: {
    host: process.env.PGHOST || 'localhost',
    puerto: Number(process.env.PGPORT) || 5432,
    usuario: process.env.PGUSER || 'postgres',
    contrasena: process.env.PGPASSWORD || '',
    nombreDb: process.env.PGDBNAME || 'codeasy_db',
  },
};
