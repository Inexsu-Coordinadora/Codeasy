import { jest } from '@jest/globals';
import { IConsultor } from "../../src/core/dominio/consultor/IConsultor";

type ConsultorUpdate = Partial<Omit<IConsultor, "idConsultor">>;

let ConsultorRepositorio: any;
let EquipoConsultorRepositorio: any;

let consultorRepoInstance: any;
let equipoConsultorRepoInstance: any;

describe("Pruebas de integración - API Consultores", () => {
  let app: any;
  let request: any;

  beforeAll(async () => {
    consultorRepoInstance = {
      listarTodosConsultores: jest.fn().mockResolvedValue([
        {
          idConsultor: "mock-1",
          nombre: "Dina",
          identificacion: "123",
          correo: "dina@mail.com",
          estado: "Activo"
        },
        {
          idConsultor: "mock-2",
          nombre: "Juan",
          identificacion: "456",
          correo: "juan@mail.com",
          estado: "Activo"
        }
      ]),
      obtenerConsultorPorId: jest.fn().mockImplementation(async (id: string) => {
        if (id === "mock-1") {
          return {
            idConsultor: "mock-1",
            nombre: "Dina",
            identificacion: "123",
            correo: "dina@mail.com",
            estado: "Activo"
          };
        }
        return null;
      }),
      actualizarConsultor: jest.fn().mockImplementation(async (id: string, datos: ConsultorUpdate) => {
        if (id === "mock-1") {
          if (datos.estado === "Eliminado") {
            return { idConsultor: "mock-1", estado: "Eliminado", nombre: "Dina", correo: "dina@mail.com", identificacion: "123" };
          }
          return { idConsultor: "mock-1", nombre: datos.nombre ?? "Dina", correo: datos.correo ?? "dina@mail.com", identificacion: datos.identificacion ?? "123", estado: datos.estado ?? "Activo" };
        }
        return null;
      }),
      eliminarConsultor: jest.fn().mockResolvedValue(undefined),
      buscarPorCorreoOIdentificacion: jest.fn().mockResolvedValue(null),
      registrarConsultor: jest.fn().mockImplementation(async (c: IConsultor) => c)
    };

    equipoConsultorRepoInstance = {
      // Add methods if needed by ConsultorCasosUso, currently mostly used for validation in other places
      // but ConsultorCasosUso might use it? 
      // Checked ConsultorCasosUso.ts, it injects it but doesn't seem to use it in the methods tested here?
      // Wait, constructor(private consultorRepositorio: IConsultorRepositorio, private equipoConsultorRepositorio: IEquipoConsultorRepositorio)
      // It's injected, so we should mock it to be safe.
    };

    await jest.unstable_mockModule(
      "../../src/core/infraestructura/postgres/ConsultorRepositorio.js",
      () => ({
        ConsultorRepositorio: jest.fn(() => consultorRepoInstance)
      })
    );

    await jest.unstable_mockModule(
      "../../src/core/infraestructura/postgres/EquipoConsultorRepositorio.js",
      () => ({
        EquipoConsultorRepositorio: jest.fn(() => equipoConsultorRepoInstance)
      })
    );

    const appModule = await import("../../src/presentacion/app.js");
    app = appModule.app;
    request = (await import("supertest")).default;

    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  test("GET /api/consultor - retorna lista simulada", async () => {
    const response = await request(app.server).get("/api/consultor");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      exito: true,
      mensaje: "Consultores activos obtenidos correctamente",
      data: [
        { idConsultor: "mock-1", nombre: "Dina", identificacion: "123", correo: "dina@mail.com", estado: "Activo" },
        { idConsultor: "mock-2", nombre: "Juan", identificacion: "456", correo: "juan@mail.com", estado: "Activo" }
      ]
    });
  });

  test("GET /api/consultor/:id - retorna consultor simulado", async () => {
    const response = await request(app.server).get("/api/consultor/mock-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      exito: true,
      mensaje: "Consultor obtenido correctamente",
      data: { idConsultor: "mock-1", nombre: "Dina", identificacion: "123", correo: "dina@mail.com", estado: "Activo" }
    });
  });

  test("GET /api/consultor/:id - 404 si no existe", async () => {
    const response = await request(app.server).get("/api/consultor/999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.codigo).toBe(404);
    expect(response.body.error.mensaje).toMatch(/No se encontró/);
  });

  test("DELETE /api/consultor/eliminar/:id - elimina correctamente", async () => {
    const response = await request(app.server).delete("/api/consultor/eliminar/mock-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exito: true, mensaje: "Consultor eliminado correctamente" });
  });

  test("DELETE /api/consultor/eliminar/:id - retorna 404 si no existe", async () => {
    const response = await request(app.server).delete("/api/consultor/eliminar/999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.codigo).toBe(404);
    expect(response.body.error.mensaje).toMatch(/No se encontró/);
  });

});
