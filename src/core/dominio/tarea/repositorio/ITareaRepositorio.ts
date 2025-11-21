import { ITarea } from '../ITarea.js';
import { Tarea } from '../Tarea.js';

export interface ITareaRepositorio {
  registrarTarea(tarea: Tarea): Promise<ITarea>;
  listarTodasTareas(): Promise<ITarea[]>;
  obtenerTareaPorId(idTarea: string): Promise<ITarea | null>;
  actualizarTarea(idTarea: string, datosTarea: Partial<ITarea> | null): Promise<ITarea| null>;
  eliminarTarea(idTarea: string): Promise<void>;
}
