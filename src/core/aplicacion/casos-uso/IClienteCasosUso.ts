import { ICliente } from '../../dominio/cliente/ICliente';
export interface IClientesCasosUso {
    obtenerClientes(limite?: number): Promise<ICliente[]>;
    obtenerClientePorId(idCliente: number): Promise<ICliente | null>;
    registrarCliente(
        data: Omit<ICliente, 'idCliente' | 'estatus'>
    ): Promise<number>;
    actualizarCliente(idCliente: number, data: Partial<ICliente>): Promise<ICliente | null>;
    eliminarCliente(idCliente: number): Promise<void>;
}



