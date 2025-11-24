import Fastify from "fastify";
import { FastifyError } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { construirProyectoEnrutador } from "./rutas/ProyectoEnrutador";
import { construirClienteEnrutador } from "./rutas/ClienteEnrutador";
import { construirConsultorEnrutador } from "./rutas/consultorEnrutador";
import { construirEquipoProyectoEnrutador } from "./rutas/EquipoProyectoEnrutador";
import { construirEquipoConsultorEnrutador } from "./rutas/EquipoConsultorEnrutador";
import { construirRolEnrutador } from "./rutas/RolEnrutador";
import { ManejadorErrores } from "../common/middlewares/ManejadorErrores";
import { configuration } from "../common/configuracion";
import { CodigosHttp } from "../common/codigosHttp";
import { construirTareaEnrutador } from "./rutas/TareaEnrutador";

const app = Fastify({ logger: true });
app.setErrorHandler(ManejadorErrores);

async function registrarSwagger() {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "API de Gestión de Proyectos",
        description: "Documentación de la API con Swagger (Fastify + TypeScript)",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${configuration.httpPuerto}/api`,
          description: "Servidor local",
        },
      ],
    },
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}

await registrarSwagger();

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