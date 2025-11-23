import { jest } from "@jest/globals";

let ProyectoRepositorio: any;
let ClienteRepositorio: any;
let EquipoProyectoRepositorio: any;

let proyectoRepoInstance: any;
let clienteRepoInstance: any;
let equipoProyectoRepoInstance: any;

describe("Integración - Proyectos", () => {
  let app: any;
  let request: any;

  // Initialize mocks immediately so they are available for the factory
  proyectoRepoInstance = {
    crear: jest.fn(),
    obtenerPorCliente: jest.fn(),
    obtenerPorId: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(), // Added missing method
  };

  clienteRepoInstance = {
    buscarPorIdCliente: jest.fn(),
  };

  equipoProyectoRepoInstance = {
    obtenerPorProyecto: jest.fn(),
  };

  beforeAll(async () => {
    // 🔥 mockeo dinámico ESM dentro del entorno Jest
    ({ ProyectoRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/ProyectoRepositorio.js",
      () => ({
        ProyectoRepositorio: jest.fn(() => proyectoRepoInstance)
      })
    ));

    ({ ClienteRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/ClienteRepositorio.js",
      () => ({
        ClienteRepositorio: jest.fn(() => clienteRepoInstance)
      })
    ));

    ({ EquipoProyectoRepositorio } = await jest.unstable_mockModule(
      "../../../src/core/infraestructura/postgres/EquipoProyectoRepositorio.js",
      () => ({
        EquipoProyectoRepositorio: jest.fn(() => equipoProyectoRepoInstance)
      })
    ));

    // Import app and supertest dynamically AFTER mocks
    const appModule = await import("../../../src/presentacion/app.js");
    app = appModule.app;
    request = (await import("supertest")).default;

    await app.ready();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  // -----------------------------------------
  // POST
  // -----------------------------------------
  test("POST /api/proyecto → crear proyecto", async () => {
    clienteRepoInstance.buscarPorIdCliente.mockResolvedValue({
      idCliente: "11111111-1111-1111-1111-111111111111",
      estado: "Activo",
    });

    proyectoRepoInstance.obtenerPorCliente.mockResolvedValue([]);

    proyectoRepoInstance.crear.mockResolvedValue({
      idProyecto: "P1",
      nombre: "Proyecto Test",
      descripcion: "Desc",
      fechaInicio: "2050-01-01",
      fechaEntrega: "2050-01-10",
      estadoProyecto: "Creado",
      estado: "Activo",
    });

    const res = await request(app.server)
      .post("/api/proyecto")
      .send({
        nombre: "Proyecto Test",
        descripcion: "Desc válida aquí",
        id_cliente: "550e8400-e29b-41d4-a716-446655440000",
        fecha_inicio: "2050-01-01",
        fecha_entrega: "2050-01-10",
      });

    expect(res.status).toBe(201);
    expect(proyectoRepoInstance.crear).toHaveBeenCalled();
  });

  // -----------------------------------------
  // GET
  // -----------------------------------------
  test("GET /api/proyecto/:id → obtener", async () => {
    proyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idProyecto: "P1",
      nombre: "Proyecto Test",
      estado: "Activo",
    });

    const res = await request(app.server).get("/api/proyecto/P1");

    expect(res.status).toBe(200);
    expect(proyectoRepoInstance.obtenerPorId).toHaveBeenCalled();
  });

  // -----------------------------------------
  // PUT
  // -----------------------------------------
  test("PUT /api/proyecto/:id → actualizar", async () => {
    proyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idProyecto: "P1",
      descripcion: "Desc",
      fechaInicio: "2050-01-01",
      fechaEntrega: "2050-01-10",
    });

    proyectoRepoInstance.actualizar.mockResolvedValue({
      idProyecto: "P1",
      nombre: "Nuevo",
      descripcion: "Actualizado",
    });

    const res = await request(app.server)
      .put("/api/proyecto/P1")
      .send({
        nombre: "Nuevo",
        descripcion: "Actualizado",
        fecha_inicio: "2050-01-01",
        fecha_entrega: "2050-01-15",
      });

    expect(res.status).toBe(200);
    expect(proyectoRepoInstance.actualizar).toHaveBeenCalled();
  });

  // -----------------------------------------
  // DELETE
  // -----------------------------------------
  test("DELETE /api/proyecto/eliminar/:id", async () => {
    proyectoRepoInstance.obtenerPorId.mockResolvedValue({
      idProyecto: "P1",
      estado: "Activo",
    });

    proyectoRepoInstance.actualizar.mockResolvedValue({
      idProyecto: "P1",
      estado: "Eliminado",
    });

    const res = await request(app.server).delete("/api/proyecto/eliminar/P1");

    expect(res.status).toBe(200);
    expect(proyectoRepoInstance.actualizar).toHaveBeenCalled();
  });
});
