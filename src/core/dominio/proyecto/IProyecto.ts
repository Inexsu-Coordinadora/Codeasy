export interface IProyecto {
  idProyecto?: number; 
  nombre: string;
  descripcion: string;
  estadoProyecto?: 'Creado' | 'En proceso' | 'Finalizado'; 
  estado?: 'Activo' | 'Eliminado';
  idCliente: string;
  fechaInicio: Date;
  fechaEntrega: Date;
  fechaCreacion?: Date; 
}