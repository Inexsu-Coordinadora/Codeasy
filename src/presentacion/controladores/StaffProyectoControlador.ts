import { FastifyReply, FastifyRequest } from "fastify";
import { StaffProyectoCasosUso } from "../../core/aplicacion/casos-uso/staff-proyecto/StaffProyectoCasosUso";
import type { StaffProyectoCrearDTO } from "../esquemas/staffProyectoCrearEsquema";

export class StaffProyectoControlador {
  constructor(private casosUso: StaffProyectoCasosUso) {}

  // Asignar un consultor a un proyecto
  async asignarConsultorAProyecto(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idProyecto } = req.params as { idProyecto: string };
      const datos = req.body as StaffProyectoCrearDTO;

      const nuevaAsignacion = await this.casosUso.asignarConsultorAProyecto(
        idProyecto,
        datos
      );

      return reply.code(201).send({
        mensaje: "Consultor asignado correctamente al proyecto",
        data: nuevaAsignacion,
      });
    } catch (error: any) {
      // Errores controlados (valores inválidos, duplicados, etc.)
      if (
        error.message.includes("no existe") ||
        error.message.includes("duplicada") ||
        error.message.includes("fecha") ||
        error.message.includes("100%")
      ) {
        return reply.code(400).send({
          mensaje: "Error al asignar consultor",
          detalles: error.message,
        });
      }

      // Error interno inesperado
      return reply.code(500).send({
        mensaje: "Error interno al asignar consultor al proyecto",
        detalles: error.message,
      });
    }
  }
}