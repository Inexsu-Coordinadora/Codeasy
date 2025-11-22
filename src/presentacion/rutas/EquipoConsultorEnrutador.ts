import { FastifyInstance } from "fastify";
import { EquipoConsultorControlador } from "../controladores/EquipoConsultorControlador";
import { EquipoConsultorRepositorio } from "../../core/infraestructura/postgres/EquipoConsultorRepositorio";
import { ConsultorRepositorio } from "../../core/infraestructura/postgres/ConsultorRepositorio";
import { EquipoProyectoRepositorio } from "../../core/infraestructura/postgres/EquipoProyectoRepositorio";
import { EquipoConsultorCasosUso } from "../../core/aplicacion/casos-uso/Equipo-Consultor/EquipoConsultorCasosUso";
import { validarZod } from "../esquemas/validarZod";
import { EquipoConsultorCrearEsquema } from "../esquemas/EquipoConsultor/EquipoConsultorCrearEsquema";
import { EquipoConsultorActualizarEsquema } from "../esquemas/EquipoConsultor/EquipoConsultorActualizarEsquema";

function equipoConsultorEnrutador(app: FastifyInstance, controller: EquipoConsultorControlador) {

  app.post(
"/equipo-consultor",{ preHandler: validarZod(EquipoConsultorCrearEsquema, "body") },controller.crear.bind(controller));
  app.get("/equipo-consultor/:idAsignacion",controller.obtenerPorId.bind(controller));
  app.get("/equipo-consultor/equipo/:idEquipoProyecto",controller.obtenerPorEquipo.bind(controller));
  app.get("/equipo-consultor/consultor/:idConsultor",controller.obtenerPorConsultor.bind(controller));
  app.put("/equipo-consultor/:idAsignacion",{ preHandler: validarZod(EquipoConsultorActualizarEsquema, "body") },controller.actualizar.bind(controller));
  app.delete("/equipo-consultor/eliminar/:idAsignacion",controller.eliminar.bind(controller));
}

export async function construirEquipoConsultorEnrutador(app: FastifyInstance) {

  const asignacionRepositorio = new EquipoConsultorRepositorio();
  const consultorRepositorio = new ConsultorRepositorio();
  const equipoProyectoRepositorio = new EquipoProyectoRepositorio();
  const casosUso = new EquipoConsultorCasosUso(asignacionRepositorio,consultorRepositorio,equipoProyectoRepositorio);
  const controller = new EquipoConsultorControlador(casosUso);
  equipoConsultorEnrutador(app, controller);
}