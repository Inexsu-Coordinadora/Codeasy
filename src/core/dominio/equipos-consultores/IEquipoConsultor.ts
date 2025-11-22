export interface IEquipoConsultor {
  idEquipoConsultores: string | undefined;
  idConsultor: string;
  idEquipoProyecto: string;
  idRol: string;
  estado: "Activo" | "Eliminado";
  porcentajeDedicacion: number;
  fechaInicio: Date;
  fechaFin: Date;
}
