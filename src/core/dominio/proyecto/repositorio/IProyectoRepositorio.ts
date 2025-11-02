import type { IProyecto } from '../IProyecto';

export interface IProyectoRepositorio {
  crear(proyecto: IProyecto): Promise<IProyecto>;
  obtenerTodos(): Promise<IProyecto[]>;
  obtenerPorId(id: number): Promise<IProyecto | null>;
  actualizar(id: number, cambios: Partial<IProyecto>): Promise<IProyecto | null>;
  eliminarLogico(id: number): Promise<IProyecto | null>;
}
