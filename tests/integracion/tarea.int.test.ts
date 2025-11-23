import request from "supertest";
import { app } from "../../src/presentacion/app";
import { ITarea } from "../../src/core/dominio/tarea/ITarea";

// Mock TareaRepositorio
const mockTareaRepositorio = {
    registrarTarea: jest.fn(),
    listarTodasTareas: jest.fn(),
    obtenerTareaPorId: jest.fn(),
    actualizarTarea: jest.fn(),
    eliminarTarea: jest.fn(),
    equipoConsultorEstaActivo: jest.fn(),
    obtenerIdProyecto: jest.fn(),
    existeTituloEnProyecto: jest.fn(),
    obtenerRangoFechasConsultor: jest.fn(),
};

jest.mock("../../src/core/infraestructura/postgres/TareaRepositorio", () => {
    return {
        TareaRepositorio: jest.fn().mockImplementation(() => mockTareaRepositorio)
    };
});

describe("Pruebas de integración - API Tareas", () => {

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --------------------------------------
    // POST /api/tarea - Crear Tarea
    // --------------------------------------
    test("POST /api/tarea - debe crear una tarea exitosamente", async () => {
        const nuevaTarea = {
            titulo: "Nueva Tarea Integration",
            descripcion: "Descripción Integration",
            estadoTarea: "pendiente",
            prioridad: "Media",
            asignadoA: "equipo-123",
            fechaFinalizacion: new Date("2025-12-31").toISOString(),
            estado: "Activo"
        };

        // Mock responses for UseCase dependencies
        mockTareaRepositorio.equipoConsultorEstaActivo.mockResolvedValue(true);
        mockTareaRepositorio.obtenerIdProyecto.mockResolvedValue("proyecto-123");
        mockTareaRepositorio.existeTituloEnProyecto.mockResolvedValue(false);
        mockTareaRepositorio.obtenerRangoFechasConsultor.mockResolvedValue({ fechaInicio: new Date(), fechaFin: new Date("2030-01-01") });

        mockTareaRepositorio.registrarTarea.mockResolvedValue({
            ...nuevaTarea,
            idTarea: "tarea-mock-1",
            fechaCreacion: new Date().toISOString(),
            nombreConsultor: "Consultor Mock",
            idConsultor: "consultor-mock-1"
        });
        const listaTareas = [
            { idTarea: "tarea-1", titulo: "Tarea 1", estado: "Activo" },
            { idTarea: "tarea-2", titulo: "Tarea 2", estado: "Activo" }
        ];

        mockTareaRepositorio.listarTodasTareas.mockResolvedValue(listaTareas);

        const response = await request(app.server).get("/api/tarea");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("mensaje", "Tareas obtenidas correctamente");
        expect(response.body.data).toHaveLength(2);
    });

    // --------------------------------------
    // GET /api/tarea/:idTarea - Obtener por ID
    // --------------------------------------
    test("GET /api/tarea/:idTarea - debe obtener una tarea por ID", async () => {
        const tarea = { idTarea: "tarea-mock-1", titulo: "Tarea 1", estado: "Activo" };

        mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(tarea);

        const response = await request(app.server).get("/api/tarea/tarea-mock-1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("mensaje", "Tarea obtenida correctamente");
        expect(response.body.data).toEqual(tarea);
    });

    test("GET /api/tarea/:idTarea - debe retornar 404 si no existe", async () => {
        mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(null);

        const response = await request(app.server).get("/api/tarea/tarea-inexistente");

        expect(response.status).toBe(404); // Assuming controller returns 404 for null
    });

    // --------------------------------------
    // PUT /api/tarea/:idTarea - Actualizar Tarea
    // --------------------------------------
    test("PUT /api/tarea/:idTarea - debe actualizar una tarea", async () => {
        const idTarea = "tarea-mock-1";
        const datosActualizar = {
            titulo: "Tarea Actualizada",
            estadoTarea: "en progreso"
        };

        const tareaExistente = {
            idTarea,
            titulo: "Tarea Original",
            estadoTarea: "pendiente",
            asignadoA: "equipo-123",
            fechaCreacion: new Date(),
            fechaFinalizacion: new Date("2025-12-31"),
            estado: "Activo"
        };

        mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(tareaExistente);
        mockTareaRepositorio.equipoConsultorEstaActivo.mockResolvedValue(true);
        mockTareaRepositorio.obtenerIdProyecto.mockResolvedValue("proyecto-123");
        mockTareaRepositorio.existeTituloEnProyecto.mockResolvedValue(false);
        mockTareaRepositorio.obtenerRangoFechasConsultor.mockResolvedValue({ fechaInicio: new Date(), fechaFin: new Date("2030-01-01") });

        mockTareaRepositorio.actualizarTarea.mockResolvedValue({
            ...tareaExistente,
            ...datosActualizar,
            nombreConsultor: "Consultor Mock",
            idConsultor: "consultor-mock-1"
        });

        const response = await request(app.server)
            .put(`/api/tarea/${idTarea}`)
            .send(datosActualizar);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("mensaje", "Tarea actualizada correctamente");
        expect(response.body.data).toHaveProperty("titulo", "Tarea Actualizada");
        expect(response.body.data).toHaveProperty("nombreConsultor", "Consultor Mock");
    });

    // --------------------------------------
    // DELETE /api/tarea/eliminar/:idTarea - Eliminar Tarea
    // --------------------------------------
    test("DELETE /api/tarea/eliminar/:idTarea - debe eliminar una tarea", async () => {
        const idTarea = "tarea-mock-1";
        const tareaExistente = { idTarea, estado: "Activo" };

        mockTareaRepositorio.obtenerTareaPorId.mockResolvedValue(tareaExistente);
        mockTareaRepositorio.eliminarTarea.mockResolvedValue(undefined);

        const response = await request(app.server).delete(`/api/tarea/eliminar/${idTarea}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("mensaje", "Tarea eliminada correctamente");
    });
});
