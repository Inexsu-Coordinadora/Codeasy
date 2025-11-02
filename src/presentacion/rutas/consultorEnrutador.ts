import { FastifyInstance } from "fastify";
import { ConsultorControlador } from "../controladores/CunsultorControlador.js";
import { IConsultorRepositorio } from "../../core/dominio/consultor/repositorio/IConsultorRepositorio.js";
import { ConsultorCasosUso } from "../../core/aplicacion/casos-uso/Consultor/ConsultorCasosUso.js";
import { ConsultorRepositorio } from "../../core/infraestructura/postgres/ConsultorRepository.js";

function consultorEnrutador(
  app: FastifyInstance,
  ConsultorController: ConsultorControlador
) {
  app.get("/consultor", ConsultorController.listarTodosConsultores.bind(ConsultorController));
  app.get("/consultor/:idConsultor", ConsultorController.obtenerConsultorPorId.bind(ConsultorController));
  app.post("/consultor", ConsultorController.registrarConsultor.bind(ConsultorController));
  app.put("/consultor/:idConsultor", ConsultorController.actualizarConsultor.bind(ConsultorController));
  app.put("/consultor/eliminar/:idConsultor", ConsultorController.eliminarConsultor.bind(ConsultorController));
}

export async function construirConsultorEnrutador(app: FastifyInstance) {
  const consultorRepositorio: IConsultorRepositorio = new ConsultorRepositorio();
  const consultorCasosUso = new ConsultorCasosUso(consultorRepositorio);
  const consultorController = new ConsultorControlador(consultorCasosUso);

  consultorEnrutador(app, consultorController);
}
