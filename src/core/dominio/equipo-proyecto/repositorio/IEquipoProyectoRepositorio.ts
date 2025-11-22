import type { IEquipoProyecto } from "../IEquipoProyecto.js";

export interface IEquipoProyectoRepositorio {
  crear(equipo: IEquipoProyecto): Promise<IEquipoProyecto>;
  obtenerTodos(): Promise<IEquipoProyecto[]>;
  obtenerPorId(idEquipoProyecto: string): Promise<IEquipoProyecto | null>;
  obtenerPorProyecto(idProyecto: string): Promise<IEquipoProyecto | null>;
  actualizar(idEquipoProyecto: string, cambios: Partial<IEquipoProyecto>): Promise<IEquipoProyecto>;
  eliminar(idEquipoProyecto: string): Promise<IEquipoProyecto>;
}