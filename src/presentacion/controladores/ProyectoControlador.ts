import { FastifyReply, FastifyRequest } from "fastify";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso";
import type { ProyectoCrearDTO } from "../esquemas/proyectoCrearEsquema";
import type { ProyectoActualizarDTO } from "../esquemas/proyectoActualizarEsquema";
import { ConsultarProyectosPorClienteCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ConsultarProyectosPorClienteCasosUso";
import { CodigosHttp } from "../../common/codigosHttp";
export class ProyectoControlador {
  constructor(private casosUso: ProyectoCasosUso, private  consultarProyectosPorClienteCasosUso: ConsultarProyectosPorClienteCasosUso) {}

  // Registrar un nuevo proyecto
  // Crear
  async registrarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as ProyectoCrearDTO;
    const nuevoProyecto = await this.casosUso.crear(datos);

    return reply.code(CodigosHttp.CREADO).send({
      exito: true,
      mensaje: "Proyecto creado correctamente",
      data: nuevoProyecto,
    });
  }

  // Obtener todos
  async listarTodosProyectos(_req: FastifyRequest, reply: FastifyReply) {
    const proyectos = await this.casosUso.obtenerTodos();

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Proyectos obtenidos correctamente",
      data: proyectos,
    });
  }

  // Obtener por ID
  async obtenerProyectoPorId(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: string };
    const proyecto = await this.casosUso.obtenerPorId(idProyecto);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Proyecto obtenido correctamente",
      data: proyecto,
    });
  }

  // Actualizar
  async actualizarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: string };
    const datos = req.body as ProyectoActualizarDTO;

    const proyectoActualizado = await this.casosUso.actualizar(idProyecto, datos);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Proyecto actualizado correctamente",
      data: proyectoActualizado,
    });
  }

  // Eliminar
  async eliminarProyecto(req: FastifyRequest, reply: FastifyReply) {
    const { idProyecto } = req.params as { idProyecto: string };
    await this.casosUso.eliminar(idProyecto);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Proyecto eliminado correctamente",
    });
  }


async consultarProyectosPorCliente(req: FastifyRequest, reply: FastifyReply) {
  const { idCliente } = req.params as { idCliente: string };
  const { estado, fechaInicio } = req.query as {
    estado?: string;
    fechaInicio?: string;

  };

  const filtros = {
    estadoProyecto: estado,
    fechaInicio: fechaInicio ? fechaInicio : undefined,
    
  };

  const resultado = await this.consultarProyectosPorClienteCasosUso.ejecutar(
    idCliente,
    filtros
  );

  return reply.code(CodigosHttp.OK).send({
    exito: true,
    mensaje: resultado.mensaje,
    data: resultado.proyectos,
  });
}

}