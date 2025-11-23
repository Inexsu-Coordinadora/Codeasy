import { TareaCasosUso } from "../../../src/core/aplicacion/casos-uso/Tarea/TareaCasosUso";
import { TareaRepositorio } from "../../../src/core/infraestructura/postgres/TareaRepositorio";
import { TareaValidaciones } from "../../../src/core/aplicacion/casos-uso/Tarea/TareaValidaciones";
import { ITarea } from "../../../src/core/dominio/tarea/ITarea";
import { AppError } from "../../../src/common/middlewares/AppError";
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock dependencies
jest.mock("../../../src/core/infraestructura/postgres/TareaRepositorio");
jest.mock("../../../src/core/aplicacion/casos-uso/Tarea/TareaValidaciones");

describe("TareaCasosUso", () => {
    let tareaCasosUso: TareaCasosUso;
    let mockTareaRepositorio: jest.Mocked<TareaRepositorio>;
    let mockValidaciones: jest.Mocked<TareaValidaciones>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockTareaRepositorio = {
            registrarTarea: jest.fn(),
            actualizarTarea: jest.fn(),
            eliminarTarea: jest.fn(),
            obtenerTareaPorId: jest.fn(),
            listarTodasTareas: jest.fn(),
            equipoConsultorEstaActivo: jest.fn(),
            obtenerIdProyecto: jest.fn(),
            existeTituloEnProyecto: jest.fn(),
            obtenerRangoFechasConsultor: jest.fn(),
        } as unknown as jest.Mocked<TareaRepositorio>;

        mockValidaciones = {
            validarEquipoActivo: jest.fn(),
            validarIdProyectoExiste: jest.fn(),
            validarTituloUnico: jest.fn(),
            validarFechaPosterior: jest.fn(),
            validarRangoConsultor: jest.fn(),
            validarNoDuplicarCompletada: jest.fn(),
            validarTareaPorId: jest.fn(),
        } as unknown as jest.Mocked<TareaValidaciones>;

        // Inject mocks
        tareaCasosUso = new TareaCasosUso(mockTareaRepositorio);
        (tareaCasosUso as any).validaciones = mockValidaciones;
    });

    describe("registrarTarea", () => {
        const datosTarea: ITarea = {
            titulo: "Nueva Tarea",
            descripcion: "Descripción",
            estadoTarea: "pendiente",
            prioridad: "Media",
            asignadoA: "equipo-123",
            fechaFinalizacion: new Date("2025-12-31"),
            estado: "Activo"
        };

        it("debe registrar una tarea exitosamente", async () => {
            // Arrange
            mockTareaRepositorio.equipoConsultorEstaActivo.mockResolvedValue(true);
            mockTareaRepositorio.obtenerIdProyecto.mockResolvedValue("proyecto-123");
            mockTareaRepositorio.existeTituloEnProyecto.mockResolvedValue(false);
            mockTareaRepositorio.obtenerRangoFechasConsultor.mockResolvedValue({ fechaInicio: new Date(), fechaFin: new Date("2030-01-01") });
            mockTareaRepositorio.registrarTarea.mockResolvedValue({
                ...datosTarea,
                idTarea: "tarea-123",
                nombreConsultor: "Juan Perez",
                idConsultor: "consultor-123"
            });

            // Act
            const resultado = await tareaCasosUso.registrarTarea(datosTarea);

            // Assert
            expect(resultado).toHaveProperty("idTarea", "tarea-123");
            expect(resultado).toHaveProperty("nombreConsultor", "Juan Perez");
            expect(resultado).toHaveProperty("idConsultor", "consultor-123");
            expect(mockTareaRepositorio.registrarTarea).toHaveBeenCalled();
            expect(mockValidaciones.validarEquipoActivo).toHaveBeenCalled();
            expect(mockValidaciones.validarIdProyectoExiste).toHaveBeenCalled();
            expect(mockValidaciones.validarTituloUnico).toHaveBeenCalled();
            expect(mockValidaciones.validarFechaPosterior).toHaveBeenCalled();
            expect(mockValidaciones.validarRangoConsultor).toHaveBeenCalled();
        });

        it("debe lanzar error si el proyecto no existe", async () => {
            // Arrange
            mockTareaRepositorio.equipoConsultorEstaActivo.mockResolvedValue(true);
            mockTareaRepositorio.obtenerIdProyecto.mockResolvedValue(null); // Proyecto no existe

            // Mock validaciones to throw error as the real one would
            mockValidaciones.validarIdProyectoExiste.mockImplementation(() => {
                throw new Error("Proyecto no encontrado");
            });

            // Act & Assert
            await expect(tareaCasosUso.registrarTarea(datosTarea)).rejects.toThrow("Proyecto no encontrado");
        });
    });

    describe("actualizarTarea", () => {
        const idTarea = "tarea-123";
        const datosActualizar: ITarea = {
            titulo: "Tarea Actualizada",
            descripcion: "Descripción",
            estadoTarea: "en progreso",
            prioridad: "Alta",
            asignadoA: "equipo-123",
            fechaFinalizacion: new Date("2025-12-31"),
            estado: "Activo"
        };

        const tareaExistente: ITarea = {
            idTarea,
            titulo: "Vieja Tarea",
            descripcion: "Descripción",
            estadoTarea: "pendiente",
            prioridad: "Media",
            asignadoA: "equipo-123",
            fechaCreacion: new Date("2024-01-01"),
            fechaFinalizacion: new Date("2024-12-31"),
            estado: "Activo"
        };

        it("debe actualizar una tarea exitosamente", async () => {
            // Arrange
            mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(tareaExistente);
            mockTareaRepositorio.equipoConsultorEstaActivo.mockResolvedValue(true);
            mockTareaRepositorio.obtenerIdProyecto.mockResolvedValue("proyecto-123");
            mockTareaRepositorio.existeTituloEnProyecto.mockResolvedValue(false);
            mockTareaRepositorio.obtenerRangoFechasConsultor.mockResolvedValue({ fechaInicio: new Date(), fechaFin: new Date("2030-01-01") });
            mockTareaRepositorio.actualizarTarea.mockResolvedValue({
                ...tareaExistente,
                ...datosActualizar,
                nombreConsultor: "Maria Lopez",
                idConsultor: "consultor-456"
            });

            // Act
            const resultado = await tareaCasosUso.actualizarTarea(idTarea, datosActualizar);

            // Assert
            expect(resultado.titulo).toBe(datosActualizar.titulo);
            expect(resultado).toHaveProperty("nombreConsultor", "Maria Lopez");
            expect(resultado).toHaveProperty("idConsultor", "consultor-456");
            expect(mockTareaRepositorio.actualizarTarea).toHaveBeenCalled();
        });

        it("debe lanzar error si la tarea no existe", async () => {
            // Arrange
            mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(null);

            // Act & Assert
            await expect(tareaCasosUso.actualizarTarea(idTarea, datosActualizar))
                .rejects.toThrow(AppError);
        });
    });

    describe("eliminarTarea", () => {
        const idTarea = "tarea-123";
        const tareaExistente: ITarea = {
            idTarea,
            titulo: "Tarea",
            descripcion: "Desc",
            estadoTarea: "pendiente",
            prioridad: "Media",
            asignadoA: "equipo-123",
            fechaFinalizacion: new Date(),
            estado: "Activo"
        };

        it("debe eliminar una tarea exitosamente", async () => {
            // Arrange
            mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(tareaExistente);
            mockTareaRepositorio.eliminarTarea.mockResolvedValue(undefined);

            // Act
            await tareaCasosUso.eliminarTarea(idTarea);

            // Assert
            expect(mockTareaRepositorio.eliminarTarea).toHaveBeenCalledWith(idTarea);
        });

        it("debe lanzar error si la tarea ya está eliminada", async () => {
            // Arrange
            mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue({ ...tareaExistente, estado: "Eliminado" });

            // Act & Assert
            await expect(tareaCasosUso.eliminarTarea(idTarea))
                .rejects.toThrow("La tarea con ID tarea-123 ya está eliminada.");
        });
    });

    describe("obtenerTareaPorId", () => {
        it("debe retornar la tarea si existe", async () => {
            // Arrange
            const tarea = { idTarea: "1", titulo: "Tarea 1" } as ITarea;
            mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(tarea);

            // Act
            const resultado = await tareaCasosUso.obtenerTareaPorId("1");

            // Assert
            expect(resultado).toEqual(tarea);
            expect(mockValidaciones.validarTareaPorId).toHaveBeenCalled();
        });
    });

    describe("listarTodasTareas", () => {
        it("debe retornar lista de tareas", async () => {
            // Arrange
            const tareas = [{ idTarea: "1" }, { idTarea: "2" }] as ITarea[];
            mockTareaRepositorio.listarTodasTareas.mockResolvedValue(tareas);

            // Act
            const resultado = await tareaCasosUso.listarTodasTareas();

            // Assert
            expect(resultado).toHaveLength(2);
        });
    });
});
