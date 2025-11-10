// src/presentacion/rutas/parteHoraRutas.ts
import { FastifyInstance } from "fastify";
import { ParteHoraControlador } from "../controladores/ParteHoraControlador";

export async function registrarRutasParteHora(
  fastify: FastifyInstance,
  controlador: ParteHoraControlador
) {
  // POST /api/partes-hora - Registrar parte de horas
  fastify.post("/partes-hora", async (request, reply) => {
    return controlador.registrarParteHora(request, reply);
  });

  // GET /api/partes-hora/proyecto/:id_proyecto - Consultar por proyecto
  fastify.get("/partes-hora/proyecto/:id_proyecto", async (request, reply) => {
    return controlador.consultarPartesPorProyecto(request, reply);
  });

  // GET /api/partes-hora/consultor/:id_consultor - Consultar por consultor
  fastify.get("/partes-hora/consultor/:id_consultor", async (request, reply) => {
    return controlador.consultarPartesPorConsultor(request, reply);
  });
}