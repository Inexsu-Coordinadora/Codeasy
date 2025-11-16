import { ITarea } from "./ITarea";

export class Tarea implements ITarea {
  idTarea?: string;
  titulo!: string;
  descripcion!: string;
  estadoTarea!: 'pendiente' | 'en progreso' | 'bloqueada' | 'completada';
  estatus!: 'Eliminado' | 'Activo';
  fechaCreacion?: Date;
  fechaFinalizacion!: Date;
  prioridad!: 'Baja' | 'Media' | 'Alta';
  asignadoA!: string;

  constructor(props: Partial<ITarea>) {
    Object.assign(this, props);
  }
}