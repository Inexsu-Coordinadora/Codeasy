export interface IConsultor {
  id_consultor?: string;
  nombre: string;
  identificacion: string;
  correo: string;
  telefono: string | null;
  especialidad?: string | null;
  nivel_experiencia: "Junior" | "Semi-Senior" | "Senior" | "Experto";
  disponibilidad: "Disponible" | "No disponible";
  estado?: "Activo" | "Eliminado";
}