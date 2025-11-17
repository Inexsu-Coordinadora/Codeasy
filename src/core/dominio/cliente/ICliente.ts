export interface ICliente {
    idCliente?: string;
    nombre: string;
    identificacion: string;
    email: string;         
    telefono: string | null;
    estado?: "Activo" | "Eliminado";
}