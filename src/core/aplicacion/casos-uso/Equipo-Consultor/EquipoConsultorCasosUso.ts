import type { IEquipoConsultor } from "../../../dominio/equipos-consultores/IEquipoConsultor";
import { EquipoConsultor } from "../../../dominio/equipos-consultores/EquipoConsultor";
import type { IEquipoConsultorRepositorio } from "../../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio";
import type { IConsultorRepositorio } from "../../../dominio/consultor/repositorio/IConsultorRepositorio";
import type { IEquipoProyectoRepositorio } from "../../../dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError";

export class EquipoConsultorCasosUso {
  constructor(
    private asignacionRepositorio: IEquipoConsultorRepositorio,
    private consultorRepositorio: IConsultorRepositorio,
    private equipoProyectoRepositorio: IEquipoProyectoRepositorio
  ) {}

  // CREAR ASIGNACIÓN
  async crearAsignacion(datos: IEquipoConsultor): Promise<IEquipoConsultor> {
    // 1. Validar consultor
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(datos.idConsultor);
    if (!consultor) throw new AppError("El consultor especificado no existe.");

    // 2. Validar equipo
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(datos.idEquipoProyecto);
    if (!equipo) throw new AppError("El equipo del proyecto no existe.");

    // 3. Validar rol desde BD
    const rolExiste = await this.asignacionRepositorio.rolExiste(datos.idRol);
    if (!rolExiste) throw new AppError("El rol especificado no existe o está inactivo.");

    // 4. Validar duplicidad
    const asignacionesEquipo = await this.asignacionRepositorio.listarPorEquipo(datos.idEquipoProyecto);

    const existeDuplicado = asignacionesEquipo.some(
      (a: IEquipoConsultor) =>
        a.idConsultor === datos.idConsultor &&
        a.idRol === datos.idRol &&
        a.estado === "Activo"
    );

    if (existeDuplicado) {
      throw new AppError("Este consultor ya está asignado a este equipo con este rol.");
    }

    // 5. Validaciones de fechas
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(datos.fechaInicio);
    const fechaFin = new Date(datos.fechaFin);

    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new AppError("Las fechas proporcionadas no son válidas.");
    }
    if (fechaInicio < hoy) throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    if (fechaFin < fechaInicio) throw new AppError("La fecha de fin debe ser posterior o igual a la fecha de inicio.");

    // 6. Validar Dedicación Global
    const asignacionesConsultor = await this.asignacionRepositorio.listarPorConsultor(datos.idConsultor);

    const dedicacionTraslapada = asignacionesConsultor
      .filter((a: IEquipoConsultor) => a.estado === "Activo")
      .filter((a: IEquipoConsultor) => {
        const ini = new Date(a.fechaInicio);
        const fin = new Date(a.fechaFin);
        return fechaInicio <= fin && fechaFin >= ini;
      })
      .reduce((suma: number, a: IEquipoConsultor) => suma + a.porcentajeDedicacion, 0);

    const total = dedicacionTraslapada + datos.porcentajeDedicacion;

    if (total > 100) {
      throw new AppError(`La dedicación total sería ${total}%, lo cual excede el límite del 100%.`);
    }

    // 7. Crear asignación
    const nuevaAsignacion = new EquipoConsultor(
      undefined,
      datos.idConsultor,
      datos.idEquipoProyecto,
      datos.idRol,
      "Activo",
      datos.porcentajeDedicacion,
      fechaInicio,
      fechaFin
    );

