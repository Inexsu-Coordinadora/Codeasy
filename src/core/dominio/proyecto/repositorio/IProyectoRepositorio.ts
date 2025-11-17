import type { IProyecto } from "../IProyecto";

export interface IProyectoRepositorio {
  registrarProyecto(proyecto: IProyecto): Promise<IProyecto>;
  listarTodosProyectos(): Promise<IProyecto[]>;
  obtenerProyectoPorId(idProyecto: string): Promise<IProyecto | null>;
  actualizarProyecto(idProyecto: string, cambios: Partial<IProyecto>): Promise<IProyecto | null>;
  eliminarProyecto(idProyecto: string): Promise<IProyecto | null>;
}