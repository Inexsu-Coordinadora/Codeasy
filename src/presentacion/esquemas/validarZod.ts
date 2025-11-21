import { ZodError, ZodType } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

type TipoValidacion = "body" | "params" | "query";

export function validarZod<T>(
  esquema: ZodType<T>,
  tipo: TipoValidacion = "body"
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validación según tipo
      switch (tipo) {
        case "body":
          req.body = esquema.parse(req.body);
          break;
        case "params":
          req.params = esquema.parse(req.params);
          break;
        case "query":
          req.query = esquema.parse(req.query);
          break;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Agrupar y mostrar solo un error por campo
        const erroresUnicos = Object.values(
          error.issues.reduce((acc, issue) => {
            const campo = issue.path.join(".");
            if (!acc[campo]) {
              acc[campo] = { campo, mensaje: issue.message };
            }
            return acc;
          }, {} as Record<string, { campo: string; mensaje: string }>)
        );

        return reply.code(400).send({
          exito: false,
          error: {
            codigo: 400,
            mensaje: "Error de validación de datos",
            detalles: erroresUnicos,
          },
        });
      }

     
      return reply.code(500).send({
        exito: false,
        error: {
          codigo: 500,
          mensaje: "Error interno del servidor",
        },
      });
    }
  };
}