    return await this.asignacionRepositorio.crearAsignacion(nuevaAsignacion);
  }

  // OBTENER ASIGNACIÓN POR ID
  async obtenerAsignacionPorId(idAsignacion: string): Promise<IEquipoConsultor | null> {
    const asignacion = await this.asignacionRepositorio.obtenerPorId(idAsignacion);

    if (!asignacion || asignacion.estado === "Eliminado") {
      throw new AppError(`No se encontró la asignación con ID ${idAsignacion}`);
    }

    // Validar consultor
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(asignacion.idConsultor);
    if (!consultor || consultor.estado === "Eliminado") {
      throw new AppError(`El consultor asociado a esta asignación ya no existe.`);
    }

    // Validar equipo
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(asignacion.idEquipoProyecto);
    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`El equipo asociado a esta asignación ya no existe.`);
    }

    return asignacion;
  }

  // LISTAR POR EQUIPO
  async listarAsignacionesPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);

    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo de proyecto con ID ${idEquipoProyecto}`);
    }

    return await this.asignacionRepositorio.listarPorEquipo(idEquipoProyecto);
  }

  // LISTAR POR CONSULTOR
  async listarAsignacionesPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

    if (!consultor || consultor.estado === "Eliminado") {
      throw new AppError(`No se encontró el consultor con ID ${idConsultor}`);
    }

    return await this.asignacionRepositorio.listarPorConsultor(idConsultor);
  } 

  // ACTUALIZAR ASIGNACIÓN
  async actualizarAsignacion(
    id: string,
    datos: Partial<IEquipoConsultor>
  ): Promise<IEquipoConsultor> {

    const asignacionExistente = await this.asignacionRepositorio.obtenerPorId(id);
    
    if (!asignacionExistente || asignacionExistente.estado === "Eliminado") {
      throw new AppError("La asignación no existe.");
    }

    // Validar rol si se envía
    if (datos.idRol) {
      const rolExiste = await this.asignacionRepositorio.rolExiste(datos.idRol);
      if (!rolExiste) throw new AppError("El rol especificado no existe o está inactivo.");
    }

    // VALIDAR FECHAS
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const nuevaFechaInicio = datos.fechaInicio
      ? new Date(datos.fechaInicio)
      : new Date(asignacionExistente.fechaInicio);

    const nuevaFechaFin = datos.fechaFin
      ? new Date(datos.fechaFin)
      : new Date(asignacionExistente.fechaFin);

    nuevaFechaInicio.setHours(0, 0, 0, 0);
    nuevaFechaFin.setHours(0, 0, 0, 0);

    if (isNaN(nuevaFechaInicio.getTime()) || isNaN(nuevaFechaFin.getTime())) {
      throw new AppError("Las fechas proporcionadas no son válidas.");
    }

    if (nuevaFechaInicio < hoy) {
      throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (nuevaFechaFin < nuevaFechaInicio) {
      throw new AppError("La fecha de fin debe ser posterior o igual a la fecha de inicio.");
    }

    // VALIDAR DEDICACIÓN GLOBAL SI FECHAS O DEDICACIÓN CAMBIA
    if (datos.porcentajeDedicacion || datos.fechaInicio || datos.fechaFin) {
      const otrasAsignaciones = await this.asignacionRepositorio.listarPorConsultor(
        asignacionExistente.idConsultor
      );

      const dedicacionTraslapada = otrasAsignaciones
        .filter((a: IEquipoConsultor) => a.idEquipoConsultores !== id && a.estado === "Activo")
        .filter((a: IEquipoConsultor) => {
          const ini = new Date(a.fechaInicio);
          const fin = new Date(a.fechaFin);
          return nuevaFechaInicio <= fin && nuevaFechaFin >= ini;
        })
        .reduce((suma: number, a: IEquipoConsultor) => suma + a.porcentajeDedicacion, 0);

      const nuevoPorcentaje =
        datos.porcentajeDedicacion ?? asignacionExistente.porcentajeDedicacion;

      const total = dedicacionTraslapada + nuevoPorcentaje;

      if (total > 100) {
        throw new AppError(
          `La dedicación total sería ${total}%, lo cual excede el máximo permitido (100%).`
        );
      }
    }

    const asignacionActualizada = { ...asignacionExistente, ...datos };

    return await this.asignacionRepositorio.actualizarAsignacion(id, asignacionActualizada);
  }

  // ELIMINAR ASIGNACIÓN (LÓGICO)
  async eliminarAsignacion(id: string): Promise<IEquipoConsultor> {
    const asignacion = await this.asignacionRepositorio.obtenerPorId(id);

    if (!asignacion || asignacion.estado === "Eliminado") {
      throw new AppError("La asignación no existe.");
    }

    return await this.asignacionRepositorio.eliminarAsignacion(id);
  }
}
