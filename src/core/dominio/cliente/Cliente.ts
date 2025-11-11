import { ICliente, EstadoCliente } from './ICliente';

export class Cliente implements ICliente {
    idCliente?: number;
    nombre!: string;
    identificacion!: string;
    email!: string;
    telefono!: string | null; 
    estado: EstadoCliente = 'Activo'; 

    constructor(props: Partial<ICliente>)
    {
        Object.assign(this,props);
    }
}