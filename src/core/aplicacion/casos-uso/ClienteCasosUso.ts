import { ICliente } from "../../dominio/cliente/ICliente";
import { Cliente } from "../../dominio/cliente/Cliente";
import { IClienteRepositorio } from "../../dominio/cliente/repositorio/IClienteRepositorio";
import { ClienteCrearDTO } from "../../../presentacion/esquemas/clienteCrearEsquema";
import { ClienteActualizarDTO} from "../../../presentacion/esquemas/clienteActualizarEsquema";


//Logica de negocio para gestionar los clientes

export class ClienteCasosUso {
  constructor(private clienteRepositorio: IClienteRepositorio) {}

  /**
   * Registrar un nuevo cliente en el sistema.
   */
  async registrarCliente(datos: ClienteCrearDTO): Promise<number> {
    const existentePorIdentificacion = await this.clienteRepositorio.buscarPorIdentificacionCliente(
      datos.identificacion
    );

    if (existentePorIdentificacion) {
      throw new Error(`Ya existe un cliente con la identificación ${datos.identificacion}.`);
    }

    const nuevoCliente = new Cliente({
      nombre: datos.nombre,
      identificacion: datos.identificacion,
      email: datos.email,
      telefono: datos.telefono, 
      estatus: datos.estatus, 
    }as ICliente); 

    //Persistir en la base de datos
    const idClienteCreado = await this.clienteRepositorio.crearCliente(nuevoCliente);
    return Number(idClienteCreado);
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
      throw new Error(`No se encontró el cliente con ID ${idCliente} para actualizar.`);
    }

    if (datos.identificacion && datos.identificacion !== clienteExistente.identificacion) {
        const existentePorNuevaIdentificacion = await this.clienteRepositorio.buscarPorIdentificacionCliente(datos.identificacion);
        
        if (existentePorNuevaIdentificacion && existentePorNuevaIdentificacion.idCliente !== idCliente) {
            throw new Error(`La identificación ${datos.identificacion} ya está en uso por otro cliente.`);
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
       throw new Error(`Error al guardar la actualización del cliente con ID ${idCliente}.`);
    }

    return resultado;
  }

  async eliminarCliente(idCliente: string): Promise<void> {
    const clienteExistente = await this.clienteRepositorio.buscarPorIdCliente(idCliente);
    if (!clienteExistente) {
      throw new Error(`No se encontró el cliente con ID ${idCliente} para eliminar.`);
    }

    await this.clienteRepositorio.EliminarCliente(idCliente);
  }
}
