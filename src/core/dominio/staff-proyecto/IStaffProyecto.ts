export interface IStaffProyecto {
  id_staff_proyecto?: string;
  id_consultor: string;
  id_proyecto: string;
  id_rol?: string;
  porcentaje_dedicacion: number;
  fecha_inicio: Date;
  fecha_fin: Date;
}
