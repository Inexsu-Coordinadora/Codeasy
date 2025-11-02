import { FastifyReply, FastifyRequest } from "fastify";
import { TareaCasosUso } from "../../core/aplicacion/casos-uso/Tarea/TareaCasosUso";
import  { ITarea } from "../../core/dominio/tarea/ITarea"; 
import { TareaActualizarEsquema } from "../esquemas/EsquemaTareas";
import { TareaCrearEsquema } from "../esquemas/EsquemaTareas";


export class TareaControlador {
  constructor(private casosUso: TareaCasosUso) {}

  async registrarTarea(req: FastifyRequest, reply: FastifyReply) {
    try {
      const datos = TareaCrearEsquema.parse(req.body);
      const nuevo = await this.casosUso.registrar(datos);
      return reply.code(201).send({ mensaje: "Tarea creada", data: nuevo });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }


  async listarTodasTareas(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const tareas = await this.casosUso.listarTodasTareas();
      return reply.code(200).send(tareas);
    } catch (error: any) {
      return reply.code(500).send({ error: error.message });
    }
  }


  async obtenerTareaPorId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idTarea } = req.params as { idTarea: number };
      const tarea = await this.casosUso.obtenerTareaPorId(idTarea);
      if (!tarea)
        return reply.code(404).send({ mensaje: "Tarea no encontrada" });
      return reply.code(200).send(tarea);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }


  async actualizarTarea(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idTarea } = req.params as { idTarea: number };
      const datos = TareaActualizarEsquema.parse(req.body);
      const actualizado = await this.casosUso.actualizarTarea(idTarea, datos);
      return reply.code(200).send({ mensaje: "Tarea actualizada", data: actualizado });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }


  async eliminarTarea(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idTarea } = req.params as { idTarea: number };
      await this.casosUso.eliminarTarea(idTarea);
      return reply.code(200).send({ mensaje: "Tarea eliminada correctamente" });
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }
 }