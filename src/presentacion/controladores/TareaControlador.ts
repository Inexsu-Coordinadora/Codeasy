import { FastifyReply, FastifyRequest } from "fastify";
import { TareaCasosUso } from "../../core/aplicacion/casos-uso/Tarea/TareaCasosUso";
import { TareaActualizarEsquema } from "../esquemas/EsquemaTareas";
import { TareaCrearEsquema } from "../esquemas/EsquemaTareas";
import { ZodError } from "zod";
import { CodigosHttp } from "../../common/codigosHttp";

export class TareaControlador {
  constructor(private casosUso: TareaCasosUso) {}


   private manejarError(reply: FastifyReply, error: any) {
    console.error(error);
    let statusCode = 500; 
    let mensajeErrorLimpio: string;
    if (error instanceof ZodError) {
      const flattenedErrors = error.flatten();
      statusCode = 400; 
      const fieldErrors = flattenedErrors.fieldErrors as Record<string, string[] | undefined>;
      
      if (Object.keys(fieldErrors).length > 0) {
        const firstFieldName = Object.keys(fieldErrors)[0];
        const firstErrorMessage = firstFieldName ? fieldErrors[firstFieldName]?.[0] : undefined;
        
        if (firstErrorMessage) {
          mensajeErrorLimpio = `${firstFieldName}: ${firstErrorMessage}`;
        } else {
          mensajeErrorLimpio = "Error de validación de datos en un campo específico.";
        }
      } else {
        mensajeErrorLimpio = flattenedErrors.formErrors?.[0] ?? "Error de validación de datos.";
      }
    } else {
      mensajeErrorLimpio = error.message ?? "Error interno del servidor.";
      
      if (mensajeErrorLimpio.includes("no encontrado")) {
      statusCode = 404;
      } else if (mensajeErrorLimpio.includes("Ya existe") || mensajeErrorLimpio.includes("en uso")) {
      statusCode = 409; 
      } else {
      statusCode = 500; 
      mensajeErrorLimpio = "Error interno del servidor.";
      }
    }
    return reply.code(statusCode).send({ error: mensajeErrorLimpio });
}

  async registrarTarea(req: FastifyRequest, reply: FastifyReply) {
    try {
      const datos = TareaCrearEsquema.parse(req.body);
      const nuevo = await this.casosUso.registrar(datos);
      return reply.code(CodigosHttp.CREADO).send({ mensaje: "Tarea creada", data: nuevo });
    } catch (error: any) {
      return this.manejarError(reply, error); 
    }
  }


  async listarTodasTareas(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const tareas = await this.casosUso.listarTodasTareas();
      return reply.code(CodigosHttp.OK).send(tareas);
    } catch (error: any) {
      return this.manejarError(reply, error);
    }
  }


  async obtenerTareaPorId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idTarea } = req.params as { idTarea: number };
      const tarea = await this.casosUso.obtenerTareaPorId(idTarea);
      if (!tarea)
        return reply.code(404).send({ mensaje: "Tarea no encontrada" });
      return reply.code(CodigosHttp.OK).send(tarea);
    } catch (error: any) {
      return this.manejarError(reply, error);
    }
  }


  async actualizarTarea(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idTarea } = req.params as { idTarea: number };
      const datos = TareaActualizarEsquema.parse(req.body);
      const actualizado = await this.casosUso.actualizarTarea(idTarea, datos);
      return reply.code(CodigosHttp.OK).send({ mensaje: "Tarea actualizada", data: actualizado });
    } catch (error: any) {
      return this.manejarError(reply, error);
    }
  }


  async eliminarTarea(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idTarea } = req.params as { idTarea: number };
      await this.casosUso.eliminarTarea(idTarea);
      return reply.code(CodigosHttp.OK).send({ mensaje: "Tarea eliminada correctamente" });
    } catch (error: any) {
      return this.manejarError(reply, error);
    }
  }
 }