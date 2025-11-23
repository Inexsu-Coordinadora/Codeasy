import { jest } from "@jest/globals";

let EquipoConsultorRepositorio: any;
let ConsultorRepositorio: any;
let EquipoProyectoRepositorio: any;

let equipoConsultorRepoInstance: any;
let consultorRepoInstance: any;
let equipoProyectoRepoInstance: any;

describe("Integración – Equipo Consultor", () => {
  let app: any;
  let request: any;

  // Initialize mocks
  equipoConsultorRepoInstance = {
    crear: jest.fn(),
    obtenerPorId: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
    rolExiste: jest.fn(),
    obtenerPorEquipo: jest.fn(),
    obtenerPorConsultor: jest.fn(),
  };

  consultorRepoInstance = {
    obtenerConsultorPorId: jest.fn(),
  };

  equipoProyectoRepoInstance = {
    obtenerPorId: jest.fn(),
  };

  beforeAll(async () => {
    ({ EquipoConsultorRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/EquipoConsultorRepositorio.js",
      () => ({
        EquipoConsultorRepositorio: jest.fn(() => equipoConsultorRepoInstance)
      })
    ));

    ({ ConsultorRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/ConsultorRepository.js",
      () => ({
        ConsultorRepositorio: jest.fn(() => consultorRepoInstance)
      })
    ));

    ({ EquipoProyectoRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/EquipoProyectoRepositorio.js",
      () => ({
        EquipoProyectoRepositorio: jest.fn(() => equipoProyectoRepoInstance)
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

  test("POST /api/equipo-consultor", async () => {
    consultorRepoInstance.obtenerConsultorPorId.mockResolvedValue({
      idConsultor: "C1",
      estado: "Activo",
    });

    equipoProyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: "E1",
      estado: "Activo",
    });

    equipoConsultorRepoInstance.rolExiste.mockResolvedValue(true);
    equipoConsultorRepoInstance.obtenerPorEquipo.mockResolvedValue([]);
    equipoConsultorRepoInstance.obtenerPorConsultor.mockResolvedValue([]);

    equipoConsultorRepoInstance.crear.mockResolvedValue({
      idEquipoConsultor: "EC1",
    });

    const res = await request(app.server)
      .post("/api/equipo-consultor")
      .send({
        id_consultor: "550e8400-e29b-41d4-a716-446655440000",
        id_equipo_proyecto: "550e8400-e29b-41d4-a716-446655440001",
        id_rol: "550e8400-e29b-41d4-a716-446655440002",
        porcentaje_dedicacion: 50,
        fecha_inicio: "2050-01-01",
        fecha_fin: "2050-01-10",
      });

    expect(res.status).toBe(201);
  });

  test("GET /api/equipo-consultor/:id", async () => {
    equipoConsultorRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoConsultor: "EC1",
    });

    const res = await request(app.server).get("/api/equipo-consultor/EC1");
    expect(res.status).toBe(200);
  });

  test("PUT /api/equipo-consultor/:id", async () => {
    equipoConsultorRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoConsultor: "EC1",
      idConsultor: "C1",
      porcentajeDedicacion: 50,
      fechaInicio: new Date("2050-01-01"),
      fechaFin: new Date("2050-01-10"),
      estado: "Activo",
    });

    equipoConsultorRepoInstance.actualizar.mockResolvedValue({
      idEquipoConsultor: "EC1",
      porcentajeDedicacion: 100,
    });

    const res = await request(app.server)
      .put("/api/equipo-consultor/EC1")
      .send({
        id_consultor: "550e8400-e29b-41d4-a716-446655440000",
        id_equipo_proyecto: "550e8400-e29b-41d4-a716-446655440001",
        id_rol: "550e8400-e29b-41d4-a716-446655440002",
        porcentaje_dedicacion: 100,
        fecha_inicio: "2050-01-01",
        fecha_fin: "2050-01-10",
      });

    expect(res.status).toBe(200);
  });

  test("DELETE /api/equipo-consultor/eliminar/:id", async () => {
    equipoConsultorRepoInstance.obtenerPorId.mockResolvedValue({
      idEquipoConsultor: "EC1",
      estado: "Activo",
    });

    equipoConsultorRepoInstance.eliminar.mockResolvedValue({
      idEquipoConsultor: "EC1",
      estado: "Eliminado",
    });

    const res = await request(app.server).delete("/api/equipo-consultor/eliminar/EC1");
    expect(res.status).toBe(200);
  });
});
