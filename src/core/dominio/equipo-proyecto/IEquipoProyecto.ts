export interface IEquipoProyecto {
  idEquipoProyecto: string | undefined;
  idProyecto: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: "Activo" | "Eliminado";
}
