export interface IConsultor {
  idConsultor?: string;
  nombre: string;
  identificacion: string;
  correo: string;
  telefono: string | null;
  especialidad?: string | null;
  nivelexperiencia: "Junior" | "Semi-Senior" | "Senior" | "Experto";
  disponibilidad: "Disponible" | "No disponible";
  estado?: "Activo" | "Eliminado";
}