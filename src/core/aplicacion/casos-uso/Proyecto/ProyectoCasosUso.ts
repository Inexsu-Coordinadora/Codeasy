import { IProyecto } from "../../../dominio/proyecto/IProyecto.js";
import { Proyecto } from "../../../dominio/proyecto/Proyecto.js";
import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio.js";
import type { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio.js";
import type { IEquipoProyectoRepositorio } from "../../../dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio.js";
import { AppError } from "../../../../common/middlewares/AppError.js";

export class ProyectoCasosUso {
  constructor(
    private proyectoRepositorio: IProyectoRepositorio,
    private clienteRepositorio: IClienteRepositorio,
    private equipoProyectoRepositorio: IEquipoProyectoRepositorio
  ) { }

  async crear(datos: IProyecto): Promise<IProyecto> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(datos.fechaInicio);
    const fechaEntrega = new Date(datos.fechaEntrega);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaEntrega.setHours(0, 0, 0, 0);

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

    const cliente = await this.clienteRepositorio.buscarPorIdCliente(datos.idCliente);
    if (!cliente) {
      throw new AppError("El cliente especificado no existe.");
    }

    const proyectosCliente = await this.proyectoRepositorio.obtenerPorCliente(datos.idCliente);

    const existeDuplicado = proyectosCliente.some(
      (p: IProyecto) =>
        p.nombre.trim().toLowerCase() === datos.nombre.trim().toLowerCase() &&
        p.estado === "Activo"
    );

    if (existeDuplicado) {
      throw new AppError("El cliente ya tiene un proyecto con ese nombre.");
    }

    const nuevoProyecto = new Proyecto(
      undefined,
      datos.nombre,
      datos.descripcion,
      datos.estadoProyecto || "Creado",
      datos.estado || "Activo",
      datos.idCliente,
      fechaInicio,
      fechaEntrega,
      new Date()
    );

    return await this.proyectoRepositorio.crear(nuevoProyecto);
  }

  async obtenerTodos(): Promise<IProyecto[]> {
    return await this.proyectoRepositorio.obtenerTodos();
  }

  async obtenerPorId(idProyecto: string): Promise<IProyecto | null> {
    const proyecto = await this.proyectoRepositorio.obtenerPorId(idProyecto);
    if (!proyecto) {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }
    return proyecto;
  }

  async obtenerPorCliente(idCliente: string): Promise<IProyecto[]> {
    const cliente = await this.clienteRepositorio.buscarPorIdCliente(idCliente);
    if (!cliente) {
      throw new AppError("El cliente especificado no existe.");
    }
    return await this.proyectoRepositorio.obtenerPorCliente(idCliente);
  }

  async actualizar(idProyecto: string, datos: IProyecto): Promise<IProyecto> {
    const proyectoExistente = await this.proyectoRepositorio.obtenerPorId(idProyecto);
    if (!proyectoExistente) {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (datos.fechaInicio) {
      const fechaInicio = new Date(datos.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      if (isNaN(fechaInicio.getTime())) throw new AppError("La fecha de inicio no es válida.");
      if (fechaInicio < hoy) throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (datos.fechaEntrega) {
      const fechaEntrega = new Date(datos.fechaEntrega);
      fechaEntrega.setHours(0, 0, 0, 0);
      if (isNaN(fechaEntrega.getTime())) throw new AppError("La fecha de entrega no es válida.");
      if (fechaEntrega < hoy) throw new AppError("La fecha de entrega no puede ser anterior a la fecha actual.");

      if (datos.fechaInicio) {
        const fechaInicio = new Date(datos.fechaInicio);
        fechaInicio.setHours(0, 0, 0, 0);
        if (fechaEntrega <= fechaInicio)
          throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio.");
      } else if (proyectoExistente.fechaInicio && fechaEntrega <= proyectoExistente.fechaInicio) {
        throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio actual.");
      }
    }

    const proyectoActualizado = { ...proyectoExistente, ...datos } as IProyecto;

    return await this.proyectoRepositorio.actualizar(idProyecto, proyectoActualizado);
  }

  async eliminar(idProyecto: string): Promise<void> {
    const proyecto = await this.proyectoRepositorio.obtenerPorId(idProyecto);
    if (!proyecto || proyecto.estado === "Eliminado") {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }

    const equipo = await this.equipoProyectoRepositorio.obtenerPorProyecto(idProyecto);
    if (equipo && equipo.estado === "Activo") {
      await this.equipoProyectoRepositorio.eliminar(equipo.idEquipoProyecto!);
    }

    proyecto.estado = "Eliminado";
    await this.proyectoRepositorio.actualizar(idProyecto, proyecto);
  }
}