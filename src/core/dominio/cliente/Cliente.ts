import { ICliente, EstatusCliente } from './ICliente';

export class Cliente implements ICliente {
    idCliente?: string;
    nombre!: string;
    identificacion!: string;
    email!: string;
    telefono!: string | null; 
    estatus: EstatusCliente = 'Activo'; 

    constructor(props: Partial<ICliente>)
    {
        Object.assign(this,props);
    }
}