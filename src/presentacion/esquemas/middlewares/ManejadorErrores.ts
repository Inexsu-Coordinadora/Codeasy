import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./AppError";

export function ManejadorErrores(
  error: FastifyError | ZodError | AppError,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  let statusCode = 500;
  let mensaje = "Error interno del servidor";
  let detalles: any = undefined;

  // Errores de Zod (validación)
  if (error instanceof ZodError) {
    statusCode = 400;
    mensaje = "Error de validación de datos";
    detalles = error.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensaje: issue.message,
    }));
  } 
  // Errores de negocio personalizados
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    mensaje = error.message;
    detalles = error.detalles;
  } 
  // Otros errores (genéricos)
  else if (error.message) {
    mensaje = error.message;
    const msg = error.message.toLowerCase();
    if (msg.includes("no encontrado")) statusCode = 404;
    else if (msg.includes("ya existe") || msg.includes("duplicado")) statusCode = 409;
    else if (msg.includes("inválido") || msg.includes("invalido")) statusCode = 400;
  }

  reply.status(statusCode).send({
    exito: false,
    error: {
      codigo: statusCode,
      mensaje,
      detalles,
    },
  });
}