import { ICliente, EstatusCliente } from './ICliente';

export class Cliente implements ICliente {
    idCliente?: number;
    nombre!: string;
    identificacion!: string;
    email!: string;
    telefono!: string | null; 
    estado: EstatusCliente = 'Activo'; 

    constructor(props: Partial<ICliente>)
    {
        Object.assign(this,props);
    }
}