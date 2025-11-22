export interface IEquipoProyecto {
  idEquipoProyecto?: string;
  idProyecto: string;
  nombre: string;
  nombreProyecto?: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: "Activo" | "Eliminado";
}
