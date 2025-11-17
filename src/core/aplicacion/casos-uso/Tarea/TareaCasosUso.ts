import  { ITarea } from "../../../dominio/tarea/ITarea.js";
import  { Tarea } from "../../../dominio/tarea/Tarea.js";
import  { ITareaRepositorio } from "../../../dominio/tarea/repositorio/ITareaRepositorio.js";
import  { TareaCrearDTO } from "../../../../presentacion/esquemas/TareaCrearEsquema.js";
import  { TareaActualizarDTO } from "../../../../presentacion/esquemas/TareaActualizarEsquema.js";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError.js";
//import { randomUUID } from "crypto";

export class TareaCasosUso {
  constructor(private tareaRepositorio: ITareaRepositorio) {}


  async registrar(datos: TareaCrearDTO): Promise<ITarea> {
    const fechaActual = new Date();
    const nuevaTarea = new Tarea({
      ...datos,
      estado: "Activo",
      estado_tarea: "pendiente",
      fechaCreacion: fechaActual,
      // En caso de no proporcionar fechaFinalizacion, se establece a 1 semana después de la creación
      fechaFinalizacion: datos.fechaFinalizacion,
      prioridad: datos.prioridad || "Media",
      asignadoA: datos.asignadoA 
    });
    
    if (nuevaTarea.fechaFinalizacion <= fechaActual) {
      throw new AppError("La fecha de finalización debe ser posterior a la fecha de creación", 400, { fechaFinalizacion: nuevaTarea.fechaFinalizacion, fechaActual: fechaActual });
    }

    const tareaCreada = await this.tareaRepositorio.registrarTarea(nuevaTarea);

    return tareaCreada; 
  }


  async listarTodasTareas(): Promise<ITarea[]> {
    return await this.tareaRepositorio.listarTodasTareas();
  }

 
  async obtenerTareaPorId(idTarea: string): Promise<ITarea> {
    const tarea = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    if (!tarea) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, 404);
    }

    return tarea;
  }


  async actualizarTarea(idTarea: string, datos: TareaActualizarDTO): Promise<ITarea> {
    // 1. Obtener la tarea existente
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);
    if (!tareaExistente) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, 404);
    }

    // 2. Validar si se intenta marcar como completada una tarea que ya está completada
    if (datos.estadoTarea === 'completada' && tareaExistente.estadoTarea === 'completada') {
      throw new AppError('La tarea ya está marcada como completada. El estado ya fue aplicado.', 400);
    }

    // 3. Construir objeto de actualización manteniendo los campos requeridos
    const actualizacion: Partial<ITarea> = {
      titulo: datos.titulo ?? tareaExistente.titulo,
      descripcion: datos.descripcion ?? tareaExistente.descripcion,
      estadoTarea: datos.estadoTarea ?? tareaExistente.estadoTarea,
      fechaFinalizacion: datos.fechaFinalizacion ?? tareaExistente.fechaFinalizacion,
      prioridad: datos.prioridad ?? tareaExistente.prioridad,
      asignadoA: datos.asignadoA ?? tareaExistente.asignadoA,
    };

    // 4. Validar fechas si se está actualizando fechaFinalizacion
    if (datos.fechaFinalizacion && tareaExistente.fechaCreacion) {
      if (datos.fechaFinalizacion <= tareaExistente.fechaCreacion) {
        throw new AppError("La fecha de finalización debe ser posterior a la fecha de creación", 400);
      }
    }

    // 5. Realizar la actualización
    return await this.tareaRepositorio.actualizarTarea(idTarea, actualizacion);
  }


  async eliminarTarea(idTarea: string): Promise<void> {
      const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

      if (!tareaExistente) {
        throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, 404);
      }

      if (tareaExistente.estado === "Eliminado") {
        throw new AppError(`La tarea con ID ${idTarea} ya está eliminada.`, 400);
      }


      tareaExistente.estado = "Eliminado";

      await this.tareaRepositorio.actualizarTarea(idTarea, tareaExistente);
    }
}