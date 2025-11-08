import { ITarea } from '../ITarea';
import { Tarea } from '../Tarea';

export interface ITareaRepositorio {
  registrarTarea(tarea: Tarea): Promise<ITarea>;
  listarTodasTareas(): Promise<ITarea[]>;
  obtenerTareaPorId(idTarea: number): Promise<ITarea | null>;
  actualizarTarea(idTarea: number, datosTarea: ITarea): Promise<ITarea>;
  eliminarTarea(idTarea: number): Promise<void>;
}
