// src/aplicacion/parteHora/casosUso/ParteHoraCasosUso.ts
import { IParteHora } from "../../../dominio/parteHora/IParteHora";
import { ParteHora } from "../../../dominio/parteHora/ParteHora";
import { IParteHoraRepositorio } from "../../../dominio/parteHora/repositorio/IParteHoraRepositorio";
import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import { IConsultorRepositorio } from "../../../dominio/consultor/repositorio/IConsultorRepositorio";
import { IStaffProyectoRepositorio } from "../../../dominio/staffProyecto/repositorio/IStaffProyectoRepositorio";

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
    // 1. Verificar que el proyecto exista
    const proyecto = await this.proyectoRepositorio.obtenerProyectoPorId(datos.id_proyecto);
    if (!proyecto || proyecto.estatus === 'Eliminado') {
      throw new Error(`Proyecto inexistente: No se encontró el proyecto con ID ${datos.id_proyecto}`);
    }

    // 2. Verificar que el consultor exista
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(datos.id_consultor);
    if (!consultor || consultor.estado === 'Eliminado') {
      throw new Error(`Consultor inexistente: No se encontró el consultor con ID ${datos.id_consultor}`);
    }

    // 3. Validar cantidad de horas ANTES de validar asignación
    if (datos.cantidad_horas <= 0) {
      throw new Error(
        `Cantidad de horas inválida: El valor debe ser mayor a 0. Valor recibido: ${datos.cantidad_horas}`
      );
    }
    if (datos.cantidad_horas > 24) {
      throw new Error(
        `Cantidad de horas inválida: No puede superar 24 horas por día. Valor recibido: ${datos.cantidad_horas}`
      );
    }

    // 4. Validar que el consultor esté asignado al proyecto
    const asignaciones = await this.staffProyectoRepositorio.obtenerAsignacionesPorConsultor(
      datos.id_consultor
    );
    
    const fechaRegistro = new Date(datos.fecha);
    fechaRegistro.setHours(0, 0, 0, 0);
    
    const asignacionValida = asignaciones.find((asig) => {
      const esDelProyecto = asig.id_proyecto === datos.id_proyecto;
      const fechaInicio = new Date(asig.fecha_inicio);
      const fechaFin = new Date(asig.fecha_fin);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin.setHours(0, 0, 0, 0);
      
      const dentroDelRango = fechaRegistro >= fechaInicio && fechaRegistro <= fechaFin;
      return esDelProyecto && dentroDelRango;
    });

    if (!asignacionValida) {
      // Verificar si el consultor está asignado al proyecto (sin importar fechas)
      const tieneAsignacion = asignaciones.some(asig => asig.id_proyecto === datos.id_proyecto);
      
      if (!tieneAsignacion) {
        throw new Error(
          `Consultor no asignado al proyecto: El consultor ${datos.id_consultor} no tiene asignación al proyecto ${datos.id_proyecto}`
        );
      } else {
        // Está asignado pero la fecha está fuera de rango
        const asignacionProyecto = asignaciones.find(asig => asig.id_proyecto === datos.id_proyecto);
        const fechaInicioStr = new Date(asignacionProyecto!.fecha_inicio).toISOString().split('T')[0];
        const fechaFinStr = new Date(asignacionProyecto!.fecha_fin).toISOString().split('T')[0];
        
        throw new Error(
          `Fecha fuera del rango de asignación: La fecha ${fechaRegistro.toISOString().split('T')[0]} está fuera del rango de asignación del consultor (${fechaInicioStr} a ${fechaFinStr})`
        );
      }
    }

    // 5. Validar duplicidad exacta
    const existeDuplicado = await this.parteHoraRepositorio.buscarDuplicado(
      datos.id_proyecto,
      datos.id_consultor,
      fechaRegistro,
      datos.descripcion
    );
    
    if (existeDuplicado) {
      throw new Error(
        `Registro duplicado: Ya existe un parte de horas para el consultor ${datos.id_consultor} en el proyecto ${datos.id_proyecto} con fecha ${fechaRegistro.toISOString().split('T')[0]} y descripción "${datos.descripcion}"`
      );
    }

    // 6. Registrar el parte de horas
    const nuevoParteHora = new ParteHora(
      undefined,
      datos.id_proyecto,
      datos.id_consultor,
      fechaRegistro,
      datos.cantidad_horas,
      datos.descripcion,
      'Activo'
    );

    const parteRegistrado = await this.parteHoraRepositorio.registrarParteHora(nuevoParteHora);
    return parteRegistrado;
  }

  async consultarPartesPorProyecto(id_proyecto: string): Promise<IParteHora[]> {
    // Verificar que el proyecto exista
    const proyecto = await this.proyectoRepositorio.obtenerProyectoPorId(id_proyecto);
    if (!proyecto || proyecto.estatus === 'Eliminado') {
      throw new Error(`Proyecto inexistente: No se encontró el proyecto con ID ${id_proyecto}`);
    }

    return await this.parteHoraRepositorio.obtenerPartesPorProyecto(id_proyecto);
  }

  async consultarPartesPorConsultor(id_consultor: string): Promise<IParteHora[]> {
    // Verificar que el consultor exista
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(id_consultor);
    if (!consultor || consultor.estado === 'Eliminado') {
      throw new Error(`Consultor inexistente: No se encontró el consultor con ID ${id_consultor}`);
    }

    return await this.parteHoraRepositorio.obtenerPartesPorConsultor(id_consultor);
  }
}