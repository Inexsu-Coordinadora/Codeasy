import type { IProyecto } from "./IProyecto";

export class Proyecto implements IProyecto {
  constructor(
    public idProyecto: number | undefined, // puede venir vacío antes de guardarse
    public nombre: string,
    public descripcion: string,
    public estado: "Creado" | "En proceso" | "Finalizado" = "Creado",
    public estatus: "Activo" | "Eliminado" = "Activo",
    public id_cliente: number,
    public fecha_inicio: Date,
    public fecha_entrega: Date,
    public fecha_creacion: Date = new Date()
  ) {}
}
