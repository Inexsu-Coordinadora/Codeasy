import { jest } from '@jest/globals';
import { EquipoProyectoCasosUso } from '../../../src/core/aplicacion/casos-uso/Equipo-Proyecto/EquipoProyectoCasosUso';
import { AppError } from '../../../src/common/middlewares/AppError';

describe('EquipoProyectoCasosUso', () => {
  let mockEquipoRepo: any;
  let mockProyectoRepo: any;
  let mockEquipoConsultorRepo: any;
  let casosUso: EquipoProyectoCasosUso;

  beforeEach(() => {
    mockEquipoRepo = {
      crear: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerPorProyecto: jest.fn(),
      obtenerTodos: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn()
    };

    mockProyectoRepo = {
      obtenerPorId: jest.fn(),
      actualizar: jest.fn()
    };

    mockEquipoConsultorRepo = {
      eliminarPorEquipo: jest.fn()
    };

    casosUso = new EquipoProyectoCasosUso(
      mockEquipoRepo,
      mockProyectoRepo,
      mockEquipoConsultorRepo
    );
  });

  // --------------------------------------------------------
  // CREAR
  // --------------------------------------------------------
  test('Debe lanzar error si el proyecto no existe', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue(null);

    const datos: any = {
      idProyecto: '1',
      nombre: 'Equipo X',
      fechaInicio: '2050-01-01',
      fechaFin: '2050-01-10'
    };

    await expect(casosUso.crear(datos))
      .rejects
      .toThrow('El proyecto especificado no existe.');
  });

  test('Debe lanzar error si el proyecto ya tiene equipo', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue({ idProyecto: '1' });
    mockEquipoRepo.obtenerPorProyecto.mockResolvedValue({ idEquipoProyecto: 'E1' });

    const datos: any = {
      idProyecto: '1',
      nombre: 'Equipo X',
      fechaInicio: '2050-01-01',
      fechaFin: '2050-01-10'
    };

    await expect(casosUso.crear(datos))
      .rejects
      .toThrow('Este proyecto ya tiene un equipo creado.');
  });

  test('Debe crear un equipo correctamente', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue({
      idProyecto: '1',
      estadoProyecto: 'Creado'
    });

    mockEquipoRepo.obtenerPorProyecto.mockResolvedValue(null);
    mockEquipoRepo.crear.mockResolvedValue({
      idEquipoProyecto: 'E1',
      nombre: 'Equipo X'
    });

    const datos: any = {
      idProyecto: '1',
      nombre: 'Equipo X',
      fechaInicio: '2050-01-01',
      fechaFin: '2050-01-10'
    };

    const r = await casosUso.crear(datos);

    expect(r).toEqual({
      idEquipoProyecto: 'E1',
      nombre: 'Equipo X'
    });

    expect(mockProyectoRepo.actualizar).toHaveBeenCalled();
  });

  // --------------------------------------------------------
  // OBTENER POR ID
  // --------------------------------------------------------
  test('Debe lanzar error si el equipo no existe por ID', async () => {
    mockEquipoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.obtenerPorId('123'))
      .rejects
      .toThrow('No se encontró el equipo con ID 123');
  });

  test('Debe obtener equipo por ID', async () => {
    mockEquipoRepo.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: '123',
      nombre: 'Team'
    });

    const r = await casosUso.obtenerPorId('123');

    expect(r).toEqual({
      idEquipoProyecto: '123',
      nombre: 'Team'
    });
  });

  // --------------------------------------------------------
  // OBTENER POR PROYECTO
  // --------------------------------------------------------
  test('Debe lanzar error si no hay equipo en el proyecto', async () => {
    mockEquipoRepo.obtenerPorProyecto.mockResolvedValue(null);

    await expect(casosUso.obtenerPorProyecto('55'))
      .rejects
      .toThrow('El proyecto no tiene un equipo creado.');
  });

  test('Debe obtener equipo por proyecto', async () => {
    mockEquipoRepo.obtenerPorProyecto.mockResolvedValue({
      idEquipoProyecto: '2',
      nombre: 'Team'
    });

    const r = await casosUso.obtenerPorProyecto('55');

    expect(r).toEqual({
      idEquipoProyecto: '2',
      nombre: 'Team'
    });
  });

  // --------------------------------------------------------
  // OBTENER TODOS
  // --------------------------------------------------------
  test('Debe obtener todos los equipos', async () => {
    mockEquipoRepo.obtenerTodos.mockResolvedValue([
      { idEquipoProyecto: '1' },
      { idEquipoProyecto: '2' }
    ]);

    const r = await casosUso.obtenerTodos();

    expect(r.length).toBe(2);
  });

  // --------------------------------------------------------
  // ACTUALIZAR
  // --------------------------------------------------------
  test('Debe lanzar error si el equipo no existe al actualizar', async () => {
    mockEquipoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.actualizar('1', {}))
      .rejects
      .toThrow('No se encontró el equipo con ID 1');
  });

  test('Debe actualizar correctamente', async () => {
    mockEquipoRepo.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: '1',
      fechaInicio: new Date('2050-01-01'),
      estado: 'Activo'
    });

    mockEquipoRepo.actualizar.mockResolvedValue({
      idEquipoProyecto: '1',
      nombre: 'Nuevo nombre'
    });

    const r = await casosUso.actualizar('1', { nombre: 'Nuevo nombre' });

    expect(r).toEqual({
      idEquipoProyecto: '1',
      nombre: 'Nuevo nombre'
    });
  });

  // --------------------------------------------------------
  // ELIMINAR
  // --------------------------------------------------------
  test('Debe lanzar error si el equipo no existe al eliminar', async () => {
    mockEquipoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.eliminar('999'))
      .rejects
      .toThrow('No se encontró el equipo con ID 999');
  });

  test('Debe eliminar correctamente', async () => {
    mockEquipoRepo.obtenerPorId.mockResolvedValue({
      idEquipoProyecto: '888',
      estado: 'Activo'
    });

    mockEquipoConsultorRepo.eliminarPorEquipo.mockResolvedValue({});
    mockEquipoRepo.eliminar.mockResolvedValue({
      idEquipoProyecto: '888',
      estado: 'Eliminado'
    });

    const r = await casosUso.eliminar('888');

    expect(mockEquipoConsultorRepo.eliminarPorEquipo).toHaveBeenCalledWith('888');
    expect(r.estado).toBe('Eliminado');
  });
});
