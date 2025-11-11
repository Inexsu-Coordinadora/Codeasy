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
      throw new AppError("La fecha de finalización debe ser posterior a la fecha de creación");
    }

    const tareaCreada = await this.tareaRepositorio.registrarTarea(nuevaTarea);

    return tareaCreada; 
  }


  async listarTodasTareas(): Promise<ITarea[]> {
    return await this.tareaRepositorio.listarTodasTareas();
  }

 
 async obtenerTareaPorId(idTarea: number): Promise<ITarea> {
  const tarea = await this.tareaRepositorio.obtenerTareaPorId(idTarea);
  
  if (!tarea) {
    throw new AppError('Tarea', idTarea);
  }

  return tarea;
}


  async actualizarTarea(idTarea: number, datos: TareaActualizarDTO): Promise<ITarea | null> {
    // 1. Obtener la tarea existente
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);
    if (!tareaExistente) {
      throw new AppError(`No se encontró la tarea con ID ${idTarea}`);
    }

    // 2. Construir objeto de actualización manteniendo los campos requeridos
    const actualizacion = {
      ...tareaExistente, // Mantener todos los campos existentes como base
      titulo: datos.titulo ?? tareaExistente.titulo,
      descripcion: datos.descripcion ?? tareaExistente.descripcion,
      estadotarea: datos.estado_tarea ?? tareaExistente.estadoTarea,
      fechafinalizacion: datos.fechaFinalizacion ?? tareaExistente.fechaFinalizacion,
      prioridad: datos.prioridad ?? tareaExistente.prioridad,
      asignadoa: datos.asignadoA ?? tareaExistente.asignadoA
    } as ITarea; // Asegurar que el tipo coincida con ITarea

    // 3. Validar fechas si se está actualizando fechaFinalizacion
    if (datos.fechaFinalizacion && actualizacion.fechaCreacion) {
      if (datos.fechaFinalizacion <= actualizacion.fechaCreacion) {
        throw new AppError("La fecha de finalización debe ser posterior a la fecha de creación");
      }
    }

    // 4. Realizar la actualización
    return await this.tareaRepositorio.actualizarTarea(idTarea, actualizacion);
  }


  async eliminarTarea(idTarea: number): Promise<void> {
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    if (!tareaExistente) {
      throw new AppError(`No se encontró la tarea con ID ${idTarea}`);
    }

    if (tareaExistente.estatus === "Eliminado") {
      throw new AppError(`La tarea con ID ${idTarea} ya está eliminada.`);
    }


    tareaExistente.estatus = "Eliminado";

    await this.tareaRepositorio.actualizarTarea(idTarea, tareaExistente);
  }
}