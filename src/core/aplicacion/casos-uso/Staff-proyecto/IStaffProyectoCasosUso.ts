import type { IStaffProyecto } from "../../../dominio/staff-proyecto/IStaffProyecto";

export interface IStaffProyectoCasosUso {
  asignarConsultorAProyecto(
    id_proyecto: string,
    datos: IStaffProyecto
  ): Promise<IStaffProyecto>;
}
