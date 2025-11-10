import { FastifyInstance } from "fastify";
import { StaffProyectoControlador } from "../controladores/StaffProyectoControlador";
import { StaffProyectoCasosUso } from "../../core/aplicacion/casos-uso/staff-proyecto/StaffProyectoCasosUso";
import { StaffProyectoRepositorio } from "../../core/infraestructura/postgres/StaffProyectoRepositorio";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio";
import { ConsultorRepositorio } from "../../core/infraestructura/postgres/ConsultorRepository";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { StaffProyectoCrearEsquema } from "../esquemas/staffProyectoCrearEsquema";

// Rutas del módulo StaffProyecto
function staffProyectoEnrutador(app: FastifyInstance, controlador: StaffProyectoControlador) {
  app.post(
    "/proyecto/:idProyecto/asignar-consultor",
    { preHandler: validarZod(StaffProyectoCrearEsquema, "body") },
    controlador.asignarConsultorAProyecto.bind(controlador)
  );

  app.get("/proyecto/:idProyecto/asignaciones", controlador.listarAsignaciones.bind(controlador));
  app.get("/asignaciones", controlador.listarAsignaciones.bind(controlador)); // opcional
}


// Constructor principal del enrutador
export async function construirStaffProyectoEnrutador(app: FastifyInstance) {
  const staffRepo = new StaffProyectoRepositorio();
  const proyectoRepo = new ProyectoRepositorio();
  const consultorRepo = new ConsultorRepositorio();
  const casosUso = new StaffProyectoCasosUso(staffRepo, proyectoRepo, consultorRepo);
  const controlador = new StaffProyectoControlador(casosUso);

  staffProyectoEnrutador(app, controlador);
}