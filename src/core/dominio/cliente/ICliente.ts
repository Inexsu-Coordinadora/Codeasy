export type EstadoCliente = 'Activo' | 'Eliminado';

export interface ICliente {
    id_cliente?: string;
    nombre: string;
    identificacion: string;
    email: string;         
    telefono: string | null;
    estado: EstadoCliente; 
}




