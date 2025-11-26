// tests/unit/proyectos/consultarProyectosPorClienteCasosUso.test.ts
import { jest } from '@jest/globals';
import { IProyectoRepositorio } from "../../../src/core/dominio/proyecto/repositorio/IProyectoRepositorio";
import { IClienteRepositorio } from "../../../src/core/dominio/cliente/repositorio/IClienteRepositorio";
import { Proyecto } from "../../../src/core/dominio/proyecto/Proyecto";
import { ICliente } from "../../../src/core/dominio/cliente/ICliente";
import { NoEncontradoError } from "../../../src/common/middlewares/AppError";

let ProyectoValidaciones: any;
let ConsultarProyectosPorClienteCasosUso: any;

describe("ConsultarProyectosPorClienteCasosUso - Pruebas unitarias", () => {
    let proyectoRepoMock: Partial<IProyectoRepositorio> & { obtenerPorCliente: jest.Mock };
    let clienteRepoMock: Partial<IClienteRepositorio> & { buscarPorIdCliente: jest.Mock };
    let casosUso: any;

    beforeAll(async () => {
        await jest.unstable_mockModule("../../../src/core/aplicacion/casos-uso/Proyecto/Validaciones/ProyectoValidaciones", () => ({
            ProyectoValidaciones: {
                validarClienteExiste: jest.fn(),
            }
        }));

        const validacionesModule = await import("../../../src/core/aplicacion/casos-uso/Proyecto/Validaciones/ProyectoValidaciones");
        ProyectoValidaciones = validacionesModule.ProyectoValidaciones;

        const casosUsoModule = await import("../../../src/core/aplicacion/casos-uso/Proyecto/ConsultarProyectosPorClienteCasosUso");
        ConsultarProyectosPorClienteCasosUso = casosUsoModule.ConsultarProyectosPorClienteCasosUso;
    });

    beforeEach(() => {
        proyectoRepoMock = {
            obtenerPorCliente: jest.fn(),
        };

        clienteRepoMock = {
            buscarPorIdCliente: jest.fn(),
        };

        casosUso = new ConsultarProyectosPorClienteCasosUso(
            proyectoRepoMock,
            clienteRepoMock
        );

        jest.clearAllMocks();
    });

    test("debería retornar proyectos cuando el cliente existe y tiene proyectos", async () => {
        const idCliente = "cliente-123";
        const clienteMock: ICliente = {
            idCliente: "cliente-123",
            nombre: "Empresa ABC",
            identificacion: "123456789",
            email: "contacto@empresaabc.com",
            telefono: "3001234567",
            estado: "Activo",
        };

        const proyectosMock: Proyecto[] = [
            new Proyecto(
                1,
                "Proyecto Alpha",
                "Descripción del proyecto Alpha",
                "En proceso",
                "Activo",
                123,
                new Date("2025-01-01"),
                new Date("2025-06-01"),
                new Date("2025-01-01")
            ),
            new Proyecto(
                2,
                "Proyecto Beta",
                "Descripción del proyecto Beta",
                "Creado",
                "Activo",
                123,
                new Date("2025-02-01"),
                new Date("2025-08-01"),
                new Date("2025-02-01")
            ),
        ];

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockResolvedValue(
            clienteMock
        );
        proyectoRepoMock.obtenerPorCliente.mockResolvedValue(proyectosMock);

        const resultado = await casosUso.ejecutar(idCliente);

        expect(ProyectoValidaciones.validarClienteExiste).toHaveBeenCalledWith(
            clienteRepoMock,
            idCliente
        );
        expect(proyectoRepoMock.obtenerPorCliente).toHaveBeenCalledWith(
            idCliente,
            undefined
        );
        expect(resultado).toEqual({ proyectos: proyectosMock });
    });

    test("debería retornar proyectos filtrados cuando se proporcionan filtros", async () => {
        const idCliente = "cliente-123";
        const clienteMock: ICliente = {
            idCliente: "cliente-123",
            nombre: "Empresa ABC",
            identificacion: "123456789",
            email: "contacto@empresaabc.com",
            telefono: "3001234567",
            estado: "Activo",
        };

        const filtros = {
            estadoProyecto: "En proceso",
            fechaInicio: new Date("2025-01-01"),
            fechaFin: new Date("2025-12-31"),
        };

        const proyectosFiltrados: Proyecto[] = [
            new Proyecto(
                1,
                "Proyecto Alpha",
                "Descripción del proyecto Alpha",
                "En proceso",
                "Activo",
                123,
                new Date("2025-01-01"),
                new Date("2025-06-01"),
                new Date("2025-01-01")
            ),
        ];

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockResolvedValue(
            clienteMock
        );
        proyectoRepoMock.obtenerPorCliente.mockResolvedValue(proyectosFiltrados);

        const resultado = await casosUso.ejecutar(idCliente, filtros);

        expect(ProyectoValidaciones.validarClienteExiste).toHaveBeenCalledWith(
            clienteRepoMock,
            idCliente
        );
        expect(proyectoRepoMock.obtenerPorCliente).toHaveBeenCalledWith(
            idCliente,
            filtros
        );
        expect(resultado).toEqual({ proyectos: proyectosFiltrados });
    });

    test("debería retornar mensaje cuando el cliente no tiene proyectos", async () => {
        const idCliente = "cliente-sin-proyectos";
        const clienteMock: ICliente = {
            idCliente: "cliente-sin-proyectos",
            nombre: "Empresa Sin Proyectos",
            identificacion: "987654321",
            email: "contacto@sinproyectos.com",
            telefono: "3009876543",
            estado: "Activo",
        };

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockResolvedValue(
            clienteMock
        );
        proyectoRepoMock.obtenerPorCliente.mockResolvedValue([]);

        const resultado = await casosUso.ejecutar(idCliente);

        expect(ProyectoValidaciones.validarClienteExiste).toHaveBeenCalledWith(
            clienteRepoMock,
            idCliente
        );
        expect(proyectoRepoMock.obtenerPorCliente).toHaveBeenCalledWith(
            idCliente,
            undefined
        );
        expect(resultado.proyectos).toEqual([]);
        expect(resultado.mensaje).toBeDefined();
        expect(resultado.mensaje).toContain(idCliente);
    });

    test("debería retornar mensaje cuando el cliente tiene proyectos pero ninguno cumple los filtros", async () => {
        const idCliente = "cliente-123";
        const clienteMock: ICliente = {
            idCliente: "cliente-123",
            nombre: "Empresa ABC",
            identificacion: "123456789",
            email: "contacto@empresaabc.com",
            telefono: "3001234567",
            estado: "Activo",
        };

        const filtros = {
            estadoProyecto: "Finalizado",
        };

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockResolvedValue(
            clienteMock
        );
        proyectoRepoMock.obtenerPorCliente.mockResolvedValue([]);

        const resultado = await casosUso.ejecutar(idCliente, filtros);

        expect(resultado.proyectos).toEqual([]);
        expect(resultado.mensaje).toBeDefined();
    });

    test("debería lanzar error cuando el cliente no existe", async () => {
        const idCliente = "cliente-inexistente";

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockRejectedValue(
            new NoEncontradoError("Cliente", idCliente)
        );

        await expect(casosUso.ejecutar(idCliente)).rejects.toThrow(
            NoEncontradoError
        );

        expect(ProyectoValidaciones.validarClienteExiste).toHaveBeenCalledWith(
            clienteRepoMock,
            idCliente
        );
        expect(proyectoRepoMock.obtenerPorCliente).not.toHaveBeenCalled();
    });

    test("debería manejar proyectos null del repositorio como lista vacía", async () => {
        const idCliente = "cliente-123";
        const clienteMock: ICliente = {
            idCliente: "cliente-123",
            nombre: "Empresa ABC",
            identificacion: "123456789",
            email: "contacto@empresaabc.com",
            telefono: "3001234567",
            estado: "Activo",
        };

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockResolvedValue(
            clienteMock
        );
        proyectoRepoMock.obtenerPorCliente.mockResolvedValue([]);

        const resultado = await casosUso.ejecutar(idCliente);

        expect(resultado.proyectos).toEqual([]);
        expect(resultado.mensaje).toBeDefined();
    });

    test("debería retornar solo proyectos activos del cliente", async () => {
        const idCliente = "cliente-123";
        const clienteMock: ICliente = {
            idCliente: "cliente-123",
            nombre: "Empresa ABC",
            identificacion: "123456789",
            email: "contacto@empresaabc.com",
            telefono: "3001234567",
            estado: "Activo",
        };

        const proyectosMock: Proyecto[] = [
            new Proyecto(
                1,
                "Proyecto Activo",
                "Proyecto en estado activo",
                "En proceso",
                "Activo",
                123,
                new Date("2025-01-01"),
                new Date("2025-06-01"),
                new Date("2025-01-01")
            ),
        ];

        (ProyectoValidaciones.validarClienteExiste as jest.Mock).mockResolvedValue(
            clienteMock
        );
        proyectoRepoMock.obtenerPorCliente.mockResolvedValue(proyectosMock);

        const resultado = await casosUso.ejecutar(idCliente);

        expect(resultado.proyectos).toHaveLength(1);
        expect(resultado.proyectos[0].estado).toBe("Activo");
    });
});
