// tests/unit/consultores/consultorCasosUso.test.ts

import { ConsultorCasosUso } from "../../../src/core/aplicacion/casos-uso/Consultor/ConsultorCasosUso";
import { consultorEstado } from "../../../src/core/dominio/consultor/ConsultorEstado";
import { ConsultorValidador } from "../../../src/core/aplicacion/casos-uso/Consultor/validadores/ConsultorValidador";
import { IConsultorRepositorio } from "../../../src/core/dominio/consultor/repositorio/IConsultorRepositorio";
import { IConsultor } from "../../../src/core/dominio/consultor/IConsultor";

// Evita ejecutar validadores reales
jest.mock("../../../src/core/aplicacion/casos-uso/Consultor/validadores/ConsultorValidador");

describe("ConsultorCasosUso - Pruebas unitarias", () => {
  let repoMock: jest.Mocked<IConsultorRepositorio>;
  let casosUso: ConsultorCasosUso;

  beforeEach(() => {
    repoMock = {
      buscarPorCorreoOIdentificacion: jest.fn(),
      registrarConsultor: jest.fn(),
      listarTodosConsultores: jest.fn(),
      obtenerConsultorPorId: jest.fn(),
      actualizarConsultor: jest.fn(),
      eliminarConsultor: jest.fn(),
    };

    casosUso = new ConsultorCasosUso(repoMock);

    jest.clearAllMocks();

    (ConsultorValidador.validarDuplicado as jest.Mock).mockImplementation(() => {});
    (ConsultorValidador.validarExistencia as jest.Mock).mockImplementation(() => {});
    (ConsultorValidador.validarNoEliminado as jest.Mock).mockImplementation(() => {});
  });

  // -------------------------------------------------------
  // 1. Registrar consultor - ÉXITO
  // -------------------------------------------------------
  test("Registrar consultor - éxito", async () => {
    const datos = {
      nombre: "Dina",
      correo: "dina@example.com",
      identificacion: "123",
    };

    repoMock.buscarPorCorreoOIdentificacion.mockResolvedValue(null);

    const consultorCreado: IConsultor = {
      idConsultor: "uuid-123",
      ...datos,
      estado: consultorEstado.ACTIVO,
    };

    repoMock.registrarConsultor.mockResolvedValue(consultorCreado);

    const resultado = await casosUso.registrarConsultor(datos);

    expect(repoMock.buscarPorCorreoOIdentificacion).toHaveBeenCalled();
    expect(repoMock.registrarConsultor).toHaveBeenCalled();
    expect(resultado).toEqual(consultorCreado);
  });

  test("Registrar consultor - error por duplicado", async () => {
    const datos = {
      nombre: "Dina",
      correo: "dina@example.com",
      identificacion: "123",
    };

    repoMock.buscarPorCorreoOIdentificacion.mockResolvedValue({ id: "existe" } as any);

    (ConsultorValidador.validarDuplicado as jest.Mock).mockImplementation(() => {
      throw new Error("Consultor ya existe");
    });

    await expect(casosUso.registrarConsultor(datos)).rejects.toThrow("Consultor ya existe");
  });


  test("Obtener consultor - éxito", async () => {
    const consultor = {
      idConsultor: "123",
      nombre: "Juan",
      estado: consultorEstado.ACTIVO,
      identificacion: "1233",
      correo: "dina@gmail.com"
    };

    repoMock.obtenerConsultorPorId.mockResolvedValue(consultor);

    const resultado = await casosUso.obtenerConsultorPorId("123");

    expect(resultado).toEqual(consultor);
  });


  test("Obtener consultor - error si no existe", async () => {
    repoMock.obtenerConsultorPorId.mockResolvedValue(null);

    (ConsultorValidador.validarExistencia as jest.Mock).mockImplementation(() => {
      throw new Error("Consultor no encontrado");
    });

    await expect(casosUso.obtenerConsultorPorId("noexiste")).rejects.toThrow("Consultor no encontrado");
  });


  test("Actualizar consultor - éxito", async () => {
    const existente = {
      idConsultor: "1",
      nombre: "Pepe",
      correo: "old@mail.com",
      estado: consultorEstado.ACTIVO,
       identificacion: "1233"

    };

    const datosActualizados = {
      nombre: "Pepe Actualizado",
    };

    repoMock.obtenerConsultorPorId.mockResolvedValue(existente);

    const actualizado = { ...existente, ...datosActualizados };

    repoMock.actualizarConsultor.mockResolvedValue(actualizado as IConsultor);

    const resultado = await casosUso.actualizarConsultor("1", datosActualizados);

    expect(resultado).toEqual(actualizado);
  });


  test("Actualizar consultor - error si no existe", async () => {
    repoMock.obtenerConsultorPorId.mockResolvedValue(null);

    (ConsultorValidador.validarExistencia as jest.Mock).mockImplementation(() => {
      throw new Error("Consultor no encontrado");
    });

    await expect(
      casosUso.actualizarConsultor("noexiste", { nombre: "Nuevo" })
    ).rejects.toThrow("Consultor no encontrado");
  });


  test("Eliminar consultor - éxito", async () => {
    const consultor = {
      idConsultor: "1",
      estado: consultorEstado.ACTIVO,
      nombre: "Pepe",
      identificacion: "1233",
      correo: "old@mail.com"
    };

    repoMock.obtenerConsultorPorId.mockResolvedValue(consultor);

    const eliminado = { ...consultor, estado: consultorEstado.ELIMINADO };

    repoMock.actualizarConsultor.mockResolvedValue(eliminado as IConsultor);

    await casosUso.eliminarConsultor("1");

    expect(repoMock.actualizarConsultor).toHaveBeenCalled();
  });


test("Eliminar consultor - error si ya está eliminado", async () => {
  repoMock.obtenerConsultorPorId.mockResolvedValue({
    idConsultor: "1",
    estado: "Eliminado",
  } as unknown as IConsultor);

  (ConsultorValidador.validarNoEliminado as jest.Mock).mockImplementation(() => {
    throw new Error("El consultor ya está eliminado");
  });

  await expect(casosUso.eliminarConsultor("1")).rejects.toThrow(
    "El consultor ya está eliminado"
  );
});

  test("Eliminar consultor - error si no existe", async () => {
    repoMock.obtenerConsultorPorId.mockResolvedValue(null);

    (ConsultorValidador.validarExistencia as jest.Mock).mockImplementation(() => {
      throw new Error("Consultor no encontrado");
    });

    await expect(casosUso.eliminarConsultor("999")).rejects.toThrow("Consultor no encontrado");
  });
});
