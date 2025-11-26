import { jest } from "@jest/globals";

let EquipoProyectoRepositorio: any;
let ProyectoRepositorio: any;
let EquipoConsultorRepositorio: any;

let equipoProyectoRepoInstance: any;
let proyectoRepoInstance: any;
let equipoConsultorRepoInstance: any;

describe("Integración – Equipo Proyecto", () => {
  let app: any;
  let request: any;

  // Initialize mocks
  equipoProyectoRepoInstance = {
    crear: jest.fn(),
    obtenerPorId: jest.fn(),
    obtenerPorProyecto: jest.fn(),
    obtenerTodos: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  };

  proyectoRepoInstance = {
    obtenerPorId: jest.fn(),
    actualizar: jest.fn(),
  };

  equipoConsultorRepoInstance = {
    eliminarPorEquipo: jest.fn(),
  };

  beforeAll(async () => {
    ({ EquipoProyectoRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/EquipoProyectoRepositorio.js",
      () => ({
        EquipoProyectoRepositorio: jest.fn(() => equipoProyectoRepoInstance)
      })
    ));

    ({ ProyectoRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/ProyectoRepositorio.js",
      () => ({
        ProyectoRepositorio: jest.fn(() => proyectoRepoInstance)
      })
    ));

    ({ EquipoConsultorRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/EquipoConsultorRepositorio.js",
      () => ({
        EquipoConsultorRepositorio: jest.fn(() => equipoConsultorRepoInstance)
      })
    ));

    const appModule = await import("../../../src/presentacion/app.js");
    app = appModule.app;
    request = (await import("supertest")).default;

    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  test("POST /api/equipo-proyecto", async () => {
    proyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idProyecto: "P1",
      estadoProyecto: "Creado",
    });

    equipoProyectoRepoInstance.obtenerPorProyecto.mockResolvedValue(null);

    equipoProyectoRepoInstance.crear.mockResolvedValue({
      idEquipoProyecto: "E1",
    });

    const res = await request(app.server)
      .post("/api/equipo-proyecto")
      .send({
        id_proyecto: "550e8400-e29b-41d4-a716-446655440000",
        nombre: "Team",
        fecha_inicio: "2050-01-01",
        fecha_fin: "2050-01-10",
      });

    expect(res.status).toBe(201);
  });

  test("GET /api/equipo-proyecto/:id", async () => {
    equipoProyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: "E1",
    });

    const res = await request(app.server).get("/api/equipo-proyecto/E1");
    expect(res.status).toBe(200);
  });

  test("PUT /api/equipo-proyecto/:id", async () => {
    equipoProyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: "E1",
      fechaInicio: new Date("2050-01-01"),
    });

    equipoProyectoRepoInstance.actualizar.mockResolvedValue({
      idEquipoProyecto: "E1",
      nombre: "Nuevo",
    });

    const res = await request(app.server)
      .put("/api/equipo-proyecto/E1")
      .send({ nombre: "Nuevo" });

    expect(res.status).toBe(200);
  });

  test("DELETE /api/equipo-proyecto/eliminar/:id", async () => {
    equipoProyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: "E1",
      estado: "Activo",
    });

    equipoProyectoRepoInstance.eliminar.mockResolvedValue({
      estado: "Eliminado",
    });

    const res = await request(app.server).delete("/api/equipo-proyecto/eliminar/E1");
    expect(res.status).toBe(200);
  });
});
