import { ICliente } from '../ICliente'; 
import { Pool } from 'pg';

export interface IClienteRepositorio {

    // Operaciones CRUD
    registarCliente(datosCliente: ICliente): Promise<ICliente>;
    buscarTodosCliente(): Promise<ICliente[]>;
    buscarPorIdCliente(idCliente: string): Promise<ICliente | null>; 
    ActualizarCliente(idCliente: string, datosCliente: ICliente): Promise<ICliente | null>;
    buscarPorIdentificacionCliente(idCliente: string): Promise<ICliente | null>;
    EliminarCliente(idCliente: string): Promise<void>;

}