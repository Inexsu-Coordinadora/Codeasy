import Fastify from "fastify";
import { FastifyError } from "fastify";
import { construirProyectoEnrutador } from "./rutas/ProyectoEnrutador.js";
import { construirClienteEnrutador } from "./rutas/ClienteEnrutador.js";
import { construirConsultorEnrutador } from "./rutas/consultorEnrutador.js";
import { construirTareaEnrutador } from "./rutas/TareaEnrutador.js";
import { ManejadorErrores } from "../common/middlewares/ManejadorErrores.js";
import { configuration } from "../common/configuracion.js";


const app = Fastify({ logger: true });

app.setErrorHandler(ManejadorErrores);

app.register(
  async (appInstance) => {
    construirProyectoEnrutador(appInstance);
    construirClienteEnrutador(appInstance);
    construirConsultorEnrutador(appInstance);
    construirTareaEnrutador(appInstance);
  },
  { prefix: "/api" }
);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: configuration.httpPuerto });
    app.log.info("El servidor esta corriendo...");
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);

    const serverError: FastifyError = {
      code: "FST_ERR_INIT_SERVER",
      name: "ServidorError",
      statusCode: 500,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };

    throw serverError;
  }
};