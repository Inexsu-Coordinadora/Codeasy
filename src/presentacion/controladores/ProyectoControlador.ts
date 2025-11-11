import { FastifyReply, FastifyRequest } from "fastify";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso";
import type { ProyectoCrearDTO } from "../esquemas/proyectoCrearEsquema";
import type { ProyectoActualizarDTO } from "../esquemas/proyectoActualizarEsquema";
import { ConsultarProyectosPorClienteCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ConsultarProyectosPorClienteCasosUso";

export class ProyectoControlador {
  constructor(private casosUso: ProyectoCasosUso, private  consultarProyectosPorClienteCasosUso: ConsultarProyectosPorClienteCasosUso) {}

  async registrarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as ProyectoCrearDTO;
    const nuevoProyecto = await this.casosUso.registrarProyecto(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Proyecto creado correctamente",
      data: nuevoProyecto,
    });
  }

  async listarTodosProyectos(_req: FastifyRequest, reply: FastifyReply) {
    const proyectos = await this.casosUso.listarTodosProyectos();

    return reply.code(200).send({
      exito: true,
      mensaje: "Proyectos obtenidos correctamente",
      data: proyectos,
    });
  }

  async obtenerProyectoPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: number };
    const proyecto = await this.casosUso.obtenerProyectoPorId(idProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Proyecto obtenido correctamente",
      data: proyecto,
    });
  }

  async actualizarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: number };
    const datos = req.body as ProyectoActualizarDTO;

    const proyectoActualizado = await this.casosUso.actualizarProyecto(
      idProyecto,
      datos
    );

    return reply.code(200).send({
      exito: true,
      mensaje: "Proyecto actualizado correctamente",
      data: proyectoActualizado,
    });
  }

  async eliminarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: number };
    await this.casosUso.eliminarProyecto(idProyecto);

    return reply.code(200).send({
      exito: true,
      mensaje: "Proyecto eliminado correctamente",
    });
  }

// Nuevo método para consultar proyectos por cliente
  async consultarProyectosPorCliente(req: FastifyRequest, reply: FastifyReply) {
    const { idCliente } = req.params as { idCliente: string };
    const { estado, fecha_inicio, fecha_fin } = req.query as {
      estado?: string;
      fecha_inicio?: string;
      fecha_fin?: string;
    };

    const filtros = {
      estado,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
    };

    const resultado = await this.consultarProyectosPorClienteCasosUso.ejecutar(idCliente, filtros);

     if (resultado.mensaje) {
    return reply.code(200).send({
      exito: true,
      mensaje: resultado.mensaje,
      data: resultado.proyectos,
    });
  }

  return reply.code(200).send({
    exito: true,
    data: resultado.proyectos,
  });
  }
  
}