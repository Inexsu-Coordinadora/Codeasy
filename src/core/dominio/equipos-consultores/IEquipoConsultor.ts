export interface IEquipoConsultor {
  idEquipoConsultores?: string | undefined;
  idConsultor: string;
  nombreConsultor?: string;
  idEquipoProyecto: string;
  nombreEquipoProyecto?: string;
  idRol: string;
  nombreRol?: string;
  porcentajeDedicacion: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: "Activo" | "Eliminado";
  idProyecto?: string;
  nombreProyecto?: string;
}