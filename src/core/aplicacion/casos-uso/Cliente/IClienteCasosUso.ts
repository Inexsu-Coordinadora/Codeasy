import { ICliente } from '../../../dominio/cliente/ICliente.js';
export interface IClientesCasosUso {
    obtenerClientes(limite?: number): Promise<ICliente[]>;
    obtenerClientePorId(idCliente: number): Promise<ICliente | null>;
    registrarCliente(
        data: Omit<ICliente, 'idCliente' | 'estado'>
    ): Promise<number>;
    actualizarCliente(idCliente: number, data: Partial<ICliente>): Promise<ICliente | null>;
    eliminarCliente(idCliente: number): Promise<void>;
}



