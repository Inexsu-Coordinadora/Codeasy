import { ICliente } from "../../../dominio/cliente/ICliente"
import { Cliente } from "../../../dominio/cliente/Cliente";
import { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio";
import { AppError } from "../../../../common/middlewares/AppError";

export class ClienteCasosUso {
  constructor(private clienteRepositorio: IClienteRepositorio) {}

  async registrarCliente(datos: ICliente): Promise<ICliente> {


    const existente = await this.clienteRepositorio.buscarPorIdentificacionCliente(
      datos.identificacion,
      datos.email
    );

    if (existente) {
      throw new AppError(`Ya existe un cliente con ese correo o identificación`);
    }

    const nuevoCliente = new Cliente({
      ...datos,
      estado: "Activo"
    });

    return await this.clienteRepositorio.registrarCliente(nuevoCliente);
  }

  async listarTodosClientes(): Promise<ICliente[]> {
    return await this.clienteRepositorio.obtenerClientes();
  }

  async buscarPorIdCliente(idCliente: string): Promise<ICliente | null> {
    return await this.clienteRepositorio.buscarPorIdCliente(idCliente);
  }

  async obtenerClientePorIdentificacion(identificacion: string): Promise<ICliente | null> {
    
    return await this.clienteRepositorio.buscarPorIdentificacionCliente(
      identificacion,
      ""
    );
  }

  async actualizarCliente(idCliente: string, datos: Partial<ICliente>): Promise<ICliente> {

    const clienteExistente = await this.clienteRepositorio.buscarPorIdCliente(idCliente);


    const clienteParaActualizar: ICliente = {
      ...clienteExistente,
      ...datos,
    };

   

    const resultado = await this.clienteRepositorio.actualizarCliente(
  idCliente,
  clienteParaActualizar
);
    
    if (!resultado) {
       throw new AppError(`Error al guardar la actualización del cliente con ID ${idCliente}.`);
    }

    return resultado;
  }

  async eliminarCliente(idCliente: string): Promise<void> {
    const clienteExistente = await this.clienteRepositorio.buscarPorIdCliente(idCliente);
    if (!clienteExistente) {
      throw new AppError(`No se encontró el cliente con ID ${idCliente} para eliminar.`);
    }

    await this.clienteRepositorio.eliminarCliente(idCliente);
  }
}