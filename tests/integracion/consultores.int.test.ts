import request from "supertest";
import { app } from "../../src/presentacion/app";
import { IConsultor } from "../../src/core/dominio/consultor/IConsultor";

type ConsultorUpdate = Partial<Omit<IConsultor, "idConsultor">>;

jest.mock("../../src/core/infraestructura/postgres/ConsultorRepositorio", () => {
  return {
    ConsultorRepositorio: jest.fn().mockImplementation(() => {
      return {
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
        obtenerConsultorPorId: jest.fn().mockImplementation(async (id: string): Promise<IConsultor | null> => {
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
        actualizarConsultor: jest.fn().mockImplementation(async (id: string, datos: ConsultorUpdate): Promise<IConsultor | null> => {
          if (id === "mock-1") {
            if (datos.estado === "Eliminado") {
              return { idConsultor: "mock-1", estado: "Eliminado", nombre: "Dina", correo: "dina@mail.com", identificacion: "123" };
            }
            return { idConsultor: "mock-1", nombre: datos.nombre ?? "Dina", correo: datos.correo ?? "dina@mail.com", identificacion: datos.identificacion ?? "123", estado: datos.estado ?? "Activo" };
          }
          return null;
        }),
        eliminarConsultor: jest.fn().mockImplementation(async (_id: string) => {
          return;
        }),
        buscarPorCorreoOIdentificacion: jest.fn().mockResolvedValue(null),
        registrarConsultor: jest.fn().mockImplementation(async (c: IConsultor) => c)
      };
    })
  };
});

describe("Pruebas de integración - API Consultores", () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
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
