import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";

export interface IProyectoRepositorio {
  registrarProyecto(proyecto: Proyecto): Promise<IProyecto>;
  listarTodosProyectos(): Promise<IProyecto[]>;
  obtenerProyectoPorId(idProyecto: number): Promise<IProyecto | null>;
  actualizarProyecto(idProyecto: number, datosProyecto: IProyecto): Promise<IProyecto>;
  eliminarProyecto(idProyecto: number): Promise<void>;
  obtenerPorCliente(idCliente: string, filtros?: { estado?: string; fecha_inicio?:Date}): Promise<IProyecto[]>
}
