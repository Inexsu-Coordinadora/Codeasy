import { FastifyInstance } from "fastify";
import { ProyectoControlador } from "../controladores/ProyectoControlador.js";
import { IProyectoRepositorio } from "../../core/dominio/proyecto/repositorio/IProyectoRepositorio";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso";
import { ClienteRepositorio } from "../../core/infraestructura/postgres/ClienteRepositorio";
import { validarZod } from "../esquemas/validarZod.js";
import { ProyectoCrearEsquema } from "../esquemas/Proyectos/proyectoCrearEsquema.js";
import { ProyectoActualizarEsquema } from "../esquemas/Proyectos/ProyectoActualizarEsquema.js";
import { EquipoProyectoRepositorio } from "../../core/infraestructura/postgres/EquipoProyectoRepositorio";

function proyectoEnrutador(app: FastifyInstance, proyectoController: ProyectoControlador) {
  app.get("/proyecto", proyectoController.listarTodosProyectos.bind(proyectoController));
  app.get("/proyecto/:idProyecto", proyectoController.obtenerProyectoPorId.bind(proyectoController));
  app.post("/proyecto",{ preHandler: validarZod(ProyectoCrearEsquema, "body") },proyectoController.registrarProyecto.bind(proyectoController));
  app.put("/proyecto/:idProyecto",{ preHandler: validarZod(ProyectoActualizarEsquema, "body") },proyectoController.actualizarProyecto.bind(proyectoController));
  app.delete("/proyecto/eliminar/:idProyecto", proyectoController.eliminarProyecto.bind(proyectoController));
}

export async function construirProyectoEnrutador(app: FastifyInstance) {
  const proyectoRepositorio: IProyectoRepositorio = new ProyectoRepositorio();
  const clienteRepositorio = new ClienteRepositorio();
  const equipoProyectoRepositorio = new EquipoProyectoRepositorio();
  const proyectoCasosUso = new ProyectoCasosUso(proyectoRepositorio, clienteRepositorio, equipoProyectoRepositorio);
  const proyectoController = new ProyectoControlador(proyectoCasosUso);
  proyectoEnrutador(app, proyectoController);
}