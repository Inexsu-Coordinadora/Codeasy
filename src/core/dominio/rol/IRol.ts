export interface IRol {
  idRol: string | undefined;       
  nombreRol: string;               
  descripcion: string;             
  estado: "Activo" | "Eliminado";
}
