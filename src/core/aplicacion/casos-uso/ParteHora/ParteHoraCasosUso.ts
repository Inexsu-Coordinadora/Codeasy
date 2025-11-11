// src/aplicacion/parteHora/casosUso/ParteHoraCasosUso.ts
import { IParteHora } from "../../../dominio/parteHora/IParteHora";
import { ParteHora } from "../../../dominio/parteHora/ParteHora";
import { IParteHoraRepositorio } from "../../../dominio/parteHora/repositorio/IParteHoraRepositorio";
import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import { IConsultorRepositorio } from "../../../dominio/consultor/repositorio/IConsultorRepositorio";

interface RegistrarParteHoraDTO {
  id_proyecto: string;
  id_consultor: string;
  fecha: Date;
  cantidad_horas: number;
  descripcion: string;
}

export class ParteHoraCasosUso {
  constructor(
    private parteHoraRepositorio: IParteHoraRepositorio,
    private proyectoRepositorio: IProyectoRepositorio,
    private consultorRepositorio: IConsultorRepositorio,
    private staffProyectoRepositorio: IStaffProyectoRepositorio
  ) {}

  async registrarParteHora(datos: RegistrarParteHoraDTO): Promise<IParteHora> {
    // Verificar que el proyecto exista
    const proyecto = await this.proyectoRepositorio.obtenerProyectoPorId(datos.id_proyecto);
    if (!proyecto || proyecto.estatus === "Eliminado") {
      throw new Error(`Proyecto inexistente: No se encontró el proyecto con ID ${datos.id_proyecto}`);
    }

    // Verificar que el consultor exista
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(datos.id_consultor);
    if (!consultor || consultor.estado === "Eliminado") {
      throw new Error(`Consultor inexistente: No se encontró el consultor con ID ${datos.id_consultor}`);
    }

    // Validar cantidad de horas
    if (datos.cantidad_horas <= 0 || datos.cantidad_horas > 24) {
      throw new Error(`Cantidad de horas inválida: ${datos.cantidad_horas}`);
    }

    // Validar asignación del consultor al proyecto en la fecha
    const asignaciones = await this.staffProyectoRepositorio.obtenerAsignacionesPorConsultor(datos.id_consultor);
    const fechaRegistro = new Date(datos.fecha);
    fechaRegistro.setHours(0, 0, 0, 0);

    const asignacionValida = asignaciones.find((asig) => {
      const esDelProyecto = asig.id_proyecto === datos.id_proyecto;
      const fechaInicio = new Date(asig.fecha_inicio);
      const fechaFin = new Date(asig.fecha_fin);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin.setHours(0, 0, 0, 0);

      return esDelProyecto && fechaRegistro >= fechaInicio && fechaRegistro <= fechaFin;
    });

    if (!asignacionValida) {
      throw new Error(`Consultor no asignado o fecha fuera del rango de asignación.`);
    }

    // Validar duplicidad exacta
    const existeDuplicado = await this.parteHoraRepositorio.buscarDuplicado(
      datos.id_proyecto,
      datos.id_consultor,
      fechaRegistro,
      datos.descripcion
    );
    if (existeDuplicado) {
      throw new Error("Registro duplicado: Ya existe un parte de horas con estos datos.");
    }

    // Registrar parte de horas
    const nuevoParteHora = new ParteHora(
      undefined,
      datos.id_proyecto,
      datos.id_consultor,
      fechaRegistro,
      datos.cantidad_horas,
      datos.descripcion,
      "Activo"
    );

    return await this.parteHoraRepositorio.registrarParteHora(nuevoParteHora);
  }

  async consultarPartesPorProyecto(id_proyecto: string): Promise<IParteHora[]> {
    const proyecto = await this.proyectoRepositorio.obtenerProyectoPorId(id_proyecto);
    if (!proyecto || proyecto.estatus === "Eliminado") {
      throw new Error(`Proyecto inexistente: ID ${id_proyecto}`);
    }
    return await this.parteHoraRepositorio.obtenerPartesPorProyecto(id_proyecto);
  }

  async consultarPartesPorConsultor(id_consultor: string): Promise<IParteHora[]> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(id_consultor);
    if (!consultor || consultor.estado === "Eliminado") {
      throw new Error(`Consultor inexistente: ID ${id_consultor}`);
    }
    return await this.parteHoraRepositorio.obtenerPartesPorConsultor(id_consultor);
  }
}
