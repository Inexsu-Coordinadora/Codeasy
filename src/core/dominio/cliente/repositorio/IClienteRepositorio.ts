import { ICliente } from '../ICliente'; 
import { Pool } from 'pg';

export interface IClienteRepositorio {

    // Operaciones CRUD
     crearCliente(datosCliente: ICliente): Promise<ICliente>;
    buscarTodosCliente(): Promise<ICliente[]>;
    buscarPorIdCliente(id_cliente: number): Promise<ICliente | null>; 
    ActualizarCliente(id_cliente: number, datosCliente: ICliente): Promise<ICliente | null>;
    buscarPorIdentificacionCliente(id_cliente: string): Promise<ICliente | null>;
    EliminarCliente(id_cliente: number): Promise<void>;
    obtenerClientePorId(id_cliente: number): Promise<ICliente | null>;

}


