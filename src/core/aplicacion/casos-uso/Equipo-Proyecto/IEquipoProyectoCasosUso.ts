import type { IEquipoProyecto } from "../../../dominio/equipo-proyecto/IEquipoProyecto";
import { EquipoProyecto } from "../../../dominio/equipo-proyecto/EquipoProyecto";

export interface IEquipoProyectoCasosUso {
  crearEquipoProyecto(equipo: EquipoProyecto): Promise<IEquipoProyecto>;
  listarEquipos(): Promise<IEquipoProyecto[]>;
  obtenerEquipoPorId(idEquipoProyecto: string): Promise<IEquipoProyecto | null>;
  obtenerEquipoPorProyecto(idProyecto: string): Promise<IEquipoProyecto | null>;
  actualizarEquipoProyecto(idEquipoProyecto: string, datos: Partial<IEquipoProyecto>): Promise<IEquipoProyecto>;
  eliminarEquipoProyecto(idEquipoProyecto: string): Promise<IEquipoProyecto>;
}
