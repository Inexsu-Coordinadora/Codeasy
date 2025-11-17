import { FastifyReply, FastifyRequest } from "fastify";
import { EquipoProyectoCasosUso } from "../../core/aplicacion/casos-uso/EquipoProyecto/EquipoProyectoCasosUso";
import type { EquipoProyectoCrearDTO } from "../esquemas/EquipoProyecto/EquipoProyectoCrearEsquema";
import type { EquipoProyectoActualizarDTO } from "../esquemas/EquipoProyecto/EquipoProyectoActualizarEsquema";

export class EquipoProyectoControlador {
  constructor(private casosUso: EquipoProyectoCasosUso) {}

  // Crear equipo de proyecto
  async crearEquipoProyecto(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as EquipoProyectoCrearDTO;

    const nuevoEquipo = await this.casosUso.crearEquipoProyecto(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Equipo de proyecto creado correctamente",
      data: nuevoEquipo,
    });
  }

  // Listar equipos (ACTIVOS)
  async listarEquipos(_req: FastifyRequest, reply: FastifyReply) {
    const equipos = await this.casosUso.listarEquipos();

    return reply.code(200).send({
      exito: true,
      mensaje: "Equipos de proyecto obtenidos correctamente",
      data: equipos,
    });
  }

  // Obtener por ID
  async obtenerEquipoPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };

    const equipo = await this.casosUso.obtenerEquipoPorId(idEquipoProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Equipo de proyecto obtenido correctamente",
      data: equipo,
    });
  }

  // Obtener por ID de proyecto
  async obtenerEquipoPorProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: string };

    const equipo = await this.casosUso.obtenerEquipoPorProyecto(idProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Equipo del proyecto obtenido correctamente",
      data: equipo,
    });
  }

  // Actualizar equipo
  async actualizarEquipoProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };
    const datos = req.body as EquipoProyectoActualizarDTO;

    const equipoActualizado = await this.casosUso.actualizarEquipoProyecto(
      idEquipoProyecto,
      datos
    );

    return reply.code(200).send({
      exito: true,
      mensaje: "Equipo de proyecto actualizado correctamente",
      data: equipoActualizado,
    });
  }

  // Eliminar equipo (lógico)
  async eliminarEquipoProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idEquipoProyecto } = req.params as { idEquipoProyecto: string };

    const equipoEliminado = await this.casosUso.eliminarEquipoProyecto(idEquipoProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Equipo de proyecto eliminado correctamente",
      data: equipoEliminado,
    });
  }
}
