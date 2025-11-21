import { FastifyReply, FastifyRequest } from "fastify";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso.js";
import type { ProyectoCrearDTO } from "../esquemas/Proyecto/proyectoCrearEsquema.js";
import type { ProyectoActualizarDTO } from "../esquemas/Proyecto/proyectoActualizarEsquema.js";

export class ProyectoControlador {
  constructor(private casosUso: ProyectoCasosUso) {}

  // Registrar un nuevo proyecto
  async registrarProyecto(req: FastifyRequest, reply: FastifyReply) {
    try {
      const datos = req.body as ProyectoCrearDTO;
      const nuevoProyecto = await this.casosUso.registrarProyecto(datos);
      return reply.code(201).send({
        mensaje: "Proyecto creado correctamente",
        data: nuevoProyecto,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error interno al crear proyecto",
        detalles: error.message,
      });
    }
  }

  // Listar todos los proyectos activos
  async listarTodosProyectos(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const proyectos = await this.casosUso.listarTodosProyectos();
      return reply.code(200).send({
        mensaje: "Proyectos activos obtenidos correctamente",
        data: proyectos,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al listar proyectos",
        detalles: error.message,
      });
    }
  }

  // Obtener un proyecto por ID
  async obtenerProyectoPorId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idProyecto } = req.params as { idProyecto: number };
      const proyecto = await this.casosUso.obtenerProyectoPorId(idProyecto);

      if (!proyecto) {
        return reply.code(404).send({ mensaje: "Proyecto no encontrado" });
      }

      return reply.code(200).send({
        mensaje: "Proyecto obtenido correctamente",
        data: proyecto,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al obtener proyecto",
        detalles: error.message,
      });
    }
  }

  // Actualizar un proyecto existente
  async actualizarProyecto(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idProyecto } = req.params as { idProyecto: number };
      const datos = req.body as ProyectoActualizarDTO;

      const proyectoActualizado = await this.casosUso.actualizarProyecto(idProyecto, datos);

      return reply.code(200).send({
        mensaje: "Proyecto actualizado correctamente",
        data: proyectoActualizado,
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al actualizar proyecto",
        detalles: error.message,
      });
    }
  }

  // Eliminar (lógicamente) un proyecto
  async eliminarProyecto(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idProyecto } = req.params as { idProyecto: number };
      await this.casosUso.eliminarProyecto(idProyecto);
      return reply.code(200).send({
        mensaje: "Proyecto eliminado correctamente",
      });
    } catch (error: any) {
      return reply.code(500).send({
        mensaje: "Error al eliminar proyecto",
        detalles: error.message,
      });
    }
  }
}
