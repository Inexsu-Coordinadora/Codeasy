import { FastifyInstance } from "fastify";
import { ProyectoControlador } from "../controladores/ProyectoControlador";
import { IProyectoRepositorio } from "../../core/dominio/proyecto/repositorio/IProyectoRepositorio";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { ProyectoCrearEsquema } from "../esquemas/ProyectoCrearEsquema";
import { ProyectoActualizarEsquema } from "../esquemas/proyectoActualizarEsquema";

function proyectoEnrutador(app: FastifyInstance, proyectoController: ProyectoControlador) {
  app.get("/proyecto", proyectoController.listarTodosProyectos.bind(proyectoController));
  app.get("/proyecto/:idProyecto", proyectoController.obtenerProyectoPorId.bind(proyectoController));
  app.post("/proyecto", { preHandler: validarZod(ProyectoCrearEsquema, "body") }, proyectoController.registrarProyecto.bind(proyectoController));
  app.put("/proyecto/:idProyecto", { preHandler: validarZod(ProyectoActualizarEsquema, "body") }, proyectoController.actualizarProyecto.bind(proyectoController));
  app.put("/proyecto/eliminar/:idProyecto", proyectoController.eliminarProyecto.bind(proyectoController));
}

export async function construirProyectoEnrutador(app: FastifyInstance) {
  const proyectoRepositorio: IProyectoRepositorio = new ProyectoRepositorio();
  const proyectoCasosUso = new ProyectoCasosUso(proyectoRepositorio);
  const proyectoController = new ProyectoControlador(proyectoCasosUso);
  proyectoEnrutador(app, proyectoController);
}