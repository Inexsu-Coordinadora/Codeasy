import type { IEquipoConsultor } from "../IEquipoConsultor";

export interface IEquipoConsultorRepositorio {
  crear(asignacion: IEquipoConsultor): Promise<IEquipoConsultor>;
  obtenerPorId(idEquipoConsultores: string): Promise<IEquipoConsultor | null>;
  obtenerTodos(): Promise<IEquipoConsultor[]>;
  obtenerPorEquipo(idEquipoProyecto: string): Promise<IEquipoConsultor[]>;
  obtenerPorConsultor(idConsultor: string): Promise<IEquipoConsultor[]>;
  actualizar(idEquipoConsultores: string, datos: Partial<IEquipoConsultor>): Promise<IEquipoConsultor>;
  eliminar(idEquipoConsultores: string): Promise<IEquipoConsultor>;
}
