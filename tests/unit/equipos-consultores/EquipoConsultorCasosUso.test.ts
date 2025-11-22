import { jest } from "@jest/globals";
import { EquipoConsultorCasosUso } from "../../../src/core/aplicacion/casos-uso/Equipo-Consultor/EquipoConsultorCasosUso";
import { AppError } from "../../../src/common/middlewares/AppError";

describe("EquipoConsultorCasosUso", () => {
  let mockAsignacionRepo: any;
  let mockConsultorRepo: any;
  let mockEquipoProyectoRepo: any;
  let casosUso: EquipoConsultorCasosUso;

  beforeEach(() => {
    mockAsignacionRepo = {
      crear: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerPorEquipo: jest.fn(),
      obtenerPorConsultor: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      rolExiste: jest.fn()
    };

    mockConsultorRepo = {
      obtenerConsultorPorId: jest.fn()
    };

    mockEquipoProyectoRepo = {
      obtenerPorId: jest.fn()
    };

    casosUso = new EquipoConsultorCasosUso(
      mockAsignacionRepo,
      mockConsultorRepo,
      mockEquipoProyectoRepo
    );
  });

  // -----------------------------------------------------------
  // CREAR
  // -----------------------------------------------------------
  test("Debe lanzar error si el consultor no existe", async () => {
    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue(null);

    const datos: any = {
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      idRol: "R1",
      porcentajeDedicacion: 50,
      fechaInicio: "2050-01-01",
      fechaFin: "2050-01-10"
    };

    await expect(casosUso.crear(datos)).rejects.toThrow(
      "El consultor especificado no existe."
    );
  });

  test("Debe lanzar error si el equipo del proyecto no existe", async () => {
    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue({ idConsultor: "C1" });
    mockEquipoProyectoRepo.obtenerPorId.mockResolvedValue(null);

    const datos: any = {
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      idRol: "R1",
      porcentajeDedicacion: 50,
      fechaInicio: "2050-01-01",
      fechaFin: "2050-01-10"
    };

    await expect(casosUso.crear(datos)).rejects.toThrow(
      "El equipo del proyecto no existe."
    );
  });

  test("Debe lanzar error si el rol no existe", async () => {
    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue({});
    mockEquipoProyectoRepo.obtenerPorId.mockResolvedValue({});
    mockAsignacionRepo.rolExiste.mockResolvedValue(false);

    const datos: any = {
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      idRol: "R1",
      porcentajeDedicacion: 50,
      fechaInicio: "2050-01-01",
      fechaFin: "2050-01-10"
    };

    await expect(casosUso.crear(datos)).rejects.toThrow(
      "El rol especificado no existe o está inactivo."
    );
  });

  test("Debe crear una asignación correctamente", async () => {
    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue({
      idConsultor: "C1"
    });

    mockEquipoProyectoRepo.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: "P1"
    });

    mockAsignacionRepo.rolExiste.mockResolvedValue(true);
    mockAsignacionRepo.obtenerPorEquipo.mockResolvedValue([]);
    mockAsignacionRepo.obtenerPorConsultor.mockResolvedValue([]);

    mockAsignacionRepo.crear.mockResolvedValue({
      idEquipoConsultor: "A1",
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      idRol: "R1"
    });

    const datos: any = {
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      idRol: "R1",
      porcentajeDedicacion: 50,
      fechaInicio: "2050-01-01",
      fechaFin: "2050-01-10"
    };

    const r = await casosUso.crear(datos);

    expect(r.idEquipoConsultor).toBe("A1");
  });

  // -----------------------------------------------------------
  // OBTENER POR ID
  // -----------------------------------------------------------
  test("Debe lanzar error si la asignación no existe", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.obtenerPorId("X1")).rejects.toThrow(
      "No se encontró la asignación con ID X1"
    );
  });

  test("Debe lanzar error si el consultor asociado está eliminado", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue({
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      estado: "Activo"
    });

    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue({ estado: "Eliminado" });

    await expect(casosUso.obtenerPorId("X1")).rejects.toThrow(
      "El consultor asociado ya no existe."
    );
  });

  test("Debe obtener asignación correctamente", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue({
      idEquipoConsultor: "X1",
      idConsultor: "C1",
      idEquipoProyecto: "P1",
      estado: "Activo"
    });

    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue({ estado: "Activo" });
    mockEquipoProyectoRepo.obtenerPorId.mockResolvedValue({ estado: "Activo" });

    const r = await casosUso.obtenerPorId("X1");

    expect(r.idEquipoConsultor).toBe("X1");
  });

  // -----------------------------------------------------------
  // OBTENER POR EQUIPO
  // -----------------------------------------------------------
  test("Debe lanzar error si el equipo no existe", async () => {
    mockEquipoProyectoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.obtenerPorEquipo("P1")).rejects.toThrow(
      "No se encontró el equipo con ID P1"
    );
  });

  test("Debe obtener asignaciones por equipo", async () => {
    mockEquipoProyectoRepo.obtenerPorId.mockResolvedValue({ estado: "Activo" });
    mockAsignacionRepo.obtenerPorEquipo.mockResolvedValue([{ idEquipoConsultor: "A1" }]);

    const r = await casosUso.obtenerPorEquipo("P1");

    expect(r.length).toBe(1);
  });

  // -----------------------------------------------------------
  // OBTENER POR CONSULTOR
  // -----------------------------------------------------------
  test("Debe lanzar error si el consultor no existe", async () => {
    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue(null);

    await expect(casosUso.obtenerPorConsultor("C1")).rejects.toThrow(
      "No se encontró el consultor con ID C1"
    );
  });

  test("Debe obtener asignaciones por consultor", async () => {
    mockConsultorRepo.obtenerConsultorPorId.mockResolvedValue({ estado: "Activo" });
    mockAsignacionRepo.obtenerPorConsultor.mockResolvedValue([{ idEquipoConsultor: "A1" }]);

    const r = await casosUso.obtenerPorConsultor("C1");

    expect(r.length).toBe(1);
  });

  // -----------------------------------------------------------
  // ACTUALIZAR
  // -----------------------------------------------------------
  test("Debe lanzar error si no existe la asignación al actualizar", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.actualizar("A1", {})).rejects.toThrow(
      "La asignación no existe."
    );
  });

  test("Debe actualizar correctamente", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue({
      idEquipoConsultores: "A1",
      idConsultor: "C1",
      porcentajeDedicacion: 30,
      fechaInicio: new Date("2050-01-01"),
      fechaFin: new Date("2050-01-10"),
      estado: "Activo"
    });

    mockAsignacionRepo.obtenerPorConsultor.mockResolvedValue([]);
    mockAsignacionRepo.actualizar.mockResolvedValue({
      idEquipoConsultores: "A1",
      porcentajeDedicacion: 60
    });

    const r = await casosUso.actualizar("A1", { porcentajeDedicacion: 60 });

    expect(r.porcentajeDedicacion).toBe(60);
  });

  // -----------------------------------------------------------
  // ELIMINAR
  // -----------------------------------------------------------
  test("Debe lanzar error si la asignación no existe al eliminar", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.eliminar("A1")).rejects.toThrow(
      "La asignación no existe."
    );
  });

  test("Debe eliminar asignación correctamente", async () => {
    mockAsignacionRepo.obtenerPorId.mockResolvedValue({
      idEquipoConsultor: "A1",
      estado: "Activo"
    });

    mockAsignacionRepo.eliminar.mockResolvedValue({
      idEquipoConsultor: "A1",
      estado: "Eliminado"
    });

    const r = await casosUso.eliminar("A1");

    expect(r.estado).toBe("Eliminado");
  });
});
