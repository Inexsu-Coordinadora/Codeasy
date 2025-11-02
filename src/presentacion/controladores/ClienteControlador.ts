import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteCasosUso} from "../../core/aplicacion/casos-uso/ClienteCasosUso";
import { ClienteActualizarEsquema } from "../esquemas/clienteActualizarEsquema";
import { ClienteCrearEsquema} from "../esquemas/clienteCrearEsquema";


/// Manejo de peticiones http
export class ClienteControlador {
  constructor(private casosUso: ClienteCasosUso) {}

  /**
   * Registra un nuevo cliente.
   * Valida la entrada con ClienteCrearEsquema.
   */
  async registrarCliente(req: FastifyRequest, reply: FastifyReply) {
    try {

      const datos = ClienteCrearEsquema.parse(req.body);  
      const idClienteCreado = await this.casosUso.registrarCliente(datos);
      
      return reply.code(201).send({ 
        mensaje: "Cliente creado exitosamente", 
        idCliente: idClienteCreado 
      });

    } catch (error: any) {
      console.error(error);
      return reply.code(400).send({ error: error.message });
    }
  }

  /**
   * Listar todos los clientes.
   */
  async listarTodosClientes(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const clientes = await this.casosUso.listarTodosClientes();
      return reply.code(200).send(clientes);
    } catch (error: any) {
      console.error(error);
      return reply.code(500).send({ error: "Error interno del servidor al listar clientes" });
    }
  }

  /**
   * Obtiener un cliente por su ID numérico.
   */
  async obtenerClientePorId(req: FastifyRequest, reply: FastifyReply) {
    try {
      // El ID viene como string en los parámetros, se debe asegurar que se interprete como number
      const { idCliente } = req.params as { idCliente: string };
      const idClienteNumber = parseInt(idCliente, 10);
      
      if (isNaN(idClienteNumber)) {
        return reply.code(400).send({ mensaje: "El ID del cliente debe ser un número válido." });
      }

      const cliente = await this.casosUso.obtenerClientePorId(idClienteNumber);
      
      if (!cliente) {
        return reply.code(404).send({ mensaje: `Cliente con ID ${idClienteNumber} no encontrado` });
      }
      
      return reply.code(200).send(cliente);
      
    } catch (error: any) {
      console.error(error);
      return reply.code(400).send({ error: error.message });
    }
  }

  /**
   * Actualiza parcialmente un cliente.
   * Valido la entrada con ClienteActualizarEsquema.
   */
  async actualizarCliente(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idCliente } = req.params as { idCliente: string };
      const idClienteNumber = parseInt(idCliente, 10);
      
      if (isNaN(idClienteNumber)) {
        return reply.code(400).send({ mensaje: "El ID del cliente debe ser un número válido." });
      }
      
      // Validación de datos de actualización
      const datos = ClienteActualizarEsquema.parse(req.body);
      const actualizado = await this.casosUso.actualizarCliente(idClienteNumber, datos);
      
      return reply.code(200).send({ 
        mensaje: "Cliente actualizado exitosamente", 
        data: actualizado 
      });
      
    } catch (error: any) {
      console.error(error);
      return reply.code(400).send({ error: error.message });
    }
  }

  /**
   * Eliminar un cliente por su ID.
   */
  async eliminarCliente(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { idCliente } = req.params as { idCliente: string };
      const idClienteNumber = parseInt(idCliente, 10);

      if (isNaN(idClienteNumber)) {
        return reply.code(400).send({ mensaje: "El ID del cliente debe ser un número válido." });
      }
      
      await this.casosUso.eliminarCliente(idClienteNumber);
      
      return reply.code(200).send({ mensaje: `Cliente con ID ${idClienteNumber} eliminado correctamente` });
      
    } catch (error: any) {
      console.error(error);
      return reply.code(400).send({ error: error.message });
    }
  }
}


