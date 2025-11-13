export interface ITarea {
  idTarea?: string;
  titulo: string;
  descripcion: string;
  estadoTarea: 'pendiente' | 'en progreso' | 'bloqueada' | 'completada';
  fechaCreacion?: Date;
  fechaFinalizacion: Date ;
  prioridad: 'Baja' | 'Media' | 'Alta';
  asignadoA: string;
  estatus: 'Eliminado' | 'Activo';
}