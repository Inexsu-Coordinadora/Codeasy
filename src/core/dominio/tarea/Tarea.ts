import { ITarea } from "./ITarea";

export class Tarea implements ITarea {
  // Required by ITarea
  idTarea?: string;
  titulo!: string;
  descripcion!: string;
  estadoTarea!: 'Creada' | 'En Proceso' | 'Finalizada';
  estatus!: 'Eliminado' | 'Activo';
  fechaCreacion?: Date;
  fechaFinalizacion!: Date;
  prioridad!: 'Baja' | 'Media' | 'Alta';
  asignadoA!: string;

  constructor(props: Partial<ITarea>) {
    Object.assign(this, props);
  }
}