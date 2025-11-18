import type { IEquipoConsultor } from "../IEquipoConsultor";
import { EquipoConsultor } from "../EquipoConsultor";

export interface IEquipoConsultorRepositorio {
  crearAsignacion(asignacion: EquipoConsultor): Promise<IEquipoConsultor>;
  obtenerPorId(idEquipoConsultores: string): Promise<IEquipoConsultor | null>;
  listarPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]>;
  listarPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]>;
  actualizarAsignacion(idEquipoConsultores: string, datos: Partial<IEquipoConsultor>): Promise<IEquipoConsultor>;
  eliminarAsignacion(idEquipoConsultores: string): Promise<IEquipoConsultor>;
}
