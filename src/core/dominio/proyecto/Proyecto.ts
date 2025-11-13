import type { IProyecto } from "./IProyecto";

export class Proyecto implements IProyecto {
  constructor(
    public id_proyecto: number | undefined, // puede venir vacío antes de guardarse
    public nombre: string,
    public descripcion: string,
    public estado_proyecto: "Creado" | "En proceso" | "Finalizado" = "Creado",
    public estado: "Activo" | "Eliminado" = "Activo",
    public id_cliente: string,
    public fecha_inicio: Date,
    public fecha_entrega: Date,
    public fecha_creacion: Date = new Date()
  ) {}
}
