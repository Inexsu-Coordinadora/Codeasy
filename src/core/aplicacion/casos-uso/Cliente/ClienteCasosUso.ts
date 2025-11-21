import { ICliente } from "../../../dominio/cliente/ICliente.js"
import { Cliente } from "../../../dominio/cliente/Cliente.js";
import { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio.js";
import { ClienteCrearDTO } from "../../../../presentacion/esquemas/Clientes/clienteCrearEsquema.js";
import { ClienteActualizarDTO} from "../../../../presentacion/esquemas/Clientes/clienteActualizarEsquema.js";
import { AppError } from "../../../../common/middlewares/AppError";

//Logica de negocio para gestionar los clientes

export class ClienteCasosUso {
  constructor(private clienteRepositorio: IClienteRepositorio) {}

  
  async registrarCliente(datos: ClienteCrearDTO): Promise<ICliente> {
    const existentePorIdentificacion = await this.clienteRepositorio.buscarPorIdentificacionCliente(
      datos.identificacion,
      datos.correo
    );

    if (existentePorIdentificacion) {
      throw new AppError(`Ya existe un consultor con ese correo o identificación`);
    }

    const nuevoCliente = new Cliente({
      ...datos,
      estado: "Activo"
    });


    const clienteCreado = await this.clienteRepositorio.registrarCliente(nuevoCliente);

    return clienteCreado; 
  }

  async listarTodosClientes(): Promise<ICliente[]> {
    return await this.clienteRepositorio.buscarTodosCliente();
  }

  async obtenerClientePorId(idCliente: string): Promise<ICliente | null> {
    return await this.clienteRepositorio.buscarPorIdCliente(idCliente);
  }

  async obtenerClientePorIdentificacion(identificacion: string): Promise<ICliente | null> {
    return await this.clienteRepositorio.buscarPorIdentificacionCliente(identificacion);
  }

  async actualizarCliente(idCliente: string, datos: ClienteActualizarDTO): Promise<ICliente> {

    const clienteExistente = await this.clienteRepositorio.buscarPorIdCliente(idCliente);

    if (!clienteExistente) {
      throw new AppError(`No se encontró el cliente con ID ${idCliente} para actualizar.`);
    }

    if (datos.identificacion && datos.identificacion !== clienteExistente.identificacion) {
        const existentePorNuevaIdentificacion = await this.clienteRepositorio.buscarPorIdentificacionCliente(datos.identificacion);
        
        if (existentePorNuevaIdentificacion && existentePorNuevaIdentificacion.idCliente !== idCliente) {
            throw new AppError(`La identificación ${datos.identificacion} ya está en uso por otro cliente.`);
        }
    }

    const clienteParaActualizar: ICliente = {
      ...clienteExistente,
      ...datos,
    } as ICliente;

    const resultado = await this.clienteRepositorio.ActualizarCliente(
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

    await this.clienteRepositorio.EliminarCliente(idCliente);
  }
}