import { FastifyInstance } from "fastify";
import { EquipoProyectoControlador } from "../controladores/EquipoProyectoControlador";
import type { IEquipoProyectoRepositorio } from "../../core/dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio";
import { EquipoProyectoRepositorio } from "../../core/infraestructura/postgres/EquipoProyectoRepositorio";
import { EquipoProyectoCasosUso } from "../../core/aplicacion/casos-uso/Equipo-Proyecto/EquipoProyectoCasosUso";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio";
import { validarZod } from "../esquemas/middlewares/validarZod";
import { EquipoProyectoCrearEsquema } from "../esquemas/EquipoProyecto/EquipoProyectoCrearEsquema";
import { EquipoProyectoActualizarEsquema } from "../esquemas/EquipoProyecto/EquipoProyectoActualizarEsquema";
import { EquipoConsultorRepositorio } from "../../core/infraestructura/postgres/EquipoConsultorRepositorio.js";

function equipoProyectoEnrutador(app: FastifyInstance, equipoController: EquipoProyectoControlador) {

  // Listar equipos (activos)
  app.get("/equipo-proyecto", equipoController.obtenerTodos.bind(equipoController));

  // Obtener equipo por ID
  app.get("/equipo-proyecto/:idEquipoProyecto", equipoController.obtenerPorId.bind(equipoController));

  // Obtener equipo por proyecto
  app.get("/equipo-proyecto/proyecto/:idProyecto", equipoController.obtenerPorProyecto.bind(equipoController));

  // Crear equipo
  app.post("/equipo-proyecto",{ preHandler: validarZod(EquipoProyectoCrearEsquema, "body") },equipoController.crear.bind(equipoController));

  // Actualizar equipo
  app.put("/equipo-proyecto/:idEquipoProyecto",{ preHandler: validarZod(EquipoProyectoActualizarEsquema, "body") },equipoController.actualizar.bind(equipoController));

  // Eliminar equipo (lógico)
  app.put("/equipo-proyecto/eliminar/:idEquipoProyecto", equipoController.eliminar.bind(equipoController));
}

export async function construirEquipoProyectoEnrutador(app: FastifyInstance) {
  const equipoProyectoRepositorio: IEquipoProyectoRepositorio = new EquipoProyectoRepositorio();
  const proyectoRepositorio = new ProyectoRepositorio();
  const equipoConsultorRepositorio = new EquipoConsultorRepositorio();
  const equipoProyectoCasosUso = new EquipoProyectoCasosUso(equipoProyectoRepositorio,proyectoRepositorio,equipoConsultorRepositorio);
  const equipoProyectoController = new EquipoProyectoControlador(equipoProyectoCasosUso);
  equipoProyectoEnrutador(app, equipoProyectoController);
}
