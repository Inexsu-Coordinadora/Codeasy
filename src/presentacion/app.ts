import{fastify} from "fastify";
import { FastifyError } from "fastify";
import { construirClienteEnrutador } from "./rutas/ClienteEnrutador";

const app = fastify({ logger: true });

app.register(
  async (appInstance) => {
    construirClienteEnrutador(appInstance);
  },


  { prefix: "/api" } // Todas las rutas estarán bajo /api/cliente
);

export const startServer = async (): Promise<void> => {
  try {
    const port = Number(process.env.PUERTO || 3000);
    await app.listen({ port });
    app.log.info(`El servidor esta corriendo en http://localhost:${port}/api`);
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