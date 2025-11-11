import { IParteHora } from "../IParteHora.js";

export interface IParteHoraRepositorio {
  registrarParteHora(parteHora: IParteHora): Promise<IParteHora>;
  obtenerPartesPorProyecto(id_proyecto: string): Promise<IParteHora[]>;
  obtenerPartesPorConsultor(id_consultor: string): Promise<IParteHora[]>;
  buscarDuplicado(
    id_proyecto: string,
    id_consultor: string,
    fecha: Date,
    descripcion: string
  ): Promise<boolean>;
}
