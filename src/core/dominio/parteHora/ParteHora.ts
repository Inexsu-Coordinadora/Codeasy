import { IParteHora } from "./IParteHora";

export class ParteHora implements IParteHora {
  constructor(
    public id_parte_hora: string | undefined,
    public id_proyecto: string,
    public id_consultor: string,
    public fecha: Date,
    public cantidad_horas: number,
    public descripcion: string,
    public estado: 'Activo' | 'Eliminado' = 'Activo'
  ) {}
}
