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

  async crear(datos: IEquipoConsultor): Promise<IEquipoConsultor> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(datos.idConsultor);
    if (!consultor) throw new AppError("El consultor especificado no existe.");

    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(datos.idEquipoProyecto);
    if (!equipo) throw new AppError("El equipo del proyecto no existe.");

    const rolExiste = await this.asignacionRepositorio.rolExiste(datos.idRol);
    if (!rolExiste) throw new AppError("El rol especificado no existe o está inactivo.");

    const asignacionesEquipo = await this.asignacionRepositorio.obtenerPorEquipo(datos.idEquipoProyecto);

    const existeDuplicado = asignacionesEquipo.some(
      (a: IEquipoConsultor) =>
        a.idConsultor === datos.idConsultor &&
        a.idRol === datos.idRol &&
        a.estado === "Activo"
    );

    if (existeDuplicado) throw new AppError("Este consultor ya está asignado a este equipo con este rol.");

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
    if (fechaFin < fechaInicio)
      throw new AppError("La fecha de fin debe ser posterior o igual a la fecha de inicio.");

    const asignacionesConsultor = await this.asignacionRepositorio.obtenerPorConsultor(datos.idConsultor);

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

    return await this.asignacionRepositorio.crear(nuevaAsignacion);
  }

  async obtenerPorId(idAsignacion: string): Promise<IEquipoConsultor | null> {
    const asignacion = await this.asignacionRepositorio.obtenerPorId(idAsignacion);

    if (!asignacion || asignacion.estado === "Eliminado") {
      throw new AppError(`No se encontró la asignación con ID ${idAsignacion}`);
    }

    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(asignacion.idConsultor);
    if (!consultor || consultor.estado === "Eliminado") {
      throw new AppError("El consultor asociado ya no existe.");
    }

    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(asignacion.idEquipoProyecto);
    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError("El equipo asociado ya no existe.");
    }

    return asignacion;
  }

  async obtenerPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);
    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }

    return await this.asignacionRepositorio.obtenerPorEquipo(idEquipoProyecto);
  }

  async obtenerPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);
    if (!consultor || consultor.estado === "Eliminado") {
      throw new AppError(`No se encontró el consultor con ID ${idConsultor}`);
    }

    return await this.asignacionRepositorio.obtenerPorConsultor(idConsultor);
  }

  async actualizar(id: string, datos: Partial<IEquipoConsultor>): Promise<IEquipoConsultor> {
    const asignacionExistente = await this.asignacionRepositorio.obtenerPorId(id);

    if (!asignacionExistente || asignacionExistente.estado === "Eliminado") {
      throw new AppError("La asignación no existe.");
    }

    if (datos.idRol) {
      const rolExiste = await this.asignacionRepositorio.rolExiste(datos.idRol);
      if (!rolExiste) throw new AppError("El rol especificado no existe o está inactivo.");
    }

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

    if (datos.porcentajeDedicacion || datos.fechaInicio || datos.fechaFin) {
      const otrasAsignaciones = await this.asignacionRepositorio.obtenerPorConsultor(
        asignacionExistente.idConsultor
      );

      const dedicacionTraslapada = otrasAsignaciones
        .filter((a: IEquipoConsultor) => a.idEquipoConsultores !== id && a.estado === "Activo")
        .filter((a: IEquipoConsultor) => {
          const ini = new Date(a.fechaInicio);
          const fin = new Date(a.fechaFin);
          return nuevaFechaInicio <= fin && nuevaFechaFin >= ini;
        })
        .reduce((s: number, a: IEquipoConsultor) => s + a.porcentajeDedicacion, 0);

      const nuevoPorcentaje =
        datos.porcentajeDedicacion ?? asignacionExistente.porcentajeDedicacion;

      const total = dedicacionTraslapada + nuevoPorcentaje;

      if (total > 100) {
        throw new AppError(
          `La dedicación total sería ${total}%, lo cual excede el máximo permitido (100%).`
        );
      }
    }

    return await this.asignacionRepositorio.actualizar(id, {
      ...asignacionExistente,
      ...datos
    });
  }

  async eliminar(id: string): Promise<IEquipoConsultor> {
    const asignacion = await this.asignacionRepositorio.obtenerPorId(id);

    if (!asignacion || asignacion.estado === "Eliminado") {
      throw new AppError("La asignación no existe.");
    }

    return await this.asignacionRepositorio.eliminar(id);
  }
}
