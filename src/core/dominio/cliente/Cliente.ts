import { ICliente } from './ICliente';

export class Cliente implements ICliente {
    idCliente?: string;
    nombre?: string;
    identificacion!: string;
    email!: string;
    telefono!: string | null; 
    estado?: "Activo" | "Eliminado";

    constructor(props: Partial<ICliente>)
    {
        Object.assign(this,props);
    }
}