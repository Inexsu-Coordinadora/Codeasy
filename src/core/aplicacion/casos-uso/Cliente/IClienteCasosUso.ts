import { ICliente } from '../../../dominio/cliente/ICliente';
export interface IClientesCasosUso {
    obtenerClientes(limite?: string): Promise<ICliente[]>;
    obtenerClientePorId(idCliente: string): Promise<ICliente | null>;
    registrarCliente(
        data: Omit<ICliente, 'idCliente' | 'estatus'>
    ): Promise<ICliente>;
    actualizarCliente(idCliente: string, data: Partial<ICliente>): Promise<ICliente | null>;
    eliminarCliente(idCliente: string): Promise<void>;
}



