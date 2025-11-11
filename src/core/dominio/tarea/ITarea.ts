export interface ITarea {
  idTarea?: string;
  titulo: string;
  descripcion: string;
  estadoTarea: 'Creada' | 'En Proceso' | 'Finalizada';
  fechaCreacion?: Date;
  fechaFinalizacion: Date;
  prioridad: 'Baja' | 'Media' | 'Alta';
  asignadoA: string;
  estatus: 'Eliminado' | 'Activo';
}