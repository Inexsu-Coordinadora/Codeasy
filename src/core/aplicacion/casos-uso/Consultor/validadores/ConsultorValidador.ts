import { IConsultor } from "../../../dominio/consultor/IConsultor";
import { AppError } from "../../../../../common/middlewares/AppError"
import { CodigosHttp } from "../../../../../common/codigosHttp";
import { consultorEstado } from "../../../../dominio/consultor/ConsultorEstado";


import { consultorMensajes } from "../../Consultor/constantes/ConsultorMensajes";

export class ConsultorValidador {

  static validarExistencia(consultor: IConsultor | null, idConsultor?: string) {
    if (!consultor) {
      throw new AppError(`${consultorMensajes.consultorNoEncontrado} ${idConsultor}`, CodigosHttp.NO_ENCONTRADO);
    }
  }

  static validarDuplicado(existente: IConsultor | null) {
    if (existente) {
      throw new AppError(consultorMensajes.concultorDuplicado);
    }
  }

  static validarNoEliminado(consultor: IConsultor, idConsultor: string) {
    if (consultor.estado === consultorEstado.ELIMINADO) {
      throw new AppError(consultorMensajes.consultorestadoEliminado(idConsultor));
    }

  }
}

