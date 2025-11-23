import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";
import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import { ProyectoCrearDTO } from "../../../../presentacion/esquemas/Proyectos/proyectoCrearEsquema";
import { ProyectoActualizarDTO } from "../../../../presentacion/esquemas/Proyectos/ProyectoActualizarEsquema";
import type { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio";
import type { IEquipoProyectoRepositorio } from "../../../dominio/equipo-proyecto/repositorio/IEquipoProyectoRepositorio";
import { AppError } from "../../../../common/middlewares/AppError";

export class ProyectoCasosUso {
  constructor(
    private proyectoRepositorio: IProyectoRepositorio,
    private clienteRepositorio: IClienteRepositorio,
    private equipoProyectoRepositorio: IEquipoProyectoRepositorio
  ) { }

  // Registrar un nuevo proyecto
  async registrarProyecto(datos: ProyectoCrearDTO): Promise<IProyecto> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaInicio = new Date(datos.fechaInicio);
    const fechaEntrega = new Date(datos.fechaEntrega);
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
    // Validar existencia del cliente
    const cliente = await this.clienteRepositorio.buscarPorIdCliente(datos.idCliente);
    if (!cliente) {
      throw new AppError("El cliente especificado no existe.");
    }

    // Validar que el cliente no tenga un proyecto con el mismo nombre
    const proyectosCliente: IProyecto[] = await this.proyectoRepositorio.listarTodosProyectos();
    const existeDuplicado = proyectosCliente.some(
      (p: IProyecto) =>
        p.idCliente === datos.idCliente &&
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
      datos.estadoProyecto || "Creado",
      datos.estado || "Activo",
      datos.idCliente,
      fechaInicio,
      fechaEntrega,
      new Date()
    );

    const proyectoCreado = await this.proyectoRepositorio.crear(nuevoProyecto);
    return proyectoCreado;
  }

  // Listar todos los proyectos activos
  async listarTodosProyectos(): Promise<IProyecto[]> {
    return await this.proyectoRepositorio.obtenerTodos();
  }

  // Obtener un proyecto por ID
  async obtenerProyectoPorId(idProyecto: string): Promise<IProyecto | null> {
    const proyecto = await this.proyectoRepositorio.obtenerPorId(idProyecto);
    if (!proyecto) {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }
    return proyecto;
  }

  // Actualizar un proyecto existente
  async actualizarProyecto(idProyecto: string, datos: ProyectoActualizarDTO): Promise<IProyecto> {
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
      if (fechaInicio < hoy)
        throw new AppError("La fecha de inicio no puede ser anterior a la fecha actual.");
    }

    if (datos.fechaEntrega) {
      const fechaEntrega = new Date(datos.fechaEntrega);
      fechaEntrega.setHours(0, 0, 0, 0);
      if (isNaN(fechaEntrega.getTime())) throw new AppError("La fecha de entrega no es válida.");
      if (fechaEntrega < hoy)
        throw new AppError("La fecha de entrega no puede ser anterior a la fecha actual.");

      // Si también se envía fechaInicio, validar coherencia
      if (datos.fechaInicio) {
        const fechaInicio = new Date(datos.fechaInicio);
        fechaInicio.setHours(0, 0, 0, 0);
        if (fechaEntrega <= fechaInicio)
          throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio.");
      } else if (proyectoExistente.fechaInicio && fechaEntrega <= proyectoExistente.fechaInicio) {
        // Si no se envía fechaInicio nueva, usar la existente
        throw new AppError("La fecha de entrega debe ser posterior a la fecha de inicio actual.");
      }
    }

    const proyectoActualizado = { ...proyectoExistente, ...datos } as IProyecto;
    const resultado = await this.proyectoRepositorio.actualizar(idProyecto, proyectoActualizado);
    return resultado;
  }

  // Eliminar (lógicamente) un proyecto
  async eliminarProyecto(idProyecto: string): Promise<void> {
    const proyecto = await this.proyectoRepositorio.obtenerPorId(idProyecto);

    if (!proyecto || proyecto.estado === "Eliminado") {
      throw new AppError(`No se encontró el proyecto con ID ${idProyecto}`);
    }

    // 1. Buscar equipo asociado
    const equipo = await this.equipoProyectoRepositorio.obtenerPorProyecto(idProyecto);

    // 2. Si existe y está activo → eliminar lógicamente el equipo
    if (equipo && equipo.estado === "Activo") {
      await this.equipoProyectoRepositorio.eliminarEquipoProyecto(equipo.idEquipoProyecto!);
    }

    // 3. Eliminar lógicamente el proyecto
    proyecto.estado = "Eliminado";

    await this.proyectoRepositorio.actualizar(idProyecto, proyecto);
  }
}