import { jest } from '@jest/globals';
import { ProyectoCasosUso } from '../../../src/core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso';
import { AppError } from '../../../src/common/middlewares/AppError';

describe('ProyectoCasosUso', () => {
  let mockProyectoRepo: any;
  let mockClienteRepo: any;
  let mockEquipoRepo: any;
  let casosUso: ProyectoCasosUso;

  beforeEach(() => {
    mockProyectoRepo = {
      crear: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerPorCliente: jest.fn(),
      actualizar: jest.fn()
    };

    mockClienteRepo = {
      buscarPorIdCliente: jest.fn()
    };

    mockEquipoRepo = {
      obtenerPorProyecto: jest.fn(),
      eliminar: jest.fn()
    };

    casosUso = new ProyectoCasosUso(
      mockProyectoRepo,
      mockClienteRepo,
      mockEquipoRepo
    );
  });

  // --------------------------------------------------------
  // CREAR
  // --------------------------------------------------------
  test('Debe lanzar error si el cliente no existe', async () => {
    mockClienteRepo.buscarPorIdCliente.mockResolvedValue(null);

    const datos: any = {
      idCliente: 'abc',
      nombre: 'Proyecto X',
      descripcion: 'Test',
      fechaInicio: '2050-01-01',
      fechaEntrega: '2050-01-10'
    };

    await expect(casosUso.crear(datos))
      .rejects
      .toThrow('El cliente especificado no existe.');
  });

  test('Debe crear proyecto correctamente', async () => {
    mockClienteRepo.buscarPorIdCliente.mockResolvedValue({ idCliente: 'abc' });
    mockProyectoRepo.obtenerPorCliente.mockResolvedValue([]);
    mockProyectoRepo.crear.mockResolvedValue({ idProyecto: '1', nombre: 'Nuevo' });

    const datos: any = {
      idCliente: 'abc',
      nombre: 'Nuevo',
      descripcion: 'Desc',
      fechaInicio: '2050-01-01',
      fechaEntrega: '2050-01-10'
    };

    const resultado = await casosUso.crear(datos);

    expect(resultado).toEqual({ idProyecto: '1', nombre: 'Nuevo' });
  });

  // --------------------------------------------------------
  // OBTENER POR ID
  // --------------------------------------------------------
  test('Debe lanzar error si no existe el proyecto', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.obtenerPorId('123'))
      .rejects
      .toThrow('No se encontró el proyecto con ID 123');
  });

  test('Debe obtener un proyecto por ID', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue({
      idProyecto: '123',
      nombre: 'Test'
    });

    const result = await casosUso.obtenerPorId('123');

    expect(result).toEqual({ idProyecto: '123', nombre: 'Test' });
  });

  // --------------------------------------------------------
  // ACTUALIZAR
  // --------------------------------------------------------
  test('Debe lanzar error al actualizar si no existe', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.actualizar('1', {} as any))
      .rejects
      .toThrow('No se encontró el proyecto con ID 1');
  });

  test('Debe actualizar correctamente', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue({
      idProyecto: '1',
      fechaInicio: new Date('2050-01-01')
    });

    mockProyectoRepo.actualizar.mockResolvedValue({ idProyecto: '1', nombre: 'Actualizado' });

    const r = await casosUso.actualizar('1', {
      nombre: 'Actualizado'
    } as any);

    expect(r).toEqual({ idProyecto: '1', nombre: 'Actualizado' });
  });

  // --------------------------------------------------------
  // ELIMINAR
  // --------------------------------------------------------
  test('Debe lanzar error si el proyecto no existe al eliminar', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue(null);

    await expect(casosUso.eliminar('999'))
      .rejects
      .toThrow('No se encontró el proyecto con ID 999');
  });

  test('Debe eliminar marcando estado = Eliminado', async () => {
    mockProyectoRepo.obtenerPorId.mockResolvedValue({
      idProyecto: '1',
      estado: 'Activo'
    });

    mockEquipoRepo.obtenerPorProyecto.mockResolvedValue(null);
    mockProyectoRepo.actualizar.mockResolvedValue({});

    await casosUso.eliminar('1');

    expect(mockProyectoRepo.actualizar).toHaveBeenCalled();
  });
});
