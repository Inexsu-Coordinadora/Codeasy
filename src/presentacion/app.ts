import Fastify from "fastify";
import { construirProyectoEnrutador } from "./rutas/ProyectoEnrutador";
import { construirClienteEnrutador } from "./rutas/ClienteEnrutador";
import { construirConsultorEnrutador } from "./rutas/ConsultorEnrutador";
import { construirTareaEnrutador } from "./rutas/enrutadorTarea";
import { construirStaffProyectoEnrutador } from "./rutas/StaffProyectoEnrutador";
import { registrarRutasParteHora } from "./rutas/parteHoraRutas";
import { pool } from "../core/infraestructura/postgres/clientepostgres";

import { ProyectoRepositorio } from "../core/infraestructura/postgres/ProyectoRepositorio";
import { ConsultorRepositorio } from "../core/infraestructura/postgres/ConsultorRepository";
import { StaffProyectoRepositorio } from "../core/infraestructura/postgres/StaffProyectoRepositorio";
import { configurarDependenciasParteHora } from "../core/infraestructura/postgres/dependenciasPartesHora";
import { ManejadorErrores } from "./esquemas/middlewares/ManejadorErrores";

const app = Fastify({ logger: true });

app.register(async (appInstance) => {
  // Rutas existentes
  construirProyectoEnrutador(appInstance);
  construirClienteEnrutador(appInstance);
  construirConsultorEnrutador(appInstance);
  construirTareaEnrutador(appInstance);
  construirStaffProyectoEnrutador(appInstance);

  const proyectoRepositorio = new ProyectoRepositorio();
  const consultorRepositorio = new ConsultorRepositorio();
  const staffProyectoRepositorio = new StaffProyectoRepositorio();

  // Configurar y registrar rutas de partes de horas
  const { parteHoraControlador } = configurarDependenciasParteHora(
    pool,
    proyectoRepositorio,
    consultorRepositorio,
    staffProyectoRepositorio
  );
  await registrarRutasParteHora(appInstance, parteHoraControlador);
}, { prefix: "/api" });

// Middleware global de manejo de errores
app.setErrorHandler(ManejadorErrores);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: Number(process.env.PUERTO) || 3000 });
    app.log.info(`El servidor está corriendo en el puerto ${process.env.PUERTO || 3000}...`);
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);
    throw err;
  }
};
