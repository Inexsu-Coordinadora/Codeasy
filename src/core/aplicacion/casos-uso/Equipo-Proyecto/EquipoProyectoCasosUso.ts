import type { IEquipoProyecto } from "../../../dominio/equipo-proyecto/IEquipoProyecto";
import { EquipoProyecto } from "../../../dominio/equipo-proyecto/EquipoProyecto";
import type { IEquipoProyectoRepositorio } from "../../../dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio";
import type { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import type { IEquipoConsultorRepositorio } from "../../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError";

export class EquipoProyectoCasosUso {
  constructor(
    private equipoProyectoRepositorio: IEquipoProyectoRepositorio,
    private proyectoRepositorio: IProyectoRepositorio,
    private equipoConsultorRepositorio: IEquipoConsultorRepositorio
  ) {}

  // Crear equipo de proyecto
  async crearEquipoProyecto(datos: IEquipoProyecto): Promise<IEquipoProyecto> {
    const proyectoExiste = await this.proyectoRepositorio.obtenerProyectoPorId(datos.idProyecto);
    if (!proyectoExiste) throw new AppError("El proyecto especificado no existe.");

    const equipoExistente = await this.equipoProyectoRepositorio.obtenerPorProyecto(datos.idProyecto);
    if (equipoExistente) {
      throw new AppError("Este proyecto ya tiene un equipo creado.");
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(datos.fechaInicio);
    const fechaFin = new Date(datos.fechaFin);

    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    // Validar fechas válidas
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new AppError("Las fechas proporcionadas no son válidas.");
    }

    // Validar que no sean antes de hoy
    if (fechaInicio < hoy) {
      throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (fechaFin < hoy) {
      throw new AppError("La fecha de fin no puede ser anterior a la fecha actual.");
    }

    // Validar coherencia entre fechas
    if (fechaFin < fechaInicio) {
      throw new AppError("La fecha de fin debe ser igual o posterior a la fecha de inicio.");
    }

    const nuevoEquipo = new EquipoProyecto(
      undefined,
      datos.idProyecto,
      datos.nombre,
      fechaInicio,
      fechaFin,
      "Activo"
    );

    return await this.equipoProyectoRepositorio.crearEquipoProyecto(nuevoEquipo);
  }

  // Obtener equipo por ID
  async obtenerEquipoPorId(idEquipoProyecto: string): Promise<IEquipoProyecto> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);

    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }

    return equipo;
  }

  // Obtener equipo por proyecto
  async obtenerEquipoPorProyecto(idProyecto: string): Promise<IEquipoProyecto> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorProyecto(idProyecto);

    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError("El proyecto no tiene un equipo creado.");
    }

    return equipo;
  }

  // Listar todos los equipos activos
  async listarEquipos(): Promise<IEquipoProyecto[]> {
    return await this.equipoProyectoRepositorio.listarEquipos();
  }

  // Actualizar equipo
  async actualizarEquipoProyecto(
    idEquipoProyecto: string,
    datos: Partial<IEquipoProyecto>
  ): Promise<IEquipoProyecto> {
  
    const equipoExistente = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);

    if (!equipoExistente || equipoExistente.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // VALIDACIÓN DE FECHA INICIO
    if (datos.fechaInicio) {
      const fechaInicio = new Date(datos.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);

      if (isNaN(fechaInicio.getTime())) {
        throw new AppError("La fecha de inicio no es válida.");
      }
      if (fechaInicio < hoy) {
        throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
      }
    }

    // VALIDACIÓN DE FECHA FIN
    if (datos.fechaFin) {
      const fechaFin = new Date(datos.fechaFin);
      fechaFin.setHours(0, 0, 0, 0);

      if (isNaN(fechaFin.getTime())) {
        throw new AppError("La fecha de fin no es válida.");
      }
      if (fechaFin < hoy) {
        throw new AppError("La fecha de fin no puede ser anterior a la fecha actual.");
      }

      // Validación coherencia fechaInicio < fechaFin
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

    const equipoActualizado = {
      ...equipoExistente,
      ...datos,
    } as IEquipoProyecto;

    return await this.equipoProyectoRepositorio.actualizarEquipoProyecto(
      idEquipoProyecto,
      equipoActualizado
    );
  }


  // Eliminar equipo (lógico)
  async eliminarEquipoProyecto(idEquipoProyecto: string): Promise<IEquipoProyecto> {
    const equipo = await this.equipoProyectoRepositorio.obtenerPorId(idEquipoProyecto);

    if (!equipo || equipo.estado === "Eliminado") {
      throw new AppError(`No se encontró el equipo con ID ${idEquipoProyecto}`);
    }

    // Eliminar asignaciones asociadas a este equipo
    await this.equipoConsultorRepositorio.eliminarPorEquipo(idEquipoProyecto);

    return await this.equipoProyectoRepositorio.eliminarEquipoProyecto(idEquipoProyecto);
  }
}
