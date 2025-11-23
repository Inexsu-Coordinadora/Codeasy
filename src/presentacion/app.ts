import Fastify from "fastify";
import { FastifyError } from "fastify";
import { construirProyectoEnrutador } from "./rutas/ProyectoEnrutador.js";
import { construirClienteEnrutador } from "./rutas/ClienteEnrutador.js";
import { construirConsultorEnrutador } from "./rutas/ConsultorEnrutador.js";
import { construirTareaEnrutador } from "./rutas/enrutadorTarea.js";
import { construirEquipoProyectoEnrutador } from "./rutas/EquipoProyectoEnrutador.js";
import { construirEquipoConsultorEnrutador } from "./rutas/EquipoConsultorEnrutador.js";
import { construirRolEnrutador } from "./rutas/RolEnrutador.js";
import { ManejadorErrores } from "../common/middlewares/ManejadorErrores";
import { configuration } from "../common/configuracion";
import { CodigosHttp } from "../common/codigosHttp";

const app = Fastify({ logger: true });
app.setErrorHandler(ManejadorErrores);

app.register(
  async (appInstance) => {
    construirProyectoEnrutador(appInstance);
    construirClienteEnrutador(appInstance);
    construirConsultorEnrutador(appInstance);
    construirTareaEnrutador(appInstance);
    construirEquipoProyectoEnrutador(appInstance);
    construirEquipoConsultorEnrutador(appInstance);
    construirRolEnrutador(appInstance);
  },
  { prefix: "/api" }
);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: configuration.httpPuerto }); 
    app.log.info(
      `El servidor está corriendo en el puerto ${configuration.httpPuerto}...`
    );
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);

    const serverError: FastifyError = {
      code: "FST_ERR_INIT_SERVER",
      name: "ServidorError",
      statusCode: CodigosHttp.ERROR_INTERNO,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };

    throw serverError;
  }
};
export { app };