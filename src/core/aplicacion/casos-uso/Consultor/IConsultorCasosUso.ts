import { IConsultor } from "../../../dominio/consultor/IConsultor";
import { Consultor } from "../../../dominio/consultor/Consultor"; 


export interface IConsultorRepositorio {
  registrarConsultor(consultor: Consultor): Promise<IConsultor>;
  listarTodosConsultores(): Promise<IConsultor[]>;
  obtenerConsultorPorId(id_consultor: string): Promise<IConsultor | null>;
  actualizarConsultor(id_consultor: string, datosConsultor: IConsultor): Promise<IConsultor>;
  eliminarConsultor(id_consultor: string): Promise<void>;
  buscarPorCorreoOIdentificacion(correo: string, identificacion: string): Promise<IConsultor | null>;

}
