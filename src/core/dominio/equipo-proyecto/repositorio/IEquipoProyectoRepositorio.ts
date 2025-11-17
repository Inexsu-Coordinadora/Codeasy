import type { IEquipoProyecto } from "../IEquipoProyecto";
import { EquipoProyecto } from "../EquipoProyecto";

export interface IEquipoProyectoRepositorio {
  crearEquipoProyecto(equipo: EquipoProyecto): Promise<IEquipoProyecto>;
  listarEquipos(): Promise<IEquipoProyecto[]>;
  obtenerPorId(idEquipoProyecto: string): Promise<IEquipoProyecto | null>;
  obtenerPorProyecto(idProyecto: string): Promise<IEquipoProyecto | null>;
  actualizarEquipoProyecto(idEquipoProyecto: string, datos: Partial<IEquipoProyecto>):Promise<IEquipoProyecto>;
  eliminarEquipoProyecto(idEquipoProyecto: string): Promise<IEquipoProyecto>;
}
