import { jest } from "@jest/globals";

let rolRepoInstance: any = null;

class RolRepositorioMock {
  constructor() {
    rolRepoInstance = this;
  }

  crearRol = jest.fn();
  listarRoles = jest.fn();
  obtenerRolPorId = jest.fn();
  actualizarRol = jest.fn();
  eliminarRol = jest.fn();
}

jest.unstable_mockModule(
  "../../../src/core/infraestructura/postgres/RolRepositorio",
  () => ({
    RolRepositorio: RolRepositorioMock,
  })
);

const { app } = await import("../../../src/presentacion/app.js");
const request = (await import("supertest")).default;

describe("Integración - Roles", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());
  beforeEach(() => jest.clearAllMocks());

  test("POST /api/rol → crear rol", async () => {
    // 🔥 NECESARIO PARA EVITAR 500
    rolRepoInstance.listarRoles.mockResolvedValue([]);

    rolRepoInstance.crearRol.mockResolvedValue({
      idRol: "R1",
      nombreRol: "Admin",
      descripcion: "Administrador",
      estado: "Activo",
    });

    const res = await request(app.server)
      .post("/api/rol")
      .send({
        nombre_rol: "Admin",
        descripcion: "Administrador",
      });

    expect(res.status).toBe(201);
  });

  test("GET /api/rol/:id", async () => {
    rolRepoInstance.obtenerRolPorId.mockResolvedValue({
      idRol: "R1",
      nombreRol: "Admin",
      estado: "Activo",
    });

    const res = await request(app.server).get("/api/rol/R1");
    expect(res.status).toBe(200);
  });

  test("PUT /api/rol/:id", async () => {
    // 🔥 NECESARIO PARA EVITAR 500
    rolRepoInstance.obtenerRolPorId.mockResolvedValue({
      idRol: "R1",
      nombreRol: "Admin",
      descripcion: "Administrador",
      estado: "Activo",
    });

    rolRepoInstance.actualizarRol.mockResolvedValue({
      idRol: "R1",
      nombreRol: "Modificado",
      estado: "Activo",
    });

    const res = await request(app.server)
      .put("/api/rol/R1")
      .send({
        nombre_rol: "Modificado",
        descripcion: "Cambio",
      });

    expect(res.status).toBe(200);
  });

  test("DELETE /api/rol/eliminar/:id", async () => {
    rolRepoInstance.obtenerRolPorId.mockResolvedValue({
      idRol: "R1",
      estado: "Activo",
    });

    rolRepoInstance.eliminarRol.mockResolvedValue({
      idRol: "R1",
      estado: "Eliminado",
    });

    const res = await request(app.server).delete("/api/rol/eliminar/R1");
    expect(res.status).toBe(200);
  });
});
