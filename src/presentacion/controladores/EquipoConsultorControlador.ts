import { FastifyReply, FastifyRequest } from "fastify";
import { EquipoConsultorCasosUso } from "../../core/aplicacion/casos-uso/EquipoConsultor/EquipoConsultorCasosUso";

import type { AsignacionCrearDTO } from "../esquemas/EquipoConsultor/EquipoConsultorCrearEsquema";
import type { AsignacionActualizarDTO } from "../esquemas/EquipoConsultor/EquipoConsultorActualizarEsquema";

export class EquipoConsultorControlador {
  constructor(private casosUso: EquipoConsultorCasosUso) {}

  // CREAR ASIGNACIÓN
  async crearAsignacion(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as AsignacionCrearDTO;

    const asignacion = await this.casosUso.crearAsignacion(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Consultor asignado correctamente al equipo.",
      data: asignacion,
    });
  }

  // OBTENER ASIGNACIÓN POR ID
  async obtenerAsignacionPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idAsignacion } = req.params as { idAsignacion: string };

    const asignacion = await this.casosUso.obtenerAsignacionPorId(idAsignacion);

    return reply.code(200).send({
      exito: true,
      mensaje: "Asignación obtenida correctamente.",
      data: asignacion,
    });
  }

  // LISTAR ASIGNACIONES POR EQUIPO
  async listarPorEquipo(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };

    const asignaciones = await this.casosUso.listarAsignacionesPorEquipo(idEquipoProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Asignaciones obtenidas correctamente.",
      data: asignaciones,
    });
  }

  // LISTAR ASIGNACIONES POR CONSULTOR
  async listarPorConsultor(req: FastifyRequest, reply: FastifyReply) {
    const { idConsultor } = req.params as { idConsultor: string };

    const asignaciones = await this.casosUso.listarAsignacionesPorConsultor(idConsultor);

    return reply.code(200).send({
      exito: true,
      mensaje: "Asignaciones obtenidas correctamente.",
      data: asignaciones,
    });
  }

  // ACTUALIZAR ASIGNACIÓN
  async actualizarAsignacion(req: FastifyRequest, reply: FastifyReply) {
    const { idAsignacion } = req.params as { idAsignacion: string };
    const datos = req.body as AsignacionActualizarDTO;

    const asignacion = await this.casosUso.actualizarAsignacion(idAsignacion, datos);

    return reply.code(200).send({
      exito: true,
      mensaje: "Asignación actualizada correctamente.",
      data: asignacion,
    });
  }

  // ELIMINAR ASIGNACIÓN (LÓGICO)
  async eliminarAsignacion(req: FastifyRequest, reply: FastifyReply) {
    const { idAsignacion } = req.params as { idAsignacion: string };

    const asignacion = await this.casosUso.eliminarAsignacion(idAsignacion);

    return reply.code(200).send({
      exito: true,
      mensaje: "Asignación eliminada correctamente.",
      data: asignacion,
    });
  }
}
