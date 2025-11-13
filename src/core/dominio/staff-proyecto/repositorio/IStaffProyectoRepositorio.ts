import type { IStaffProyecto } from "../IStaffProyecto";

export interface IStaffProyectoRepositorio {
  // Crear una nueva asignación (consultor ↔ proyecto)
  crearAsignacion(asignacion: IStaffProyecto): Promise<IStaffProyecto>;

  // Verificar si ya existe una asignación igual (consultor, proyecto, rol)
  buscarDuplicado(
    id_consultor: string,
    id_proyecto: string,
    id_rol?: string
  ): Promise<boolean>;

  // Obtener todas las asignaciones de un consultor (para validar dedicación)
  obtenerAsignacionesPorConsultor(
    id_consultor: string
  ): Promise<IStaffProyecto[]>;
}
