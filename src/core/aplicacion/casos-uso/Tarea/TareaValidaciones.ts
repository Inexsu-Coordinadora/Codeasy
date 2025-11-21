import { AppError } from "../../../../common/middlewares/AppError.js";
import {
  CONSULTOR_INACTIVO,
  EQUIPO_SIN_PROYECTO,
  TITULO_DUPLICADO,
  FECHA_FINALIZACION_INVALIDA,
  RANGO_CONSULTOR_NO_OBTENIDO,
  FECHA_ANTERIOR_A_INICIO_CONSULTOR,
  FECHA_SUPERA_FIN_CONSULTOR,
  TAREA_YA_COMPLETADA
} from "./MensajesTarea.js";

import { CodigosHttp } from "../../../../common/codigosHttp.js";

export class TareaValidaciones {
  validarEquipoActivo(equipoActivo: boolean, idEquipoConsultor: string) {
    if (!equipoActivo) {
      throw new AppError(CONSULTOR_INACTIVO, CodigosHttp.NO_ENCONTRADO, { idEquipoConsultor });
    }
  }

  validarIdProyectoExiste(idProyecto: any, idEquipoConsultor: string) {
    if (!idProyecto) {
      throw new AppError(EQUIPO_SIN_PROYECTO, CodigosHttp.NO_ENCONTRADO, { idEquipoConsultor });
    }
  }

  validarTituloUnico(tituloExiste: boolean, titulo: string, idProyecto?: any) {
    if (tituloExiste) {
      // usamos constante como mensaje principal; dejamos el título en detalles
      throw new AppError(TITULO_DUPLICADO, CodigosHttp.SOLICITUD_INCORRECTA, { idProyecto, titulo });
    }
  }

  validarFechaPosterior(fechaFinalizacion: Date | undefined, fechaReferencia: Date) {
    if (fechaFinalizacion && fechaFinalizacion <= fechaReferencia) {
      throw new AppError(FECHA_FINALIZACION_INVALIDA, CodigosHttp.SOLICITUD_INCORRECTA, { fechaFinalizacion, fechaReferencia });
    }
  }

  validarRangoConsultor(rangoConsultor: any, fechaFinalizacion: Date, idEquipoConsultor: string) {
    if (!rangoConsultor) {
      throw new AppError(RANGO_CONSULTOR_NO_OBTENIDO, CodigosHttp.ERROR_INTERNO, { idEquipoConsultor });
    }

    if (rangoConsultor.fechaInicio && fechaFinalizacion < rangoConsultor.fechaInicio) {
      throw new AppError(
        FECHA_ANTERIOR_A_INICIO_CONSULTOR,
        CodigosHttp.SOLICITUD_INCORRECTA,
        {
          fechaLimite: fechaFinalizacion.toISOString(),
          fechaInicioConsultor: rangoConsultor.fechaInicio.toISOString()
        }
      );
    }

    if (rangoConsultor.fechaFin && fechaFinalizacion > rangoConsultor.fechaFin) {
      throw new AppError(
        FECHA_SUPERA_FIN_CONSULTOR,
        CodigosHttp.SOLICITUD_INCORRECTA,
        {
          fechaLimite: fechaFinalizacion.toISOString(),
          fechaFinConsultor: rangoConsultor.fechaFin.toISOString()
        }
      );
    }
  }

  validarNoDuplicarCompletada(nuevoEstado: string | undefined, estadoExistente: string | undefined) {
    if (nuevoEstado === 'completada' && estadoExistente === 'completada') {
      throw new AppError(TAREA_YA_COMPLETADA, 400);
    }
  }

  validarTareaPorId(tarea: any, idTarea: string) {
    if (!tarea) {
      throw new AppError(`Tarea con el ID ${idTarea} no encontrada`, 404);
    }
  }
}

