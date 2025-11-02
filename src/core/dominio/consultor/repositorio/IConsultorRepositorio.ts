import  { Consultor } from "../Consultor.js";
import  { IConsultor} from "../IConsultor.js";
import { Pool } from "pg";

export interface IConsultorRepositorio {
  registrarConsultor(consultor: Consultor): Promise<IConsultor>; 
  listarTodosConsultores(): Promise<IConsultor[]>;
  obtenerConsultorPorId(idConsultor: number): Promise<IConsultor | null>;
  actualizarConsultor(idConsultor: number, datosConsultor: IConsultor): Promise<IConsultor>; 
  eliminarConsultor(idConsultor: number): Promise<void>; 
 buscarPorCorreoOIdentificacion(correo: string, identificacion: string): Promise<IConsultor | null>;
}