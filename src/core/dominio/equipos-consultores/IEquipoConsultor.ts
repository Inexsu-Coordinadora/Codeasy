export interface IEquipoConsultor {
  idEquipoConsultores: string | undefined;
  idConsultor: string;
  nombreConsultor?: string;
  idEquipoProyecto: string;
  nombreEquipoProyecto?: string;
  idRol: string;
  nombreRol?: string;
  porcentajeDedicacion: number;
  fechaInicio: Date;
  fechaFin: Date;
<<<<<<< HEAD
}
=======
  estado: "Activo" | "Eliminado";
  idProyecto?: string;
  nombreProyecto?: string;
}
>>>>>>> feature/asignacion-consultores-proyectov2
