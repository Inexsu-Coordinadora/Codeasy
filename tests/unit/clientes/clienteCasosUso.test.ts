import { jest } from '@jest/globals';
// tests/unit/clientes/clienteCasosUso.test.ts

import { ClienteCasosUso } from "../../../src/core/aplicacion/casos-uso/Cliente/ClienteCasosUso";
import { IClienteRepositorio } from "../../../src/core/dominio/cliente/repositorio/IClienteRepositorio";
import { ICliente } from "../../../src/core/dominio/cliente/ICliente";
import { AppError } from "../../../src/common/middlewares/AppError";

describe("ClienteCasosUso - Pruebas unitarias", () => {
    let repoMock: Partial<IClienteRepositorio> & {
        registrarCliente: jest.Mock;
        buscarPorIdentificacionCliente: jest.Mock;
        obtenerClientes: jest.Mock;
        buscarPorIdCliente: jest.Mock;
        actualizarCliente: jest.Mock;
        eliminarCliente: jest.Mock;
    };
    let casosUso: ClienteCasosUso;

    beforeEach(() => {
        repoMock = {
            registrarCliente: jest.fn(),
            buscarPorIdentificacionCliente: jest.fn(),
            obtenerClientes: jest.fn(),
            buscarPorIdCliente: jest.fn(),
            actualizarCliente: jest.fn(),
            eliminarCliente: jest.fn(),
        };

        casosUso = new ClienteCasosUso(repoMock as IClienteRepositorio);

        jest.clearAllMocks();
    });

    describe("registrarCliente", () => {
        test("debería registrar un cliente cuando no existe - éxito", async () => {
            const datosCliente: ICliente = {
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
            };

            repoMock.buscarPorIdentificacionCliente.mockResolvedValue(null);

            const clienteCreado: ICliente = {
                idCliente: "uuid-123",
                ...datosCliente,
                estado: "Activo",
            };

            repoMock.registrarCliente.mockResolvedValue(clienteCreado);

            const resultado = await casosUso.registrarCliente(datosCliente);

            expect(repoMock.buscarPorIdentificacionCliente).toHaveBeenCalledWith(
                datosCliente.identificacion,
                datosCliente.email
            );
            expect(repoMock.registrarCliente).toHaveBeenCalled();
            expect(resultado).toEqual(clienteCreado);
            expect(resultado.estado).toBe("Activo");
        });

        test("debería lanzar error si el cliente ya existe - duplicado por identificación", async () => {
            const datosCliente: ICliente = {
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
            };

            const clienteExistente: ICliente = {
                idCliente: "uuid-existe",
                nombre: "Empresa Existente",
                identificacion: "123456789",
                email: "otro@mail.com",
                telefono: "3009876543",
                estado: "Activo",
            };

            repoMock.buscarPorIdentificacionCliente.mockResolvedValue(clienteExistente);

            await expect(casosUso.registrarCliente(datosCliente)).rejects.toThrow(
                AppError
            );
            await expect(casosUso.registrarCliente(datosCliente)).rejects.toThrow(
                "Ya existe un cliente con ese correo o identificación"
            );

            expect(repoMock.registrarCliente).not.toHaveBeenCalled();
        });

        test("debería lanzar error si el cliente ya existe - duplicado por email", async () => {
            const datosCliente: ICliente = {
                nombre: "Empresa ABC",
                identificacion: "987654321",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
            };

            const clienteExistente: ICliente = {
                idCliente: "uuid-existe",
                nombre: "Empresa Existente",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3009876543",
                estado: "Activo",
            };

            repoMock.buscarPorIdentificacionCliente.mockResolvedValue(clienteExistente);

            await expect(casosUso.registrarCliente(datosCliente)).rejects.toThrow(
                "Ya existe un cliente con ese correo o identificación"
            );
        });
    });

    describe("listarTodosClientes", () => {
        test("debería retornar lista de clientes - éxito", async () => {
            const clientesMock: ICliente[] = [
                {
                    idCliente: "1",
                    nombre: "Empresa ABC",
                    identificacion: "123456789",
                    email: "abc@mail.com",
                    telefono: "3001234567",
                    estado: "Activo",
                },
                {
                    idCliente: "2",
                    nombre: "Empresa XYZ",
                    identificacion: "987654321",
                    email: "xyz@mail.com",
                    telefono: "3009876543",
                    estado: "Activo",
                },
            ];

            repoMock.obtenerClientes.mockResolvedValue(clientesMock);

            const resultado = await casosUso.listarTodosClientes();

            expect(repoMock.obtenerClientes).toHaveBeenCalled();
            expect(resultado).toEqual(clientesMock);
            expect(resultado).toHaveLength(2);
        });

        test("debería retornar lista vacía cuando no hay clientes", async () => {
            repoMock.obtenerClientes.mockResolvedValue([]);

            const resultado = await casosUso.listarTodosClientes();

            expect(resultado).toEqual([]);
            expect(resultado).toHaveLength(0);
        });
    });

    describe("buscarPorIdCliente", () => {
        test("debería retornar cliente cuando existe - éxito", async () => {
            const clienteMock: ICliente = {
                idCliente: "123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "abc@mail.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            repoMock.buscarPorIdCliente.mockResolvedValue(clienteMock);

            const resultado = await casosUso.buscarPorIdCliente("123");

            expect(repoMock.buscarPorIdCliente).toHaveBeenCalledWith("123");
            expect(resultado).toEqual(clienteMock);
        });

        test("debería retornar null cuando el cliente no existe", async () => {
            repoMock.buscarPorIdCliente.mockResolvedValue(null);

            const resultado = await casosUso.buscarPorIdCliente("999");

            expect(resultado).toBeNull();
        });
    });

    describe("obtenerClientePorIdentificacion", () => {
        test("debería retornar cliente cuando existe - éxito", async () => {
            const clienteMock: ICliente = {
                idCliente: "123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "abc@mail.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            repoMock.buscarPorIdentificacionCliente.mockResolvedValue(clienteMock);

            const resultado = await casosUso.obtenerClientePorIdentificacion("123456789");

            expect(repoMock.buscarPorIdentificacionCliente).toHaveBeenCalledWith(
                "123456789",
                ""
            );
            expect(resultado).toEqual(clienteMock);
        });

        test("debería retornar null cuando no existe cliente con esa identificación", async () => {
            repoMock.buscarPorIdentificacionCliente.mockResolvedValue(null);

            const resultado = await casosUso.obtenerClientePorIdentificacion("999999999");

            expect(resultado).toBeNull();
        });
    });

    describe("actualizarCliente", () => {
        test("debería actualizar cliente - éxito", async () => {
            const clienteExistente: ICliente = {
                idCliente: "1",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "abc@mail.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            const datosActualizados = {
                nombre: "Empresa ABC Actualizada",
                telefono: "3111111111",
            };

            const clienteActualizado: ICliente = {
                ...clienteExistente,
                ...datosActualizados,
            };

            repoMock.buscarPorIdCliente.mockResolvedValue(clienteExistente);
            repoMock.actualizarCliente.mockResolvedValue(clienteActualizado);

            const resultado = await casosUso.actualizarCliente("1", datosActualizados);

            expect(repoMock.buscarPorIdCliente).toHaveBeenCalledWith("1");
            expect(repoMock.actualizarCliente).toHaveBeenCalledWith(
                "1",
                expect.objectContaining({
                    nombre: "Empresa ABC Actualizada",
                    telefono: "3111111111",
                })
            );
            expect(resultado).toEqual(clienteActualizado);
            expect(resultado.nombre).toBe("Empresa ABC Actualizada");
        });

        test("debería lanzar error si la actualización falla", async () => {
            const clienteExistente: ICliente = {
                idCliente: "1",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "abc@mail.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            repoMock.buscarPorIdCliente.mockResolvedValue(clienteExistente);
            repoMock.actualizarCliente.mockResolvedValue(null);

            await expect(
                casosUso.actualizarCliente("1", { nombre: "Nuevo Nombre" })
            ).rejects.toThrow(AppError);
            await expect(
                casosUso.actualizarCliente("1", { nombre: "Nuevo Nombre" })
            ).rejects.toThrow("Error al guardar la actualización del cliente con ID 1");
        });

        test("debería actualizar solo los campos proporcionados", async () => {
            const clienteExistente: ICliente = {
                idCliente: "1",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "abc@mail.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            const datosActualizados = {
                email: "nuevo@mail.com",
            };

            const clienteActualizado: ICliente = {
                ...clienteExistente,
                email: "nuevo@mail.com",
            };

            repoMock.buscarPorIdCliente.mockResolvedValue(clienteExistente);
            repoMock.actualizarCliente.mockResolvedValue(clienteActualizado);

            const resultado = await casosUso.actualizarCliente("1", datosActualizados);

            expect(resultado.email).toBe("nuevo@mail.com");
            expect(resultado.nombre).toBe("Empresa ABC");
            expect(resultado.identificacion).toBe("123456789");
        });
    });

    describe("eliminarCliente", () => {
        test("debería eliminar cliente - éxito", async () => {
            const clienteExistente: ICliente = {
                idCliente: "1",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "abc@mail.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            repoMock.buscarPorIdCliente.mockResolvedValue(clienteExistente);
            repoMock.eliminarCliente.mockResolvedValue(undefined);

            await casosUso.eliminarCliente("1");

            expect(repoMock.buscarPorIdCliente).toHaveBeenCalledWith("1");
            expect(repoMock.eliminarCliente).toHaveBeenCalledWith("1");
        });

        test("debería lanzar error si el cliente no existe", async () => {
            repoMock.buscarPorIdCliente.mockResolvedValue(null);

            await expect(casosUso.eliminarCliente("999")).rejects.toThrow(AppError);
            await expect(casosUso.eliminarCliente("999")).rejects.toThrow(
                "No se encontró el cliente con ID 999 para eliminar"
            );

            expect(repoMock.eliminarCliente).not.toHaveBeenCalled();
        });
    });
});
