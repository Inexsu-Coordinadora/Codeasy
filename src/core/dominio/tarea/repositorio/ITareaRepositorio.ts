import { ITarea } from '../ITarea';
import { Tarea } from '../Tarea';

export interface ITareaRepositorio {
  registrarTarea(tarea: Tarea): Promise<ITarea>;
  listarTodasTareas(): Promise<ITarea[]>;
  obtenerTareaPorId(idTarea: string): Promise<ITarea | null>;
  actualizarTarea(idTarea: string, datosTarea: ITarea): Promise<ITarea>;
  eliminarTarea(idTarea: string): Promise<void>;
}
