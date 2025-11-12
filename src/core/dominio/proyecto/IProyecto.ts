export interface IProyecto {
  id_proyecto?: number; 
  nombre: string;
  descripcion: string;
  estado_proyecto?: 'Creado' | 'En proceso' | 'Finalizado'; 
  estado?: 'Activo' | 'Eliminado';
  id_cliente: string;
  fecha_inicio: Date;
  fecha_entrega: Date;
  fecha_creacion?: Date; 
}