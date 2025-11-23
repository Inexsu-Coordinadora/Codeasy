import type { IEquipoProyecto } from "../../../dominio/equipo-proyecto/IEquipoProyecto";
import { EquipoProyecto } from "../../../dominio/equipo-proyecto/EquipoProyecto";
import type { IEquipoProyectoRepositorio } from "../../../dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio";
import type { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import type { IEquipoConsultorRepositorio } from "../../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio";
import { AppError } from "../../../../common/middlewares/AppError";

export class EquipoProyectoCasosUso {
  constructor(
    private equipoProyectoRepositorio: IEquipoProyectoRepositorio,
    private proyectoRepositorio: IProyectoRepositorio,
    private equipoConsultorRepositorio: IEquipoConsultorRepositorio
  ) {}

  async crear(datos: IEquipoProyecto): Promise<IEquipoProyecto> {
    const proyectoExiste = await this.proyectoRepositorio.obtenerPorId(datos.idProyecto);
    if (!proyectoExiste) throw new AppError("El proyecto especificado no existe.");

    const equipoExistente = await this.equipoProyectoRepositorio.obtenerPorProyecto(datos.idProyecto);
    if (equipoExistente) throw new AppError("Este proyecto ya tiene un equipo creado.");

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
    if (fechaFin < hoy) throw new AppError("La fecha de fin no puede ser anterior a la fecha actual.");
    if (fechaFin < fechaInicio) throw new AppError("La fecha de fin debe ser igual o posterior a la fecha de inicio.");

    const nuevoEquipo = new EquipoProyecto(
      undefined,
      datos.idProyecto,
      datos.nombre,
      fechaInicio,
      fechaFin,
      "Activo"
    );

    return await this.equipoProyectoRepositorio.crear(nuevoEquipo);
  }

  async obtenerPorId(idEquipoProyecto: string): Promise<IEquipoProyecto> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);
    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }
    return equipo;
  }

  async obtenerPorProyecto(idProyecto: string): Promise<IEquipoProyecto> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorProyecto(idProyecto);
    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError("El proyecto no tiene un equipo creado.");
    }
    return equipo;
  }

  async obtenerTodos(): Promise<IEquipoProyecto[]> {
    return await this.equipoProyectoRepositorio.obtenerTodos();
  }

  async actualizar(idEquipoProyecto: string, datos: Partial<IEquipoProyecto>): Promise<IEquipoProyecto> {
    const equipoExistente = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);
    if (!equipoExistente || equipoExistente.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (datos.fechaInicio) {
      const fechaInicio = new Date(datos.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      if (isNaN(fechaInicio.getTime())) throw new AppError("La fecha de inicio no es válida.");
      if (fechaInicio < hoy) throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (datos.fechaFin) {
      const fechaFin = new Date(datos.fechaFin);
      fechaFin.setHours(0, 0, 0, 0);
      if (isNaN(fechaFin.getTime())) throw new AppError("La fecha de fin no es válida.");
      if (fechaFin < hoy) throw new AppError("La fecha de fin no puede ser anterior a la fecha actual.");

      if (datos.fechaInicio) {
        const fechaInicio = new Date(datos.fechaInicio);
        fechaInicio.setHours(0, 0, 0, 0);
        if (fechaFin < fechaInicio) {
          throw new AppError("La fecha de fin debe ser igual o posterior a la fecha de inicio.");
        }
      } else if (fechaFin < equipoExistente.fechaInicio) {
        throw new AppError("La fecha de fin debe ser igual o posterior a la fecha de inicio actual.");
      }
    }

    return await this.equipoProyectoRepositorio.actualizar(idEquipoProyecto, {
      ...equipoExistente,
      ...datos
    });
  }

  async eliminar(idEquipoProyecto: string): Promise<IEquipoProyecto> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);
    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }

    await this.equipoConsultorRepositorio.eliminarPorEquipo(idEquipoProyecto);

    return await this.equipoProyectoRepositorio.eliminar(idEquipoProyecto);
  }
}
