import { FastifyInstance } from 'fastify';
import { ProyectoControlador } from '../controladores/ProyectoControlador';

export async function ProyectoEnrutador(app: FastifyInstance) {
 
  app.register(async (subApp) => {
    await ProyectoControlador(subApp);
  }, { prefix: '/api' });
}
