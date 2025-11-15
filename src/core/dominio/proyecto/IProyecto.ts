export interface IProyecto {
  idProyecto?: string; 
  nombre: string;
  descripcion: string;
  estado_proyecto?: 'Creado' | 'En proceso' | 'Finalizado'; 
  estado?: 'Activo' | 'Eliminado';
  id_cliente: string;
  fecha_inicio: Date;
  fecha_entrega: Date;
  fecha_creacion?: Date; 
}