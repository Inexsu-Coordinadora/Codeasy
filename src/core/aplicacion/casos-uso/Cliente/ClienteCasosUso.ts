import { ICliente } from "../../../dominio/cliente/ICliente.js";
import { Cliente } from "../../../dominio/cliente/Cliente.js";
import { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio.js";
import { ClienteCrearDTO } from "../../../presentacion/esquemas/clienteCrearEsquema";
import { ClienteActualizarDTO} from "../../../presentacion/esquemas/clienteActualizarEsquema";
import { AppError } from "../../../../presentacion/esquemas/middlewares/AppError.js";



//Logica de negocio para gestionar los clientes

export class ClienteCasosUso {
  constructor(private clienteRepositorio: IClienteRepositorio) {}

 async registrarCliente(datos: ClienteCrearDTO): Promise<ICliente> {
    const existentePorIdentificacion = await this.clienteRepositorio.buscarPorIdentificacionCliente(
      datos.identificacion
    );

    if (existentePorIdentificacion) {
      throw new AppError(`Ya existe un cliente con la identificación ${datos.identificacion}.`);
    }

    const nuevoCliente = new Cliente({
      nombre: datos.nombre,
      identificacion: datos.identificacion,
      email: datos.email,
      telefono: datos.telefono, 
      estado: datos.estado, 
    }as ICliente); 

    //Persistir en la base de datos
    const clienteCreado = await this.clienteRepositorio.crearCliente(nuevoCliente);
    return clienteCreado;
  }
  

  async listarTodosClientes(): Promise<ICliente[]> {
    return await this.clienteRepositorio.buscarTodosCliente();
  }

  async obtenerClientePorId(idCliente: number): Promise<ICliente | null> {
    return await this.clienteRepositorio.obtenerClientePorId(idCliente);
  }

  async obtenerClientePorIdentificacion(identificacion: string): Promise<ICliente | null> {
    return await this.clienteRepositorio.buscarPorIdentificacionCliente(identificacion);
  }

  async actualizarCliente(id_cliente: number, datos: ClienteActualizarDTO): Promise<ICliente> {

    const clienteExistente = await this.clienteRepositorio.obtenerClientePorId(id_cliente);

    if (!clienteExistente) {
      throw new AppError(`No se encontró el cliente con ID ${id_cliente} para actualizar.`);
    }

    if (datos.identificacion && datos.identificacion !== clienteExistente.identificacion) {
        const existentePorNuevaIdentificacion = await this.clienteRepositorio.buscarPorIdentificacionCliente(datos.identificacion);
        
        if (existentePorNuevaIdentificacion && existentePorNuevaIdentificacion.idCliente !== id_cliente) {
            throw new AppError(`La identificación ${datos.identificacion} ya está en uso por otro cliente.`);
        }
    }

    const clienteParaActualizar: ICliente = {
      ...clienteExistente,
      ...datos,
    } as ICliente;

    const resultado = await this.clienteRepositorio.ActualizarCliente(
      id_cliente,
      clienteParaActualizar
    );
    
    
    if (!resultado) {
       throw new AppError(`AppError al guardar la actualización del cliente con ID ${id_cliente}.`);
    }

    return resultado;
  }

  async eliminarCliente(id_cliente: number): Promise<void> {
    const clienteExistente = await this.clienteRepositorio.obtenerClientePorId(id_cliente);
    if (!clienteExistente) {
      throw new AppError(`No se encontró el cliente con ID ${id_cliente} para eliminar.`);
    }

    await this.clienteRepositorio.EliminarCliente(id_cliente);
  }
}
