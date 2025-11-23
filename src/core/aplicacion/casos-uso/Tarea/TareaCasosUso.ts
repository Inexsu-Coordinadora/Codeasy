import { ITarea } from "../../../dominio/tarea/ITarea.js";
import { Tarea } from "../../../dominio/tarea/Tarea.js";
import { TareaRepositorio } from "../../../infraestructura/postgres/TareaRepositorio.js";
import { TareaValidaciones } from "./TareaValidaciones.js";
import { ITareaCasosUso } from "./ITareaCasosUso.js";
import { AppError } from "../../../../common/middlewares/AppError.js";
import { CodigosHttp } from "../../../../common/codigosHttp.js";

export class TareaCasosUso implements ITareaCasosUso {
  private validaciones: TareaValidaciones;

  constructor(private tareaRepositorio: TareaRepositorio) {
    this.validaciones = new TareaValidaciones();
  }

  async registrarTarea(datos: ITarea): Promise<ITarea> {
    const fechaActual = new Date();

    // 1️⃣ Validar que el equipo_consultor exista y esté activo (repo call stays here)
    const equipoActivo = await this.tareaRepositorio.equipoConsultorEstaActivo(datos.asignadoA);
    this.validaciones.validarEquipoActivo(equipoActivo, datos.asignadoA);

    // 2️⃣ Obtener el id_proyecto asociado al equipo_consultor (repo call stays here)
    const idProyecto = await this.tareaRepositorio.obtenerIdProyecto(datos.asignadoA);
    this.validaciones.validarIdProyectoExiste(idProyecto, datos.asignadoA);

    // 3️⃣ Validar duplicidad de título en el proyecto (repo call stays here)
    if (!idProyecto) {
      this.validaciones.validarIdProyectoExiste(idProyecto, datos.asignadoA);
    } else {
      const tituloExiste = await this.tareaRepositorio.existeTituloEnProyecto(
        idProyecto,
        datos.titulo
      );
      this.validaciones.validarTituloUnico(tituloExiste, datos.titulo, idProyecto);
    }

    // 4️⃣ Validar que fechaFinalizacion sea posterior a fechaCreacion
    this.validaciones.validarFechaPosterior(datos.fechaFinalizacion, fechaActual);

    // 5️⃣ Validar que la fecha límite esté dentro del rango del consultor
    if (datos.fechaFinalizacion) {
      const rangoConsultor = await this.tareaRepositorio.obtenerRangoFechasConsultor(datos.asignadoA);
      this.validaciones.validarRangoConsultor(rangoConsultor, datos.fechaFinalizacion, datos.asignadoA);
    }

    // 6️⃣ Crear la entidad de dominio
    const nuevaTarea = new Tarea({
      ...datos,
      estado: "Activo",
      estadoTarea: datos.estadoTarea ?? "pendiente",
      fechaCreacion: fechaActual,
      fechaFinalizacion: datos.fechaFinalizacion,
      prioridad: datos.prioridad ?? "Media",
      asignadoA: datos.asignadoA
    });

    // 7️⃣ Persistir la tarea
    return await this.tareaRepositorio.registrarTarea(nuevaTarea);
  }

  async listarTodasTareas(): Promise<ITarea[]> {
    return await this.tareaRepositorio.listarTodasTareas();
  }

  async obtenerTareaPorId(idTarea: string): Promise<ITarea | null> {
    const tarea = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    this.validaciones.validarTareaPorId(tarea, idTarea);

    return tarea;
  }

