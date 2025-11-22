import { FastifyReply, FastifyRequest } from "fastify";
import { EquipoConsultorCasosUso } from "../../core/aplicacion/casos-uso/EquipoConsultor/EquipoConsultorCasosUso";
import type { AsignacionCrearDTO } from "../esquemas/EquipoConsultor/EquipoConsultorCrearEsquema.js";
import type { AsignacionActualizarDTO } from "../esquemas/EquipoConsultor/EquipoConsultorActualizarEsquema.js";
import { CodigosHttp } from "../../common/codigosHttp";

export class EquipoConsultorControlador {
  constructor(private casosUso: EquipoConsultorCasosUso) {}

  // CREAR ASIGNACIÓN
  async crear(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as AsignacionCrearDTO;

    const asignacion = await this.casosUso.crear(datos);

    return reply.code(CodigosHttp.CREADO).send({
      exito: true,
      mensaje: "Consultor asignado correctamente al equipo.",
      data: asignacion,
    });
  }

  // OBTENER ASIGNACIÓN POR ID
  async obtenerPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idAsignacion } = req.params as { idAsignacion: string };

    const asignacion = await this.casosUso.obtenerPorId(idAsignacion);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Asignación obtenida correctamente.",
      data: asignacion,
    });
  }

  // LISTAR ASIGNACIONES POR EQUIPO
  async obtenerPorEquipo(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };

    const asignaciones = await this.casosUso.obtenerPorEquipo(idEquipoProyecto);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Asignaciones obtenidas correctamente.",
      data: asignaciones,
    });
  }

  // LISTAR ASIGNACIONES POR CONSULTOR
  async obtenerPorConsultor(req: FastifyRequest, reply: FastifyReply) {
    const { idConsultor } = req.params as { idConsultor: string };

    const asignaciones = await this.casosUso.obtenerPorConsultor(idConsultor);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Asignaciones obtenidas correctamente.",
      data: asignaciones,
    });
  }

  // ACTUALIZAR ASIGNACIÓN
  async actualizar(req: FastifyRequest, reply: FastifyReply) {
    const { idAsignacion } = req.params as { idAsignacion: string };
    const datos = req.body as AsignacionActualizarDTO;

    const asignacion = await this.casosUso.actualizar(idAsignacion, datos);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Asignación actualizada correctamente.",
      data: asignacion,
    });
  }

  // ELIMINAR ASIGNACIÓN (LÓGICO)
  async eliminar(req: FastifyRequest, reply: FastifyReply) {
    const { idAsignacion } = req.params as { idAsignacion: string };

    const asignacion = await this.casosUso.eliminar(idAsignacion);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Asignación eliminada correctamente.",
      data: asignacion,
    });
  }
}
