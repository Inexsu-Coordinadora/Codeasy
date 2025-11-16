import { IConsultor } from "./IConsultor";

export class Consultor implements IConsultor {
  idConsultor?: string;
  nombre!: string;
  identificacion!: string;
  correo!: string;
  telefono!: string;
  especialidad?: string | null;
  nivelExperiencia!: "Junior" | "Semi-Senior" | "Senior" | "Experto";
  estado?: "Activo" | "Eliminado";
 

  constructor(props: Partial<IConsultor>) {
    Object.assign(this, props);
  }
}
