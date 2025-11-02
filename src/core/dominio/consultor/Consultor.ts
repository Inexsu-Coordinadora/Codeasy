import { IConsultor } from "./IConsultor.js";

export class Consultor implements IConsultor {
  idConsultor?: number;
  nombre!: string;
  identificacion!: string;
  correo!: string;
  telefono!: string;
  especialidad?: string | null;
  nivelexperiencia!: "Junior" | "Semi-Senior" | "Senior" | "Experto";
  disponibilidad!: "Disponible" | "No disponible";
  estado?: "Activo" | "Eliminado";
  contrasena!: string;

  constructor(props: Partial<IConsultor>) {
    Object.assign(this, props);
  }
}
