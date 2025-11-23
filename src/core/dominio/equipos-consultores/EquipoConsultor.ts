import type { IEquipoConsultor } from "./IEquipoConsultor.js";

export class EquipoConsultor implements IEquipoConsultor {
  constructor(
    public idEquipoConsultores: string | undefined,
    public idConsultor: string,
    public idEquipoProyecto: string,
    public idRol: string,
    public estado: "Activo" | "Eliminado" = "Activo",
    public porcentajeDedicacion: number,
    public fechaInicio: Date,
    public fechaFin: Date
  ) { }
}
