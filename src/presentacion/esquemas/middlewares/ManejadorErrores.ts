import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export function ManejadorErrores(
  error: FastifyError | ZodError,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  let statusCode = 500;
  let mensaje = "Error interno del servidor";
  let detalles: any = undefined; 
  

  //  Errores de validación (Zod)
  if (error instanceof ZodError) {
    statusCode = 400;
    mensaje = "Error de validación de datos";
    detalles = error.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensaje: issue.message,
    }));
  }

  //  Errores de lógica o negocio (en casos de uso o repositorio)
  else if (error.message) {
    const msg = error.message.toLowerCase();

    if (msg.includes("no encontrado")) statusCode = 404;
    else if (msg.includes("ya existe") || msg.includes("duplicado")) statusCode = 409;
    else if (msg.includes("inválido") || msg.includes("invalido")) statusCode = 400;

    mensaje = error.message;
  }

  reply.code(statusCode).send({
    exito: false,
    error: {
      codigo: statusCode,
      mensaje,
      detalles,
    },
  });

  const respuestaError: any = {
    exito: false,
    error: {
      codigo: statusCode,
      mensaje,
    },
  };

  
}