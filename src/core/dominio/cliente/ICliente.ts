export type EstadoCliente = 'Activo' | 'Eliminado';

export interface ICliente {
    idCliente?: number;
    nombre: string;
    identificacion: string;
    email: string;         
    telefono: string | null;
    estado: EstadoCliente; 
}




