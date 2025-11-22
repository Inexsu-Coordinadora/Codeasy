import { IProyectoRepositorio } from "../../../dominio/repositorios/IProyectoRepositorio";
import { IClienteRepositorio } from "../../../dominio/repositorios/IClienteRepositorio";
import { Proyecto } from "../../../dominio/entidades/Proyecto";
import { ProyectoValidaciones } from "./Validaciones/ProyectoValidaciones";
import {mensajesProyecto} from "../Proyecto/Constantes/mensajesProyecto"

export class ConsultarProyectosPorClienteCasosUso {


   constructor(
    private readonly proyectoRepositorio: IProyectoRepositorio,
    private readonly clienteRepositorio: IClienteRepositorio
  ) {}

  async ejecutar(
    idCliente: string,
    filtros?: { estadoProyecto?: string; fechaInicio?: Date; fechaFin?: Date }
  ): Promise<{ proyectos: Proyecto[]; mensaje?: string }> {


    const cliente = await ProyectoValidaciones.validarClienteExiste(
      this.clienteRepositorio,
      idCliente
    );

    
    const proyectos = await this.proyectoRepositorio.obtenerPorCliente(
      idCliente,
      filtros
    );

 
    if (!proyectos || proyectos.length === 0) {
      return {
        proyectos: [],
        mensaje: mensajesProyecto.CLIENTE_SIN_PROYECTOS(idCliente, cliente.nombre),
      };
    }


    return { proyectos };
  }
}