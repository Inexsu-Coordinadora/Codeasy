import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";

export interface IProyectoRepositorio {
  registrarProyecto(proyecto: Proyecto): Promise<IProyecto>;
  listarTodosProyectos(): Promise<IProyecto[]>;
  obtenerProyectoPorId(id: number): Promise<IProyecto | null>;
  actualizarProyecto(id: number, datosProyecto: IProyecto): Promise<IProyecto>;
  eliminarProyecto(id: number): Promise<void>;
}
