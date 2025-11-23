import type { IRol } from "../IRol.js";
import { Rol } from "../Rol.js";

export interface IRolRepositorio {
  crearRol(rol: Rol): Promise<IRol>;
  listarRoles(): Promise<IRol[]>;
  obtenerRolPorId(idRol: string): Promise<IRol | null>;
  actualizarRol(idRol: string, datos: Partial<IRol>): Promise<IRol>;
  eliminarRol(idRol: string): Promise<IRol>;
}
