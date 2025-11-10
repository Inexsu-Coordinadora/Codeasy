import { ZodError, ZodType } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

type TipoValidacion = "body" | "params" | "query";

export function validarZod<T>(
  esquema: ZodType<T>,
  tipo: TipoValidacion = "body"
) {
  return async (req: FastifyRequest, _reply: FastifyReply) => {
    // Solo parsea; si falla, lanza ZodError y lo captura el middleware global
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
  };
}
