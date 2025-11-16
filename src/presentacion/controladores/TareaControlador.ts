import { FastifyReply, FastifyRequest } from "fastify";
import { TareaCasosUso } from "../../core/aplicacion/casos-uso/Tarea/TareaCasosUso";
import { TareaCrearDTO } from "../esquemas/TareaCrearEsquema";
import { TareaActualizarDTO } from "../esquemas/TareaActualizarEsquema";

export class TareaControlador {
  constructor(private casosUso: TareaCasosUso) {}

  async registrarTarea(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as TareaCrearDTO;
    const nuevaTarea = await this.casosUso.registrar(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Tarea creada correctamente",
      data: nuevaTarea,
    });
  }

  async listarTodasTareas(_req: FastifyRequest, reply: FastifyReply) {
    const tareas = await this.casosUso.listarTodasTareas();

    return reply.code(200).send({
      exito: true,
      mensaje: "Tareas obtenidas correctamente",
      data: tareas,
    });
  }

  async obtenerTareaPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idTarea } = req.params as { idTarea: number };
    const tarea = await this.casosUso.obtenerTareaPorId(idTarea);

    return reply.code(200).send({
      exito: true,
      mensaje: "Tarea obtenida correctamente",
      data: tarea,
    });
  }

  async actualizarTarea(req: FastifyRequest, reply: FastifyReply) {
  const { idTarea } = req.params as { idTarea: number };
  const datos = req.body as TareaActualizarDTO;

    const tareaActualizada = await this.casosUso.actualizarTarea(idTarea, datos);

    return reply.code(200).send({
      exito: true,
      mensaje: "Tarea actualizada correctamente",
      data: tareaActualizada,
    });
  }

  async eliminarTarea(req: FastifyRequest, reply: FastifyReply) {
  const { idTarea } = req.params as { idTarea: number };
  await this.casosUso.eliminarTarea(idTarea);

    return reply.code(200).send({
      exito: true,
      mensaje: "Tarea eliminada correctamente",
    });
  }
}