import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteCasosUso } from "../../core/aplicacion/casos-uso/Cliente/ClienteCasosUso";
import { ClienteActualizarDTO } from "../esquemas/clienteActualizarEsquema";
import { ClienteCrearDTO } from "../esquemas/clienteCrearEsquema";

export class ClienteControlador {
  constructor(private casosUso: ClienteCasosUso) {}

  async registrarCliente(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as ClienteCrearDTO;
    const nuevoCliente = await this.casosUso.registrarCliente(datos);

    return reply.code(201).send({
      exito: true,
      mensaje: "Cliente creado exitosamente",
      data: nuevoCliente,
    });
  }

  async listarTodosClientes(_req: FastifyRequest, reply: FastifyReply) {
    const clientes = await this.casosUso.listarTodosClientes();

    return reply.code(200).send({
      exito: true,
      mensaje: "Clientes obtenidos correctamente",
      data: clientes,
    });
  }

  async obtenerClientePorId(req: FastifyRequest, reply: FastifyReply) {
    const { id_cliente } = req.params as { id_cliente: string };
    const cliente = await this.casosUso.obtenerClientePorId(id_cliente);

    return reply.code(200).send({
      exito: true,
      mensaje: "Cliente obtenido correctamente",
      data: cliente,
    });
  }

  async actualizarCliente(req: FastifyRequest, reply: FastifyReply) {
    const { id_cliente } = req.params as { id_cliente: number };
    const datos = req.body as ClienteActualizarDTO;

    const clienteActualizado = await this.casosUso.actualizarCliente(
      id_cliente,
      datos
    );

    return reply.code(200).send({
      exito: true,
      mensaje: "Cliente actualizado exitosamente",
      data: clienteActualizado,
    });
  }

  async eliminarCliente(req: FastifyRequest, reply: FastifyReply) {
    const { id_cliente } = req.params as { id_cliente: number };
    await this.casosUso.eliminarCliente(id_cliente);

    return reply.code(200).send({
      exito: true,
      mensaje: "Cliente eliminado correctamente",
    });
  }
}