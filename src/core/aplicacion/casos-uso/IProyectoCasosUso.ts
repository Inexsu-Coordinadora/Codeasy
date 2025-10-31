import type { IProyecto } from '../../dominio/proyecto/IProyecto';

export interface IProyectosCasosUso {
  obtenerProyectos(limite?: number): Promise<IProyecto[]>;
  obtenerProyectoPorId(id: number): Promise<IProyecto | null>;
  crearProyecto(data: Omit<IProyecto, 'id' | 'fecha_creacion'>): Promise<number>;
  actualizarProyecto(id: number, data: IProyecto): Promise<IProyecto | null>;
  eliminarProyecto(id: number): Promise<void>;
}
