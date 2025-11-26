export interface IProyecto {
  idProyecto?: string;
  nombre: string;
  descripcion: string;
  estadoProyecto?: 'Creado' | 'En proceso' | 'Finalizado';
  estado?: 'Activo' | 'Eliminado';
  idCliente: string;
  nombreCliente?: string;
  fechaInicio: Date;
  fechaEntrega: Date;
  fechaCreacion?: Date;
}
