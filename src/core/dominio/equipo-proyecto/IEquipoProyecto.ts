export interface IEquipoProyecto {
  idEquipoProyecto?: string;
  idProyecto: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: "Activo" | "Eliminado";
}
