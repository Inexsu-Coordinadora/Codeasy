export interface IProyecto {
  idProyecto: string | undefined,
  nombre: string;
  descripcion: string;
  estadoProyecto?: 'Creado' | 'En proceso' | 'Finalizado'; 
  estado?: 'Activo' | 'Eliminado';
  idCliente: number;
  fechaInicio: Date;
  fechaEntrega: Date;
  fechaCreacion?: Date; 
}
