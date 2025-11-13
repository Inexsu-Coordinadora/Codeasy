import { ICliente } from '../ICliente'; 
import { Pool } from 'pg';

export interface IClienteRepositorio {

     crearCliente(datosCliente: ICliente): Promise<ICliente>;
    buscarTodosCliente(): Promise<ICliente[]>;
    buscarPorIdCliente(id_cliente: string): Promise<ICliente | null>; 
    ActualizarCliente(id_cliente: string, datosCliente: ICliente): Promise<ICliente | null>;
    buscarPorIdentificacionCliente(id_cliente: string): Promise<ICliente | null>;
    EliminarCliente(id_cliente: string): Promise<void>;
    obtenerClientePorId(id_cliente: string): Promise<ICliente | null>;

}