  async actualizarTarea(idTarea: string, datos: ITarea): Promise<ITarea> {
    // 1️⃣ Obtener la tarea existente
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);
    if (!tareaExistente) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, CodigosHttp.SOLICITUD_INCORRECTA);
    }

    // 2️⃣ Validar si se intenta marcar como completada una tarea que ya está completada
    this.validaciones.validarNoDuplicarCompletada(datos.estadoTarea, tareaExistente.estadoTarea);

    // 3️⃣ Determinar valores efectivos después de la actualización
    const effTitulo = datos.titulo ?? tareaExistente.titulo;
    const effAsignadoA = datos.asignadoA ?? tareaExistente.asignadoA;
    const effFechaFinalizacion = datos.fechaFinalizacion !== undefined
      ? datos.fechaFinalizacion
      : tareaExistente.fechaFinalizacion;

    // 4️⃣ Validar que el equipo_consultor existe y está activo (si se está cambiando)
    if (datos.asignadoA) {
      const equipoActivo = await this.tareaRepositorio.equipoConsultorEstaActivo(datos.asignadoA);
      this.validaciones.validarEquipoActivo(equipoActivo, datos.asignadoA);
    }

    // 5️⃣ Validar duplicidad si se cambió título o asignadoA
    if (datos.titulo !== undefined || datos.asignadoA !== undefined) {
      const idProyecto = await this.tareaRepositorio.obtenerIdProyecto(effAsignadoA);
      if (!idProyecto) {
        this.validaciones.validarIdProyectoExiste(idProyecto, effAsignadoA);
      } else {
        const tituloExiste = await this.tareaRepositorio.existeTituloEnProyecto(
          idProyecto,
          effTitulo,
          idTarea
        );
        this.validaciones.validarTituloUnico(tituloExiste, effTitulo, idProyecto);
      }
    }

    // 6️⃣ Validar fechas si se está actualizando fechaFinalizacion
    // 6️⃣ Validar fechas si se está actualizando fechaFinalizacion
    if (datos.fechaFinalizacion && tareaExistente.fechaCreacion) {
      this.validaciones.validarFechaPosterior(datos.fechaFinalizacion, tareaExistente.fechaCreacion);
    }

    // 7️⃣ Validar fecha límite dentro del rango del consultor (si se cambió fechaFinalizacion o asignadoA)
    if (datos.fechaFinalizacion !== undefined || datos.asignadoA !== undefined) {
      if (effFechaFinalizacion) {
        const rangoConsultor = await this.tareaRepositorio.obtenerRangoFechasConsultor(effAsignadoA);
        this.validaciones.validarRangoConsultor(rangoConsultor, effFechaFinalizacion, effAsignadoA);
      }
    }

    // 8️⃣ Construir objeto de actualización
    const actualizacion: Partial<ITarea> = {
      titulo: datos.titulo ?? tareaExistente.titulo,
      descripcion: datos.descripcion ?? tareaExistente.descripcion,
      estadoTarea: datos.estadoTarea ?? tareaExistente.estadoTarea,
      fechaFinalizacion: datos.fechaFinalizacion ?? tareaExistente.fechaFinalizacion,
      prioridad: datos.prioridad ?? tareaExistente.prioridad,
      asignadoA: datos.asignadoA ?? tareaExistente.asignadoA,
    };

    // 9️⃣ Realizar la actualización
    const tareaActualizada = await this.tareaRepositorio.actualizarTarea(idTarea, actualizacion);

    if (!tareaActualizada) {
      throw new AppError(`No se pudo actualizar la tarea con ID ${idTarea}`, CodigosHttp.SOLICITUD_INCORRECTA);
    }

    return tareaActualizada;
  }

  async eliminarTarea(idTarea: string): Promise<void> {
    // 1️⃣ Verificar que la tarea existe
    const tareaExistente = await this.tareaRepositorio.obtenerTareaPorId(idTarea);

    if (!tareaExistente) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, CodigosHttp.SOLICITUD_INCORRECTA);
    }

    // 2️⃣ Verificar que no esté ya eliminada
    if (tareaExistente.estado === "Eliminado") {
      throw new AppError(`La tarea con ID ${idTarea} ya está eliminada.`, CodigosHttp.SOLICITUD_INCORRECTA);
    }

    // 3️⃣ Eliminar la tarea
    await this.tareaRepositorio.eliminarTarea(idTarea);

  }
}
