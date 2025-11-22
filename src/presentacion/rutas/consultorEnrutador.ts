import { FastifyInstance } from "fastify";
import { ConsultorControlador } from "../controladores/ConsultorControlador.js";
import { IConsultorRepositorio } from "../../core/dominio/consultor/repositorio/IConsultorRepositorio.js";
import { ConsultorCasosUso } from "../../core/aplicacion/casos-uso/Consultor/ConsultorCasosUso.js";
import { ConsultorRepositorio } from "../../core/infraestructura/postgres/ConsultorRepositorio.js";
import { validarZod } from "../esquemas/validarZod.js";
import { ConsultorCrearEsquema } from "../esquemas/Consultores/consultorCrearEsquema.js";
import { ConsultorActualizarEsquema } from "../esquemas/Consultores/consultorActualizarEsquema.js";

function consultorEnrutador(
  app: FastifyInstance,
  ConsultorController: ConsultorControlador
) {
  app.get("/consultor", ConsultorController.listarTodosConsultores.bind(ConsultorController));
  app.get("/consultor/:idConsultor", ConsultorController.obtenerConsultorPorId.bind(ConsultorController));


  app.post("/consultor", { preHandler: validarZod(ConsultorCrearEsquema, "body") },ConsultorController.registrarConsultor.bind(ConsultorController));
  app.put("/consultor/:idConsultor", { preHandler: validarZod(ConsultorActualizarEsquema, "body") },ConsultorController.actualizarConsultor.bind(ConsultorController));
  app.delete("/consultor/eliminar/:idConsultor", ConsultorController.eliminarConsultor.bind(ConsultorController));
}

export async function construirConsultorEnrutador(app: FastifyInstance) {
  const consultorRepositorio: IConsultorRepositorio = new ConsultorRepositorio();
  const consultorCasosUso = new ConsultorCasosUso(consultorRepositorio);
  const consultorController = new ConsultorControlador(consultorCasosUso);

  consultorEnrutador(app, consultorController);
}
