import { IProyectoRepositorio } from "../../../dominio/repositorios/IProyectoRepositorio";
import { IClienteRepositorio } from "../../../dominio/repositorios/IClienteRepositorio";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError";
import { Proyecto } from "../../../dominio/entidades/Proyecto";

export class ConsultarProyectosPorClienteCasosUso {
  constructor(
    private readonly proyectoRepositorio: IProyectoRepositorio,
    private readonly clienteRepositorio: IClienteRepositorio
  ) {}

 async ejecutar(
    idCliente: string,
    filtros?: { estado?: string; fecha_inicio?: Date; fecha_fin?: Date }
  ): Promise<{ proyectos: Proyecto[]; mensaje?: string }> {
    const clienteExiste = await this.clienteRepositorio.obtenerClientePorId(idCliente);

   if (!clienteExiste) {
      throw new AppError("Cliente no encontrado", idCliente, 404);
    }

    const proyectos = await this.proyectoRepositorio.obtenerPorCliente(idCliente, filtros);

   if (!proyectos || proyectos.length === 0) {
      // ✅ Cliente existe pero no tiene proyectos: lista vacía (no error)
      return {
        proyectos: [],
        mensaje: `El cliente con id ${idCliente} no tiene proyectos registrados.`,
      };
    }

     return { proyectos };
}}
