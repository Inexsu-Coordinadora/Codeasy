import type { IProyecto } from '../IProyecto';

export interface IProyectosRepositorio {
  crear(proyecto: IProyecto): Promise<IProyecto>;
  listar(): Promise<IProyecto[]>;
  buscarPorId(id: number): Promise<IProyecto | null>;
  actualizar(id: number, datos: Partial<IProyecto>): Promise<IProyecto | null>;
  eliminar(id: number): Promise<void>;
}
