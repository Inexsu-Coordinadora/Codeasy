import type { IEquipoProyecto } from "./IEquipoProyecto.js";

export class EquipoProyecto implements IEquipoProyecto {
  constructor(
    public idEquipoProyecto: string | undefined,
    public idProyecto: string,
    public nombre: string,
    public fechaInicio: Date,
    public fechaFin: Date,
    public estado: "Activo" | "Eliminado" = "Activo"
  ) {}
}
