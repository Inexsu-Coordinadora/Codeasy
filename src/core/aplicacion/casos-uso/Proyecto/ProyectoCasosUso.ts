import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";
import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import { ProyectoCrearDTO } from "../../../../presentacion/esquemas/Proyectos/proyectoCrearEsquema";
import { ProyectoActualizarDTO } from "../../../../presentacion/esquemas/Proyectos/ProyectoActualizarEsquema";
import type { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError";

export class ProyectoCasosUso {
  constructor(
    private proyectoRepositorio: IProyectoRepositorio,     
    private clienteRepositorio: IClienteRepositorio
) {}

  // Registrar un nuevo proyecto
  async registrarProyecto(datos: ProyectoCrearDTO): Promise<IProyecto> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha_inicio = new Date(datos.fecha_inicio);
    const fecha_entrega = new Date(datos.fecha_entrega);
    fecha_inicio.setHours(0, 0, 0, 0);
    fecha_entrega.setHours(0, 0, 0, 0);

    // Validaciones de negocio
    if (isNaN(fecha_inicio.getTime()) || isNaN(fecha_entrega.getTime())) {
      throw new AppError("Las fechas proporcionadas no son válidas.");
    }
    if (fecha_inicio < hoy) {
      throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }
    if (fecha_entrega < hoy) {
      throw new AppError("La fecha de entrega no puede ser anterior a la fecha actual.");
    }
    if (fecha_entrega <= fecha_inicio) {
      throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio.");
    }
      // Validar existencia del cliente
      const cliente = await this.clienteRepositorio.obtenerClientePorId(datos.id_cliente);
    if (!cliente) {
      throw new AppError("El cliente especificado no existe.");
    }

    // Validar que el cliente no tenga un proyecto con el mismo nombre
    const proyectosCliente: IProyecto[] = await this.proyectoRepositorio.listarTodosProyectos();
    const existeDuplicado = proyectosCliente.some(
      (p: IProyecto) =>
        p.id_cliente === datos.id_cliente &&
        p.nombre.trim().toLowerCase() === datos.nombre.trim().toLowerCase() &&
        p.estado === "Activo"
    );

    if (existeDuplicado) {
      throw new AppError("El cliente ya tiene un proyecto con ese nombre.");
    }

    const nuevoProyecto = new Proyecto(
      0,
      datos.nombre,
      datos.descripcion,
      datos.estado_proyecto || "Creado",
      datos.estado || "Activo",
      datos.id_cliente,
      fecha_inicio,
      fecha_entrega,
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
      const fecha_inicio = new Date(datos.fecha_inicio);
      fecha_inicio.setHours(0, 0, 0, 0);
      if (isNaN(fecha_inicio.getTime())) throw new AppError("La fecha de inicio no es válida.");
      if (fecha_inicio < hoy)
        throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (datos.fecha_entrega) {
      const fecha_entrega = new Date(datos.fecha_entrega);
      fecha_entrega.setHours(0, 0, 0, 0);
      if (isNaN(fecha_entrega.getTime())) throw new AppError("La fecha de entrega no es válida.");
      if (fecha_entrega < hoy)
        throw new AppError("La fecha de entrega no puede ser anterior a la fecha actual.");

      // Si también se envía fecha_inicio, validar coherencia
      if (datos.fecha_inicio) {
        const fecha_inicio = new Date(datos.fecha_inicio);
        fecha_inicio.setHours(0, 0, 0, 0);
        if (fecha_entrega <= fecha_inicio)
          throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio.");
      } else if (proyectoExistente.fecha_inicio && fecha_entrega <= proyectoExistente.fecha_inicio) {
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
    if (!proyectoExistente || proyectoExistente.estado === "Eliminado") {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }
    proyectoExistente.estado = "Eliminado";
    await this.proyectoRepositorio.actualizarProyecto(idProyecto, proyectoExistente);
  }
}