import type { IRol } from "./IRol.js";

export class Rol implements IRol {
  constructor(
    public idRol: string | undefined,
    public nombreRol: string,
    public descripcion: string,
    public estado: "Activo" | "Eliminado" = "Activo"
  ) { }
}
