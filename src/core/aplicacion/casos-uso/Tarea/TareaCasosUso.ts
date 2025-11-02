import  { ITarea } from "../../../dominio/tarea/ITarea";
import  { Tarea } from "../../../dominio/tarea/Tarea";
import  { ITareaRepositorio } from "../../../dominio/tarea/repositorio/ITareaRepositorio.js";
import  { TareaCrearDTO } from "../../../../presentacion/esquemas/EsquemaTareas";
import  { TareaActualizarDTO } from "../../../../presentacion/esquemas/EsquemaTareas";
//import { randomUUID } from "crypto";

export class TareaCasosUso {
  constructor(private tareaRepositorio: ITareaRepositorio) {}


  async registrar(datos: TareaCrearDTO): Promise<ITarea> {
    const fechaActual = new Date();
    const nuevaTarea = new Tarea({
      ...datos,
      status: "Activo",
      stateTask: "Create",
      fechaCreacion: fechaActual,
      // If fechaFinalizacion wasn't provided, set it to 1 day after creation
      fechaFinalizacion: datos.fechaFinalizacion || new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000),
      prioridad: datos.prioridad || "Media", // Ensure required field has a default
      asignadoA: datos.asignadoA || "Sin asignar" // Ensure required field has a default
    });

    const tareaCreada = await this.tareaRepositorio.registrarTarea(nuevaTarea);

    return tareaCreada; 
  }


  async listarTodasTareas(): Promise<ITarea[]> {
    return await this.tareaRepositorio.listarTodasTareas();
  }

 
  async obtenerTareaPorId(idTarea: number): Promise<ITarea | null> {
    const tarea = await this.tareaRepositorio.obtenerTareaPorId(idTarea);
    return tarea;
  }


  async actualizarTarea(idTarea: number, datos: TareaActualizarDTO): Promise<ITarea> {
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    if (!tareaExistente) {
      throw new Error(`No se encontró la tarea con ID ${idTarea}`);
    }


  const tareaActualizada = {
    ...tareaExistente,
    ...datos,
    }as ITarea;


  const resultado = await this.tareaRepositorio.actualizarTarea(
    idTarea,
    tareaActualizada as ITarea
  );

  return resultado;
}



  async eliminarTarea(idTarea: number): Promise<void> {
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    if (!tareaExistente) {
      throw new Error(`No se encontró la tarea con ID ${idTarea}`);
    }

    if (tareaExistente.status === "eliminado") {
      throw new Error(`La tarea con ID ${idTarea} ya está eliminada.`);
    }


    tareaExistente.status = "eliminado";

    await this.tareaRepositorio.actualizarTarea(idTarea, tareaExistente);
  }
}