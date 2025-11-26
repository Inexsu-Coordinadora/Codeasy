import { jest } from '@jest/globals';
import { RolCasosUso } from '../../../src/core/aplicacion/casos-uso/Rol/RolCasosUso';
import { AppError } from '../../../src/common/middlewares/AppError';

describe('RolCasosUso', () => {
  let mockRolRepo: any;
  let casosUso: RolCasosUso;

  beforeEach(() => {
    mockRolRepo = {
      listarRoles: jest.fn(),
      crearRol: jest.fn(),
      obtenerRolPorId: jest.fn(),
      actualizarRol: jest.fn(),
      eliminarRol: jest.fn()
    };

    casosUso = new RolCasosUso(mockRolRepo);
  });

  // --------------------------------------------------------
  // CREAR ROL
  // --------------------------------------------------------
  test('Debe lanzar error si ya existe rol activo con ese nombre', async () => {
    mockRolRepo.listarRoles.mockResolvedValue([
      { idRol: '1', nombreRol: 'Admin', estado: 'Activo' }
    ]);

    const datos = { nombreRol: 'Admin', descripcion: 'Test' };

    await expect(casosUso.crearRol(datos))
      .rejects
      .toThrow('Ya existe un rol activo con ese nombre.');
  });

  test('Debe crear un rol correctamente', async () => {
    mockRolRepo.listarRoles.mockResolvedValue([]);
    mockRolRepo.crearRol.mockResolvedValue({
      idRol: '1',
      nombreRol: 'Admin',
      estado: 'Activo'
    });

    const datos = { nombreRol: 'Admin', descripcion: 'Test' };

    const resultado = await casosUso.crearRol(datos);

    expect(resultado).toEqual({
      idRol: '1',
      nombreRol: 'Admin',
      estado: 'Activo'
    });
  });

  // --------------------------------------------------------
  // LISTAR ROLES
  // --------------------------------------------------------
  test('Debe listar roles', async () => {
    mockRolRepo.listarRoles.mockResolvedValue([{ idRol: '1', nombreRol: 'Admin' }]);

    const result = await casosUso.listarRoles();

    expect(result).toEqual([{ idRol: '1', nombreRol: 'Admin' }]);
  });

  // --------------------------------------------------------
  // OBTENER ROL POR ID
  // --------------------------------------------------------
  test('Debe lanzar error si el rol no existe', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue(null);

    await expect(casosUso.obtenerRolPorId('123'))
      .rejects
      .toThrow('No se encontró el rol con ID 123');
  });

  test('Debe obtener un rol correctamente', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue({
      idRol: '123',
      nombreRol: 'Admin',
      estado: 'Activo'
    });

    const r = await casosUso.obtenerRolPorId('123');

    expect(r).toEqual({
      idRol: '123',
      nombreRol: 'Admin',
      estado: 'Activo'
    });
  });

  // --------------------------------------------------------
  // ACTUALIZAR
  // --------------------------------------------------------
  test('Debe lanzar error si el rol a actualizar no existe', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue(null);

    await expect(
      casosUso.actualizarRol('1', { nombreRol: 'Nuevo' })
    ).rejects.toThrow('No se encontró el rol con ID 1');
  });

  test('Debe lanzar error si el nuevo nombre ya existe en otro rol activo', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue({
      idRol: '1',
      nombreRol: 'Admin',
      estado: 'Activo'
    });

    mockRolRepo.listarRoles.mockResolvedValue([
      { idRol: '2', nombreRol: 'Admin', estado: 'Activo' }
    ]);

    await expect(
      casosUso.actualizarRol('1', { nombreRol: 'Admin' })
    ).rejects.toThrow('Ya existe otro rol activo con ese nombre.');
  });

  test('Debe actualizar correctamente', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue({
      idRol: '1',
      nombreRol: 'Admin',
      estado: 'Activo'
    });

    mockRolRepo.listarRoles.mockResolvedValue([]);
    mockRolRepo.actualizarRol.mockResolvedValue({
      idRol: '1',
      nombreRol: 'Nuevo',
      estado: 'Activo'
    });

    const r = await casosUso.actualizarRol('1', { nombreRol: 'Nuevo' });

    expect(r).toEqual({
      idRol: '1',
      nombreRol: 'Nuevo',
      estado: 'Activo'
    });
  });

  // --------------------------------------------------------
  // ELIMINAR
  // --------------------------------------------------------
  test('Debe lanzar error si el rol no existe al eliminar', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue(null);

    await expect(casosUso.eliminarRol('999'))
      .rejects
      .toThrow('No se encontró el rol con ID 999');
  });

  test('Debe eliminar un rol correctamente', async () => {
    mockRolRepo.obtenerRolPorId.mockResolvedValue({
      idRol: '1',
      nombreRol: 'Admin',
      estado: 'Activo'
    });

    mockRolRepo.eliminarRol.mockResolvedValue({
      idRol: '1',
      nombreRol: 'Admin',
      estado: 'Eliminado'
    });

    const r = await casosUso.eliminarRol('1');

    expect(r.estado).toBe('Eliminado');
    expect(mockRolRepo.eliminarRol).toHaveBeenCalledWith('1');
  });
});
