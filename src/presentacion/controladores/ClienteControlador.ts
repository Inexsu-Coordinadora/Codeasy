import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteCasosUso } from "../../core/aplicacion/casos-uso/Cliente/ClienteCasosUso";
import { ClienteActualizarDTO } from "../esquemas/Clientes/clienteActualizarEsquema";
import { ClienteCrearDTO } from "../esquemas/Clientes/clienteCrearEsquema";
import { CodigosHttp } from "../../common/codigosHttp";

export class ClienteControlador {
  constructor(private casosUso: ClienteCasosUso) {}

  async registrarCliente(req: FastifyRequest, reply: FastifyReply) {
    const datos = req.body as ClienteCrearDTO;
    const nuevoCliente = await this.casosUso.registrarCliente(datos);

    return reply.code(CodigosHttp.CREADO).send({
      exito: true,
      mensaje: "Cliente creado exitosamente",
      data: nuevoCliente,
    });
  }

  async listarTodosClientes(_req: FastifyRequest, reply: FastifyReply) {
    const clientes = await this.casosUso.listarTodosClientes();

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Clientes obtenidos correctamente",
      data: clientes,
    });
  }

  async buscarPorIdCliente(req: FastifyRequest, reply: FastifyReply) {
    const { idCliente } = req.params as { idCliente: string };
    const cliente = await this.casosUso.buscarPorIdCliente(idCliente);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Cliente obtenido correctamente",
      data: cliente,
    });
  }

  async actualizarCliente(req: FastifyRequest, reply: FastifyReply) {
    const { idCliente } = req.params as { idCliente: string };
    const datos = req.body as ClienteActualizarDTO;

    const clienteActualizado = await this.casosUso.actualizarCliente(
      idCliente,
      datos
    );

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Cliente actualizado exitosamente",
      data: clienteActualizado,
    });
  }

  async eliminarCliente(req: FastifyRequest, reply: FastifyReply) {
    const { idCliente } = req.params as { idCliente: string };
    await this.casosUso.eliminarCliente(idCliente);

    return reply.code(CodigosHttp.OK).send({
      exito: true,
      mensaje: "Cliente eliminado correctamente",
    });
  }
}