import { ZodError, ZodType } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { CodigosHttp } from "../../common/codigosHttp";
type TipoValidacion = "body" | "params" | "query";

export function validarZod<T>(
  esquema: ZodType<T>,
  tipo: TipoValidacion = "body"
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
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
        return reply.code(CodigosHttp.SOLICITUD_INCORRECTA).send({
          mensaje: " Error de validación",
          errores: error.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensaje: issue.message,
          })),
        });
      }

      return reply.code(CodigosHttp.ERROR_INTERNO).send({
        mensaje: "Error interno del servidor",
      });
    }
  };
}
