import type { IProyecto } from "../IProyecto";

export interface IProyectoRepositorio {
  crear(proyecto: IProyecto): Promise<IProyecto>;
  obtenerTodos(): Promise<IProyecto[]>;
  obtenerPorId(idProyecto: string): Promise<IProyecto | null>;
  actualizar(idProyecto: string, cambios: Partial<IProyecto>): Promise<IProyecto>;
  eliminar(idProyecto: string): Promise<IProyecto>;
}