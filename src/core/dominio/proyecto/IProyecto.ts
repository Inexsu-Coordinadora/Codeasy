export interface IProyecto {
  idProyecto: string | undefined,
  nombre: string;
  descripcion: string;
  estado?: 'Creado' | 'En proceso' | 'Finalizado'; 
  estatus?: 'Activo' | 'Eliminado';
  id_cliente: number;
  fecha_inicio: Date;
  fecha_entrega: Date;
  fecha_creacion?: Date; 
}
