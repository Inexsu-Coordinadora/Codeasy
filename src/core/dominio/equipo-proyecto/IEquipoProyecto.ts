export interface IEquipoProyecto {
  idEquipoProyecto: string | undefined;
  idProyecto: string;
  nombre: string;
  nombreProyecto?: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: "Activo" | "Eliminado";
}
