import { FastifyInstance } from "fastify";
import { ProyectoControlador } from "../controladores/ProyectoControlador.js";
import { IProyectoRepositorio } from "../../core/dominio/proyecto/repositorio/IProyectoRepositorio.js";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio.js";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso.js";
import { validarZod } from "../esquemas/validarZod.js";
import { ProyectoCrearEsquema } from "../esquemas/Proyecto/proyectoCrearEsquema.js";
import { ProyectoActualizarEsquema } from "../esquemas/Proyecto/proyectoActualizarEsquema.js";

function proyectoEnrutador(app: FastifyInstance, proyectoController: ProyectoControlador) {
  app.get("/proyecto", proyectoController.listarTodosProyectos.bind(proyectoController));
  app.get("/proyecto/:idProyecto", proyectoController.obtenerProyectoPorId.bind(proyectoController));
  app.post("/proyecto", { preHandler: validarZod(ProyectoCrearEsquema, "body") }, proyectoController.registrarProyecto.bind(proyectoController));
  app.put("/proyecto/:idProyecto", { preHandler: validarZod(ProyectoActualizarEsquema, "body") }, proyectoController.actualizarProyecto.bind(proyectoController));
  app.put("/proyecto/eliminar/:idProyecto", proyectoController.eliminarProyecto.bind(proyectoController));
}

export async function construirProyectoEnrutador(app: FastifyInstance) {
  const proyectoRepositorio: ProyectoRepositorio = new ProyectoRepositorio();
  const proyectoCasosUso = new ProyectoCasosUso(proyectoRepositorio);
  const proyectoController = new ProyectoControlador(proyectoCasosUso);
  proyectoEnrutador(app, proyectoController);
}