import Fastify from 'fastify';
import { ProyectoControlador } from './controladores/ProyectoControlador';
import { probarConexion } from '../../src/core/infraestructura/postgres/clientePostgres';
import { configuration } from '../common/configuracion';

const app = Fastify({ logger: true });

async function iniciarServidor() {
  await probarConexion();

  // Registra el controlador con el prefijo '/api'
  app.register(ProyectoControlador, { prefix: '/api' });

  const puerto = configuration.httpPuerto;
  app.listen({ port: puerto }, (err, address) => {
    if (err) throw err;
    console.log(`Servidor corriendo en ${address}`);
  });
}

iniciarServidor();
