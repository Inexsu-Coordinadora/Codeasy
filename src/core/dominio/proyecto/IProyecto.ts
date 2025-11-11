export interface IProyecto {
  idProyecto?: number; 
  nombre: string;
  descripcion: string;
  estado?: 'Creado' | 'En proceso' | 'Finalizado'; 
  estatus?: 'Activo' | 'Eliminado';
  id_cliente: number;
  fecha_inicio: Date;
  fecha_entrega: Date;
  fecha_creacion?: Date; 
}
