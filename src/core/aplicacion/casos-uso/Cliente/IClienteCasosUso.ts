import { ICliente } from '../../../dominio/cliente/ICliente';

export interface IClientesCasosUso {

    obtenerClientes(limite?: number): Promise<ICliente[]>;

    buscarPorIdentificacionCliente(
        identificacion: string,
        email: string
    ): Promise<ICliente | null>;

    registrarCliente(
        data: Omit<ICliente, 'idCliente' | 'estado'>
    ): Promise<ICliente>;

    actualizarCliente(
        idCliente: string,
        data: Partial<ICliente>
    ): Promise<ICliente | null>;

    eliminarCliente(idCliente: string): Promise<void>;

    buscarPorIdCliente(idCliente: string): Promise<ICliente | null>;
}