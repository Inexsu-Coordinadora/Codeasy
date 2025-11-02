export interface ITarea {
  idTarea?: number;
  titulo: string;
  descripcion: string;
  stateTask: 'Create' | 'Proceso' | 'Finalizado';
  fechaCreacion?: Date;
  fechaFinalizacion: Date;
  prioridad: 'Baja' | 'Media' | 'Alta';
  asignadoA: string;
  status: 'eliminado' | 'Activo';
}