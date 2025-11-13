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
    id_cliente: string,
    filtros?: { estado?: string; fecha_inicio?: Date; fecha_fin?: Date }
  ): Promise<{ proyectos: Proyecto[]; mensaje?: string }> {
    const clienteExiste = await this.clienteRepositorio.obtenerClientePorId(id_cliente);

   if (!clienteExiste) {
      throw new AppError("Cliente no encontrado", id_cliente, 404);
    }

    const proyectos = await this.proyectoRepositorio.obtenerPorCliente(id_cliente, filtros);

   if (!proyectos || proyectos.length === 0) {
      
      return {
        proyectos: [],
        mensaje: `El cliente con id ${id_cliente} no tiene proyectos registrados.`,
      };
    }

     return { proyectos };
}}
