import { ICliente } from '../../../dominio/cliente/ICliente.js';
export interface IClientesCasosUso {
    obtenerClientes(limite?: string): Promise<ICliente[]>;
    obtenerClientePorId(id_cliente: string): Promise<ICliente | null>;
    registrarCliente(
        data: Omit<ICliente, 'id_cliente' | 'estado'>
    ): Promise<string>;
    actualizarCliente(id_cliente: string, data: Partial<ICliente>): Promise<ICliente | null>;
    eliminarCliente(id_cliente: string): Promise<void>;
}



