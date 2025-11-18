import { FastifyInstance } from "fastify";
import { EquipoConsultorControlador } from "../controladores/EquipoConsultorControlador";
import { EquipoConsultorRepositorio } from "../../core/infraestructura/postgres/EquipoConsultorRepositorio";
import { ConsultorRepositorio } from "../../core/infraestructura/postgres/ConsultorRepository";
import { EquipoProyectoRepositorio } from "../../core/infraestructura/postgres/EquipoProyectoRepositorio";
import { EquipoConsultorCasosUso } from "../../core/aplicacion/casos-uso/Equipo-Consultor/EquipoConsultorCasosUso";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { EquipoConsultorCrearEsquema } from "../esquemas/EquipoConsultor/EquipoConsultorCrearEsquema";
import { EquipoConsultorActualizarEsquema } from "../esquemas/EquipoConsultor/EquipoConsultorActualizarEsquema";

function equipoConsultorEnrutador(app: FastifyInstance, controller: EquipoConsultorControlador) {
  
  // Crear asignación
  app.post(
    "/equipo-consultor",
    { preHandler: validarZod(EquipoConsultorCrearEsquema, "body") },
    controller.crearAsignacion.bind(controller)
  );

  // Obtener asignación por ID
  app.get(
    "/equipo-consultor/:idAsignacion",
    controller.obtenerAsignacionPorId.bind(controller)
  );

  // Listar asignaciones por equipo
  app.get(
    "/equipo-consultor/equipo/:idEquipoProyecto",
    controller.listarPorEquipo.bind(controller)
  );

  // Listar asignaciones por consultor
  app.get(
    "/equipo-consultor/consultor/:idConsultor",
    controller.listarPorConsultor.bind(controller)
  );

  // Actualizar asignación
  app.put(
    "/equipo-consultor/:idAsignacion",
    { preHandler: validarZod(EquipoConsultorActualizarEsquema, "body") },
    controller.actualizarAsignacion.bind(controller)
  );

  // Eliminar asignación (lógica)
  app.put(
    "/equipo-consultor/eliminar/:idAsignacion",
    controller.eliminarAsignacion.bind(controller)
  );
}

export async function construirEquipoConsultorEnrutador(app: FastifyInstance) {

  const asignacionRepositorio = new EquipoConsultorRepositorio();
  const consultorRepositorio = new ConsultorRepositorio();
  const equipoProyectoRepositorio = new EquipoProyectoRepositorio();

  const casosUso = new EquipoConsultorCasosUso(
    asignacionRepositorio,
    consultorRepositorio,
    equipoProyectoRepositorio
  );

  const controller = new EquipoConsultorControlador(casosUso);

  equipoConsultorEnrutador(app, controller);
}
