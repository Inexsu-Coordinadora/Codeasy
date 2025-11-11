import { FastifyInstance } from "fastify";
import { TareaControlador } from "../controladores/TareaControlador";
import { ITareaRepositorio } from "../../core/dominio/tarea/repositorio/ITareaRepositorio";
import { TareaCasosUso } from "../../core/aplicacion/casos-uso/Tarea/TareaCasosUso";
import { TareaRepositorio } from "../../core/infraestructura/postgres/TareaRepository";
import { TareaCrearEsquema } from "../esquemas/TareaCrearEsquema";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { TareaActualizarEsquema } from "../esquemas/TareaActualizarEsquema";


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
  const tareaRepositorio: ITareaRepositorio = new TareaRepositorio();
  const tareaCasosUso = new TareaCasosUso(tareaRepositorio);
  const tareaController = new TareaControlador(tareaCasosUso);

  tareaEnrutador(app, tareaController);
}