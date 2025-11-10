export interface IParteHora {
  id_parte_hora?: string;
  id_proyecto: string; 
  id_consultor: string; 
  fecha: Date;
  cantidad_horas: number; 
  descripcion: string;
  estado?: 'Activo' | 'Eliminado';
}

