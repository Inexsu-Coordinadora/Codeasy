import { FastifyInstance } from "fastify";
import { ClienteControlador } from "../controladores/ClienteControlador";
import { IClienteRepositorio } from "../../core/dominio/cliente/repositorio/IClienteRepositorio";
import { ClienteCasosUso } from "../../core/aplicacion/casos-uso/Cliente/ClienteCasosUso";
import { ClienteRepositorio } from "../../core/infraestructura/postgres/ClienteRepositorio";

function clienteEnrutador(
  app: FastifyInstance,
  ClienteController: ClienteControlador
) {


  
  app.get("/cliente", ClienteController.listarTodosClientes.bind(ClienteController));
  
  
  app.get("/cliente/:idCliente", ClienteController.buscarPorIdCliente.bind(ClienteController));
  

  app.post("/cliente", ClienteController.registrarCliente.bind(ClienteController));
  
  
  app.put("/cliente/:idCliente", ClienteController.actualizarCliente.bind(ClienteController));
  

  app.delete("/cliente/eliminar/:idCliente", ClienteController.eliminarCliente.bind(ClienteController));
}


export async function construirClienteEnrutador(app: FastifyInstance) {
  const clienteRepositorio: IClienteRepositorio = new ClienteRepositorio();
  const clienteCasosUso = new ClienteCasosUso(clienteRepositorio);
  const clienteController = new ClienteControlador(clienteCasosUso);
  clienteEnrutador(app, clienteController);
}