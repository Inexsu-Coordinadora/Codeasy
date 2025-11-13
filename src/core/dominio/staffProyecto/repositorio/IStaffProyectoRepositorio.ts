import { IStaffProyectoRepositorio } from "./IStaffProyectoRepositorio";

export interface IStaffRepositorio {
  obtenerConsultoresPorProyecto(idProyecto: string): Promise<
    { nombre: string; rol: string }[]
  >;
}
