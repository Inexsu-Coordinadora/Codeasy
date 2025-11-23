import { FastifyReply, FastifyRequest } from "fastify";
import { EquipoProyectoCasosUso } from "../../core/aplicacion/casos-uso/EquipoProyecto/EquipoProyectoCasosUso";
import type { EquipoProyectoCrearDTO } from "../esquemas/EquipoProyecto/EquipoProyectoCrearEsquema.js";
import type { EquipoProyectoActualizarDTO } from "../esquemas/EquipoProyecto/EquipoProyectoActualizarEsquema.js";
import { CodigosHttp } from "../../common/codigosHttp";

export class EquipoProyectoControlador {
  constructor(private casosUso: EquipoProyectoCasosUso) {}

  // Crear equipo de proyecto
  async crear(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as EquipoProyectoCrearDTO;

    const nuevoEquipo = await this.casosUso.crear(datos);

    return reply.code(CodigosHttp.CREADO).send({
      exito: true,
      mensaje: "Equipo de proyecto creado correctamente",
      data: nuevoEquipo,
    });
  }

  // Listar equipos (ACTIVOS)
  async obtenerTodos(_req: FastifyRequest, reply: FastifyReply) {
    const equipos = await this.casosUso.obtenerTodos();

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Equipos de proyecto obtenidos correctamente",
      data: equipos,
    });
  }

  // Obtener por ID
  async obtenerPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };

    const equipo = await this.casosUso.obtenerPorId(idEquipoProyecto);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Equipo de proyecto obtenido correctamente",
      data: equipo,
    });
  }

  // Obtener por ID de proyecto
  async obtenerPorProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: string };

    const equipo = await this.casosUso.obtenerPorProyecto(idProyecto);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Equipo del proyecto obtenido correctamente",
      data: equipo,
    });
  }

  // Actualizar equipo
  async actualizar(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };
    const datos = req.body as EquipoProyectoActualizarDTO;

    const equipoActualizado = await this.casosUso.actualizar(
      idEquipoProyecto,
      datos
    );

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Equipo de proyecto actualizado correctamente",
      data: equipoActualizado,
    });
  }

  // Eliminar equipo (lógico)
  async eliminar(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };

    const equipoEliminado = await this.casosUso.eliminar(idEquipoProyecto);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Equipo de proyecto eliminado correctamente",
      data: equipoEliminado,
    });
  }
}
