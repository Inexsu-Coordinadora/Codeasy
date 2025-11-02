import { FastifyInstance } from "fastify";
import { ClienteControlador } from "../controladores/ClienteControlador";
import { IClienteRepositorio } from "../../core/dominio/cliente/repositorio/IClienteRepositorio";
import { ClienteCasosUso } from "../../core/aplicacion/casos-uso/ClienteCasosUso";
import { ClienteRepositorio } from "../../core/infraestructura/postgres/ClienteRepositorio";

function clienteEnrutador(
  app: FastifyInstance,
  ClienteController: ClienteControlador
) {


  // GET: Listar todos los clientes
  app.get("/cliente", ClienteController.listarTodosClientes.bind(ClienteController));
  
  // GET: Obtener un cliente por su ID
  app.get("/cliente/:idCliente", ClienteController.obtenerClientePorId.bind(ClienteController));
  
  //Registrar un nuevo cliente
  app.post("/cliente", ClienteController.registrarCliente.bind(ClienteController));
  
  //Actualizar un cliente por su ID
  app.put("/cliente/:idCliente", ClienteController.actualizarCliente.bind(ClienteController));
  
  //Eliminar un cliente por su ID
  app.delete("/cliente/:idCliente", ClienteController.eliminarCliente.bind(ClienteController));
}


export async function construirClienteEnrutador(app: FastifyInstance) {
  const clienteRepositorio: IClienteRepositorio = new ClienteRepositorio();
  const clienteCasosUso = new ClienteCasosUso(clienteRepositorio);
  const clienteController = new ClienteControlador(clienteCasosUso);
  clienteEnrutador(app, clienteController);
}