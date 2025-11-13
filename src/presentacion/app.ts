import Fastify from "fastify";
import { FastifyError } from "fastify";
import { construirProyectoEnrutador } from "./rutas/ProyectoEnrutador";
import { construirClienteEnrutador } from "./rutas/ClienteEnrutador";
import { construirConsultorEnrutador } from "./rutas/ConsultorEnrutador";
import { construirTareaEnrutador } from "./rutas/enrutadorTarea";
import { ManejadorErrores } from "./esquemas/middlewares/ManejadorErrores";


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
    await app.listen({ port: Number(process.env.PUERTO) });
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