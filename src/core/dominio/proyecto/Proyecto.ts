import type { IProyecto } from "./IProyecto";

export class Proyecto implements IProyecto {
  constructor(
    public idProyecto: string | undefined, // puede venir vacío antes de guardarse
    public nombre: string,
    public descripcion: string,
    public estadoProyecto: "Creado" | "En proceso" | "Finalizado" = "Creado",
    public estado: "Activo" | "Eliminado" = "Activo",
    public idCliente: string,
    public fechaInicio: Date,
    public fechaEntrega: Date,
    public fechaCreacion: Date = new Date()
  ) {}
}