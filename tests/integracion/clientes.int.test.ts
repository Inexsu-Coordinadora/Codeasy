import { jest } from '@jest/globals';
import { ICliente } from "../../src/core/dominio/cliente/ICliente";

let ClienteRepositorio: any;
let mockClienteRepositorio: any;

describe("Pruebas de integración - API Clientes", () => {
    let app: any;
    let request: any;

    beforeAll(async () => {
        mockClienteRepositorio = {
            registrarCliente: jest.fn().mockImplementation(async (cliente: ICliente) => ({
                idCliente: "mock-uuid-123",
                ...cliente,
            })),
            obtenerClientes: jest.fn().mockResolvedValue([
                {
                    idCliente: "mock-1",
                    nombre: "Empresa ABC",
                    identificacion: "123456789",
                    email: "abc@mail.com",
                    telefono: "3001234567",
                    estado: "Activo",
                },
                {
                    idCliente: "mock-2",
                    nombre: "Empresa XYZ",
                    identificacion: "987654321",
                    email: "xyz@mail.com",
                    telefono: "3009876543",
                    estado: "Activo",
                },
            ]),
            buscarPorIdCliente: jest.fn().mockImplementation(async (id: string): Promise<ICliente | null> => {
                if (id === "mock-1") {
                    return {
                        idCliente: "mock-1",
                        nombre: "Empresa ABC",
                        identificacion: "123456789",
                        email: "abc@mail.com",
                        telefono: "3001234567",
                        estado: "Activo",
                    };
                }
                return null;
            }),
            buscarPorIdentificacionCliente: jest.fn().mockResolvedValue(null),
            actualizarCliente: jest.fn().mockImplementation(async (id: string, datos: Partial<ICliente>): Promise<ICliente | null> => {
                if (id === "mock-1") {
                    return {
                        idCliente: "mock-1",
                        nombre: datos.nombre ?? "Empresa ABC",
                        identificacion: "123456789",
                        email: datos.email ?? "abc@mail.com",
                        telefono: datos.telefono ?? "3001234567",
                        estado: "Activo",
                    };
                }
                return null;
            }),
            eliminarCliente: jest.fn().mockResolvedValue(undefined),
        };

        await jest.unstable_mockModule("../../src/core/infraestructura/postgres/ClienteRepositorio.js", () => ({
            ClienteRepositorio: jest.fn(() => mockClienteRepositorio)
        }));

        const appModule = await import("../../src/presentacion/app.js");
        app = appModule.app;
        request = (await import("supertest")).default;

        await app.ready();
    });

    afterAll(async () => {
        if (app) await app.close();
    });

    describe("GET /api/cliente", () => {
        test("debería retornar lista de clientes", async () => {
            const response = await request(app.server).get("/api/cliente");

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.mensaje).toBe("Clientes obtenidos correctamente");
            expect(response.body.data).toHaveLength(2);
        });
    });

    describe("GET /api/cliente/:idCliente", () => {
        test("debería retornar cliente cuando existe", async () => {
            const response = await request(app.server).get("/api/cliente/mock-1");

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data.idCliente).toBe("mock-1");
            expect(response.body.data.nombre).toBe("Empresa ABC");
        });

        test("debería retornar null cuando el cliente no existe", async () => {
            const response = await request(app.server).get("/api/cliente/999");

            expect(response.status).toBe(200);
            expect(response.body.data).toBeNull();
        });
    });

    describe("PUT /api/cliente/:idCliente", () => {
        test("debería actualizar un cliente exitosamente", async () => {
            const datosActualizados = {
                nombre: "Empresa ABC Actualizada",
                telefono: "3222222222",
            };

            const response = await request(app.server)
                .put("/api/cliente/mock-1")
                .send(datosActualizados);

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data.nombre).toBe("Empresa ABC Actualizada");
            expect(response.body.data.telefono).toBe("3222222222");
        });

        test("debería actualizar solo el email del cliente", async () => {
            const datosActualizados = {
                email: "nuevo@mail.com",
            };

            const response = await request(app.server)
                .put("/api/cliente/mock-1")
                .send(datosActualizados);

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe("nuevo@mail.com");
            expect(response.body.data.nombre).toBe("Empresa ABC");
        });
    });

    describe("DELETE /api/cliente/eliminar/:idCliente", () => {
        test("debería eliminar un cliente exitosamente", async () => {
            const response = await request(app.server).delete(
                "/api/cliente/eliminar/mock-1"
            );

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.mensaje).toBe("Cliente eliminado correctamente");
        });
    });
});
