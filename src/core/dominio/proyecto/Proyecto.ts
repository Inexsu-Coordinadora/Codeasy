import type { IProyecto } from './IProyecto';

export class Proyecto implements IProyecto {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string,
    public estado: 'Creado' | 'En proceso' | 'Finalizado',
    public estatus: 'Activo' | 'Eliminado',
    public id_cliente: number,
    public fecha_inicio: Date,
    public fecha_entrega: Date,
    public fecha_creacion: Date,
  ) {}
}
