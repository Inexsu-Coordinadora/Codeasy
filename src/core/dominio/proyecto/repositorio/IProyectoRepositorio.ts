import type { IProyecto } from "../IProyecto";

export interface IProyectoRepositorio {
  crear(proyecto: IProyecto): Promise<IProyecto>;
  obtenerTodos(): Promise<IProyecto[]>;
  obtenerPorId(idProyecto: number): Promise<IProyecto | null>;
  actualizar(idProyecto: number, cambios: Partial<IProyecto>): Promise<IProyecto | null>;
  eliminarLogico(idProyecto: number): Promise<IProyecto | null>;
  obtenerPorCliente(idCliente: string, filtros?: { estado?: string; fecha_inicio?:Date}): Promise<IProyecto[]>;
}
