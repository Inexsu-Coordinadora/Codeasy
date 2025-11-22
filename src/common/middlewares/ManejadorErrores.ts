  import { FastifyReply, FastifyRequest } from "fastify";
  import { AppError } from "./AppError";
  import { CodigosHttp } from "../../common/codigosHttp";

  export function ManejadorErrores(
    error: unknown,
    _req: FastifyRequest,
    reply: FastifyReply
  ) {
    // AppError = errores del dominio y aplicación
    if (error instanceof AppError) {
      const appError = error as AppError;
      return reply.code(appError.statusCode).send({
        exito: false,
        error: {
          codigo: appError.statusCode,
          mensaje: appError.message,
          detalles: appError.detalles ?? undefined,
        },
      });
    }

    // Error común de JS
    if (error instanceof Error) {
      return reply.code(CodigosHttp.ERROR_INTERNO).send({
        exito: false,
        error: {
          codigo: CodigosHttp.ERROR_INTERNO,
          mensaje: error.message,
        },
      });
    }

    // Error desconocido = NO accedemos a ninguna propiedad
    return reply.code(CodigosHttp.ERROR_INTERNO).send({
      exito: false,
      error: {
        codigo: CodigosHttp.ERROR_INTERNO,
        mensaje: "Error desconocido",
      },
    });
  }