import { FastifyInstance } from "fastify";
import { ProyectoControlador } from "../controladores/ProyectoControlador";
import { IProyectoRepositorio } from "../../core/dominio/proyecto/repositorio/IProyectoRepositorio";
import { ProyectoRepositorio } from "../../core/infraestructura/postgres/ProyectoRepositorio";
import { ProyectoCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ProyectoCasosUso";
import { validarZod } from "../esquemas/validarZod";
import { ProyectoCrearEsquema } from "../esquemas/Proyectos/ProyectoCrearEsquema";
import { ProyectoActualizarEsquema } from "../esquemas/Proyectos/proyectoActualizarEsquema";
import { ClienteRepositorio } from "../../core/infraestructura/postgres/ClienteRepositorio"; 
import { ConsultarProyectosPorClienteCasosUso } from "../../core/aplicacion/casos-uso/Proyecto/ConsultarProyectosPorClienteCasosUso";

function proyectoEnrutador(app: FastifyInstance, proyectoController: ProyectoControlador) {
  app.get("/proyecto", proyectoController.listarTodosProyectos.bind(proyectoController));
  app.get("/proyecto/:idProyecto", proyectoController.obtenerProyectoPorId.bind(proyectoController));
  app.post("/proyecto", { preHandler: validarZod(ProyectoCrearEsquema, "body") }, proyectoController.registrarProyecto.bind(proyectoController));
  app.put("/proyecto/:idProyecto", { preHandler: validarZod(ProyectoActualizarEsquema, "body") }, proyectoController.actualizarProyecto.bind(proyectoController));
  app.delete("/proyecto/eliminar/:idProyecto", proyectoController.eliminarProyecto.bind(proyectoController));
  app.get("/clientes/:idCliente/proyectos", proyectoController.consultarProyectosPorCliente.bind(proyectoController)
  );
}


export async function construirProyectoEnrutador(app: FastifyInstance) {
  const proyectoRepositorio: IProyectoRepositorio = new ProyectoRepositorio();
   const clienteRepositorio = new ClienteRepositorio();
  
  
  const proyectoCasosUso = new ProyectoCasosUso(proyectoRepositorio , clienteRepositorio);
  const consultarProyectosPorClienteCasosUso = new ConsultarProyectosPorClienteCasosUso(
    proyectoRepositorio,
    clienteRepositorio
  );
    const proyectoController = new ProyectoControlador(
    proyectoCasosUso,
    consultarProyectosPorClienteCasosUso
  );
  proyectoEnrutador(app, proyectoController);
}