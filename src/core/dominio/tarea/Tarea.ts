import { ITarea } from "./ITarea.js";

export class Tarea implements ITarea {
  idTarea?: string;
  titulo!: string;
  descripcion!: string;
  estadoTarea!: 'pendiente' | 'en progreso' | 'bloqueada' | 'completada';
  estado!: 'Eliminado' | 'Activo';
  fechaCreacion?: Date;
  fechaFinalizacion!: Date;
  prioridad!: 'Baja' | 'Media' | 'Alta';
  asignadoA!: string;
  nombreConsultor?: string;
  idConsultor?: string;

  constructor(props: Partial<ITarea>) {
    Object.assign(this, props);
  }
}