import  {IConsultor} from "../../../dominio/consultor/IConsultor.js";
import  {Consultor} from "../../../dominio/consultor/Consultor.js";
import  { IConsultorRepositorio } from "./IConsultorCasosUso.js";
import type { IEquipoConsultorRepositorio } from "../../../dominio/equipos-consultores/repositorio/IEquipoConsultorRepositorio.js";
import  { ConsultorCrearDTO } from "../../../../presentacion/esquemas/Consultores/consultorCrearEsquema";
import  { ConsultorActualizarDTO } from "../../../../presentacion/esquemas/Consultores/consultorActualizarEsquema";
import { AppError } from "../../../../common/middlewares/AppError";
import { consultorEstado } from "../../../dominio/consultor/ConsultorEstado";
import { ConsultorValidador } from "../Consultor/validadores/ConsultorValidador";

export class ConsultorCasosUso {
  constructor(private consultorRepositorio: IConsultorRepositorio, private equipoConsultorRepositorio: IEquipoConsultorRepositorio) {}
  async registrarConsultor(datos: IConsultor): Promise<IConsultor> {

    const consultorExistente = await this.consultorRepositorio.buscarPorCorreoOIdentificacion(
      datos.correo,
      datos.identificacion
    );

    ConsultorValidador.validarDuplicado(consultorExistente);

    const nuevoConsultor = new Consultor({
      ...datos,
      estado: consultorEstado.ACTIVO
    });

    return await this.consultorRepositorio.registrarConsultor(nuevoConsultor);
  }

  async listarTodosConsultores(): Promise<IConsultor[]> {
    return await this.consultorRepositorio.listarTodosConsultores();
  }

  async obtenerConsultorPorId(idConsultor: string): Promise<IConsultor> {
    const consultor = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

    ConsultorValidador.validarExistencia(consultor, idConsultor);

    return consultor as IConsultor;
  }

  async actualizarConsultor(idConsultor: string, datos: Partial<IConsultor>): Promise<IConsultor> {
    const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

    ConsultorValidador.validarExistencia(consultorExistente, idConsultor);

    const consultorActualizado = {
      ...consultorExistente,
      ...datos
    } as IConsultor;

    return await this.consultorRepositorio.actualizarConsultor(idConsultor, consultorActualizado);
  }

  async eliminarConsultor(idConsultor: string): Promise<void> {

    const consultorExistente = await this.consultorRepositorio.obtenerConsultorPorId(idConsultor);

    ConsultorValidador.validarExistencia(consultorExistente, idConsultor);
    ConsultorValidador.validarNoEliminado(consultorExistente!, idConsultor);

    consultorExistente!.estado = consultorEstado.ELIMINADO;

    await this.consultorRepositorio.actualizarConsultor(idConsultor, consultorExistente!);
  }
}
