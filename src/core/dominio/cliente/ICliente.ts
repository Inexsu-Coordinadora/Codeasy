export type EstatusCliente = 'Activo' | 'Eliminado';

export interface ICliente {
    idCliente?: string;
    nombre: string;
    identificacion: string;
    email: string;         
    telefono: string | null;
    estatus: EstatusCliente; 
}




