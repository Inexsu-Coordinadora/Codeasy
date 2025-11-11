import { ICliente } from '../ICliente'; 
import { Pool } from 'pg';

export interface IClienteRepositorio {

    // Operaciones CRUD
    crearCliente(datosCliente: ICliente): Promise<string>;
    buscarTodosCliente(): Promise<ICliente[]>;
    buscarPorIdCliente(idCliente: number): Promise<ICliente | null>; 
    ActualizarCliente(idCliente: number, datosCliente: ICliente): Promise<ICliente | null>;
    buscarPorIdentificacionCliente(idCliente: string): Promise<ICliente | null>;
    EliminarCliente(idCliente: number): Promise<void>;
    obtenerClientePorId(idCliente: number): Promise<ICliente | null>;

}


