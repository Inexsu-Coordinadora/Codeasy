import { jest } from '@jest/globals';

let ProyectoRepositorio: any;
let ClienteRepositorio: any;
let mockProyectoRepositorio: any;
let mockClienteRepositorio: any;

describe("Pruebas de integración - API Proyectos por Cliente", () => {
    let app: any;
    let request: any;

    beforeAll(async () => {
        mockProyectoRepositorio = {
            obtenerPorCliente: jest.fn(),
            crear: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            listarTodos: jest.fn(),
        };

        mockClienteRepositorio = {
            buscarPorIdCliente: jest.fn(),
            registrarCliente: jest.fn(),
            obtenerClientes: jest.fn(),
            buscarPorIdentificacionCliente: jest.fn(),
            actualizarCliente: jest.fn(),
            eliminarCliente: jest.fn(),
        };

        await jest.unstable_mockModule("../../src/core/infraestructura/postgres/ProyectoRepositorio.js", () => ({
            ProyectoRepositorio: jest.fn(() => mockProyectoRepositorio)
        }));

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
            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(clienteMock);
            mockProyectoRepositorio.obtenerPorCliente.mockResolvedValue(proyectosMock);

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                exito: true,
                mensaje: "Proyectos del cliente obtenidos correctamente",
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

            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(clienteMock);
            mockProyectoRepositorio.obtenerPorCliente.mockResolvedValue(proyectosFiltrados);

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

            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(clienteMock);
            mockProyectoRepositorio.obtenerPorCliente.mockResolvedValue(proyectosFiltrados);

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

            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(clienteMock);
            mockProyectoRepositorio.obtenerPorCliente.mockResolvedValue([]);

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(200);
            expect(response.body.exito).toBe(true);
            expect(response.body.data).toEqual([]);
            expect(response.body.mensaje).toBeDefined();
            expect(response.body.mensaje).toContain("Proyectos del cliente obtenidos correctamente");
        });

        test("debería retornar 404 cuando el cliente no existe", async () => {
            const idCliente = "550e8400-e29b-41d4-a716-446655440099";

            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(null);

            const response = await request(app.server).get(
                `/api/clientes/${idCliente}/proyectos`
            );

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error.mensaje).toContain("cliente");
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

            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(clienteMock);
            mockProyectoRepositorio.obtenerPorCliente.mockResolvedValue(proyectosFiltrados);

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

            mockClienteRepositorio.buscarPorIdCliente.mockResolvedValue(clienteMock);
            mockProyectoRepositorio.obtenerPorCliente.mockResolvedValue(proyectosConConsultores);

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
