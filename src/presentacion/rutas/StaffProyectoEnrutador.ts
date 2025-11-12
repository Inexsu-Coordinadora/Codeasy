import { FastifyInstance } from "fastify";
import { StaffProyectoControlador } from "../controladores/StaffProyectoControlador";
import { StaffProyectoCasosUso } from "../../core/aplicacion/casos-uso/staff-proyecto/StaffProyectoCasosUso";
import { StaffProyectoRepositorio } from "../../core/infraestructura/postgres/StaffProyectoRepositorio";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio";
import { ClienteRepositorio } from "../../core/infraestructura/postgres/ClienteRepositorio";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { StaffProyectoCrearEsquema } from "../esquemas/Staff-Proyecto/staffProyectoCrearEsquema";

// Rutas del módulo StaffProyecto
function staffProyectoEnrutador(app: FastifyInstance, controlador: StaffProyectoControlador) {
  app.post(
    "/proyecto/:id_proyecto/asignar-consultor",
    { preHandler: validarZod(StaffProyectoCrearEsquema, "body") },
    controlador.asignarConsultorAProyecto.bind(controlador)
  );
}

// Constructor principal del enrutador
export async function construirStaffProyectoEnrutador(app: FastifyInstance) {
  const staffRepo = new StaffProyectoRepositorio();
  const proyectoRepo = new ProyectoRepositorio();
  const clienteRepo = new ClienteRepositorio();
  const casosUso = new StaffProyectoCasosUso(staffRepo, proyectoRepo, clienteRepo);
  const controlador = new StaffProyectoControlador(casosUso);

  staffProyectoEnrutador(app, controlador);
}
