import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";
import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import { ProyectoCrearDTO } from "../../../../presentacion/esquemas/";
import { ProyectoActualizarDTO } from "../../../../presentacion/esquemas/ProyectoActualizarEsquema";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError";
import { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio";

export class ProyectoCasosUso {
  constructor(private proyectoRepositorio: IProyectoRepositorio, private clienteRepositorio: IClienteRepositorio) {}

  // Registrar un nuevo proyecto
  async registrarProyecto(datos: ProyectoCrearDTO): Promise<IProyecto> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaInicio = new Date(datos.fecha_inicio);
    const fechaEntrega = new Date(datos.fecha_entrega);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaEntrega.setHours(0, 0, 0, 0);

    // Validaciones de negocio
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaEntrega.getTime())) {
      throw new AppError("Las fechas proporcionadas no son válidas.");
    }
    if (fechaInicio < hoy) {
      throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }
    if (fechaEntrega < hoy) {
      throw new AppError("La fecha de entrega no puede ser anterior a la fecha actual.");
    }
    if (fechaEntrega <= fechaInicio) {
      throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio.");
    }

    const nuevoProyecto = new Proyecto(
      0,
      datos.nombre,
      datos.descripcion,
      datos.estado || "Creado",
      datos.estatus || "Activo",
      datos.id_cliente,
      fechaInicio,
      fechaEntrega,
      new Date()
    );

    const proyectoCreado = await this.proyectoRepositorio.registrarProyecto(nuevoProyecto);
    return proyectoCreado;
  }

  // Listar todos los proyectos activos
  async listarTodosProyectos(): Promise<IProyecto[]> {
    return await this.proyectoRepositorio.listarTodosProyectos();
  }

  // Obtener un proyecto por ID
  async obtenerProyectoPorId(idProyecto: number): Promise<IProyecto | null> {
    const proyecto = await this.proyectoRepositorio.obtenerProyectoPorId(idProyecto);
    if (!proyecto) {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }
    return proyecto;
  }

  // Actualizar un proyecto existente
  async actualizarProyecto(idProyecto: number, datos: ProyectoActualizarDTO): Promise<IProyecto> {
    const proyectoExistente = await this.proyectoRepositorio.obtenerProyectoPorId(idProyecto);
    if (!proyectoExistente) {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (datos.fecha_inicio) {
      const fechaInicio = new Date(datos.fecha_inicio);
      fechaInicio.setHours(0, 0, 0, 0);
      if (isNaN(fechaInicio.getTime())) throw new AppError("La fecha de inicio no es válida.");
      if (fechaInicio < hoy)
        throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (datos.fecha_entrega) {
      const fechaEntrega = new Date(datos.fecha_entrega);
      fechaEntrega.setHours(0, 0, 0, 0);
      if (isNaN(fechaEntrega.getTime())) throw new AppError("La fecha de entrega no es válida.");
      if (fechaEntrega < hoy)
        throw new AppError("La fecha de entrega no puede ser anterior a la fecha actual.");

      // Si también se envía fecha_inicio, validar coherencia
      if (datos.fecha_inicio) {
        const fechaInicio = new Date(datos.fecha_inicio);
        fechaInicio.setHours(0, 0, 0, 0);
        if (fechaEntrega <= fechaInicio)
          throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio.");
      } else if (proyectoExistente.fecha_inicio && fechaEntrega <= proyectoExistente.fecha_inicio) {
        // Si no se envía fecha_inicio nueva, usar la existente
        throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio actual.");
      }
    }

    const proyectoActualizado = { ...proyectoExistente, ...datos } as IProyecto;
    const resultado = await this.proyectoRepositorio.actualizarProyecto(idProyecto, proyectoActualizado);
    return resultado;
  }

  // Eliminar (lógicamente) un proyecto
  async eliminarProyecto(idProyecto: number): Promise<void> {
    const proyectoExistente = await this.proyectoRepositorio.obtenerProyectoPorId(idProyecto);
    if (!proyectoExistente || proyectoExistente.estatus === "Eliminado") {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }
    proyectoExistente.estatus = "Eliminado";
    await this.proyectoRepositorio.actualizarProyecto(idProyecto, proyectoExistente);
  }



 
}
