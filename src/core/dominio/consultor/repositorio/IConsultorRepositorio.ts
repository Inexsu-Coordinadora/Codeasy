import  { Consultor } from "../Consultor";
import  { IConsultor} from "../IConsultor";

export interface IConsultorRepositorio {
  registrarConsultor(consultor: Consultor): Promise<IConsultor>; 
  listarTodosConsultores(): Promise<IConsultor[]>;
  obtenerConsultorPorId(idConsultor: string): Promise<IConsultor | null>;
  actualizarConsultor(idConsultor: string, datosConsultor: IConsultor): Promise<IConsultor>; 
  eliminarConsultor(idConsultor: string): Promise<void>; 
 buscarPorCorreoOIdentificacion(correo: string, identificacion: string): Promise<IConsultor | null>;
 
}