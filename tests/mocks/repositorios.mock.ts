import { jest } from "@jest/globals";

export const mockProyectoRepositorio = {
  crear: jest.fn(),
  obtenerTodos: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerPorCliente: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

export const mockClienteRepositorio = {
  buscarPorIdCliente: jest.fn(),
};

export const mockConsultorRepositorio = {
  obtenerConsultorPorId: jest.fn(),
};

export const mockRolRepositorio = {
  listarRoles: jest.fn(),
  crearRol: jest.fn(),
  obtenerRolPorId: jest.fn(),
  actualizarRol: jest.fn(),
  eliminarRol: jest.fn(),
};

export const mockEquipoProyectoRepositorio = {
  crear: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerPorProyecto: jest.fn(),
  obtenerTodos: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

export const mockEquipoConsultorRepositorio = {
  crear: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerPorEquipo: jest.fn(),
  obtenerPorConsultor: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
  rolExiste: jest.fn(),
};

export const mockAsignacionRepositorio = mockEquipoConsultorRepositorio; // alias para evitar errores
