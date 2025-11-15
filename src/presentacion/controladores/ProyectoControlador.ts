import { FastifyReply, FastifyRequest } from "fastify";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso";
import type { ProyectoCrearDTO } from "../esquemas/proyectoCrearEsquema";
import type { ProyectoActualizarDTO } from "../esquemas/proyectoActualizarEsquema";

export class ProyectoControlador {
  constructor(private casosUso: ProyectoCasosUso) {}

  // Registrar un nuevo proyecto
  async registrarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as ProyectoCrearDTO;
    const nuevoProyecto = await this.casosUso.registrarProyecto(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Proyecto creado correctamente",
      data: nuevoProyecto,
    });
  }

  // Listar todos los proyectos activos
  async listarTodosProyectos(_req: FastifyRequest, reply: FastifyReply) {
    const proyectos = await this.casosUso.listarTodosProyectos();
    return reply.code(200).send({
      exito: true,
      mensaje: "Proyectos obtenidos correctamente",
      data: proyectos,
    });
  }

  // Obtener un proyecto por ID
  async obtenerProyectoPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: number };
    const proyecto = await this.casosUso.obtenerProyectoPorId(idProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Proyecto obtenido correctamente",
      data: proyecto,
    });
  }

  // Actualizar un proyecto existente
  async actualizarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: number };
    const datos = req.body as ProyectoActualizarDTO;

    const proyectoActualizado = await this.casosUso.actualizarProyecto(idProyecto, datos);

    return reply.code(200).send({
      exito: true,
      mensaje: "Proyecto actualizado correctamente",
      data: proyectoActualizado,
    });
  }

  // Eliminar (lógicamente) un proyecto
  async eliminarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: number };
    await this.casosUso.eliminarProyecto(idProyecto);
    
    return reply.code(200).send({
      exito: true,
      mensaje: "Proyecto eliminado correctamente",
    });
  }
}