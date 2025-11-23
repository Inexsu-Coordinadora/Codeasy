import { NoEncontradoError } from "../../../../../common/middlewares/AppError";
import { IClienteRepositorio } from "../../../../dominio/cliente/repositorio/IClienteRepositorio"

export class ProyectoValidaciones {
  static async validarClienteExiste(
    clienteRepositorio: IClienteRepositorio,
    idCliente: string
  ) {
    const cliente = await clienteRepositorio.buscarPorIdCliente(idCliente);

    if (!cliente) {
      throw new NoEncontradoError("Cliente", idCliente);
    }

    return cliente;
  }
}
