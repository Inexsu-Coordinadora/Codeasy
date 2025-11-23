import { TareaRepositorio } from "../../../src/core/infraestructura/postgres/TareaRepositorio";
import { ITarea } from "../../../src/core/dominio/tarea/ITarea";
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock ejecutarConsulta
const mockEjecutarConsulta = jest.fn();
jest.mock("../../../src/core/infraestructura/postgres/clientepostgres", () => ({
    ejecutarConsulta: mockEjecutarConsulta
}));

describe("TareaRepositorio - Consultant Details", () => {
    let tareaRepositorio: TareaRepositorio;

    beforeEach(() => {
        jest.clearAllMocks();
        tareaRepositorio = new TareaRepositorio();
    });

    it("should include consultant details when registering a task", async () => {
        const mockTarea: ITarea = {
            titulo: "Test Task",
            descripcion: "Test Description",
            estadoTarea: "pendiente",
            prioridad: "Media",
            asignadoA: "equipo-123",
            fechaFinalizacion: new Date(),
            estado: "Activo"
        };

        // Mock insert response
        mockEjecutarConsulta.mockResolvedValueOnce({
            rows: [{
                id_tarea: "tarea-123",
                titulo: mockTarea.titulo,
                descripcion: mockTarea.descripcion,
                estado_tarea: mockTarea.estadoTarea,
                prioridad: mockTarea.prioridad,
                fecha_creacion: new Date(),
                fecha_limite: mockTarea.fechaFinalizacion,
                id_equipos_consultores: mockTarea.asignadoA,
                estado: mockTarea.estado
            }]
        });

        // Mock consultant details query response
        mockEjecutarConsulta.mockResolvedValueOnce({
            rows: [{
                nombre: "Juan Perez",
                id_consultor: "consultor-123"
            }]
        });

        const result = await tareaRepositorio.registrarTarea(mockTarea);

        expect(result.nombreConsultor).toBe("Juan Perez");
        expect(result.idConsultor).toBe("consultor-123");
    });

    it("should include consultant details when updating a task", async () => {
        const idTarea = "tarea-123";
        const datosActualizar: Partial<ITarea> = {
            titulo: "Updated Task"
        };

        // Mock update response
        mockEjecutarConsulta.mockResolvedValueOnce({
            rows: [{
                id_tarea: idTarea,
                titulo: "Updated Task",
                descripcion: "Desc",
                estado_tarea: "pendiente",
                prioridad: "Media",
                fecha_creacion: new Date(),
                fecha_limite: new Date(),
                id_equipos_consultores: "equipo-123",
                estado: "Activo"
            }]
        });

        // Mock consultant details query response
        mockEjecutarConsulta.mockResolvedValueOnce({
            rows: [{
                nombre: "Maria Lopez",
                id_consultor: "consultor-456"
            }]
        });

        const result = await tareaRepositorio.actualizarTarea(idTarea, datosActualizar);

        expect(result?.nombreConsultor).toBe("Maria Lopez");
        expect(result?.idConsultor).toBe("consultor-456");
    });
});
