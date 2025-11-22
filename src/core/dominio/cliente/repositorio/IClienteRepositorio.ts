import { ICliente } from '../ICliente';

export interface IClienteRepositorio {

    registrarCliente(datosCliente: ICliente): Promise<ICliente>;

    buscarPorIdentificacionCliente(
        identificacion: string,
        email: string
    ): Promise<ICliente | null>;

    buscarPorIdCliente(idCliente: string): Promise<ICliente | null>;

    actualizarCliente(
        idCliente: string,
        datosCliente: Partial<ICliente>
    ): Promise<ICliente | null>;

    eliminarCliente(idCliente: string): Promise<void>;

    obtenerClientes(limite?: number): Promise<ICliente[]>;
}
