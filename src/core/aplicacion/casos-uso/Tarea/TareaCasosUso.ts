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
      fechaFinalizacion: datos.fechaFinalizacion || new Date(fechaActual.getTime() + 7 * 24 * 60 * 60 * 1000),
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


  async actualizarTarea(idTarea: string, datos: TareaActualizarDTO): Promise<ITarea | null> {
    // 1. Obtener la tarea existente
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);
    if (!tareaExistente) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, 404);
    }

    // 2. Construir objeto de actualización manteniendo los campos requeridos
    const actualizacion: Partial<ITarea> = {
      titulo: datos.titulo ?? tareaExistente.titulo,
      descripcion: datos.descripcion ?? tareaExistente.descripcion,
      estadoTarea: datos.estadoTarea ?? tareaExistente.estadoTarea,
      fechaFinalizacion: datos.fechaFinalizacion ?? tareaExistente.fechaFinalizacion,
      prioridad: datos.prioridad ?? tareaExistente.prioridad,
      asignadoA: datos.asignadoA ?? tareaExistente.asignadoA,
    };

    // Validar fechas si se está actualizando fechaFinalizacion
    if (datos.fechaFinalizacion && tareaExistente.fechaCreacion) {
      if (datos.fechaFinalizacion <= tareaExistente.fechaCreacion) {
        throw new AppError("La fecha de finalización debe ser posterior a la fecha de creación", 400, { fechaFinalizacion: datos.fechaFinalizacion, fechaCreacion: tareaExistente.fechaCreacion });
      }
    }

    // 4. Realizar la actualización
    return await this.tareaRepositorio.actualizarTarea(idTarea, actualizacion);
  }


  async eliminarTarea(idTarea: string): Promise<void> {
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    if (!tareaExistente) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, 404);
    }

    if (tareaExistente.estatus === "Eliminado") {
      throw new AppError(`La tarea con ID ${idTarea} ya está eliminada.`, 400);
    }


    tareaExistente.estatus = "Eliminado";

    await this.tareaRepositorio.actualizarTarea(idTarea, tareaExistente);
  }
}