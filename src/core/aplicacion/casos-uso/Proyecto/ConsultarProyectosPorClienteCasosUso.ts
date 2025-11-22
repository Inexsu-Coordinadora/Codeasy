import { IProyectoRepositorio } from "../../../dominio/proyecto/repositorio/IProyectoRepositorio";
import { IClienteRepositorio } from "../../../dominio/cliente/repositorio/IClienteRepositorio";
import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { ProyectoValidaciones } from "./Validaciones/ProyectoValidaciones";
import { mensajesProyecto } from "../Proyecto/Constantes/mensajesProyecto"

export class ConsultarProyectosPorClienteCasosUso {


  constructor(
    private readonly proyectoRepositorio: IProyectoRepositorio,
    private readonly clienteRepositorio: IClienteRepositorio
  ) { }

  async ejecutar(
    idCliente: string,
    filtros?: { estadoProyecto?: string; fechaInicio?: Date; fechaFin?: Date }
  ): Promise<{ proyectos: IProyecto[]; mensaje?: string }> {


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