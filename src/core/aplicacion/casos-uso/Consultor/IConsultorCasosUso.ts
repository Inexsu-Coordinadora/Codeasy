import { IConsultor } from "../../../dominio/consultor/IConsultor.js";
import { Consultor } from "../../../dominio/consultor/Consultor.js"; 


export interface IConsultorRepositorio {
  registrarConsultor(consultor: Consultor): Promise<IConsultor>;
  listarTodosConsultores(): Promise<IConsultor[]>;
  obtenerConsultorPorId(idConsultor: string): Promise<IConsultor | null>;
  actualizarConsultor(idConsultor: string, datosPlato: IConsultor): Promise<IConsultor>;
  eliminarConsultor(idConsultor: string): Promise<void>;
  buscarPorCorreoOIdentificacion(correo: string, identificacion: string): Promise<IConsultor | null>;

}