import { IProyecto } from "../../../dominio/proyecto/IProyecto";
import { Proyecto } from "../../../dominio/proyecto/Proyecto";

export interface IProyectoRepositorio {
  registrarProyecto(proyecto: Proyecto): Promise<IProyecto>;
  listarTodosProyectos(): Promise<IProyecto[]>;
  obtenerProyectoPorId(idProyecto: string): Promise<IProyecto | null>;
  actualizarProyecto(idProyecto: string, datosProyecto: IProyecto): Promise<IProyecto>;
  eliminarProyecto(idProyecto: string): Promise<void>;
}