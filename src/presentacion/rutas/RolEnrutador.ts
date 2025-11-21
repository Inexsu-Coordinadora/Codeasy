import { FastifyInstance } from "fastify";
import { RolControlador } from "../controladores/RolControlador";
import { RolRepositorio } from "../../core/infraestructura/postgres/RolRepositorio";
import { RolCasosUso } from "../../core/aplicacion/casos-uso/Rol/RolCasosUso";
import { validarZod } from "../esquemas/validarZod";
import { RolCrearEsquema } from "../esquemas/Roles/rolCrearEsquema";
import { RolActualizarEsquema } from "../esquemas/Roles/rolActualizarEsquema";

function rolEnrutador(app: FastifyInstance, controller: RolControlador) {

  // Crear rol
  app.post(
    "/rol",
    { preHandler: validarZod(RolCrearEsquema, "body") },
    controller.crearRol.bind(controller)
  );

  // Listar roles
  app.get(
    "/rol",
    controller.listarRoles.bind(controller)
  );

  // Obtener rol por ID
  app.get(
    "/rol/:idRol",
    controller.obtenerRolPorId.bind(controller)
  );

  // Actualizar rol
  app.put(
    "/rol/:idRol",
    { preHandler: validarZod(RolActualizarEsquema, "body") },
    controller.actualizarRol.bind(controller)
  );

  // Eliminar rol (LÓGICO)
  app.delete(
    "/rol/eliminar/:idRol",
    controller.eliminarRol.bind(controller)
  );
}

export async function construirRolEnrutador(app: FastifyInstance) {

  const rolRepositorio = new RolRepositorio();
  const rolCasosUso = new RolCasosUso(rolRepositorio);
  const rolController = new RolControlador(rolCasosUso);

  rolEnrutador(app, rolController);
}
