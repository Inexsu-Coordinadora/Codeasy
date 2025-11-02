export interface ITarea {
  idTarea?: number;
  titulo: string;
  descripcion: string;
  estadoTarea: 'Creada' | 'En Proceso' | 'Finalizada';
  fechaCreacion?: Date;
  fechaFinalizacion: Date;
  prioridad: 'Baja' | 'Media' | 'Alta';
  asignadoA: string;
  estatus: 'Eliminado' | 'Activo';
}