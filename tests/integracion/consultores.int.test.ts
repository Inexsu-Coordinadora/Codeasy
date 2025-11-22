import request from "supertest";
import { app } from "../../src/presentacion/app";

jest.mock("../../src/core/infraestructura/RepositorioFactory", () => ({
  RepositorioFactory: {
    crearRepositorio: async () => ({
      
      listarConsultores: async () => [
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
      ],

      obtenerConsultorPorId: async (id: string) => {
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
      },

      eliminarConsultor: async (id: string) => {
        if (id === "mock-1") {
          return {
            mensaje: "Consultor eliminado correctamente",
            idConsultor: "mock-1"
          };
        }
        return null;
      }

    })
  }
}));

describe("Pruebas de integración - API Consultores", () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // --------------------------------------
  // GET /api/consultores - lista completa
  // --------------------------------------
  test("GET /api/consultores - retorna lista simulada", async () => {
    const response = await request(app.server).get("/api/consultores");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Consultores encontrados correctamente",
      consultores: [
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
      ],
      consultoresEncontrados: 2
    });
  });

  // --------------------------------------
  // GET /api/consultores/:id - uno
  // --------------------------------------
  test("GET /api/consultores/:id - retorna consultor simulado", async () => {
    const response = await request(app.server).get("/api/consultores/mock-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Consultor encontrado correctamente",
      consultor: {
        idConsultor: "mock-1",
        nombre: "Dina",
        identificacion: "123",
        correo: "dina@mail.com",
        estado: "Activo"
      }
    });
  });

  // --------------------------------------
  // GET /api/consultores/:id - no existe
  // --------------------------------------
  test("GET /api/consultores/:id - 404 si no existe", async () => {
    const response = await request(app.server).get("/api/consultores/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      mensaje: "Consultor no encontrado"
    });
  });

  // --------------------------------------
  // DELETE /api/consultores/:id
  // --------------------------------------
  test("DELETE /api/consultores/:id - elimina correctamente", async () => {
    const response = await request(app.server).delete("/api/consultores/mock-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Consultor eliminado correctamente",
      idConsultor: "mock-1"
    });
  });

  test("DELETE /api/consultores/:id - retorna 404 si no existe", async () => {
    const response = await request(app.server).delete("/api/consultores/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      mensaje: "Consultor no encontrado"
    });
  });

});
