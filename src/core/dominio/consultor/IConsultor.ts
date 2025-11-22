export interface IConsultor {
  idConsultor?: string;
  nombre: string;
  identificacion: string;
  correo: string;
  telefono?: string | null;
  especialidad?: string | null;
  nivelExperiencia?: "Junior" | "Semi-Senior" | "Senior" | "Experto";
  estado?: "Activo" | "Eliminado";
}
