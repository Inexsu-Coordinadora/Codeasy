// src/presentacion/controladores/ParteHoraControlador.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { ParteHoraCasosUso } from "../../core/aplicacion/casos-uso/ParteHora/ParteHoraCasosUso";
import { ParteHoraCrearEsquema } from "../esquemas/ParteHoraEsquema";
import { ZodError } from "zod";

export class ParteHoraControlador {
  constructor(private parteHoraCasosUso: ParteHoraCasosUso) {}

  async registrarParteHora(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const datosValidados = ParteHoraCrearEsquema.parse(request.body);

      const parteRegistrado = await this.parteHoraCasosUso.registrarParteHora({
        id_proyecto: datosValidados.id_proyecto,
        id_consultor: datosValidados.id_consultor,
        fecha: datosValidados.fecha,
        cantidad_horas: datosValidados.cantidad_horas,
        descripcion: datosValidados.descripcion,
      });

      reply.status(201).send({
        success: true,
        message: "Parte de horas registrado exitosamente",
        data: parteRegistrado,
      });
    } catch (error: any) {
      // Errores de validación de Zod
      if (error instanceof ZodError) {
        reply.status(400).send({
          success: false,
          error: "Validación fallida",
          message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: error.errors
        });
        return;
      }

      // Determinar el código de estado según el tipo de error
      let statusCode = 400;
      if (error.message.includes('inexistente')) {
        statusCode = 404;
      } else if (error.message.includes('duplicado')) {
        statusCode = 409;
      }

      reply.status(statusCode).send({
        success: false,
        error: "Error al registrar parte de horas",
        message: error.message,
      });
    }
  }

  async consultarPartesPorProyecto(
    request: FastifyRequest<{ Params: { id_proyecto: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id_proyecto } = request.params;

      const partes = await this.parteHoraCasosUso.consultarPartesPorProyecto(id_proyecto);

      reply.status(200).send({
        success: true,
        message: partes.length > 0 
          ? "Partes de horas consultados exitosamente" 
          : "No se encontraron partes de horas para este proyecto",
        data: partes,
        total: partes.length,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('inexistente') ? 404 : 400;
      
      reply.status(statusCode).send({
        success: false,
        error: "Error al consultar partes de horas",
        message: error.message,
      });
    }
  }

  async consultarPartesPorConsultor(
    request: FastifyRequest<{ Params: { id_consultor: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id_consultor } = request.params;

      const partes = await this.parteHoraCasosUso.consultarPartesPorConsultor(id_consultor);

      reply.status(200).send({
        success: true,
        message: partes.length > 0 
          ? "Partes de horas consultados exitosamente" 
          : "No se encontraron partes de horas para este consultor",
        data: partes,
        total: partes.length,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('inexistente') ? 404 : 400;
      
      reply.status(statusCode).send({
        success: false,
        error: "Error al consultar partes de horas",
        message: error.message,
      });
    }
  }
}