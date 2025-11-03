import { FastifyReply, FastifyRequest } from "fastify";
import { ConsultorCasosUso } from "../../core/aplicacion/casos-uso/Consultor/ConsultorCasosUso";
import type { ConsultorCrearDTO } from "../esquemas/consultorCrearEsquema";
import type { ConsultorActualizarDTO } from "../esquemas/consultorActualizarEsquema";


export class ConsultorControlador {
  constructor(private casosUso: ConsultorCasosUso) {}


  async registrarConsultor(req: FastifyRequest, reply: FastifyReply) {
    try {
      const datos = req.body as ConsultorCrearDTO;

      const nuevoConsultor = await this.casosUso.registrarConsultor(datos);

      return reply.code(201).send({
        mensaje: "Consultor creado correctamente",
        data: nuevoConsultor,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error interno al registrar consultor",
        detalles: error.message,
      });
    }
  }

  async listarTodosConsultores(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const consultores = await this.casosUso.listarTodosConsultores();

      return reply.code(200).send({
        mensaje: "Consultores activos obtenidos correctamente",
        data: consultores,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al listar consultores",
        detalles: error.message,
      });
    }
  }

  async obtenerConsultorPorId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idConsultor } = req.params as { idConsultor: number };
      const consultor = await this.casosUso.obtenerConsultorPorId(idConsultor);

      if (!consultor) {
        return reply.code(404).send({ mensaje: "Consultor no encontrado" });
      }

      return reply.code(200).send({
        mensaje: "Consultor obtenido correctamente",
        data: consultor,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: " Error al obtener consultor",
        detalles: error.message,
      });
    }
  }

  async actualizarConsultor(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idConsultor } = req.params as { idConsultor: number };
      const datos = req.body as ConsultorActualizarDTO;

      const consultorActualizado = await this.casosUso.actualizarConsultor(
        idConsultor,
        datos
      );

      return reply.code(200).send({
        mensaje: " Consultor actualizado correctamente",
        data: consultorActualizado,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al actualizar consultor",
        detalles: error.message,
      });
    }
  }

  async eliminarConsultor(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idConsultor } = req.params as { idConsultor: number };
      await this.casosUso.eliminarConsultor(idConsultor);

      return reply.code(200).send({
        mensaje: "Consultor eliminado correctamente",
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al eliminar consultor",
        detalles: error.message,
      });
    }
  }
}
