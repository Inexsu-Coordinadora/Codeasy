import { FastifyInstance } from "fastify";
import { ParteHoraControlador } from "../controladores/ParteHoraControlador";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { ParteHoraCrearEsquema } from "../esquemas/ParteHora/ParteHoraEsquema";
import { z } from "zod";

export async function registrarRutasParteHora(
  fastify: FastifyInstance,
  controlador: ParteHoraControlador
) {
  // POST /api/partes-hora
  fastify.post(
    "/partes-hora",
    {
      preHandler: validarZod(ParteHoraCrearEsquema, "body"),
    },
    (request, reply) => controlador.registrarParteHora(request, reply)
  );

  // GET /api/partes-hora/proyecto/:id_proyecto
  fastify.get(
    "/partes-hora/proyecto/:id_proyecto",
    {
      preHandler: validarZod(
        z.object({ id_proyecto: z.string().uuid() }),
        "params"
      ),
    },
    (request, reply) => controlador.consultarPartesPorProyecto(request, reply)
  );

  // GET /api/partes-hora/consultor/:id_consultor
  fastify.get(
    "/partes-hora/consultor/:id_consultor",
    {
      preHandler: validarZod(
        z.object({ id_consultor: z.string().uuid() }),
        "params"
      ),
    },
    (request, reply) => controlador.consultarPartesPorConsultor(request, reply)
  );
}
