import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";

export interface IProyectoRepositorio {
  registrarProyecto(proyecto: Proyecto): Promise<IProyecto>;
  listarTodosProyectos(): Promise<IProyecto[]>;
  btenerProyectoPorId(id_proyecto: number): Promise<IProyecto | null>;
  actualizarProyecto(id_proyecto: number, datosProyecto: IProyecto): Promise<IProyecto>;
  eliminarProyecto(id_proyecto: number): Promise<void>;
  obtenerClientePorId(id_cliente: string, filtros?: { estado?: string; fecha_inicio?:Date}): Promise<IProyecto[]>
}
