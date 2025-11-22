import type { IProyecto } from "../IProyecto.js";

export interface IProyectoRepositorio {
  crear(proyecto: IProyecto): Promise<IProyecto>;
  obtenerTodos(): Promise<IProyecto[]>;
  obtenerPorId(idProyecto: string): Promise<IProyecto | null>;
  obtenerPorCliente(idCliente: string): Promise<IProyecto[]>;
  actualizar(idProyecto: string, cambios: Partial<IProyecto>): Promise<IProyecto>;
  eliminar(idProyecto: string): Promise<IProyecto>;
}