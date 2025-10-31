import Fastify from 'fastify';
import { ProyectoEnrutador } from './rutas/ProyectoEnrutador';

async function iniciarServidor() {
  const app = Fastify({ logger: true });

  // Registrar el enrutador de proyectos
  await ProyectoEnrutador(app);

  // Ruta base
  app.get('/', async () => {
    return { mensaje: 'API CODEASY funcionando correctamente' };
  });

  await app.listen({ port: 3000 });
  console.log('Servidor corriendo en http://localhost:3000');
}

iniciarServidor();
