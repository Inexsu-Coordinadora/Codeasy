import { ITarea } from "./ITarea";

export class Tarea implements ITarea {
  // Required by ITarea
  idTarea?: number;
  titulo!: string;
  descripcion!: string;
  stateTask!: 'Create' | 'Proceso' | 'Finalizado';
  status!: 'eliminado' | 'Activo';

  // Optional / domain-specific
  fechaCreacion?: Date;
  // Required by ITarea
  fechaFinalizacion!: Date;
  prioridad!: 'Baja' | 'Media' | 'Alta';
  asignadoA!: string;

  constructor(props: Partial<ITarea>) {
    Object.assign(this, props);
  }
}