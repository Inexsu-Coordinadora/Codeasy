import type { IRol } from "../../../dominio/rol/IRol.js";

export interface IRolCasosUso {
    crearRol(datos: { nombreRol: string; descripcion: string }): Promise<IRol>;
    listarRoles(): Promise<IRol[]>;
    obtenerRolPorId(idRol: string): Promise<IRol | null>;
    actualizarRol(idRol: string, datos: Partial<Pick<IRol, "nombreRol" | "descripcion" | "estado">>): Promise<IRol>;
    eliminarRol(idRol: string): Promise<IRol>;
}
