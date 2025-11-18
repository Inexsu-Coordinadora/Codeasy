import type { IEquipoConsultor } from "../../../dominio/equipos-consultores/IEquipoConsultor";
import { EquipoConsultor } from "../../../dominio/equipos-consultores/EquipoConsultor";

export interface IEquipoConsultorCasosUso {
  crearAsignacion(asignacion: EquipoConsultor): Promise<IEquipoConsultor>;
  obtenerAsignacionPorId(idEquipoConsultores: string): Promise<IEquipoConsultor | null>;
  listarAsignacionesPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]>;
  listarAsignacionesPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]>;
  actualizarAsignacion(idEquipoConsultores: string,datos: Partial<IEquipoConsultor>): Promise<IEquipoConsultor>;
  eliminarAsignacion(idEquipoConsultores: string): Promise<IEquipoConsultor>;
}
