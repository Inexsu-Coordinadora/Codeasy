import { FastifyReply, FastifyRequest } from "fastify";
import { ConsultorCasosUso } from "../../core/aplicacion/casos-uso/Consultor/ConsultorCasosUso.js";
import type { ConsultorCrearDTO } from "../esquemas/consultorCrearEsquema";
import type { ConsultorActualizarDTO } from "../esquemas/consultorActualizarEsquema";

export class ConsultorControlador {
  constructor(private casosUso: ConsultorCasosUso) {}

  async registrarConsultor(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as ConsultorCrearDTO;
    const nuevoConsultor = await this.casosUso.registrarConsultor(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Consultor creado correctamente",
      data: nuevoConsultor,
    });
  }

  async listarTodosConsultores(_req: FastifyRequest, reply: FastifyReply) {
    const consultores = await this.casosUso.listarTodosConsultores();

    return reply.code(200).send({
      exito: true,
      mensaje: "Consultores activos obtenidos correctamente",
      data: consultores,
    });
  }

  async obtenerConsultorPorId(req: FastifyRequest, reply: FastifyReply) {
    const { id_consultor } = req.params as { id_consultor: string };
    const consultor = await this.casosUso.obtenerConsultorPorId(id_consultor);

    return reply.code(200).send({
      exito: true,
      mensaje: "Consultor obtenido correctamente",
      data: consultor,
    });
  }

  async actualizarConsultor(req: FastifyRequest, reply: FastifyReply) {
    const { id_consultor } = req.params as { id_consultor: string };
    const datos = req.body as ConsultorActualizarDTO;

    const consultorActualizado = await this.casosUso.actualizarConsultor(
      id_consultor,
      datos
    );

    return reply.code(200).send({
      exito: true,
      mensaje: "Consultor actualizado correctamente",
      data: consultorActualizado,
    });
  }

  async eliminarConsultor(req: FastifyRequest, reply: FastifyReply) {
    const { id_consultor } = req.params as { id_consultor: string };
    await this.casosUso.eliminarConsultor(id_consultor);

    return reply.code(200).send({
      exito: true,
      mensaje: "Consultor eliminado correctamente",
    });
  }
}