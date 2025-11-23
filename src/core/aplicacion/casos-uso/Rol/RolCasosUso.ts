import type { IRol } from "../../../dominio/rol/IRol";
import { Rol } from "../../../dominio/rol/Rol";
import type { IRolRepositorio } from "../../../dominio/rol/repositorio/IRolRepositorio";
import { AppError } from "../../../../common/middlewares/AppError";

export class RolCasosUso {
  constructor(private rolRepositorio: IRolRepositorio) {}

    // CREAR ROL
    async crearRol(datos: { nombreRol: string; descripcion: string }): Promise<IRol> {
        // Validar duplicidad por nombre (solo roles activos)
        const roles = await this.rolRepositorio.listarRoles();

        const existe = roles.some(
        (r: IRol) =>
            r.nombreRol.trim().toLowerCase() === datos.nombreRol.trim().toLowerCase() &&
            r.estado === "Activo"
        );

        if (existe) {
        throw new AppError("Ya existe un rol activo con ese nombre.");
        }

        const nuevoRol = new Rol(
        undefined,
        datos.nombreRol,
        datos.descripcion,
        "Activo"
        );

        return await this.rolRepositorio.crearRol(nuevoRol);
    }

    // LISTAR ROLES ACTIVOS
    async listarRoles(): Promise<IRol[]> {
        return await this.rolRepositorio.listarRoles();
    }

    // OBTENER ROL POR ID
    async obtenerRolPorId(idRol: string): Promise<IRol | null> {
        const rol = await this.rolRepositorio.obtenerRolPorId(idRol);

        if (!rol || rol.estado === "Eliminado") {
        throw new AppError(`No se encontró el rol con ID ${idRol}`);
        }

        return rol;
    }

    // ACTUALIZAR ROL
    async actualizarRol(
    idRol: string,
    datos: Partial<Pick<IRol, "nombreRol" | "descripcion" | "estado">>
    ): Promise<IRol> {

        const rolExistente = await this.rolRepositorio.obtenerRolPorId(idRol);

        if (!rolExistente || rolExistente.estado === "Eliminado") {
        throw new AppError(`No se encontró el rol con ID ${idRol}`);
        }

        // Validar duplicidad si el nombre cambia
        if (datos.nombreRol) {
        const roles = await this.rolRepositorio.listarRoles();

        const duplicado = roles.some(
            (r: IRol) =>
            r.idRol !== idRol &&
            r.nombreRol.trim().toLowerCase() === datos.nombreRol!.trim().toLowerCase() &&
            r.estado === "Activo"
        );

        if (duplicado) {
            throw new AppError("Ya existe otro rol activo con ese nombre.");
        }
        }

        // Validar estado si se envía
        if (datos.estado && !["Activo", "Eliminado"].includes(datos.estado)) {
        throw new AppError("El estado del rol no es válido.");
        }

        const rolActualizado = { ...rolExistente, ...datos };

        return await this.rolRepositorio.actualizarRol(idRol, rolActualizado);
    }

    // ELIMINAR ROL (LÓGICO)
    async eliminarRol(idRol: string): Promise<IRol> {
        const rol = await this.rolRepositorio.obtenerRolPorId(idRol);

        if (!rol || rol.estado === "Eliminado") {
        throw new AppError(`No se encontró el rol con ID ${idRol}`);
        }

        return await this.rolRepositorio.eliminarRol(idRol);
    }
}
