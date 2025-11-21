import { FastifyInstance } from "fastify";
import { TareaControlador } from "../controladores/TareaControlador.js";
import { ITareaRepositorio } from "../../core/dominio/tarea/repositorio/ITareaRepositorio.js";
import { TareaCasosUso } from "../../core/aplicacion/casos-uso/Tarea/TareaCasosUso.js";
import { TareaRepositorio } from "../../core/infraestructura/postgres/TareaRepositorio.js";
import { TareaCrearEsquema } from "../esquemas/TareaCrearEsquema.js";
import { validarZod } from "../esquemas/middlewares/validarZod.js";
import { TareaActualizarEsquema } from "../esquemas/TareaActualizarEsquema.js";


function tareaEnrutador(
  app: FastifyInstance,
  TareaController: TareaControlador
) {
  app.get("/tarea", TareaController.listarTodasTareas.bind(TareaController));
  app.get("/tarea/:idTarea", TareaController.obtenerTareaPorId.bind(TareaController));
  app.post("/tarea",{ preHandler: validarZod(TareaCrearEsquema, "body") }, TareaController.registrarTarea.bind(TareaController));
  app.put("/tarea/:idTarea",{ preHandler: validarZod(TareaActualizarEsquema, "body") }, TareaController.actualizarTarea.bind(TareaController));
  app.put("/tarea/eliminar/:idTarea", TareaController.eliminarTarea.bind(TareaController));
}

export async function construirTareaEnrutador(app: FastifyInstance) {
  const tareaRepositorio: TareaRepositorio = new TareaRepositorio();
  const tareaCasosUso = new TareaCasosUso(tareaRepositorio);
  const tareaController = new TareaControlador(tareaCasosUso);

  tareaEnrutador(app, tareaController);
}