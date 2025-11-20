import { ITarea } from '../../../dominio/tarea/ITarea.js';
import { Tarea } from '../../../dominio/tarea/Tarea.js';

export interface ITareaCasosUso {
  registrarTarea(tarea: Tarea): Promise<ITarea>;
  listarTodasTareas(): Promise<ITarea[]>;
  obtenerTareaPorId(idTarea: string): Promise<ITarea | null>;
  actualizarTarea(idTarea: string, datosTarea: ITarea): Promise<ITarea>;
  eliminarTarea(idTarea: string): Promise<void>;
}
