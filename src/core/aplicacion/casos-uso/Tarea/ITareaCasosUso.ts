import { ITarea } from '../../../dominio/tarea/ITarea.js';
import { Tarea } from '../../../dominio/tarea/Tarea.js';

export interface ITareaRepositorio {
  registrarTarea(tarea: Tarea): Promise<ITarea>;
  listarTodasTareas(): Promise<ITarea[]>;
  obtenerTareaPorId(idTarea: number): Promise<ITarea | null>;
  actualizarTarea(idTarea: number, datosTarea: ITarea): Promise<ITarea>;
  eliminarTarea(idTarea: number): Promise<void>;
}
