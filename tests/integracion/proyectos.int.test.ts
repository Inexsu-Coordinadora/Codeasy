import request from "supertest";
import { app } from "../../src/presentacion/app";
import { ProyectoRepositorio } from "../../src/core/infraestructura/postgres/ProyectoRepositorio";
import { ClienteRepositorio } from "../../src/core/infraestructura/postgres/ClienteRepositorio";

// Mock de los repositorios
jest.mock("../../src/core/infraestructura/postgres/ProyectoRepositorio");
jest.mock("../../src/core/infraestructura/postgres/ClienteRepositorio");

describe("Pruebas de integración - API Proyectos por Cliente", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/clientes/:idCliente/proyectos", () => {
        test("debería retornar proyectos del cliente cuando existe y tiene proyectos", async () => {
            const idCliente = "cliente-123";

            // Mock del cliente
            const clienteMock = {
                idCliente: "cliente-123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            // Mock de proyectos
            const proyectosMock = [
                {
                    id_proyecto: 1,
                    nombre: "Proyecto Alpha",
                    estado_proyecto: "En proceso",
                    fecha_inicio: "2025-01-01",
                    fecha_entrega: "2025-06-01",
                    consultores: [
                        { consultor: "Juan Pérez", rol: "Desarrollador" },
                        { consultor: "María García", rol: "Diseñadora" },
                    ],
                },
                {
                    id_proyecto: 2,
                    nombre: "Proyecto Beta",
                    estado_proyecto: "Creado",
                    fecha_inicio: "2025-02-01",
                    fecha_entrega: "2025-08-01",
                    consultores: [
                        { consultor: "Carlos López", rol: "Líder Técnico" },
                    ],
                },
            ];

            // Configurar mocks
            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                clienteMock
            );
            (ProyectoRepositorio.prototype.obtenerPorCliente as jest.Mock).mockResolvedValue(
                proyectosMock
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                exito: true,
                mensaje: undefined,
                data: proyectosMock,
            });
            expect(response.body.data).toHaveLength(2);
        });

        test("debería retornar proyectos filtrados por estado", async () => {
            const idCliente = "cliente-123";

            const clienteMock = {
                idCliente: "cliente-123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            const proyectosFiltrados = [
                {
                    id_proyecto: 1,
                    nombre: "Proyecto Alpha",
                    estado_proyecto: "En proceso",
                    fecha_inicio: "2025-01-01",
                    fecha_entrega: "2025-06-01",
                    consultores: [],
                },
            ];

            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                clienteMock
            );
            (ProyectoRepositorio.prototype.obtenerPorCliente as jest.Mock).mockResolvedValue(
                proyectosFiltrados
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos?estado=En proceso`
            );

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].estado_proyecto).toBe("En proceso");
        });

        test("debería retornar proyectos filtrados por fecha de inicio", async () => {
            const idCliente = "cliente-123";

            const clienteMock = {
                idCliente: "cliente-123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            const proyectosFiltrados = [
                {
                    id_proyecto: 1,
                    nombre: "Proyecto Alpha",
                    estado_proyecto: "En proceso",
                    fecha_inicio: "2025-01-01",
                    fecha_entrega: "2025-06-01",
                    consultores: [],
                },
            ];

            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                clienteMock
            );
            (ProyectoRepositorio.prototype.obtenerPorCliente as jest.Mock).mockResolvedValue(
                proyectosFiltrados
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos?fechaInicio=2025-01-01`
            );

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });

        test("debería retornar mensaje cuando el cliente no tiene proyectos", async () => {
            const idCliente = "cliente-sin-proyectos";

            const clienteMock = {
                idCliente: "cliente-sin-proyectos",
                nombre: "Empresa Sin Proyectos",
                identificacion: "987654321",
                email: "sinproyectos@mail.com",
                telefono: "3009876543",
                estado: "Activo",
            };

            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                clienteMock
            );
            (ProyectoRepositorio.prototype.obtenerPorCliente as jest.Mock).mockResolvedValue(
                []
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data).toEqual([]);
            expect(response.body.mensaje).toBeDefined();
            expect(response.body.mensaje).toContain(idCliente);
        });

        test("debería retornar 404 cuando el cliente no existe", async () => {
            const idCliente = "cliente-inexistente";

            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                null
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                statusCode: 404,
                error: "Not Found",
            });
            expect(response.body.message).toContain("Cliente");
        });

        test("debería retornar proyectos con múltiples filtros combinados", async () => {
            const idCliente = "cliente-123";

            const clienteMock = {
                idCliente: "cliente-123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            const proyectosFiltrados = [
                {
                    id_proyecto: 1,
                    nombre: "Proyecto Alpha",
                    estado_proyecto: "En proceso",
                    fecha_inicio: "2025-01-01",
                    fecha_entrega: "2025-06-01",
                    consultores: [],
                },
            ];

            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                clienteMock
            );
            (ProyectoRepositorio.prototype.obtenerPorCliente as jest.Mock).mockResolvedValue(
                proyectosFiltrados
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos?estado=En proceso&fechaInicio=2025-01-01`
            );

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });

        test("debería incluir información de consultores en los proyectos", async () => {
            const idCliente = "cliente-123";

            const clienteMock = {
                idCliente: "cliente-123",
                nombre: "Empresa ABC",
                identificacion: "123456789",
                email: "contacto@empresaabc.com",
                telefono: "3001234567",
                estado: "Activo",
            };

            const proyectosConConsultores = [
                {
                    id_proyecto: 1,
                    nombre: "Proyecto Alpha",
                    estado_proyecto: "En proceso",
                    fecha_inicio: "2025-01-01",
                    fecha_entrega: "2025-06-01",
                    consultores: [
                        { consultor: "Juan Pérez", rol: "Desarrollador" },
                        { consultor: "María García", rol: "Diseñadora" },
                    ],
                },
            ];

            (ClienteRepositorio.prototype.buscarPorIdCliente as jest.Mock).mockResolvedValue(
                clienteMock
            );
            (ProyectoRepositorio.prototype.obtenerPorCliente as jest.Mock).mockResolvedValue(
                proyectosConConsultores
            );

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(200);
            expect(response.body.data[0].consultores).toBeDefined();
            expect(response.body.data[0].consultores).toHaveLength(2);
            expect(response.body.data[0].consultores[0]).toHaveProperty("consultor");
            expect(response.body.data[0].consultores[0]).toHaveProperty("rol");
        });
    });
});
